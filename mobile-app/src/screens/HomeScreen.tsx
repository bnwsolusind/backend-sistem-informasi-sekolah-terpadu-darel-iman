import React, { useCallback, useEffect, useState } from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Divider,
  Surface,
  Text,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getApiErrorMessage } from '../services/api';
import { mobileApiService, unwrapApiData } from '../services/mobileApiService';
import { useAuthStore } from '../stores/authStore';
import {
  isFoundationRole,
  isParentRole,
  isPrincipalRole,
  isStudentRole,
  isTeacherRole,
  roleLabel,
} from '../utils/roles';

type DashboardData = Record<string, any>;

const valueAt = (object: DashboardData, path: string): any => {
  const value = path.split('.').reduce<any>((current, key) => current?.[key], object);
  if (value && typeof value === 'object' && 'total' in value) return value.total;
  return value;
};

const firstValue = (data: DashboardData, paths: string[], fallback: string | number = '-') => {
  for (const path of paths) {
    const value = valueAt(data, path);
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return fallback;
};

const listAt = (data: DashboardData, paths: string[]): any[] => {
  for (const path of paths) {
    const value = valueAt(data, path);
    if (Array.isArray(value)) return value;
  }
  return [];
};

const titleOf = (item: any): string => item?.judul || item?.title || item?.judul_pengumuman || item?.subject?.name || item?.subject?.nama_mapel || 'Informasi sekolah';
const subtitleOf = (item: any): string => item?.isi || item?.summary || item?.isi_pengumuman || item?.kelas?.nama_kelas || item?.class?.name || item?.time_start || '';

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const roles = useAuthStore((state) => state.roles);
  const [dashboard, setDashboard] = useState<DashboardData>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const response = await mobileApiService.getRoleDashboard(roles);
      setDashboard(unwrapApiData<DashboardData>(response) || {});
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Dashboard belum berhasil dimuat. Pastikan permission role sudah tersedia di Laravel.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [roles]);

  useEffect(() => {
    void load();
  }, [load]);

  const foundation = isFoundationRole(roles);
  const principal = isPrincipalRole(roles);
  const teacher = isTeacherRole(roles);
  const parent = isParentRole(roles);
  const student = isStudentRole(roles);

  const metrics = foundation
    ? [
      ['Unit aktif', ['kpis.total_unit_aktif', 'kpis.total_unit'], 'domain'],
      ['Pegawai aktif', ['kpis.total_pegawai_aktif', 'kpis.total_pegawai'], 'account-tie-outline'],
      ['Guru', ['kpis.total_guru'], 'teach'],
      ['Siswa aktif', ['kpis.total_siswa_aktif', 'kpis.total_siswa'], 'account-group-outline'],
      ['Kelas', ['kpis.total_kelas'], 'google-classroom'],
      ['Orang tua', ['kpis.total_ortu', 'kpis.total_orang_tua'], 'account-child-outline'],
    ]
    : principal
      ? [
        ['Siswa', ['kpis.total_siswa', 'total_siswa'], 'account-group-outline'],
        ['Guru', ['kpis.total_guru', 'total_guru'], 'teach'],
        ['Hadir hari ini', ['kpis.siswa_hadir_hari_ini', 'kehadiran_hari_ini'], 'calendar-check-outline'],
        ['Kelas', ['kpis.total_kelas', 'total_kelas'], 'google-classroom'],
        ['Setoran tahfizh', ['kpis.setoran_tahfizh_hari_ini'], 'book-open-page-variant'],
      ]
      : teacher
        ? [
          ['Jadwal hari ini', ['kpi.schedules_today_count'], 'calendar-clock-outline'],
          ['Siswa diajar', ['kpi.total_students'], 'account-group-outline'],
          ['Kelas', ['kpi.total_classes'], 'google-classroom'],
          ['Perlu dinilai', ['kpi.pending_grading_count'], 'file-document-edit-outline'],
        ]
        : parent || student
          ? [
            ['Jadwal hari ini', ['kpi.schedules_today_count'], 'calendar-clock-outline'],
            ['Tugas aktif', ['kpi.active_assignments_count'], 'file-document-outline'],
            ['Total ayat tahfizh', ['kpi.total_tahfizh_ayat'], 'book-open-page-variant'],
            ['Mutabaah', ['kpi.mutabaah_status'], 'check-circle-outline'],
          ]
          : [
            ['Pegawai', ['total_pegawai', 'kpis.total_pegawai'], 'account-tie-outline'],
            ['Pegawai aktif', ['total_aktif', 'kpis.total_pegawai_aktif'], 'account-check-outline'],
            ['Guru', ['total_guru', 'kpis.total_guru'], 'teach'],
            ['Tugas unit', ['total_tu_operator'], 'briefcase-outline'],
          ];

  const announcements = listAt(dashboard, [
    'tables.announcements',
    'recent_information',
    'agenda_yayasan',
    'announcements',
    'pengumuman_sekolah',
  ]);
  const schedules = listAt(dashboard, ['schedules_today', 'schedule_today']);
  const name = user?.name || user?.fullName || 'Pengguna';
  const scopeLabel = dashboard?.context?.unit?.nama
    || dashboard?.context?.unit?.name
    || dashboard?.teacher?.education_unit
    || dashboard?.student?.kelas?.nama_kelas
    || user?.unit
    || 'Sistem Manajemen Sekolah Terpadu';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void load(); }} colors={['#0E5C44']} />}
      >
        <Surface style={styles.header} elevation={1}>
          <View style={styles.headerMain}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{name.slice(0, 1).toUpperCase()}</Text></View>
            <View style={styles.headerCopy}><Text style={styles.greeting}>Assalamu'alaikum</Text><Text style={styles.name}>{name}</Text><Text style={styles.role}>{roleLabel(roles)} · {scopeLabel}</Text></View>
            <MaterialCommunityIcons name="bell-outline" size={24} color="#0E5C44" />
          </View>
        </Surface>

        <View style={styles.banner}><View style={styles.bannerCopy}><Text style={styles.bannerEyebrow}>RUANG KERJA DIGITAL</Text><Text style={styles.bannerTitle}>Semua data sekolah dalam satu tempat.</Text><Text style={styles.bannerText}>Akses dibatasi otomatis berdasarkan role dan permission akun Laravel Anda.</Text></View><MaterialCommunityIcons name={foundation ? 'office-building-outline' : 'mosque'} size={48} color="#6EE7B7" /></View>

        {error ? <Card style={styles.errorCard}><Card.Content><Text style={styles.errorTitle}>Dashboard tidak tersedia</Text><Text style={styles.errorText}>{error}</Text><Button compact onPress={() => void load()} icon="refresh">Muat ulang</Button></Card.Content></Card> : null}
        {loading ? <ActivityIndicator color="#0E5C44" style={styles.loader} /> : null}

        <Text variant="titleMedium" style={styles.sectionTitle}>Ringkasan {roleLabel(roles).toLowerCase()}</Text>
        <View style={styles.metricGrid}>
          {metrics.map(([label, paths, icon]) => (
            <Card key={String(label)} style={styles.metricCard}>
              <Card.Content style={styles.metricContent}><MaterialCommunityIcons name={String(icon) as never} size={24} color="#0E5C44" /><Text style={styles.metricValue}>{String(firstValue(dashboard, paths as string[]))}</Text><Text style={styles.metricLabel}>{String(label)}</Text></Card.Content>
            </Card>
          ))}
        </View>

        {schedules.length ? <><Text variant="titleMedium" style={styles.sectionTitle}>Agenda hari ini</Text><Card style={styles.listCard}><Card.Content>{schedules.slice(0, 5).map((item: any, index: number) => <View key={String(item.id || index)} style={styles.listRow}><View style={styles.listIcon}><MaterialCommunityIcons name="calendar-clock-outline" size={19} color="#0E5C44" /></View><View style={styles.listCopy}><Text style={styles.listTitle}>{titleOf(item)}</Text><Text style={styles.listMeta}>{subtitleOf(item) || `${item?.time_start || '-'} - ${item?.time_end || '-'}`}</Text></View></View>)}</Card.Content></Card></> : null}

        <Text variant="titleMedium" style={styles.sectionTitle}>Informasi terbaru</Text>
        <Card style={styles.listCard}><Card.Content>{announcements.length ? announcements.slice(0, 5).map((item: any, index: number) => <View key={String(item.id || index)} style={styles.announcement}><Text style={styles.listTitle}>{titleOf(item)}</Text><Text style={styles.listMeta} numberOfLines={2}>{subtitleOf(item) || 'Informasi tersedia di sistem sekolah.'}</Text>{index < Math.min(announcements.length, 5) - 1 ? <Divider style={styles.divider} /> : null}</View>) : <Text style={styles.empty}>Belum ada informasi terbaru dari server.</Text>}</Card.Content></Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F9FC' },
  screen: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  header: { backgroundColor: '#FFFFFF', borderRadius: 18, padding: 14 },
  headerMain: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#0E5C44', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 21, fontWeight: '800' },
  headerCopy: { flex: 1, marginLeft: 11 },
  greeting: { color: '#64748B', fontSize: 11 },
  name: { color: '#0F172A', fontSize: 17, fontWeight: '800', marginTop: 1 },
  role: { color: '#0E5C44', fontSize: 11, marginTop: 3 },
  banner: { backgroundColor: '#0E5C44', borderRadius: 18, padding: 18, marginTop: 14, flexDirection: 'row', alignItems: 'center' },
  bannerCopy: { flex: 1, paddingRight: 12 },
  bannerEyebrow: { color: '#6EE7B7', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  bannerTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', lineHeight: 24, marginTop: 4 },
  bannerText: { color: '#D1FAE5', fontSize: 11, lineHeight: 17, marginTop: 5 },
  errorCard: { backgroundColor: '#FEF2F2', borderRadius: 14, marginTop: 14 },
  errorTitle: { color: '#991B1B', fontWeight: '800' },
  errorText: { color: '#B91C1C', fontSize: 12, lineHeight: 18, marginTop: 4 },
  loader: { marginVertical: 20 },
  sectionTitle: { color: '#0F172A', fontWeight: '800', marginTop: 20, marginBottom: 10 },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metricCard: { width: '31.8%', minWidth: 100, backgroundColor: '#FFFFFF', borderRadius: 14 },
  metricContent: { paddingHorizontal: 10, paddingVertical: 13, alignItems: 'flex-start' },
  metricValue: { color: '#0F172A', fontSize: 20, fontWeight: '900', marginTop: 7 },
  metricLabel: { color: '#64748B', fontSize: 10, lineHeight: 14, marginTop: 2 },
  listCard: { backgroundColor: '#FFFFFF', borderRadius: 16 },
  listRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  listIcon: { width: 36, height: 36, borderRadius: 11, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center' },
  listCopy: { flex: 1, marginLeft: 10 },
  listTitle: { color: '#0F172A', fontSize: 13, fontWeight: '800' },
  listMeta: { color: '#64748B', fontSize: 11, lineHeight: 16, marginTop: 3 },
  announcement: { paddingVertical: 5 },
  divider: { marginTop: 10 },
  empty: { color: '#94A3B8', fontSize: 12, paddingVertical: 8 },
});
