Read docs/ai/README.md and INDEX.md first.

# TailGrids Combobox Component Integration Prompt & Guideline

## Overview
Dokumen ini berisi panduan dan prompt integrasi komponen **Combobox / Command Palette** (pencarian interaktif dengan input & list item) berbasis **TailGrids UI Library** (`@/components/tailgrids/core/combobox/combobox`) untuk Sistem Manajemen Sekolah Terpadu (SIMSIT).

---

## Canonical Imports & Component Anatomy

```jsx
"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxInputWrapper,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger
} from "@/components/tailgrids/core/combobox/combobox";
import { FileText, Gear1, Message1, Search1, User2 } from "@tailgrids/icons";
```

### Component Anatomy:
- **`<Combobox items={data}>`**: Root container berbasis React Aria Components.
- **`<ComboboxInputWrapper>`**: Wrapper input pencarian dengan ikon & styling.
- **`<ComboboxInput>`**: Field input teks pencarian.
- **`<ComboboxContent>`**: Popover / Dropdown container hasil pencarian.
- **`<ComboboxList>`**: List item wrapper.
- **`<ComboboxItem id={id} textValue={name}>`**: Item individual dalam list combobox.
- **`<ComboboxEmpty>`**: State tampilan ketika tidak ada data hasil pencarian.

---

## 1. Combobox Command Palette Preview (Command Palette Pencarian)

```jsx
"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxInputWrapper,
  ComboboxItem,
  ComboboxList
} from "@/components/tailgrids/core/combobox/combobox";
import { FileText, Gear1, Message1, Search1, User2 } from "@tailgrids/icons";

const commands = [
  {
    id: "search-docs",
    name: "Search Documentation",
    icon: Search1,
    shortcut: "⌘D"
  },
  { id: "new-file", name: "Create New File", icon: FileText, shortcut: "⌘N" },
  { id: "settings", name: "Open Settings", icon: Gear1, shortcut: "⌘S" },
  { id: "profile", name: "View Profile", icon: User2, shortcut: "⌘P" },
  { id: "feedback", name: "Send Feedback", icon: Message1, shortcut: "⌘F" }
];

export default function ComboboxCommandPreview() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-dropdown-background overflow-hidden rounded-xl border border-base-200 shadow-2xl">
        <Combobox items={commands}>
          <ComboboxInputWrapper className="border-none bg-transparent">
            <Search1 className="ml-4 size-5 text-text-100" />
            <ComboboxInput
              placeholder="Type a command or search..."
              className="py-4 pl-10 text-base"
            />
            <div className="flex items-center gap-1 absolute right-2 rounded-md border border-base-200 bg-base-100 px-1.5 py-0.5 text-[10px] font-medium text-text-100 uppercase">
              <span>esc</span>
            </div>
          </ComboboxInputWrapper>
          <ComboboxContent>
            <ComboboxList className="p-2">
              {commands.map(command => (
                <ComboboxItem
                  key={command.id}
                  id={command.id}
                  textValue={command.name}
                  className="pl-3"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-3">
                      <command.icon className="size-4 text-text-100" />
                      <span className="text-sm font-medium">
                        {command.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-medium text-text-100">
                      {command.shortcut}
                    </span>
                  </div>
                </ComboboxItem>
              ))}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    </div>
  );
}

---

## 2. Combobox with User Avatars (Pencarian User & Assignee dengan Foto Profil)

```jsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/tailgrids/core/avatar";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxInputWrapper,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger
} from "@/components/tailgrids/core/combobox/combobox";

const users = [
  {
    id: 1,
    name: "Alice Freeman",
    email: "alice@example.com",
    avatar: "/docs/images/avatar/avatar-1.webp"
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    avatar: "/docs/images/avatar/avatar-2.webp"
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    avatar: "/docs/images/avatar/avatar-3.webp"
  },
  {
    id: 4,
    name: "David Miller",
    email: "david@example.com",
    avatar: "/docs/images/avatar/avatar-4.webp"
  }
];

export default function ComboboxAvatarPreview() {
  return (
    <div className="w-full max-w-xs">
      <Combobox items={users}>
        <ComboboxLabel>Select assigning user</ComboboxLabel>
        <ComboboxInputWrapper>
          <ComboboxInput placeholder="Search users..." />
          <ComboboxTrigger />
        </ComboboxInputWrapper>
        <ComboboxContent>
          <ComboboxList>
            {users.map(user => (
              <ComboboxItem
                key={user.id}
                id={user.id}
                textValue={user.name}
                className="pl-3"
              >
                <figure className="flex justify-start items-center gap-2">
                  <Avatar size="lg">
                    <AvatarImage
                      src={user.avatar}
                      alt={`Image of ${user.name}`}
                    />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <figcaption>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </figcaption>
                </figure>
              </ComboboxItem>
            ))}
          </ComboboxList>
          <ComboboxEmpty>No users found</ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

---

## 3. Controlled Multi-Combobox Controller (Pilihan Ganda Terkontrol dengan Badge Display & Reset State)

```jsx
"use client";

import { Button } from "@/components/tailgrids/core/button";
import {
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxInputWrapper,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  MultiCombobox,
  MultiComboboxDisplay
} from "@/components/tailgrids/core/combobox";
import { useState } from "react";
import type { Key } from "react-aria-components";

export default function MultiComboboxControlledPreview() {
  const [values, setValues] = useState<Key[]>(["apple", "banana"]);

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="w-full flex items-center justify-between">
        <p className="text-sm text-gray-500">Selected: {values.length} items</p>
        <Button
          variant="primary"
          appearance="outline"
          size="sm"
          onClick={() => setValues([])}
          disabled={values.length === 0}
        >
          Clear Selection
        </Button>
      </div>

      <MultiCombobox value={values} onChange={setValues}>
        <ComboboxInputWrapper>
          <ComboboxInput placeholder="Select fruits" />
          <ComboboxTrigger />
        </ComboboxInputWrapper>
        <MultiComboboxDisplay className="capitalize" />
        <ComboboxContent>
          <ComboboxList>
            <ComboboxItem id="apple">Apple</ComboboxItem>
            <ComboboxItem id="banana">Banana</ComboboxItem>
            <ComboboxItem id="orange">Orange</ComboboxItem>
            <ComboboxItem id="grape">Grape</ComboboxItem>
            <ComboboxItem id="strawberry">Strawberry</ComboboxItem>
          </ComboboxList>
          <ComboboxEmpty>No results found</ComboboxEmpty>
        </ComboboxContent>
      </MultiCombobox>
    </div>
  );
}

---

## 4. Combobox with Label & Description (Field Input dengan Label dan Petunjuk Teks)

```jsx
"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxDescription,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxInputWrapper,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger
} from "@/components/tailgrids/core/combobox/combobox";

export default function ComboboxLabelDescriptionPreview() {
  return (
    <div className="w-full max-w-xs">
      <Combobox>
        <ComboboxLabel>Favorite Language</ComboboxLabel>
        <ComboboxInputWrapper>
          <ComboboxInput placeholder="Select a language" />
          <ComboboxTrigger />
        </ComboboxInputWrapper>
        <ComboboxDescription>
          Choose the language you use most often.
        </ComboboxDescription>
        <ComboboxContent>
          <ComboboxList>
            <ComboboxItem id="js">JavaScript</ComboboxItem>
            <ComboboxItem id="ts">TypeScript</ComboboxItem>
            <ComboboxItem id="python">Python</ComboboxItem>
            <ComboboxItem id="rust">Rust</ComboboxItem>
            <ComboboxItem id="go">Go</ComboboxItem>
          </ComboboxList>
          <ComboboxEmpty>No results found</ComboboxEmpty>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
```

```

```

```
