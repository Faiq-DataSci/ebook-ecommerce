# Katalog Kasus Uji (`Test Cases`)

> **Status Dokumen:** `[ADA]` (Dokumentasi katalog kasus uji)
> **Status Eksekusi:** Hanya **5 tes fondasi backend** dan pemeriksaan statis/build (`lint`, `build`, `flutter analyze`, `widget_test.dart` template) yang berstatus `[ADA]` berdasarkan [`docs/09-testing/test-results.md`](../09-testing/test-results.md). **Seluruh kasus uji modul bisnis berstatus `[RENCANA]`.**

---

## 1. Konvensi Penamaan Test ID

- `TC-FOUND-*`: Fondasi backend (`health`, middleware `validate`, helper `response`) — `[ADA]`
- `TC-AUTH-*`: Autentikasi & otorisasi RBAC — `[RENCANA]` *(kecuali `401` tanpa token pada `/admin/ping` `[ADA]`)*
- `TC-CAT-*`: Katalog & kategori e-book — `[RENCANA]`
- `TC-ORD-*`: Pesanan & checkout — `[RENCANA]`
- `TC-PAY-*`: Pembayaran & webhook payment gateway — `[RENCANA]`
- `TC-ACC-*`: Hak akses `EbookAccess` & *signed URL* — `[RENCANA]`
- `TC-ADM-*`: Dashboard, manajemen, & laporan Admin — `[RENCANA]`
- `TC-SAW-*`: Perhitungan SPK SAW & *edge case* — `[RENCANA]`
- `TC-WEB-*` & `TC-MOB-*`: Pemeriksaan build/lint & tes UI Web/Mobile — `[ADA]` (lint/build/template) / `[RENCANA]` (bisnis)

---

## 2. Kasus Uji Fondasi yang Sudah Dieksekusi (`[ADA]`)

| ID | Modul | Skenario Uji | Prekondisi | Langkah | Hasil yang Diharapkan | Tipe Test | Requirement ID | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-FOUND-01** | Foundation | Health check endpoint `/api/v1/health` | Express app siap | `GET /api/v1/health` | `200 OK`, `{ success: true, data: { status: "ok" } }` | Integration (Supertest) | `NFR-07` | `[ADA]` (`health.test.ts`) |
| **TC-FOUND-02** | Auth Guard | Akses `/api/v1/admin/ping` tanpa token | Tidak ada header `Authorization` | `GET /api/v1/admin/ping` | `401 Unauthorized`, `error.code = "UNAUTHORIZED"` *(rencana sinkronisasi ke `UNAUTHENTICATED`)* | Integration (Supertest) | `NFR-01`, `FR-S05` | `[ADA]` (`health.test.ts`) |
| **TC-FOUND-03** | Middleware | `validate` middleware meneruskan payload valid | Schema Zod `title` | Panggil `validate({ body })` dengan `'  Belajar SAW  '` | `req.body` ter-trim dan `next()` dipanggil tanpa error | Unit Test (Vitest) | `NFR-04` | `[ADA]` (`validate.test.ts`) |
| **TC-FOUND-04** | Middleware | `validate` middleware meneruskan `ZodError` saat payload invalid | Schema Zod `price > 0` | Panggil `validate({ body })` dengan `{ price: -100 }` | `next(err)` dipanggil 1x dengan instance `ZodError` | Unit Test (Vitest) | `NFR-04` | `[ADA]` (`validate.test.ts`) |
| **TC-FOUND-05** | Helper | `sendSuccess` mengirim format respons sukses standar | Mock `res.status` & `res.json` | Panggil `sendSuccess(res, { ok: true }, 201)` | Status `201` dan JSON `{ success: true, data: { ok: true } }` | Unit Test (Vitest) | `NFR-08` | `[ADA]` (`validate.test.ts`) |

---

## 3. Kasus Uji Autentikasi & Otorisasi (`TC-AUTH-*` — `[RENCANA]`)

| ID | Modul | Skenario Uji | Prekondisi | Langkah | Hasil yang Diharapkan | Tipe Test | Requirement ID | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-AUTH-01** | Auth | Registrasi pelanggan dengan email valid & password kuat (`DATA SIMULASI`) | Email belum terdaftar | `POST /api/v1/auth/register` dengan payload valid | `201 Created`, data user tersimpan (`CUSTOMER`), field sensitif tidak dikembalikan | Integration | `FR-C01` | `[RENCANA]` |
| **TC-AUTH-02** | Auth | Registrasi dengan email yang sudah terdaftar | Akun `"DATA SIMULASI"` sudah ada | `POST /api/v1/auth/register` dengan email sama | `409 Conflict` | Integration | `FR-C01` | `[RENCANA]` |
| **TC-AUTH-03** | Auth | Login dengan kredensial valid | Akun aktif tersedia | `POST /api/v1/auth/login` dengan email & password benar | `200 OK`, mengembalikan token sesi JWT valid | Integration | `FR-C01`, `FR-A01` | `[RENCANA]` |
| **TC-AUTH-04** | Auth | Login dengan email tidak terdaftar | Email belum terdaftar | `POST /api/v1/auth/login` | `401`, pesan generik (tidak membocorkan keberadaan email) | Integration | `FR-C01`, `NFR-01` | `[RENCANA]` |
| **TC-AUTH-05** | RBAC | Pelanggan mengakses endpoint admin | Login sebagai `CUSTOMER` | `GET /api/v1/admin/ping` atau endpoint admin lain | `403 Forbidden` | Integration | `FR-A01`, `NFR-01` | `[RENCANA]` |
| **TC-AUTH-06** | RBAC | Admin mengakses endpoint admin | Login sebagai `ADMIN` | `GET /api/v1/admin/ping` | `200 OK` | Integration | `FR-A01`, `NFR-01` | `[RENCANA]` |
| **TC-AUTH-07** | Auth | Endpoint terproteksi tanpa token | Tidak ada header `Authorization` | `GET /api/v1/orders` atau `/api/v1/library` | `401 Unauthorized` | Integration | `NFR-01` | `[RENCANA]` |
| **TC-AUTH-08** | Auth | Token JWT kedaluwarsa | Token JWT expired | Panggil endpoint terproteksi | `401 Unauthorized` | Integration | `NFR-01` | `[RENCANA]` |
| **TC-AUTH-09** | Auth | Akun nonaktif (`isActive = false`) mencoba akses | User dengan `isActive = false` | Panggil endpoint terproteksi dengan token user tsb | `403 Forbidden` | Integration | `NFR-01` | `[RENCANA]` |
| **TC-AUTH-10** | RBAC | Pelanggan mencoba mengubah `role` atau `isActive` melalui profil | Login sebagai `CUSTOMER` | Kirim `{ role: "ADMIN", isActive: false }` di payload update | Ditolak (`400 VALIDATION_ERROR`) atau diabaikan; `role` tetap `CUSTOMER` | Integration | `FR-C02`, `NFR-01` | `[RENCANA]` |

---

## 4. Kasus Uji Katalog & Kategori (`TC-CAT-*` — `[RENCANA]`)

| ID | Modul | Skenario Uji | Prekondisi | Langkah | Hasil yang Diharapkan | Tipe Test | Requirement ID | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-CAT-01** | Catalog | Pengunjung melihat daftar e-book aktif | Ada e-book aktif `DATA SIMULASI` | `GET /api/v1/ebooks` | `200 OK`, terpaginasi, `storagePath` tidak terekspos | Integration | `FR-C03` | `[RENCANA]` |
| **TC-CAT-02** | Catalog | Pengunjung melihat detail e-book | Ada e-book aktif | `GET /api/v1/ebooks/:id` | `200 OK`, `storagePath` tidak terekspos | Integration | `FR-C05` | `[RENCANA]` |
| **TC-CAT-03** | Catalog | Pengunjung mencari e-book berdasarkan kata kunci | Ada beberapa e-book | `GET /api/v1/ebooks?search=...` | `200 OK`, hasil sesuai kata kunci & terpaginasi | Integration | `FR-C04` | `[RENCANA]` |
| **TC-CAT-04** | Catalog | Pengunjung memfilter berdasarkan kategori aktif | Ada kategori aktif | `GET /api/v1/ebooks?categoryId=...` | `200 OK`, hanya menampilkan e-book kategori tersebut | Integration | `FR-C03` | `[RENCANA]` |
| **TC-CAT-05** | Catalog | E-book tidak aktif (`isActive = false`) disembunyikan | Ada e-book `isActive = false` | `GET /api/v1/ebooks` & `GET /api/v1/ebooks/:id` | Tidak muncul di daftar; detail publik mengembalikan `404` | Integration | `FR-C03`, `FR-A04` | `[RENCANA]` |
| **TC-CAT-06** | Category | Kategori tidak ditemukan | ID UUID tidak ada | `GET /api/v1/categories/:id` / filter invalid | `404 NOT_FOUND` | Integration | `FR-C03` | `[RENCANA]` |
| **TC-CAT-07** | Category | Admin membuat kategori unik | Login sebagai `ADMIN` | `POST /api/v1/admin/categories` | `201 Created` | Integration | `FR-A03` | `[RENCANA]` |
| **TC-CAT-08** | Category | Admin membuat kategori dengan nama/slug duplikat | Kategori sudah ada | `POST /api/v1/admin/categories` dengan nama/slug sama | `409 Conflict` | Integration | `FR-A03` | `[RENCANA]` |
| **TC-CAT-09** | Category | Admin menghapus kategori yang masih memiliki e-book | Kategori punya minimal 1 e-book | `DELETE /api/v1/admin/categories/:id` | Ditolak (`409 Conflict` karena `onDelete: Restrict`) | Integration | `FR-A03`, `NFR-02` | `[RENCANA]` |

---

## 5. Kasus Uji Pesanan & Checkout (`TC-ORD-*` — `[RENCANA]`)

| ID | Modul | Skenario Uji | Prekondisi | Langkah | Hasil yang Diharapkan | Tipe Test | Requirement ID | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-ORD-01** | Order | Pelanggan membuat pesanan e-book aktif | Login `CUSTOMER`, e-book aktif ada | `POST /api/v1/orders` dengan `ebookIds` valid | `201 Created`, `totalAmount` (`Decimal(12,2)`) dihitung dari `Ebook.price` DB | Integration | `FR-C07` | `[RENCANA]` |
| **TC-ORD-02** | Order | Klien mengirim harga manipulasi saat checkout | Login `CUSTOMER` | `POST /api/v1/orders` menyisipkan `unitPrice: 1` | Harga klien diabaikan/ditolak; `unitPrice` & `totalAmount` memakai harga DB | Integration | `FR-C07`, `NFR-07` | `[RENCANA]` |
| **TC-ORD-03** | Order | Memesan e-book yang sudah dimiliki (`EbookAccess` aktif) | `EbookAccess` aktif sudah ada | `POST /api/v1/orders` untuk `ebookId` yang sama | `409 Conflict` | Integration | `FR-C07` | `[RENCANA]` |
| **TC-ORD-04** | Order | Duplikasi `ebookId` dalam satu pesanan | Login `CUSTOMER` | `POST /api/v1/orders` dengan `[id1, id1]` | Ditolak (`400 VALIDATION_ERROR`) atau ter-deduplikasi aman (`@@unique([orderId, ebookId])`) | Integration | `FR-C07` | `[RENCANA]` |
| **TC-ORD-05** | Order | Daftar `ebookIds` kosong | Login `CUSTOMER` | `POST /api/v1/orders` dengan `{ ebookIds: [] }` | `400 VALIDATION_ERROR` | Integration | `FR-C07`, `NFR-04` | `[RENCANA]` |
| **TC-ORD-06** | Order | E-book tidak aktif atau tidak ditemukan | E-book `isActive = false` / UUID palsu | `POST /api/v1/orders` | `404 NOT_FOUND` | Integration | `FR-C07` | `[RENCANA]` |
| **TC-ORD-07** | Order | Pelanggan melihat riwayat pesanan sendiri | Pelanggan memiliki pesanan | `GET /api/v1/orders` | `200 OK`, hanya menampilkan pesanan milik `req.user.id` | Integration | `FR-C10` | `[RENCANA]` |
| **TC-ORD-08** | Order (IDOR) | Pelanggan melihat detail pesanan milik orang lain | Pesanan milik User B | User A memanggil `GET /api/v1/orders/:orderBId` | `403 Forbidden` | Integration | `FR-C10`, `NFR-01` | `[RENCANA]` |
| **TC-ORD-09** | Order | Pembayaran/aksi pada pesanan kedaluwarsa (`expiresAt` lewat) | Pesanan melewati `expiresAt` | Coba proses/bayar pesanan tersebut | `409 ORDER_EXPIRED` | Integration | `FR-C08`, `FR-C09` | `[RENCANA]` |

---

## 6. Kasus Uji Pembayaran & Webhook (`TC-PAY-*` — `[RENCANA]`)

| ID | Modul | Skenario Uji | Prekondisi | Langkah | Hasil yang Diharapkan | Tipe Test | Requirement ID | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-PAY-01** | Payment | Memulai pembayaran untuk pesanan `PENDING` | Order `PENDING` milik user | `POST /api/v1/payments` | `201 Created`, status `Payment = PENDING` | Integration | `FR-C08` | `[RENCANA]` |
| **TC-PAY-02** | Payment | Memulai pembayaran untuk pesanan non-`PENDING` | Order berstatus `PAID` / `EXPIRED` | `POST /api/v1/payments` | `409 Conflict` | Integration | `FR-C08` | `[RENCANA]` |
| **TC-PAY-03** | Webhook | Webhook dengan signature tidak valid | Payload webhook palsu | `POST /api/v1/webhooks/payment` dengan signature salah | `401 WEBHOOK_SIGNATURE_INVALID` | Integration | `FR-C08`, `NFR-01` | `[RENCANA]` |
| **TC-PAY-04** | Webhook | Webhook dengan payload tidak lengkap | Signature valid, field wajib kosong | `POST /api/v1/webhooks/payment` | `400 VALIDATION_ERROR` | Integration | `FR-C08`, `NFR-04` | `[RENCANA]` |
| **TC-PAY-05** | Webhook | Webhook dengan nominal berbeda dari `Payment.amount` | Signature valid, nominal tidak cocok | `POST /api/v1/webhooks/payment` | `400 PAYMENT_VERIFICATION_FAILED` | Integration | `FR-C08`, `NFR-06` | `[RENCANA]` |
| **TC-PAY-06** | Webhook | Webhook `VERIFIED` pertama kali | Payment & Order `PENDING` | `POST /api/v1/webhooks/payment` status sukses | `200 OK`; `Payment -> VERIFIED`, `Order -> PAID`, `Transaction` & `EbookAccess` tercipta atomik | Integration | `FR-C08`, `NFR-06` | `[RENCANA]` |
| **TC-PAY-07** | Webhook | Webhook `VERIFIED` dikirim dua kali (duplikat) | Payment sudah `VERIFIED` | Kirim ulang webhook identik | `200 OK` (`DUPLICATE_WEBHOOK`), tidak ada duplikasi `Transaction` / `EbookAccess` | Integration | `FR-C08`, `NFR-06` | `[RENCANA]` |
| **TC-PAY-08** | Webhook | Webhook berstatus `FAILED` | Payment `PENDING` | `POST /api/v1/webhooks/payment` status `FAILED` | `Payment` & `Order -> FAILED`, tanpa `EbookAccess` | Integration | `FR-C08`, `FR-C09` | `[RENCANA]` |
| **TC-PAY-09** | Webhook | Webhook berstatus `EXPIRED` | Payment `PENDING` | `POST /api/v1/webhooks/payment` status `EXPIRED` | `Payment` & `Order -> EXPIRED`, tanpa `EbookAccess` | Integration | `FR-C08`, `FR-C09` | `[RENCANA]` |
| **TC-PAY-10** | Webhook | Webhook berstatus `PENDING` | Payment `PENDING` | `POST /api/v1/webhooks/payment` status `PENDING` | Status tetap `PENDING`, tidak ada mutasi `EbookAccess` | Integration | `FR-C08`, `FR-C09` | `[RENCANA]` |
| **TC-PAY-11** | Webhook | Simulasi error DB saat insert `EbookAccess` | Mock error DB pada step akhir transaksi | Jalankan transaksi webhook `VERIFIED` | Seluruh `prisma.$transaction` di-rollback (*no partial commit*) | Integration | `NFR-06` | `[RENCANA]` |

---

## 7. Kasus Uji Akses E-Book & Signed URL (`TC-ACC-*` — `[RENCANA]`)

| ID | Modul | Skenario Uji | Prekondisi | Langkah | Hasil yang Diharapkan | Tipe Test | Requirement ID | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-ACC-01** | Ebook Access | Meminta akses e-book yang belum dibeli | Tidak ada `EbookAccess` | `POST /api/v1/ebooks/:id/access-url` | `403 EBOOK_ACCESS_DENIED`, tanpa *signed URL* | Integration | `FR-C11`, `NFR-02` | `[RENCANA]` |
| **TC-ACC-02** | Ebook Access | Meminta akses e-book yang sudah dibeli (`PAID`) | `EbookAccess` ada & `isRevoked = false` | `POST /api/v1/ebooks/:id/access-url` | `200 OK`, mengembalikan *signed URL* sementara | Integration | `FR-C11`, `NFR-02` | `[RENCANA]` |
| **TC-ACC-03** | Ebook Access | Meminta akses e-book dengan `isRevoked = true` | `EbookAccess.isRevoked = true` | `POST /api/v1/ebooks/:id/access-url` | `403 EBOOK_ACCESS_DENIED` | Integration | `FR-C11`, `FR-A11` | `[RENCANA]` |
| **TC-ACC-04** | Ebook Access | *Signed URL* kedaluwarsa saat membaca | TTL 300s terlewati | Klien memanggil ulang `POST /api/v1/ebooks/:id/access-url` | `200 OK`, backend menerbitkan *signed URL* baru jika akses masih valid | Integration | `FR-C11`, `NFR-02` | `[RENCANA]` |
| **TC-ACC-05** | Ebook Access | Bucket/file PDF tidak tersedia di Storage | Storage error / file hilang | `POST /api/v1/ebooks/:id/access-url` | `500 SIGNED_URL_GENERATION_FAILED` | Integration | `NFR-02` | `[RENCANA]` |
| **TC-ACC-06** | Admin Access | Admin mencabut akses (`isRevoked = true`) | Login `ADMIN`, `EbookAccess` aktif | `PATCH /api/v1/admin/ebook-accesses/:id` (`isRevoked: true`) | `200 OK`, permintaan PDF oleh pelanggan selanjutnya diblokir `403` | Integration | `FR-A11` | `[RENCANA]` |
| **TC-ACC-07** | Admin Access | Admin memulihkan akses (`isRevoked = false`) | `EbookAccess.isRevoked = true` | `PATCH /api/v1/admin/ebook-accesses/:id` (`isRevoked: false`) | `200 OK`, pelanggan dapat meminta *signed URL* kembali | Integration | `FR-A11` | `[RENCANA]` |

---

## 8. Kasus Uji Admin (`TC-ADM-*` — `[RENCANA]`)

| ID | Modul | Skenario Uji | Prekondisi | Langkah | Hasil yang Diharapkan | Tipe Test | Requirement ID | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-ADM-01** | Admin | Admin melihat ringkasan dashboard | Login `ADMIN` | `GET /api/v1/admin/dashboard` | `200 OK`, ringkasan dari query DB nyata | Integration | `FR-A02` | `[RENCANA]` |
| **TC-ADM-02** | Admin | Admin CRUD kategori | Login `ADMIN` | `POST/PATCH/DELETE /api/v1/admin/categories` | `201` / `200` / `204` | Integration | `FR-A03` | `[RENCANA]` |
| **TC-ADM-03** | Admin | Admin CRUD e-book & unggah PDF ke bucket privat | Login `ADMIN` | `POST/PATCH /api/v1/admin/ebooks` & upload PDF | `201` / `200`, `storagePath` tersimpan di bucket privat | Integration | `FR-A04` | `[RENCANA]` |
| **TC-ADM-04** | Admin | Admin melihat daftar pelanggan | Login `ADMIN` | `GET /api/v1/admin/customers` | `200 OK`, tanpa data rahasia | Integration | `FR-A05` | `[RENCANA]` |
| **TC-ADM-05** | Admin | Admin melihat daftar & detail pesanan | Login `ADMIN` | `GET /api/v1/admin/orders` | `200 OK` | Integration | `FR-A06` | `[RENCANA]` |
| **TC-ADM-06** | Admin | Admin memantau pembayaran & transaksi | Login `ADMIN` | `GET /api/v1/admin/payments` & `/transactions` | `200 OK` | Integration | `FR-A07`, `FR-A08` | `[RENCANA]` |
| **TC-ADM-07** | Admin | Admin menghasilkan laporan penjualan | Login `ADMIN`, ada transaksi `PAID` | `GET /api/v1/admin/reports/sales` | `200 OK`, total penjualan akurat | Integration | `FR-A09` | `[RENCANA]` |
| **TC-ADM-08** | Admin SAW | Admin mengkonfigurasi bobot SAW valid (`Σ = 1.0`) | Login `ADMIN` | `PUT /api/v1/admin/saw/weights` | `200 OK` | Integration | `FR-A10`, `FR-S02` | `[RENCANA]` |
| **TC-ADM-09** | Admin SAW | Admin mengkonfigurasi bobot SAW tidak valid (`Σ != 1.0` / negatif) | Login `ADMIN` | `PUT /api/v1/admin/saw/weights` | `400 SAW_CONFIGURATION_INVALID` | Integration | `FR-A10`, `FR-S02` | `[RENCANA]` |
| **TC-ADM-10** | Admin RBAC | Non-Admin mencoba akses endpoint admin | Login `CUSTOMER` | Panggil endpoint `/api/v1/admin/*` | `403 Forbidden` | Integration | `FR-A01`, `NFR-01` | `[RENCANA]` |

---

## 9. Kasus Uji SPK SAW (`TC-SAW-01` – `TC-SAW-16` — `[RENCANA]`)

Seluruh 16 kasus uji SPK SAW mengacu penuh pada [`docs/03-saw/saw-test-specification.md`](../03-saw/saw-test-specification.md) dan [`docs/03-saw/saw-edge-cases.md`](../03-saw/saw-edge-cases.md) (selengkapnya didokumentasikan pada [`saw-testing.md`](./saw-testing.md)):
- `TC-SAW-01`: Hasil identik dengan [`perhitungan-manual.md`](../03-saw/perhitungan-manual.md) (`DATA SIMULASI`, `A3 -> A1 -> A2`).
- `TC-SAW-02`–`TC-SAW-04`: Validasi bobot (`Σ = 1.0`, penolakan `Σ != 1.0`, penolakan bobot negatif).
- `TC-SAW-05`–`TC-SAW-08`: Normalisasi *Benefit*, normalisasi *Cost*, semua nilai `0`, dan katalog kandidat kosong (`recommendations: []`).
- `TC-SAW-09`–`TC-SAW-16`: *Tie-breaker* deterministik A–Z, 1 kandidat, kriteria invalid, e-book tanpa rating (`ratingAvg = 0`), bebas `NaN`/`Infinity`, penolakan bobot mentah klien publik, konsistensi urutan berulang, serta otorisasi `403` non-Admin.

---

## 10. Kasus Uji Web & Mobile (`TC-WEB-*`, `TC-MOB-*`)

| ID | Modul | Skenario Uji | Prekondisi | Langkah | Hasil yang Diharapkan | Tipe Test | Requirement ID | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-WEB-01** | Admin Web | Lint & Build `web/admin-web` | Dependencies terpasang | `npm --prefix web/admin-web run lint && build` | Keluar kode `0` tanpa error | Static / Build | `NFR-08` | `[ADA]` |
| **TC-WEB-02** | Pengunjung Web | Lint & Build `web/pengunjung-web` | Dependencies terpasang | `npm --prefix web/pengunjung-web run lint && build` | Keluar kode `0` tanpa error | Static / Build | `NFR-08` | `[ADA]` |
| **TC-WEB-03** | Web UI | Tes komponen & alur UI Admin Web / Pengunjung Web | Framework tes UI ditetapkan | Jalankan suite tes komponen web | Seluruh komponen krusial lulus | Component Test | `FR-A01`–`A11` | `[RENCANA]` |
| **TC-MOB-01** | Mobile | Analisis statis `mobile/ebook_store` | Flutter SDK terpasang | `flutter analyze` | Tidak ada issue | Static Check | `NFR-08` | `[ADA]` |
| **TC-MOB-02** | Mobile | Widget test template `test/widget_test.dart` | Flutter SDK terpasang | `flutter test` | 1 tes template lulus | Widget Test (Template) | `NFR-08` | `[ADA]` (template) |
| **TC-MOB-03** | Mobile | Widget & integration test fitur bisnis mobile (Auth, Katalog, SAW, Checkout, Reader) | Fitur mobile diimplementasikan | `flutter test` suite bisnis | Seluruh skenario UI & state Riverpod lulus | Widget / Integration | `FR-C01`–`C11` | `[RENCANA]` |
