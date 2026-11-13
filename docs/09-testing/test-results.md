# Hasil Pengujian (`Test Results`)

**Status:** `[ADA]` — berisi hasil eksekusi nyata pada 13 November 2026.

**Lingkungan eksekusi:** Windows PowerShell 5.1, Node.js, Flutter 3.44.0 / Dart 3.12.0.
Validasi Prisma dijalankan dengan `DIRECT_URL` sementara hanya untuk memuat konfigurasi; tidak ada koneksi database.

---

## 1. Ringkasan Hasil

| Komponen | Perintah | Hasil | Catatan |
|---|---|---|---|
| Backend typecheck | `npm run typecheck` | **PASS** | `tsc --noEmit`, tanpa error |
| Backend unit test | `npm run test` | **PASS** | 1 file, 3 tes lulus (Vitest 5.1.0, 1.13 s) |
| Backend build | `npm run build` | **PASS** | `tsc` menghasilkan `dist/` (diabaikan Git) |
| Backend Prisma schema | `npm run prisma:validate` | **PASS** | "The schema at prisma\schema.prisma is valid" |
| Admin Web lint | `npm run lint` | **PASS** | ESLint tanpa temuan |
| Admin Web build | `npm run build` | **PASS** | `tsc --noEmit` + `vite build` |
| Pengunjung Web lint | `npm run lint` | **PASS** | ESLint tanpa temuan |
| Pengunjung Web build | `npm run build` | **PASS** | `vite build` |
| Mobile analyze | `flutter analyze` | **FAIL** | Terblokir kebutuhan *symlink* (Windows Developer Mode), bukan cacat kode |
| Mobile test | `flutter test` | **PASS** | 1 tes template lulus |

---

## 2. Cakupan Pengujian Aktual

- **Backend:** pada saat eksekusi, suite Vitest berisi 1 berkas dengan 3 tes (middleware validasi dan helper respons). Belum ada tes untuk autentikasi, katalog, pesanan, pembayaran, akses e-book, maupun perhitungan SAW.
- **Admin Web:** belum ada tes otomatis; validasi baru sebatas lint dan build.
- **Pengunjung Web:** belum ada tes otomatis; validasi baru sebatas lint dan build.
- **Mobile:** hanya `test/widget_test.dart` bawaan template (*counter app*).

---

## 3. Temuan dan Tindak Lanjut

1. **`flutter analyze` gagal di mesin ini.** Pesan: "Building with plugins requires symlink support. Please enable Developer Mode in your system settings." Aktifkan Developer Mode Windows, lalu jalankan ulang `flutter analyze`. Hasil ini **tidak** boleh dilaporkan sebagai lulus sampai perintah berhasil dijalankan.
2. **Tes fitur bisnis belum tersedia.** Modul autentikasi, katalog, pesanan, pembayaran, akses e-book, dan SAW masih `[RENCANA]`; lihat [test-cases.md](./test-cases.md).
3. **Belum ada integration test API.** Tes endpoint `/api/v1/health` dengan Supertest belum dibuat.
4. **Lint backend belum tersedia.** `backend/` belum memiliki skrip ESLint.

---

## 4. Perintah Reproduksi

```powershell
# Backend
cd backend
npm run typecheck
npm run test
npm run build
$env:DIRECT_URL='postgresql://user:pass@localhost:5432/ebook'; npm run prisma:validate

# Web
cd web/admin-web; npm run lint; npm run build
cd web/pengunjung-web; npm run lint; npm run build

# Mobile
cd mobile/ebook_store; flutter analyze; flutter test
```
