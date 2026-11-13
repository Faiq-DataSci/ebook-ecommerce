# Konvensi Penulisan Kode (`Coding Conventions`)

**Status:** `[CONFIRMED]` (aturan di `AGENTS.md` & `mobile/AGENTS.md`) | `[IMPLEMENTED]` (linting template web & Flutter)

---

## 1. Backend (`backend/`) — `[CONFIRMED]`

- **Module System:** ESM (`"type": "module"` pada `backend/package.json`).
- **Ekstensi Import Relatif:** Semua import relatif di dalam file `.ts` **wajib** memakai ekstensi `.js` (contoh: `import { app } from './app.js'`).
- **Validasi:** Gunakan **Zod** untuk memvalidasi input request dan payload eksternal.
- **Prisma 7:** Menggunakan `prisma.config.ts`; periksa `npm view prisma dist-tags` sebelum instalasi untuk menghindari versi RC bertag `latest`.
- **Perhitungan SAW:** Hanya di backend; jangan mempercayai bobot dari klien.

---

## 2. Admin Web (`web/admin-web/`) — `[CONFIRMED]` & `[IMPLEMENTED]`

- **Target Bahasa:** TypeScript (`[CONFIRMED]`), meski template awal saat ini masih `.jsx`.
- **Gaya Desain:** Neo-brutalism dengan 3 zona intensitas (`[CONFIRMED]`).
- **Linting:** ESLint terkonfigurasi di `web/admin-web/eslint.config.js` (`[IMPLEMENTED]`).

---

## 3. Mobile (`mobile/ebook_store/`) — `[CONFIRMED]` & `[IMPLEMENTED]`

- **State Management & HTTP:** Riverpod + Dio (`[CONFIRMED]`).
- **Linting:** Mengikuti aturan `package:flutter_lints/flutter.yaml` pada `mobile/ebook_store/analysis_options.yaml` (`[IMPLEMENTED]`).
- **Keamanan Klien:** Dilarang menaruh secret/private key di kode Dart; akses PDF hanya lewat *signed URL* dari backend (`[CONFIRMED]`).
