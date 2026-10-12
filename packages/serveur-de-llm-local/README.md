# AI Server

Serveur API auto-hébergé pour définitions de mots et traductions, basé sur un modèle LLM local ([Qwen2.5-1.5B-Instruct](https://huggingface.co/medmekk/Qwen2.5-1.5B-Instruct.GGUF)) via [node-llama-cpp](https://github.com/withcatai/node-llama-cpp).

Ce dépôt unifie l'application Node.js, les fichiers de configuration et un script d'installation reproductible pour Ubuntu.

## Fonctionnalités

- Endpoint `/dictionary` — explication pédagogique d'un mot (avec ou sans contexte)
- Endpoint `/translate` — traduction d'une phrase via le même modèle
- HTTPS via Nginx et [Certbot](https://certbot.eff.org/) (Let's Encrypt)
- Reverse proxy Nginx avec gestion des requêtes `OPTIONS` et CORS
- Authentification HMAC en production (`X-Client-Id`, `X-Signature`, `X-Timestamp`)
- CORS activé pour les clients web
- Gestion du processus via PM2
- Fail2ban, pare-feu iptables et swap 4 Go

## Prérequis

- Ubuntu 20.04 ou plus récent
- Un nom de domaine pointant vers le serveur (ports 80 et 443 accessibles)
- Accès root (`sudo`)
- 4 Go de RAM minimum recommandés (8 Go+ conseillé)
- Espace disque : ~2 Go pour le modèle GGUF

## Installation rapide

```bash
git clone <url-du-depot> ai-server
cd ai-server
sudo DOMAIN=ai.example.com CERTBOT_EMAIL=admin@example.com bash install.sh
```

Le script peut aussi demander le domaine et l'e-mail de manière interactive :

```bash
sudo bash install.sh
```

À la fin de l'installation, le script affiche le `CLIENT_SECRET` généré (également stocké dans `.env`).

### Variables d'environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `DOMAIN` | Nom de domaine public | (demandé) |
| `CERTBOT_EMAIL` | E-mail Let's Encrypt | (demandé, optionnel) |
| `INSTALL_USER` | Utilisateur Unix du service | utilisateur de connexion |
| `INSTALL_DIR` | Répertoire d'installation | racine du dépôt |
| `APP_PORT` | Port local de l'application (derrière nginx) | `3001` |
| `CLIENT_SECRET` | Secret HMAC | généré automatiquement |
| `ENABLE_HTTPS` | `auto`, `yes` ou `no` | `auto` |
| `ENABLE_FIREWALL` | `yes` ou `no` | `yes` |
| `SKIP_MODEL_DOWNLOAD` | `yes` pour ignorer le téléchargement du modèle | `no` |

## Développement local

```bash
cp config/env.example .env
npm install
npm run downloadModel
npm start
```

Le serveur écoute sur le port 3001 en mode développement (sans HMAC ni HTTPS).

Test rapide :

```bash
npm run testDictionary
```

## API

### Authentification (production)

Chaque requête POST doit inclure :

| En-tête | Description |
|---------|-------------|
| `X-Client-Id` | Identifiant du client |
| `X-Timestamp` | Horodatage ISO 8601 (±5 min) |
| `X-Signature` | HMAC-SHA256 hexadécimal |

Chaîne signée :

```
${clientId}:${timestamp}:${query}:${body}
```

Exemple en JavaScript :

```javascript
const crypto = require('crypto');

const clientId = 'my-app';
const timestamp = new Date().toISOString();
const body = JSON.stringify({
  word: 'example',
  lang: 'english',
  answerLang: 'french'
});
const query = JSON.stringify({});

const signature = crypto
  .createHmac('sha256', CLIENT_SECRET)
  .update(`${clientId}:${timestamp}:${query}:${body}`)
  .digest('hex');

fetch('https://ai.example.com/dictionary', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Client-Id': clientId,
    'X-Timestamp': timestamp,
    'X-Signature': signature,
  },
  body,
});
```

### Content Security Policy

Ajoutez votre domaine API à la directive `connect-src` :

```
Content-Security-Policy: connect-src 'self' https://ai.example.com;
```

### Endpoints

**POST `/dictionary`**

```json
{
  "word": "serendipity",
  "lang": "english",
  "phrase": "Finding this book was pure serendipity.",
  "answerLang": "french"
}
```

**POST `/translate`**

```json
{
  "srcLang": "english",
  "phrase": "Hello world",
  "targetLang": "french"
}
```

## Configuration

### Changer de modèle

1. Modifiez `models.js` (référentiel et fichier GGUF)
2. Mettez à jour `scripts/downloadModel.js` pour télécharger le bon modèle
3. Ajustez `index.js` si le modèle actif change (`models.qwen1_5B` par défaut)
4. Relancez `npm run downloadModel` puis `pm2 restart ai-server`

### Fichiers de déploiement

| Fichier | Rôle |
|---------|------|
| `config/nginx.conf` | Reverse proxy et CORS (déployé dans `/etc/nginx/sites-available/`) |
| `config/ecosystem.config.js` | Modèle PM2 (généré dans `ecosystem.config.js`) |
| `config/env.example` | Variables d'environnement de référence |
| `.env` | Secrets et configuration runtime (non versionné) |

## Exploitation

```bash
sudo systemctl status nginx
source /etc/init.d/node-path.sh
pm2 status
pm2 logs ai-server
pm2 restart ai-server
```

Mise à jour de l'application :

```bash
git pull
npm install
pm2 restart ai-server
```

## Architecture

```
Client → Nginx (80/443, CORS, TLS) → Express (127.0.0.1:3001) → node-llama-cpp → modèle GGUF
```

## Licence

Ce projet est publié sous licence [ISC](LICENSE).

Les dépendances (node-llama-cpp, modèles Hugging Face, etc.) sont soumises à leurs propres licences. Consultez leurs dépôts respectifs avant redistribution.

## Crédits

- [node-llama-cpp](https://github.com/withcatai/node-llama-cpp)
- Modèles GGUF hébergés sur [Hugging Face](https://huggingface.co/)
