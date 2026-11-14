# Konvensi Penulisan Kode (`Coding Conventions`)

**Status:** `[ADA]` (aturan `AGENTS.md`, `mobile/AGENTS.md`, `tsconfig.json`, `eslint.config.js`, `analysis_options.yaml`) | `[RENCANA]` (penerapan di modul bisnis)

---

## 1. Backend (`backend/`)

- **Module System (`[ADA]`):** ESM (`"type": "module"` di `backend/package.json`).
- **Ekstensi Import Relatif (`[ADA]`):** Seluruh import relatif di `backend/src/**/*.ts` dan `tests/**/*.ts` **wajib** memakai ekstensi `.js` (contoh: `import { app } from './app.js'`).
- **TypeScript Strict (`[ADA]` di `tsconfig.json`):** `target: "ES2023"`, `module: "NodeNext"`, `moduleResolution: "NodeNext"`, `strict: true`, `noUncheckedIndexedAccess: true`, `noImplicitOverride: true`.
- **Validasi Input (`[ADA]`):** Gunakan Zod melalui middleware `validate.ts`.
- **Prisma 7 (`[ADA]`):** Menggunakan `prisma.config.ts` dan `@prisma/adapter-pg` (`PrismaPg` + `pg.Pool`). Cek `npm view prisma dist-tags` sebelum install/upgrade Prisma.
- **SAW Backend-Only (`[ADA]` aturan):** Perhitungan SAW hanya di backend; bobot klien tidak dipercaya.
- **Penamaan File:** `kebab-case.middleware.ts` untuk middleware (`auth.middleware.ts`, `error.middleware.ts`, `rate-limit.middleware.ts`), `camelCase.ts` untuk config/utils (`env.ts`, `response.ts`).
- **Format Respons Sukses (`[ADA]` di `response.ts`):** `{ success: true, data, meta? }`.
- **Format Respons Error (`[ADA]` di `error.middleware.ts`):** `{ success: false, error: { code, message, details? } }`.
- **Keamanan Kode:** Gunakan *parameterized queries* Prisma, hindari `eval()` / `new Function()`, dan jangan mencatat token/secret di `console.log`.

---

## 2. Admin Web (`web/admin-web/`)

- **Bahasa:** React `^19.3.1` + Vite `^8.3.6` + TypeScript (`tsconfig.json`, entry `main.tsx`, `App.tsx`, `vite.config.ts` `[ADA]`).
- **Gaya Desain:** Neo-brutalism dengan 3 zona intensitas (`[RENCANA]` implementasi UI bisnis, spesifikasi di `docs/01-design/ui-ux/design.md`).
- **Linting:** ESLint terkonfigurasi di `eslint.config.js` (`[ADA]`).
- **Keamanan:** Dilarang menaruh secret di variabel `VITE_*` (`[ADA]`).

---

## 3. Pengunjung Web (`web/pengunjung-web/`)

- **Bahasa:** JavaScript (`.jsx`) `[ADA]` dengan React `^19.3.1` + Vite `^8.3.6` (migrasi TypeScript masih `[RENCANA]`).
- **Linting:** ESLint terkonfigurasi di `eslint.config.js` (`[ADA]`).
- **Keamanan:** Dilarang menaruh secret di `VITE_*` (`[ADA]`).

---

## 4. Mobile (`mobile/ebook_store/`)

- **Framework & SDK (`[ADA]`):** Flutter (Dart `^3.12.0`).
- **Dependensi Inti (`[ADA]` di `pubspec.yaml`):** `flutter_riverpod ^2.6.1`, `dio ^5.8.0+1`, `flutter_secure_storage ^9.2.4`.
- **Linting (`[ADA]`):** `package:flutter_lints/flutter.yaml` pada `analysis_options.yaml`.
- **Arsitektur Fitur (`[RENCANA]`):** `lib/features/<nama>/` dibagi 3 lapis (`data/`, `domain/`, `presentation/`), dengan Dio client terpusat di `lib/core/network/`.
- **Konfigurasi `baseUrl` (`[ADA]` aturan):** Bedakan emulator (`10.0.2.2`) dan perangkat fisik (IP LAN / domain HTTPS).
- **State Layar (`[RENCANA]`):** Setiap layar pengambil data wajib menangani `loading`, `empty`, dan `error` dengan tombol coba lagi.
- **Aturan Klien:** Tidak ada secret di kode Dart; SAW dan otorisasi di backend; PDF hanya via signed URL *in-app*; data placeholder berlabel `"DATA SIMULASI"`.

---

## 5. Konvensi Lintas Komponen

- **Git:** Conventional Commits mengacu [`CONTRIBUTING.md`](../../CONTRIBUTING.md).
- **Status Dokumentasi:** Seluruh dokumen/fitur wajib bertanda `[ADA]` atau `[RENCANA]`.
- **Shell:** Windows PowerShell.
