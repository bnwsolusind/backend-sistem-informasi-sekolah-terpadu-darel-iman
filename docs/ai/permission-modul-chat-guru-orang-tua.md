# DOKUMEN PERMISSION CHAT GURU & ORANG TUA

Pemetaan hak akses (permission) Spatie Laravel Permission untuk modul Komunikasi Sekolah.

---

## 1. DAFTAR PERMISSION BARU

```text
chat.conversation.view     - Melihat daftar percakapan
chat.conversation.create   - Membuka percakapan baru
chat.conversation.archive  - Mengarsipkan percakapan
chat.message.view          - Membaca isi pesan
chat.message.send          - Mengirim pesan
chat.message.read          - Menandai pesan dibaca
chat.message.attachment    - Mengirim & melihat lampiran
chat.homeroom.view         - Akses percakapan Wali Kelas
chat.subject_teacher.view  - Akses percakapan Guru Mapel
chat.analytics.view        - Melihat statistik komunikasi
chat.configuration.manage  - Pengaturan sistem chat
```

---

## 2. PEMETAAN PER ROLE

### Role: Orang Tua
- `chat.conversation.view`
- `chat.conversation.create`
- `chat.message.view`
- `chat.message.send`
- `chat.message.read`
- `chat.message.attachment`
- `chat.homeroom.view`
- `chat.subject_teacher.view`

### Role: Wali Kelas
- `chat.conversation.view`
- `chat.message.view`
- `chat.message.send`
- `chat.message.read`
- `chat.message.attachment`
- `chat.homeroom.view`

### Role: Guru (Guru Mapel)
- `chat.conversation.view`
- `chat.message.view`
- `chat.message.send`
- `chat.message.read`
- `chat.message.attachment`
- `chat.subject_teacher.view`

### Role: Super Admin
- Memiliki seluruh permission di atas secara otomatis.
