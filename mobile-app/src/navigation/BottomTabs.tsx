import React, { useEffect } from 'react';
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
import { useAuthStore } from '../stores/authStore';
import { mobileApiService } from '../services/mobileApiService';
import {
  isFoundationRole,
  isParentRole,
  isStaffRole,
  isStudentRole,
  isSuperAdminRole,
  isTeacherRole,
} from '../utils/roles';

const Tab = createBottomTabNavigator();

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
          headerStyle: { backgroundColor: '#FFFFFF' },
          headerTitleStyle: { color: '#0E5C44', fontWeight: '800' },
          tabBarActiveTintColor: '#0E5C44',
          tabBarInactiveTintColor: '#64748B',
          tabBarStyle: { backgroundColor: '#FFFFFF', paddingBottom: 4, height: 60 },
          tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
          tabBarIcon: ({ color, size }) => {
            const iconByRoute: Record<string, string> = {
              Beranda: 'view-dashboard-outline',
              Data: 'database-outline',
              Guru: 'teach',
              'Orang Tua': 'account-child-outline',
              Siswa: 'school-outline',
              Absensi: 'clipboard-check-outline',
              Profil: 'account-circle-outline',
            };
            return <MaterialCommunityIcons name={(iconByRoute[route.name] || 'circle-outline') as never} color={color} size={size} />;
          },
        })}
      >
        <Tab.Screen name="Beranda" component={HomeScreen} options={{ title: 'Beranda' }} />
        {showData && <Tab.Screen
          name="Data"
          component={DataManagementScreen}
          options={{ title: isFoundation ? 'Yayasan' : 'Data Master' }}
        />}
        {showTeacher && <Tab.Screen name="Guru" component={TeacherPortalScreen} options={{ title: 'Portal Guru' }} />}
        {isParent && <Tab.Screen name="Orang Tua" component={ParentPortalScreen} options={{ title: 'Portal Ortu' }} />}
        {isStudent && <Tab.Screen name="Siswa" component={StudentPortalScreen} options={{ title: 'Portal Siswa' }} />}
        {showAttendance && <Tab.Screen name="Absensi" component={AbsensiScreen} options={{ title: 'Presensi' }} />}
        <Tab.Screen name="Profil" component={ProfilScreen} options={{ title: 'Profil' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
