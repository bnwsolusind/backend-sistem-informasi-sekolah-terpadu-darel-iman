Read docs/ai/README.md and INDEX.md first.

# TailGrids Field (TextField, FieldLabel, Input, FieldDescription, FieldError, Label, InputGroup) Component Integration Prompt & Guideline

## Overview
Dokumen ini berisi panduan dan prompt integrasi komponen **Field** (`TextField`, `FieldLabel`, `Input`, `FieldDescription`, `FieldError`, `FieldSet`, `FieldLegend`, `Label`, `InputGroup`) berbasis **TailGrids UI Library** untuk membuat form field lengkap pada Sistem Manajemen Sekolah Terpadu (SIMSIT).

Komponen yang digunakan:
- **`field`** — `@/components/tailgrids/core/field` (`FieldLabel`, `FieldDescription`, `FieldError`, `FieldGroup`, `FieldSet`, `FieldLegend`)
- **`input`** — `@/components/tailgrids/core/input` (`Input`)
- **`text-field`** — `@/components/tailgrids/core/text-field` (`TextField`)
- **`label`** — `@/components/tailgrids/core/label` (`Label`)
- **`input-group`** — `@/components/tailgrids/core/input-group` (`InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupInput`, `InputGroupTextarea`)

---

## Canonical Imports & Component Anatomy

```jsx
"use client";

import {
  FieldDescription,
  FieldError,
  FieldLabel
} from "@/components/tailgrids/core/field";
import { Input } from "@/components/tailgrids/core/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea
} from "@/components/tailgrids/core/input-group";
import { Label } from "@/components/tailgrids/core/label";
import { TextField } from "@/components/tailgrids/core/text-field";
```

### Sub-Components:
- **`<TextField>`**: Container wrapper field berbasis React Aria Components `TextField` (mengelola status validation/invalid, label association, description, dan error message).
- **`<FieldLabel>`**: Label teks untuk field input dalam `TextField` (terhubung otomatis dengan `Input` via `htmlFor` / React Aria).
- **`<Label>`**: Standalone Label element dari `@/components/tailgrids/core/label` untuk form field custom yang dipasangkan dengan `useId()`.
- **`<Input>`**: Element input teks dengan styling TailGrids (border, focus ring, placeholder, invalid, dan disabled state).
- **`<InputGroup>`**: Container wrapper untuk menggabungkan input dengan icon prefix/suffix (`InputGroupAddon`), action button (`InputGroupButton`), atau textarea (`InputGroupTextarea`).
- **`<InputGroupAddon>`**: Sub-komponen penampung icon atau teks addon dengan alignment `inline-start` atau `inline-end`.
- **`<InputGroupButton>`**: Tombol aksi khusus di dalam InputGroup (misalnya tombol toggle password, clear text, atau search).
- **`<InputGroupInput>`**: Element input tanpa border internal yang menyatu secara mulus di dalam `<InputGroup>`.
- **`<InputGroupTextarea>`**: Element textarea tanpa border internal yang menyatu secara mulus di dalam `<InputGroup>`.
- **`<FieldDescription>`**: Teks petunjuk/bantuan di bawah input field.
- **`<FieldError>`**: Teks pesan error validasi (ditampilkan otomatis saat `invalid` / `isInvalid` bernilai `true`).

---

## Standard Code Preview (FieldWithInputPreview)

```jsx
"use client";

import {
  FieldDescription,
  FieldError,
  FieldLabel
} from "@/components/tailgrids/core/field";
import { Input } from "@/components/tailgrids/core/input";
import { TextField } from "@/components/tailgrids/core/text-field";

export default function FieldWithInputPreview() {
  return (
    <div className="flex flex-col items-center gap-10 w-full max-w-sm p-4">
      <TextField className="w-full" defaultValue="John Doe">
        <FieldLabel htmlFor="full-name">Full name</FieldLabel>
        <Input id="full-name" placeholder="Enter your name" />
        <FieldDescription>
          This appears on invoices and emails.
        </FieldDescription>
      </TextField>

      <TextField className="w-full" defaultValue="jhon-doe" isInvalid>
        <FieldLabel htmlFor="username">Username</FieldLabel>
        <Input id="username" placeholder="Enter your username" />
        <FieldError>This username is already taken.</FieldError>
      </TextField>
    </div>
  );
}
```

---

## Standard Code Preview (FieldWithTextareaPreview)

Gunakan pola ini ketika membuat field input berbentuk area teks (`TextArea`):

```jsx
"use client";

import {
  FieldDescription,
  FieldError,
  FieldLabel
} from "@/components/tailgrids/core/field";
import { TextArea } from "@/components/tailgrids/core/text-area";
import { TextField } from "@/components/tailgrids/core/text-field";

export default function FieldWithTextareaPreview() {
  return (
    <div className="flex flex-col items-center gap-10 w-full max-w-sm p-4">
      <TextField className="w-full">
        <FieldLabel htmlFor="bio">Bio</FieldLabel>
        <TextArea id="bio" placeholder="Tell us about yourself..." />
        <FieldDescription>
          Brief description for your profile. Maximum 280 characters.
        </FieldDescription>
        <FieldError>Bio must be between 5 and 280 characters.</FieldError>
      </TextField>
    </div>
  );
}
```

---

## Standard Code Preview (InputCustomPreview)

Gunakan pola ini ketika membutuhkan kustomisasi styling kelas Tailwind khusus pada komponen `Input` dengan `Label` dan `useId()` dari React:

```jsx
"use client";

import { Input } from "@/components/tailgrids/core/input";
import { Label } from "@/components/tailgrids/core/label";
import { useId } from "react";

export default function InputCustomPreview() {
  const id = useId();

  return (
    <div className="max-w-sm w-full mx-auto grid gap-2">
      <Label htmlFor={id}>Custom Style</Label>
      <Input
        id={id}
        placeholder="Type something..."
        className="border-badge-blue-icon-color focus:border-badge-blue-icon-color focus:ring-badge-blue-icon-color/20 rounded-full bg-badge-blue-background"
      />
    </div>
  );
}
```

---

## Standard Code Preview (InputGroupAddonPreview)

Gunakan pola ini ketika membuat input group dengan icon prefix/suffix (`align="inline-start"` atau `align="inline-end"`) maupun teks addon:

```jsx
"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput
} from "@/components/tailgrids/core/input-group";
import { Label } from "@/components/tailgrids/core/label";
import { TextField } from "@/components/tailgrids/core/text-field";
import { Locked3, Search1 } from "@tailgrids/icons";

export default function InputGroupAddonPreview() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6 p-4">
      {/* Icon Inline Start */}
      <TextField className="flex flex-col gap-2">
        <Label>Search with Icon</Label>

        <InputGroup>
          <InputGroupAddon align="inline-start">
            <Search1 className="size-4.5" />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search components..." />
        </InputGroup>
      </TextField>

      {/* Text Inline End */}
      <TextField className="flex flex-col gap-2">
        <Label>Email Address</Label>

        <InputGroup>
          <InputGroupInput placeholder="johndoe" />
          <InputGroupAddon align="inline-end">@tailgrids.com</InputGroupAddon>
        </InputGroup>
      </TextField>

      {/* Both Sides */}
      <TextField className="flex flex-col gap-2">
        <Label>Secure Payment</Label>

        <InputGroup>
          <InputGroupAddon align="inline-start">
            <Locked3 className="size-4.5" />
          </InputGroupAddon>
          <InputGroupInput placeholder="Amount" type="number" />
          <InputGroupAddon align="inline-end">USD</InputGroupAddon>
        </InputGroup>
      </TextField>
    </div>
  );
}
```

---

## Standard Code Preview (InputGroupButtonPreview)

Gunakan pola ini ketika membuat input group dengan tombol aksi internal (`InputGroupButton`), seperti password visibility toggle, tombol subscribe, atau tombol pesan multi-action:

```jsx
"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from "@/components/tailgrids/core/input-group";
import { Label } from "@/components/tailgrids/core/label";
import { TextField } from "@/components/tailgrids/core/text-field";
import { Eye, EyeDisabled, Send4, Xmark } from "@tailgrids/icons";
import { useState } from "react";

export default function InputGroupButtonPreview() {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="flex w-full max-w-sm flex-col gap-6 p-4">
      {/* Single Icon Button */}
      <TextField className="flex flex-col gap-2">
        <Label className="text-sm text-title-50 font-medium">
          Password Visibility
        </Label>

        <InputGroup>
          <InputGroupInput
            placeholder="secretpassword123"
            type={showPassword ? "text" : "password"}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              aria-label="Show password"
              className="w-fit px-0 hover:bg-transparent opacity-75 data-hovered:opacity-100"
              onPress={() => setShowPassword(current => !current)}
            >
              {showPassword ? <EyeDisabled /> : <Eye />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </TextField>

      {/* Button with Text */}
      <TextField className="flex flex-col gap-2">
        <Label className="text-sm text-title-50 font-medium">
          Newsletter Subscribe
        </Label>
        <InputGroup>
          <InputGroupInput
            placeholder="Enter your email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <InputGroupAddon align="inline-end" className="px-0">
            <InputGroupButton
              size="sm"
              className="px-3 hover:bg-transparent"
              onPress={() => {
                if (email) {
                  alert(`Subscribed with: ${email}`);
                  setEmail("");
                }
              }}
            >
              Subscribe
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </TextField>

      {/* Multiple Buttons */}
      <TextField className="flex flex-col gap-2">
        <Label className="text-sm text-title-50 font-medium">
          Chat Message
        </Label>
        <InputGroup>
          <InputGroupInput
            placeholder="Type a message..."
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <InputGroupAddon align="inline-end" className="gap-1">
            {message && (
              <InputGroupButton
                className="opacity-75 p-0 size-6 [&>svg]:size-6! hover:bg-transparent hover:opacity-100!"
                aria-label="Clear"
                onPress={() => setMessage("")}
              >
                <Xmark />
              </InputGroupButton>
            )}

            <InputGroupButton
              iconOnly
              className="h-auto w-auto px-0 text-primary opacity-75 disabled:cursor-not-allowed hover:bg-transparent data-hovered:opacity-100"
              aria-label="Send"
              disabled={!message.trim()}
              onPress={() => {
                if (message) {
                  alert(`Message sent: ${message}`);
                  setMessage("");
                }
              }}
            >
              <Send4 className="size-4" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </TextField>
    </div>
  );
}
```

---

## Standard Code Preview (InputGroupTextareaPreview)

Gunakan pola ini ketika membuat area input teks multiline kompleks (`InputGroupTextarea`) dengan action bar di bagian bawah (`align="block-end"`), seperti AI Chat prompt input:

```jsx
"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea
} from "@/components/tailgrids/core/input-group";
import { Microphone1, Paperclip2, Send4 } from "@tailgrids/icons";
import { useState } from "react";

export default function InputGroupTextareaPreview() {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (value.trim()) {
      setValue("");
    }
  };

  return (
    <div className="w-full max-w-lg">
      <InputGroup className=" py-1.5 px-2 flex-col items-stretch shadow-sm transition-all focus-within:shadow-md hover:border-base-400">
        <InputGroupTextarea
          placeholder="Ask AI anything..."
          className="min-h-22 resize-none py-2.5 text-sm"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <InputGroupAddon
          align="block-end"
          className="flex justify-between items-center gap-1 pb-1.5 px-1"
        >
          <InputGroupButton
            size="icon-sm"
            aria-label="Add attachment"
            className="text-base-400 hover:text-title-100 hover:bg-base-200"
          >
            <Paperclip2 className="h-5 w-5" />
          </InputGroupButton>

          <div>
            <InputGroupButton
              size="icon-sm"
              aria-label="Voice input"
              className="text-base-400 hover:text-title-100 hover:bg-base-200 transition-colors"
            >
              <Microphone1 className="h-5 w-5" />
            </InputGroupButton>

            <InputGroupButton
              size="icon-sm"
              aria-label="Send message"
              className="text-base-400 hover:text-title-100 hover:bg-base-200 transition-colors"
              onClick={handleSend}
            >
              <Send4 className="h-5 w-5" />
            </InputGroupButton>
          </div>
        </InputGroupAddon>
      </InputGroup>

      <div className="text-center text-xs text-base-400 px-4 mt-3">
        AI can make mistakes. Consider verifying important information.
      </div>
    </div>
  );
}
```

---

## Template Form Field Sesuai Nama Field (Form Field Adaptation)

Berikut contoh penyesuaian komponen `TextField` + `Input` / `TextArea` untuk form input pada modul SIMSIT (seperti Alamat, Deskripsi, Catatan, Nama Unit, NPSN, Email, dsb):

```jsx
"use client";

import {
  FieldDescription,
  FieldError,
  FieldLabel
} from "@/components/tailgrids/core/field";
import { Input } from "@/components/tailgrids/core/input";
import { TextArea } from "@/components/tailgrids/core/text-area";
import { TextField } from "@/components/tailgrids/core/text-field";

export function CustomFormField({ label, name, value, onChange, error, hint, placeholder, required, isTextarea }) {
  return (
    <TextField className="w-full" isInvalid={Boolean(error)}>
      <FieldLabel htmlFor={name}>
        {label} {required && <span className="text-rose-500">*</span>}
      </FieldLabel>
      {isTextarea ? (
        <TextArea
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
        />
      ) : (
        <Input
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}
      {hint && !error && <FieldDescription>{hint}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </TextField>
  );
}
```

---

## Standard Code Preview (FieldWithValidationPreview - Validasi Kesalahan Penulisan Field)

Gunakan pola ini untuk melakukan validasi kesalahan penulisan (error validation) secara interaktif dengan `Form` dari `react-aria-components` dan prop `validate` pada `TextField`:

```jsx
"use client";

import { Button } from "@/components/tailgrids/core/button";
import {
  FieldDescription,
  FieldError,
  FieldLabel
} from "@/components/tailgrids/core/field";
import { Input } from "@/components/tailgrids/core/input";
import { TextField } from "@/components/tailgrids/core/text-field";
import { useRef, useState, type FormEvent } from "react";
import { Form } from "react-aria-components";

export default function FieldWithValidationPreview() {
  const [submitted, setSubmitted] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmitted(true);
    formRef.current?.reset();
  };

  return (
    <Form
      onSubmit={handleSubmit}
      validationBehavior="native"
      ref={formRef}
      className="flex flex-col items-center gap-6 w-full max-w-sm p-4"
    >
      <TextField
        className="w-full"
        name="email"
        type="email"
        required
        validate={v =>
          !v
            ? "Email is required."
            : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
              ? "Please enter a valid email address."
              : null
        }
      >
        <FieldLabel>Email address</FieldLabel>

        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
        />

        <FieldDescription>We&apos;ll never share your email.</FieldDescription>

        <FieldError>
          {validation => validation.validationErrors.join(", ")}
        </FieldError>
      </TextField>

      <TextField
        className="w-full"
        name="password"
        type="password"
        required
        validate={v =>
          !v
            ? "Password is required."
            : v.length < 8
              ? "Password must be at least 8 characters."
              : null
        }
      >
        <FieldLabel>Password</FieldLabel>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={passwordValue}
          onChange={e => setPasswordValue(e.target.value)}
        />
        <FieldDescription>We&apos;ll never share your email.</FieldDescription>

        <FieldError>
          {validation => validation.validationErrors.join(", ")}
        </FieldError>
      </TextField>

      <TextField
        className="w-full"
        name="confirmPassword"
        type="password"
        required
        validate={v =>
          !v
            ? "Please confirm your password."
            : v !== passwordValue
              ? "Passwords do not match."
              : null
        }
      >
        <FieldLabel>Confirm password</FieldLabel>
        <Input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm your password"
        />
        <FieldDescription>Re-enter your password.</FieldDescription>

        <FieldError>
          {validation => validation.validationErrors.join(", ")}
        </FieldError>
      </TextField>

      {submitted && (
        <div className="flex flex-col items-center gap-4 w-full max-w-sm p-4">
          <div className="text-sm font-medium text-green-600">
            Form submitted successfully!
          </div>
        </div>
      )}

      <Button type="submit" className="w-full">
        Create account
      </Button>
    </Form>
  );
}
```

---

## Catatan Penting

1. **ID & htmlFor matching**: Pastikan `htmlFor` pada `<FieldLabel>` atau `<Label>` cocok dengan `id` pada `<Input>` atau `<TextArea>`.
2. **Status Invalid**: Gunakan prop `isInvalid` pada `<TextField>` atau fungsi `validate={v => ...}` saat dibungkus dengan `<Form validationBehavior="native">` untuk mengaktifkan tampilan error visual.
3. **Pesan Error**: Gunakan fungsi render `{validation => validation.validationErrors.join(", ")}` pada `<FieldError>` untuk menampilkan pesan error validasi native secara otomatis.
4. **Deskripsi & Error**: Gunakan `<FieldDescription>` untuk hint/petunjuk normal, dan `<FieldError>` untuk pesan validasi gagal.
5. **TextArea**: Gunakan `<TextArea>` dari `@/components/tailgrids/core/text-area` untuk field teks multiline seperti Alamat, Deskripsi, atau Catatan.
6. **Label Standalone & Custom Styling**: Gunakan `<Label>` dari `@/components/tailgrids/core/label` yang dikombinasikan dengan `useId()` dari React dan custom Tailwind utility classes (seperti `rounded-full`, `bg-badge-blue-background`, `border-badge-blue-icon-color`, `focus:ring-badge-blue-icon-color/20`) pada `<Input>` untuk variasi form input berpenampilan khusus.
7. **InputGroup Integration**: Gunakan `<InputGroup>` dari `@/components/tailgrids/core/input-group` bersama `<InputGroupInput>`, `<InputGroupAddon>`, dan `<InputGroupButton>` untuk input field yang membutuhkan icon prefix/suffix (seperti icon pencarian atau tombol toggle show/hide password).


