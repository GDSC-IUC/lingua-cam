// Langues disponibles dans Nkolo
export interface LanguageConfig {
  code: string;
  name: string;
  region: string;
  color: string;
  gradient: [string, string];
  emoji: string;
  phase: 1 | 2 | 3;
  mapCoords: { lat: number; lng: number };
  speakers?: string;
  description?: string;
  image?: any;
}

export const LANGUAGES: LanguageConfig[] = [
  // ── Phase 1 (MVP) ──────────────────────────────────────────
  {
    code: 'ghomala',
    name: "Ghomala'",
    region: 'Ouest (Bamiléké)',
    color: '#8E24AA',
    gradient: ['#8E24AA', '#AB47BC'],
    emoji: '👑',
    phase: 1,
    mapCoords: { lat: 5.474, lng: 10.421 },
    speakers: '~1,2M',
    description: 'Langue principale du peuple Bamiléké de la région Ouest.',
    image: require('../assets/languages/ghomala.jpg'),
  },
  {
    code: 'medumba',
    name: 'Medumba',
    region: 'Ouest (Bamiléké)',
    color: '#D84315',
    gradient: ['#D84315', '#F4511E'],
    emoji: '🎭',
    phase: 1,
    mapCoords: { lat: 5.1, lng: 10.3 },
    speakers: '~600K',
    description: 'Langue bamiléké parlée principalement dans le Ndé.',
    image: require('../assets/languages/medumba.png'),
  },
  {
    code: 'yemba',
    name: 'Yémba',
    region: 'Ouest (Bamiléké)',
    color: '#6D4C41',
    gradient: ['#6D4C41', '#8D6E63'],
    emoji: '🌄',
    phase: 1,
    mapCoords: { lat: 5.3, lng: 10.8 },
    speakers: '~450K',
    description: 'Langue de la Menoua, parlée autour de Dschang.',
    image: require('../assets/languages/yemba.jpg'),
  },
  {
    code: 'ewondo',
    name: 'Ewondo',
    region: 'Centre',
    color: '#007A5E',
    gradient: ['#007A5E', '#00A87F'],
    emoji: '🌿',
    phase: 1,
    mapCoords: { lat: 3.848, lng: 11.502 },
    speakers: '~600K',
    description: 'Langue du peuple Beti, parlée à Yaoundé et alentours.',
    image: require('../assets/languages/ewondo.jpg'),
  },
  {
    code: 'bassa',
    name: "Bassa'a",
    region: 'Littoral / Centre',
    color: '#1E88E5',
    gradient: ['#1E88E5', '#42A5F5'],
    emoji: '🦅',
    phase: 1,
    mapCoords: { lat: 3.871, lng: 11.516 },
    speakers: '~700K',
    description: 'Langue du peuple Bassa, entre le Littoral et le Centre.',
    image: require('../assets/languages/bassa.jpg'),
  },
  {
    code: 'bulu',
    name: 'Bulu',
    region: 'Sud',
    color: '#2E7D32',
    gradient: ['#2E7D32', '#43A047'],
    emoji: '🌳',
    phase: 1,
    mapCoords: { lat: 3.1, lng: 11.9 },
    speakers: '~400K',
    description: 'Langue bantoue du peuple Bulu, région Sud du Cameroun.',
    image: require('../assets/languages/bulu.jpg'),
  },
  // ── Phase 2 ────────────────────────────────────────────────
  {
    code: 'douala',
    name: 'Duala',
    region: 'Littoral',
    color: '#0097A7',
    gradient: ['#0097A7', '#26C6DA'],
    emoji: '🚢',
    phase: 2,
    mapCoords: { lat: 4.041, lng: 9.705 },
    image: require('../assets/languages/douala.jpg'),
  },
  {
    code: 'fulfulde',
    name: 'Fulfuldé',
    region: 'Adamaoua / Nord',
    color: '#FF8F00',
    gradient: ['#FF8F00', '#FFB300'],
    emoji: '🐪',
    phase: 2,
    mapCoords: { lat: 7.374, lng: 12.735 },
    image: require('../assets/languages/fulfulde.jpg'),
  },
  {
    code: 'eton',
    name: 'Éton',
    region: 'Centre',
    color: '#558B2F',
    gradient: ['#558B2F', '#7CB342'],
    emoji: '🥁',
    phase: 2,
    mapCoords: { lat: 4.025, lng: 11.515 },
    image: require('../assets/languages/eton.jpg'),
  },
  {
    code: 'bakweri',
    name: 'Bakweri',
    region: 'Sud-Ouest',
    color: '#00838F',
    gradient: ['#00838F', '#00ACC1'],
    emoji: '🌋',
    phase: 2,
    mapCoords: { lat: 4.154, lng: 9.215 },
    image: require('../assets/languages/bakweri.jpg'),
  },
];

export const THEMES = [
  { id: 'greetings', label: 'Salutations', icon: '👋', color: '#007A5E' },
  { id: 'family', label: 'La Famille', icon: '👨‍👩‍👧', color: '#FF8F00' },
  { id: 'animals', label: 'Les Animaux', icon: '🦁', color: '#558B2F' },
  { id: 'food', label: 'Nourriture', icon: '🍲', color: '#CE1126' },
  { id: 'numbers', label: 'Les Chiffres', icon: '🔢', color: '#1E88E5' },
  { id: 'colors', label: 'Les Couleurs', icon: '🎨', color: '#8E24AA' },
  { id: 'body', label: 'Corps humain', icon: '🫀', color: '#D84315' },
  { id: 'market', label: 'Le Marché', icon: '🛒', color: '#FCD116' },
  { id: 'nature', label: 'La Nature', icon: '🌿', color: '#00838F' },
  { id: 'proverbs', label: 'Proverbes', icon: '📖', color: '#6D4C41' },
];

export const XP_LEVELS = [
  { name: 'novice', label: 'Novice', minXp: 0, maxXp: 99, emoji: '🐣' },
  { name: 'apprenti', label: 'Apprenti', minXp: 100, maxXp: 499, emoji: '🦜' },
  { name: 'intermediaire', label: 'Intermédiaire', minXp: 500, maxXp: 1499, emoji: '🦁' },
  { name: 'expert', label: 'Expert', minXp: 1500, maxXp: 3999, emoji: '🦅' },
  { name: 'maitre', label: 'Maître', minXp: 4000, maxXp: Infinity, emoji: '👑' },
];
