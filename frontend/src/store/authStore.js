import { create } from 'zustand';
import secureLocalStorage from 'react-secure-storage';

export const useAuthStore = create((set) => ({
  user: secureLocalStorage.getItem('user') || null,
  token: secureLocalStorage.getItem('token') || null,
  role: secureLocalStorage.getItem('role') || null,

  login: (userData, token, role) => {
    secureLocalStorage.setItem('user', userData);
    secureLocalStorage.setItem('token', token);
    secureLocalStorage.setItem('role', role);
    set({ user: userData, token, role });
  },

  logout: () => {
    secureLocalStorage.removeItem('user');
    secureLocalStorage.removeItem('token');
    secureLocalStorage.removeItem('role');
    set({ user: null, token: null, role: null });
  },
}));
