import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
  userName: string | null;
  setUserName: (name: string) => void;
  resetUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      userName: null,

      setUserName: (name: string) => {
        set({ userName: name.trim() });
      },

      resetUser: () => {
        set({ userName: null });
      },
    }),
    {
      name: 'nkolo-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
