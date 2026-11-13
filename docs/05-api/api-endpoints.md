# Rancangan Endpoint API (`Proposed API Design`)

**Status:** `[NOT AVAILABLE]` (belum ada implementasi di `backend/`) | `[PROPOSED]` (rancangan API yang diusulkan)

> **Catatan Penting:** Tidak satu pun endpoint di bawah ini sudah tersedia secara aktual di kode sumber. Daftar ini adalah **Proposed API Design** sebagai acuan implementasi backend.

---

## 1. Authentication

### 1.1 Registrasi Pelanggan
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/auth/register`
- **Deskripsi:** Mendaftarkan akun pelanggan baru.
- **Authentication:** Tidak diperlukan
- **Authorization:** Publik
- **Request Parameters:** Tidak ada
- **Request Body:** `{ "fullName": "string", "email": "string", "password": "string", "phone": "string?" }`
- **Response:** `{ "success": true, "data": { "id": "uuid", "fullName": "string", "email": "string", "role": "CUSTOMER" } }`
- **HTTP Status Code:** `201 Created`, `400 Bad Request`, `409 Conflict`
- **Error Handling:** Tolak email duplikat (`409`) dan password lemah (`400`); jangan pernah mengembalikan `password_hash`.

### 1.2 Login (Pelanggan & Admin)
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/auth/login`
- **Deskripsi:** Mengautentikasi pengguna dan menerbitkan token akses.
- **Authentication:** Tidak diperlukan
- **Authorization:** Publik
- **Request Parameters:** Tidak ada
- **Request Body:** `{ "email": "string", "password": "string" }`
- **Response:** `{ "success": true, "data": { "accessToken": "jwt", "user": { "id": "uuid", "role": "CUSTOMER|ADMIN" } } }`
- **HTTP Status Code:** `200 OK`, `400 Bad Request`, `401 Unauthorized`
- **Error Handling:** Pesan error login generik (*"Email atau password salah"*) agar tidak membocorkan keberadaan akun.

---

## 2. Users

### 2.1 Lihat Profil Pengguna Aktif
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/users/me`
- **Deskripsi:** Mengambil profil pengguna yang sedang login.
- **Authentication:** Wajib (Bearer Token)
- **Authorization:** `CUSTOMER` atau `ADMIN`
- **Request Parameters:** Tidak ada
- **Request Body:** Tidak ada
- **Response:** `{ "success": true, "data": { "id": "uuid", "fullName": "string", "email": "string", "role": "string" } }`
- **HTTP Status Code:** `200 OK`, `401 Unauthorized`
- **Error Handling:** Tolak jika token tidak valid/kedaluwarsa.

### 2.2 Daftar Pelanggan (Admin)
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/admin/customers`
- **Deskripsi:** Menampilkan daftar pelanggan untuk pemantauan admin.
- **Authentication:** Wajib (Bearer Token)
- **Authorization:** `ADMIN`
- **Request Parameters:** Query opsional: `page`, `limit`, `search`
- **Request Body:** Tidak ada
- **Response:** `{ "success": true, "data": { "items": [], "meta": { "total": 0, "page": 1 } } }`
- **HTTP Status Code:** `200 OK`, `401 Unauthorized`, `403 Forbidden`
- **Error Handling:** Kembalikan `403` jika role bukan `ADMIN`.

---

## 3. Categories

### 3.1 Daftar Kategori
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/categories`
- **Deskripsi:** Mengambil seluruh kategori e-book yang tersedia.
- **Authentication:** Tidak diperlukan
- **Authorization:** Publik
- **Request Parameters:** Tidak ada
- **Request Body:** Tidak ada
- **Response:** `{ "success": true, "data": [{ "id": "uuid", "name": "string", "slug": "string" }] }`
- **HTTP Status Code:** `200 OK`
- **Error Handling:** Kembalikan array kosong jika belum ada kategori.

### 3.2 Kelola Kategori (Tambah / Ubah / Hapus)
- **HTTP Method:** `POST` / `PATCH` / `DELETE`
- **Endpoint:** `/api/v1/admin/categories` dan `/api/v1/admin/categories/:id`
- **Deskripsi:** Menambah, memperbarui, atau menghapus kategori.
- **Authentication:** Wajib (Bearer Token)
- **Authorization:** `ADMIN`
- **Request Parameters:** Path `:id` (UUID) untuk `PATCH`/`DELETE`
- **Request Body:** `{ "name": "string", "slug": "string", "description": "string?" }`
- **Response:** `{ "success": true, "data": { "id": "uuid", "name": "string" } }`
- **HTTP Status Code:** `200 OK`, `201 Created`, `400 Bad Request`, `403 Forbidden`, `404 Not Found`, `409 Conflict`
- **Error Handling:** Tolak penghapusan kategori yang masih dipakai oleh e-book (`409`).

---

## 4. E-Books & Rekomendasi SAW

### 4.1 Daftar & Pencarian E-Book
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/ebooks`
- **Deskripsi:** Mengambil katalog e-book aktif dengan filter pencarian dan kategori.
- **Authentication:** Tidak diperlukan
- **Authorization:** Publik
- **Request Parameters:** Query opsional: `search`, `categoryId`, `page`, `limit`
- **Request Body:** Tidak ada
- **Response:** `{ "success": true, "data": { "items": [], "meta": {} } }`
- **HTTP Status Code:** `200 OK`, `400 Bad Request`
- **Error Handling:** Validasi tipe parameter paginasi via Zod.

### 4.2 Detail E-Book
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/ebooks/:id`
- **Deskripsi:** Menampilkan informasi detail e-book (judul, penulis, kategori, deskripsi, harga).
- **Authentication:** Tidak diperlukan
- **Authorization:** Publik
- **Request Parameters:** Path `:id` (UUID)
- **Request Body:** Tidak ada
- **Response:** `{ "success": true, "data": { "id": "uuid", "title": "string", "author": "string", "price": "decimal" } }`
- **HTTP Status Code:** `200 OK`, `404 Not Found`
- **Error Handling:** Jangan pernah menyertakan `storage_path` privat pada respons publik.

### 4.3 Rekomendasi E-Book (SPK Metode SAW)
- **HTTP Method:** `GET` *(atau `POST` jika mengirim preferensi yang diizinkan)*
- **Endpoint:** `/api/v1/ebooks/recommendations`
- **Deskripsi:** Menghitung dan mengembalikan peringkat rekomendasi e-book menggunakan metode SAW di backend (`[CONFIRMED]` backend-only).
- **Authentication:** Opsional / Wajib (`[ASSUMPTION]`)
- **Authorization:** `CUSTOMER` / Publik
- **Request Parameters:** Query filter opsional (`categoryId`, `limit`)
- **Request Body:** Tidak ada (bobot kriteria bersumber dari konfigurasi backend)
- **Response:** `{ "success": true, "data": [{ "ebookId": "uuid", "title": "string", "sawScore": 0.875, "rank": 1 }] }`
- **HTTP Status Code:** `200 OK`
- **Error Handling:** Abaikan atau tolak bobot tidak sah dari klien sesuai ADR-0002.

### 4.4 Kelola E-Book (Admin)
- **HTTP Method:** `POST` / `PATCH` / `DELETE`
- **Endpoint:** `/api/v1/admin/ebooks` dan `/api/v1/admin/ebooks/:id`
- **Deskripsi:** Menambah e-book, memperbarui metadata/harga, atau menonaktifkan (*soft delete*) e-book.
- **Authentication:** Wajib (Bearer Token)
- **Authorization:** `ADMIN`
- **Request Parameters:** Path `:id` (UUID) untuk `PATCH`/`DELETE`
- **Request Body:** `{ "categoryId": "uuid", "title": "string", "author": "string", "description": "string", "price": 50000 }`
- **Response:** `{ "success": true, "data": { "id": "uuid", "title": "string" } }`
- **HTTP Status Code:** `200 OK`, `201 Created`, `400 Bad Request`, `403 Forbidden`, `404 Not Found`
- **Error Handling:** Validasi harga `>= 0` dan keberadaan `categoryId`.

### 4.5 Akses Konten E-Book (Signed URL)
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/ebooks/:id/access`
- **Deskripsi:** Memverifikasi kepemilikan di `ebook_accesses` lalu mengembalikan *signed URL* sementara untuk file PDF di bucket privat.
- **Authentication:** Wajib (Bearer Token)
- **Authorization:** `CUSTOMER` (pemilik hak akses aktif)
- **Request Parameters:** Path `:id` (UUID e-book)
- **Request Body:** Tidak ada
- **Response:** `{ "success": true, "data": { "signedUrl": "https://...", "expiresInSeconds": 300 } }`
- **HTTP Status Code:** `200 OK`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`
- **Error Handling:** Kembalikan `403 Forbidden` jika pelanggan belum membeli atau akses dicabut (`is_revoked = true`).

---

## 5. Orders

### 5.1 Buat Pesanan
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/orders`
- **Deskripsi:** Membuat pesanan baru dari daftar `ebookIds`; harga dihitung di backend dari database.
- **Authentication:** Wajib (Bearer Token)
- **Authorization:** `CUSTOMER`
- **Request Parameters:** Tidak ada
- **Request Body:** `{ "ebookIds": ["uuid"] }`
- **Response:** `{ "success": true, "data": { "id": "uuid", "orderNumber": "string", "totalAmount": "decimal", "status": "PENDING" } }`
- **HTTP Status Code:** `201 Created`, `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `409 Conflict`
- **Error Handling:** Tolak jika daftar kosong, e-book tidak aktif, atau pelanggan sudah memiliki akses aktif atas e-book tersebut (`409`).

### 5.2 Daftar Pesanan Saya / Pantau Pesanan (Admin)
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/orders` (pelanggan) dan `/api/v1/admin/orders` (admin)
- **Deskripsi:** Melihat daftar pesanan milik pelanggan terkait atau seluruh pesanan oleh admin.
- **Authentication:** Wajib (Bearer Token)
- **Authorization:** `CUSTOMER` (milik sendiri) / `ADMIN` (semua)
- **Request Parameters:** Query opsional: `status`, `page`, `limit`
- **Request Body:** Tidak ada
- **Response:** `{ "success": true, "data": { "items": [], "meta": {} } }`
- **HTTP Status Code:** `200 OK`, `401 Unauthorized`, `403 Forbidden`
- **Error Handling:** Pastikan filter `customer_id = req.user.id` selalu diterapkan pada endpoint pelanggan.

---

## 6. Payments

### 6.1 Inisiasi / Kirim Pembayaran
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/payments`
- **Deskripsi:** Membuat catatan pembayaran untuk pesanan berstatus `PENDING`.
- **Authentication:** Wajib (Bearer Token)
- **Authorization:** `CUSTOMER` (pemilik pesanan)
- **Request Parameters:** Tidak ada
- **Request Body:** `{ "orderId": "uuid", "paymentMethod": "string" }`
- **Response:** `{ "success": true, "data": { "paymentId": "uuid", "status": "PENDING", "amount": "decimal" } }`
- **HTTP Status Code:** `201 Created`, `400 Bad Request`, `403 Forbidden`, `404 Not Found`, `409 Conflict`
- **Error Handling:** Tolak jika pesanan bukan milik pelanggan (`403`) atau pesanan tidak berstatus `PENDING` (`409`).

### 6.2 Verifikasi / Callback Pembayaran
- **HTTP Method:** `POST`
- **Endpoint:** `/api/v1/payments/:id/verify` *(atau webhook terverifikasi)*
- **Deskripsi:** Memverifikasi status pembayaran; jika valid, memperbarui `Order -> PAID`, mencatat `Transaction`, dan mengaktifkan `Ebook Access` secara atomik.
- **Authentication:** Wajib (Signature Webhook / Token Admin)
- **Authorization:** Sistem / `ADMIN`
- **Request Parameters:** Path `:id` (UUID payment)
- **Request Body:** `{ "status": "VERIFIED|FAILED", "externalRef": "string?" }`
- **Response:** `{ "success": true, "data": { "paymentId": "uuid", "orderStatus": "PAID" } }`
- **HTTP Status Code:** `200 OK`, `400 Bad Request`, `403 Forbidden`, `404 Not Found`
- **Error Handling:** Bersifat idempoten; verifikasi ulang pada pembayaran yang sudah `VERIFIED` tidak boleh menggandakan `Transaction` atau `Ebook Access`.

---

## 7. Transactions

### 7.1 Riwayat Pembelian Pelanggan & Daftar Transaksi Admin
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/transactions/my` (pelanggan) dan `/api/v1/admin/transactions` (admin)
- **Deskripsi:** Menampilkan transaksi final milik pelanggan (riwayat pembelian) atau seluruh transaksi sistem untuk admin.
- **Authentication:** Wajib (Bearer Token)
- **Authorization:** `CUSTOMER` / `ADMIN`
- **Request Parameters:** Query opsional: `startDate`, `endDate`, `page`, `limit`
- **Request Body:** Tidak ada
- **Response:** `{ "success": true, "data": { "items": [], "meta": {} } }`
- **HTTP Status Code:** `200 OK`, `401 Unauthorized`, `403 Forbidden`
- **Error Handling:** Validasi format rentang tanggal; batasi data hanya milik `req.user.id` untuk pelanggan.

---

## 8. Reports

### 8.1 Ringkasan Dashboard & Laporan Penjualan (Admin)
- **HTTP Method:** `GET`
- **Endpoint:** `/api/v1/admin/reports/sales`
- **Deskripsi:** Menyajikan agregasi total pendapatan, jumlah transaksi sukses, dan e-book terlaris berdasarkan periode.
- **Authentication:** Wajib (Bearer Token)
- **Authorization:** `ADMIN`
- **Request Parameters:** Query opsional: `startDate`, `endDate`, `groupBy` (`day|month`)
- **Request Body:** Tidak ada
- **Response:** `{ "success": true, "data": { "totalRevenue": "decimal", "totalOrders": 0, "topEbooks": [] } }`
- **HTTP Status Code:** `200 OK`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`
- **Error Handling:** Tolak non-admin (`403`) dan rentang tanggal terbalik (`400`).
