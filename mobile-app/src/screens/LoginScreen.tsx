import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Image,
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
import { getApiErrorMessage } from '../services/api';
import { mobileApiService } from '../services/mobileApiService';
import { useAuthStore } from '../stores/authStore';
import { useMobileConfigStore } from '../stores/mobileConfigStore';
import MinimalPageBackground from '../components/MinimalPageBackground';

const roleNames = (value: unknown): string[] => (
  Array.isArray(value)
    ? value.map((item) => typeof item === 'string' ? item : (item as { name?: string })?.name).filter(Boolean) as string[]
    : []
);

export default function LoginScreen() {
  const setSession = useAuthStore((state) => state.setSession);
  const config = useMobileConfigStore((state) => state.config);
  const theme = config.theme;
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

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: theme.background_color }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.background, { backgroundColor: theme.background_color }]}>
        <MinimalPageBackground
          baseColor={theme.background_color}
          primaryColor={theme.primary_color}
          enabled={theme.background_gradient_enabled}
          gradientStart={theme.background_gradient_start}
          gradientEnd={theme.background_gradient_end}
          direction={theme.background_gradient_direction}
        />
        <View style={[styles.heroBackdrop, { backgroundColor: theme.primary_color }]} />
        <View style={[styles.heroGlow, { backgroundColor: theme.secondary_color }]} />
        <View style={styles.heroMintShape} />
        <View style={styles.heroTealShape} />

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            {config.branding.logo_url ? <Image source={{ uri: config.branding.logo_url }} style={styles.logo} resizeMode="contain" /> : <BrandEmblem size={76} />}
            <Text style={styles.schoolName}>{config.branding.app_name}</Text>
            <Text style={styles.schoolBranch}>{config.branding.school_name}</Text>
            <View style={styles.securePill}><MaterialCommunityIcons name="shield-check-outline" size={14} color="#D1FAE5" /><Text style={styles.secureText}>Portal sekolah aman & terpadu</Text></View>
          </View>

          <Surface style={[styles.sheet, { backgroundColor: theme.surface_color, borderRadius: theme.card_radius + 8 }]} elevation={3}>
            <View style={styles.sheetHeading}><View><Text style={[styles.greeting, { color: theme.text_color }]}>Assalamu'alaikum 👋</Text><Text style={[styles.welcome, { color: theme.muted_text_color }]}>Masuk menggunakan akun sekolah Anda</Text></View><View style={[styles.loginIcon, { backgroundColor: `${theme.primary_color}12` }]}><MaterialCommunityIcons name="account-lock-outline" size={23} color={theme.primary_color} /></View></View>

            <Text style={[styles.fieldLabel, { color: theme.text_color }]}>Identitas pengguna</Text>

            <TextInput
              mode="outlined"
              placeholder="Email, NIS, NIY, atau nomor HP"
              value={identifier}
              onChangeText={setIdentifier}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              onFocus={() => setError('')}
              left={<TextInput.Icon icon="account-outline" color={theme.muted_text_color} />}
              style={styles.input}
              outlineColor="#D6DFDD"
              activeOutlineColor={theme.primary_color}
              textColor={theme.text_color}
              placeholderTextColor="#8C9896"
              outlineStyle={[styles.inputOutline, { borderRadius: theme.button_radius }]}
            />

            <Text style={[styles.fieldLabel, { color: theme.text_color }]}>Kata sandi</Text>
            <TextInput
              mode="outlined"
              placeholder="Kata sandi"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              onSubmitEditing={submit}
              onFocus={() => setError('')}
              left={<TextInput.Icon icon="lock-outline" color={theme.muted_text_color} />}
              right={<TextInput.Icon icon={showPassword ? 'eye-off-outline' : 'eye-outline'} color="#7B8886" onPress={() => setShowPassword((visible) => !visible)} />}
              style={styles.input}
              outlineColor="#D6DFDD"
              activeOutlineColor={theme.primary_color}
              textColor={theme.text_color}
              placeholderTextColor="#8C9896"
              outlineStyle={[styles.inputOutline, { borderRadius: theme.button_radius }]}
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
                <View style={[styles.checkbox, rememberMe && { borderColor: theme.primary_color, backgroundColor: theme.primary_color }]}>
                  {rememberMe ? <MaterialCommunityIcons name="check" size={15} color="#FFFFFF" /> : null}
                </View>
                <Text style={styles.rememberText}>Ingat saya</Text>
              </Pressable>
              <Pressable onPress={() => setError('Hubungi administrator sekolah untuk mengatur ulang kata sandi.')}>
                <Text style={[styles.forgotText, { color: theme.primary_color }]}>Lupa kata sandi?</Text>
              </Pressable>
            </View>

            <Button
              mode="contained"
              onPress={submit}
              loading={loading}
              disabled={loading}
              style={[styles.submit, { borderRadius: theme.button_radius }]}
              contentStyle={styles.submitContent}
              buttonColor={theme.primary_color}
              textColor="#FFFFFF"
              labelStyle={styles.submitLabel}
            >
              Masuk ke aplikasi
            </Button>
            <View style={styles.helpRow}><MaterialCommunityIcons name="information-outline" size={16} color={theme.muted_text_color} /><Text style={[styles.helpText, { color: theme.muted_text_color }]}>Akun dan hak akses dikelola oleh sekolah</Text></View>
          </Surface>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 }, background: { flex: 1, overflow: 'hidden' },
  heroBackdrop:{position:'absolute',left:-80,right:-80,top:-180,height:500,borderBottomLeftRadius:190,borderBottomRightRadius:190},
  heroGlow:{position:'absolute',width:260,height:260,borderRadius:130,right:-100,top:-80,opacity:.22},
  heroMintShape:{position:'absolute',width:250,height:110,borderRadius:58,right:-80,top:205,backgroundColor:'#65E1AF',opacity:.7,transform:[{rotate:'-12deg'}]},
  heroTealShape:{position:'absolute',width:210,height:95,borderRadius:50,left:-95,top:245,backgroundColor:'#12B99B',opacity:.65,transform:[{rotate:'14deg'}]},
  content: { flexGrow: 1, paddingTop: 38, paddingHorizontal: 18, paddingBottom: 28 },
  hero: { alignItems: 'center', justifyContent: 'center', minHeight: 240, paddingBottom:22 }, logo:{width:76,height:76},
  schoolName:{fontSize:20,fontWeight:'900',color:'#FFFFFF',marginTop:12,textAlign:'center'},
  schoolBranch:{fontSize:11,fontWeight:'700',color:'#DDF8EC',letterSpacing:.7,marginTop:4,textTransform:'uppercase'},
  securePill:{marginTop:14,flexDirection:'row',alignItems:'center',gap:6,borderRadius:999,backgroundColor:'rgba(255,255,255,.12)',paddingHorizontal:12,paddingVertical:7},secureText:{fontSize:10,fontWeight:'700',color:'#E9FFF7'},
  sheet: {
    marginTop: 0, padding: 20, shadowColor:'#00281C',shadowOpacity:.14,shadowRadius:24,shadowOffset:{width:0,height:10},
  },
  sheetHeading:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:22},loginIcon:{width:46,height:46,borderRadius:15,alignItems:'center',justifyContent:'center'},
  greeting: { fontSize: 19, lineHeight: 25, fontWeight: '900' }, welcome: { fontSize: 11, marginTop: 3 },
  fieldLabel: { fontSize: 11, fontWeight: '800', marginBottom: 7 }, input: { backgroundColor: '#FFFFFF', marginBottom: 15 },
  inputOutline: { borderRadius: 12, borderWidth: 1 },
  alert: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, borderRadius: 11, borderWidth: 1, borderColor: '#F4C9C5', backgroundColor: '#FFF3F1', padding: 10, marginBottom: 12 },
  alertText: { flex: 1, color: '#A84A43', fontSize: 12, lineHeight: 17 },
  optionsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 1, marginBottom: 21 },
  rememberAction: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: { width: 19, height: 19, borderRadius: 4, borderWidth: 1.5, borderColor: '#A8B7B2', alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { borderColor: '#087A5A', backgroundColor: '#087A5A' },
  rememberText: { color: '#384541', fontSize: 12 },
  forgotText: { color: '#087A5A', fontSize: 12, fontWeight: '700' },
  submit: { marginTop:3 }, submitContent: { minHeight: 52 },
  submitLabel: { fontSize: 15, fontWeight: '800' },
  helpRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:6,marginTop:18},helpText:{fontSize:10},
});
