import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {
  Button,
  Surface,
  Text,
  TextInput,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import BrandEmblem from '../components/BrandEmblem';
import BrandPattern from '../components/BrandPattern';
import { getApiErrorMessage } from '../services/api';
import { mobileApiService } from '../services/mobileApiService';
import { useAuthStore } from '../stores/authStore';

const roleNames = (value: unknown): string[] => (
  Array.isArray(value)
    ? value.map((item) => typeof item === 'string' ? item : (item as { name?: string })?.name).filter(Boolean) as string[]
    : []
);

export default function LoginScreen() {
  const setSession = useAuthStore((state) => state.setSession);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!identifier.trim() || !password) {
      setError('Identitas pengguna dan kata sandi wajib diisi.');
      return;
    }

    if (password.length < 8) {
      setError('Kata sandi minimal terdiri dari 8 karakter.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await mobileApiService.login(identifier.trim(), password);
      const user = response?.user?.data ?? response?.user ?? null;
      const roles = roleNames(user?.roles ?? response?.roles);
      const permissions = roleNames(user?.permissions ?? response?.permissions);

      setSession({
        token: response?.token,
        user,
        roles,
        permissions,
        portal: response?.portal ?? response?.default_portal,
        scope: user?.scope,
      });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Login gagal. Periksa identitas dan kata sandi Anda.'));
    } finally {
      setLoading(false);
    }
  };

  const showUnavailableMessage = (feature: string) => {
    setError(`${feature} belum tersedia pada build mobile ini.`);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.background}>
        <BrandPattern opacity={0.08} />
        <View style={styles.diagonalGlow} />

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <BrandEmblem size={84} />
          </View>

          <Surface style={styles.sheet} elevation={0}>
            <Text style={styles.greeting}>Assalamu'alaikum</Text>
            <Text style={styles.welcome}>Selamat datang kembali</Text>

            <Text style={styles.fieldLabel}>Identitas Pengguna</Text>
            <TextInput
              mode="outlined"
              placeholder="HP / NIY / Email / NIS / NIK"
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              onFocus={() => setError('')}
              left={<TextInput.Icon icon="account-outline" color="#7B8886" />}
              style={styles.input}
              outlineColor="#D6DFDD"
              activeOutlineColor="#087A5A"
              textColor="#17352D"
              placeholderTextColor="#8C9896"
              outlineStyle={styles.inputOutline}
            />

            <TextInput
              mode="outlined"
              placeholder="Kata sandi"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              onSubmitEditing={submit}
              onFocus={() => setError('')}
              left={<TextInput.Icon icon="lock-outline" color="#7B8886" />}
              right={<TextInput.Icon icon={showPassword ? 'eye-off-outline' : 'eye-outline'} color="#7B8886" onPress={() => setShowPassword((visible) => !visible)} />}
              style={styles.input}
              outlineColor="#D6DFDD"
              activeOutlineColor="#087A5A"
              textColor="#17352D"
              placeholderTextColor="#8C9896"
              outlineStyle={styles.inputOutline}
            />

            {error ? (
              <View style={styles.alert}>
                <MaterialCommunityIcons name="alert-circle-outline" size={19} color="#C2413B" />
                <Text style={styles.alertText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.optionsRow}>
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: rememberMe }}
                onPress={() => setRememberMe((checked) => !checked)}
                style={styles.rememberAction}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe ? <MaterialCommunityIcons name="check" size={15} color="#FFFFFF" /> : null}
                </View>
                <Text style={styles.rememberText}>Ingat saya</Text>
              </Pressable>
              <Pressable onPress={() => showUnavailableMessage('Pemulihan kata sandi')}>
                <Text style={styles.forgotText}>Lupa kata sandi?</Text>
              </Pressable>
            </View>

            <Button
              mode="contained"
              onPress={submit}
              loading={loading}
              disabled={loading}
              style={styles.submit}
              contentStyle={styles.submitContent}
              buttonColor="#087A5A"
              textColor="#FFFFFF"
              labelStyle={styles.submitLabel}
            >
              Masuk
            </Button>

            <View style={styles.dividerRow}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>atau untuk Pegawai & Guru</Text>
              <View style={styles.divider} />
            </View>

            <Button
              mode="outlined"
              icon="qrcode-scan"
              onPress={() => showUnavailableMessage('Login dengan QR Code')}
              style={styles.qrButton}
              contentStyle={styles.secondaryContent}
              textColor="#075B46"
              labelStyle={styles.secondaryLabel}
            >
              Masuk dengan QR Code
            </Button>
            <Button
              mode="outlined"
              icon="fingerprint"
              onPress={() => showUnavailableMessage('Login dengan biometrik')}
              style={styles.biometricButton}
              contentStyle={styles.secondaryContent}
              textColor="#263532"
              labelStyle={styles.secondaryLabel}
            >
              Masuk dengan biometrik
            </Button>
          </Surface>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#004B3A' },
  background: { flex: 1, overflow: 'hidden', backgroundColor: '#00523F' },
  diagonalGlow: {
    position: 'absolute',
    width: 460,
    height: 220,
    top: -54,
    left: -54,
    borderRadius: 120,
    backgroundColor: '#0D8A67',
    opacity: 0.45,
    transform: [{ rotate: '-28deg' }],
  },
  content: { flexGrow: 1, paddingTop: 34, paddingHorizontal: 20, paddingBottom: 20 },
  hero: { alignItems: 'center', justifyContent: 'center', minHeight: 122 },
  sheet: {
    minHeight: 550,
    marginHorizontal: -20,
    marginTop: 22,
    paddingHorizontal: 20,
    paddingTop: 26,
    paddingBottom: 28,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#FFFFFF',
  },
  greeting: { color: '#101716', fontSize: 27, lineHeight: 32, fontWeight: '800' },
  welcome: { color: '#46514F', fontSize: 16, marginTop: 3, marginBottom: 26 },
  fieldLabel: { color: '#202B29', fontSize: 13, fontWeight: '600', marginBottom: 7 },
  input: { backgroundColor: '#FFFFFF', marginBottom: 12 },
  inputOutline: { borderRadius: 12, borderWidth: 1 },
  alert: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, borderRadius: 11, borderWidth: 1, borderColor: '#F4C9C5', backgroundColor: '#FFF3F1', padding: 10, marginBottom: 12 },
  alertText: { flex: 1, color: '#A84A43', fontSize: 12, lineHeight: 17 },
  optionsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 1, marginBottom: 21 },
  rememberAction: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: { width: 19, height: 19, borderRadius: 4, borderWidth: 1.5, borderColor: '#A8B7B2', alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { borderColor: '#087A5A', backgroundColor: '#087A5A' },
  rememberText: { color: '#384541', fontSize: 12 },
  forgotText: { color: '#087A5A', fontSize: 12, fontWeight: '700' },
  submit: { borderRadius: 8 },
  submitContent: { minHeight: 48 },
  submitLabel: { fontSize: 15, fontWeight: '800' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginVertical: 21 },
  divider: { flex: 1, height: 1, backgroundColor: '#D8DEDC' },
  dividerText: { color: '#5C6865', fontSize: 11 },
  qrButton: { borderRadius: 8, borderColor: '#087A5A', marginBottom: 10 },
  biometricButton: { borderRadius: 8, borderColor: '#D3DCDA' },
  secondaryContent: { minHeight: 46 },
  secondaryLabel: { fontSize: 13, fontWeight: '600' },
});
