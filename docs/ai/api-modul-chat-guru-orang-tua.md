# DOKUMEN SPESIFIKASI API CHAT GURU & ORANG TUA

Spesifikasi endpoint REST API untuk modul **Komunikasi Sekolah / Chat Guru**.

---

## 1. ENDPOINT PORTAL ORANG TUA (`/api/portal/chat/*`)

### `GET /api/portal/chat/contacts`
Mengambil daftar guru (Wali Kelas & Guru Mapel) yang berhak dihubungi untuk anak aktif.

- **Query Params**: `child_id` (opsional jika dikirim via Header `X-Child-Id`)
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "user_id": "uuid-user-guru",
      "name": "Ustadz Ahmad, S.Pd",
      "photo": null,
      "role": "Wali Kelas",
      "teacher_type": "wali_kelas",
      "subject": "Wali Kelas (Kelas 5A)",
      "class_name": "Kelas 5A",
      "unit_name": "MIT-01",
      "student_id": "uuid-siswa",
      "student_name": "Ahmad Fauzan",
      "last_message": "Assalamu'alaikum ustadz...",
      "last_message_at": "2026-08-03T10:00:00Z",
      "unread_count": 1
    }
  ]
}
```

### `GET /api/portal/chat/{teacherUserId}`
Mengambil riwayat pesan antara orang tua dan guru tertentu untuk siswa aktif. Menandai pesan masuk sebagai dibaca (`read_at`).

### `POST /api/portal/chat/{teacherUserId}`
Mengirim pesan dari orang tua ke guru.

- **Payload**:
```json
{
  "child_id": "uuid-siswa",
  "message": "Assalamu'alaikum ustadz, ingin bertanya terkait tugas matematika."
}
```

---

## 2. ENDPOINT PORTAL GURU (`/api/teacher/chat/*`)

### `GET /api/teacher/chat/conversations`
Mengambil seluruh daftar percakapan dari orang tua siswa yang diajar oleh guru.

### `GET /api/teacher/chat/parent/{parentUserId}/student/{studentId}`
Mengambil pesan percakapan spesifik antara guru dan orang tua untuk siswa tertentu.

### `POST /api/teacher/chat/parent/{parentUserId}/student/{studentId}`
Mengirim balasan pesan dari guru ke orang tua siswa.

---

## 3. UNIFIED ALIAS ROUTES (`/api/chat/*`)

- `GET /api/chat/contacts`: Alias ke contacts orang tua
- `GET /api/chat/available-teachers`: Alias ketersediaan guru
- `GET /api/chat/conversations`: Alias daftar percakapan guru
- `GET /api/chat/messages/{teacherUserId}`: Alias pesan
- `POST /api/chat/messages/{teacherUserId}`: Alias kirim pesan
