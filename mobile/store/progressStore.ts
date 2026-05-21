import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VocabularyItem } from '../hooks/useQueries';

export interface LessonProgress {
  lessonId: string;
  languageId: string;
  completedAt: string;
  xpEarned: number;
}

interface ProgressState {
  completedLessons: LessonProgress[];
  totalXp: number;
  currentStreak: number;
  lastActiveDate: string | null;
  wordsToReview: VocabularyItem[];
  addCompletedLesson: (lessonId: string, languageId: string, xpEarned: number) => void;
  hasCompletedLesson: (lessonId: string) => boolean;
  getCompletedCountByLanguage: (languageId: string) => number;
  markActivity: () => void;
  addWordToReview: (word: VocabularyItem) => void;
  removeWordFromReview: (wordId: string) => void;
  // Défi Quotidien
  dailyChallengeDate: string | null; // date ISO du défi en cours
  dailyChallengeIndex: number; // index du type de défi
  dailyChallengeCompleted: boolean;
  dailyChallengeScore: number; // score en pourcentage
  dailyChallengeXp: number;
  getDailyChallenge: () => { index: number; completed: boolean; score: number; xp: number };
  completeDailyChallenge: (xpBonus: number, score: number) => void;
  resetProgress: () => void;
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedLessons: [],
      totalXp: 0,
      currentStreak: 0,
      lastActiveDate: null,
      wordsToReview: [],
      dailyChallengeDate: null,
      dailyChallengeIndex: 0,
      dailyChallengeCompleted: false,
      dailyChallengeScore: 0,
      dailyChallengeXp: 0,
      
      getDailyChallenge: () => {
        const { dailyChallengeDate, dailyChallengeIndex, dailyChallengeCompleted, dailyChallengeScore, dailyChallengeXp } = get();
        const today = new Date().toISOString().split('T')[0];
        
        if (dailyChallengeDate !== today) {
          // Nouveau jour = nouveau défi aléatoire
          const newIndex = Math.floor(Math.random() * 6); // 6 types de défis
          set({ dailyChallengeDate: today, dailyChallengeIndex: newIndex, dailyChallengeCompleted: false, dailyChallengeScore: 0, dailyChallengeXp: 0 });
          return { index: newIndex, completed: false, score: 0, xp: 0 };
        }
        return { index: dailyChallengeIndex, completed: dailyChallengeCompleted, score: dailyChallengeScore, xp: dailyChallengeXp };
      },

      completeDailyChallenge: (xpBonus, score) => {
        const { totalXp } = get();
        set({ dailyChallengeCompleted: true, dailyChallengeScore: score, dailyChallengeXp: xpBonus, totalXp: totalXp + xpBonus });
        get().markActivity();
      },
      
      addWordToReview: (word) => {
        const { wordsToReview } = get();
        if (!wordsToReview.find(w => w._id === word._id)) {
          set({ wordsToReview: [...wordsToReview, word] });
        }
      },

      removeWordFromReview: (wordId) => {
        set({ wordsToReview: get().wordsToReview.filter(w => w._id !== wordId) });
      },
      
      addCompletedLesson: (lessonId, languageId, xpEarned) => {
        get().markActivity(); // Toute complétion compte comme une activité
        const { completedLessons, totalXp } = get();
        
        // Evite les doublons stricte
        if (!completedLessons.some(l => l.lessonId === lessonId)) {
          set({
            completedLessons: [...completedLessons, { 
              lessonId, 
              languageId, 
              completedAt: new Date().toISOString(), 
              xpEarned 
            }],
            totalXp: totalXp + xpEarned
          });
        }
      },
      
      hasCompletedLesson: (lessonId) => {
        return get().completedLessons.some(l => l.lessonId === lessonId);
      },
      
      getCompletedCountByLanguage: (languageId) => {
        return get().completedLessons.filter(l => l.languageId === languageId).length;
      },

      markActivity: () => {
        const { lastActiveDate, currentStreak } = get();
        const today = new Date().toISOString().split('T')[0]; // ex: 2026-05-09
        
        if (!lastActiveDate) {
           set({ lastActiveDate: today, currentStreak: 1 });
           return;
        }

        const lastDate = new Date(lastActiveDate);
        const currentDate = new Date(today);
        const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays === 1) {
           // C'est le jour d'après, on incrémente la streak
           set({ lastActiveDate: today, currentStreak: currentStreak + 1 });
        } else if (diffDays > 1) {
           // Streak brisée, on recommence à 1
           set({ lastActiveDate: today, currentStreak: 1 });
        }
        // Si diffDays === 0, on a déjà marqué l'activité aujourd'hui, on ne fait rien
      },

      resetProgress: () => {
        set({
          completedLessons: [],
          totalXp: 0,
          currentStreak: 0,
          lastActiveDate: null,
          wordsToReview: [],
          dailyChallengeDate: null,
          dailyChallengeIndex: 0,
          dailyChallengeCompleted: false,
          dailyChallengeScore: 0,
          dailyChallengeXp: 0,
        });
      }
    }),
    {
      name: 'nkolo-progress-storage', // nom unique dans AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
