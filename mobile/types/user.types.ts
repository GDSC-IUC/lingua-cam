export interface User {
  _id: string;
  username: string;
  email?: string;
  avatar: string;
  preferredLanguageId?: string;
  interfaceLang: 'fr' | 'en';
  isGuest: boolean;
  streak: number;
  totalXp: number;
  level: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface UserProgressSummary {
  totalXp: number;
  streak: number;
  level: string;
  completedLessons: number;
  byLanguage: LanguageProgress[];
}

export interface LanguageProgress {
  languageId: string;
  completedLessons: number;
  xp: number;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  score: number;
  xpEarned: number;
  attempts: number;
}
