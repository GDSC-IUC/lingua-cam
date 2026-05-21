# 🇨🇲 Lingua-Cam (Anciennement Nkolo)

Lingua-Cam est une plateforme d'apprentissage des langues camerounaises (Ghomala', Ewondo, Bassa'a, etc.) conçue pour aider les utilisateurs à renouer avec leurs racines à travers une expérience mobile moderne et immersive.

## 📁 Structure du Projet

Le projet est organisé en deux parties principales :

*   **`/mobile`** : Application mobile développée avec **React Native (Expo)**, utilisant Expo Router pour la navigation et NativeWind pour le stylage.
*   **`/backend`** : API REST développée avec **Node.js (Express)** et **MongoDB**, gérant les leçons, les utilisateurs, la progression et l'intégration de l'IA vocale (OpenAI).
*   **`/docs`** : Documentation technique, schémas de base de données et cahier des charges.

---

## 🚀 Démarrage Rapide

### 1. Backend (API)
```bash
cd backend
npm install
# Assurez-vous d'avoir un fichier .env (voir .env.example)
npm run dev
```

### 2. Mobile (App)
```bash
cd mobile
npm install
# Assurez-vous d'avoir le CLI Expo installé
npx expo start
```

---

## 🛠 Technologies Utilisées

### Frontend
- **React Native / Expo** (SDK 51+)
- **NativeWind (Tailwind CSS)**
- **Zustand** (Gestion d'état)
- **i18next** (Internationalisation FR/EN)

### Backend
- **Node.js / Express**
- **MongoDB / Mongoose**
- **OpenAI API** (Reconnaissance et génération vocale)
- **JWT** (Authentification)

---

## 📡 Déploiement

### Pré-requis pour les tests externes
1.  **Backend** : Hébergé sur **Render** ou **Railway**.
2.  **Base de données** : Cluster **MongoDB Atlas**.
3.  **Mobile** : Builds distribués via **Expo EAS** (.apk).

---

## 📝 Auteur
- **Lingua-Cam Team**
- Licence : MIT
