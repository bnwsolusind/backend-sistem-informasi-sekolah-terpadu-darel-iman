import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

// Android Emulator maps the host machine's localhost to 10.0.2.2.
// Physical devices should use the computer's LAN address through EXPO_PUBLIC_API_URL.
export const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:8000/api'
).replace(/\/$/, '');

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 10000,
});

// Interceptor untuk menyisipkan Token Authorization Sanctum
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor response handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearSession();
    }
    return Promise.reject(error);
  }
);

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as {
      message?: string;
      errors?: Record<string, string[] | string>;
    } | undefined;

    if (payload?.message) return payload.message;

    const firstError = payload?.errors && Object.values(payload.errors)[0];
    if (Array.isArray(firstError) && firstError[0]) return firstError[0];
    if (typeof firstError === 'string') return firstError;
  }

  return fallback;
};
