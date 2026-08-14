import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TeacherPortalScreen() {
  const [activeTab, setActiveTab] = useState<'overview' | 'presensi' | 'tahfizh' | 'catatan'>('overview');
  const [selectedClass, setSelectedClass] = useState('7A - Thariq bin Ziyad');

  // Dummy / State for forms
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  const handleSaveNote = () => {
    if (!noteTitle || !noteContent) {
      Alert.alert('Peringatan', 'Judul dan isi catatan tidak boleh kosong.');
      return;
    }
    Alert.alert('Berhasil', 'Catatan siswa berhasil disimpan.');
    setNoteTitle('');
    setNoteContent('');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Banner */}
      <View style={styles.headerBanner}>
        <Text style={styles.headerTag}>PORTAL GURU TERPADU</Text>
        <Text style={styles.headerTitle}>Assalamu'alaikum, Ustadz</Text>
        <Text style={styles.headerSubtitle}>Tahun Ajaran 2025/2026 | Semester Ganjil</Text>
      </View>

      {/* Mode Switch Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'overview' && styles.tabButtonActive]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>Ringkasan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'presensi' && styles.tabButtonActive]}
          onPress={() => setActiveTab('presensi')}
        >
          <Text style={[styles.tabText, activeTab === 'presensi' && styles.tabTextActive]}>Presensi</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'tahfizh' && styles.tabButtonActive]}
          onPress={() => setActiveTab('tahfizh')}
        >
          <Text style={[styles.tabText, activeTab === 'tahfizh' && styles.tabTextActive]}>Tahfizh</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'catatan' && styles.tabButtonActive]}
          onPress={() => setActiveTab('catatan')}
        >
          <Text style={[styles.tabText, activeTab === 'catatan' && styles.tabTextActive]}>Catatan</Text>
        </TouchableOpacity>
      </View>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <View style={styles.section}>
          {/* KPI Grid */}
          <View style={styles.kpiGrid}>
            <View style={styles.kpiCard}>
              <MaterialCommunityIcons name="clock-outline" size={24} color="#0E5C44" />
              <Text style={styles.kpiNumber}>4</Text>
              <Text style={styles.kpiLabel}>Jadwal Hari Ini</Text>
            </View>

            <View style={styles.kpiCard}>
              <MaterialCommunityIcons name="account-group" size={24} color="#1E8E5A" />
              <Text style={styles.kpiNumber}>32</Text>
              <Text style={styles.kpiLabel}>Siswa Diajar</Text>
            </View>

            <View style={styles.kpiCard}>
              <MaterialCommunityIcons name="file-document-edit" size={24} color="#d97706" />
              <Text style={styles.kpiNumber}>5</Text>
              <Text style={styles.kpiLabel}>Tugas Perlu Nilai</Text>
            </View>

            <View style={styles.kpiCard}>
              <MaterialCommunityIcons name="book-open-page-variant" size={24} color="#2563eb" />
              <Text style={styles.kpiNumber}>12</Text>
              <Text style={styles.kpiLabel}>Setoran Tahfizh</Text>
            </View>
          </View>

          {/* Today's Schedule Card */}
          <Text style={styles.sectionTitle}>Jadwal Mengajar Hari Ini</Text>
          <View style={styles.card}>
            <View style={styles.scheduleItem}>
              <View style={styles.timeBadge}>
                <Text style={styles.timeText}>07.30 - 09.00</Text>
              </View>
              <View style={styles.scheduleDetail}>
                <Text style={styles.subjectText}>PAI & Budi Pekerti</Text>
                <Text style={styles.classText}>Kelas 7A - Ruang 102</Text>
              </View>
            </View>

            <View style={styles.scheduleItem}>
              <View style={styles.timeBadge}>
                <Text style={styles.timeText}>09.30 - 11.00</Text>
              </View>
              <View style={styles.scheduleDetail}>
                <Text style={styles.subjectText}>Bahasa Arab</Text>
                <Text style={styles.classText}>Kelas 8B - Ruang 204</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* PRESENSI TAB */}
      {activeTab === 'presensi' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Input Presensi Siswa</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Pilih Rombel & Sesi</Text>
            <TouchableOpacity style={styles.pickerButton}>
              <Text style={styles.pickerText}>{selectedClass}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => Alert.alert('Presensi', 'Membuka checklist presensi massal.')}
            >
              <Text style={styles.actionButtonText}>Mulai Input Presensi Massal</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* TAHFIZH TAB */}
      {activeTab === 'tahfizh' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Input Setoran Tahfizh</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Pilih Siswa</Text>
            <TextInput style={styles.input} placeholder="Cari nama siswa..." placeholderTextColor="#94a3b8" />

            <Text style={styles.label}>Jenis Setoran</Text>
            <TextInput style={styles.input} defaultValue="Ziyadah" />

            <Text style={styles.label}>Surah & Ayat</Text>
            <TextInput style={styles.input} placeholder="Contoh: An-Naba' Ayat 1-15" placeholderTextColor="#94a3b8" />

            <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Sukses', 'Setoran berhasil dicatat.')}>
              <Text style={styles.actionButtonText}>Simpan Setoran Tahfizh</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* CATATAN TAB */}
      {activeTab === 'catatan' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tambah Catatan Perkembangan Siswa</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Judul Catatan</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: Peningkatan Prestasi Harian"
              value={noteTitle}
              onChangeText={setNoteTitle}
            />

            <Text style={styles.label}>Isi Catatan</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              multiline
              placeholder="Tuliskan perkembangan akademik atau adab siswa..."
              value={noteContent}
              onChangeText={setNoteContent}
            />

            <TouchableOpacity style={styles.actionButton} onPress={handleSaveNote}>
              <Text style={styles.actionButtonText}>Simpan Catatan Siswa</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FC' },
  headerBanner: {
    backgroundColor: '#0E5C44',
    padding: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTag: { color: '#3FBF75', fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', marginTop: 4 },
  headerSubtitle: { color: '#E2E8F0', fontSize: 12, marginTop: 2 },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 14,
    padding: 4,
    elevation: 2,
  },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabButtonActive: { backgroundColor: '#0E5C44' },
  tabText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  tabTextActive: { color: '#FFFFFF' },
  section: { paddingHorizontal: 16, paddingBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#0F172A', marginBottom: 12 },
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  kpiCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  kpiNumber: { fontSize: 22, fontWeight: 'bold', color: '#0F172A', marginTop: 6 },
  kpiLabel: { fontSize: 11, color: '#64748B', marginTop: 2 },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9' },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#0F172A', marginBottom: 10 },
  scheduleItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  timeBadge: { backgroundColor: '#E6F4EA', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, marginRight: 12 },
  timeText: { color: '#0E5C44', fontSize: 11, fontWeight: 'bold' },
  scheduleDetail: { flex: 1 },
  subjectText: { fontSize: 13, fontWeight: 'bold', color: '#0F172A' },
  classText: { fontSize: 11, color: '#64748B', marginTop: 2 },
  pickerButton: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12 },
  pickerText: { fontSize: 13, color: '#0F172A', fontWeight: '500' },
  actionButton: { backgroundColor: '#0E5C44', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  actionButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: 'bold' },
  label: { fontSize: 12, fontWeight: '600', color: '#334155', marginTop: 10, marginBottom: 4 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 10, fontSize: 13, color: '#0F172A' },
});
