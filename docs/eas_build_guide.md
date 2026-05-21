# 📦 Guide EAS Build — Lingua-Cam

> Expo Application Services (EAS) permet de compiler l'app en APK (debug) ou AAB (production) sans avoir Android Studio installé localement.

---

## Prérequis

```bash
# 1. Compte Expo (gratuit)
# → https://expo.dev/signup

# 2. Installer EAS CLI globalement
npm install -g eas-cli

# 3. Se connecter
eas login
```

---

## Configuration `eas.json`

```json
{
  "cli": { "version": ">= 7.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": { "buildType": "apk" },
      "env": { "APP_ENV": "development" }
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" },
      "env": { "APP_ENV": "staging" }
    },
    "production": {
      "distribution": "store",
      "android": { "buildType": "app-bundle" },
      "env": { "APP_ENV": "production" }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccountKeyPath": "./google-services-key.json",
        "track": "internal"
      }
    }
  }
}
```

---

## Commandes de Build

```bash
cd mobile/

# APK de développement (debug, testable directement)
eas build --platform android --profile development

# APK de preview (partage interne, bêta testeurs)
eas build --platform android --profile preview

# AAB de production (Google Play Store)
eas build --platform android --profile production

# iOS (nécessite compte Apple Developer à 99$/an)
eas build --platform ios --profile production

# Les deux plateformes en même temps
eas build --platform all --profile production
```

---

## Variables d'environnement

Créer un fichier `.env` dans `mobile/` :

```bash
# API
EXPO_PUBLIC_API_URL=http://localhost:5000/api/v1
EXPO_PUBLIC_API_URL_PROD=https://api.lingua-cam.app/api/v1

# Cloudinary
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name

# Environment
APP_ENV=development
```

Configurer les secrets EAS (pour la CI/CD) :
```bash
eas secret:create --scope project --name MONGO_URI --value "mongodb+srv://..."
eas secret:create --scope project --name JWT_SECRET --value "your_secret"
```

---

## Télécharger l'APK généré

Après le build :
1. Aller sur [expo.dev](https://expo.dev) → ton projet → **Builds**
2. Cliquer sur le build terminé → **Download**
3. L'APK peut être installé directement sur Android (activer "Sources inconnues")

Ou via CLI :
```bash
eas build:list  # voir l'historique
# Le lien de téléchargement s'affiche dans la sortie
```

---

## Publication sur Google Play Store

```bash
# 1. Soumettre automatiquement après build production
eas submit --platform android --latest

# 2. Ou manuellement : uploader le .aab sur
# Google Play Console → Production → Créer une version
```

**Étapes Google Play Console :**
1. Créer un compte développeur ($25 frais uniques)
2. Créer une nouvelle app "Lingua-Cam"
3. Remplir la fiche (description, screenshots, politique confidentialité)
4. Upload du AAB dans la piste "Tests internes" d'abord
5. Après validation, passer en "Production"

---

## Build local (sans EAS — optionnel)

```bash
# Nécessite Android Studio + SDK installés
cd mobile/
npx expo run:android --variant release
```

---

## Checklist avant soumission Play Store

- [ ] `app.json` : versionCode incrémenté, bundleIdentifier défini
- [ ] Icône 1024×1024px (PNG, sans transparence)
- [ ] Splash screen 1284×2778px
- [ ] Screenshots (2-8 captures Android)
- [ ] Politique de confidentialité hébergée en ligne
- [ ] Test complet sur device physique Android
- [ ] Vérification hors ligne (mode avion)
- [ ] Test sur Android 8.0 (API 26) minimum

---

*Dernière mise à jour : Avril 2026*
