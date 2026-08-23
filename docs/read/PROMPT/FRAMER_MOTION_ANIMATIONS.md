# Framer Motion Animation Guidelines & Prompt Template

## Overview
Dokumen ini berisi panduan dan standar pengaplikasian animasi berbasis **Framer Motion** (`framer-motion`) untuk seluruh halaman dashboard, modal, dan komponen UI pada Sistem Manajemen Sekolah Terpadu (SIMSIT).

Gunakan animasi untuk memberikan kesan visual yang responsif, halus (*smooth*), modern, dan bebas dari *layout shift*.

---

## Canonical Imports

```jsx
import { motion, AnimatePresence } from 'framer-motion'
```

---

## Standard Animation Patterns

### 1. Staggered Container & Entrance Animation (Halaman & Grid)
Pengaturan animasi halaman saat pertama kali dimuat (*mount*) dengan efek bertahap (*staggered entrance*).

```jsx
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
}

export const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
}

// Contoh Penggunaan pada Halaman / Kontainer Grid:
export default function StandardAnimatedPage() {
  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-6">
      <motion.div variants={itemVariants}>
        {/* Header / Breadcrumbs */}
      </motion.div>

      <motion.div variants={itemVariants}>
        {/* Card Grid / Tables */}
      </motion.div>
    </motion.div>
  )
}
```

---

### 2. Interactive KPI Tinted Card Micro-Animations (Spring Physics)
Fisika pegas interaktif saat kursor diarahkan (*hover*) dan diklik (*active/tap*) pada KPI Card (identik dengan gaya Absensi Gerbang & Absensi Pembelajaran).

```jsx
<motion.button
  type="button"
  whileHover={{ scale: 1.04, y: -2 }}
  whileTap={{ scale: 0.96 }}
  transition={{ type: "spring", stiffness: 400, damping: 25 }}
  className="text-left rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-xs transition-all hover:shadow-md cursor-pointer group dark:border-emerald-950/50 dark:bg-emerald-950/20"
>
  <div className="flex items-center justify-between">
    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Total Siswa</p>
    <Users className="h-4 w-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
  <p className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-300">1,250</p>
</motion.button>
```

---

### 3. Active Mode & Tab Underline Indicator (`layoutId`)
Indikator visual yang meluncur secara fisik (*sliding background/underline*) saat berpindah antar Mode Pemindaian atau Tab Navigasi.

```jsx
// A. Sliding Background Pill Switcher
{isActive && (
  <motion.div
    layoutId="activeScanModeBg"
    className="absolute inset-0 rounded-xl bg-emerald-600 shadow-md dark:bg-emerald-500"
    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
  />
)}

// B. Sliding Underline Indicator
{isSelected && (
  <motion.span
    layoutId="activeTabUnderline"
    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-emerald-600 dark:bg-emerald-400"
    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
  />
)}
```

---

### 4. Laser Beam Scanner & Pulsing Status Effects
Sinar pemindai animasi (*laser beam*) naik-turun tanpa henti dan indikator status *Live Camera* pulsing dot.

```jsx
// Animated Laser Line Beam Loop
<motion.div
  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981]"
  animate={{ top: ['0%', '100%', '0%'] }}
  transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
/>

// Live Status Pulse Indicator
<span className="relative flex h-2.5 w-2.5">
  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
</span>
```

---

### 5. Modal & Overlay Spring Popups (`AnimatePresence`)
Animasi kemunculan modal konfirmasi & dialog dengan efek *backdrop blur fade* dan *scale-up spring physics*.

```jsx
import { AnimatePresence, motion } from 'framer-motion'

export function AnimatedModal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur & Fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Container with Spring Physics */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className="relative z-10 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl dark:bg-[#1B2433]"
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
            <div className="mt-4">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
```
