# Panduan Instalasi (`Installation Guide`)

**Status:** `[ADA]` (instalasi dependensi & skrip dasar backend, web, dan template mobile) | `[RENCANA]` (migrasi database, koneksi Supabase penuh, dan integrasi Payment Gateway)  
**Shell:** Windows PowerShell  
**Referensi Utama:** [`AGENTS.md`](../../AGENTS.md), [`CONTRIBUTING.md`](../../CONTRIBUTING.md), [`docs/09-testing/test-results.md`](../09-testing/test-results.md).

---

## 1. Prasyarat Lingkungan

| Prasyarat | Versi Teruji | Status | Catatan |
|---|---|---|---|
| **Windows PowerShell** | 5.1+ | `[ADA]` | Shell standar proyek sesuai `AGENTS.md` |
| **Node.js & npm** | Node `v24.15.0` & npm `11.12.1` | `[ADA]` | Untuk `backend/`, `web/admin-web/`, dan `web/pengunjung-web/` |
| **Flutter SDK & Dart** | Flutter `3.44.0` / Dart `^3.12.0` | `[ADA]` | Untuk `mobile/ebook_store/` |
| **Windows Developer Mode** | Aktif | `[ADA]` | Wajib aktif agar `flutter analyze` berjalan tanpa error symlink |
| **Git** | Terpasang | `[ADA]` | Kontrol versi dan alur PR |
| **Proyek Supabase** | PostgreSQL + Auth + Storage Privat | `[RENCANA]` | Diperlukan saat menjalankan migrasi & runtime penuh |
| **Akun Payment Gateway** | Midtrans / Xendit (Sandbox/Live) | `[RENCANA]` | Diperlukan saat menguji checkout & webhook pembayaran |

---

## 2. Urutan Instalasi yang Direkomendasikan

Mengacu pada urutan pengerjaan di `AGENTS.md`: **`backend/` -> `web/admin-web/` -> `web/pengunjung-web/` -> `mobile/ebook_store/`**.

### A. Backend (`backend/`)

```powershell
npm --prefix backend install
Copy-Item backend\.env.example backend\.env
```
- `npm --prefix backend run prisma:validate` (`[ADA]` — terbukti PASS).
- `npx prisma generate` (`[RENCANA]` — generate Prisma Client ke `src/generated/prisma/`).
- `npx prisma migrate dev --name init` (`[RENCANA]` — membutuhkan `DIRECT_URL` port `5432` yang valid).
- Menjalankan server lokal: `npm --prefix backend run dev` (`[ADA]` — `tsx watch src/server.ts`).

> **Catatan Prisma 7 (`AGENTS.md`):** Sebelum menginstal atau memperbarui Prisma secara manual, jalankan `npm view prisma dist-tags` untuk menghindari pemasangan versi RC yang bertag `latest`.

> **Catatan ESM (`AGENTS.md`):** `backend/` memakai `"type": "module"`. Seluruh import relatif di `backend/src/**/*.ts` wajib memakai ekstensi `.js`.

### B. Admin Web (`web/admin-web/`)

```powershell
npm --prefix web/admin-web install
Copy-Item web\admin-web\.env.example web\admin-web\.env
npm --prefix web/admin-web run dev
```
- Lint: `npm --prefix web/admin-web run lint` (`[ADA]` — PASS).
- Build: `npm --prefix web/admin-web run build` (`[ADA]` — `tsc --noEmit` + `vite build`, PASS).

### C. Pengunjung Web (`web/pengunjung-web/`)

```powershell
npm --prefix web/pengunjung-web install
Copy-Item web\pengunjung-web\.env.example web\pengunjung-web\.env
npm --prefix web/pengunjung-web run dev
```
- Lint: `npm --prefix web/pengunjung-web run lint` (`[ADA]` — PASS).
- Build: `npm --prefix web/pengunjung-web run build` (`[ADA]` — `vite build`, PASS).

### D. Mobile (`mobile/ebook_store/`)

```powershell
cd mobile\ebook_store
flutter pub get
flutter run
```
- Analisis statis: `flutter analyze` (`[ADA]` — PASS setelah Windows Developer Mode aktif).
- Unit test: `flutter test` (`[ADA]` — 1 tes template PASS).

---

## 3. Verifikasi Pasca-Instalasi (`test-results.md`)

| Komponen | Perintah Verifikasi (PowerShell) | Hasil yang Diharapkan | Status |
|---|---|---|---|
| **Backend** | `npm --prefix backend run typecheck` | `tsc --noEmit` PASS tanpa error | `[ADA]` |
| **Backend** | `npm --prefix backend test` | 2 file, 5 tes Vitest PASS | `[ADA]` |
| **Backend** | `npm --prefix backend run build` | `tsc` menghasilkan `dist/` PASS | `[ADA]` |
| **Backend** | `npm --prefix backend run prisma:validate` | Skema `schema.prisma` valid PASS | `[ADA]` |
| **Admin Web** | `npm --prefix web/admin-web run lint; npm --prefix web/admin-web run build` | ESLint & Vite build PASS | `[ADA]` |
| **Pengunjung Web** | `npm --prefix web/pengunjung-web run lint; npm --prefix web/pengunjung-web run build` | ESLint & Vite build PASS | `[ADA]` |
| **Mobile** | `cd mobile\ebook_store; flutter analyze; flutter test` | `No issues found!` & tes template PASS | `[ADA]` |
