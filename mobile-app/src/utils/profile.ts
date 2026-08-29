import { API_BASE_URL } from '../services/api';

export const getProfileImageUrl = (user: any, dashboard?: any): string | null => {
  if (!user && !dashboard) return null;

  const rawUrl =
    user?.photo_url ||
    user?.avatar_url ||
    user?.profile_photo_url ||
    user?.avatar ||
    user?.foto_url ||
    user?.foto ||
    user?.photo ||
    user?.image ||
    user?.employee?.foto_url ||
    user?.employee?.foto ||
    user?.employee?.avatar ||
    user?.student?.foto_url ||
    user?.student?.foto ||
    user?.student?.avatar ||
    dashboard?.user?.photo_url ||
    dashboard?.user?.avatar_url ||
    dashboard?.user?.avatar ||
    dashboard?.employee?.foto_url ||
    dashboard?.employee?.foto ||
    dashboard?.student?.foto_url ||
    dashboard?.student?.foto ||
    null;

  if (!rawUrl || typeof rawUrl !== 'string' || rawUrl.trim() === '') return null;

  const cleanRawUrl = rawUrl.trim();
  const apiHost = API_BASE_URL.replace(/\/api\/?$/, '');

  // If already an absolute URL (http://, https://, or data URI)
  if (cleanRawUrl.startsWith('http://') || cleanRawUrl.startsWith('https://') || cleanRawUrl.startsWith('data:')) {
    // Replace localhost or 127.0.0.1 with API server host
    return cleanRawUrl.replace(/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i, apiHost);
  }

  // Relative path stored in database (e.g. "storage/avatars/1.jpg" or "/storage/...")
  const cleanPath = cleanRawUrl.startsWith('/') ? cleanRawUrl : `/${cleanRawUrl}`;
  return `${apiHost}${cleanPath}`;
};
