import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import AbsensiScreen from '../screens/AbsensiScreen';
import TahfizhScreen from '../screens/TahfizhScreen';
import ProfilScreen from '../screens/ProfilScreen';
import MutabaahScreen from '../screens/MutabaahScreen';
import TeacherPortalScreen from '../screens/TeacherPortalScreen';
import ParentPortalScreen from '../screens/ParentPortalScreen';
import StudentPortalScreen from '../screens/StudentPortalScreen';
import { useAuthStore } from '../stores/authStore';
import { mobileApiService } from '../services/mobileApiService';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const token = useAuthStore((state) => state.token);
  const setRoles = useAuthStore((state) => state.setRoles);
  const setPermissions = useAuthStore((state) => state.setPermissions);
  const roles = useAuthStore((state) => state.roles.map((role) => role.toLowerCase().replace(/[\s_/-]+/g, '')));
  const permissions = useAuthStore((state) => state.permissions);

  useEffect(() => {
    if (!token) return;
    mobileApiService.getProfile().then((response) => {
      const profile = response?.data ?? response;
      const profileRoles = profile?.roles || (profile?.role ? [profile.role] : []);
      const profilePermissions = profile?.permissions || [];
      setRoles(profileRoles.map((role: any) => typeof role === 'string' ? role : role.name).filter(Boolean));
      setPermissions(profilePermissions.map((permission: any) => typeof permission === 'string' ? permission : permission.name).filter(Boolean));
    }).catch(() => {
      setRoles([]);
      setPermissions([]);
    });
  }, [setPermissions, setRoles, token]);

  const isAuthenticated = Boolean(token);
  const isSuperAdmin = roles.includes('superadmin');
  const hasAnyPermission = (...names: string[]) => isSuperAdmin || names.some((name) => permissions.includes(name));
  const hasPermissionPrefix = (prefix: string) => isSuperAdmin || permissions.some((permission) => permission.startsWith(prefix));
  const isTeacher = roles.some((role) => [
    'guru', 'teacher', 'gurumatapelajaran', 'gurupai', 'pembimbing', 'walikelas',
    'gurutahfizh', 'gurubk', 'musyrif', 'musyrifah', 'musyrifmusyrifah',
  ].includes(role));
  const isParent = roles.some((role) => ['orangtua', 'orangtuasiswa', 'parent', 'walimurid', 'wali'].includes(role));
  const isStudent = roles.some((role) => ['siswa', 'student'].includes(role));
  const canOpenTeacherPortal = isAuthenticated && (isTeacher || isSuperAdmin) && hasAnyPermission('teacher.dashboard.view');
  const canOpenParentPortal = isAuthenticated && (isParent || isSuperAdmin) && hasAnyPermission('parent.portal.view');
  const canOpenStudentPortal = isAuthenticated && (isStudent || isSuperAdmin) && hasAnyPermission('student.portal.view');
  const canOpenAttendance = isAuthenticated && hasAnyPermission(
    'attendance.view', 'attendance.manage', 'teacher.attendance.view', 'teacher.attendance.create',
    'parent.attendance.view', 'student.attendance.view', 'student_attendance.view_own',
    'lesson_attendance.view', 'lesson_attendance.view_own',
  );
  const canOpenTahfizh = isAuthenticated && (
    hasPermissionPrefix('tahfizh.') || hasAnyPermission('teacher.tahfizh.view', 'parent.tahfizh.view', 'student.tahfizh.view')
  );
  const canOpenMutabaah = isAuthenticated && (
    hasPermissionPrefix('mutabaah.') || hasAnyPermission('teacher.mutabaah.view', 'parent.mutabaah.view', 'student.mutabaah.view')
  );
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: '#ffffff' },
          headerTitleStyle: { color: '#0E5C44', fontWeight: 'bold' },
          tabBarActiveTintColor: '#0E5C44',
          tabBarInactiveTintColor: '#64748b',
          tabBarStyle: { backgroundColor: '#ffffff', paddingBottom: 4, height: 60 },
          tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
          tabBarIcon: ({ color, size }) => {
            let iconName = 'circle';
            if (route.name === 'Beranda') iconName = 'home-variant';
            else if (route.name === 'Guru') iconName = 'school';
            else if (route.name === 'Orang Tua') iconName = 'human-female-boy';
            else if (route.name === 'Siswa') iconName = 'account-student';
            else if (route.name === 'Absensi') iconName = 'clipboard-check';
            else if (route.name === 'Tahfizh') iconName = 'book-open-page-variant';
            else if (route.name === 'Mutabaah') iconName = 'book-heart';
            else if (route.name === 'Profil') iconName = 'account-circle';
            return <MaterialCommunityIcons name={iconName as never} color={color} size={size} />;
          },
        })}
      >
        {isAuthenticated && <Tab.Screen
          name="Beranda"
          component={HomeScreen}
          options={{ title: 'SIMS Islam Terpadu' }}
        />}
        {canOpenTeacherPortal && <Tab.Screen
          name="Guru"
          component={TeacherPortalScreen}
          options={{ title: 'Portal Guru' }}
        />}
        {canOpenParentPortal && <Tab.Screen
          name="Orang Tua"
          component={ParentPortalScreen}
          options={{ title: 'Portal Ortu' }}
        />}
        {canOpenStudentPortal && <Tab.Screen
          name="Siswa"
          component={StudentPortalScreen}
          options={{ title: 'Portal Siswa' }}
        />}
        {canOpenAttendance && <Tab.Screen
          name="Absensi"
          component={AbsensiScreen}
          options={{ title: 'Presensi' }}
        />}
        {canOpenTahfizh && <Tab.Screen
          name="Tahfizh"
          component={TahfizhScreen}
          options={{ title: 'Tahfizh' }}
        />}
        {canOpenMutabaah && <Tab.Screen name="Mutabaah" component={MutabaahScreen} options={{ title: 'Mutabaah' }} />}
        <Tab.Screen
          name="Profil"
          component={ProfilScreen}
          options={{ title: 'Profil' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
