# 📘 CAHIER DES CHARGES — Application Mobile Lingua-Cam
### *Plateforme interactive d'apprentissage des langues maternelles camerounaises*

> **Projet :** Lingua-Cam — Application mobile éducative  
> **Type :** Projet de Fin d'Études (PFE)  
> **Cible :** Population camerounaise (toutes régions, villes, villages, localités)  
> **Accès :** 100 % gratuit, sans inscription obligatoire  
> **Version :** 1.0 — Avril 2026

---

## 1. CONTEXTE ET PROBLÉMATIQUE

Le Cameroun recense plus de **280 langues locales**. Face à la domination du français et de l'anglais, ces langues s'éteignent progressivement chez les jeunes générations urbaines.

**Problématique :** Comment permettre à un jeune Camerounais — avec un simple smartphone — d'apprendre, de pratiquer et de valoriser sa langue maternelle de façon ludique, interactive et autonome ?

**Nkolo** = "connaissance" en langue Ewondo (groupe Béti).

---

## 2. VISION & OBJECTIFS PÉDAGOGIQUES

| Objectif | Description |
|----------|-------------|
| **Compréhension orale** | Écouter et comprendre des mots, phrases, dialogues natifs |
| **Production orale** | Prononcer correctement via exercices microphone |
| **Compréhension écrite** | Apprendre l'orthographe et la transcription phonétique |
| **Vocabulaire** | Mémoriser des champs lexicaux par thèmes |
| **Culture** | Proverbes, contes, rituels culturels liés à chaque langue |

---

## 3. LANGUES CIBLÉES

### Phase 1 — MVP
| Langue | Région | Locuteurs estimés |
|--------|--------|------------------|
| Ewondo | Centre | ~800 000 |
| Bassa | Littoral / Centre | ~300 000 |
| Douala | Littoral | ~90 000 |
| Fulfuldé | Adamaoua / Nord | ~3 M+ |
| Éton | Centre | ~100 000 |

### Phase 2 — Extension
Bamiléké, Ghomala', Yémba, Medumba, Bafang, Hausa, Bakweri, Ejagham...

---

## 4. FONCTIONNALITÉS

### 4.1 Structure d'une leçon
```
[1] Introduction animée du thème
[2] Flashcards vocabulaire (mot + image + audio)
[3] Exercice d'écoute
[4] Exercice de prononciation (micro)
[5] Mini-dialogue contextuel
[6] QUIZ de fin de leçon
[7] Résultat + badge + XP
```

### 4.2 Types de Quiz
- QCM audio (écouter → choisir image)
- QCM image (voir image → choisir traduction)
- Glisser-déposer (associer paires)
- Compléter la phrase
- Reconnaissance vocale
- Remettre dans l'ordre
- Jeu de mémoire (Memory)

### 4.3 Gamification
- Points XP par leçon
- Niveaux : Novice → Apprenti → Intermédiaire → Expert → Maître
- Streak quotidien (flamme)
- Badges culturels (masque Bamiléké, tambour Douala...)
- Mascotte animée réactive

### 4.4 Modules spéciaux
- **Histoires & Contes** : récits animés synchronisés avec l'audio
- **Chansons & Comptines** : karaoké en langue locale
- **Dictionnaire** : recherche multilingue avec audio + IPA
- **Carte interactive** : carte du Cameroun → région → langue

---

## 5. STACK TECHNIQUE

| Couche | Technologie |
|--------|-------------|
| Mobile | React Native + Expo SDK 52, TypeScript |
| Styling | NativeWind v4 (Tailwind CSS) |
| Navigation | Expo Router v4 |
| Animations | React Native Reanimated 3 + Lottie |
| State | Zustand |
| Data fetching | TanStack Query |
| Audio | Expo AV |
| Local DB | Expo SQLite + AsyncStorage |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT (access + refresh tokens) |
| Media | Cloudinary |
| Build | Expo EAS Build |

---

## 6. EXIGENCES NON-FONCTIONNELLES

- Démarrage < 3 secondes
- APK < 80 Mo (hors packs)
- Android 8.0+ / iOS 13+
- Fonctionnement hors ligne pour contenu téléchargé
- Aucun paiement, aucune pub intrusive
- Conformité Loi n°2010/012 (données personnelles Cameroun)

---

## 7. ROADMAP

| Phase | Période | Contenu |
|-------|---------|---------|
| 0 — Recherche | Mois 1-2 | Design, interviews locuteurs, wireframes |
| 1 — MVP | Mois 3-5 | 5 langues × 5 leçons, quiz, audio |
| 2 — Enrichissement | Mois 6-7 | Micro, contes, chansons, dictionnaire |
| 3 — Expansion | Mois 8-9 | Nouvelles langues, mode enfant, beta |
| 4 — Déploiement | Mois 10 | Play Store + App Store + Soutenance |

---

## 8. VOLUME MVP

| Langue | Leçons | Mots | Audio clips |
|--------|--------|------|-------------|
| Ewondo | 10 | 200 | 200+ |
| Bassa | 10 | 200 | 200+ |
| Douala | 8 | 160 | 160+ |
| Fulfuldé | 8 | 160 | 160+ |
| Éton | 6 | 120 | 120+ |
| **Total** | **42** | **840** | **840+** |

---

*🇨🇲 Nkolo — L'mbolo ya mbi !*
