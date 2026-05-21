import { create } from 'zustand';

interface LanguageState {
  selectedLanguageId: string | null;
  setLanguage: (id: string) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  selectedLanguageId: 'ewondo', // par defaut pour la demo
  setLanguage: (id) => set({ selectedLanguageId: id }),
}));
