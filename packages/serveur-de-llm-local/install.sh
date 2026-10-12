#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INSTALL_USER="${INSTALL_USER:-$(logname 2>/dev/null || whoami)}"
INSTALL_HOME="$(getent passwd "$INSTALL_USER" | cut -d: -f6)"
INSTALL_DIR="${INSTALL_DIR:-$SCRIPT_DIR}"
DOMAIN="${DOMAIN:-}"
CERTBOT_EMAIL="${CERTBOT_EMAIL:-}"
APP_PORT="${APP_PORT:-3001}"
ENABLE_HTTPS="${ENABLE_HTTPS:-auto}"
ENABLE_FIREWALL="${ENABLE_FIREWALL:-yes}"
SKIP_MODEL_DOWNLOAD="${SKIP_MODEL_DOWNLOAD:-no}"
NPM_PACKAGES="${NPM_PACKAGES:-/usr/local}"

usage() {
  cat <<'EOF'
Usage: sudo bash install.sh [options]

Environment variables:
  DOMAIN              Public hostname (e.g. ai.example.com)
  CERTBOT_EMAIL       Email for Let's Encrypt notifications
  INSTALL_USER        Unix user running the service (default: login user)
  INSTALL_DIR         Application directory (default: repository root)
  APP_PORT            Local port for the Node.js app (default: 3001)
  ENABLE_HTTPS        auto|yes|no — obtain TLS certificate when domain is set
  ENABLE_FIREWALL     yes|no — install iptables rules for SSH/HTTP/HTTPS
  SKIP_MODEL_DOWNLOAD yes|no — skip the initial Hugging Face model download
  CLIENT_SECRET       HMAC secret (generated automatically if unset)

Examples:
  sudo DOMAIN=ai.example.com CERTBOT_EMAIL=admin@example.com bash install.sh
  sudo bash install.sh
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

if [[ "$(id -u)" -ne 0 ]]; then
  echo "This script must be run as root (use sudo)." >&2
  exit 1
fi

if [[ -z "$DOMAIN" ]]; then
  read -r -p "Public domain name (e.g. ai.example.com): " DOMAIN
fi

if [[ -z "$DOMAIN" ]]; then
  echo "A domain name is required for production deployment." >&2
  exit 1
fi

if [[ -z "$CERTBOT_EMAIL" && "$ENABLE_HTTPS" != "no" ]]; then
  read -r -p "Email for Let's Encrypt (optional, press Enter to skip HTTPS): " CERTBOT_EMAIL
fi

if [[ -z "${CLIENT_SECRET:-}" ]]; then
  CLIENT_SECRET="$(openssl rand -base64 32 | tr -d '/+=' | head -c 32)"
fi

echo -e "\e[96m=== AI Server installation ===\e[39m"
echo "User:    $INSTALL_USER"
echo "Domain:  $DOMAIN"
echo "Install: $INSTALL_DIR"
echo "Port:    $APP_PORT (local, behind nginx)"

echo -e "\e[96mUpdate system packages\e[39m"
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get -y dist-upgrade

echo -e "\e[96mInstall base packages\e[39m"
apt-get install -y \
  git curl ca-certificates \
  build-essential \
  nginx \
  fail2ban

echo -e "\e[96mInstall Node.js\e[39m"
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
  apt-get install -y nodejs
fi

mkdir -p "$NPM_PACKAGES"
chown -R "$INSTALL_USER:$INSTALL_USER" "$NPM_PACKAGES"
chmod -R g+rws "$NPM_PACKAGES"
npm config -g set prefix "$NPM_PACKAGES"

if ! grep -q 'NPM_PACKAGES=' /etc/init.d/node-path.sh 2>/dev/null; then
  cat > /etc/init.d/node-path.sh <<EOF
export PATH="\$PATH:$NPM_PACKAGES/bin"
export MANPATH="\${MANPATH-\$(manpath)}:$NPM_PACKAGES/share/man"
EOF
  chmod +x /etc/init.d/node-path.sh
  if ! grep -q 'node-path.sh' /etc/bash.bashrc; then
    sed -i "1i# Make npm available for all scripts\nsource /etc/init.d/node-path.sh" /etc/bash.bashrc
  fi
fi

if ! grep -q 'NODE_OPTIONS="--max-old-space-size=4096"' /etc/environment; then
  echo 'NODE_OPTIONS="--max-old-space-size=4096"' >> /etc/environment
fi

echo -e "\e[96mConfigure fail2ban\e[39m"
mkdir -p /etc/fail2ban/jail.d
if ! grep -q "^ignoreip = 127.0.0.1" /etc/fail2ban/jail.d/ai-server.conf 2>/dev/null; then
  cat > /etc/fail2ban/jail.d/ai-server.conf <<'EOF'
[DEFAULT]
ignoreip = 127.0.0.1
findtime = 3600
bantime = 86400
maxretry = 7

[sshd]
enabled = true
EOF
fi
systemctl enable fail2ban
systemctl restart fail2ban

echo -e "\e[96mConfigure swap (4 GiB)\e[39m"
if ! swapon --show | grep -q '/swapfile'; then
  fallocate -l 4G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  if ! grep -q '/swapfile none swap sw 0 0' /etc/fstab; then
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
  fi
else
  echo "Swap file already configured."
fi

chown -R "$INSTALL_USER:$INSTALL_USER" "$INSTALL_DIR"

echo -e "\e[96mWrite application configuration\e[39m"
cat > "$INSTALL_DIR/.env" <<EOF
NODE_ENV=production
PORT=$APP_PORT
LISTEN_HOST=127.0.0.1
CLIENT_SECRET=$CLIENT_SECRET
EOF
chown "$INSTALL_USER:$INSTALL_USER" "$INSTALL_DIR/.env"
chmod 600 "$INSTALL_DIR/.env"

sed \
  -e "s|@INSTALL_DIR@|$INSTALL_DIR|g" \
  -e "s|@PORT@|$APP_PORT|g" \
  "$SCRIPT_DIR/config/ecosystem.config.js" \
  > "$INSTALL_DIR/ecosystem.config.js"
chown "$INSTALL_USER:$INSTALL_USER" "$INSTALL_DIR/ecosystem.config.js"

echo -e "\e[96mInstall Node.js dependencies\e[39m"
sudo -u "$INSTALL_USER" bash <<INSTALL
set -euo pipefail
source /etc/init.d/node-path.sh
cd "$INSTALL_DIR"
npm install
INSTALL

if [[ "$SKIP_MODEL_DOWNLOAD" != "yes" ]]; then
  echo -e "\e[96mDownload language model from Hugging Face\e[39m"
  sudo -u "$INSTALL_USER" bash <<MODELS
set -euo pipefail
source /etc/init.d/node-path.sh
cd "$INSTALL_DIR"
npm run downloadModel
MODELS
fi

echo -e "\e[96mConfigure nginx\e[39m"
sed \
  -e "s|@DOMAIN@|$DOMAIN|g" \
  -e "s|@PORT@|$APP_PORT|g" \
  "$SCRIPT_DIR/config/nginx.conf" \
  > /etc/nginx/sites-available/ai-server.conf

ln -sf /etc/nginx/sites-available/ai-server.conf /etc/nginx/sites-enabled/ai-server.conf
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl enable nginx

echo -e "\e[96mInstall and start PM2\e[39m"
sudo -u "$INSTALL_USER" bash <<PM2
set -euo pipefail
source /etc/init.d/node-path.sh
npm install -g pm2
cd "$INSTALL_DIR"
pm2 delete ai-server 2>/dev/null || true
pm2 start ecosystem.config.js
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 1000K
pm2 set pm2-logrotate:retain 5
pm2 save
PM2

env PATH="$PATH:/usr/bin" "$NPM_PACKAGES/bin/pm2" startup systemd -u "$INSTALL_USER" --hp "$INSTALL_HOME"
sudo -u "$INSTALL_USER" bash -c "source /etc/init.d/node-path.sh && pm2 save"

systemctl restart nginx

if [[ "$ENABLE_HTTPS" != "no" && -n "$CERTBOT_EMAIL" ]]; then
  if [[ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]]; then
    echo -e "\e[96mEnable HTTPS with Let's Encrypt\e[39m"
    apt-get install -y certbot python3-certbot-nginx
    certbot --nginx \
      --non-interactive \
      --agree-tos \
      --email "$CERTBOT_EMAIL" \
      --domains "$DOMAIN"
    systemctl reload nginx
  else
    echo "TLS certificate already present for $DOMAIN."
  fi
elif [[ "$ENABLE_HTTPS" != "no" && -z "$CERTBOT_EMAIL" ]]; then
  echo -e "\e[93mHTTPS skipped: set CERTBOT_EMAIL to obtain a certificate.\e[39m"
fi

if [[ "$ENABLE_FIREWALL" == "yes" ]]; then
  echo -e "\e[96mConfigure firewall\e[39m"
  install -m 0755 "$SCRIPT_DIR/scripts/firewall" /usr/local/bin/ai-server-firewall

  cat > /etc/systemd/system/ai-server-firewall.service <<'EOF'
[Unit]
Description=AI Server Firewall Rules
DefaultDependencies=no
Before=network-pre.target
Wants=network-pre.target

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/usr/local/bin/ai-server-firewall
ExecStop=/bin/sh -c "iptables -F; iptables -X; iptables -P INPUT ACCEPT; iptables -P FORWARD ACCEPT; iptables -P OUTPUT ACCEPT"

[Install]
WantedBy=multi-user.target
EOF

  systemctl daemon-reload
  systemctl enable ai-server-firewall.service
  systemctl start ai-server-firewall.service
fi

echo -e "\e[96mInstallation complete\e[39m"
echo ""
echo "Domain:        https://$DOMAIN"
echo "CLIENT_SECRET: $CLIENT_SECRET"
echo "(stored in $INSTALL_DIR/.env)"
echo ""
echo "Useful commands:"
echo "  sudo systemctl status nginx"
echo "  sudo -u $INSTALL_USER bash -c 'source /etc/init.d/node-path.sh && pm2 status'"
echo "  sudo -u $INSTALL_USER bash -c 'source /etc/init.d/node-path.sh && pm2 logs ai-server'"
echo "  sudo -u $INSTALL_USER bash -c 'source /etc/init.d/node-path.sh && pm2 restart ai-server'"
