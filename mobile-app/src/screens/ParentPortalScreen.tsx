import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { mobileApiService } from '../services/mobileApiService';

type Child = { id: string; full_name?: string; nis?: string; kelas?: { nama_kelas?: string; name?: string } };
type Dashboard = { student?: Child; attendance_today?: { status?: string }; summary?: Record<string, number>; announcements?: Array<{ id: string; judul_pengumuman?: string }> };

const unwrap = <T,>(response: any): T => response?.data?.data ?? response?.data ?? response;

export default function ParentPortalScreen() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [dashboard, setDashboard] = useState<Dashboard>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reason, setReason] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const childResponse = await mobileApiService.getPortalChildren();
      const available = unwrap<Child[]>(childResponse) || [];
      const activeId = selectedId || available[0]?.id;
      setChildren(available); setSelectedId(activeId);
      if (activeId) setDashboard(unwrap<Dashboard>(await mobileApiService.getPortalDashboard(activeId)));
    } catch (err: any) { setError(err.response?.data?.message || 'Data portal belum berhasil dimuat.'); }
    finally { setLoading(false); }
  }, [selectedId]);

  useEffect(() => { load(); }, [load]);
  const chooseChild = async (id: string) => { setSelectedId(id); setLoading(true); try { setDashboard(unwrap(await mobileApiService.getPortalDashboard(id))); } finally { setLoading(false); } };
  const submitPermission = async () => {
    if (!selectedId || !reason.trim()) return Alert.alert('Data belum lengkap', 'Pilih anak dan isi alasan pengajuan.');
    const today = new Date().toISOString().slice(0, 10);
    try { await mobileApiService.submitPortalPermission({ child_id: selectedId, type: 'Izin', start_date: today, end_date: today, reason: reason.trim() }); setReason(''); Alert.alert('Berhasil', 'Pengajuan izin telah dikirim untuk diverifikasi.'); }
    catch (err: any) { Alert.alert('Gagal', err.response?.data?.message || 'Pengajuan belum berhasil dikirim.'); }
  };
  const summary = dashboard?.summary || {};

  return <ScrollView style={styles.container} refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor="#0E5C44" />}>
    <View style={styles.hero}><Text style={styles.tag}>PORTAL ORANG TUA</Text><Text style={styles.title}>Pantau perkembangan anak</Text><Text style={styles.subtitle}>Data langsung dari sistem akademik sekolah.</Text></View>
    {error ? <View style={styles.error}><Text style={styles.errorText}>{error}</Text><TouchableOpacity onPress={load}><Text style={styles.retry}>Muat ulang</Text></TouchableOpacity></View> : null}
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.children}>
      {children.map((child) => <TouchableOpacity key={child.id} onPress={() => chooseChild(child.id)} style={[styles.child, selectedId === child.id && styles.childActive]}><MaterialCommunityIcons name="account-child-circle" size={26} color={selectedId === child.id ? '#fff' : '#0E5C44'} /><View><Text style={[styles.childName, selectedId === child.id && styles.white]}>{child.full_name || 'Siswa'}</Text><Text style={[styles.small, selectedId === child.id && styles.white]}>{child.kelas?.nama_kelas || child.kelas?.name || 'Kelas belum ditentukan'}</Text></View></TouchableOpacity>)}
    </ScrollView>
    {loading && !dashboard ? <ActivityIndicator color="#0E5C44" style={styles.loader} /> : <View style={styles.content}>
      <View style={styles.status}><Text style={styles.statusLabel}>Kehadiran hari ini</Text><Text style={styles.statusValue}>{dashboard?.attendance_today?.status || 'Belum tercatat'}</Text></View>
      <View style={styles.grid}>{[['Tugas aktif', summary.active_assignments ?? 0], ['Belum dikumpulkan', summary.pending_assignments ?? 0], ['Materi terbaru', summary.materials ?? 0], ['Notifikasi', summary.unread_notifications ?? 0]].map(([label, value]) => <View key={String(label)} style={styles.kpi}><Text style={styles.small}>{label}</Text><Text style={styles.number}>{value}</Text></View>)}</View>
      <View style={styles.card}><Text style={styles.cardTitle}>Pengajuan izin hari ini</Text><TextInput value={reason} onChangeText={setReason} multiline placeholder="Tuliskan alasan izin..." style={styles.input} /><TouchableOpacity onPress={submitPermission} style={styles.button}><Text style={styles.buttonText}>Kirim pengajuan</Text></TouchableOpacity></View>
      <View style={styles.card}><Text style={styles.cardTitle}>Informasi terbaru</Text>{(dashboard?.announcements || []).slice(0, 4).map((item) => <Text key={item.id} style={styles.list}>• {item.judul_pengumuman || 'Pengumuman sekolah'}</Text>)}{!dashboard?.announcements?.length && <Text style={styles.empty}>Belum ada pengumuman.</Text>}</View>
    </View>}
  </ScrollView>;
}

const styles = StyleSheet.create({ container:{flex:1,backgroundColor:'#F7F9FC'},hero:{backgroundColor:'#0E5C44',padding:22,borderBottomLeftRadius:24,borderBottomRightRadius:24},tag:{fontSize:11,fontWeight:'800',color:'#6EE7B7'},title:{fontSize:21,fontWeight:'800',color:'#fff',marginTop:5},subtitle:{fontSize:12,color:'#D1FAE5',marginTop:3},children:{padding:16,gap:10},child:{flexDirection:'row',alignItems:'center',gap:8,padding:12,borderRadius:15,backgroundColor:'#fff',borderWidth:1,borderColor:'#E2E8F0'},childActive:{backgroundColor:'#1E8E5A'},childName:{fontSize:13,fontWeight:'700',color:'#0F172A'},small:{fontSize:11,color:'#64748B'},white:{color:'#fff'},content:{paddingHorizontal:16,paddingBottom:30,gap:14},status:{padding:16,borderRadius:16,backgroundColor:'#D1FAE5'},statusLabel:{fontSize:11,color:'#047857'},statusValue:{fontSize:18,fontWeight:'800',color:'#065F46',marginTop:3},grid:{flexDirection:'row',flexWrap:'wrap',gap:10},kpi:{width:'48%',padding:15,borderRadius:16,backgroundColor:'#fff',borderWidth:1,borderColor:'#E2E8F0'},number:{fontSize:23,fontWeight:'900',color:'#0E5C44',marginTop:5},card:{padding:16,borderRadius:16,backgroundColor:'#fff',borderWidth:1,borderColor:'#E2E8F0'},cardTitle:{fontSize:14,fontWeight:'800',color:'#0F172A',marginBottom:10},input:{minHeight:80,borderWidth:1,borderColor:'#CBD5E1',borderRadius:12,padding:12,textAlignVertical:'top'},button:{marginTop:10,backgroundColor:'#0E5C44',borderRadius:12,padding:13,alignItems:'center'},buttonText:{color:'#fff',fontWeight:'800'},list:{fontSize:12,color:'#334155',paddingVertical:5},empty:{fontSize:12,color:'#94A3B8'},loader:{margin:40},error:{margin:16,padding:14,borderRadius:12,backgroundColor:'#FEF2F2'},errorText:{fontSize:12,color:'#B91C1C'},retry:{fontSize:12,fontWeight:'800',color:'#0E5C44',marginTop:8} });
