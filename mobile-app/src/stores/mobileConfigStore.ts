import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { api } from '../services/api';

export type MobileThemeConfig = {
  primary_color: string; secondary_color: string; background_color: string;
  background_gradient_enabled: boolean; background_gradient_start: string; background_gradient_end: string;
  background_gradient_direction: 'vertical' | 'horizontal' | 'diagonal';
  surface_color: string; text_color: string; muted_text_color: string;
  font_family: 'system' | 'Poppins' | 'Nunito'; font_scale: 'compact' | 'normal' | 'large';
  button_radius: number; card_radius: number;
};
export type MobileAppConfig = {
  platform: 'android'; version: number;
  theme: MobileThemeConfig;
  branding: { app_name: string; school_name: string; logo_url: string | null; splash_background_color: string };
  navigation: { style: 'bottom_tabs'; show_labels: boolean; items: Array<{ key: string; label: string; icon: string; enabled: boolean; order: number }> };
  home_layout: { template: 'dashboard_default' | 'dashboard_compact'; sections: Array<{ type: string; enabled: boolean; order: number }> };
  role_home_layouts: Record<string, MobileAppConfig['home_layout']>;
};

export const DEFAULT_MOBILE_CONFIG: MobileAppConfig = {
  platform: 'android', version: 1,
  theme: { primary_color: '#0E5C44', secondary_color: '#10B981', background_color: '#F7F9FC', background_gradient_enabled: true, background_gradient_start: '#F7FCFA', background_gradient_end: '#EAF8F2', background_gradient_direction: 'diagonal', surface_color: '#FFFFFF', text_color: '#0F172A', muted_text_color: '#64748B', font_family: 'system', font_scale: 'normal', button_radius: 14, card_radius: 18 },
  branding: { app_name: 'Sistem Manajemen Sekolah Terpadu', school_name: 'Yayasan Dar el-Iman', logo_url: null, splash_background_color: '#004B3A' },
  navigation: { style: 'bottom_tabs', show_labels: true, items: [
    { key: 'home', label: 'Beranda', icon: 'view-dashboard-outline', enabled: true, order: 1 }, { key: 'notifications', label: 'Notifikasi', icon: 'bell-outline', enabled: true, order: 2 },
    { key: 'qr', label: 'QR Code', icon: 'qrcode-scan', enabled: true, order: 3 }, { key: 'profile', label: 'Profil', icon: 'account-circle-outline', enabled: true, order: 4 }, { key: 'more', label: 'Lainnya', icon: 'menu', enabled: true, order: 5 },
  ] },
  home_layout: { template: 'dashboard_default', sections: [
    { type: 'announcements', enabled: true, order: 1 }, { type: 'quick_menu', enabled: true, order: 2 }, { type: 'metrics', enabled: true, order: 3 }, { type: 'schedule', enabled: true, order: 4 },
  ] },
  role_home_layouts: Object.fromEntries(Object.entries({
    super_admin: ['announcements', 'quick_menu', 'metrics', 'schedule'], foundation: ['metrics', 'announcements', 'schedule', 'quick_menu'],
    principal: ['metrics', 'schedule', 'announcements', 'quick_menu'], teacher: ['schedule', 'quick_menu', 'metrics', 'announcements'],
    parent: ['announcements', 'quick_menu', 'schedule', 'metrics'], student: ['schedule', 'quick_menu', 'announcements', 'metrics'],
    staff: ['quick_menu', 'metrics', 'announcements', 'schedule'],
  }).map(([role, sections]) => [role, { template: 'dashboard_default', sections: sections.map((type, index) => ({ type, enabled: true, order: index + 1 })) }])) as MobileAppConfig['role_home_layouts'],
};

const CACHE_KEY = 'sims-android-ui-config-v1';
const mergeConfig = (value?: Partial<MobileAppConfig>): MobileAppConfig => ({
  ...DEFAULT_MOBILE_CONFIG, ...value,
  theme: { ...DEFAULT_MOBILE_CONFIG.theme, ...(value?.theme || {}) },
  branding: { ...DEFAULT_MOBILE_CONFIG.branding, ...(value?.branding || {}) },
  navigation: { ...DEFAULT_MOBILE_CONFIG.navigation, ...(value?.navigation || {}) },
  home_layout: { ...DEFAULT_MOBILE_CONFIG.home_layout, ...(value?.home_layout || {}) },
  role_home_layouts: { ...DEFAULT_MOBILE_CONFIG.role_home_layouts, ...(value?.role_home_layouts || {}) },
});

type ConfigState = { config: MobileAppConfig; isHydrated: boolean; hydrate: () => Promise<void>; refresh: () => Promise<void> };
export const useMobileConfigStore = create<ConfigState>((set) => ({
  config: DEFAULT_MOBILE_CONFIG, isHydrated: false,
  hydrate: async () => {
    try { const cached = await AsyncStorage.getItem(CACHE_KEY); if (cached) set({ config: mergeConfig(JSON.parse(cached)) }); } catch { /* fallback stays active */ }
    finally { set({ isHydrated: true }); }
  },
  refresh: async () => {
    try {
      const response = await api.get('/mobile/config');
      const config = mergeConfig(response.data?.data);
      set({ config });
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(config));
    } catch { /* cached or bundled configuration stays active while offline */ }
  },
}));
