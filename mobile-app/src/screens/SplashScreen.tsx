import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import BrandEmblem from '../components/BrandEmblem';
import BrandPattern from '../components/BrandPattern';

export default function SplashScreen() {
  return (
    <View style={styles.screen}>
      <BrandPattern opacity={0.1} />
      <View style={styles.glow} />

      <View style={styles.content}>
        <BrandEmblem size={164} />
        <Text style={styles.title}>Sistem Manajemen</Text>
        <Text style={styles.title}>Sekolah Terpadu</Text>
        <Text style={styles.subtitle}>Yayasan Dar el-Iman</Text>
        <ActivityIndicator size="large" color="#B5F2DA" style={styles.loader} />
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
