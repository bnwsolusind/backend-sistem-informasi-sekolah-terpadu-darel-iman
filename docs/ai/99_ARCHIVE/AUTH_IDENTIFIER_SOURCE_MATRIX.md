# AUTH IDENTIFIER SOURCE MATRIX

## Multi-Identifier Login Database Resolvers

All user authentication requests resolve identifiers strictly from PostgreSQL tables using parameterized bindings.

| Form Input Type | System Target Field | Database Table & Resolver Logic |
| --- | --- | --- |
| **Email** | `users.email` | `User::where('email', $input)->first()` |
| **No. HP (Phone)** | `users.phone` | `User::where('phone', $input)->first()` |
| **NIY / NIP** | `employees.niy` | `Employee::where('niy', $input)->first()->user` |
| **NIK Pegawai** | `employees.nik` | `Employee::where('nik', $input)->first()->user` |
| **NIP Guru** | `teachers.employee_number` | `Teacher::where('employee_number', $input)->first()->user` |
| **NIS / NISN** | `students.nis` / `students.nisn` | `Student::where('nis', $input)->orWhere('nisn', $input)->first()->user` |
| **NIK Orang Tua** | `parents.nik` | `ParentModel::where('nik', $input)->first()->user` |
| **Username** | Email or Phone fallback | No `username` column in `users` schema; safely resolved via `email` / `phone`. |
