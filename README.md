# Chatbot personnalisé avec Mistral AI

Créez facilement votre propre chatbot intelligent avec une clé API Mistral, une interface web simple et un serveur sécurisé en Node.js.

## 🚀 Fonctionnalités

- Interface web prête à l’emploi
- Clé API protégée côté serveur
- Personnalisation du nom du bot et de l’entreprise
- Réponses en français
- Installation simple avec `npm install` et `npm start`

## 📁 Structure du projet

```text
chatbot-mistral-github/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server.js
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## ⚙️ Installation

Installez les dépendances :

```bash
npm install
```

Copiez le fichier `.env.example` et renommez-le en `.env`.

Ajoutez votre clé Mistral :

```env
MISTRAL_API_KEY=colle_ta_cle_mistral_ici
MISTRAL_MODEL=mistral-small-latest
BOT_NAME=Assistant
BUSINESS_NAME=Mon entreprise
BUSINESS_PHONE=06...
BUSINESS_CITY=Votre ville
PORT=3000
```

## ▶️ Lancer le projet

```bash
npm start
```

Puis ouvrez dans le navigateur :

```text
http://localhost:3000
```

## 🔐 Sécurité

Ne mettez jamais votre clé API Mistral directement dans le fichier HTML ou JavaScript public.

La clé doit rester dans le fichier `.env`, qui est ignoré par Git grâce au fichier `.gitignore`.

## 📌 Description courte pour GitHub

```text
Chatbot personnalisé avec Mistral AI, Node.js et interface web prête à l’emploi.
```

## 📄 Licence

MIT
