import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import BottomTabs from './src/navigation/BottomTabs';
import LoginScreen from './src/screens/LoginScreen';
import SplashScreen from './src/screens/SplashScreen';
import { useAuthStore } from './src/stores/authStore';

export default function App() {
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const hydrate = useAuthStore((state) => state.hydrate);
  const [splashReady, setSplashReady] = useState(false);

  useEffect(() => {
    void hydrate();

    const timer = setTimeout(() => setSplashReady(true), 1400);
    return () => clearTimeout(timer);
  }, [hydrate]);

  const showingSplash = !isHydrated || !splashReady;

  return (
    <PaperProvider
      theme={{
        ...MD3LightTheme,
        colors: {
          ...MD3LightTheme.colors,
          primary: '#0f5132',
          secondary: '#10b981',
          tertiary: '#f59e0b',
        },
      }}
    >
      {showingSplash ? <SplashScreen /> : token ? <BottomTabs /> : <LoginScreen />}
      <StatusBar style={showingSplash || !token ? 'light' : 'dark'} />
    </PaperProvider>
  );
}
