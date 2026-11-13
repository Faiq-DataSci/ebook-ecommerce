# Konvensi Penulisan Kode (`Coding Conventions`)

**Status:** `[ADA]` (aturan di `AGENTS.md` & `mobile/AGENTS.md`) | `[ADA]` (linting template web & Flutter)

---

## 1. Backend (`backend/`) — `[RENCANA]`

- **Module System:** ESM (`"type": "module"` pada `backend/package.json`).
- **Ekstensi Import Relatif:** Semua import relatif di dalam file `.ts` **wajib** memakai ekstensi `.js` (contoh: `import { app } from './app.js'`).
- **Validasi:** Gunakan **Zod** untuk memvalidasi input request dan payload eksternal.
- **Prisma 7:** Menggunakan `prisma.config.ts`; periksa `npm view prisma dist-tags` sebelum instalasi untuk menghindari versi RC bertag `latest`.
- **Perhitungan SAW:** Hanya di backend; jangan mempercayai bobot dari klien.

---

## 2. Admin Web (`web/admin-web/`) — `[RENCANA]` & `[ADA]`

- **Target Bahasa:** TypeScript (`[RENCANA]`), meski template awal saat ini masih `.jsx`.
- **Gaya Desain:** Neo-brutalism dengan 3 zona intensitas (`[RENCANA]`).
- **Linting:** ESLint terkonfigurasi di `web/admin-web/eslint.config.js` (`[ADA]`).

---

## 3. Mobile (`mobile/ebook_store/`) — `[RENCANA]` & `[ADA]`

- **State Management & HTTP:** Riverpod + Dio (`[RENCANA]`).
- **Linting:** Mengikuti aturan `package:flutter_lints/flutter.yaml` pada `mobile/ebook_store/analysis_options.yaml` (`[ADA]`).
- **Keamanan Klien:** Dilarang menaruh secret/private key di kode Dart; akses PDF hanya lewat *signed URL* dari backend (`[RENCANA]`).
