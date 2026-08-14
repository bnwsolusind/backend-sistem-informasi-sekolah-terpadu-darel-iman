import { create } from 'zustand';

type AuthState = {
  token: string | null;
  roles: string[];
  permissions: string[];
  setToken: (token: string | null) => void;
  setRoles: (roles: string[]) => void;
  setPermissions: (permissions: string[]) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  roles: [],
  permissions: [],
  setToken: (token) => set({ token, roles: [], permissions: [] }),
  setRoles: (roles) => set({ roles }),
  setPermissions: (permissions) => set({ permissions }),
  clearSession: () => set({ token: null, roles: [], permissions: [] }),
}));
