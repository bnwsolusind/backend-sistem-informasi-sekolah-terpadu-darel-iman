Read docs/ai/README.md and INDEX.md first.

# TailGrids Calendar Component Integration Prompt & Guideline

## Overview
Dokumen ini berisi panduan dan prompt integrasi komponen **Calendar** berbasis **TailGrids UI Library** (`@/components/tailgrids/core/calendar`) untuk Sistem Manajemen Sekolah Terpadu (SIMSIT).

---

## Canonical Imports & Component Anatomy

```jsx
"use client";

import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeader,
  CalendarHeading,
  CalendarYearPicker,
  NavButton,
  type DateValue
} from "@/components/tailgrids/core/calendar";
import { isWeekend } from "@internationalized/date";
import { useLocale } from "react-aria-components";
```

### Component Anatomy:
- **`<Calendar>`**: Wrapper kalender utama berbasis React Aria Components.
- **`<CalendarHeader>`**: Header navigasi bulan & tahun.
- **`<NavButton slot="previous" | "next">`**: Tombol navigasi bulan sebelumnya / selanjutnya.
- **`<CalendarHeading>`**: Judul bulan & tahun aktif.
- **`<CalendarYearPicker>`**: Dropdown pemilih bulan & tahun cepat.
- **`<CalendarGrid>`**: Grid tanggal kalender.
- **`<CalendarGridHeader>`**: Header nama-nama hari.
- **`<CalendarGridBody>`**: Body sel tanggal.
- **`<CalendarCell date={date} />`**: Sel tanggal individual.

---

## 1. Calendar Preview (Preview Utama dengan Filter Weekend)

```jsx
"use client";

import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeader,
  CalendarHeading,
  NavButton,
  type DateValue
} from "@/components/tailgrids/core/calendar";
import { isWeekend } from "@internationalized/date";
import { useLocale } from "react-aria-components";

export default function CalendarPreview() {
  const { locale } = useLocale();

  const isDateUnavailable = (date: DateValue) => isWeekend(date, locale);

  return (
    <div className="flex justify-center p-6">
      <Calendar
        aria-label="Appointment date"
        isDateUnavailable={isDateUnavailable}
      >
        <CalendarHeader>
          <NavButton slot="previous" />
          <CalendarHeading />
          <NavButton slot="next" />
        </CalendarHeader>

        <CalendarGrid>
          <CalendarGridHeader />
          <CalendarGridBody>
            {date => <CalendarCell date={date} />}
          </CalendarGridBody>
        </CalendarGrid>
      </Calendar>
    </div>
  );
}
```

---

## 2. Calendar with Year Picker (Navigasi Tahun Cepat)

```jsx
"use client";

import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeader,
  CalendarYearPicker,
  NavButton
} from "@/components/tailgrids/core/calendar";

export default function CalendarWithYearPickerPreview() {
  return (
    <div className="flex justify-center p-6">
      <Calendar aria-label="Select date with year picker">
        <CalendarHeader>
          <NavButton slot="previous" />
          <CalendarYearPicker />
          <NavButton slot="next" />
        </CalendarHeader>

        <CalendarGrid>
          <CalendarGridHeader />
          <CalendarGridBody>
            {date => <CalendarCell date={date} />}
          </CalendarGridBody>
        </CalendarGrid>
      </Calendar>
    </div>
  );
}
```
