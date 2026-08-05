# CBT Attempt State Machine Specification — Sesi 5

## State Machine Diagram

```mermaid
stateDiagram-v2
    [*] --> not_started : Siswa Membuka Jadwal Ujian
    
    not_started --> proses : startSession()
    note right of proses
        - waktu_mulai = now()
        - status = 'proses'
        - IP Address dicatat
    end note

    proses --> proses : submitAnswers() [Autosave transient]
    
    proses --> selesai : finishSession() [Siswa kumpul manual]
    proses --> timeout : Server Auto-Finalize [Timer Habis / Waktu Selesai Terlewati]
    proses --> dibatalkan : Pembatalan Pengawas / Admin

    selesai --> [*]
    timeout --> [*]
    dibatalkan --> [*]
```

## State Definitions & Transitions

| State | Deskripsi | Aksi yang Diizinkan | Transisi Selanjutnya |
| :--- | :--- | :--- | :--- |
| `not_started` | Ujian belum dimulai oleh siswa. | `startSession` | `proses` |
| `proses` | Siswa sedang mengerjakan ujian. Timer aktif. | `submitAnswers`, `finishSession` | `selesai`, `timeout`, `dibatalkan` |
| `selesai` | Sesi ujian telah dikumpulkan dan dinilai. | View Result (jika `tampilkan_nilai_langsung = true`) | Final State |
| `timeout` | Sesi berakhir otomatis karena batas waktu habis. | View Result | Final State |
| `dibatalkan` | Sesi dibatalkan oleh pengawas/guru. | None | Final State |
