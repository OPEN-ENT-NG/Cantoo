#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INSTALL_USER="${INSTALL_USER:-$(logname 2>/dev/null || whoami)}"
INSTALL_HOME="$(getent passwd "$INSTALL_USER" | cut -d: -f6)"
LIBRE_TRANSLATE_DIR="${LIBRE_TRANSLATE_DIR:-$INSTALL_HOME/LibreTranslate}"
DOMAIN="${DOMAIN:-}"
CERTBOT_EMAIL="${CERTBOT_EMAIL:-}"
ENABLE_HTTPS="${ENABLE_HTTPS:-auto}"
ENABLE_FIREWALL="${ENABLE_FIREWALL:-yes}"
SKIP_MODEL_DOWNLOAD="${SKIP_MODEL_DOWNLOAD:-no}"

usage() {
  cat <<'EOF'
Usage: sudo bash install.sh [options]

Environment variables:
  DOMAIN              Public hostname (e.g. translate.example.com)
  CERTBOT_EMAIL       Email for Let's Encrypt notifications
  INSTALL_USER        Unix user running LibreTranslate (default: login user)
  LIBRE_TRANSLATE_DIR Install path (default: ~/LibreTranslate)
  ENABLE_HTTPS        auto|yes|no — obtain TLS certificate when domain is set
  ENABLE_FIREWALL     yes|no — install iptables rules for SSH/HTTP/HTTPS
  SKIP_MODEL_DOWNLOAD yes|no — skip the initial language model download

Examples:
  sudo DOMAIN=translate.example.com CERTBOT_EMAIL=admin@example.com bash install.sh
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
  read -r -p "Public domain name (e.g. translate.example.com): " DOMAIN
fi

if [[ -z "$DOMAIN" ]]; then
  echo "A domain name is required for production deployment." >&2
  exit 1
fi

if [[ -z "$CERTBOT_EMAIL" && "$ENABLE_HTTPS" != "no" ]]; then
  read -r -p "Email for Let's Encrypt (optional, press Enter to skip HTTPS): " CERTBOT_EMAIL
fi

echo -e "\e[96m=== Translate Server installation ===\e[39m"
echo "User:    $INSTALL_USER"
echo "Domain:  $DOMAIN"
echo "Install: $LIBRE_TRANSLATE_DIR"

echo -e "\e[96mUpdate system packages\e[39m"
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get -y dist-upgrade

echo -e "\e[96mInstall base packages\e[39m"
apt-get install -y \
  git curl ca-certificates \
  python3 python3-virtualenv python-is-python3 python3-pip python3-dev \
  build-essential libssl-dev libffi-dev python3-setuptools \
  libicu-dev python3-icu pkg-config \
  nginx fail2ban

echo -e "\e[96mConfigure fail2ban\e[39m"
mkdir -p /etc/fail2ban/jail.d
if ! grep -q "^ignoreip = 127.0.0.1" /etc/fail2ban/jail.d/translate-server.conf 2>/dev/null; then
  cat > /etc/fail2ban/jail.d/translate-server.conf <<'EOF'
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

echo -e "\e[96mInstall LibreTranslate\e[39m"
sudo -u "$INSTALL_USER" bash <<INSTALL
set -euo pipefail
if [[ ! -d "$LIBRE_TRANSLATE_DIR/.git" ]]; then
  git clone https://github.com/LibreTranslate/LibreTranslate.git "$LIBRE_TRANSLATE_DIR"
fi
if [[ ! -d "$LIBRE_TRANSLATE_DIR/env" ]]; then
  virtualenv "$LIBRE_TRANSLATE_DIR/env"
fi
"$LIBRE_TRANSLATE_DIR/env/bin/pip" install --upgrade pip
"$LIBRE_TRANSLATE_DIR/env/bin/pip" install gunicorn 'gevent>=22' 'greenlet>=2'
"$LIBRE_TRANSLATE_DIR/env/bin/pip" install "$LIBRE_TRANSLATE_DIR/" --no-cache-dir
INSTALL

if [[ "$SKIP_MODEL_DOWNLOAD" != "yes" ]]; then
  echo -e "\e[96mDownload language models (this may take a while)\e[39m"
  sudo -u "$INSTALL_USER" bash <<MODELS
set -euo pipefail
timeout 600 "$LIBRE_TRANSLATE_DIR/env/bin/libretranslate" \
  --host 127.0.0.1 \
  --port 5000 \
  --disable-web-ui || true
MODELS
fi

echo -e "\e[96mConfigure systemd service\e[39m"
sed \
  -e "s|@INSTALL_USER@|$INSTALL_USER|g" \
  -e "s|@LIBRE_TRANSLATE_DIR@|$LIBRE_TRANSLATE_DIR|g" \
  "$SCRIPT_DIR/config/libretranslate.service" \
  > /etc/systemd/system/libretranslate.service

mkdir -p /etc/systemd/system/libretranslate.service.d
cp "$SCRIPT_DIR/config/systemd/tasks.conf" /etc/systemd/system/libretranslate.service.d/
cp "$SCRIPT_DIR/config/systemd/override.conf" /etc/systemd/system/libretranslate.service.d/

if [[ -f "$SCRIPT_DIR/config/env" && ! -f "$LIBRE_TRANSLATE_DIR/.env" ]]; then
  cp "$SCRIPT_DIR/config/env" "$LIBRE_TRANSLATE_DIR/.env"
  chown "$INSTALL_USER:$INSTALL_USER" "$LIBRE_TRANSLATE_DIR/.env"
fi

echo -e "\e[96mConfigure nginx\e[39m"
sed \
  -e "s|@DOMAIN@|$DOMAIN|g" \
  -e "s|@LIBRE_TRANSLATE_DIR@|$LIBRE_TRANSLATE_DIR|g" \
  "$SCRIPT_DIR/config/nginx.conf" \
  > /etc/nginx/sites-available/translate-server.conf

ln -sf /etc/nginx/sites-available/translate-server.conf /etc/nginx/sites-enabled/translate-server.conf
rm -f /etc/nginx/sites-enabled/default
nginx -t

echo -e "\e[96mAdd $INSTALL_USER to www-data group\e[39m"
usermod -aG www-data "$INSTALL_USER"

systemctl daemon-reload
systemctl enable libretranslate nginx
systemctl restart libretranslate
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
  install -m 0755 "$SCRIPT_DIR/scripts/firewall" /usr/local/bin/translate-server-firewall

  cat > /etc/systemd/system/translate-server-firewall.service <<'EOF'
[Unit]
Description=Translate Server Firewall Rules
DefaultDependencies=no
Before=network-pre.target
Wants=network-pre.target

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/usr/local/bin/translate-server-firewall
ExecStop=/bin/sh -c "iptables -F; iptables -X; iptables -P INPUT ACCEPT; iptables -P FORWARD ACCEPT; iptables -P OUTPUT ACCEPT"

[Install]
WantedBy=multi-user.target
EOF

  systemctl daemon-reload
  systemctl enable translate-server-firewall.service
  systemctl start translate-server-firewall.service
fi

echo -e "\e[96mInstallation complete\e[39m"
echo ""
echo "Service status:"
systemctl --no-pager status libretranslate || true
echo ""
echo "Test the API:"
echo "  curl -X POST \"https://$DOMAIN/translate\" -d q=\"Hello\" -d source=en -d target=fr"
echo ""
echo "Useful commands:"
echo "  sudo systemctl status libretranslate"
echo "  sudo systemctl restart libretranslate"
echo "  sudo journalctl -u libretranslate -f"
