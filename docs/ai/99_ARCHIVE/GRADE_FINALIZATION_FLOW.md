# Finalisasi Nilai & Lock Specification — Sesi 6

## Transisi Status Penilaian

```mermaid
stateDiagram-v2
    [*] --> draft : Guru Input Nilai / Auto-Calculate
    draft --> finalized : Guru / Waka Finalisasi
    finalized --> approved : Kepala Sekolah Approve
    approved --> published : Wali Kelas / Admin Publish Rapor
    
    finalized --> draft : Reopen (Butuh Permission Reopen + Audit Log)
    approved --> finalized : Reopen (Butuh Approval Bypass)
```

## Security & Lock Rules
1. **Unlocking Protection**: Rekap nilai yang berstatus `finalized`, `approved`, atau `published` dikunci dari *manual override* tanpa hak akses khusus.
2. **Audit Logging**: Setiap tindakan pengubahan nilai, kalkulasi ulang, finalisasi, dan approval dicatat pada file log server (`[AUDIT LOG]`).
