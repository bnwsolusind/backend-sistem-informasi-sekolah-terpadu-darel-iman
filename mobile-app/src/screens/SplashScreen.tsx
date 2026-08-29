import React from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import BrandEmblem from '../components/BrandEmblem';
import BrandPattern from '../components/BrandPattern';
import { useMobileConfigStore } from '../stores/mobileConfigStore';

export default function SplashScreen() {
  const config = useMobileConfigStore((state) => state.config);
  return (
    <View style={[styles.screen, { backgroundColor: config.branding.splash_background_color }]}>
      <BrandPattern opacity={0.1} />
      <View style={styles.glow} />

      <View style={styles.content}>
        {config.branding.logo_url
          ? <Image source={{ uri: config.branding.logo_url }} style={styles.logo} resizeMode="contain" />
          : <BrandEmblem size={164} />}
        <Text style={styles.title}>{config.branding.app_name}</Text>
        <Text style={styles.subtitle}>{config.branding.school_name}</Text>
        <ActivityIndicator size="large" color={config.theme.secondary_color} style={styles.loader} />
      </View>

      <Text style={styles.location}>Padang  •  Sumbur  •  Indonesia</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#004B3A',
  },
  glow: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 180,
    top: -170,
    right: -150,
    backgroundColor: '#0C7659',
    opacity: 0.35,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 38,
  },
  logo: { width: 164, height: 164, marginBottom: 8 },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    color: '#E4FFF4',
    fontSize: 17,
    marginTop: 12,
  },
  loader: {
    marginTop: 38,
  },
  location: {
    position: 'absolute',
    bottom: 28,
    left: 0,
    right: 0,
    color: '#E4FFF4',
    fontSize: 12,
    textAlign: 'center',
  },
});
