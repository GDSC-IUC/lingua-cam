/**
 * Outil de sanitisation des textes pour forcer le lecteur TTS (Text-To-Speech) Français
 * à prononcer correctement les syllabes camerounaises sans épeler les lettres.
 */

export const sanitizeForTTS = (word: string): string => {
  if (!word) return '';

  let sanitized = word.toLowerCase();

  // Dictionnaire de remplacements phonétiques ciblant l'IA vocale FR
  // Le but est d'ajouter des micro-pauses (tirets) ou voyelles muettes pour l'accroc
  const replacements: Record<string, string> = {
    // Syllabes à 3 lettres
    'ngw': 'nnne-gou',
    // Consonnes prénasalisées ou complexes
    'ng': 'nnne-gu',
    'mb': 'mmme-b',
    'nd': 'nnne-d',
    'ny': 'gni',
    'kp': 'ke-p',
    'dz': 'de-z',
    'gb': 'gh-b',
    'nz': 'nnne-z',
    'nj': 'nnne-dj',
    'mv': 'mmme-v',
    'mf': 'mmme-f',
    'ts': 't-s',
    'kw': 'kou',
    'gw': 'gou',
    'mw': 'mou',
    // Préfixes pronominaux courants (m' = me-, n' = ne-) 
    "m'": "me-",
    "n'": "ne-",
    // Caractères phonétiques spéciaux (IPA)
    "ŋ": "nnne",
    "ɛ": "è",
    "ɔ": "o",
    "ə": "e", // schwa
    "ɣ": "gh",
    "ʔ": "", // coup de glotte ignoré en tts
    "'": "-", // apostrophe générique → micro-pause pour garder la liaison
    "'": "-", // autre forme d'apostrophe
  };

  // Trier par longueur décroissante pour s'assurer que "ngw" est remplacé avant "ng"
  const keys = Object.keys(replacements).sort((a, b) => b.length - a.length);

  for (const key of keys) {
    const regex = new RegExp(key, 'gi'); // Remplacement global
    sanitized = sanitized.replace(regex, replacements[key]);
  }

  return sanitized;
};

/**
 * Compare deux mots en ignorant les accents, les majuscules et les tirets.
 * Utile pour la validation du "Text Input" lors du Quiz ("e" == "é").
 */
export const checkPermissiveMatch = (input: string, target: string): boolean => {
  const normalize = (str: string) => 
    str.normalize('NFD')                     // Décompose les caractères et accents (ex: é -> e + ´)
       .replace(/[\u0300-\u036f]/g, '')     // Enlève tous les diacritiques/accents
       .replace(/[^a-zA-Z0-9]/g, '')        // Retire les ponctuations, apostrophes, tirets
       .toLowerCase()
       .trim();
  
  return normalize(input) === normalize(target);
};
