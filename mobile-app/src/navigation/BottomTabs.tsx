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
  const roles = useAuthStore((state) => state.roles.map((role) => role.toLowerCase().replace(/[_ ]/g, '')));
  useEffect(() => {
    if (!token || roles.length) return;
    mobileApiService.getProfile().then((response) => {
      const profile = response?.data ?? response;
      const profileRoles = profile?.roles || (profile?.role ? [profile.role] : []);
      setRoles(profileRoles.map((role: any) => typeof role === 'string' ? role : role.name).filter(Boolean));
    }).catch(() => setRoles([]));
  }, [roles.length, setRoles, token]);
  const canPreview = roles.some((role) => ['superadmin', 'admin'].includes(role));
  const isTeacher = roles.some((role) => ['guru', 'teacher'].includes(role));
  const isParent = canPreview || roles.some((role) => ['orangtua', 'parent', 'wali'].includes(role));
  const isStudent = canPreview || roles.some((role) => ['siswa', 'student'].includes(role));
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
        <Tab.Screen
          name="Beranda"
          component={HomeScreen}
          options={{ title: 'SIMS Islam Terpadu' }}
        />
        {isTeacher && <Tab.Screen
          name="Guru"
          component={TeacherPortalScreen}
          options={{ title: 'Portal Guru' }}
        />}
        {isParent && <Tab.Screen
          name="Orang Tua"
          component={ParentPortalScreen}
          options={{ title: 'Portal Ortu' }}
        />}
        {isStudent && <Tab.Screen
          name="Siswa"
          component={StudentPortalScreen}
          options={{ title: 'Portal Siswa' }}
        />}
        <Tab.Screen
          name="Absensi"
          component={AbsensiScreen}
          options={{ title: 'Presensi' }}
        />
        <Tab.Screen
          name="Tahfizh"
          component={TahfizhScreen}
          options={{ title: 'Tahfizh' }}
        />
        <Tab.Screen name="Mutabaah" component={MutabaahScreen} options={{ title: 'Mutabaah' }} />
        <Tab.Screen
          name="Profil"
          component={ProfilScreen}
          options={{ title: 'Profil' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
