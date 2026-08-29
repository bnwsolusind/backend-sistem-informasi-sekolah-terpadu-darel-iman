import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, MD3LightTheme, configureFonts } from 'react-native-paper';
import { useFonts } from 'expo-font';
import { Poppins_400Regular } from '@expo-google-fonts/poppins/400Regular';
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins/600SemiBold';
import { Poppins_700Bold } from '@expo-google-fonts/poppins/700Bold';
import { Nunito_400Regular } from '@expo-google-fonts/nunito/400Regular';
import { Nunito_600SemiBold } from '@expo-google-fonts/nunito/600SemiBold';
import { Nunito_700Bold } from '@expo-google-fonts/nunito/700Bold';
import BottomTabs from './src/navigation/BottomTabs';
import LoginScreen from './src/screens/LoginScreen';
import SplashScreen from './src/screens/SplashScreen';
import { useAuthStore } from './src/stores/authStore';
import { useMobileConfigStore } from './src/stores/mobileConfigStore';

export default function App() {
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const hydrate = useAuthStore((state) => state.hydrate);
  const [splashReady, setSplashReady] = useState(false);
  const config = useMobileConfigStore((state) => state.config);
  const configHydrated = useMobileConfigStore((state) => state.isHydrated);
  const hydrateConfig = useMobileConfigStore((state) => state.hydrate);
  const refreshConfig = useMobileConfigStore((state) => state.refresh);
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_600SemiBold, Poppins_700Bold, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold });

  useEffect(() => {
    void hydrate();
    void hydrateConfig().then(refreshConfig);

    const timer = setTimeout(() => setSplashReady(true), 1400);
    return () => clearTimeout(timer);
  }, [hydrate, hydrateConfig, refreshConfig]);

  const showingSplash = !isHydrated || !configHydrated || !splashReady || !fontsLoaded;
  const fontFamily = config.theme.font_family === 'Poppins'
    ? 'Poppins_400Regular'
    : config.theme.font_family === 'Nunito' ? 'Nunito_400Regular' : undefined;
  const baseFonts = fontFamily ? configureFonts({ config: { fontFamily } }) : MD3LightTheme.fonts;
  const typeScale = config.theme.font_scale === 'compact' ? 0.92 : config.theme.font_scale === 'large' ? 1.1 : 1;
  const fonts = Object.fromEntries(Object.entries(baseFonts).map(([name, value]) => [name,
    'fontSize' in value ? { ...value, fontSize: value.fontSize * typeScale, lineHeight: value.lineHeight * typeScale } : value,
  ])) as unknown as typeof MD3LightTheme.fonts;

  return (
    <PaperProvider
      theme={{
        ...MD3LightTheme,
        fonts,
        colors: {
          ...MD3LightTheme.colors,
          primary: config.theme.primary_color,
          secondary: config.theme.secondary_color,
          tertiary: '#f59e0b',
          background: config.theme.background_color,
          surface: config.theme.surface_color,
          onSurface: config.theme.text_color,
        },
      }}
    >
      {showingSplash ? <SplashScreen /> : token ? <BottomTabs /> : <LoginScreen />}
      <StatusBar style={showingSplash || !token ? 'light' : 'dark'} />
    </PaperProvider>
  );
}
