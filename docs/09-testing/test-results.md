# Hasil Pengujian (`Test Results`)

**Status:** `[ADA]` — diperbarui pada 17 November 2026 (pembaruan suite backend & mobile).

**Lingkungan eksekusi:** Windows PowerShell 5.1, Node.js `v24.15.0`, npm `11.12.1`, Flutter `3.44.0` / Dart `3.12.0`.  
Validasi Prisma memuat skema dan konfigurasi; file migrasi awal `20261116000000_init/` telah terverifikasi.

---

## 1. Ringkasan Hasil Pemeriksaan Aktual (`[ADA]`)

| Komponen | Perintah | Hasil | Catatan |
|---|---|---|---|
| Backend typecheck | `npm run typecheck` | **PASS** | `tsc --noEmit`, tanpa error |
| Backend test | `npm run test` | **PASS** | 4 file suite tes (Vitest): `health.test.ts`, `validate.test.ts`, `error-middleware.test.ts`, `seed-data.test.ts` |
| Backend build | `npm run build` | **PASS** | `tsc` menghasilkan `dist/` |
| Backend Prisma schema | `npm run prisma:validate` | **PASS** | `"The schema at prisma\schema.prisma is valid 🚀"` |
| Admin Web lint | `npm run lint` | **PASS** | ESLint tanpa temuan |
| Admin Web typecheck | `tsc --noEmit` | **PASS** | `tsconfig.app.json` tanpa error |
| Pengunjung Web lint | `npm run lint` | **PASS** | ESLint tanpa temuan |
| Pengunjung Web typecheck | `tsc --noEmit` | **PASS** | `tsconfig.app.json` tanpa error |
| Mobile test suite | `flutter test` | **PASS** | 9 suite pengujian unit & widget di `mobile/ebook_store/test/` |

---

## 2. Detail Suite Tes Backend (`[ADA]`)

| No | File Sumber | Cakupan Pengujian | Tipe Test | Hasil |
|---|---|---|---|---|
| 1 | `backend/tests/health.test.ts` | Endpoint `/health` (200 OK) & `/admin/ping` tanpa token (401 Unauthorized) | Integration (Supertest) | **PASS** |
| 2 | `backend/tests/unit/validate.test.ts` | Middleware validasi input Zod & helper respons `sendSuccess` | Unit | **PASS** |
| 3 | `backend/tests/unit/error-middleware.test.ts` | Transformasi `AppError`, `ZodError`, dan unhandled error ke respons terstandar | Unit | **PASS** |
| 4 | `backend/tests/unit/seed-data.test.ts` | Invarian label `"DATA SIMULASI"`, hak akses `EbookAccess` hanya untuk pesanan `PAID`, serta konsistensi total order | Unit | **PASS** |

---

## 3. Detail Suite Tes Mobile Flutter (`[ADA]`)

| No | File Sumber | Cakupan Pengujian | Tipe Test |
|---|---|---|---|
| 1 | `test/splash_screen_test.dart` | Tampilan awal & transisi loading aplikasi | Widget Test |
| 2 | `test/login_screen_test.dart` | Formulir login, interaksi field, & tombol masuk | Widget Test |
| 3 | `test/register_screen_test.dart` | Validasi pendaftaran akun baru & konfirmasi password | Widget Test |
| 4 | `test/login_error_state_test.dart` | Penanganan pesan error login dan feedback visual | Widget Test |
| 5 | `test/catalog_screen_test.dart` | Grid buku, search bar, dan render katalog | Widget Test |
| 6 | `test/catalog_filter_test.dart` | Filter harga, pill kategori, dan perubahan state | Unit / Widget Test |
| 7 | `test/catalog_model_test.dart` | Parsing JSON dan integritas data model katalog | Unit Test |
| 8 | `test/home_book_detail_test.dart` | Navigasi ke detail e-book dari beranda | Widget Test |
| 9 | `test/widget_test.dart` | Sanity check render widget aplikasi | Widget Test |

---

## 4. Temuan dan Tindak Lanjut

1. **Migrasi Prisma awal telah dibuat:** `backend/prisma/migrations/20261116000000_init/` sudah tersedia; eksekusi live ke instance Supabase menunggu jaringan/kredensial live (`[RENCANA]`).
2. **Skrip Seeding telah dibuat:** `backend/prisma/seed.ts` dan `backend/prisma/seed-data.ts` sudah siap dengan proteksi production.
3. **Tes endpoint bisnis backend:** Pengujian endpoint katalog, transaksi, webhook pembayaran, dan kalkulasi SAW backend masih `[RENCANA]` (menunggu implementasi router & service bisnis).
4. **Admin Web & Pengunjung Web:** Telah lolos linting dan pemeriksaan tipe TypeScript (`tsc --noEmit`).

---

## 5. Perintah Reproduksi (Dokumentasi PowerShell)

```powershell
# Backend
cd backend
npm run typecheck
npm run test
npm run prisma:validate

# Admin Web
cd web/admin-web
npm run lint
npx tsc --noEmit -p tsconfig.app.json

# Pengunjung Web
cd web/pengunjung-web
npm run lint
npx tsc --noEmit -p tsconfig.app.json

# Mobile
cd mobile/ebook_store
flutter test
```
