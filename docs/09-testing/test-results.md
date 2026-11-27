# Hasil Pengujian (`Test Results`)

**Status:** `[ADA]` — diperbarui pada 27 November 2026 (verifikasi ulang suite backend, admin-web, pengunjung-web, mobile Flutter, dan audit keamanan di mesin ini).

**Lingkungan eksekusi:** Windows PowerShell 5.1, Node.js `v24.15.0`, npm `11.12.1`, Flutter `3.44.0` / Dart `3.12.0`.  
Validasi Prisma memuat skema dan konfigurasi; file migrasi awal `20261116000000_init/` telah terverifikasi.

---

## 1. Ringkasan Hasil Pemeriksaan Aktual (`[ADA]`)

| Komponen | Perintah | Hasil | Catatan |
|---|---|---|---|
| Backend typecheck | `npm run typecheck` | **PASS** | `tsc --noEmit`, tanpa error |
| Backend test | `npm run test` | **PASS** | 17 file suite tes (Vitest): **146 skenario** pengujian unit & integrasi lulus 100% |
| Backend cloud integration | `npm run test:cloud` | **PASS (Sebagian)** | Database Supabase live terhubung & ter-seed; Supabase Auth Admin valid; Supabase Storage privat bucket `ebooks-private` valid (Signed URL 200, Public blocked 400); Midtrans sandbox API merespons 401 Unauthorized (memerlukan server key aktif). |
| Backend build | `npm run build` | **PASS** | `tsc` menghasilkan `dist/` |
| Backend Prisma schema | `npm run prisma:validate` | **PASS** | `"The schema at prisma\schema.prisma is valid 🚀"` |
| Admin Web typecheck & lint | `npx tsc --noEmit` & `npm run lint` | **PASS** | TypeScript 0 error & ESLint 0 temuan |
| Pengunjung Web typecheck & lint | `npx tsc --noEmit` & `npm run lint` | **PASS** | TypeScript 0 error & ESLint 0 temuan |
| Mobile static analysis | `flutter analyze` | **PASS** | `No issues found!` |
| Mobile test suite | `flutter test` | **PASS** | **152/152 skenario** unit, widget, dan flow di 23 file `mobile/ebook_store/test/` lulus 100% |
| Repository security audit | `node scripts/security-check.mjs` | **PASS** | 1.001 file tracked diperiksa, 0 kebocoran terdeteksi |

---

## 2. Detail Suite Tes Backend (`[ADA]`)

| No | File Sumber | Cakupan Pengujian | Tipe Test | Hasil |
|---|---|---|---|---|
| 1 | `backend/tests/health.test.ts` | Endpoint `/health` (200 OK) & `/admin/ping` tanpa token (401 Unauthorized) | Integration (Supertest) | **PASS** |
| 2 | `backend/tests/unit/validate.test.ts` | Middleware validasi input Zod & helper respons `sendSuccess` | Unit | **PASS** |
| 3 | `backend/tests/unit/error-middleware.test.ts` | Transformasi `AppError`, `ZodError`, dan unhandled error ke respons terstandar | Unit | **PASS** |
| 4 | `backend/tests/unit/seed-data.test.ts` | Invarian label `"DATA SIMULASI"`, hak akses `EbookAccess` hanya untuk pesanan `PAID`, serta konsistensi total order | Unit | **PASS** |
| 5 | `backend/tests/unit/user.service.test.ts` | Sinkronisasi Supabase Auth, pemeriksaan aktivasi akun, dan pembaruan profil pengguna | Unit | **PASS** |
| 6 | `backend/tests/unit/catalog.service.test.ts` | Query kategori aktif, pagination katalog, filter, sanitasi `storagePath`, dan 404 handler | Unit | **PASS** |
| 7 | `backend/tests/unit/order.service.test.ts` | Perhitungan total harga server, validasi e-book aktif, larangan duplikasi akses, paginasi, dan proteksi IDOR | Unit | **PASS** |
| 8 | `backend/tests/unit/payment.service.test.ts` | Verifikasi signature HMAC SHA512, penanganan idempoten, mismatch amount, dan transaksi status pembayaran | Unit | **PASS** |
| 9 | `backend/tests/unit/ebook-access.service.test.ts` | Otorisasi unduh PDF privat, status dicabut (`isRevoked`), bypass admin, dan signed URL Supabase Storage | Unit | **PASS** |
| 10 | `backend/tests/unit/saw.service.test.ts` | Engine kalkulator SAW: normalisasi Benefit/Cost, validasi bobot total 1.0, tie-breaker A-Z, dan kecocokan exact dataset `perhitungan-manual.md` | Unit | **PASS** |
| 11 | `backend/tests/integration/user-auth-routes.test.ts` | Guard 401 dan flow endpoint `/api/v1/auth/sync` serta `/api/v1/users/me` | Integration (Supertest) | **PASS** |
| 12 | `backend/tests/integration/catalog-routes.test.ts` | Endpoint publik `/api/v1/categories`, `/api/v1/ebooks`, dan `/api/v1/ebooks/:id` | Integration (Supertest) | **PASS** |
| 13 | `backend/tests/integration/order-payment-routes.test.ts` | Endpoint `/api/v1/orders`, `/api/v1/orders/me`, `/api/v1/orders/:id`, `/api/v1/payments/webhook`, dan `/api/v1/ebooks/:id/access-url` | Integration (Supertest) | **PASS** |
| 14 | `backend/tests/integration/saw-routes.test.ts` | Endpoint `GET /api/v1/recommendations/saw`, validasi query, dan otorisasi rute bobot admin | Integration (Supertest) | **PASS** |
| 15 | `backend/tests/integration/transaction-routes.test.ts` | Endpoint `GET /api/v1/transactions/my` (autentikasi & filter role `CUSTOMER`) | Integration (Supertest) | **PASS** |
| 16 | `backend/tests/integration/admin-routes.test.ts` | 51 skenario: `/admin/ping`, `/admin/dashboard`, `/admin/saw/weights`, CRUD `/admin/ebooks*`, `/admin/categories*`, `/admin/customers*`, `/admin/orders*`, `/admin/payments`, `/admin/transactions`, `/admin/reports/sales`, `/admin/accesses/:id`, dan guard `ADMIN` | Integration (Supertest) | **PASS** |
| 17 | `backend/tests/unit/security-hardening.test.ts` | Sanitasi input, header keamanan, dan proteksi rate-limit / hardening API | Unit | **PASS** |

---

## 3. Detail Suite Tes Mobile Flutter (`[ADA]`)

| No | File Sumber | Cakupan Pengujian | Tipe Test |
|---|---|---|---|
| 1 | `test/splash_screen_test.dart` | Tampilan awal & transisi loading aplikasi (**3/3 skenario lulus**, termasuk verifikasi `Image` logo) | Widget Test |
| 2 | `test/splash_auto_login_test.dart` | Auto-login / pemulihan sesi saat boot | Widget Test |
| 3 | `test/login_screen_test.dart` | Formulir login, interaksi field, & tombol masuk | Widget Test |
| 4 | `test/register_screen_test.dart` | Validasi pendaftaran akun baru & konfirmasi password | Widget Test |
| 5 | `test/login_error_state_test.dart` | Penanganan pesan error login dan feedback visual | Widget Test |
| 6 | `test/catalog_screen_test.dart` | Grid buku, search bar, dan render katalog | Widget Test |
| 7 | `test/catalog_filter_test.dart` | Filter harga, pill kategori, dan perubahan state | Unit / Widget Test |
| 8 | `test/catalog_model_test.dart` | Parsing JSON dan integritas data model katalog | Unit Test |
| 9 | `test/home_book_detail_test.dart` | Navigasi ke detail e-book dari beranda | Widget Test |
| 10 | `test/widget_test.dart` | Sanity check render Beranda & kontrol interaktif | Widget Test |
| 11 | `test/book_reviews_test.dart` | Seksi ulasan & rating bintang pembaca | Widget Test |
| 12 | `test/cart_screen_test.dart` | Keranjang belanja, kondisi loading/error/empty, & checkout modal | Widget Test |
| 13 | `test/cart_persistence_test.dart` | Persistensi item keranjang | Unit Test |
| 14 | `test/checkout_feature_test.dart` | Alur checkout & pembayaran | Widget Test |
| 15 | `test/checkout_auto_polling_test.dart` | Auto-polling status pembayaran | Unit Test |
| 16 | `test/e2e_remote_flow_test.dart` | Alur E2E remote: rekomendasi SAW → keranjang → checkout | Integration |
| 17 | `test/home_recommendation_remote_test.dart` | Render rekomendasi SAW remote di Beranda | Widget Test |
| 18 | `test/library_screen_test.dart` | Perpustakaan digital & navigasi pustaka | Widget Test |
| 19 | `test/in_app_pdf_reader_test.dart` | _In-app PDF reader_ & signed URL | Widget Test |
| 20 | `test/reader_resume_progress_test.dart` | Resume progres baca | Unit Test |
| 21 | `test/profile_transactions_test.dart` | Profil, riwayat transaksi, & logout | Widget Test |
| 22 | `test/saw_ranking_screen_test.dart` | Halaman peringkat SAW & kartu bobot kriteria | Widget Test |
| 23 | `test/wishlist_and_search_pdf_test.dart` | Wishlist, pencarian, & akses PDF | Widget Test |

---

## 4. Temuan dan Tindak Lanjut

1. **Migrasi Prisma sudah live:** `backend/prisma/migrations/20261116000000_init/` telah terdeploy ke instance Supabase live dan terverifikasi melalui `npm run test:cloud`.
2. **Skrip Seeding telah dibuat & dijalankan:** `backend/prisma/seed.ts` dan `backend/prisma/seed-data.ts` siap dengan proteksi production; seeding live terverifikasi.
3. **Tes endpoint bisnis backend `[ADA]`:** Endpoint katalog, pesanan, transaksi, webhook pembayaran, signed URL, rekomendasi SAW, dashboard admin, dan bobot SAW sudah diuji (104 test lulus).
4. **Admin Web & Pengunjung Web:** Telah lolos linting dan pemeriksaan tipe TypeScript (`tsc --noEmit`).
5. **Mobile Flutter `[ADA]` sebagian:** 150 dari 151 skenario lulus. Satu kegagalan pada `splash_screen_test.dart` karena test masih mencari widget `StitchEbookIcon` yang tidak lagi ada pada implementasi splash saat ini; perlu disinkronkan antara test dan widget.

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
