# Katalog Endpoint REST API (`/api/v1`)

> **Status Dokumen:** `[ADA]` (Hanya `GET /api/v1/health` dan `GET /api/v1/admin/ping` pada [`backend/src/app.ts`](../../backend/src/app.ts)) | `[RENCANA]` (Seluruh endpoint bisnis lainnya)
> **Sumber Acuan Utama:** [`docs/02-api/api-spec.yaml`](../02-api/api-spec.yaml) (OpenAPI 3.1)
> **Catatan Data:** Seluruh contoh request dan response memakai label **`"DATA SIMULASI"`**.

---

## 0. Health Check (`[ADA]`)

### 0.1 Cek Kesehatan Layanan
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/health`
- **Deskripsi:** Memastikan layanan Express backend berjalan normal.
- **Authentication:** Tidak diperlukan
- **Authorization:** Publik
- **Request Parameters:** Tidak ada
- **Request Body:** Tidak ada
- **Response Sukses:** `{ "success": true, "data": { "status": "ok" } }`
- **HTTP Status Code:** `200 OK`
- **Error Handling:** `500 INTERNAL_SERVER_ERROR` bila server gagal merespons.
- **Status:** `[ADA]` (teruji pada [`health.test.ts`](../../backend/tests/health.test.ts))

---

## 1. Autentikasi & Profil (`[RENCANA]`)

### 1.1 Sinkronisasi Profil Supabase Auth
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/auth/sync`
- **Deskripsi:** Menyinkronkan pengguna yang telah login via Supabase Auth ke tabel `users` PostgreSQL dengan role default `CUSTOMER`.
- **Authentication:** Wajib (Bearer Token)
- **Authorization:** `CUSTOMER` atau `ADMIN`
- **Request Parameters:** Tidak ada
- **Request Body:** `{ "fullName": "DATA SIMULASI - Pelanggan", "phone": "081200000000" }` *(opsional)*
- **Response Sukses:** `{ "success": true, "data": { "id": "uuid", "fullName": "DATA SIMULASI - Pelanggan", "email": "simulasi@example.test", "role": "CUSTOMER", "isActive": true } }`
- **HTTP Status Code:** `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`
- **Error Handling:** `VALIDATION_ERROR`, `UNAUTHORIZED`. Tidak pernah menerima `role` dari klien.
- **Status:** `[RENCANA]`

### 1.2 Lihat Profil Pengguna Aktif
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/users/me`
- **Deskripsi:** Mengambil profil pengguna aktif berdasarkan `req.user.id` dari token JWT.
- **Authentication:** Wajib (Bearer Token)
- **Authorization:** `CUSTOMER` atau `ADMIN`
- **Request Parameters:** Tidak ada
- **Request Body:** Tidak ada
- **Response Sukses:** `{ "success": true, "data": { "id": "uuid", "fullName": "DATA SIMULASI", "email": "simulasi@example.test", "role": "CUSTOMER", "isActive": true } }`
- **HTTP Status Code:** `200 OK`, `401 Unauthorized`, `403 Forbidden`
- **Error Handling:** `UNAUTHORIZED`, `FORBIDDEN` (bila akun nonaktif). Tidak mengekspos `supabaseUserId`.
- **Status:** `[RENCANA]`

### 1.3 Perbarui Profil Pengguna Aktif
- **HTTP Method:** `PATCH`
- **Endpoint:** `/api/v1/users/me`
- **Deskripsi:** Memperbarui `fullName` dan/atau `phone` milik pengguna aktif.
- **Authentication:** Wajib (Bearer Token)
- **Authorization:** `CUSTOMER` atau `ADMIN`
- **Request Parameters:** Tidak ada
- **Request Body:** `{ "fullName": "DATA SIMULASI Baru", "phone": "081200000001" }`
- **Response Sukses:** `{ "success": true, "data": { "id": "uuid", "fullName": "DATA SIMULASI Baru", "email": "simulasi@example.test", "role": "CUSTOMER", "isActive": true } }`
- **HTTP Status Code:** `200 OK`, `400 Bad Request`, `401 Unauthorized`
- **Error Handling:** `VALIDATION_ERROR`; menolak perubahan `role` atau `isActive`.
- **Status:** `[RENCANA]`

---

## 2. Kategori (`[RENCANA]`)

### 2.1 Daftar Kategori Aktif
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/categories`
- **Deskripsi:** Mengambil daftar kategori e-book yang berstatus `isActive = true`.
- **Authentication:** Tidak diperlukan
- **Authorization:** Publik
- **Request Parameters:** Tidak ada
- **Request Body:** Tidak ada
- **Response Sukses:** `{ "success": true, "data": [{ "id": "uuid", "name": "DATA SIMULASI - Teknologi", "slug": "teknologi" }] }`
- **HTTP Status Code:** `200 OK`
- **Error Handling:** Mengembalikan array kosong `[]` bila belum ada kategori aktif.
- **Status:** `[RENCANA]`

---

## 3. Katalog E-Book (`[RENCANA]`)

### 3.1 Daftar & Pencarian E-Book Aktif
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/ebooks`
- **Deskripsi:** Menampilkan katalog e-book aktif dengan filter kategori, pencarian kata kunci, dan paginasi.
- **Authentication:** Tidak diperlukan
- **Authorization:** Publik
- **Request Parameters:** Query Zod: `search?` (string max 100), `categoryId?` (UUID), `page?` (`>= 1`, default `1`), `limit?` (`1–100`, default `20`).
- **Request Body:** Tidak ada
- **Response Sukses:** `{ "success": true, "data": [{ "id": "uuid", "title": "DATA SIMULASI - Panduan Praktis Flutter", "author": "DATA SIMULASI", "price": "40000.00", "ratingAvg": "4.80", "salesCount": 150 }], "meta": { "page": 1, "limit": 20, "total": 1, "totalPages": 1 } }`
- **HTTP Status Code:** `200 OK`, `400 Bad Request`
- **Error Handling:** `VALIDATION_ERROR`; `storagePath` tidak pernah disertakan.
- **Status:** `[RENCANA]`

### 3.2 Detail E-Book Aktif
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/ebooks/:id`
- **Deskripsi:** Mengambil detail lengkap satu e-book aktif.
- **Authentication:** Tidak diperlukan
- **Authorization:** Publik
- **Request Parameters:** Path `:id` (UUID v4, divalidasi Zod)
- **Request Body:** Tidak ada
- **Response Sukses:** `{ "success": true, "data": { "id": "uuid", "title": "DATA SIMULASI", "author": "DATA SIMULASI", "description": "DATA SIMULASI", "price": "40000.00", "ratingAvg": "4.80", "salesCount": 150 } }`
- **HTTP Status Code:** `200 OK`, `400 Bad Request`, `404 Not Found`
- **Error Handling:** `NOT_FOUND` bila e-book tidak ada atau `isActive = false`; `storagePath` tidak diekspos.
- **Status:** `[RENCANA]`

---

## 4. Rekomendasi SPK SAW (`[RENCANA]`)

### 4.1 Rekomendasi E-Book Berbasis SAW
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/recommendations/saw`
- **Deskripsi:** Menghitung peringkat e-book aktif menggunakan metode SAW secara murni di backend (`ADR-0002`) memakai bobot server.
- **Authentication:** Opsional / Wajib `[RENCANA]` *(Keputusan #5)*
- **Authorization:** Publik / `CUSTOMER`
- **Request Parameters:** Query Zod: `categoryId?` (UUID), `limit?` (`1–100`, default `20`).
- **Request Body:** Tidak ada *(bobot mentah dari klien ditolak/diabaikan)*.
- **Response Sukses:** `{ "success": true, "data": { "isSimulation": true, "criteriaVersion": "DATA SIMULASI", "recommendations": [{ "rank": 1, "ebookId": "uuid", "title": "DATA SIMULASI - Panduan Praktis Flutter", "sawScore": 1.0 }] } }`
- **HTTP Status Code:** `200 OK`, `400 Bad Request`, `500 Internal Server Error`
- **Error Handling:** `SAW_CONFIGURATION_INVALID` bila bobot server rusak.
- **Status:** `[RENCANA]`

---

## 5. Pesanan (`[RENCANA]`)

### 5.1 Buat Pesanan (Checkout)
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/orders`
- **Deskripsi:** Membuat pesanan baru dari `ebookIds`; harga satuan & `totalAmount` dihitung backend dari `Ebook.price`.
- **Authentication:** Wajib (Bearer Token)
- **Authorization:** `CUSTOMER`
- **Request Parameters:** Tidak ada
- **Request Body:** `{ "ebookIds": ["uuid"] }` *(min 1 UUID, tanpa field harga dari klien)*
- **Response Sukses:** `{ "success": true, "data": { "id": "uuid", "orderNumber": "ORD-DATA-SIMULASI-001", "totalAmount": "75000.00", "status": "PENDING" } }`
- **HTTP Status Code:** `201 Created`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `409 Conflict`
- **Error Handling:** `VALIDATION_ERROR`, `NOT_FOUND` (e-book nonaktif/tidak ada), `CONFLICT` (sudah punya `EbookAccess` aktif atau duplikasi item).
- **Status:** `[RENCANA]`

### 5.2 Daftar Pesanan Saya
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/orders/me`
- **Deskripsi:** Mengambil daftar pesanan milik Pelanggan aktif (`req.user.id`).
- **Authentication:** Wajib (Bearer Token)
- **Authorization:** `CUSTOMER`
- **Request Parameters:** Query Zod: `status?` (`OrderStatus`), `page?` (`>= 1`), `limit?` (`1–100`).
- **Request Body:** Tidak ada
- **Response Sukses:** `{ "success": true, "data": [], "meta": { "page": 1, "limit": 20, "total": 0, "totalPages": 0 } }`
- **HTTP Status Code:** `200 OK`, `401 Unauthorized`
- **Error Handling:** Selalu memfilter `userId = req.user.id`.
- **Status:** `[RENCANA]`

### 5.3 Detail Pesanan Saya
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/orders/:id`
- **Deskripsi:** Mengambil detail satu pesanan beserta `OrderItem` milik Pelanggan aktif.
- **Authentication:** Wajib (Bearer Token)
- **Authorization:** `CUSTOMER` (pemilik pesanan)
- **Request Parameters:** Path `:id` (UUID)
- **Request Body:** Tidak ada
- **Response Sukses:** `{ "success": true, "data": { "id": "uuid", "orderNumber": "ORD-DATA-SIMULASI-001", "totalAmount": "75000.00", "status": "PENDING", "items": [] } }`
- **HTTP Status Code:** `200 OK`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`
- **Error Handling:** `FORBIDDEN` bila `order.userId !== req.user.id` (anti-IDOR).
- **Status:** `[RENCANA]`

---

## 6. Pembayaran & Webhook (`[RENCANA]`)

### 6.1 Inisiasi Pembayaran
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/payments`
- **Deskripsi:** Membuat rekaman pembayaran dan sesi payment gateway untuk pesanan `PENDING`.
- **Authentication:** Wajib (Bearer Token)
- **Authorization:** `CUSTOMER` (pemilik pesanan)
- **Request Parameters:** Tidak ada
- **Request Body:** `{ "orderId": "uuid", "paymentMethod": "QRIS" }`
- **Response Sukses:** `{ "success": true, "data": { "id": "uuid", "paymentMethod": "QRIS", "amount": "75000.00", "status": "PENDING" } }`
- **HTTP Status Code:** `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `409 Conflict`
- **Error Handling:** `FORBIDDEN` (bukan pemilik), `ORDER_EXPIRED` / `CONFLICT` (status order bukan `PENDING`).
- **Status:** `[RENCANA]`

### 6.2 Cek Status Pembayaran
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/payments/:id`
- **Deskripsi:** Mengambil status pembayaran terbaru milik Pelanggan.
- **Authentication:** Wajib (Bearer Token)
- **Authorization:** `CUSTOMER` (pemilik pembayaran)
- **Request Parameters:** Path `:id` (UUID)
- **Request Body:** Tidak ada
- **Response Sukses:** `{ "success": true, "data": { "id": "uuid", "paymentMethod": "QRIS", "amount": "75000.00", "status": "VERIFIED" } }`
- **HTTP Status Code:** `200 OK`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`
- **Error Handling:** `FORBIDDEN` bila bukan milik `req.user.id`.
- **Status:** `[RENCANA]`

### 6.3 Webhook Payment Gateway
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/payments/webhook`
- **Deskripsi:** Menerima notifikasi resmi payment gateway, memverifikasi signature, mengecek nominal & *idempotency*, serta mengeksekusi transaksi atomik `prisma.$transaction`.
- **Authentication:** Verifikasi Header Signature (`X-Webhook-Signature`), tanpa JWT
- **Authorization:** `PAYMENT_GATEWAY`
- **Request Parameters:** Tidak ada
- **Request Body:** `{ "externalRef": "DATA-SIMULASI-GW-001", "status": "VERIFIED", "amount": "75000.00" }`
- **Response Sukses:** `{ "success": true, "message": "Webhook berhasil diproses" }`
- **HTTP Status Code:** `200 OK`, `400 Bad Request`, `401 Unauthorized`, `500 Internal Server Error`
- **Error Handling:** `WEBHOOK_SIGNATURE_INVALID` (`401`), `PAYMENT_VERIFICATION_FAILED` (`400`), `DUPLICATE_WEBHOOK` (`200`).
- **Status:** `[RENCANA]`

---

## 7. Akses E-Book (`[RENCANA]`)

### 7.1 Minta Signed URL Baca PDF
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/ebooks/:id/access-url`
- **Deskripsi:** Memverifikasi `EbookAccess` aktif (`!isRevoked`) lalu menerbitkan *signed URL* sementara untuk file PDF di bucket privat.
- **Authentication:** Wajib (Bearer Token)
- **Authorization:** `CUSTOMER` (pemilik `EbookAccess` aktif)
- **Request Parameters:** Path `:id` (UUID e-book)
- **Request Body:** Tidak ada
- **Response Sukses:** `{ "success": true, "data": { "signedUrl": "https://api.example.com/signed-pdf-simulasi", "expiresInSeconds": 300 } }`
- **HTTP Status Code:** `200 OK`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Internal Server Error`
- **Error Handling:** `EBOOK_ACCESS_DENIED` (`403`), `SIGNED_URL_GENERATION_FAILED` (`500`).
- **Status:** `[RENCANA]`

---

## 8. Transaksi Pelanggan (`[RENCANA]`)

### 8.1 Riwayat Pembelian Pelanggan
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/transactions/my` *(lihat catatan sinkronisasi `api-spec.yaml` pada [`api-gap-register.md`](./api-gap-register.md))*
- **Deskripsi:** Mengambil riwayat transaksi keuangan resmi milik Pelanggan aktif.
- **Authentication:** Wajib (Bearer Token)
- **Authorization:** `CUSTOMER`
- **Request Parameters:** Query Zod: `startDate?`, `endDate?`, `page?`, `limit?`.
- **Request Body:** Tidak ada
- **Response Sukses:** `{ "success": true, "data": [{ "id": "uuid", "transactionCode": "TRX-DATA-SIMULASI-001", "amount": "75000.00" }], "meta": { "page": 1, "limit": 20, "total": 1, "totalPages": 1 } }`
- **HTTP Status Code:** `200 OK`, `400 Bad Request`, `401 Unauthorized`
- **Error Handling:** Filter ketat `userId = req.user.id`.
- **Status:** `[RENCANA]`

---

## 9. Admin — Dashboard (`[ADA]` `/ping` & `[RENCANA]` `/dashboard`)

### 9.1 Uji Otorisasi Admin (`Ping`)
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/admin/ping`
- **Deskripsi:** Menguji middleware `authenticate` dan `authorize('ADMIN')`.
- **Authentication:** Wajib (Bearer Token)
- **Authorization:** `ADMIN`
- **Request Parameters:** Tidak ada
- **Request Body:** Tidak ada
- **Response Sukses:** `{ "success": true, "data": { "status": "ok", "role": "ADMIN" } }`
- **HTTP Status Code:** `200 OK`, `401 Unauthorized`, `403 Forbidden`
- **Error Handling:** `UNAUTHORIZED` (`401`), `FORBIDDEN` (`403`).
- **Status:** `[ADA]` (terimplementasi di [`app.ts`](../../backend/src/app.ts))

### 9.2 Ringkasan Statistik Dashboard Admin
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/admin/dashboard`
- **Deskripsi:** Mengembalikan ringkasan metrik pendapatan, total pesanan, e-book aktif, pelanggan aktif, dan e-book terlaris dari database nyata.
- **Authentication:** Wajib (Bearer Token)
- **Authorization:** `ADMIN`
- **Request Parameters:** Tidak ada
- **Request Body:** Tidak ada
- **Response Sukses:** `{ "success": true, "data": { "totalRevenue": "0.00", "totalOrders": 0, "activeEbooks": 0, "activeCustomers": 0, "topEbooks": [] } }`
- **HTTP Status Code:** `200 OK`, `401 Unauthorized`, `403 Forbidden`
- **Error Handling:** Tolak non-Admin dengan `403 FORBIDDEN`.
- **Status:** `[RENCANA]`

---

## 10. Admin — Kategori (`[RENCANA]`)

### 10.1 Tambah Kategori
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/admin/categories`
- **Deskripsi:** Menambahkan kategori baru dengan `name` dan `slug` unik.
- **Authentication:** Wajib (Bearer Token)
- **Authorization:** `ADMIN`
- **Request Parameters:** Tidak ada
- **Request Body:** `{ "name": "DATA SIMULASI - Pemrograman", "slug": "pemrograman", "description": "DATA SIMULASI" }`
- **Response Sukses:** `{ "success": true, "data": { "id": "uuid", "name": "DATA SIMULASI - Pemrograman", "slug": "pemrograman" } }`
- **HTTP Status Code:** `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `409 Conflict`
- **Error Handling:** `CONFLICT` bila nama/slug sudah ada.
- **Status:** `[RENCANA]`

### 10.2 Perbarui & Hapus Kategori
- **HTTP Method:** `PATCH` / `DELETE`
- **Endpoint:** `/api/v1/admin/categories/:id`
- **Deskripsi:** Memperbarui metadata kategori atau menghapus kategori yang belum memiliki e-book.
- **Authentication:** Wajib (Bearer Token)
- **Authorization:** `ADMIN`
- **Request Parameters:** Path `:id` (UUID)
- **Request Body:** (`PATCH`) `{ "name"?: "string", "slug"?: "string", "isActive"?: true }`
- **Response Sukses:** `200 OK` / `204 No Content`
- **HTTP Status Code:** `200 OK`, `204 No Content`, `400 Bad Request`, `403 Forbidden`, `404 Not Found`, `409 Conflict`
- **Error Handling:** Tolak `DELETE` dengan `409 CONFLICT` jika kategori masih dipakai e-book (`onDelete: Restrict`).
- **Status:** `[RENCANA]`

---

## 11. Admin — E-Book (`[RENCANA]`)

### 11.1 Tambah E-Book & Unggah PDF Privat
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/admin/ebooks`
- **Deskripsi:** Menambah data e-book baru sekaligus mengunggah `pdfFile` ke bucket privat dan opsional `coverImage`.
- **Authentication:** Wajib (Bearer Token)
- **Authorization:** `ADMIN`
- **Request Parameters:** Tidak ada
- **Request Body:** `multipart/form-data` (`categoryId`, `title`, `author`, `description`, `price`, `pdfFile`, `coverImage?`)
- **Response Sukses:** `{ "success": true, "data": { "id": "uuid", "title": "DATA SIMULASI", "price": "50000.00", "isActive": true } }`
- **HTTP Status Code:** `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`
- **Error Handling:** Validasi mime-type PDF, harga `>= 0`, dan keberadaan `categoryId`.
- **Status:** `[RENCANA]`

### 11.2 Perbarui & Arsipkan E-Book
- **HTTP Method:** `PATCH` / `DELETE`
- **Endpoint:** `/api/v1/admin/ebooks/:id`
- **Deskripsi:** Memperbarui metadata/harga/status (`PATCH`) atau mengarsipkan e-book (`DELETE` → soft delete `isActive = false`).
- **Authentication:** Wajib (Bearer Token)
- **Authorization:** `ADMIN`
- **Request Parameters:** Path `:id` (UUID)
- **Request Body:** (`PATCH`) `{ "title"?: "string", "price"?: "50000.00", "isActive"?: false }`
- **Response Sukses:** `200 OK` / `204 No Content`
- **HTTP Status Code:** `200 OK`, `204 No Content`, `400 Bad Request`, `403 Forbidden`, `404 Not Found`
- **Error Handling:** Non-hard-delete agar `OrderItem` dan `EbookAccess` historis tetap utuh.
- **Status:** `[RENCANA]`

---

## 12. Admin — Pelanggan, Pesanan, Pembayaran, Transaksi & Laporan (`[RENCANA]`)

| No | Nama Endpoint | Method | Endpoint | Query / Path | Auth & Role | Status |
| :---: | :--- | :---: | :--- | :--- | :--- | :--- |
| **12.1** | Daftar Pelanggan | `GET` | `/api/v1/admin/customers` | Query: `page`, `limit`, `search` | Bearer + `ADMIN` | `[RENCANA]` |
| **12.2** | Detail Pelanggan + Ringkasan | `GET` | `/api/v1/admin/customers/:id` | Path: `:id` (UUID) | Bearer + `ADMIN` | `[RENCANA]` |
| **13.1** | Daftar Seluruh Pesanan | `GET` | `/api/v1/admin/orders` | Query: `status`, `startDate`, `endDate`, `page`, `limit` | Bearer + `ADMIN` | `[RENCANA]` |
| **13.2** | Detail Pesanan Lengkap | `GET` | `/api/v1/admin/orders/:id` | Path: `:id` (UUID) | Bearer + `ADMIN` | `[RENCANA]` |
| **14.1** | Daftar Pembayaran | `GET` | `/api/v1/admin/payments` | Query: `page`, `limit` | Bearer + `ADMIN` | `[RENCANA]` |
| **15.1** | Daftar Transaksi Resmi | `GET` | `/api/v1/admin/transactions` | Query: `startDate`, `endDate`, `page`, `limit` | Bearer + `ADMIN` | `[RENCANA]` |
| **16.1** | Laporan Penjualan Periodik | `GET` | `/api/v1/admin/reports/sales` | Query: `startDate`, `endDate`, `groupBy` (`day\|month`) | Bearer + `ADMIN` | `[RENCANA]` |

*(Seluruh endpoint pada bagian 12–16 memvalidasi UUID/query dengan Zod, mengembalikan format paginasi standar bila berupa daftar, dan menolak non-`ADMIN` dengan `403 FORBIDDEN`.)*

---

## 13. Admin — Konfigurasi SAW & Kontrol `EbookAccess` (`[RENCANA]`)

### 13.1 Lihat & Perbarui Bobot Kriteria SAW
- **HTTP Method:** `GET` / `PUT`
- **Endpoint:** `/api/v1/admin/saw/weights`
- **Deskripsi:** Melihat bobot kriteria SAW aktif (`GET`) atau mengganti seluruh konfigurasi bobot (`PUT`, menunggu Keputusan #5 & #9).
- **Authentication:** Wajib (Bearer Token)
- **Authorization:** `ADMIN`
- **Request Parameters:** Tidak ada
- **Request Body (`PUT`):** `{ "weights": [{ "criterion": "price", "weight": 0.40 }, { "criterion": "ratingAvg", "weight": 0.35 }, { "criterion": "salesCount", "weight": 0.25 }] }` *(`DATA SIMULASI`)*
- **Response Sukses:** `{ "success": true, "data": { "weights": [] } }`
- **HTTP Status Code:** `200 OK`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`
- **Error Handling:** `SAW_CONFIGURATION_INVALID` bila ada bobot `<= 0` atau `Σ != 1.0`.
- **Status:** `[RENCANA]`

### 13.2 Cabut / Pulihkan Hak Akses E-Book
- **HTTP Method:** `PATCH`
- **Endpoint:** `/api/v1/admin/accesses/:id`
- **Deskripsi:** Mengubah status `EbookAccess.isRevoked` menjadi `true` (cabut) atau `false` (pulihkan).
- **Authentication:** Wajib (Bearer Token)
- **Authorization:** `ADMIN`
- **Request Parameters:** Path `:id` (UUID `EbookAccess`)
- **Request Body:** `{ "isRevoked": true }`
- **Response Sukses:** `{ "success": true, "data": { "id": "uuid", "isRevoked": true } }`
- **HTTP Status Code:** `200 OK`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`
- **Error Handling:** `NOT_FOUND` bila ID `EbookAccess` tidak ditemukan.
- **Status:** `[RENCANA]`
