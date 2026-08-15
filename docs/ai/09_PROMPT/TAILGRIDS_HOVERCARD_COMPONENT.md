Read docs/ai/README.md and INDEX.md first.

# TailGrids HoverCard Component Integration Prompt & Guideline

## Overview
Dokumen ini berisi panduan dan prompt integrasi komponen **HoverCard** berbasis **TailGrids UI Library** (`@/components/tailgrids/core/hover-card`) bersama dengan animasi `framer-motion` untuk Sistem Manajemen Sekolah Terpadu (SIMSIT).

Gunakan **HoverCard** untuk menampilkan kartu pratinjau saat kursor diarahkan (hover) ke elemen tertentu seperti icon Notifikasi Bell, Profil Pengguna, atau Ringkasan Informasi Data.

---

## Canonical Imports & Component Anatomy

```jsx
"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/tailgrids/core/hover-card";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
```

---

## Standard Code Preview (HoverCardAnimationPreview)

```jsx
"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/tailgrids/core/hover-card";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function HoverCardAnimationPreview() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-center p-10">
      <HoverCard open={open} onOpenChange={setOpen}>
        <HoverCardTrigger
          href="#"
          className="inline-flex text-text-50 h-9 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Animated Hover
        </HoverCardTrigger>
        <AnimatePresence>
          {open && (
            <HoverCardContent className="w-64 p-0 bg-transparent ring-0 shadow-none border-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 15, rotateX: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10, rotateX: -5 }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 25,
                  mass: 1
                }}
                className="ring-(--border-color-base-50) bg-background-50 text-text-50 w-64 rounded-xl p-4 text-sm shadow-xl ring-1 outline-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 shadow-inner" />
                    <div>
                      <h4 className="font-bold text-title-50 text-[14px]">
                        Framer Motion
                      </h4>
                      <p className="text-[10px] text-text-100 font-medium">
                        Enhanced Animations
                      </p>
                    </div>
                  </div>
                  <p className="text-[13px] text-text-100 leading-relaxed font-medium">
                    This hover card uses <code>framer-motion</code> primitives
                    and spring physics for a more dynamic and responsive feel.
                  </p>
                  <div className="flex gap-2 pt-1">
                    <div className="h-1.5 w-full rounded-full bg-base-100 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{
                          delay: 0.2,
                          duration: 1,
                          ease: "easeInOut"
                        }}
                        className="h-full bg-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </HoverCardContent>
          )}
        </AnimatePresence>
      </HoverCard>
    </div>
  );
}
```

---

## Template Hover Card Notifikasi Bell (Notification Bell Hover Card)

Gunakan template ini untuk menampilkan kartu pratinjau notifikasi saat kursor diarahkan ke tombol Icon Bell Notifikasi:

```jsx
"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/tailgrids/core/hover-card";
import { AnimatePresence, motion } from "framer-motion";
import { Bell } from "lucide-react";
import { useState } from "react";

export function NotificationBellHoverCard({ unreadCount = 0, onOpenDrawer }) {
  const [open, setOpen] = useState(false);

  return (
    <HoverCard open={open} onOpenChange={setOpen}>
      <HoverCardTrigger
        onClick={onOpenDrawer}
        className="relative rounded-xl border border-slate-200/80 bg-slate-50/80 p-2 text-slate-600 transition-all hover:bg-slate-100 hover:text-[#0E5C44] dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white shadow-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </HoverCardTrigger>
      <AnimatePresence>
        {open && (
          <HoverCardContent className="w-64 p-0 bg-transparent ring-0 shadow-none border-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15, rotateX: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10, rotateX: -5 }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 25,
                mass: 1
              }}
              className="w-64 rounded-xl border border-slate-200 bg-white p-4 text-xs shadow-xl dark:border-slate-800 dark:bg-[#1B2433]"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white">Pemberitahuan</h4>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-[#0E5C44] dark:bg-emerald-950/50 dark:text-[#3FBF75]">
                    {unreadCount} Baru
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                  {unreadCount > 0
                    ? `Anda memiliki ${unreadCount} notifikasi yang belum dibaca.`
                    : 'Tidak ada notifikasi baru saat ini.'}
                </p>
              </div>
            </motion.div>
          </HoverCardContent>
        )}
      </AnimatePresence>
    </HoverCard>
  );
}
```

---

## Standard Code Preview (HoverCardProductPreview - Rincian Data Saat Hover)

Gunakan pola ini untuk menampilkan kartu rincian data (detail preview) saat kursor diarahkan ke nama item / data pada tabel atau daftar:

```jsx
"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from "@/components/tailgrids/core/hover-card";

export default function HoverCardProductPreview({ item, onSelectDetail }) {
  return (
    <HoverCard>
      <HoverCardTrigger
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onSelectDetail?.(item);
        }}
        className="text-slate-900 font-semibold border-b border-dashed border-slate-400/60 hover:border-[#0E5C44] transition-colors dark:text-white"
      >
        {item.name}
      </HoverCardTrigger>

      <HoverCardContent className="w-64 p-0 overflow-hidden border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#1B2433] shadow-xl rounded-xl">
        <div className="relative h-28 w-full bg-emerald-800 flex items-center justify-center text-white">
          {item.logo_url ? (
            <img src={item.logo_url} alt={item.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-2xl font-black">{item.unit_type || 'UP'}</span>
          )}
        </div>
        <div className="p-4 space-y-2">
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {item.name}
            </h4>
            <span className="text-xs font-bold text-[#0E5C44] dark:text-[#3FBF75]">
              {item.unit_type}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            NPSN: {item.npsn || '-'} | {[item.city, item.province].filter(Boolean).join(', ') || 'Lokasi belum diset'}
          </p>
          <button
            onClick={() => onSelectDetail?.(item)}
            className="w-full py-2 bg-[#0E5C44] text-white text-[10px] font-bold uppercase tracking-widest rounded transition-colors hover:bg-[#1E8E5A] mt-2"
          >
            Lihat Detail
          </button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
```

---

## Catatan Penting

1. **State Controlled**: Gunakan `open` dan `onOpenChange` pada `HoverCard` untuk mengontrol status popup secara opsional.
2. **Trigger Styling**: Gunakan kelas `font-semibold border-b border-dashed border-slate-400/60 hover:border-[#0E5C44] transition-colors` pada `HoverCardTrigger` agar pengguna mengetahui bahwa teks nama dapat di-hover untuk rincian data.
3. **AnimatePresence & Motion**: Bungkus `HoverCardContent` dengan `<AnimatePresence>` dan `<motion.div>` dari `framer-motion` jika membutuhkan animasi spring physics.
4. **Trigger**: `HoverCardTrigger` dari `@base-ui/react/preview-card` dapat diklik untuk langsung membuka rincian modal / drawer detail.
