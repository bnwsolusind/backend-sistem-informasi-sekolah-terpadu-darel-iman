# STUDENT PARENT RELATION MAP

PARENT MODEL: `App\Models\ParentModel` (`parents`)
STUDENT MODEL: `App\Models\Student` (`students`)
RELATION TABLE: `student_parents`
RELATION TYPE: Many-to-many untuk ayah/ibu/wali; `students.parent_id` dipertahankan sebagai legacy primary parent.
OWNERSHIP CHECK: Portal membaca relasi `parentsPivot`; unique `student_id,parent_id` mencegah tautan parent yang sama dua kali untuk siswa yang sama.
PORTAL SOURCE: `ParentModel::studentsPivot()` dan `Student::parentsPivot()`.
DUPLICATE PREVENTION: `uniq_student_parent(student_id,parent_id)` dan FK cascade pada pivot.
STATUS: PARTIALLY FIXED — skema dan relasi model tersedia, tetapi route CRUD internal `/api/parents` serta endpoint attach/detach pivot tidak terdaftar. Karena itu relasi resmi belum dapat dibentuk melalui dashboard tanpa operasi database langsung.