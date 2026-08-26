import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthUser {
  id?: string;
  name?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  photo_url?: string | null;
  avatar_url?: string | null;
  unit?: string | null;
  roles?: string[];
  permissions?: string[];
  scope?: {
    unit_id?: string | null;
    employee_id?: string | null;
    student_id?: string | null;
    parent_id?: string | null;
  };
  metadata?: Record<string, unknown> | null;
  [key: string]: unknown;
}

export interface SessionPayload {
  token: string;
  user?: AuthUser | null;
  roles?: string[];
  permissions?: string[];
  portal?: string | null;
  scope?: AuthUser['scope'];
}

const SESSION_KEY = 'sims-mobile-session';

type PersistedSession = Omit<SessionPayload, 'token'> & { token: string };

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  roles: string[];
  permissions: string[];
  portal: string | null;
  scope: AuthUser['scope'] | null;
  isHydrated: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  setRoles: (roles: string[]) => void;
  setPermissions: (permissions: string[]) => void;
  setSession: (session: SessionPayload) => void;
  hydrate: () => Promise<void>;
  clearSession: () => void;
};

const persistSession = (session: PersistedSession | null): void => {
  if (session) {
    void AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } else {
    void AsyncStorage.removeItem(SESSION_KEY);
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  roles: [],
  permissions: [],
  portal: null,
  scope: null,
  isHydrated: false,
  setToken: (token) => {
    set({ token });
    if (!token) persistSession(null);
  },
  setUser: (user) => set({ user }),
  setRoles: (roles) => set({ roles }),
  setPermissions: (permissions) => set({ permissions }),
  setSession: (session) => {
    const persisted: PersistedSession = {
      token: session.token,
      user: session.user ?? null,
      roles: session.roles ?? [],
      permissions: session.permissions ?? [],
      portal: session.portal ?? null,
      scope: session.scope ?? session.user?.scope,
    };

    set({
      token: persisted.token,
      user: persisted.user ?? null,
      roles: persisted.roles ?? [],
      permissions: persisted.permissions ?? [],
      portal: persisted.portal ?? null,
      scope: persisted.scope ?? null,
    });
    persistSession(persisted);
  },
  hydrate: async () => {
    try {
      const stored = await AsyncStorage.getItem(SESSION_KEY);
      if (stored) {
        const session = JSON.parse(stored) as PersistedSession;
        if (session.token) {
          set({
            token: session.token,
            user: session.user ?? null,
            roles: session.roles ?? [],
            permissions: session.permissions ?? [],
            portal: session.portal ?? null,
            scope: session.scope ?? session.user?.scope ?? null,
          });
        }
      }
    } catch {
      persistSession(null);
    } finally {
      set({ isHydrated: true });
    }
  },
  clearSession: () => {
    set({ token: null, user: null, roles: [], permissions: [], portal: null, scope: null });
    persistSession(null);
  },
}));
