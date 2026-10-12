# AccessibilityBar

Barre d’outils d’accessibilité web, version **libre et dégradée** issue de [Cantoo](https://cantoo.fr).

Elle s’injecte dans une page web et propose une interface pour découvrir, activer et configurer des aides à la lecture, à l’écriture et à la navigation. Cette publication open source vise le partage éducatif : l’interface et le parcours de configuration sont présents, mais **les fonctions qui dépendent de services cloud, de modèles propriétaires ou de briques fermées de Cantoo sont volontairement retirées ou neutralisées**.

## Contenu du dépôt

| Fichier      | Rôle                                                            |
| ------------ | --------------------------------------------------------------- |
| `index.js`   | Point d’entrée à charger dans la page (charge ensuite `app.js`) |
| `app.js`     | Application React de la barre d’outils                          |
| `vendors.js` | Dépendances tierces empaquetées                                 |
| `README.md`  | Ce document                                                     |

## Installation sur une page

Placez les trois fichiers JS sur le même chemin HTTP (ou adaptez les URLs), puis ajoutez le script d’entrée :

```html
<script src="/chemin/vers/index.js" defer></script>
```

Au chargement, la barre s’injecte dans la page et, lorsque c’est possible, dans les iframes de même origine.

### Prérequis navigateur

- Navigateur moderne (Chrome, Firefox, Edge, Safari récents)
- JavaScript activé
- Pour une intégration dans des iframes : pages de **même origine** (les iframes cross-origin ne peuvent pas être instrumentées)

## Ce que contient la barre

### Interface

- **Bouton d’accès** à l’assistant d’accessibilité
- **Panneau de configuration** avec deux onglets :
  - _Mes outils activés_
  - _Tous les outils_
- **Guide de configuration** (questionnaire court) pour proposer un jeu d’outils selon les besoins exprimés (vision, lecture, écriture, langue)
- **Interface multilingue** : français, anglais, portugais
- Préférences conservées **localement** dans le navigateur

### Outils présentés dans l’UI

Les catégories et libellés suivants apparaissent dans l’interface (tels que dans la version complète Cantoo Web) :

| Catégorie    | Outils                                                                                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Vision**   | Adaptation du texte (police, espacements, syllabes, coloration), assistance visuelle (zoom, masque de lecture, contraste, mode sombre…), barre d’outils flottante |
| **Lecture**  | Synthèse vocale, mode lecture, description d’images, OCR                                                                                                          |
| **Écriture** | Reconnaissance vocale / dictée dans les champs de texte                                                                                                           |
| **Langue**   | Traducteur, dictionnaire                                                                                                                                          |

La **barre d’outils contextuelle** (au survol ou à la sélection de texte) peut encore s’afficher selon les options, avec les raccourcis habituels (adaptation, lecture, dictée, traduction, dictionnaire, etc.).

## Limites importantes (version dégradée)

Cette build open source **n’est pas équivalente** à Cantoo Web. Pour pouvoir publier un bundle libre sans dépendances fermées ni backends Cantoo, de nombreuses capacités sont **désactivées (stubs)** :

### Fonctions non opérationnelles

- **Synthèse vocale** (voix cloud Voxygen et moteur text-to-speech Cantoo)
- **Reconnaissance vocale / dictée** (modèles speech-to-text, ex. Vosk)
- **Traduction** (API de traduction Cantoo / services distants)
- **Dictionnaire** (API de définitions Cantoo)
- **Description d’images** et **OCR** (Modèles d'IA Cantoo)
- **Adaptation de texte avancée** (moteur phonétique Cantoo)
- **Effets d’assistance visuelle** (loupe, contraste élevé, mode sombre, bande / ligne de lecture, réduction des animations) : les interrupteurs peuvent être visibles, mais les traitements associés ne s’appliquent pas
- **Actions des boutons** de la barre contextuelle (clics neutralisés dans ce build)
- **Analytics** et télémétrie
- Authentification / comptes utilisateurs

### Conséquences pratiques

- Vous pouvez **explorer l’interface**, le guide et l’organisation des outils.
- Vous **ne devez pas** attendre une compensation réelle (lecture à voix haute, dictée, traduction, reformatting phonétique, etc.) avec ce dépôt seul.
- Pour une utilisation pédagogique ou en production avec les aides actives, il faut la **version complète** de Cantoo Web (extension navigateur ou intégration partenaire).

## Confidentialité

Dans cette version :

- Aucun appel n’est configuré vers les hôtes API / proxy / TTS / description d’images Cantoo
- Le guide rappelle que les réponses de configuration restent sur l’appareil
- Aucune collecte de données personnelles n’est branchée dans ce bundle

## Origine et licence d’usage

- Produit dérivé de la barre d’accessibilité **Cantoo Web**
- Publié pour l’écosystème éducatif

Pour toute question produit ou partenariat : [cantoo.fr](https://cantoo.fr)
