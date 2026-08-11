# Dokumen Persetujuan & Tanda Tangan Orang Tua (PARENT_NOTE_APPROVAL_FLOW.md)

Dokumen ini menjelaskan alur peninjauan catatan mingguan/harian oleh Orang Tua, pemberian respons, serta tanda tangan digital beserta jejak audit.

```text
ENTITY: Parent Note Response & Digital Signature
TABLE: student_notes, mutabaah_parent_signatures
MODEL: App\Models\StudentNote, App\Models\MutabaahParentSignature
PARENT: Student, ParentModel, User
CHILD: Audit Metadata (signed_at, signed_by_user_id, ip_address, device_info)
FOREIGN KEY: student_id, parent_user_id
OWNER: Orang Tua (Parent User)
UNIT SCOPE: EducationUnit Scope
PARENT SCOPE: Parent-Child Link (Hanya anak terhubung)
ACADEMIC YEAR: AcademicYear aktif
SEMESTER: Semester aktif
PERMISSION: student-notes.respond, student-notes.sign
USED BY: StudentParentPortalController, TeacherPortalController, ParentPortalPage
STATUS: VERIFIED — AUDIT METADATA ENFORCED
```

## Alur Persetujuan & Tanda Tangan

```text
Wali Kelas / Guru Mempublikasikan Catatan Siswa
→ Orang Tua Menerima Notifikasi & Membuka Portal Orang Tua
→ Verifikasi Identitas Parent-Child Relation
→ Orang Tua Mengisi Catatan Respons / Balasan
→ Orang Tua Menekan Tombol Tanda Tangan Digital
→ Backend Menyimpan Timestamp (signed_at), Parent User ID, & Audit Metadata
→ Status Tampil Terverifikasi di Dashboard Wali Kelas & Guru
```
