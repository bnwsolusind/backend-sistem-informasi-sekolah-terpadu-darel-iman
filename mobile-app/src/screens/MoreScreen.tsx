import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native-paper';
import { useAuthStore } from '../stores/authStore';
import { isFoundationRole, isParentRole, isStudentRole, isTeacherRole, roleLabel } from '../utils/roles';

export default function MoreScreen({ navigation }: any) {
  const roles=useAuthStore(s=>s.roles);
  const links = [
    ...(isFoundationRole(roles) ? [['Data','database-outline','Data & master sekolah']] : []),
    ...(isTeacherRole(roles) ? [['Guru','teach','Ruang kerja dan pembelajaran'],['Absensi','calendar-check-outline','Presensi dan kehadiran']] : []),
    ...(isParentRole(roles) ? [['Orang Tua','account-child-outline','Perkembangan dan aktivitas anak']] : []),
    ...(isStudentRole(roles) ? [['Siswa','school-outline','Jadwal, materi, dan tugas']] : []),
    ['Profil','account-circle-outline','Akun dan keamanan'],
  ];
  return <ScrollView style={styles.screen} contentContainerStyle={styles.content}><View style={styles.hero}><Text style={styles.eyebrow}>AKSES {roleLabel(roles).toUpperCase()}</Text><Text style={styles.title}>Layanan lainnya</Text><Text style={styles.subtitle}>Modul ditampilkan sesuai role dan permission akun.</Text></View>{links.map(([route,icon,desc])=><TouchableOpacity key={route} style={styles.item} onPress={()=>navigation.navigate(route)}><View style={styles.icon}><MaterialCommunityIcons name={icon as never} size={24} color="#087A5A" /></View><View style={styles.copy}><Text style={styles.itemTitle}>{route}</Text><Text style={styles.itemDesc}>{desc}</Text></View><MaterialCommunityIcons name="chevron-right" size={22} color="#9BA7A3" /></TouchableOpacity>)}</ScrollView>;
}
const styles=StyleSheet.create({screen:{flex:1,backgroundColor:'#F7FAF9'},content:{padding:18,paddingBottom:34},hero:{backgroundColor:'#075B46',borderRadius:24,padding:20,marginBottom:18},eyebrow:{fontSize:10,fontWeight:'900',letterSpacing:1,color:'#85E3BB'},title:{fontSize:23,fontWeight:'900',color:'#FFF',marginTop:4},subtitle:{fontSize:12,color:'#D9F7EA',marginTop:5},item:{flexDirection:'row',alignItems:'center',padding:14,backgroundColor:'#FFF',borderRadius:18,borderWidth:1,borderColor:'#E7EEEB',marginBottom:10},icon:{width:48,height:48,borderRadius:15,backgroundColor:'#E8F8F1',alignItems:'center',justifyContent:'center'},copy:{flex:1,marginLeft:12},itemTitle:{fontSize:14,fontWeight:'800',color:'#172B25'},itemDesc:{fontSize:11,color:'#71807C',marginTop:3}});
