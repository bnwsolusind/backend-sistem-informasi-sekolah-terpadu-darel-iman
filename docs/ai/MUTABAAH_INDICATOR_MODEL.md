# Dokumen Model Indikator Mutabaah (MUTABAAH_INDICATOR_MODEL.md)

Dokumen ini merinci struktur data master indikator, agenda, template, dan tipe input untuk Mutabaah Yaumiyah.

```text
ENTITY: Mutabaah Indicator & Template Items
TABLE: mutabaah_categories, mutabaah_agenda_items, mutabaah_templates, mutabaah_template_items
MODEL: App\Models\MutabaahCategory, App\Models\MutabaahAgendaItem, App\Models\MutabaahTemplate, App\Models\MutabaahTemplateItem
PARENT: EducationUnit, AcademicYear, Semester
CHILD: MutabaahTemplateItem
FOREIGN KEY: category_id, template_id, agenda_item_id, education_unit_id
OWNER: Administrator / Tim Kesiswaan / Tim Al-Qur'an
UNIT SCOPE: EducationUnit Scope
PERMISSION: mutabaah-indicators.view, mutabaah-indicators.create, mutabaah-indicators.update, mutabaah-indicators.delete
USED BY: MutabaahEnterpriseController, MutabaahEnterprisePage
STATUS: VERIFIED — NO CHANGE REQUIRED
```

## Tipe Input Indikator
1. `status` / `checklist`: Status kualitatif (`good`, `less`, `not_done`, `na`).
2. `yes_no`: Boolean (Ya / Tidak).
3. `number` / `target`: Angka numerik.
4. `duration`: Durasi waktu (menit).
5. `pages`: Jumlah halaman (lembar).
6. `verses`: Jumlah ayat.
7. `text`: Catatan teks bebas.
