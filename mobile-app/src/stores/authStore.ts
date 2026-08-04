import { create } from 'zustand';

type AuthState = {
  token: string | null;
  roles: string[];
  setToken: (token: string | null) => void;
  setRoles: (roles: string[]) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  roles: [],
  setToken: (token) => set({ token }),
  setRoles: (roles) => set({ roles }),
}));
