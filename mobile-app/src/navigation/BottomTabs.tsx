import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import AbsensiScreen from '../screens/AbsensiScreen';
import ProfilScreen from '../screens/ProfilScreen';
import TeacherPortalScreen from '../screens/TeacherPortalScreen';
import ParentPortalScreen from '../screens/ParentPortalScreen';
import StudentPortalScreen from '../screens/StudentPortalScreen';
import DataManagementScreen from '../screens/DataManagementScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import QrCodeScreen from '../screens/QrCodeScreen';
import MoreScreen from '../screens/MoreScreen';
import { useAuthStore } from '../stores/authStore';
import { mobileApiService } from '../services/mobileApiService';
import { useMobileConfigStore } from '../stores/mobileConfigStore';
import {
  isFoundationRole,
  isParentRole,
  isStaffRole,
  isStudentRole,
  isSuperAdminRole,
  isTeacherRole,
} from '../utils/roles';

const Tab = createBottomTabNavigator();

const moduleOptions = (title: string, theme: any) => ({ navigation }: any) => ({
  title,
  headerShown: true,
  tabBarButton: () => null,
  tabBarItemStyle: { display: 'none' as const },
  headerShadowVisible: false,
  headerStyle: { backgroundColor: theme.surface_color },
  headerTitle: () => <View><Text style={[moduleHeaderStyles.eyebrow,{color:theme.muted_text_color}]}>MODUL SEKOLAH</Text><Text numberOfLines={1} style={[moduleHeaderStyles.title,{color:theme.text_color}]}>{title}</Text></View>,
  headerLeft: () => <Pressable accessibilityRole="button" accessibilityLabel="Kembali ke halaman sebelumnya" onPress={() => navigation.goBack()} style={[moduleHeaderStyles.backButton,{backgroundColor:`${theme.primary_color}12`}]}><MaterialCommunityIcons name="arrow-left" size={22} color={theme.primary_color} /></Pressable>,
});

const names = (value: unknown): string[] => (
  Array.isArray(value)
    ? value.map((item) => typeof item === 'string' ? item : (item as { name?: string })?.name).filter(Boolean) as string[]
    : []
);

export default function BottomTabs() {
  const token = useAuthStore((state) => state.token);
  const roles = useAuthStore((state) => state.roles);
  const permissions = useAuthStore((state) => state.permissions);
  const setUser = useAuthStore((state) => state.setUser);
  const setRoles = useAuthStore((state) => state.setRoles);
  const setPermissions = useAuthStore((state) => state.setPermissions);
  const mobileConfig = useMobileConfigStore((state) => state.config);
  const theme = mobileConfig.theme;
  const primaryTabs = mobileConfig.navigation.items
    .filter((item) => item.enabled)
    .sort((a, b) => a.order - b.order);
  const tabRegistry: Record<string, { name: string; component: React.ComponentType<any> }> = {
    home: { name: 'Beranda', component: HomeScreen },
    notifications: { name: 'Notifikasi', component: NotificationsScreen },
    qr: { name: 'QR Code', component: QrCodeScreen },
    profile: { name: 'Profil', component: ProfilScreen },
    more: { name: 'Lainnya', component: MoreScreen },
  };

  useEffect(() => {
    if (!token) return;

    mobileApiService.getProfile().then((response) => {
      const profile = response?.data?.data ?? response?.data ?? response;
      const profileRoles = names(profile?.roles);
      const profilePermissions = names(profile?.permissions);
      if (profile) setUser(profile);
      if (profileRoles.length) setRoles(profileRoles);
      if (profilePermissions.length) setPermissions(profilePermissions);
    }).catch(() => {
      // A cached session remains usable when the profile endpoint is temporarily unavailable.
    });
  }, [setPermissions, setRoles, setUser, token]);

  const isSuperAdmin = isSuperAdminRole(roles);
  const isFoundation = isFoundationRole(roles);
  const isTeacher = isTeacherRole(roles);
  const isParent = isParentRole(roles);
  const isStudent = isStudentRole(roles);
  const isStaff = isStaffRole(roles);
  const hasPermission = (...required: string[]) => isSuperAdmin || required.some((item) => permissions.includes(item));

  const showData = isStaff && (
    isFoundation
    || hasPermission(
      'employee.view',
      'employee.view_all',
      'student.view',
      'student.view_all',
      'unit.view',
      'unit.view_all',
      'sistem.master_data',
      'foundation.employee.view',
      'foundation.student.view',
      'foundation.unit.view',
    )
    || permissions.length === 0
  );

  const showTeacher = isTeacher && (hasPermission('teacher.dashboard.view', 'teacher.schedule.view') || permissions.length === 0);
  const showAttendance = isStaff && (hasPermission('attendance.view', 'attendance.manage') || permissions.length === 0);

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          sceneStyle: { backgroundColor: theme.background_color },
          headerStyle: { backgroundColor: theme.surface_color },
          headerTitleStyle: { color: theme.primary_color, fontWeight: '800' },
          tabBarActiveTintColor: theme.primary_color,
          tabBarInactiveTintColor: '#64748B',
          tabBarStyle: { position:'absolute',left:12,right:12,bottom:10,backgroundColor: theme.surface_color, paddingTop: 7, paddingBottom: 7, height: 70, borderTopWidth:0,borderRadius:24,shadowColor:'#092B20',shadowOpacity:.14,shadowRadius:18,shadowOffset:{width:0,height:8},elevation:10 },
          tabBarItemStyle: { minWidth: 0, paddingHorizontal: 0 },
          tabBarShowLabel: mobileConfig.navigation.show_labels,
          tabBarLabelStyle: { fontSize: mobileConfig.theme.font_scale === 'large' ? 10 : 8, lineHeight: 11, fontWeight: '700', marginTop: 1 },
          tabBarIcon: ({ color, size, focused }) => {
            const configuredIcons = Object.fromEntries(primaryTabs.map((item) => [tabRegistry[item.key]?.name, item.icon]));
            const iconByRoute: Record<string, string> = {
              Beranda: 'view-dashboard-outline',
              Notifikasi: 'bell-outline',
              'QR Code': 'qrcode-scan',
              Lainnya: 'menu',
              Data: 'database-outline',
              Guru: 'teach',
              'Orang Tua': 'account-child-outline',
              Siswa: 'school-outline',
              Absensi: 'clipboard-check-outline',
              Profil: 'account-circle-outline',
            };
            return <View style={[moduleHeaderStyles.tabIcon,focused&&{backgroundColor:`${theme.primary_color}14`}]}><MaterialCommunityIcons name={(configuredIcons[route.name] || iconByRoute[route.name] || 'circle-outline') as never} color={color} size={Math.min(size, 22)} /></View>;
          },
        })}
      >
        {primaryTabs.map((item) => {
          const entry = tabRegistry[item.key];
          return entry ? <Tab.Screen key={item.key} name={entry.name} component={entry.component} options={{ tabBarLabel: item.label, title: item.label }} /> : null;
        })}
        {showData && <Tab.Screen
          name="Data"
          component={DataManagementScreen}
          options={moduleOptions(isFoundation ? 'Data Yayasan' : 'Data Master', theme)}
        />}
        {showTeacher && <Tab.Screen name="Guru" component={TeacherPortalScreen} options={moduleOptions('Portal Guru', theme)} />}
        {isParent && <Tab.Screen name="Orang Tua" component={ParentPortalScreen} options={moduleOptions('Portal Orang Tua', theme)} />}
        {isStudent && <Tab.Screen name="Siswa" component={StudentPortalScreen} options={moduleOptions('Portal Siswa', theme)} />}
        {showAttendance && <Tab.Screen name="Absensi" component={AbsensiScreen} options={moduleOptions('Presensi', theme)} />}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const moduleHeaderStyles=StyleSheet.create({
  backButton:{width:38,height:38,marginLeft:12,borderRadius:12,alignItems:'center',justifyContent:'center',backgroundColor:'#E8F6F0'},
  eyebrow:{fontSize:8,fontWeight:'800',letterSpacing:.8,color:'#7C8A86'},
  title:{fontSize:14,fontWeight:'900',color:'#142720',maxWidth:150},
  tabIcon:{width:38,height:30,borderRadius:12,alignItems:'center',justifyContent:'center'},
});
