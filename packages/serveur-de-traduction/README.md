# Translate Server

Serveur de traduction auto-hébergé basé sur [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate), déployé avec Gunicorn (workers gevent), Nginx et systemd.

Ce projet fournit un script d'installation reproductible pour Ubuntu (testé sur 20.04 et versions ultérieures).

## Fonctionnalités

- API de traduction compatible LibreTranslate
- Interface web désactivée (`LT_DISABLE_WEB_UI=1`)
- CORS activé pour les clients web
- Reverse proxy Nginx avec gestion des requêtes `OPTIONS`
- Workers Gunicorn gevent avec recyclage et timeouts adaptés
- Limitation des threads BLAS/OpenMP pour réduire la consommation mémoire
- HTTPS via Let's Encrypt (optionnel)
- Fail2ban et pare-feu iptables de base
- Fichier swap 4 GiB

## Prérequis

- Ubuntu 20.04 ou plus récent
- Un nom de domaine pointant vers le serveur (pour HTTPS en production)
- Accès root (`sudo`)
- Au moins 2 Go de RAM recommandés (4 Go+ conseillé selon les langues chargées)

## Installation rapide

```bash
git clone <url-du-depot> translate-server
cd translate-server
sudo DOMAIN=translate.example.com CERTBOT_EMAIL=admin@example.com bash install.sh
```

Le script peut aussi demander le domaine et l'e-mail de manière interactive :

```bash
sudo bash install.sh
```

### Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `DOMAIN` | Nom de domaine public | (demandé) |
| `CERTBOT_EMAIL` | E-mail Let's Encrypt | (demandé) |
| `INSTALL_USER` | Utilisateur Unix du service | utilisateur de connexion |
| `LIBRE_TRANSLATE_DIR` | Répertoire d'installation | `~/LibreTranslate` |
| `ENABLE_HTTPS` | `auto`, `yes` ou `no` | `auto` |
| `ENABLE_FIREWALL` | `yes` ou `no` | `yes` |
| `SKIP_MODEL_DOWNLOAD` | `yes` pour ignorer le téléchargement initial des modèles | `no` |

Exemple sans pare-feu ni téléchargement immédiat des modèles :

```bash
sudo DOMAIN=translate.example.com \
  CERTBOT_EMAIL=admin@example.com \
  SKIP_MODEL_DOWNLOAD=yes \
  ENABLE_FIREWALL=no \
  bash install.sh
```

## Vérification

```bash
sudo systemctl status libretranslate
curl -X POST "https://translate.example.com/translate" \
  -d q="Hello" -d source=en -d target=fr
```

Réponse attendue :

```json
{"translatedText":"Bonjour"}
```

## Configuration

### LibreTranslate

Copiez `config/env` vers le fichier `.env` de LibreTranslate (fait automatiquement à l'installation si absent) :

```bash
cp config/env ~/LibreTranslate/.env
```

Consultez la [documentation LibreTranslate](https://github.com/LibreTranslate/LibreTranslate#arguments) pour les options disponibles (clés API, limites de requêtes, etc.).

### Nginx et systemd

Les modèles sont dans `config/` :

- `config/nginx.conf` — reverse proxy et CORS
- `config/libretranslate.service` — unité systemd Gunicorn
- `config/systemd/` — overrides (comptage des tâches, plafond de threads)

Après modification, relancez :

```bash
sudo systemctl daemon-reload
sudo systemctl restart libretranslate
sudo nginx -t && sudo systemctl reload nginx
```

## Mise à jour de LibreTranslate

```bash
cd ~/LibreTranslate
git pull
./env/bin/pip install . --no-cache-dir
sudo systemctl restart libretranslate
```

## Architecture

```
Client → Nginx (80/443, CORS) → socket Unix → Gunicorn/gevent → LibreTranslate (Argos Translate)
```

## Licence

Ce projet est publié sous [GNU Affero General Public License v3.0](LICENSE), compatible avec la licence de [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate) (AGPL-3.0).

LibreTranslate et Argos Translate sont des logiciels distincts soumis à leurs propres licences. En installant LibreTranslate via ce script, vous acceptez également les conditions de ces projets.

## Crédits

- [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate)
- [LibreTranslate-init](https://github.com/argosopentech/LibreTranslate-init) — inspiration pour le déploiement WSGI
