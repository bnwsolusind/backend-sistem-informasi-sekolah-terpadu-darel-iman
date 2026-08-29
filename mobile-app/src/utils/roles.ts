export const normalizeRole = (role: string): string =>
  role.toLowerCase().replace(/[\s_/-]+/g, '');

export const normalizedRoles = (roles: string[]): string[] => roles.map(normalizeRole);

export const hasAnyRole = (roles: string[], candidates: string[]): boolean => {
  const normalized = new Set(normalizedRoles(roles));
  return candidates.some((candidate) => normalized.has(normalizeRole(candidate)));
};

export const isFoundationRole = (roles: string[]): boolean => hasAnyRole(roles, [
  'Yayasan',
  'Ketua Yayasan',
  'Pengurus Yayasan',
  'Pengurus',
  'Sekretaris Yayasan',
  'Bendahara Yayasan',
  'pengurus_yayasan',
  'ketua_yayasan',
  'sekretaris_yayasan',
  'bendahara_yayasan',
]);

export const isPrincipalRole = (roles: string[]): boolean => hasAnyRole(roles, [
  'Kepala Sekolah',
  'kepala_sekolah',
  'KepalaSekolah',
  'kepsek',
]);

export const isTeacherRole = (roles: string[]): boolean => hasAnyRole(roles, [
  'Guru',
  'Guru Mata Pelajaran',
  'Guru PAI',
  'Pembimbing',
  'Wali Kelas',
  'Guru Tahfizh',
  'Guru BK',
  'Musyrif',
  'Musyrifah',
  'Musyrif / Musyrifah',
]);

export const isParentRole = (roles: string[]): boolean => hasAnyRole(roles, [
  'Orang Tua',
  'Orangtua',
  'Wali Murid',
  'parent',
]);

export const isStudentRole = (roles: string[]): boolean => hasAnyRole(roles, [
  'Siswa',
  'student',
  'Alumni',
]);

export const isSuperAdminRole = (roles: string[]): boolean => hasAnyRole(roles, [
  'Super Admin',
  'Superadmin',
  'super_admin',
  'super-admin',
]);

export const isStaffRole = (roles: string[]): boolean => (
  isFoundationRole(roles)
  || isPrincipalRole(roles)
  || isTeacherRole(roles)
  || isSuperAdminRole(roles)
  || hasAnyRole(roles, [
    'Admin',
    'Divisi Pendidikan',
    'Kepala Bidang Pendidikan',
    'Wakil Kepala Sekolah',
    'Waka Kurikulum',
    'Waka Kesiswaan',
    'Tata Usaha',
    'TU',
    'Operator',
    'Pegawai',
    'Staf',
    'Staff',
  ])
);

export const roleLabel = (roles: string[], fallback = 'Pengguna'): string => {
  if (isSuperAdminRole(roles)) return 'Super Admin';
  if (isFoundationRole(roles)) return 'Pengurus Yayasan';
  if (isPrincipalRole(roles)) return 'Kepala Sekolah';
  if (isTeacherRole(roles)) return 'Guru / Pengajar';
  if (isParentRole(roles)) return 'Orang Tua';
  if (isStudentRole(roles)) return 'Siswa';
  return roles[0] || fallback;
};

export const homeLayoutKeyForRoles = (roles: string[]): string => {
  if (isSuperAdminRole(roles)) return 'super_admin';
  if (isFoundationRole(roles)) return 'foundation';
  if (isPrincipalRole(roles)) return 'principal';
  if (isTeacherRole(roles)) return 'teacher';
  if (isParentRole(roles)) return 'parent';
  if (isStudentRole(roles)) return 'student';
  return 'staff';
};

export const dashboardEndpointForRoles = (roles: string[]): string => {
  if (isSuperAdminRole(roles)) return '/dashboard/super-admin';
  if (isFoundationRole(roles)) return '/foundation/dashboard';
  if (isPrincipalRole(roles)) return '/dashboard/kepala-sekolah';
  if (isTeacherRole(roles)) return '/teacher/dashboard';

  if (hasAnyRole(roles, ['Tata Usaha', 'TU'])) return '/dashboard/tata-usaha';
  if (hasAnyRole(roles, ['Operator'])) return '/dashboard/operator';
  if (hasAnyRole(roles, ['Waka Kurikulum'])) return '/dashboard/waka-kurikulum';
  if (hasAnyRole(roles, ['Waka Kesiswaan'])) return '/dashboard/waka-kesiswaan';
  if (isParentRole(roles) || isStudentRole(roles)) return '/portal/dashboard';

  return '/employees/dashboard';
};
