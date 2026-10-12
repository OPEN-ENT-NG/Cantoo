# Packages

Ces projets correspondent à la mise à disposition des développements de [Cantoo](https://cantoo.fr) dans le cadre du partenariat avec la **Région Hauts-de-France** et **Édifice**.

Ils regroupent des briques logicielles libres destinées au partage éducatif : barre d’accessibilité web, serveur de traduction et serveur LLM local.

## Projets

| Projet | Description |
| ------ | ----------- |
| [accessibilitybar](./packages/accessibilitybar/) | Barre d’outils d’accessibilité web (version libre et dégradée) : interface pour découvrir et configurer des aides à la lecture, à l’écriture et à la navigation. |
| [serveur-de-traduction](./packages/serveur-de-traduction/) | Serveur de traduction auto-hébergé basé sur LibreTranslate, avec installation reproductible (Nginx, HTTPS, systemd). |
| [serveur-de-llm-local](./packages/serveur-de-llm-local/) | API auto-hébergée pour définitions de mots et traductions, fondée sur un modèle LLM local (Qwen2.5). |

Chaque dépôt contient son propre README avec les détails d’installation et d’utilisation.

## Développer / publier

Localement, chaque dossier sous `packages/` reste un clone Git indépendant (remote sur la [Forge des communs numériques éducatifs](https://forge.apps.education.fr)).

Le dépôt principal versionne **une copie des fichiers** (sans les `.git` internes) pour GitHub. Pour ajouter, committer ou pousser sans que Git traite les packages comme des dépôts embarqués, utiliser :

```bash
# Indexer tous les fichiers des packages
./scripts/forge-git.sh add

# Commit
./scripts/forge-git.sh commit -m "message"

# Push
./scripts/forge-git.sh push

# Ou les deux
./scripts/forge-git.sh commit-push -m "message"
```

Ne pas faire un simple `git add packages/` tant que les `.git` internes sont présents : Git n’enregistrerait qu’un pointeur, pas les fichiers.
