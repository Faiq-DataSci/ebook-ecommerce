# Hasil Pengujian (`Test Results`)

**Status:** `[ADA]` — berisi hasil eksekusi nyata pada 13 November 2026.

**Lingkungan eksekusi:** Windows PowerShell 5.1, Node.js, Flutter 3.44.0 / Dart 3.12.0.
Validasi Prisma hanya memuat skema dan konfigurasi; tidak ada koneksi database.

---

## 1. Ringkasan Hasil

| Komponen | Perintah | Hasil | Catatan |
|---|---|---|---|
| Backend typecheck | `npm run typecheck` | **PASS** | `tsc --noEmit`, tanpa error |
| Backend test | `npm run test` | **PASS** | 2 file, 5 tes lulus (Vitest 5.1.0, 0.64 s) |
| Backend build | `npm run build` | **PASS** | `tsc` menghasilkan `dist/` (diabaikan Git) |
| Backend Prisma schema | `npm run prisma:validate` | **PASS** | "The schema at prisma\schema.prisma is valid" |
| Admin Web lint | `npm run lint` | **PASS** | ESLint tanpa temuan |
| Admin Web build | `npm run build` | **PASS** | `tsc --noEmit` + `vite build` |
| Pengunjung Web lint | `npm run lint` | **PASS** | ESLint tanpa temuan |
| Pengunjung Web build | `npm run build` | **PASS** | `vite build` |
| Mobile analyze | `flutter analyze` | **PASS** | "No issues found!" setelah Windows Developer Mode diaktifkan |
| Mobile test | `flutter test` | **PASS** | 1 tes template lulus |

---

## 2. Cakupan Pengujian Aktual

- **Backend:** suite Vitest berisi 2 berkas dengan 5 tes (middleware validasi, helper respons, endpoint `/api/v1/health`, dan penolakan 401 tanpa token). Belum ada tes untuk katalog, pesanan, pembayaran, akses e-book, maupun perhitungan SAW.
- **Admin Web:** belum ada tes otomatis; validasi baru sebatas lint dan build.
- **Pengunjung Web:** belum ada tes otomatis; validasi baru sebatas lint dan build.
- **Mobile:** hanya `test/widget_test.dart` bawaan template (*counter app*).

---

## 3. Temuan dan Tindak Lanjut

1. **Tes fitur bisnis belum tersedia.** Modul katalog, pesanan, pembayaran, akses e-book, dan SAW masih `[RENCANA]`; lihat [test-cases.md](./test-cases.md).
2. **Migrasi Prisma belum dibuat.** Skema domain sudah didefinisikan, tetapi folder `prisma/migrations/` belum ada.
3. **Lint backend belum tersedia.** `backend/` belum memiliki skrip ESLint.
4. **Admin Web dan Pengunjung Web belum memiliki tes otomatis.** Validasi masih sebatas lint dan build.

---

## 4. Perintah Reproduksi

```powershell
# Backend
cd backend
npm run typecheck
npm run test
npm run build
npm run prisma:validate  # memuat backend/.env yang diabaikan Git

# Web
cd web/admin-web; npm run lint; npm run build
cd web/pengunjung-web; npm run lint; npm run build

# Mobile
cd mobile/ebook_store; flutter analyze; flutter test
```
