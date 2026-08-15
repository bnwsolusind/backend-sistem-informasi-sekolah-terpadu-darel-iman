Read docs/ai/README.md and INDEX.md first.

# TailGrids Range Calendar Component Integration Prompt & Guideline

## Overview
Dokumen ini berisi panduan dan prompt integrasi komponen **Range Calendar** berbasis **TailGrids UI Library** (`@/components/tailgrids/core/range-calendar`) untuk pemilih rentang tanggal (filter tanggal laporan, rentang presensi, rentang izin/cuti) pada Sistem Manajemen Sekolah Terpadu (SIMSIT).

---

## Canonical Imports & Component Anatomy

```jsx
"use client";

import {
  RangeCalendar,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHeader,
  RangeCalendarHeader,
  RangeCalendarHeading,
  RangeCalendarYearPicker,
  RangeNavButton,
  RangeCalendarCell
} from "@/components/tailgrids/core/range-calendar";
import { parseDate } from "@internationalized/date";
import { useState } from "react";
```

---

## Standard Range Calendar Preview

```jsx
"use client";

import {
  RangeCalendar,
  RangeCalendarCell,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHeader,
  RangeCalendarHeader,
  RangeCalendarHeading,
  RangeCalendarYearPicker,
  RangeNavButton,
  type RangeValue
} from "@/components/tailgrids/core/range-calendar";
import { parseDate, type DateValue } from "@internationalized/date";
import { useState } from "react";

export default function RangeCalendarPreview() {
  const [value, setValue] = useState<RangeValue<DateValue>>({
    start: parseDate("2026-08-01"),
    end: parseDate("2026-08-15")
  });

  return (
    <div className="w-full max-w-sm p-4">
      <RangeCalendar value={value} onChange={setValue}>
        <RangeCalendarHeader>
          <RangeCalendarYearPicker />
          <RangeCalendarHeading />
          <RangeNavButton slot="previous" />
          <RangeNavButton slot="next" />
        </RangeCalendarHeader>

        <RangeCalendarGrid>
          <RangeCalendarGridHeader />
          <RangeCalendarGridBody>
            {date => <RangeCalendarCell date={date} />}
          </RangeCalendarGridBody>
        </RangeCalendarGrid>
      </RangeCalendar>
    </div>
  );
}
```

---

## Catatan Penting

1. **Atribut Range Selection**: `RangeCalendarCell` mengelola status `selectionStart`, `selectionEnd`, dan range highlight secara otomatis berbasis React Aria.
2. **YearPicker Popup**: `RangeCalendarYearPicker` menyediakan dropdown pencarian tahun untuk navigasi tanggal cepat.
3. **Format Tanggal**: Gunakan `parseDate` dari `@internationalized/date` untuk menginisialisasi state `RangeValue<DateValue>`.
