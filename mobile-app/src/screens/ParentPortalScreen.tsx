import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getApiErrorMessage } from '../services/api';
import { mobileApiService, unwrapApiData } from '../services/mobileApiService';

type Child = Record<string, any>;
type ParentDashboard = Record<string, any>;

const childName = (child: Child): string => child.full_name || child.name || 'Siswa';
const className = (child: Child): string => child.kelas?.nama_kelas || child.kelas?.name || 'Kelas belum ditentukan';

export default function ParentPortalScreen() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [dashboard, setDashboard] = useState<ParentDashboard>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reason, setReason] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const childResponse = await mobileApiService.getPortalChildren();
      const available = (unwrapApiData<Child[]>(childResponse) || []);
      const activeId = selectedId || available[0]?.id;
      setChildren(available);
      if (activeId) {
        setSelectedId(String(activeId));
        const dashboardResponse = await mobileApiService.getPortalDashboard(String(activeId));
        setDashboard(unwrapApiData<ParentDashboard>(dashboardResponse) || {});
      } else {
        setDashboard({});
      }
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Data portal orang tua belum berhasil dimuat.'));
    } finally {
      setLoading(false);
    }
  }, [selectedId]);

  useEffect(() => {
    void load();
  }, [load]);

  const selectChild = async (id: string) => {
    setSelectedId(id);
    setLoading(true);
    setError('');
    try {
      setDashboard(unwrapApiData<ParentDashboard>(await mobileApiService.getPortalDashboard(id)) || {});
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Dashboard anak belum berhasil dimuat.'));
    } finally {
      setLoading(false);
    }
  };

  const submitPermission = async () => {
    if (!selectedId || !reason.trim()) {
      Alert.alert('Data belum lengkap', 'Pilih anak dan tuliskan alasan pengajuan.');
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    try {
      await mobileApiService.submitPortalPermission({ child_id: selectedId, type: 'Izin', start_date: today, end_date: today, reason: reason.trim() });
      setReason('');
      Alert.alert('Pengajuan terkirim', 'Pengajuan izin sudah menunggu verifikasi sekolah.');
    } catch (requestError) {
      Alert.alert('Pengajuan gagal', getApiErrorMessage(requestError, 'Pengajuan belum berhasil dikirim.'));
    }
  };

  const kpi = dashboard?.kpi || {};
  const student = dashboard?.student || children.find((child) => String(child.id) === selectedId);
  const schedules = Array.isArray(dashboard?.schedules_today) ? dashboard.schedules_today : [];
  const assignments = Array.isArray(dashboard?.active_assignments) ? dashboard.active_assignments : [];
  const grades = Array.isArray(dashboard?.latest_grades) ? dashboard.latest_grades : [];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={loading} onRefresh={() => void load()} colors={['#0E5C44']} />}>
      <View style={styles.hero}><Text style={styles.eyebrow}>PORTAL ORANG TUA</Text><Text style={styles.title}>Pantau perkembangan anak</Text><Text style={styles.subtitle}>Kehadiran, tugas, nilai, dan informasi sekolah dari endpoint `/api/portal/*`.</Text></View>
      {error ? <View style={styles.error}><Text style={styles.errorText}>{error}</Text><TouchableOpacity onPress={() => void load()}><Text style={styles.retry}>Muat ulang</Text></TouchableOpacity></View> : null}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.children}>{children.map((child) => <TouchableOpacity key={String(child.id)} onPress={() => void selectChild(String(child.id))} style={[styles.child, String(child.id) === selectedId && styles.childActive]}><MaterialCommunityIcons name="account-child-circle" size={26} color={String(child.id) === selectedId ? '#FFFFFF' : '#0E5C44'} /><View><Text style={[styles.childName, String(child.id) === selectedId && styles.white]}>{childName(child)}</Text><Text style={[styles.childMeta, String(child.id) === selectedId && styles.white]}>{className(child)}</Text></View></TouchableOpacity>)}</ScrollView>

      {loading && !student ? <ActivityIndicator color="#0E5C44" style={styles.loader} /> : <View style={styles.body}>
        <View style={styles.studentBanner}><View><Text style={styles.studentLabel}>SISWA TERPILIH</Text><Text style={styles.studentName}>{childName(student || {})}</Text><Text style={styles.studentMeta}>{className(student || {})} · NIS {student?.nis || '-'}</Text></View><MaterialCommunityIcons name="school-outline" size={34} color="#047857" /></View>
        <View style={styles.attendance}><Text style={styles.attendanceLabel}>Kehadiran hari ini</Text><Text style={styles.attendanceValue}>{dashboard?.attendance_today || 'Belum diinput'}</Text></View>
        <View style={styles.grid}>{[['Jadwal', kpi.schedules_today_count ?? 0], ['Tugas aktif', kpi.active_assignments_count ?? 0], ['Total ayat', kpi.total_tahfizh_ayat ?? 0], ['Mutabaah', kpi.mutabaah_status || 'Belum diisi']].map(([label, value]) => <View key={String(label)} style={styles.kpi}><Text style={styles.kpiLabel}>{String(label)}</Text><Text style={styles.kpiValue}>{String(value)}</Text></View>)}</View>

        <Text style={styles.sectionTitle}>Jadwal hari ini</Text><View style={styles.card}>{schedules.length ? schedules.slice(0, 5).map((item: any, index: number) => <View key={String(item.id || index)} style={styles.listRow}><Text style={styles.listTitle}>{item.subject?.name || item.subject?.nama_mapel || 'Mata pelajaran'}</Text><Text style={styles.listMeta}>{item.time_start || '-'} - {item.time_end || '-'} · {item.kelas?.nama_kelas || item.kelas?.name || 'Kelas'}</Text></View>) : <Text style={styles.empty}>Belum ada jadwal hari ini.</Text>}</View>
        <Text style={styles.sectionTitle}>Tugas aktif</Text><View style={styles.card}>{assignments.length ? assignments.slice(0, 5).map((item: any, index: number) => <View key={String(item.id || index)} style={styles.listRow}><Text style={styles.listTitle}>{item.judul || 'Tugas pembelajaran'}</Text><Text style={styles.listMeta}>Deadline: {item.deadline || '-'}</Text></View>) : <Text style={styles.empty}>Belum ada tugas aktif.</Text>}</View>
        <Text style={styles.sectionTitle}>Nilai terbaru</Text><View style={styles.card}>{grades.length ? grades.slice(0, 5).map((item: any, index: number) => <View key={String(item.id || index)} style={styles.gradeRow}><Text style={styles.listTitle}>{item.subject?.name || item.subject?.nama_mapel || 'Mata pelajaran'}</Text><Text style={styles.grade}>{item.final_score ?? item.nilai_akhir ?? item.score ?? '-'}</Text></View>) : <Text style={styles.empty}>Belum ada nilai.</Text>}</View>
        <Text style={styles.sectionTitle}>Ajukan izin / sakit</Text><View style={styles.card}><TextInput value={reason} onChangeText={setReason} multiline placeholder="Tuliskan alasan pengajuan..." placeholderTextColor="#94A3B8" style={styles.input} /><TouchableOpacity onPress={() => void submitPermission()} style={styles.button}><Text style={styles.buttonText}>Kirim pengajuan</Text></TouchableOpacity></View>
      </View>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F7F9FC' },
  content: { paddingBottom: 30 },
  hero: { backgroundColor: '#0E5C44', padding: 22, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  eyebrow: { color: '#6EE7B7', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  title: { color: '#FFFFFF', fontSize: 21, fontWeight: '800', marginTop: 5 },
  subtitle: { color: '#D1FAE5', fontSize: 12, lineHeight: 17, marginTop: 4 },
  error: { margin: 16, padding: 14, borderRadius: 12, backgroundColor: '#FEF2F2' },
  errorText: { color: '#B91C1C', fontSize: 12 },
  retry: { color: '#0E5C44', fontWeight: '800', fontSize: 12, marginTop: 8 },
  children: { padding: 16, gap: 10 },
  child: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 15, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0' },
  childActive: { backgroundColor: '#1E8E5A', borderColor: '#1E8E5A' },
  childName: { color: '#0F172A', fontSize: 13, fontWeight: '800' },
  childMeta: { color: '#64748B', fontSize: 11, marginTop: 2 },
  white: { color: '#FFFFFF' },
  loader: { margin: 40 },
  body: { paddingHorizontal: 16 },
  studentBanner: { backgroundColor: '#D1FAE5', padding: 16, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  studentLabel: { color: '#047857', fontSize: 10, fontWeight: '800' },
  studentName: { color: '#065F46', fontSize: 18, fontWeight: '900', marginTop: 3 },
  studentMeta: { color: '#047857', fontSize: 11, marginTop: 3 },
  attendance: { marginTop: 12, backgroundColor: '#FFFFFF', borderRadius: 15, padding: 15 },
  attendanceLabel: { color: '#64748B', fontSize: 11 },
  attendanceValue: { color: '#0E5C44', fontSize: 19, fontWeight: '900', marginTop: 3 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  kpi: { width: '48%', padding: 14, borderRadius: 15, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0' },
  kpiLabel: { color: '#64748B', fontSize: 11 },
  kpiValue: { color: '#0E5C44', fontSize: 20, fontWeight: '900', marginTop: 4 },
  sectionTitle: { color: '#0F172A', fontSize: 15, fontWeight: '800', marginTop: 18, marginBottom: 9 },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  listRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  listTitle: { color: '#0F172A', fontSize: 13, fontWeight: '800' },
  listMeta: { color: '#64748B', fontSize: 11, marginTop: 3 },
  gradeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  grade: { color: '#0E5C44', fontSize: 18, fontWeight: '900' },
  empty: { color: '#94A3B8', fontSize: 12 },
  input: { minHeight: 80, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, padding: 12, textAlignVertical: 'top', color: '#0F172A' },
  button: { marginTop: 10, backgroundColor: '#0E5C44', borderRadius: 12, padding: 13, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontWeight: '800' },
});
