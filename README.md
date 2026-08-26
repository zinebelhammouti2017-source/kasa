# Kasa – Plateforme de location immobilière

Kasa est une application web de location immobilière développée avec Next.js et React dans le cadre du Projet 8 de la formation Développeur d’applications Full-Stack d’OpenClassrooms.

L’application permet de consulter des logements, gérer des favoris, créer un compte, publier une propriété et échanger avec un propriétaire grâce à une messagerie.

## Fonctionnalités

- consultation des logements disponibles ;
- fiche détaillée avec galerie d’images ;
- inscription et connexion ;
- favoris locaux pour les visiteurs et favoris enregistrés via l’API pour les utilisateurs connectés ;
- ajout d’une propriété pour les propriétaires et administrateurs ;
- upload et validation des images ;
- messagerie entre un client et le propriétaire d’un logement ;
- affichage responsive sur ordinateur et mobile ;
- gestion des chargements, erreurs et pages introuvables ;
- navigation clavier et composants accessibles.

## Technologies utilisées

### Frontend

- Next.js 16 ;
- React 19 ;
- JavaScript ;
- CSS Modules ;
- Vitest ;
- React Testing Library.

### Backend

- Node.js ;
- Express ;
- SQLite ;
- API REST ;
- authentification JWT.

## Dépôts GitHub

- Frontend : https://github.com/zinebelhammouti2017-source/kasa
- Backend : https://github.com/zinebelhammouti2017-source/kasa-backend

## Prérequis

- Node.js 20 ou supérieur ;
- npm ;
- Git.

## Installation

Cloner les deux dépôts :

```bash
git clone https://github.com/zinebelhammouti2017-source/kasa.git
git clone https://github.com/zinebelhammouti2017-source/kasa-backend.git
```

### Installer le backend

```bash
cd kasa-backend
npm install
npm start
```

L’API est disponible à l’adresse :

```text
http://localhost:3000
```

La documentation de l’API est disponible à l’adresse :

```text
http://localhost:3000/docs.html
```

Au premier démarrage, le backend crée automatiquement la base SQLite et importe les logements présents dans `data/properties.json`.

### Installer le frontend

Dans un second terminal :

```bash
cd kasa
npm install
npm run dev -- -p 3001
```

L’application est disponible à l’adresse :

```text
http://localhost:3001
```

## Tests et vérifications

Lancer les tests unitaires :

```bash
npm run test:run
```

Lancer ESLint :

```bash
npm run lint
```

Créer le build de production :

```bash
npm run build
```

Le projet contient actuellement 23 tests unitaires et de composants réalisés avec Vitest et React Testing Library.

Les tests couvrent notamment :

- le service des favoris ;
- la liste des favoris ;
- les cartes de logement ;
- le carrousel ;
- la validation et l’envoi du formulaire d’ajout d’une propriété.

## Structure principale du frontend

```text
src/
├── app/                 # Pages Next.js
├── components/          # Composants réutilisables
├── lib/
│   ├── services/        # Communication avec l’API
│   └── utils/           # Fonctions utilitaires
└── assets/              # Images et ressources
```

## Accessibilité et qualité

Le projet utilise notamment :

- des éléments HTML sémantiques ;
- des labels associés aux champs ;
- des messages d’erreur accessibles ;
- une navigation clavier ;
- des indicateurs de focus visibles ;
- des attributs ARIA lorsque cela est nécessaire ;
- `next/image` pour l’optimisation des images ;
- des interfaces responsive adaptées aux maquettes desktop et mobile.

## Déploiement

Le lien vers l’application déployée sera ajouté après la mise en production.

## Autrice

Zineb El Hammouti  
Projet réalisé dans le cadre de la formation OpenClassrooms.