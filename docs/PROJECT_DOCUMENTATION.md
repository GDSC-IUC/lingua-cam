# 📖 Lingua-Cam — Documentation Technique Complète

> **Lingua-Cam** est une application mobile d'apprentissage des langues locales camerounaises.
> Elle permet aux utilisateurs d'apprendre le vocabulaire, de passer des quiz de validation, de relever des défis quotidiens et de suivre leur progression via un système de gamification (XP, niveaux, streaks).

---

## Table des Matières

1. [Vue d'ensemble du Projet](#1-vue-densemble-du-projet)
2. [Architecture Technique](#2-architecture-technique)
3. [Backend (API)](#3-backend-api)
4. [Mobile (Frontend)](#4-mobile-frontend)
5. [Système de Progression & Gamification](#5-système-de-progression--gamification)
6. [Moteur de Quiz](#6-moteur-de-quiz)
7. [Défi Quotidien](#7-défi-quotidien)
8. [Session de Révision (Practice)](#8-session-de-révision-practice)
9. [Text-To-Speech (TTS) Localisé](#9-text-to-speech-tts-localisé)
10. [Internationalisation (i18n)](#10-internationalisation-i18n)
11. [Design System & UI](#11-design-system--ui)
12. [Base de Données & Seed](#12-base-de-données--seed)
13. [Mise en Route (Setup)](#13-mise-en-route-setup)
14. [Déploiement (EAS Build)](#14-déploiement-eas-build)
15. [Pièges Connus & Solutions](#15-pièges-connus--solutions)
16. [Glossaire](#16-glossaire)

---

## 1. Vue d'ensemble du Projet

### Mission
Permettre à la diaspora camerounaise et aux jeunes générations de (ré)apprendre les langues de leurs ancêtres via une expérience mobile gamifiée, inspirée de Duolingo mais centrée sur les langues camerounaises.

### Structure du Monorepo

```
Lingua-Cam/
├── backend/          # API REST (Node.js + Express + MongoDB)
├── mobile/           # App React Native (Expo + Expo Router)
└── docs/             # Documentation
```

### Langues Supportées (Phase 1 — MVP)

| Langue     | Région              | Code      | Locuteurs |
|------------|---------------------|-----------|-----------|
| Ghomala'   | Ouest (Bamiléké)    | `ghomala` | ~1,2M     |
| Medumba    | Ouest (Bamiléké)    | `medumba` | ~600K     |
| Yémba      | Ouest (Bamiléké)    | `yemba`   | ~450K     |
| Ewondo     | Centre              | `ewondo`  | ~600K     |
| Bassa'a    | Littoral / Centre   | `bassa`   | ~700K     |
| Bulu       | Sud                 | `bulu`    | ~400K     |

**Phase 2** (prévu) : Duala, Fulfuldé, Éton, Bakweri.

---

## 2. Architecture Technique

```
┌──────────────────┐         ┌──────────────────┐
│   Mobile App     │  HTTP   │   Backend API    │
│  (Expo / RN)     │ ◄─────► │  (Express.js)    │
│                  │         │                  │
│  Zustand Store   │         │  MongoDB Atlas   │
│  (AsyncStorage)  │         │                  │
└──────────────────┘         └──────────────────┘
```

### Stack Technique

| Couche    | Technologie                                                       |
|-----------|-------------------------------------------------------------------|
| Mobile    | React Native 0.81, Expo SDK 54, Expo Router 6, NativeWind 4      |
| State     | Zustand 5 + AsyncStorage (persistance locale)                     |
| Data      | TanStack React Query 5 (cache, refetch, loading states)           |
| Backend   | Node.js, Express 5, TypeScript                                    |
| BDD       | MongoDB Atlas via Mongoose 9                                      |
| Auth      | JWT (bcryptjs pour le hash) — *préparé mais non activé côté mobile* |
| Styling   | NativeWind (TailwindCSS 3 pour React Native)                      |
| Fonts     | Plus Jakarta Sans (Google Fonts via expo-font)                    |
| Icons     | Lucide React Native                                               |
| TTS       | expo-speech (moteur TTS français avec sanitisation phonétique)    |

---

## 3. Backend (API)

### 3.1 Configuration

- **Port** : `5000` (configurable via `.env`)
- **Base URL** : `/api/v1`
- **Base de données** : MongoDB Atlas (URI dans `.env` → `MONGO_URI`)
- **Scripts** :
  - `npm run dev` → Démarre en mode dev (ts-node-dev avec hot reload)
  - `npm run seed` → Peuple la BDD avec les données initiales
  - `npm run build` → Compile TypeScript → `dist/`

### 3.2 Endpoints API

| Méthode | Route                          | Description                                         |
|---------|--------------------------------|-----------------------------------------------------|
| GET     | `/api/v1/health`               | Health check de l'API                                |
| GET     | `/api/v1/languages`            | Liste toutes les langues actives (enrichie avec `lessonCount`) |
| GET     | `/api/v1/languages/:id`        | Détails d'une langue                                 |
| GET     | `/api/v1/languages/:id/lessons`| Liste les leçons d'une langue (**sans vocabulaire**)  |
| GET     | `/api/v1/lessons/:id`          | Détails d'une leçon **AVEC son vocabulaire complet** |
| GET     | `/api/v1/vocabulary?lessonId=` | Vocabulaire d'une leçon (endpoint backup)            |
| POST    | `/api/v1/auth/register`        | Inscription utilisateur                              |
| POST    | `/api/v1/auth/login`           | Connexion utilisateur                                |
| GET     | `/api/v1/progress/me`          | Progression globale (auth requise)                   |
| GET     | `/api/v1/progress/me/language/:id` | Progression par langue (auth requise)            |
| POST    | `/api/v1/progress/streak`      | Mettre à jour le streak (auth requise)               |
| POST    | `/api/v1/voice/score`          | Scoring de prononciation audio (multipart/form-data) |
| GET     | `/api/v1/dictionary/search`    | Recherche dans le dictionnaire                       |

> **⚠️ Point critique** : `GET /languages/:id/lessons` retourne les leçons **SANS** leur vocabulaire. Pour récupérer le vocabulaire, il faut appeler `GET /lessons/:id` pour chaque leçon individuellement. C'est volontaire pour éviter de charger trop de données d'un coup.

### 3.3 Modèles de Données (MongoDB)

#### Language
```typescript
{
  code: string;          // ex: "ewondo" (unique, lowercase)
  name: string;          // ex: "Ewondo"
  region: string;        // ex: "Centre"
  subRegions: string[];
  color: string;         // couleur hex pour l'UI
  gradientColors: string[];
  description?: string;
  speakersEstimate?: number;
  phase: 1 | 2 | 3;     // Phase de déploiement
  isActive: boolean;     // Visible dans l'app ?
  order: number;         // Ordre d'affichage
}
```

#### Lesson
```typescript
{
  languageId: ObjectId;       // Réf vers Language
  title: string;              // ex: "Les Salutations"
  theme: string;              // ex: "salutations"
  level: 'beginner' | 'intermediate' | 'advanced';
  order: number;              // Ordre d'affichage dans la langue
  xpReward: number;           // XP gagnés en complétant (défaut: 50)
  estimatedMinutes: number;   // Durée estimée
  isPublished: boolean;       // Seules les leçons publiées sont visibles
  isOfflineAvailable: boolean;
}
```

#### VocabularyItem
```typescript
{
  lessonId: ObjectId;         // Réf vers Lesson
  languageId: ObjectId;       // Réf vers Language
  word: string;               // Mot en langue locale (ex: "Mbolo")
  meaning: string;            // Traduction française (ex: "Bonjour")
  meaningEn?: string;         // Traduction anglaise
  phonetic?: string;          // Transcription IPA (ex: "/mbolo/")
  audioUrl?: string;          // URL d'un fichier audio (futur)
  imageUrl?: string;          // URL d'une image (futur)
  exampleSentence?: string;   // Phrase d'exemple en langue locale
  exampleTranslation?: string;// Traduction de la phrase d'exemple
  tags: string[];             // Tags (ex: ['greeting', 'basic'])
  difficultyLevel: number;    // 1 à 5
  validatedByNative: boolean; // Validé par un locuteur natif ?
}
```

#### User
```typescript
{
  username: string;
  email?: string;
  passwordHash?: string;      // Hashé via bcryptjs (12 rounds)
  avatar: string;
  preferredLanguageId?: ObjectId;
  interfaceLang: 'fr' | 'en';
  isGuest: boolean;
  streak: number;
  lastStreakDate?: Date;
  totalXp: number;
  level: string;              // Calculé automatiquement (voir section Gamification)
}
```

Le niveau est **calculé automatiquement** via un hook `pre('save')` sur le modèle User :
- `< 100 XP` → novice
- `100–499` → apprenti
- `500–1499` → intermédiaire
- `1500–3999` → expert
- `≥ 4000` → maître

---

## 4. Mobile (Frontend)

### 4.1 Navigation (Expo Router)

L'app utilise **Expo Router 6** avec une navigation basée sur le système de fichiers :

```
app/
├── _layout.tsx              # Root layout (fonts, QueryClient, Stack)
├── index.tsx                # Splash
├── language-selection.tsx   # Choix de la langue d'apprentissage
├── onboarding.tsx           # Saisie du nom/pseudo (1ère fois uniquement)
├── (tabs)/                  # Navigation par onglets
│   ├── _layout.tsx          # Tab layout (barre flottante)
│   ├── index.tsx            # 🏠 Accueil (dashboard)
│   ├── library.tsx          # 📚 Bibliothèque (coming soon)
│   ├── practice.tsx         # 💪 Révision (mots ratés)
│   └── profile.tsx          # 👤 Profil utilisateur
├── lesson/[id].tsx          # Écran d'apprentissage (mot par mot)
├── quiz/[id].tsx            # Quiz de validation de leçon
├── challenge.tsx            # Défi quotidien
├── language-complete.tsx    # Récap de fin de langue (🎓 toutes leçons terminées)
├── review.tsx               # Review (flashcards)
├── settings.tsx             # Paramètres + Zone de Danger
├── privacy.tsx              # Politique de confidentialité
└── terms.tsx                # Conditions d'utilisation
```

### 4.2 Stores (Zustand)

L'app utilise **4 stores Zustand** indépendants :

#### `languageStore.ts` — Langue d'apprentissage
```typescript
{
  selectedLanguageId: string | null;  // Code de la langue (ex: "ewondo")
  setLanguage: (id: string) => void;
}
```
- Valeur par défaut : `"ewondo"`
- Changée via l'écran de sélection de langue

#### `appLanguageStore.ts` — Langue de l'interface (i18n)
```typescript
{
  language: 'en' | 'fr';             // Langue de l'UI
  setLanguage: (lang) => void;
  t: (key: string) => string;        // Fonction de traduction
}
```
- Valeur par défaut : `"en"` (anglais)
- La fonction `t()` accède aux clés imbriquées via notation pointée (ex: `t('home.greeting')`)

#### `progressStore.ts` — Progression & Gamification (⭐ Store principal)
```typescript
{
  // Leçons complétées
  completedLessons: LessonProgress[];  // { lessonId, languageId, completedAt, xpEarned }
  totalXp: number;
  currentStreak: number;
  lastActiveDate: string | null;

  // Révision
  wordsToReview: VocabularyItem[];     // Mots ratés dans les quiz

  // Défi quotidien
  dailyChallengeDate: string | null;
  dailyChallengeIndex: number;         // Index du type de défi (0-5)
  dailyChallengeCompleted: boolean;
  dailyChallengeScore: number;         // Score en pourcentage
  dailyChallengeXp: number;            // XP gagnés
}
```
- **Persisté** via AsyncStorage (clé : `nkolo-progress-storage`)
- C'est la **source de vérité** pour toute la progression côté client

#### `userStore.ts` — Identité utilisateur
```typescript
{
  userName: string | null;       // Nom/pseudo de l'utilisateur
  setUserName: (name: string) => void;
  resetUser: () => void;         // Remet le nom à null
}
```
- **Persisté** via AsyncStorage (clé : `nkolo-user-storage`)
- Défini une seule fois via l'écran d'onboarding
- Utilisé sur l'Accueil, le Profil et les Paramètres

### 4.3 Data Fetching (TanStack React Query)

Les hooks de requêtes sont centralisés dans `hooks/useQueries.ts` :

| Hook             | Endpoint                       | Description                     |
|------------------|--------------------------------|---------------------------------|
| `useLanguages()` | `GET /languages`               | Liste des langues               |
| `useLessons(id)` | `GET /languages/:id/lessons`   | Leçons d'une langue (sans vocab)|
| `useLesson(id)`  | `GET /lessons/:id`             | Une leçon + son vocabulaire     |
| `useVocabulary(id)` | `GET /vocabulary?lessonId=`  | Vocabulaire (backup)            |
| `useScoreVoice()`| `POST /voice/score`            | Scoring audio (mutation)        |

**Configuration API** (`services/api.ts`) :
- Base URL : `http://192.168.1.86:5000/api/v1` (IP locale — à changer selon le réseau)
- Timeout : 5 secondes
- Intercepteurs JWT préparés mais commentés

### 4.4 Flux Utilisateur Principal

```
1. Splash → 2. Choix de langue → 3. Onboarding (nom) → 4. Accueil (tabs)
                                                           │
                          ┌─────────────────────┼─────────────────────┐
                          │                     │                     │
                   5. Leçon [mot par mot]  6. Défi Quotidien    7. Practice
                          │                     │               (mots ratés)
                   8. Quiz de fin de leçon      │
                          │                     │
                   9a. Leçon suivante      Score + XP
                   9b. Récap langue (🎓 si dernière leçon)
                   9c. Retour accueil
```

> **Note** : L'étape 3 (Onboarding) n'est affichée qu'une seule fois, lors de la première utilisation. Les visites suivantes passent directement de la sélection de langue à l'accueil.

---

## 5. Système de Progression & Gamification

### 5.1 XP (Points d'Expérience)

| Source                  | XP Gagnés                                      |
|-------------------------|-------------------------------------------------|
| Complétion d'une leçon  | `lesson.xpReward` (défaut: 50 XP)               |
| Défi quotidien           | Proportionnel au score : `xpReward × (score / totalQuestions)` |

### 5.2 Niveaux (Progression Quadratique)

**Fichier** : `utils/levelSystem.ts`

Le niveau est calculé avec une formule **progressive** : chaque niveau coûte 100 XP de plus que le précédent.

**Formule** : `Seuil(n) = 50 × n × (n - 1)`

| Niveau | XP Cumulé Requis | XP pour ce Niveau |
|--------|------------------|-------------------|
| 1      | 0                | —                 |
| 2      | 100              | 100               |
| 3      | 300              | 200               |
| 4      | 600              | 300               |
| 5      | 1 000            | 400               |
| 6      | 1 500            | 500               |
| 7      | 2 100            | 600               |
| 8      | 2 800            | 700               |
| 9      | 3 600            | 800               |
| 10     | 4 500            | 900               |

Fonctions utilitaires disponibles :
- `getLevel(xp)` → niveau actuel
- `xpForNextLevel(xp)` → XP restants pour le niveau suivant
- `levelProgress(xp)` → progression 0–1 vers le prochain niveau
- `xpThresholdForLevel(n)` → seuil XP pour atteindre le niveau n

> **Note :** Le backend utilise un système de niveaux nommés différent (novice, apprenti, etc.) basé sur des paliers XP dans `constants/languages.ts` → `XP_LEVELS`. Les deux systèmes coexistent mais le mobile affiche principalement le niveau numérique.

### 5.3 Streak (Série de Jours)

La streak fonctionne ainsi :
1. À chaque complétion de leçon ou de défi, `markActivity()` est appelé
2. Si `lastActiveDate` est **hier** → `currentStreak += 1`
3. Si `lastActiveDate` est **avant hier ou plus** → `currentStreak = 1` (streak brisée)
4. Si `lastActiveDate` est **aujourd'hui** → rien ne change (déjà compté)

### 5.4 Mots à Réviser

Quand l'utilisateur **rate un mot** lors d'un quiz :
- Le mot est ajouté à `wordsToReview` dans le store (sans doublons)
- Le compteur apparaît sur la card "Review Session" de l'accueil
- L'onglet "Practice" permet de revoir ces mots
- Quand l'utilisateur réussit un mot en Practice → le mot est retiré de la liste

---

## 6. Moteur de Quiz

**Fichier** : `utils/quizGenerator.ts`

### 6.1 Types de Questions

| Type              | Description                                           | Probabilité |
|-------------------|-------------------------------------------------------|-------------|
| `MULTIPLE_CHOICE` | 4 options (1 correcte + 3 distracteurs)               | ~40%        |
| `TEXT_INPUT`       | L'utilisateur tape le mot exact                       | ~30%        |
| `FILL_BLANK`      | Compléter une phrase à trous (si phrase d'exemple dispo) | ~30%     |

### 6.2 Logique de Génération

```
Pour chaque mot du vocabulaire de la leçon :
  1. Choisir aléatoirement un type de question
  2. Si FILL_BLANK choisi mais pas de phrase d'exemple → fallback MULTIPLE_CHOICE
  3. Pour MULTIPLE_CHOICE : prendre 3 faux mots aléatoires du même vocabulaire
  4. Mélanger les options ET les questions finales
```

### 6.3 Validation Permissive

**Fichier** : `utils/textHelpers.ts` → `checkPermissiveMatch()`

Quand l'utilisateur tape un mot, la comparaison est **tolérante** :
- `é`, `è`, `ê` → considérés comme `e`
- Les majuscules sont ignorées
- Les ponctuations, apostrophes, tirets sont retirés

Exemple : `"Mbolo"` == `"mbolo"` == `"Mbòlò"` ✅

### 6.4 Flux de Fin de Quiz

1. L'utilisateur finit toutes les questions
2. Son score est affiché (ex: 4/5)
3. Les mots ratés sont ajoutés à `wordsToReview`
4. La leçon est marquée comme complétée, les XP sont ajoutés
5. **Deux scénarios** apparaissent :
   - **Il reste des leçons** : bouton "Leçon suivante" + bouton "Retour à l'accueil"
   - **C'était la dernière leçon** : bouton "Félicitations !" → redirige vers l'écran récap (`/language-complete`)

---

## 7. Défi Quotidien

**Fichier** : `app/challenge.tsx`

### 7.1 Les 6 Types de Défis

| Index | Nom                | Emoji | XP Max | Description                              |
|-------|---------------------|-------|--------|------------------------------------------|
| 0     | Traducteur Éclair   | ⚡    | 50     | Traduire des mots FR → langue locale      |
| 1     | Oreille Absolue     | 👂    | 60     | Écouter un mot (TTS) et l'écrire          |
| 2     | Mémoire Visuelle    | 🧠    | 45     | Associer mots et traductions              |
| 3     | Phrase Mystère      | 🔮    | 55     | Compléter une phrase avec le bon mot      |
| 4     | Sprint Vocabulaire  | 🏃    | 70     | Trouver 5 traductions d'affilée           |
| 5     | Défi Inversé        | 🔄    | 50     | Mot local → trouver le sens en français   |

### 7.2 Fonctionnement

1. **Chaque jour à minuit**, un nouveau défi est tiré au sort (index aléatoire 0–5)
2. L'index est **stable** pour la journée (persisté via `dailyChallengeDate`)
3. Le défi pioche **une leçon au hasard** de la langue sélectionnée, puis charge son vocabulaire
4. **5 questions** sont générées à partir de ce vocabulaire
5. L'XP gagné est proportionnel au score : `xpReward × (bonnesRéponses / totalQuestions)`

### 7.3 États de la Card sur l'Accueil

- **Pas encore fait** : Card cliquable → redirige vers `/challenge`
- **Déjà complété** : Au clic, une **Alert** popup indique "Rendez-vous demain"
- Quand l'utilisateur revient sur `/challenge` après complétion :
  - Affiche 🏆 "Défi Réussi !" si score > 70%
  - Affiche 💪 "Défi Tenté !" si score ≤ 70%
  - Affiche le score exact et les XP gagnés

### 7.4 Design de la Card (Accueil)

La card de défi quotidien sur l'accueil affiche un **texte générique** ("Daily Challenge"). Le type exact du défi n'est révélé que quand l'utilisateur clique et arrive sur l'écran du défi.

---

## 8. Session de Révision (Practice)

**Fichier** : `app/(tabs)/practice.tsx`

### Fonctionnement

1. L'onglet "Practice" liste les mots présents dans `wordsToReview`
2. Si aucun mot à revoir → message "Rien à réviser ! 🏆"
3. Les questions sont générées avec le même `quizGenerator` que les quiz de leçon
4. Quand un mot est correctement répondu → il est **retiré** de `wordsToReview`
5. Les mots restent dans la liste tant qu'ils ne sont pas maîtrisés

---

## 9. Text-To-Speech (TTS) Localisé

**Fichier** : `utils/textHelpers.ts` → `sanitizeForTTS()`

### Problème
Le moteur TTS d'`expo-speech` utilise le français (`fr-FR`) comme base. Les mots camerounais contiennent des combinaisons de consonnes (ng, mb, nd...) et des caractères IPA (ŋ, ɛ, ɔ...) que le TTS français ne prononce pas correctement — il les **épelle lettre par lettre**.

### Solution
Un dictionnaire de **remplacements phonétiques** transforme les syllabes problématiques en approximations prononçables par le TTS français :

| Pattern original | Remplacement TTS | Exemple                      |
|------------------|-------------------|------------------------------|
| `ng`             | `nnne-gu`         | "Ngom" → "nnne-guom"         |
| `mb`             | `mmme-b`          | "Mbolo" → "mmme-bolo"        |
| `nd`             | `nnne-d`          | "Ndi" → "nnne-di"            |
| `ny`             | `gni`             | "Nyama" → "gniama"           |
| `m'`             | `me-`             | "M'hɔm" → "me-hom"           |
| `n'`             | `ne-`             | "N'kolo" → "ne-kolo"          |
| `ŋ`              | `nnne`            | Caractère IPA "ng"            |
| `ɛ`              | `è`               | Epsilon ouvert                |
| `ɔ`              | `o`               | O ouvert                     |
| `'` / `'`        | `-`               | Apostrophes → micro-pause     |

**Paramètres TTS** : `{ language: 'fr-FR', pitch: 0.9, rate: 0.85 }` (voix plus grave et plus lente)

> **Limitation connue** : C'est un workaround. Une intégration API audio réelle (fichiers .mp3 natifs ou ElevenLabs) est recommandée pour la production.

---

## 10. Internationalisation (i18n)

L'interface de l'app supporte **2 langues** :
- 🇬🇧 Anglais (défaut)
- 🇫🇷 Français

### Architecture

```
mobile/i18n/
├── en.ts    # Traductions anglaises
└── fr.ts    # Traductions françaises
```

Chaque fichier exporte un objet imbriqué avec les mêmes clés :
```typescript
export const en = {
  home: {
    greeting: 'Good Morning,',
    dailyChallenge: 'Daily Challenge',
    // ...
  },
  quiz: { ... },
  settings: { ... },
  // ...
};
```

L'accès se fait via `t('home.greeting')` depuis n'importe quel composant.

> **Important** : C'est la langue de l'**interface** (boutons, labels, titres). Le contenu d'apprentissage (mots, phrases) reste en langue locale + français, peu importe la langue d'interface.

---

## 11. Design System & UI

### 11.1 Palette de Couleurs

| Token             | Hex       | Usage                          |
|--------------------|-----------|--------------------------------|
| `primary`          | `#006850` | Couleur principale (vert foncé) |
| `primary-container`| `#90efcd` | Fond de boutons secondaires    |
| `surface`          | `#d6fff4` | Background principal           |
| `surface-low`      | `#bcfeee` | Background léger               |
| `on-surface`       | `#00362e` | Texte principal                |
| `secondary`        | `#fbd115` | Accent doré                    |

### 11.2 Typographie

Police : **Plus Jakarta Sans** (Google Fonts)
- `PlusJakartaSans_400Regular` → `font-jakarta`
- `PlusJakartaSans_500Medium` → `font-jakarta-medium`
- `PlusJakartaSans_600SemiBold` → `font-jakarta-semibold`
- `PlusJakartaSans_700Bold` → `font-jakarta-bold`

### 11.3 Composants UI Réutilisables

#### `GriotButton`
Bouton principal avec gradient. 3 variantes :
- **`primary`** : Gradient vert (`#006850` → `#90efcd`), texte blanc
- **`secondary`** : Fond surface, texte vert
- **`ghost`** : Transparent, texte vert

#### `TonalCard`
Carte avec fond translucide et ombre subtile. Utilisée pour les cards de stats, badges, etc.

### 11.4 Barre de Navigation (Tab Bar)

La tab bar est **flottante** (`position: absolute`) avec :
- `bottom: 20px`, `left/right: 20px`
- Hauteur : `70px`
- Border radius : `30px`
- Blur effect sur iOS (BlurView)

> **⚠️ Conséquence importante** : Tous les écrans tab **doivent** avoir un padding bottom d'au moins **110px** (20 bottom + 70 height + 20 marge) pour que le contenu ne soit pas caché derrière la nav bar. On utilise `pb-32` (128px) ou des spacers `<View style={{ height: 120 }} />`.

---

## 12. Base de Données & Seed

### Script de Seed

**Commande** : `npm run seed` (depuis `/backend`)

Le script (`backend/src/utils/seed.ts`) :
1. Supprime **toutes** les données existantes (Languages, Lessons, VocabularyItems)
2. Insère les 8 langues (6 Phase 1 actives + 2 Phase 2 inactives)
3. Pour chaque langue Phase 1, crée les leçons par thème avec leur vocabulaire

### Thèmes de Leçons dans le Seed

| Ordre | Thème        | XP  | Durée estimée |
|-------|--------------|-----|---------------|
| 1     | Salutations  | 50  | 10 min        |
| 2     | La Famille   | 60  | 12 min        |
| 3     | Les Chiffres | 50  | 10 min        |
| 4     | La Nature    | 55  | 12 min        |

Chaque thème contient **4 à 6 mots** avec leurs traductions, phonétique, phrases d'exemple et tags.

---

## 13. Mise en Route (Setup)

### Prérequis
- Node.js 18+
- npm
- Expo CLI (`npx expo`)
- MongoDB Atlas (ou instance locale)
- Un appareil physique ou émulateur Android/iOS

### Backend

```bash
cd backend
cp .env.example .env        # Configurer MONGO_URI, JWT_SECRET, PORT
npm install
npm run seed                # Peupler la base de données
npm run dev                 # Démarrer le serveur (port 5000)
```

### Mobile

```bash
cd mobile
npm install
# ⚠️ Modifier l'IP dans services/api.ts si nécessaire !
npx expo start --clear      # Lancer Expo
```

> **⚠️ IP Réseau** : Le fichier `mobile/services/api.ts` contient `LOCAL_IP = '192.168.1.86'`. Cette valeur doit correspondre à l'**IP locale de votre machine** sur le réseau WiFi. Sur Windows : `ipconfig` → adresse IPv4 du WiFi.

---

## 14. Déploiement (EAS Build)

Le fichier `eas.json` est configuré avec 3 profils :

| Profil        | Usage                    | Distribution     |
|---------------|--------------------------|------------------|
| `development` | Build de dev avec DevClient | interne        |
| `preview`     | Build de test APK        | interne          |
| `production`  | Build de production       | store (Google/Apple) |

```bash
npx eas build --platform android --profile preview   # APK de test
npx eas build --platform android --profile production # AAB pour le Play Store
```

---

## 15. Pièges Connus & Solutions

### ⚠️ "Chargement du défi..." infini
**Cause** : `GET /languages/:id/lessons` retourne les leçons sans vocabulaire. Si on essaie de lire `lesson.vocabulary`, c'est `undefined`.
**Solution** : Utiliser `useLesson(id)` qui appelle `GET /lessons/:id` pour charger le vocabulaire complet d'une seule leçon.

### ⚠️ Contenu caché sous la tab bar
**Cause** : La tab bar flottante (`position: absolute`) recouvre le contenu.
**Solution** : Ajouter `pb-32` ou un spacer de 120px+ en bas de chaque écran tab.

### ⚠️ TTS épelle les mots au lieu de les lire
**Cause** : Les consonnes prénasalisées (ng, mb...) et les apostrophes perturbent le moteur TTS français.
**Solution** : La fonction `sanitizeForTTS()` transforme ces patterns en approximations lisibles.

### ⚠️ "Langue non trouvée dans la base de données"
**Cause** : Le code de langue stocké côté mobile (`languageStore`) ne correspond pas au `code` en BDD.
**Solution** : S'assurer que le seed a bien été exécuté et que les codes correspondent (`ewondo`, `bassa`, etc.).

### ⚠️ Hooks React "Rendered more hooks..."
**Cause** : Un hook conditionnel (ex: `useAudioPlayer` appelé seulement si une condition est vraie).
**Solution** : Tous les hooks doivent être appelés inconditionnellement, passer `null` si pas de données.

---

## 16. Glossaire

| Terme          | Signification                                                    |
|----------------|------------------------------------------------------------------|
| **XP**         | Points d'expérience gagnés en complétant des leçons/défis        |
| **Streak**     | Nombre de jours consécutifs d'utilisation                        |
| **Niveau**     | Rang calculé via progression quadratique (`utils/levelSystem.ts`) |
| **VocabularyItem** | Un mot unique avec ses traductions, phonétique et exemples   |
| **Défi quotidien** | Un mini-quiz de 5 questions renouvelé chaque jour            |
| **Practice**   | Session de révision des mots ratés lors des quiz                 |
| **Seed**       | Script qui peuple la base de données avec des données initiales  |
| **TTS**        | Text-To-Speech — synthèse vocale pour la prononciation           |
| **NativeWind** | Bibliothèque qui permet d'utiliser les classes Tailwind dans React Native |
| **Phase 1**    | Langues disponibles au lancement (MVP)                           |
| **Phase 2**    | Langues prévues pour une mise à jour future                      |

---

> 📅 **Dernière mise à jour** : 13 Mai 2026
> 
> Ce document est un document vivant. Il sera mis à jour au fur et à mesure des évolutions du projet.
