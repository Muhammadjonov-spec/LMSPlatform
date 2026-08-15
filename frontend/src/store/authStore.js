import { create } from 'zustand';
import secureLocalStorage from 'react-secure-storage';
import { STRORAGE_KEY } from '../utils/const';

// Session object dan user, token, role ni olish
const getSessionData = () => {
  try {
    const session = secureLocalStorage.getItem(STRORAGE_KEY);
    if (!session) return { user: null, token: null, role: null };
    // mockData format: { data: { token, role, user } }
    const data = session?.data || session;
    return {
      user: data?.user || null,
      token: data?.token || null,
      role: data?.role || null,
    };
  } catch {
    return { user: null, token: null, role: null };
  }
};

export const useAuthStore = create((set) => ({
  ...getSessionData(),

  login: (sessionData) => {
    // sessionData: { token, role, user } yoki { data: { token, role, user } }
    const data = sessionData?.data || sessionData;
    secureLocalStorage.setItem(STRORAGE_KEY, sessionData);
    set({
      user: data?.user || null,
      token: data?.token || null,
      role: data?.role || null,
    });
  },

  logout: () => {
    secureLocalStorage.removeItem(STRORAGE_KEY);
    set({ user: null, token: null, role: null });
  },
}));

