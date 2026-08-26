import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Avatar,
  Button,
  Card,
  Divider,
  List,
  Surface,
  Text,
} from 'react-native-paper';
import { mobileApiService } from '../services/mobileApiService';
import { AuthUser, useAuthStore } from '../stores/authStore';
import { roleLabel } from '../utils/roles';

const displayValue = (value: unknown, fallback = '-') => value ? String(value) : fallback;

export default function ProfilScreen() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const roles = useAuthStore((state) => state.roles);
  const scope = useAuthStore((state) => state.scope);
  const setUser = useAuthStore((state) => state.setUser);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    mobileApiService.getProfile().then((response) => {
      const profile = response?.data?.data ?? response?.data ?? response;
      if (profile) setUser(profile as AuthUser);
    }).catch(() => {
      // Profile data from the authenticated session is still displayed while offline.
    }).finally(() => setLoading(false));
  }, [setUser, token]);

  const employee = (user?.employee || {}) as Record<string, any>;
  const unit = user?.unit || employee?.unit?.name;
  const name = user?.name || user?.fullName || 'Pengguna';
  const avatarLabel = name.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    Alert.alert('Keluar dari aplikasi', 'Sesi pada perangkat ini akan dihapus.', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Keluar',
        style: 'destructive',
        onPress: async () => {
          try {
            await mobileApiService.logout();
          } catch {
            // A locally expired token should not prevent the user from leaving the app.
          } finally {
            clearSession();
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Surface style={styles.profileHeader} elevation={1}>
          <Avatar.Text size={72} label={avatarLabel} style={styles.avatar} color="#FFFFFF" />
          <Text variant="titleLarge" style={styles.name}>{name}</Text>
          <Text style={styles.email}>{displayValue(user?.email)}</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>{roleLabel(roles)}</Text></View>
          {loading ? <ActivityIndicator size="small" color="#0E5C44" style={styles.refreshIndicator} /> : null}
        </Surface>

        <Card style={styles.card}><Card.Content><Text variant="titleMedium" style={styles.sectionTitle}>Identitas akun</Text><Divider style={styles.divider} />
          <List.Item title="Nomor telepon" description={displayValue(user?.phone || employee?.no_hp)} left={(props) => <List.Icon {...props} icon="phone-outline" color="#0E5C44" />} />
          <List.Item title="Unit / sekolah" description={displayValue(unit)} left={(props) => <List.Icon {...props} icon="domain" color="#0E5C44" />} />
          <List.Item title="ID pegawai / siswa" description={displayValue(scope?.employee_id || scope?.student_id || employee?.niy)} left={(props) => <List.Icon {...props} icon="card-account-details-outline" color="#0E5C44" />} />
          <List.Item title="Cakupan akun" description={displayValue(scope?.unit_id, 'Seluruh unit sesuai permission')} left={(props) => <List.Icon {...props} icon="shield-check-outline" color="#0E5C44" />} />
        </Card.Content></Card>

        <Card style={styles.card}><Card.Content><Text variant="titleMedium" style={styles.sectionTitle}>Bantuan sesi</Text><Divider style={styles.divider} /><Text style={styles.help}>Token autentikasi disimpan lokal agar aplikasi Android dapat dibuka kembali tanpa login berulang. Logout akan mencabut token aktif melalui `/auth/logout`.</Text></Card.Content></Card>

        <Button mode="outlined" icon="logout" onPress={handleLogout} textColor="#B91C1C" style={styles.logout}>Keluar dari akun</Button>
        <Text style={styles.version}>SIMS Mobile Android · API Laravel Sanctum</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F9FC' },
  content: { padding: 16, paddingBottom: 32 },
  profileHeader: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 22, alignItems: 'center' },
  avatar: { backgroundColor: '#0E5C44' },
  name: { color: '#0F172A', fontWeight: '800', marginTop: 12 },
  email: { color: '#64748B', fontSize: 12, marginTop: 3 },
  badge: { backgroundColor: '#D1FAE5', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginTop: 12 },
  badgeText: { color: '#047857', fontSize: 11, fontWeight: '800' },
  refreshIndicator: { marginTop: 10 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, marginTop: 14 },
  sectionTitle: { color: '#0F172A', fontWeight: '800' },
  divider: { marginVertical: 8 },
  help: { color: '#64748B', fontSize: 12, lineHeight: 19 },
  logout: { borderColor: '#FCA5A5', borderRadius: 12, marginTop: 18 },
  version: { textAlign: 'center', color: '#94A3B8', fontSize: 11, marginTop: 16 },
});
