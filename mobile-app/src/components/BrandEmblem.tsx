import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type BrandEmblemProps = {
  size?: number;
};

export default function BrandEmblem({ size = 96 }: BrandEmblemProps) {
  const ringSize = size - 12;

  return (
    <View
      accessible
      accessibilityLabel="Emblem SIMS Terpadu"
      style={[styles.emblem, { width: size, height: size, borderRadius: size / 2 }]}
    >
      <View style={[styles.ring, { width: ringSize, height: ringSize, borderRadius: ringSize / 2 }]}>
        <MaterialCommunityIcons
          name="star-four-points-outline"
          size={size * 0.68}
          color="#0C795A"
        />
        <View style={[styles.globe, { width: size * 0.42, height: size * 0.42, borderRadius: size * 0.21 }]}>
          <MaterialCommunityIcons name="earth" size={size * 0.28} color="#4D84B2" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emblem: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE8E3',
    shadowColor: '#001F17',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 5,
  },
  ring: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#9AC7B7',
  },
  globe: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E9F1F4',
  },
});
