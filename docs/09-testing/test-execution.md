# Panduan Eksekusi Test (`Test Execution Guide`)

**Status:** `[ADA]` (perintah fondasi backend, web, & mobile) | `[RENCANA]` (test bisnis, integrasi DB, & webhook sandbox)  
**Shell:** Windows PowerShell

---

## 1. Prasyarat Eksekusi

| Komponen | Prasyarat | Status |
|---|---|---|
| **Backend** | `npm --prefix backend install`, `.env` (dari `.env.example`), `DATABASE_URL` & `DIRECT_URL` untuk integrasi DB `[RENCANA]` | `[ADA]` (fondasi) / `[RENCANA]` (DB) |
| **Web (`admin-web`, `pengunjung-web`)** | `npm --prefix web/admin-web install`, `npm --prefix web/pengunjung-web install` | `[ADA]` |
| **Mobile (`ebook_store`)** | `flutter pub get`, **Windows Developer Mode aktif** | `[ADA]` |

---

## 2. Perintah Eksekusi per Komponen (PowerShell)

| Komponen | Perintah | Tujuan | Durasi Referensi | Status |
|---|---|---|---|---|
| **Backend** | `npm --prefix backend run typecheck` | TypeScript check (`tsc --noEmit`) | — | `[ADA]` |
| **Backend** | `npm --prefix backend test` | Vitest sekali jalan (`vitest run`) | `~0.64 s` (5 tes) | `[ADA]` |
| **Backend** | `npm --prefix backend run build` | Kompilasi `tsc` -> `dist/` | — | `[ADA]` |
| **Backend** | `npm --prefix backend run prisma:validate` | Validasi `schema.prisma` | — | `[ADA]` |
| **Admin Web** | `npm --prefix web/admin-web run lint` | ESLint | — | `[ADA]` |
| **Admin Web** | `npm --prefix web/admin-web run build` | `tsc --noEmit` + `vite build` | — | `[ADA]` |
| **Pengunjung Web** | `npm --prefix web/pengunjung-web run lint` | ESLint | — | `[ADA]` |
| **Pengunjung Web** | `npm --prefix web/pengunjung-web run build` | `vite build` | — | `[ADA]` |
| **Mobile** | `cd mobile\ebook_store; flutter analyze` | Dart static analyzer | — | `[ADA]` |
| **Mobile** | `cd mobile\ebook_store; flutter test` | Flutter test | — | `[ADA]` |

---

## 3. Konfigurasi Vitest & Eksekusi Selektif

- **Konfigurasi (`backend/vitest.config.ts` `[ADA]`):** `environment: 'node'`, `include: ['tests/**/*.test.ts']`. Belum ada konfigurasi coverage (`[RENCANA]`), dan skrip `npm test` menjalankan `vitest run` (non-watch).
- **Eksekusi file/nama spesifik (`[RENCANA]` saat suite bertambah):**
  - `npx --prefix backend vitest run tests/health.test.ts`
  - `npx --prefix backend vitest run -t "health"`

---

## 4. Eksekusi Integrasi DB & Webhook Sandbox (`[RENCANA]`)

- **Test Integrasi DB (`[RENCANA]`):** Gunakan database Supabase test terpisah (`DATABASE_URL` port `6543` & `DIRECT_URL` port `5432`), pastikan migrasi telah diterapkan.
- **Test Webhook Sandbox (`[RENCANA]`):** Aktifkan sandbox Midtrans/Xendit, set `PAYMENT_GATEWAY_WEBHOOK_SECRET`, dan gunakan tunnel HTTPS lokal (mis. ngrok) bila menguji callback eksternal.

---

## 5. Interpretasi Hasil & Tips PowerShell

| Perintah | Hasil PASS | Hasil FAIL | Status |
|---|---|---|---|
| `npm --prefix backend test` | Exit code `0`, seluruh suite PASS | Exit code `1`, rincian diff assertion | `[ADA]` |
| `flutter analyze` | `"No issues found!"` | Warning/error lint Dart atau symlink Windows | `[ADA]` |

- Jalankan perintah Node dari root monorepo memakai `--prefix` (mis. `npm --prefix backend test`).
- Untuk Flutter, masuk ke direktori `mobile\ebook_store` terlebih dahulu.
- Aktifkan Windows Developer Mode agar `flutter analyze` tidak gagal membuat symlink.
