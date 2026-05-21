const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const API = {
  BASE_URL,

  // Auth
  AUTH: {
    REGISTER: `${BASE_URL}/auth/register`,
    LOGIN: `${BASE_URL}/auth/login`,
    GUEST: `${BASE_URL}/auth/guest`,
    REFRESH: `${BASE_URL}/auth/refresh`,
    LOGOUT: `${BASE_URL}/auth/logout`,
    ME: `${BASE_URL}/auth/me`,
  },

  // Languages
  LANGUAGES: {
    ALL: `${BASE_URL}/languages`,
    BY_ID: (id: string) => `${BASE_URL}/languages/${id}`,
    LESSONS: (id: string) => `${BASE_URL}/languages/${id}/lessons`,
  },

  // Lessons
  LESSONS: {
    BY_ID: (id: string) => `${BASE_URL}/lessons/${id}`,
    QUIZ: (id: string) => `${BASE_URL}/lessons/${id}/quiz`,
    COMPLETE: (id: string) => `${BASE_URL}/lessons/${id}/complete`,
  },

  // Progress
  PROGRESS: {
    ME: `${BASE_URL}/progress/me`,
    BY_LANGUAGE: (id: string) => `${BASE_URL}/progress/me/language/${id}`,
    STREAK: `${BASE_URL}/progress/streak`,
  },

  // Dictionary
  DICTIONARY: {
    SEARCH: `${BASE_URL}/dictionary`,
  },

  // Stories
  STORIES: {
    ALL: `${BASE_URL}/stories`,
    BY_ID: (id: string) => `${BASE_URL}/stories/${id}`,
  },

  // Songs
  SONGS: {
    ALL: `${BASE_URL}/songs`,
    BY_ID: (id: string) => `${BASE_URL}/songs/${id}`,
  },
} as const;
