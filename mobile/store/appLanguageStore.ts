import { create } from 'zustand';
import { en } from '../i18n/en';
import { fr } from '../i18n/fr';

export type AppLanguage = 'en' | 'fr';

interface AppLanguageState {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: string) => string;
}

const translations = {
  en,
  fr,
};

export const useAppLanguageStore = create<AppLanguageState>((set, get) => ({
  language: 'en', // Default language
  setLanguage: (lang) => set({ language: lang }),
  t: (key: string) => {
    const lang = get().language;
    const keys = key.split('.');
    let value: any = translations[lang];
    for (const k of keys) {
      if (value) {
        value = value[k];
      }
    }
    return value || key;
  },
}));
