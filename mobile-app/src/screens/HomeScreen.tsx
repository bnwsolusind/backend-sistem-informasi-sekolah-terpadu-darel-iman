import React, { useCallback, useEffect, useState } from 'react';
import {
  Image,
  Modal,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
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
import { useMobileConfigStore } from '../stores/mobileConfigStore';
import MinimalPageBackground from '../components/MinimalPageBackground';
import {
  isFoundationRole,
  isParentRole,
  isPrincipalRole,
  isStudentRole,
  isSuperAdminRole,
  isTeacherRole,
  roleLabel,
  homeLayoutKeyForRoles,
} from '../utils/roles';
import { getProfileImageUrl } from '../utils/profile';

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

export default function HomeScreen({ navigation }: any) {
  const user = useAuthStore((state) => state.user);
  const roles = useAuthStore((state) => state.roles);
  const mobileConfig = useMobileConfigStore((state) => state.config);
  const theme = mobileConfig.theme;
  const [dashboard, setDashboard] = useState<DashboardData>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [imageError, setImageError] = useState(false);

  const setUser = useAuthStore((state) => state.setUser);

  const load = useCallback(async () => {
    setError('');
    setLoading(true);
    try {
      const [dashRes, profRes] = await Promise.allSettled([
        mobileApiService.getRoleDashboard(roles),
        mobileApiService.getProfile(),
      ]);
      if (dashRes.status === 'fulfilled') {
        setDashboard(unwrapApiData<DashboardData>(dashRes.value) || {});
      }
      if (profRes.status === 'fulfilled') {
        const profile = profRes.value?.data?.data ?? profRes.value?.data ?? profRes.value;
        if (profile) setUser(profile);
      }
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Dashboard belum berhasil dimuat. Pastikan permission role sudah tersedia di Laravel.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [roles, setUser]);

  useEffect(() => {
    void load();
  }, [load]);

  const foundation = isFoundationRole(roles);
  const superAdmin = isSuperAdminRole(roles);
  const principal = isPrincipalRole(roles);
  const teacher = isTeacherRole(roles);
  const parent = isParentRole(roles);
  const student = isStudentRole(roles);

  const metrics = superAdmin
    ? [
      ['Unit aktif', ['kpis.active_units', 'kpis.total_units'], 'office-building-outline'],
      ['Pegawai aktif', ['kpis.total_employees'], 'account-tie-outline'],
      ['Guru', ['kpis.total_teachers'], 'account-tie-outline'],
      ['Siswa aktif', ['kpis.total_students'], 'account-group-outline'],
      ['Kelas', ['kpis.total_classes'], 'google-classroom'],
      ['Orang tua', ['kpis.total_parents'], 'account-child-outline'],
    ]
    : foundation
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
  const profileImageUrl = getProfileImageUrl(user, dashboard);

  useEffect(() => {
    setImageError(false);
  }, [profileImageUrl]);

  const scopeLabel = dashboard?.context?.unit?.nama
    || dashboard?.context?.unit?.name
    || dashboard?.teacher?.education_unit
    || dashboard?.student?.kelas?.nama_kelas
    || user?.unit
    || 'Sistem Manajemen Sekolah Terpadu';

  const displayScope = scopeLabel && scopeLabel !== 'Sistem Manajemen Sekolah Terpadu' ? ` · ${scopeLabel}` : '';
  const portalRoute = parent ? 'Orang Tua' : student ? 'Siswa' : teacher ? 'Guru' : foundation ? 'Data' : 'Lainnya';
  const commonMenus = [
    ['Absensi', 'calendar-check-outline', '#168A53', parent || student ? portalRoute : 'Absensi'],
    ['Tahfizh', 'book-open-page-variant-outline', '#0C9B65', 'Lainnya'],
    ['Mutabaah', 'check-decagram-outline', '#118858', 'Lainnya'],
  ];
  const roleMenus = superAdmin || foundation
    ? [['Dashboard', 'chart-box-outline', '#087A5A', 'Data'], ['Data Master', 'database-outline', '#397AD7', 'Data'], ['Laporan', 'file-chart-outline', '#EF9F16', 'Data'], ['Monitoring', 'monitor-dashboard', '#7258C9', 'Data'], ['Pengaturan', 'cog-outline', '#178759', 'Lainnya']]
    : teacher
      ? [['Ruang Guru', 'teach', '#087A5A', 'Guru'], ['Jadwal', 'calendar-clock-outline', '#ED9B15', 'Guru'], ['Materi', 'folder-open-outline', '#2E82D5', 'Guru'], ['Nilai', 'clipboard-edit-outline', '#7656C6', 'Guru'], ['Siswa', 'account-school-outline', '#168A53', 'Guru']]
      : parent
        ? [['Perkembangan', 'chart-timeline-variant', '#087A5A', 'Orang Tua'], ['Nilai', 'clipboard-text-outline', '#EF9F16', 'Orang Tua'], ['Tugas', 'notebook-outline', '#397AD7', 'Orang Tua'], ['Informasi', 'information-outline', '#5EAE57', 'Notifikasi'], ['Profil Siswa', 'account-child-outline', '#7656C6', 'Orang Tua']]
        : student
          ? [['Portal Siswa', 'school-outline', '#087A5A', 'Siswa'], ['Tugas', 'notebook-outline', '#397AD7', 'Siswa'], ['Materi', 'folder-open-outline', '#168A53', 'Siswa'], ['Nilai', 'clipboard-text-outline', '#EF9F16', 'Siswa'], ['Jadwal', 'calendar-month-outline', '#E15746', 'Siswa']]
          : [['Data Siswa', 'account-group-outline', '#7656C6', 'Data'], ['Akademik', 'book-education-outline', '#397AD7', 'Data'], ['Laporan', 'file-chart-outline', '#EF9F16', 'Data']];
  const menus = [...commonMenus, ...roleMenus].slice(0, 9);
  const menuRows = Array.from({ length: Math.ceil(menus.length / 3) }, (_, index) => menus.slice(index * 3, index * 3 + 3));
  const metricRows = Array.from({ length: Math.ceil(metrics.length / 2) }, (_, index) => metrics.slice(index * 2, index * 2 + 2));
  const roleHomeLayout = mobileConfig.role_home_layouts[homeLayoutKeyForRoles(roles)] || mobileConfig.home_layout;
  const todayLabel = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
  const sectionStyle = (type: string): any => {
    const section = roleHomeLayout.sections.find((item) => item.type === type);
    return { display: section?.enabled === false ? 'none' : 'flex', order: section?.order ?? 99 };
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background_color }]}>
      <MinimalPageBackground
        baseColor={theme.background_color}
        primaryColor={theme.primary_color}
        enabled={theme.background_gradient_enabled}
        gradientStart={theme.background_gradient_start}
        gradientEnd={theme.background_gradient_end}
        direction={theme.background_gradient_direction}
      />
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void load(); }} colors={[theme.primary_color]} />}
      >
        <View style={styles.topHeaderBar}>
          <TouchableOpacity
            activeOpacity={0.8}
            accessibilityLabel="Buka profil"
            onPress={() => navigation.navigate('Profil')}
            style={styles.topAvatarCircle}
          >
            {profileImageUrl && !imageError ? (
              <Image
                source={{ uri: String(profileImageUrl) }}
                style={styles.topAvatarImage}
                resizeMode="cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <View style={[styles.topAvatarFallback, { backgroundColor: theme.primary_color }]}>
                <Text style={styles.topAvatarText}>{name.slice(0, 1).toUpperCase()}</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.topActionsRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              accessibilityLabel="Buka notifikasi"
              onPress={() => navigation.navigate('Notifikasi')}
              style={styles.topCircleButton}
            >
              <MaterialCommunityIcons name="bell-outline" size={21} color="#334155" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.welcomeContainer}>
          <View style={styles.welcomeHeadRow}>
            <View>
              <Text style={[styles.welcomeGreeting, { color: theme.muted_text_color }]}>Assalamu'alaikum,</Text>
              <Text numberOfLines={1} style={[styles.welcomeName, { color: theme.text_color }]}>{name}</Text>
            </View>
            <View style={[styles.dateCard, { backgroundColor: theme.surface_color }]}>
              <MaterialCommunityIcons name="calendar-blank-outline" size={13} color={theme.primary_color} />
              <Text style={[styles.dateText, { color: theme.muted_text_color }]}>{todayLabel}</Text>
            </View>
          </View>
          <View style={styles.welcomeRolePill}>
            <Text numberOfLines={1} style={styles.welcomeRoleText}>{roleLabel(roles)}{displayScope}</Text>
          </View>
        </View>

        <View style={sectionStyle('announcements')}><View style={styles.newsHeader}><Text style={[styles.sectionTitleCompact, { color: theme.text_color }]}>Informasi terbaru</Text><TouchableOpacity onPress={() => navigation.navigate('Notifikasi')}><Text style={[styles.seeAll, { color: theme.primary_color }]}>Lihat semua</Text></TouchableOpacity></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.newsTrack}>
          {(announcements.length ? announcements : [{judul:'Selamat datang di aplikasi sekolah',isi:'Pantau informasi akademik dan kegiatan sekolah dari satu aplikasi.',created_at:new Date().toISOString()},{judul:'Pembelajaran terpadu',isi:'Jadwal, materi, tugas, tahfizh dan mutabaah kini lebih mudah diakses.',created_at:new Date().toISOString()}]).slice(0,6).map((item:any,index:number)=><TouchableOpacity key={String(item.id||index)} onPress={()=>setSelectedNews(item)} style={[styles.newsCard, { backgroundColor: theme.surface_color, borderRadius: theme.card_radius }]}><View style={styles.newsIcon}><MaterialCommunityIcons name="newspaper-variant-outline" size={19} color={theme.primary_color} /></View><Text numberOfLines={2} style={[styles.newsTitle, { color: theme.text_color }]}>{titleOf(item)}</Text><Text numberOfLines={2} style={[styles.newsText, { color: theme.muted_text_color }]}>{subtitleOf(item)}</Text><Text style={styles.newsDate}>{item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : 'Hari ini'}</Text></TouchableOpacity>)}
        </ScrollView></View>

        <View style={sectionStyle('quick_menu')}><View style={styles.newsHeader}><Text style={[styles.sectionTitleCompact, { color: theme.text_color }]}>Menu utama</Text><TouchableOpacity onPress={() => navigation.navigate('Lainnya')}><Text style={[styles.seeAll, { color: theme.primary_color }]}>Lihat semua</Text></TouchableOpacity></View>
        <View style={styles.menuGrid}>{menuRows.map((row,rowIndex)=><View key={rowIndex} style={styles.menuRow}>{row.map(([label,icon,color,route])=><TouchableOpacity key={String(label)} activeOpacity={0.72} style={[styles.menuCard, { backgroundColor: theme.surface_color, borderRadius: theme.card_radius }]} onPress={()=>navigation.navigate(String(route))}><View style={[styles.menuIcon,{backgroundColor:`${color}16`}]}><MaterialCommunityIcons name={String(icon) as never} size={24} color={String(color)} /></View><Text numberOfLines={1} style={[styles.menuLabel, { color: theme.text_color }]}>{String(label)}</Text><MaterialCommunityIcons name="chevron-right" size={13} color="#B2C1BC" style={styles.menuArrow} /></TouchableOpacity>)}{Array.from({length:3-row.length},(_,index)=><View key={`empty-${index}`} style={styles.menuPlaceholder}/>)}</View>)}</View></View>

        {error ? <Card style={styles.errorCard}><Card.Content><Text style={styles.errorTitle}>Dashboard tidak tersedia</Text><Text style={styles.errorText}>{error}</Text><Button compact onPress={() => void load()} icon="refresh">Muat ulang</Button></Card.Content></Card> : null}
        {loading ? <ActivityIndicator color="#0E5C44" style={styles.loader} /> : null}

        <View style={sectionStyle('metrics')}><Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.text_color }]}>Ringkasan {roleLabel(roles).toLowerCase()}</Text>
        <View style={styles.metricGrid}>
          {metricRows.map((row,rowIndex)=><View key={rowIndex} style={styles.metricRow}>{row.map(([label, paths, icon]) => (
              <Card key={String(label)} style={[styles.metricCard, { backgroundColor: theme.surface_color, borderRadius: theme.card_radius }]}>
                <Card.Content style={styles.metricContent}><MaterialCommunityIcons name={(String(icon)==='teach'?'account-tie-outline':String(icon)) as never} size={20} color={theme.primary_color} /><Text style={[styles.metricValue, { color: theme.text_color }]}>{String(firstValue(dashboard, paths as string[]))}</Text><Text numberOfLines={2} style={[styles.metricLabel, { color: theme.muted_text_color }]}>{String(label)}</Text></Card.Content>
              </Card>
            ))}{Array.from({length:2-row.length},(_,index)=><View key={`metric-empty-${index}`} style={styles.metricPlaceholder}/>)}</View>)}
        </View></View>

        <View style={sectionStyle('schedule')}>{schedules.length ? <><Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.text_color }]}>Agenda hari ini</Text><Card style={[styles.listCard, { backgroundColor: theme.surface_color, borderRadius: theme.card_radius }]}><Card.Content>{schedules.slice(0, 5).map((item: any, index: number) => <View key={String(item.id || index)} style={styles.listRow}><View style={styles.listIcon}><MaterialCommunityIcons name="calendar-clock-outline" size={19} color={theme.primary_color} /></View><View style={styles.listCopy}><Text style={[styles.listTitle, { color: theme.text_color }]}>{titleOf(item)}</Text><Text style={[styles.listMeta, { color: theme.muted_text_color }]}>{subtitleOf(item) || `${item?.time_start || '-'} - ${item?.time_end || '-'}`}</Text></View></View>)}</Card.Content></Card></> : null}</View>

      </ScrollView>
      <Modal visible={Boolean(selectedNews)} transparent animationType="slide" onRequestClose={()=>setSelectedNews(null)}><View style={styles.modalBackdrop}><View style={[styles.modalSheet,{backgroundColor:theme.surface_color}]}><View style={styles.modalHandle}/><View style={styles.modalHead}><Text style={[styles.modalTitle,{color:theme.text_color}]}>{titleOf(selectedNews || {})}</Text><TouchableOpacity onPress={()=>setSelectedNews(null)} style={styles.close}><MaterialCommunityIcons name="close" size={20} color="#53615D" /></TouchableOpacity></View><Text style={styles.modalDate}>{selectedNews?.created_at ? new Date(selectedNews.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}) : 'Informasi sekolah'}</Text><Text style={[styles.modalBody,{color:theme.muted_text_color}]}>{subtitleOf(selectedNews || {}) || 'Informasi selengkapnya tersedia melalui sistem sekolah.'}</Text><View style={[styles.modalImage,{backgroundColor:`${theme.primary_color}12`}]}><MaterialCommunityIcons name="mosque" size={64} color={theme.primary_color} /><Text style={[styles.modalImageText,{color:theme.primary_color}]}>{mobileConfig.branding.school_name}</Text></View></View></View></Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F9FC' },
  screen: { flex: 1, backgroundColor: 'transparent' },
  content: { padding: 15, paddingBottom: 112 },
  topHeaderBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 2, paddingTop: 4, paddingBottom: 14 },
  topAvatarCircle: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#F1F5F9', overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  topAvatarImage: { width: '100%', height: '100%', borderRadius: 22 },
  topAvatarFallback: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', borderRadius: 22 },
  topAvatarText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  topActionsRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  topCircleButton: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  topBadgeDot: { position: 'absolute', right: 11, top: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: '#F59E0B' },
  welcomeContainer: { marginBottom: 16, paddingHorizontal: 2 },
  welcomeHeadRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  welcomeGreeting: { fontSize: 11, fontWeight: '600', color: '#64748B' },
  welcomeName: { fontSize: 18, fontWeight: '900', color: '#0F172A', marginTop: 1 },
  welcomeRolePill: { alignSelf: 'flex-start', marginTop: 5, borderRadius: 999, backgroundColor: '#E8F8F1', paddingHorizontal: 9, paddingVertical: 3 },
  welcomeRoleText: { color: '#087A5A', fontSize: 9.5, fontWeight: '700' },
  dateCard:{flexDirection:'row',alignItems:'center',gap:6,minHeight:32,paddingHorizontal:10,borderRadius:10,shadowColor:'#173D31',shadowOpacity:.035,shadowRadius:6,shadowOffset:{width:0,height:2},elevation:1},dateText:{fontSize:9.5,fontWeight:'700',textTransform:'capitalize'},
  newsHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:14,marginBottom:11},sectionTitleCompact:{fontSize:16,fontWeight:'900',color:'#172B25'},seeAll:{fontSize:10,fontWeight:'800',color:'#087A5A'},newsTrack:{gap:11,paddingRight:8},newsCard:{width:208,minHeight:148,padding:14,backgroundColor:'#FFF',borderWidth:0,shadowColor:'#173D31',shadowOpacity:.045,shadowRadius:12,shadowOffset:{width:0,height:5},elevation:1},newsIcon:{width:36,height:36,borderRadius:12,backgroundColor:'#E8F8F1',alignItems:'center',justifyContent:'center'},newsTitle:{fontSize:13,fontWeight:'900',lineHeight:18,color:'#172B25',marginTop:10},newsText:{fontSize:10,lineHeight:15,color:'#697873',marginTop:4},newsDate:{fontSize:9,color:'#9AA7A3',marginTop:9},menuGrid:{gap:10},menuRow:{flexDirection:'row',gap:10},menuCard:{flex:1,minWidth:0,height:106,backgroundColor:'#FFF',borderWidth:0,alignItems:'center',justifyContent:'center',paddingHorizontal:7,shadowColor:'#173D31',shadowOpacity:.035,shadowRadius:8,shadowOffset:{width:0,height:4},elevation:1},menuPlaceholder:{flex:1,minWidth:0},menuIcon:{width:46,height:46,borderRadius:15,alignItems:'center',justifyContent:'center'},menuLabel:{fontSize:10,fontWeight:'800',color:'#31433E',textAlign:'center',marginTop:7},menuArrow:{position:'absolute',right:7,top:8},
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
  metricGrid: { gap: 9 },
  metricRow:{flexDirection:'row',gap:9},
  metricCard: { flex:1,minWidth:0,height:118,backgroundColor: '#FFFFFF', borderRadius: 15,shadowColor:'#173D31',shadowOpacity:.035,shadowRadius:8,shadowOffset:{width:0,height:4},elevation:1 },
  metricPlaceholder:{flex:1,minWidth:0},
  metricContent: { paddingHorizontal: 11, paddingVertical: 12, alignItems: 'flex-start' },
  metricValue: { color: '#0F172A', fontSize: 21, fontWeight: '900', marginTop: 7 },
  metricLabel: { color: '#64748B', fontSize: 9, lineHeight: 12, marginTop: 2 },
  listCard: { backgroundColor: '#FFFFFF', borderRadius: 16 },
  listRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  listIcon: { width: 36, height: 36, borderRadius: 11, backgroundColor: '#ECFDF5', alignItems: 'center', justifyContent: 'center' },
  listCopy: { flex: 1, marginLeft: 10 },
  listTitle: { color: '#0F172A', fontSize: 13, fontWeight: '800' },
  listMeta: { color: '#64748B', fontSize: 11, lineHeight: 16, marginTop: 3 },
  announcement: { paddingVertical: 5 },
  divider: { marginTop: 10 },
  empty: { color: '#94A3B8', fontSize: 12, paddingVertical: 8 },
  modalBackdrop:{flex:1,backgroundColor:'rgba(7,31,24,.42)',justifyContent:'flex-end'},modalSheet:{backgroundColor:'#FFF',borderTopLeftRadius:28,borderTopRightRadius:28,padding:20,paddingBottom:36,minHeight:390},modalHandle:{width:46,height:4,borderRadius:2,backgroundColor:'#D9E1DE',alignSelf:'center',marginBottom:20},modalHead:{flexDirection:'row',alignItems:'flex-start'},modalTitle:{flex:1,fontSize:20,lineHeight:27,fontWeight:'900',color:'#132720'},close:{width:36,height:36,borderRadius:12,backgroundColor:'#F0F4F2',alignItems:'center',justifyContent:'center'},modalDate:{fontSize:11,color:'#8A9793',marginTop:7},modalBody:{fontSize:13,lineHeight:21,color:'#44544F',marginTop:22},modalImage:{height:135,borderRadius:18,backgroundColor:'#E2F3EC',alignItems:'center',justifyContent:'center',marginTop:22},modalImageText:{fontSize:12,fontWeight:'800',color:'#287458',marginTop:7},
});
