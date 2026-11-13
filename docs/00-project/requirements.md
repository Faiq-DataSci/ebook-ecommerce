# Spesifikasi Kebutuhan (`Requirements`)

**Status:** `[RENCANA]` (spesifikasi kebutuhan sistem) | `[ADA]` (skema domain awal di `backend/prisma/schema.prisma`)

Dokumen ini menjabarkan kebutuhan fungsional, kebutuhan non-fungsional, dan matriks keterlacakan kebutuhan (*Requirements Traceability Matrix*) untuk **Sistem Informasi E-Commerce E-Book dan SPK (Metode SAW)**. Seluruh fitur bisnis berstatus `[RENCANA]` hingga implementasi dan pengujiannya selesai dijalankan.

---

## 1. Konvensi Penomoran & Prioritas

- **`FR-Cxx`**: Kebutuhan Fungsional Aktor Pelanggan (*Customer*) — target: `mobile/ebook_store` & `web/pengunjung-web`.
- **`FR-Axx`**: Kebutuhan Fungsional Aktor Admin — target: `web/admin-web`.
- **`FR-Sxx`**: Kebutuhan Fungsional Sistem Pendukung Keputusan (SAW) — target: `backend/`.
- **`NFR-xx`**: Kebutuhan Non-Fungsional lintas sistem.
- **Prioritas (MoSCoW):** `Must Have` (wajib ada untuk rilis inti), `Should Have` (penting namun bisa menyusul setelah inti stabil), `Could Have` (opsional bergantung keputusan terbuka).

---

## 2. Kebutuhan Fungsional — Aktor Pelanggan (`[RENCANA]`)

| ID | Kebutuhan | Prioritas | Deskripsi & Kriteria Penerimaan | Status |
|---|---|---|---|---|
| **FR-C01** | Registrasi & Login Akun | `Must Have` | Pelanggan dapat mendaftar dan masuk menggunakan **Supabase Auth** (`email` + `password`). Backend memverifikasi token Supabase dan menyinkronkan record ke tabel `users` dengan role default `CUSTOMER`. Pesan error login harus generik agar tidak membocorkan keberadaan email. | `[RENCANA]` |
| **FR-C02** | Manajemen Profil Pengguna | `Must Have` | Pelanggan terautentikasi dapat melihat dan memperbarui profil dasar (`fullName`, `phone`) melalui backend (`GET/PATCH /api/v1/users/me`) tanpa dapat mengubah `role` atau `isActive`. | `[RENCANA]` |
| **FR-C03** | Penjelajahan Katalog & Filter Kategori | `Must Have` | Pelanggan dapat melihat daftar e-book aktif (`isActive = true`) dengan pagination, serta memfilter berdasarkan kategori aktif (`Category`). | `[RENCANA]` |
| **FR-C04** | Pencarian E-Book | `Must Have` | Pelanggan dapat mencari e-book berdasarkan kata kunci judul atau penulis (`search` query) dengan hasil terpaginasi. | `[RENCANA]` |
| **FR-C05** | Detail E-Book | `Must Have` | Pelanggan dapat melihat detail lengkap e-book: judul, penulis, kategori, deskripsi, harga, jumlah halaman, tahun terbit, rata-rata rating (`ratingAvg`), jumlah terjual (`salesCount`), dan gambar sampul. | `[RENCANA]` |
| **FR-C06** | Rekomendasi E-Book Berbasis SPK (SAW) | `Must Have` | Pelanggan dapat melihat daftar rekomendasi e-book yang diurutkan berdasarkan skor preferensi SAW (`V_i`) hasil perhitungan backend, lengkap dengan peringkat dan informasi kriteria yang digunakan. | `[RENCANA]` |
| **FR-C07** | Pembuatan Pesanan (*Checkout*) | `Must Have` | Pelanggan terautentikasi dapat membuat pesanan (`Order`) untuk satu atau lebih e-book aktif. Backend menghitung `totalAmount` dari harga database (bukan dari klien), mencegah duplikasi e-book yang sudah dimiliki (`EbookAccess`), dan menetapkan `expiresAt` pesanan. | `[RENCANA]` |
| **FR-C08** | Pembayaran via Payment Gateway | `Must Have` | Pelanggan dapat melakukan pembayaran untuk pesanan berstatus `PENDING` melalui integrasi *payment gateway* nyata (Midtrans/Xendit) sesuai metode pembayaran yang tersedia. | `[RENCANA]` |
| **FR-C09** | Pemantauan Status Pesanan & Pembayaran | `Must Have` | Pelanggan dapat melihat status terkini pesanan (`PENDING`, `PAID`, `FAILED`, `EXPIRED`, `CANCELLED`) dan status pembayaran (`PENDING`, `VERIFIED`, `FAILED`, `EXPIRED`) milik dirinya sendiri. | `[RENCANA]` |
| **FR-C10** | Riwayat Pembelian & Transaksi | `Must Have` | Pelanggan dapat melihat daftar riwayat transaksi (`Transaction`) yang telah berhasil beserta kode transaksi (`transactionCode`), jumlah bayar, dan daftar e-book yang dibeli. | `[RENCANA]` |
| **FR-C11** | Akses & Baca E-Book (*In-App Reader*) | `Must Have` | Pelanggan dapat membaca PDF e-book **hanya di dalam aplikasi** (*in-app PDF reader*) apabila memiliki `EbookAccess` aktif (`isRevoked = false`). Backend menerbitkan *signed URL* sementara dari Supabase Storage bucket privat. | `[RENCANA]` |
| **FR-C12** | Ulasan & Rating E-Book | `Could Have` | Pelanggan yang telah membeli e-book dapat memberikan rating/ulasan *(menunggu penyelesaian keputusan terbuka #6 dan #7)*. | `[RENCANA]` |

---

## 3. Kebutuhan Fungsional — Aktor Admin (`[RENCANA]`)

Seluruh endpoint dan operasi di bawah ini wajib diverifikasi di backend bahwa pemanggil memiliki token valid **dan** `role = ADMIN` (menolak `CUSTOMER` dengan `403 Forbidden`).

| ID | Kebutuhan | Prioritas | Deskripsi & Kriteria Penerimaan | Status |
|---|---|---|---|---|
| **FR-A01** | Login & Akses Khusus Admin | `Must Have` | Admin masuk melalui Supabase Auth pada `web/admin-web`. Backend memvalidasi role `ADMIN` pada setiap permintaan admin; penyembunyian menu di UI tidak dijadikan kontrol keamanan. | `[RENCANA]` |
| **FR-A02** | Dashboard Ringkasan Admin | `Must Have` | Admin dapat melihat metrik ringkasan: total pendapatan, jumlah pesanan per status, jumlah e-book aktif, jumlah pelanggan aktif, dan daftar e-book terlaris. | `[RENCANA]` |
| **FR-A03** | Manajemen Kategori E-Book | `Must Have` | Admin dapat membuat, mengubah, mengaktifkan/menonaktifkan (`isActive`), dan menghapus kategori (`Category`) selama tidak melanggar integritas relasi (`onDelete: Restrict`). | `[RENCANA]` |
| **FR-A04** | Manajemen Katalog E-Book & Upload PDF | `Must Have` | Admin dapat menambah, mengubah, mengarsipkan (`isActive`), mengunggah gambar sampul, dan mengunggah file PDF e-book ke Supabase Storage bucket **privat** melalui backend (`storagePath`). | `[RENCANA]` |
| **FR-A05** | Manajemen Data Pelanggan | `Must Have` | Admin dapat melihat daftar pelanggan, mencari berdasarkan nama/email, melihat ringkasan pembelian pelanggan, serta mengaktifkan/menonaktifkan status akun (`isActive`). | `[RENCANA]` |
| **FR-A06** | Pemantauan Daftar & Detail Pesanan | `Must Have` | Admin dapat memantau seluruh pesanan pelanggan, memfilter berdasarkan status atau rentang tanggal, dan melihat rincian item pesanan (`OrderItem`). | `[RENCANA]` |
| **FR-A07** | Pemantauan Status Pembayaran | `Must Have` | Admin dapat memantau seluruh catatan `Payment` (metode, `externalRef`, `paidAt`, status) dan memeriksa kegagalan/kedaluwarsa pembayaran. | `[RENCANA]` |
| **FR-A08** | Daftar & Audit Transaksi | `Must Have` | Admin dapat melihat daftar `Transaction` resmi yang telah tercatat lengkap dengan `transactionCode`, nominal, dan referensi order/pembayaran. | `[RENCANA]` |
| **FR-A09** | Laporan Penjualan | `Must Have` | Admin dapat menghasilkan laporan penjualan berdasarkan rentang tanggal/kategori (ringkasan pendapatan, unit terjual) serta mengekspornya (mis. CSV) dari data backend nyata. | `[RENCANA]` |
| **FR-A10** | Konfigurasi & Audit Bobot SPK SAW | `Should Have` | Admin dapat melihat dan memperbarui bobot kriteria SAW yang tersimpan di backend dengan validasi jumlah bobot `= 1.0`, serta meninjau hasil peringkat SAW. | `[RENCANA]` |
| **FR-A11** | Kontrol Pencabutan Akses E-Book | `Should Have` | Admin dapat mencabut (`isRevoked = true`) atau memulihkan `EbookAccess` milik pelanggan tertentu untuk kasus penyalahgunaan atau sengketa transaksi. | `[RENCANA]` |

---

## 4. Kebutuhan Fungsional — Sistem Pendukung Keputusan (SAW) (`[RENCANA]`)

Merujuk pada [`ADR-0002`](../adr/0002-backend-only-saw.md) dan [`saw-method.md`](../03-saw/saw-method.md):

| ID | Kebutuhan | Prioritas | Deskripsi & Kriteria Penerimaan | Status |
|---|---|---|---|---|
| **FR-S01** | Perhitungan Eksklusif di Backend | `Must Have` | Seluruh proses pengambilan matriks keputusan, normalisasi, pembobotan, dan pemeringkatan SAW hanya berjalan di backend sebagai fungsi murni (*pure function*). Klien hanya menerima hasil akhir. | `[RENCANA]` |
| **FR-S02** | Validasi Ketat Bobot Kriteria | `Must Have` | Backend menolak konfigurasi bobot apabila ada bobot bernilai negatif/nol (sesuai aturan kriteria aktif) atau total bobot tidak sama dengan `1.0` (dalam toleransi floating-point yang ditetapkan). Bobot dari permintaan klien publik tidak dipercaya. | `[RENCANA]` |
| **FR-S03** | Normalisasi Benefit & Cost + Edge Case | `Must Have` | Kriteria `Benefit` dinormalisasi dengan $r_{ij} = \frac{x_{ij}}{\max_i(x_{ij})}$ dan `Cost` dengan $r_{ij} = \frac{\min_i(x_{ij})}{x_{ij}}$. Sistem wajib menangani pembagi nol (`0`) dan nilai kosong tanpa menghasilkan `NaN`/`Infinity`. | `[RENCANA]` |
| **FR-S04** | Perhitungan Nilai Preferensi & Tie-Breaker | `Must Have` | Nilai preferensi dihitung dengan $V_i = \sum_{j=1}^{n} w_j \cdot r_{ij}$ dengan presisi penuh sebelum pembulatan tampilan. Jika terdapat skor $V_i$ yang sama persis, pemeringkatan dipecah secara deterministik (tie-breaker alfabetis judul e-book A–Z). | `[RENCANA]` |
| **FR-S05** | Snapshot & Immutability Hasil Historis | `Should Have` | Hasil kalkulasi SAW (bobot saat eksekusi, nilai matriks, skor `V`, peringkat, dan timestamp) dapat disimpan sebagai snapshot historis yang tidak berubah meskipun harga/rating e-book berubah di kemudian hari *(menunggu finalisasi keputusan #11)*. | `[RENCANA]` |
| **FR-S06** | Verifikasi Kesesuaian Perhitungan Manual | `Must Have` | Unit test backend wajib memverifikasi hasil fungsi SAW terhadap dataset uji manual di [`perhitungan-manual.md`](../03-saw/perhitungan-manual.md) hingga menghasilkan urutan peringkat dan skor yang identik. | `[RENCANA]` |

---

## 5. Kebutuhan Non-Fungsional (`[RENCANA]` / Sebagian Fondasi `[ADA]`)

| ID | Kategori | Kebutuhan & Target Terukur | Status |
|---|---|---|---|
| **NFR-01** | Keamanan — Autentikasi & RBAC | Setiap endpoint non-publik wajib memverifikasi JWT Supabase Auth (`401 Unauthorized` jika tidak ada/tidak valid) dan memeriksa `UserRole` di backend (`403 Forbidden` jika role tidak berwenang). Middleware kerangka awal sudah `[ADA]` di `backend/src/middlewares/auth.middleware.ts`. | `[ADA]` (kerangka) / `[RENCANA]` (integrasi Supabase & RBAC) |
| **NFR-02** | Keamanan — Perlindungan File PDF | File PDF e-book wajib disimpan pada Supabase Storage bucket **privat**. Akses hanya melalui *signed URL* sementara dengan masa berlaku pendek (mis. ≤ 5–15 menit) setelah verifikasi kepemilikan `EbookAccess`. | `[RENCANA]` |
| **NFR-03** | Keamanan — Kredensial & Secret | Tidak ada secret (`SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, kunci payment gateway) yang boleh di-commit ke Git, diekspos ke variabel `VITE_*`, atau ditanamkan pada kode Flutter. | `[ADA]` (aturan & `.gitignore`) |
| **NFR-04** | Keamanan — Validasi Input & Rate Limiting | Seluruh payload request (body, query, params) divalidasi dengan skema **Zod** (`[ADA]` di `backend/src/middleware/validate.ts`), dilengkapi `helmet` dan `express-rate-limit` (`[ADA]`). | `[ADA]` (middleware) / `[RENCANA]` (skema per modul) |
| **NFR-05** | Kinerja — Latensi API & SAW | Endpoint katalog dan perhitungan SAW untuk katalog aktif diharapkan merespons < 500 ms pada kondisi normal; daftar katalog dan order wajib menggunakan pagination (`page`, `limit`). | `[RENCANA]` |
| **NFR-06** | Keandalan — Atomisitas & Idempotensi Pembayaran | Pembaruan status `Payment` -> `Order` -> pembuatan `Transaction` -> penerbitan `EbookAccess` dari webhook payment gateway wajib berjalan dalam satu transaksi database Prisma (`prisma.$transaction`) dan bersifat idempoten terhadap pengiriman ulang webhook. | `[RENCANA]` |
| **NFR-07** | Integritas Data — Presisi Numerik | Nilai moneter menggunakan tipe `Decimal(12, 2)` pada PostgreSQL/Prisma (`[ADA]` di `schema.prisma`). Perhitungan SAW menjaga presisi penuh selama normalisasi dan agregasi sebelum pembulatan tampilan. | `[ADA]` (skema) / `[RENCANA]` (logika) |
| **NFR-08** | Kepatuhan Kode & Maintainability | Backend wajib menggunakan ESM (`"type": "module"`) dengan ekstensi `.js` pada seluruh import relatif `.ts`, lolos `tsc --noEmit`, dan memiliki cakupan unit/integration test untuk seluruh modul bisnis & SAW. | `[ADA]` (konfigurasi) / `[RENCANA]` (cakupan bisnis) |

---

## 6. Matriks Keterlacakan Kebutuhan (*Requirements Traceability Matrix*)

| ID | Referensi `business-requirements.md` | Entitas Prisma (`schema.prisma`) | Rancangan Endpoint (`api-endpoints.md`) | Aplikasi Target | Kasus Uji (`test-cases.md`) | Status |
|---|---|---|---|---|---|---|
| **FR-C01, FR-C02** | `BR-C01` | `User` | `POST /auth/register`, `POST /auth/login`, `GET /users/me` | Mobile, Pengunjung Web, Backend | Auth & Profile Tests | `[RENCANA]` |
| **FR-C03, FR-C04, FR-C05** | `BR-C02`, `BR-C03`, `BR-C04` | `Category`, `Ebook` | `GET /categories`, `GET /ebooks`, `GET /ebooks/:id` | Mobile, Pengunjung Web, Backend | Catalog & Search Tests | `[RENCANA]` |
| **FR-C06, FR-S01..S06** | `BR-C03` | `Ebook`, `Category` *(+ model SAW `[RENCANA]`)* | `GET /recommendations/saw` *(rancangan)* | Mobile, Pengunjung Web, Backend | SAW Unit & Manual Match Tests | `[RENCANA]` |
| **FR-C07, FR-C08, FR-C09** | `BR-C05`, `BR-C06`, `BR-C07` | `Order`, `OrderItem`, `Payment` | `POST /orders`, `POST /payments`, `POST /payments/webhook` | Mobile, Pengunjung Web, Backend | Order & Payment Webhook Tests | `[RENCANA]` |
| **FR-C10, FR-C11** | `BR-C08`, `BR-C09` | `Transaction`, `EbookAccess` | `GET /orders/me`, `GET /ebooks/:id/access-url` | Mobile, Pengunjung Web, Backend | Access Control & Signed URL Tests | `[RENCANA]` |
| **FR-A01, FR-A02** | `BR-A01`, `BR-A02` | `User`, `Order`, `Transaction`, `Ebook` | `POST /auth/login`, `GET /admin/dashboard` | Admin Web, Backend | RBAC Admin (`403`) & Dashboard Tests | `[RENCANA]` |
| **FR-A03, FR-A04** | `BR-A03`, `BR-A04` | `Category`, `Ebook` | `POST/PATCH/DELETE /admin/categories`, `/admin/ebooks` | Admin Web, Backend | Admin CRUD & Storage Upload Tests | `[RENCANA]` |
| **FR-A05..A09** | `BR-A06`–`BR-A10` | `User`, `Order`, `Payment`, `Transaction` | `GET /admin/customers`, `/admin/orders`, `/admin/reports/sales` | Admin Web, Backend | Admin Monitoring & Report Tests | `[RENCANA]` |
| **FR-A10, FR-A11** | — | `EbookAccess` *(+ model bobot SAW `[RENCANA]`)* | `PUT /admin/saw/weights`, `PATCH /admin/accesses/:id` | Admin Web, Backend | SAW Weight Validation & Revoke Tests | `[RENCANA]` |
