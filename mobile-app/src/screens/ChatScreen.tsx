import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { mobileApiService } from '../services/mobileApiService';

type Contact = {
  user_id: string;
  name: string;
  role: string;
  teacher_type: string;
  subject: string;
  class_name: string;
  unit_name: string;
  student_name: string;
  unread_count?: number;
  last_message?: string;
  last_message_at?: string;
};

type Message = {
  id: string;
  sender_user_id: string;
  recipient_user_id: string;
  message: string;
  created_at: string;
};

const unwrap = <T,>(response: any): T => response?.data?.data ?? response?.data ?? response;

export default function ChatScreen() {
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string>();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    try {
      const childRes = await mobileApiService.getPortalChildren();
      const availableChildren = unwrap<any[]>(childRes) || [];
      setChildren(availableChildren);
      const activeChildId = selectedChildId || availableChildren[0]?.id;
      setSelectedChildId(activeChildId);

      if (activeChildId) {
        const contactRes = await mobileApiService.getChatContacts(activeChildId);
        const contactList = unwrap<Contact[]>(contactRes) || [];
        setContacts(contactList);
        if (contactList.length > 0 && !selectedContact) {
          setSelectedContact(contactList[0]);
        }
      }
    } catch (err) {
      console.log('Error loading chat contacts:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedChildId]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const loadMessages = useCallback(async () => {
    if (!selectedContact || !selectedChildId) return;
    setMessagesLoading(true);
    try {
      const targetId = selectedContact.user_id;
      const res = await mobileApiService.getChatMessages(targetId, selectedChildId);
      setMessages(unwrap<Message[]>(res) || []);
    } catch (err) {
      console.log('Error loading messages:', err);
    } finally {
      setMessagesLoading(false);
    }
  }, [selectedContact, selectedChildId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleSend = async () => {
    if (!inputText.trim() || !selectedContact || !selectedChildId || sending) return;
    setSending(true);
    try {
      await mobileApiService.sendChatMessage(selectedContact.user_id, selectedChildId, inputText.trim());
      setInputText('');
      loadMessages();
      loadContacts();
    } catch (err) {
      console.log('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Komunikasi Sekolah</Text>
        <Text style={styles.headerSubtitle}>Chat Wali Kelas & Guru Mapel</Text>

        {children.length > 1 && (
          <View style={styles.childSelector}>
            {children.map((c) => (
              <TouchableOpacity
                key={c.id}
                onPress={() => setSelectedChildId(c.id)}
                style={[styles.childChip, selectedChildId === c.id && styles.childChipActive]}
              >
                <Text style={[styles.childChipText, selectedChildId === c.id && styles.white]}>
                  {c.full_name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Main Layout: Contact Selector or Chat Detail */}
      {!selectedContact ? (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.user_id}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={loadContacts} tintColor="#0E5C44" />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="chat-outline" size={48} color="#CBD5E1" />
              <Text style={styles.emptyText}>Belum ada kontak guru</Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.contactCard} onPress={() => setSelectedContact(item)}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{(item.name || 'G')[0]}</Text>
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text style={styles.contactRole}>
                  {item.role} • {item.subject}
                </Text>
                {item.last_message && (
                  <Text style={styles.lastMsg} numberOfLines={1}>
                    {item.last_message}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.chatRoom}>
          <View style={styles.roomHeader}>
            <TouchableOpacity onPress={() => setSelectedContact(null)} style={styles.backButton}>
              <MaterialCommunityIcons name="chevron-left" size={28} color="#0F172A" />
            </TouchableOpacity>
            <View style={styles.roomInfo}>
              <Text style={styles.roomName}>{selectedContact.name}</Text>
              <Text style={styles.roomSub}>
                {selectedContact.role} • {selectedContact.subject}
              </Text>
            </View>
          </View>

          {messagesLoading ? (
            <ActivityIndicator color="#0E5C44" style={{ flex: 1 }} />
          ) : (
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.msgList}
              renderItem={({ item }) => {
                const isOwn = item.sender_user_id !== selectedContact.user_id;
                return (
                  <View style={[styles.msgBubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
                    <Text style={[styles.msgText, isOwn && styles.white]}>{item.message}</Text>
                    <Text style={[styles.msgTime, isOwn && styles.whiteTime]}>
                      {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                );
              }}
            />
          )}

          <View style={styles.composer}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Tulis pesan..."
              placeholderTextColor="#94A3B8"
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={!inputText.trim() || sending}
              style={[styles.sendBtn, (!inputText.trim() || sending) && styles.disabledBtn]}
            >
              <MaterialCommunityIcons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { backgroundColor: '#0E5C44', padding: 18, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#fff' },
  headerSubtitle: { fontSize: 11, color: '#D1FAE5', marginTop: 2 },
  childSelector: { flexDirection: 'row', gap: 6, marginTop: 10 },
  childChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)' },
  childChipActive: { backgroundColor: '#fff' },
  childChipText: { fontSize: 11, color: '#E2E8F0', fontWeight: '700' },
  white: { color: '#0E5C44' },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 12, color: '#94A3B8', marginTop: 8 },
  contactCard: { flexDirection: 'row', padding: 14, backgroundColor: '#fff', marginHorizontal: 12, marginTop: 8, borderRadius: 16, alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#0E5C44', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontWeight: '800', fontSize: 16 },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  contactRole: { fontSize: 11, color: '#059669', fontWeight: '600', marginTop: 1 },
  lastMsg: { fontSize: 11, color: '#64748B', marginTop: 3 },
  chatRoom: { flex: 1 },
  roomHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E2E8F0', gap: 8 },
  backButton: { padding: 4 },
  roomInfo: { flex: 1 },
  roomName: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  roomSub: { fontSize: 11, color: '#64748B' },
  msgList: { padding: 16, gap: 10 },
  msgBubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginVertical: 2 },
  ownBubble: { alignSelf: 'flex-end', backgroundColor: '#0E5C44', borderBottomRightRadius: 2 },
  otherBubble: { alignSelf: 'flex-start', backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderBottomLeftRadius: 2 },
  msgText: { fontSize: 13, color: '#0F172A', lineHeight: 18 },
  msgTime: { fontSize: 9, color: '#64748B', marginTop: 4, textAlign: 'right' },
  whiteTime: { color: 'rgba(255,255,255,0.7)' },
  composer: { flexDirection: 'row', padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#E2E8F0', gap: 8, alignItems: 'center' },
  input: { flex: 1, minHeight: 42, backgroundColor: '#F1F5F9', borderRadius: 14, paddingHorizontal: 14, fontSize: 13, color: '#0F172A' },
  sendBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#0E5C44', justifyContent: 'center', alignItems: 'center' },
  disabledBtn: { opacity: 0.5 },
});
