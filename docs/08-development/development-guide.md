# Panduan Pengembangan (`Development Guide`)

**Status:** `[CONFIRMED]` (urutan & aturan kerja pada `AGENTS.md`) | `[PROPOSED]` (alur kerja tim)

---

## 1. Urutan Pengembangan Terkunci (`[CONFIRMED]`)

Sesuai `AGENTS.md`, pengembangan fitur dilakukan secara berurutan agar fondasi API dan data siap sebelum antarmuka dibangun:

1. **`backend/`** — Skema Prisma, migrasi database, autentikasi/otorisasi, REST API, dan engine SAW.
2. **`web/admin-web/`** — Antarmuka administrasi (konversi ke TypeScript + UI Neo-brutalism).
3. **`mobile/ebook_store/`** — Aplikasi pelanggan Flutter (integrasi Riverpod + Dio).

Uji konektivitas dasar (*health check* / auth / endpoint dasar) wajib dijalankan sebelum membangun UI penuh (`[CONFIRMED]`).

---

## 2. Skrip yang Tersedia Saat Ini (`[IMPLEMENTED]` di file konfigurasi)

### `backend/package.json` *(skrip sudah didefinisikan, source code belum ada)*
- `npm run dev` (`tsx watch src/server.ts`)
- `npm run build` (`tsc`)
- `npm run start` (`node dist/server.js`)
- `npm run typecheck` (`tsc --noEmit`)
- `npm run test` (`vitest run`)
- `npm run prisma:validate` (`npx prisma validate`)

### `web/admin-web/package.json` & `web/pengunjung-web/package.json`
- `npm run dev` (`vite`)
- `npm run build` (`vite build`)
- `npm run lint` (`eslint .`)
- `npm run preview` (`vite preview`)

### `mobile/ebook_store/`
- `flutter analyze`
- `flutter test`
- `flutter run`

---

## 3. Aturan Data Simulasi & Audit Pra-Push (`[CONFIRMED]`)

- Jika UI menampilkan data tiruan selama pengembangan, wajib diberi label **`"DATA SIMULASI"`**.
- Tidak diperbolehkan membuat endpoint palsu atau tombol tanpa aksi.
- Sebelum melakukan `git commit` atau `git push`, lakukan pemeriksaan `.gitignore`, `git status`, dan pemindaian secret.
