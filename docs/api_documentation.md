# 📡 Documentation API — NKOLO Backend

> **Base URL (dev) :** `http://localhost:5000/api/v1`  
> **Base URL (prod) :** `https://api.nkolo.app/api/v1`  
> **Auth :** Bearer JWT (header `Authorization: Bearer <token>`)

---

## Auth Endpoints

### POST `/auth/register`
Créer un compte utilisateur.
```json
// Body
{ "username": "string", "email": "string", "password": "string" }

// Response 201
{
  "success": true,
  "data": {
    "user": { "_id": "...", "username": "...", "email": "..." },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

### POST `/auth/login`
```json
// Body
{ "email": "string", "password": "string" }
// Response 200 → same as register
```

### POST `/auth/guest`
Créer un compte invité anonyme (sans email/password).
```json
// Response 200
{ "success": true, "data": { "guestId": "...", "accessToken": "..." } }
```

### POST `/auth/refresh`
Renouveler le access token.
```json
// Body
{ "refreshToken": "string" }
// Response 200
{ "success": true, "data": { "accessToken": "..." } }
```

### POST `/auth/logout`
Invalider le refresh token.

---

## Languages Endpoints

### GET `/languages`
Récupérer toutes les langues actives.
```json
// Response 200
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "code": "ewondo",
      "name": "Ewondo",
      "region": "Centre",
      "color": "#007A5E",
      "lessonCount": 10,
      "speakersEstimate": 800000
    }
  ]
}
```

### GET `/languages/:id`
Détails d'une langue + liste de ses leçons.

### GET `/languages/:id/lessons`
Toutes les leçons d'une langue (filtrées par level optionnel).
```
Query params: ?level=beginner&page=1&limit=20
```

---

## Lessons Endpoints

### GET `/lessons/:id`
Détails complets d'une leçon (avec vocabulaire embarqué).
```json
// Response 200
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Les Salutations",
    "theme": "salutations",
    "level": "beginner",
    "xpReward": 50,
    "vocabulary": [
      {
        "word": "Mbolo",
        "meaning": "Bonjour",
        "phonetic": "m-bo-lo",
        "audioUrl": "https://...",
        "imageUrl": "https://..."
      }
    ]
  }
}
```

### GET `/lessons/:id/quiz`
Récupérer le quiz d'une leçon.

### POST `/lessons/:id/complete` 🔒
Marquer une leçon comme complétée, enregistrer le score.
```json
// Body
{ "score": 85, "timeSpentSeconds": 320 }
// Response 200
{ "success": true, "data": { "xpEarned": 50, "newBadges": [], "newLevel": null } }
```

---

## Dictionary Endpoints

### GET `/dictionary`
```
Query params: ?lang=ewondo&q=mbolo&page=1&limit=20
```
Recherche full-text dans le dictionnaire.

### GET `/dictionary/:languageCode`
Tous les mots d'une langue (paginés).

---

## Progress Endpoints 🔒

### GET `/progress/me`
Progression globale de l'utilisateur connecté.
```json
// Response 200
{
  "success": true,
  "data": {
    "totalXp": 340,
    "streak": 7,
    "level": "apprenti",
    "completedLessons": 12,
    "badges": [...],
    "byLanguage": [
      { "languageId": "...", "completedLessons": 5, "xp": 200 }
    ]
  }
}
```

### GET `/progress/me/language/:id`
Progression pour une langue spécifique.

### POST `/progress/streak`
Mettre à jour le streak quotidien (appelé au démarrage de l'app).

---

## Stories Endpoints

### GET `/stories`
```
Query params: ?lang=ewondo&level=beginner
```

### GET `/stories/:id`
Détails d'une histoire avec toutes ses pages.

---

## Songs Endpoints

### GET `/songs`
```
Query params: ?lang=ewondo&category=children
```

### GET `/songs/:id`
Détails d'une chanson avec les paroles synchronisées.

---

## Upload Endpoints 🔒 (Admin)

### POST `/upload/audio`
Upload d'un clip audio vers Cloudinary.
```
Content-Type: multipart/form-data
field: file (audio/mpeg, audio/ogg, audio/wav)
```

### POST `/upload/image`
Upload d'une image vers Cloudinary.

---

## Codes d'erreur

| Code | Signification |
|------|--------------|
| 400 | Bad Request — données invalides |
| 401 | Unauthorized — token manquant/expiré |
| 403 | Forbidden — droits insuffisants |
| 404 | Not Found |
| 409 | Conflict — email/username déjà utilisé |
| 500 | Internal Server Error |

```json
// Format d'erreur standard
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Email ou mot de passe incorrect"
  }
}
```

---

*Dernière mise à jour : Avril 2026*
