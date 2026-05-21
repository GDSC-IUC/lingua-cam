// Nkolo Design System — Color Tokens

export const Colors = {
  // ── Brand primaire (drapeau camerounais)
  primary: '#007A5E',       // Vert Cameroun
  primaryLight: '#00A87F',
  primaryDark: '#005A44',

  secondary: '#CE1126',     // Rouge Cameroun
  secondaryLight: '#FF3347',
  secondaryDark: '#A00D1E',

  accent: '#FCD116',        // Jaune Cameroun
  accentLight: '#FFE35A',
  accentDark: '#C9A800',

  // ── Tons africains
  ochre: '#D4845A',
  earth: '#8B4513',
  cream: '#FFF8DC',
  sand: '#F5DEB3',

  // ── Neutres
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // ── Feedback
  success: '#22C55E',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',

  // ── Dark mode backgrounds
  dark: {
    bg: '#0F1B17',
    surface: '#1A2E25',
    card: '#243D32',
    border: '#2D4F3E',
  },

  // ── Light mode backgrounds
  light: {
    bg: '#F7FBF9',
    surface: '#FFFFFF',
    card: '#F0F7F4',
    border: '#D1E8DF',
  },

  // ── Régions Cameroun (pour la carte)
  regions: {
    centre: '#007A5E',
    littoral: '#1E88E5',
    ouest: '#8E24AA',
    nord: '#FF8F00',
    adamaoua: '#D84315',
    sud: '#558B2F',
    est: '#6D4C41',
    nordOuest: '#00838F',
    sudOuest: '#F4511E',
    extremeNord: '#F9A825',
  },
} as const;

export type ColorKey = keyof typeof Colors;
