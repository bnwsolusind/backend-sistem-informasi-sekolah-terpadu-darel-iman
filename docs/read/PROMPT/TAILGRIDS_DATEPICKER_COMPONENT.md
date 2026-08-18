Read docs/ai/README.md and INDEX.md first.

# TailGrids DatePicker Component Integration Prompt & Guideline

## Overview
Dokumen ini berisi panduan dan prompt integrasi komponen **DatePicker** (field pilihan tanggal seperti tanggal lahir, tanggal janji, dll.) berbasis **TailGrids UI Library** untuk Sistem Manajemen Sekolah Terpadu (SIMSIT).

Komponen ini menggabungkan beberapa sub-komponen:
- **`date-picker`** — `@/components/tailgrids/core/date-picker`
- **`date-field`** — `@/components/tailgrids/core/date-field`
- **`calendar`** — `@/components/tailgrids/core/calendar`
- **`field`** — `@/components/tailgrids/core/field`

---

## Canonical Imports & Component Anatomy

```jsx
"use client";

import { CalendarIcon } from "@/components/ui/icons";
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeader,
  CalendarHeading,
  NavButton
} from "@/components/tailgrids/core/calendar";
import { DateInput, DateSegment } from "@/components/tailgrids/core/date-field";
import {
  DatePicker,
  DatePickerGroup,
  DatePickerPopover,
  DatePickerTrigger
} from "@/components/tailgrids/core/date-picker";
import { FieldDescription, FieldLabel } from "@/components/tailgrids/core/field";
```

### Sub-Components:
- **`<DatePicker>`**: Root container berbasis React Aria Components `DatePicker`.
- **`<DatePickerGroup>`**: Wrapper group untuk `DateInput` dan `DatePickerTrigger`.
- **`<DateInput>`**: Render function untuk segmen tanggal (bulan/hari/tahun).
- **`<DateSegment>`**: Segment individual yang dapat diedit (month, day, year).
- **`<DatePickerTrigger>`**: Tombol ikon kalender untuk membuka popover.
- **`<DatePickerPopover>`**: Popover container berisi `Calendar`.
- **`<FieldLabel>`**: Label teks untuk field tanggal.
- **`<FieldDescription>`**: Teks deskripsi/petunjuk di bawah field.

### Dependencies (install via CLI):
```bash
npx @tailgrids/cli add calendar
npx @tailgrids/cli add date-field
npx @tailgrids/cli add date-picker
npx @tailgrids/cli add field
```

---

## 1. DatePicker Basic Usage (Field Tanggal dengan Label, Deskripsi & Calendar Popover)

```jsx
"use client";

import { CalendarIcon } from "@/components/ui/icons";
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeader,
  CalendarHeading,
  NavButton
} from "@/components/tailgrids/core/calendar";
import { DateInput, DateSegment } from "@/components/tailgrids/core/date-field";
import {
  DatePicker,
  DatePickerGroup,
  DatePickerPopover,
  DatePickerTrigger
} from "@/components/tailgrids/core/date-picker";
import { FieldDescription, FieldLabel } from "@/components/tailgrids/core/field";

export default function DatePickerBasicUsagePreview() {
  return (
    <div className="flex flex-col items-center gap-6 w-full p-4">
      <div className="max-w-xs w-full">
        <DatePicker>
          <FieldLabel>Appointment Date</FieldLabel>

          <DatePickerGroup>
            <DateInput>
              {segment => <DateSegment segment={segment} />}
            </DateInput>
            <DatePickerTrigger>
              <CalendarIcon className="size-5" />
            </DatePickerTrigger>
          </DatePickerGroup>

          <FieldDescription>
            Select your preferred appointment date.
          </FieldDescription>

          <DatePickerPopover>
            <Calendar>
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
          </DatePickerPopover>
        </DatePicker>
      </div>
    </div>
  );
}
```

---

## 2. DatePicker with Validation (Validasi Tanggal: Required, Min Date, Weekend Unavailable & FieldError)

```jsx
"use client";

import { CalendarIcon } from "@/components/ui/icons";
import { Button } from "@/components/tailgrids/core/button";
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeader,
  CalendarHeading,
  NavButton
} from "@/components/tailgrids/core/calendar";
import { DateInput, DateSegment } from "@/components/tailgrids/core/date-field";
import {
  DatePicker,
  DatePickerGroup,
  DatePickerPopover,
  DatePickerTrigger
} from "@/components/tailgrids/core/date-picker";
import { FieldError, FieldLabel } from "@/components/tailgrids/core/field";
import {
  CalendarDate,
  getLocalTimeZone,
  isWeekend,
  today
} from "@internationalized/date";
import { useState } from "react";
import { Form, useLocale } from "react-aria-components";

export default function DatePickerWithValidationPreview() {
  const { locale } = useLocale();
  const [date, setDate] = useState<CalendarDate | null>(null);
  const now = today(getLocalTimeZone());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      alert("Please select a date");
    } else if (isWeekend(date, locale)) {
      alert("Weekends are not available");
    } else {
      alert(`You selected ${date.toString()}`);
    }
  };

  return (
    <Form className="max-w-xs w-full" onSubmit={handleSubmit}>
      <DatePicker
        value={date}
        onChange={setDate}
        required
        minValue={now}
        isDateUnavailable={date => isWeekend(date, locale)}
      >
        <FieldLabel>Business Meeting</FieldLabel>

        <DatePickerGroup>
          <DateInput>{segment => <DateSegment segment={segment} />}</DateInput>
          <DatePickerTrigger>
            <CalendarIcon className="size-5" />
          </DatePickerTrigger>
        </DatePickerGroup>

        <FieldError />

        <DatePickerPopover>
          <Calendar aria-label="Business meeting">
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
        </DatePickerPopover>
      </DatePicker>

      <Button type="submit" className="mt-4">
        Submit
      </Button>
    </Form>
  );
}
```

