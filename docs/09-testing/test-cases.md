# Katalog Kasus Uji (`Test Cases`)

**Status:** `[ADA]` (5 tes fondasi backend + lint/build web + analyze/test template mobile) | `[RENCANA]` (seluruh test case fitur bisnis)  
**Konvensi ID:** `TC-FOUND-*` (Fondasi), `TC-AUTH-*` (Auth/RBAC), `TC-CAT-*` (Katalog/Kategori), `TC-ORD-*` (Order), `TC-PAY-*` (Payment/Webhook), `TC-ACC-*` (Akses E-Book), `TC-ADM-*` (Admin), `TC-WEB-*` (Web), `TC-MOB-*` (Mobile).  
*(Detail `TC-SAW-*` ada di [`test-saw.md`](./test-saw.md); `TC-SEC-*` di [`test-security.md`](./test-security.md); `TC-INT-*` di [`test-integration.md`](./test-integration.md).)*

---

## 1. Kasus Uji Fondasi yang Sudah Dieksekusi (`[ADA]`)

| ID | Skenario | File | Hasil | Status |
|---|---|---|---|---|
| **TC-FOUND-01** | `GET /api/v1/health returns 200 OK` | `backend/tests/health.test.ts` | PASS | `[ADA]` |
| **TC-FOUND-02** | `GET /api/v1/admin/ping without token returns 401 Unauthorized` | `backend/tests/health.test.ts` | PASS | `[ADA]` |
| **TC-FOUND-03** | `validate middleware parses body valid` | `backend/tests/unit/validate.test.ts` | PASS | `[ADA]` |
| **TC-FOUND-04** | `validate middleware passes ZodError on invalid body` | `backend/tests/unit/validate.test.ts` | PASS | `[ADA]` |
| **TC-FOUND-05** | `sendSuccess helper sends standard response` | `backend/tests/unit/validate.test.ts` | PASS | `[ADA]` |
| **TC-WEB-01** | Admin Web `npm run lint` | `web/admin-web` | PASS | `[ADA]` |
| **TC-WEB-02** | Admin Web `npm run build` (`tsc --noEmit` + `vite build`) | `web/admin-web` | PASS | `[ADA]` |
| **TC-WEB-03** | Pengunjung Web `npm run lint` | `web/pengunjung-web` | PASS | `[ADA]` |
| **TC-WEB-04** | Pengunjung Web `npm run build` (`vite build`) | `web/pengunjung-web` | PASS | `[ADA]` |
| **TC-MOB-01** | Mobile `flutter analyze` | `mobile/ebook_store` | PASS | `[ADA]` |
| **TC-MOB-02** | Mobile `flutter test` (`widget_test.dart` template) | `mobile/ebook_store/test/widget_test.dart` | PASS | `[ADA]` |

---

## 2. Kasus Uji Autentikasi & Otorisasi (`TC-AUTH-*` — `[RENCANA]`)

| ID | Modul | Skenario Uji | Prekondisi | Hasil yang Diharapkan | Tipe Test | Requirement ID | File Test Target | Status |
|---|---|---|---|---|---|---|---|---|
| **TC-AUTH-01** | Auth | Registrasi/sync pelanggan email valid | Email belum terdaftar | `201`/`200`, tanpa `password_hash` | Integration | `FR-C01` | `tests/integration/auth.test.ts` | `[RENCANA]` |
| **TC-AUTH-02** | Auth | Registrasi dengan email duplikat | Email sudah ada di DB | `409 CONFLICT` | Integration | `FR-C01` | `tests/integration/auth.test.ts` | `[RENCANA]` |
| **TC-AUTH-03** | Auth | Login valid via Supabase Auth | Akun aktif terdaftar | Mengembalikan token JWT | Integration | `FR-C01` | `tests/integration/auth.test.ts` | `[RENCANA]` |
| **TC-AUTH-04** | Auth | Login email tidak terdaftar | Email tidak ada | Pesan error generik (no enumeration) | Integration | `FR-C01` | `tests/integration/auth.test.ts` | `[RENCANA]` |
| **TC-AUTH-05** | Auth | Pelanggan akses endpoint `/api/v1/admin/*` | Token `CUSTOMER` | `403 FORBIDDEN` | Integration | `FR-A01`, `NFR-01` | `tests/integration/auth.test.ts` | `[RENCANA]` |
| **TC-AUTH-06** | Auth | Admin akses endpoint `/api/v1/admin/*` | Token `ADMIN` | `200 OK` | Integration | `FR-A01`, `NFR-01` | `tests/integration/auth.test.ts` | `[RENCANA]` |
| **TC-AUTH-07** | Auth | Endpoint terproteksi tanpa token | Header kosong | `401` (`UNAUTHORIZED`/`UNAUTHENTICATED`) | Integration | `NFR-01` | `tests/integration/auth.test.ts` | `[RENCANA]` |
| **TC-AUTH-08** | Auth | Token JWT kedaluwarsa | Token expired | `401` | Integration | `NFR-01` | `tests/integration/auth.test.ts` | `[RENCANA]` |
| **TC-AUTH-09** | Auth | Akun nonaktif (`isActive = false`) | User nonaktif | `403 FORBIDDEN` | Integration | `FR-A05`, `NFR-01` | `tests/integration/auth.test.ts` | `[RENCANA]` |
| **TC-AUTH-10** | Auth | Pelanggan kirim `role`/`isActive` di `PATCH /users/me` | Token `CUSTOMER` | `400 VALIDATION_ERROR` / ditolak | Integration | `FR-C02` | `tests/integration/auth.test.ts` | `[RENCANA]` |

---

## 3. Kasus Uji Katalog & Kategori (`TC-CAT-*` — `[RENCANA]`)

| ID | Modul | Skenario Uji | Prekondisi | Hasil yang Diharapkan | Tipe Test | Requirement ID | File Test Target | Status |
|---|---|---|---|---|---|---|---|---|
| **TC-CAT-01** | Catalog | Daftar e-book aktif (`GET /ebooks`) | Ada e-book aktif | `200 OK`, tanpa `storagePath` | Integration | `FR-C03` | `tests/integration/catalog.test.ts` | `[RENCANA]` |
| **TC-CAT-02** | Catalog | Detail e-book (`GET /ebooks/:id`) | E-book aktif | `200 OK`, tanpa `storagePath` | Integration | `FR-C05` | `tests/integration/catalog.test.ts` | `[RENCANA]` |
| **TC-CAT-03** | Catalog | Pencarian e-book (`?search=`) | Data `"DATA SIMULASI"` | Hasil terpaginasi cocok | Integration | `FR-C04` | `tests/integration/catalog.test.ts` | `[RENCANA]` |
| **TC-CAT-04** | Catalog | Filter kategori (`?categoryId=`) | Kategori aktif ada | `200 OK`, hanya kategori tersebut | Integration | `FR-C03` | `tests/integration/catalog.test.ts` | `[RENCANA]` |
| **TC-CAT-05** | Catalog | E-book `isActive = false` di katalog publik | E-book nonaktif | Tidak muncul / `404 NOT_FOUND` | Integration | `FR-C03` | `tests/integration/catalog.test.ts` | `[RENCANA]` |
| **TC-CAT-06** | Catalog | Kategori tidak ditemukan | UUID tidak ada | `404 NOT_FOUND` / list kosong | Integration | `FR-C03` | `tests/integration/catalog.test.ts` | `[RENCANA]` |
| **TC-CAT-07** | Category | Admin buat kategori unik | Token `ADMIN` | `201 Created` | Integration | `FR-A03` | `tests/integration/catalog.test.ts` | `[RENCANA]` |
| **TC-CAT-08** | Category | Admin buat kategori duplikat | Nama/slug sudah ada | `409 CONFLICT` | Integration | `FR-A03` | `tests/integration/catalog.test.ts` | `[RENCANA]` |
| **TC-CAT-09** | Category | Admin hapus kategori masih punya e-book | Relasi `Ebook` ada | `409 CONFLICT` (`onDelete: Restrict`) | Integration | `FR-A03` | `tests/integration/catalog.test.ts` | `[RENCANA]` |

---

## 4. Kasus Uji Pesanan (`TC-ORD-*` — `[RENCANA]`)

| ID | Modul | Skenario Uji | Prekondisi | Hasil yang Diharapkan | Tipe Test | Requirement ID | File Test Target | Status |
|---|---|---|---|---|---|---|---|---|
| **TC-ORD-01** | Order | Buat pesanan valid | Token `CUSTOMER`, e-book aktif | `201 Created`, `totalAmount` dari DB | Integration | `FR-C07` | `tests/integration/orders.test.ts` | `[RENCANA]` |
| **TC-ORD-02** | Order | Klien kirim harga palsu | Payload menyisipkan `totalAmount` | Diabaikan, `totalAmount` tetap harga DB | Integration | `FR-C07`, `NFR-07` | `tests/integration/orders.test.ts` | `[RENCANA]` |
| **TC-ORD-03** | Order | Pesan e-book yang sudah dimiliki | `EbookAccess` aktif ada | `409 CONFLICT` | Integration | `FR-C07` | `tests/integration/orders.test.ts` | `[RENCANA]` |
| **TC-ORD-04** | Order | E-book duplikat dalam satu order | `ebookIds` kembar | `409` / deduplikasi sesuai aturan | Integration | `FR-C07` | `tests/integration/orders.test.ts` | `[RENCANA]` |
| **TC-ORD-05** | Order | Daftar `ebookIds` kosong | `ebookIds: []` | `400 VALIDATION_ERROR` | Integration | `FR-C07`, `NFR-04` | `tests/integration/orders.test.ts` | `[RENCANA]` |
| **TC-ORD-06** | Order | Pesan e-book nonaktif | `isActive = false` | `404 NOT_FOUND` | Integration | `FR-C07` | `tests/integration/orders.test.ts` | `[RENCANA]` |
| **TC-ORD-07** | Order | Lihat pesanan sendiri (`GET /orders/me`, `/:id`) | Order milik user | `200 OK` | Integration | `FR-C09`, `FR-C10` | `tests/integration/orders.test.ts` | `[RENCANA]` |
| **TC-ORD-08** | Order | Lihat pesanan orang lain (IDOR) | Order milik user lain | `403 FORBIDDEN` | Integration | `NFR-01` | `tests/integration/orders.test.ts` | `[RENCANA]` |
| **TC-ORD-09** | Order | Pembayaran untuk order kedaluwarsa | `now > expiresAt` | `409 ORDER_EXPIRED` | Integration | `FR-C09` | `tests/integration/orders.test.ts` | `[RENCANA]` |

---

## 5. Kasus Uji Pembayaran & Webhook (`TC-PAY-*` — `[RENCANA]`)

| ID | Modul | Skenario Uji | Prekondisi | Hasil yang Diharapkan | Tipe Test | Requirement ID | File Test Target | Status |
|---|---|---|---|---|---|---|---|---|
| **TC-PAY-01** | Payment | Inisiasi pembayaran order `PENDING` | Order milik user, `PENDING` | `201 Created` | Integration | `FR-C08` | `tests/integration/payments.test.ts` | `[RENCANA]` |
| **TC-PAY-02** | Payment | Inisiasi pembayaran order non-`PENDING` | Order `PAID`/`EXPIRED` | `409 CONFLICT` | Integration | `FR-C08` | `tests/integration/payments.test.ts` | `[RENCANA]` |
| **TC-PAY-03** | Payment | Webhook signature tidak valid | Header signature salah | `401 WEBHOOK_SIGNATURE_INVALID` | Integration | `FR-C08`, `NFR-06` | `tests/integration/payments.test.ts` | `[RENCANA]` |
| **TC-PAY-04** | Payment | Webhook payload tidak lengkap | Field wajib hilang | `400 VALIDATION_ERROR` | Integration | `NFR-04` | `tests/integration/payments.test.ts` | `[RENCANA]` |
| **TC-PAY-05** | Payment | Webhook nominal berbeda | `amount != Payment.amount` | `400 PAYMENT_VERIFICATION_FAILED` | Integration | `FR-C08` | `tests/integration/payments.test.ts` | `[RENCANA]` |
| **TC-PAY-06** | Payment | Webhook `VERIFIED` pertama | `Payment.PENDING` | Atomik: `PAID`, `Transaction`, `EbookAccess` | Integration | `FR-C08`, `NFR-06` | `tests/integration/payments.test.ts` | `[RENCANA]` |
| **TC-PAY-07** | Payment | Webhook `VERIFIED` duplikat | `Payment` sudah `VERIFIED` | `200 DUPLICATE_WEBHOOK` (idempoten) | Integration | `NFR-06` | `tests/integration/payments.test.ts` | `[RENCANA]` |
| **TC-PAY-08** | Payment | Webhook `FAILED` | `Payment.PENDING` | `Payment` & `Order -> FAILED`, tanpa `EbookAccess` | Integration | `FR-C09` | `tests/integration/payments.test.ts` | `[RENCANA]` |
| **TC-PAY-09** | Payment | Webhook `EXPIRED` | `Payment.PENDING` | `Payment` & `Order -> EXPIRED`, tanpa `EbookAccess` | Integration | `FR-C09` | `tests/integration/payments.test.ts` | `[RENCANA]` |
| **TC-PAY-10** | Payment | Webhook `PENDING` | `Payment.PENDING` | Status tetap `PENDING` | Integration | `FR-C09` | `tests/integration/payments.test.ts` | `[RENCANA]` |
| **TC-PAY-11** | Payment | Error DB saat transaksi atomik | Simulasi gagal insert `EbookAccess` | Rollback penuh (no partial commit) | Integration | `NFR-06` | `tests/integration/payments.test.ts` | `[RENCANA]` |

---

## 6. Kasus Uji Akses E-Book (`TC-ACC-*` — `[RENCANA]`)

| ID | Modul | Skenario Uji | Prekondisi | Hasil yang Diharapkan | Tipe Test | Requirement ID | File Test Target | Status |
|---|---|---|---|---|---|---|---|---|
| **TC-ACC-01** | Access | Akses e-book belum dibeli | Tidak ada `EbookAccess` | `403 EBOOK_ACCESS_DENIED`, tanpa signed URL | Integration | `FR-C11`, `NFR-02` | `tests/integration/access.test.ts` | `[RENCANA]` |
| **TC-ACC-02** | Access | Akses e-book sudah dibeli & `PAID` | `EbookAccess` aktif | `200 OK`, mengembalikan signed URL sementara | Integration | `FR-C11`, `NFR-02` | `tests/integration/access.test.ts` | `[RENCANA]` |
| **TC-ACC-03** | Access | Akses e-book `isRevoked = true` | Akses dicabut admin | `403 EBOOK_ACCESS_DENIED` | Integration | `FR-A11`, `NFR-02` | `tests/integration/access.test.ts` | `[RENCANA]` |
| **TC-ACC-04** | Access | Signed URL kedaluwarsa (>300s) | URL expired | Klien minta ulang signed URL baru | Integration | `NFR-02` | `tests/integration/access.test.ts` | `[RENCANA]` |
| **TC-ACC-05** | Access | Bucket/file PDF tidak tersedia | Storage error | `500 SIGNED_URL_GENERATION_FAILED` | Integration | `NFR-02` | `tests/integration/access.test.ts` | `[RENCANA]` |
| **TC-ACC-06** | Access | Admin cabut akses (`isRevoked: true`) | Token `ADMIN` | `200 OK`, permintaan akses berikutnya `403` | Integration | `FR-A11` | `tests/integration/access.test.ts` | `[RENCANA]` |
| **TC-ACC-07** | Access | Admin pulihkan akses (`isRevoked: false`) | Token `ADMIN` | `200 OK`, akses kembali aktif | Integration | `FR-A11` | `tests/integration/access.test.ts` | `[RENCANA]` |

---

## 7. Kasus Uji Admin (`TC-ADM-*`) & Web/Mobile (`TC-WEB-*`, `TC-MOB-*`) — `[RENCANA]`

| ID | Modul | Skenario Uji | Prekondisi | Hasil yang Diharapkan | Tipe Test | Requirement ID | File Test Target | Status |
|---|---|---|---|---|---|---|---|---|
| **TC-ADM-01** | Admin | Dashboard ringkasan | Token `ADMIN` | `200 OK` agregasi dari `PAID`/`Transaction` | Integration | `FR-A02` | `tests/integration/admin.test.ts` | `[RENCANA]` |
| **TC-ADM-02** | Admin | CRUD kategori | Token `ADMIN` | `201`/`200` | Integration | `FR-A03` | `tests/integration/admin.test.ts` | `[RENCANA]` |
| **TC-ADM-03** | Admin | CRUD e-book & upload PDF privat | Token `ADMIN`, multipart | `201`/`200`, PDF di bucket privat | Integration | `FR-A04` | `tests/integration/admin.test.ts` | `[RENCANA]` |
| **TC-ADM-04** | Admin | Daftar pelanggan | Token `ADMIN` | `200 OK` | Integration | `FR-A05` | `tests/integration/admin.test.ts` | `[RENCANA]` |
| **TC-ADM-05** | Admin | Daftar & detail pesanan | Token `ADMIN` | `200 OK` | Integration | `FR-A06` | `tests/integration/admin.test.ts` | `[RENCANA]` |
| **TC-ADM-06** | Admin | Pantau pembayaran | Token `ADMIN` | `200 OK` | Integration | `FR-A07` | `tests/integration/admin.test.ts` | `[RENCANA]` |
| **TC-ADM-07** | Admin | Audit transaksi | Token `ADMIN` | `200 OK` | Integration | `FR-A08` | `tests/integration/admin.test.ts` | `[RENCANA]` |
| **TC-ADM-08** | Admin | Laporan penjualan | Token `ADMIN` | `200 OK` / CSV | Integration | `FR-A09` | `tests/integration/admin.test.ts` | `[RENCANA]` |
| **TC-ADM-09** | Admin | Konfigurasi bobot SAW valid | Token `ADMIN`, `Σ = 1.0` | `200 OK` | Integration | `FR-A10` | `tests/integration/admin.test.ts` | `[RENCANA]` |
| **TC-ADM-10** | Admin | Konfigurasi bobot SAW invalid | `Σ != 1.0` / negatif | `400 SAW_CONFIGURATION_INVALID` | Integration | `FR-A10` | `tests/integration/admin.test.ts` | `[RENCANA]` |
| **TC-ADM-11** | Admin | Non-admin akses endpoint admin | Token `CUSTOMER` | `403 FORBIDDEN` | Integration | `FR-A01`, `NFR-01` | `tests/integration/admin.test.ts` | `[RENCANA]` |
| **TC-WEB-05** | Web | Tes komponen UI bisnis `admin-web` & `pengunjung-web` | UI terimplementasi | Seluruh tes UI lulus | UI Test | `FR-A*`, `FR-C*` | `web/*/tests/` | `[RENCANA]` |
| **TC-MOB-03** | Mobile | Widget & state test (`loading`/`empty`/`error`) | Layar bisnis Flutter | Seluruh widget test lulus | Widget Test | `FR-C*` | `mobile/ebook_store/test/` | `[RENCANA]` |
