# Activity Diagram

**Status:** `[RENCANA]` — Seluruh alur proses bisnis di bawah ini merupakan rancangan implementasi. Komponen yang sudah `[ADA]` baru sebatas middleware kerangka (`validate`, `auth.middleware`, `error.middleware`) dan `/api/v1/health` di `backend/`.

Dokumen ini menyajikan **10 diagram aktivitas** dalam Mermaid beserta penjelasan titik validasi, autentikasi, otorisasi, transaksi database, dan penanganan kegagalan.

> **Keterangan Singkatan:** **JWT** = *JSON Web Token*; **RBAC** = *Role-Based Access Control*; **SAW** = *Simple Additive Weighting*; **URL** = *Uniform Resource Locator*; **PDF** = *Portable Document Format*; **TTL** = *Time-to-Live*.

---

## 1. Registrasi dan Login (Supabase Auth + Sinkronisasi Backend) `[RENCANA]`

**Deskripsi:** Alur pendaftaran/masuk melalui Supabase Auth pada klien (`mobile/ebook_store`, `pengunjung-web`, atau `admin-web`), dilanjutkan verifikasi token JWT oleh backend Express dan sinkronisasi record `User`.

```mermaid
flowchart TD
    A(["Mulai"]) --> B["Pengguna isi email & password di klien"]
    B --> C["Klien kirim permintaan ke Supabase Auth"]
    C --> D{"Kredensial valid di Supabase Auth?"}
    D -- "Tidak" --> E["Supabase tolak -> Klien tampilkan pesan error generik"]
    E --> Z(["Selesai"])
    D -- "Ya" --> F["Supabase kembalikan Access Token (JWT)"]
    F --> G["Klien panggil endpoint backend + Bearer Token"]
    G --> H{"Backend verifikasi JWT Supabase valid?"}
    H -- "Tidak (401)" --> I["Backend tolak 401 Unauthorized -> Klien arahkan login ulang"]
    I --> Z
    H -- "Ya" --> J["Backend cek/sinkronkan record di tabel users (supabaseUserId)"]
    J --> K{"Akun isActive == true?"}
    K -- "Tidak (403)" --> L["Backend tolak 403 Forbidden (Akun Nonaktif)"]
    L --> Z
    K -- "Ya" --> M["Sesi aktif siap digunakan sesuai role (CUSTOMER / ADMIN)"]
    M --> Z
```

- **Titik Validasi & Auth:** Klien tidak langsung mengakses tabel `users`. JWT diverifikasi di middleware backend sebelum controller dijalankan.
- **Penanganan Kegagalan:** Error autentikasi tidak membocorkan keberadaan email (`401` generik); akun nonaktif (`isActive = false`) ditolak dengan `403`.

---

## 2. Jelajah Katalog, Pencarian, dan Filter Kategori `[RENCANA]`

**Deskripsi:** Alur penjelajahan katalog publik e-book aktif dengan validasi parameter kueri oleh Zod.

```mermaid
flowchart TD
    A(["Mulai"]) --> B["Pengguna buka katalog / masukkan kata kunci / pilih kategori"]
    B --> C["Klien kirim GET /api/v1/ebooks (search, categoryId, page, limit)"]
    C --> D{"Validasi query Zod di backend lolos?"}
    D -- "Tidak (400)" --> E["Backend kembalikan 400 Bad Request"]
    E --> Z(["Selesai"])
    D -- "Ya" --> F["Backend kueri tabel ebooks (isActive = true) + join Category"]
    F --> G["Backend terapkan filter search/categoryId & pagination"]
    G --> H["Backend kembalikan daftar metadata (tanpa storagePath)"]
    H --> I["Klien tampilkan daftar e-book atau empty state"]
    I --> Z
```

- **Titik Validasi & Keamanan:** Parameter paginasi/filter divalidasi dengan Zod. Kolom `storagePath` tidak pernah disertakan pada respons katalog publik.

---

## 3. Rekomendasi E-Book Berbasis SAW (Backend-Only) `[RENCANA]`

**Deskripsi:** Perhitungan rekomendasi e-book menggunakan metode SAW yang dijalankan sepenuhnya di backend ([ADR-0002](../adr/0002-backend-only-saw.md)).

```mermaid
flowchart TD
    A(["Mulai"]) --> B["Klien minta rekomendasi e-book ke backend"]
    B --> C["Backend terima request (abaikan/tolak bobot liar dari klien)"]
    C --> D["Backend ambil konfigurasi bobot aktif dari database"]
    D --> E{"Total bobot == 1.0 dan valid?"}
    E -- "Tidak" --> F["Backend hentikan proses -> 500/422 Config Error + log audit"]
    F --> Z(["Selesai"])
    E -- "Ya" --> G["Backend ambil daftar Ebook aktif (isActive = true)"]
    G --> H{"Ada kandidat e-book?"}
    H -- "Tidak" --> I["Kembalikan daftar kosong []"]
    I --> Z
    H -- "Ya" --> J["Normalisasi Benefit/Cost (tangani pembagi nol -> 0)"]
    J --> K["Hitung nilai preferensi V_i = Sum(w_j * r_ij) dengan presisi penuh"]
    K --> L["Urutkan V_i menurun + tie-breaker judul A-Z"]
    L --> M["(Opsional Keputusan #11) Simpan snapshot hasil SAW"]
    M --> N["Backend kembalikan peringkat & skor SAW ke klien"]
    N --> Z
```

- **Titik Validasi:** Klien dilarang mengirim bobot arbitrer. Pembagi nol (`max = 0` atau `x_ij = 0`) ditangani aman tanpa `NaN`/`Infinity`.

---

## 4. Checkout Pesanan `[RENCANA]`

**Deskripsi:** Pembuatan `Order` dan `OrderItem` dari daftar ID e-book dengan penguncian harga dari database (*snapshot*).

```mermaid
flowchart TD
    A(["Mulai"]) --> B["Pelanggan pilih e-book & tekan Checkout"]
    B --> C["Klien kirim POST /api/v1/orders (ebookIds) + Bearer Token"]
    C --> D{"Token valid & role CUSTOMER?"}
    D -- "Tidak (401/403)" --> E["Backend tolak permintaan"]
    E --> Z(["Selesai"])
    D -- "Ya" --> F{"Validasi Zod (ebookIds non-empty UUID) lolos?"}
    F -- "Tidak (400)" --> E
    F -- "Ya" --> G["Backend cek seluruh e-book ada & isActive == true"]
    G --> H{"Semua e-book tersedia?"}
    H -- "Tidak (404/400)" --> E
    H -- "Ya" --> I["Cek apakah user sudah punya EbookAccess aktif (!isRevoked)"]
    I --> J{"Sudah dimiliki?"}
    J -- "Ya (409)" --> K["Backend tolak 409 Conflict (E-book sudah dimiliki)"]
    K --> Z
    J -- "Tidak" --> L["Transaksi DB: hitung totalAmount dari Ebook.price, buat Order (PENDING) + OrderItem (unitPrice snapshot) + expiresAt"]
    L --> M["Backend kembalikan detail Order (PENDING)"]
    M --> Z
```

- **Transaksi DB & Integritas:** `totalAmount` dan `unitPrice` selalu diambil dari database, bukan dari payload klien.

---

## 5. Pembayaran Melalui Payment Gateway `[RENCANA]`

**Deskripsi:** Inisiasi pembayaran atas `Order` yang masih berstatus `PENDING` melalui integrasi payment gateway nyata (Keputusan #3 `[ADA]`).

```mermaid
flowchart TD
    A(["Mulai"]) --> B["Pelanggan pilih metode bayar untuk Order PENDING"]
    B --> C["Klien kirim POST /api/v1/payments (orderId, paymentMethod) + Bearer Token"]
    C --> D{"Order milik user & status == PENDING & belum kedaluwarsa?"}
    D -- "Tidak (403/404/409)" --> E["Backend tolak inisiasi pembayaran"]
    E --> Z(["Selesai"])
    D -- "Ya" --> F["Backend panggil API Payment Gateway untuk buat transaksi pembayaran"]
    F --> G{"Payment Gateway merespons sukses?"}
    G -- "Tidak" --> H["Backend log error & kembalikan 502/503 ke klien"]
    H --> Z
    G -- "Ya" --> I["Simpan record Payment (status PENDING, externalRef) di DB"]
    I --> J["Kembalikan token/URL/instruksi pembayaran ke klien"]
    J --> K["Klien arahkan pelanggan menyelesaikan pembayaran"]
    K --> Z
```

---

## 6. Webhook Pembayaran yang Idempoten `[RENCANA]`

**Deskripsi:** Penerimaan notifikasi status pembayaran dari Payment Gateway secara aman dan idempoten.

```mermaid
flowchart TD
    A(["Mulai"]) --> B["Payment Gateway kirim POST Webhook ke Backend"]
    B --> C{"Signature Webhook valid?"}
    C -- "Tidak (401/403)" --> D["Tolak & catat log keamanan"]
    D --> Z(["Selesai"])
    C -- "Ya" --> E["Cari record Payment berdasarkan externalRef / orderId"]
    E --> F{"Payment ditemukan & nominal cocok?"}
    F -- "Tidak" --> G["Catat log anomali & balas status penolakan/404"]
    G --> Z
    F -- "Ya" --> H{"Status Payment sudah final (VERIFIED/FAILED/EXPIRED)?"}
    H -- "Ya (Idempoten)" --> I["Abaikan mutasi ulang -> Kembalikan 200 OK (Idempotent)"]
    I --> Z
    H -- "Tidak (Masih PENDING)" --> J{"Status dari gateway sukses/settlement?"}
    J -- "Gagal / Expired" --> K["Update Payment (FAILED/EXPIRED) & Order (FAILED/EXPIRED)"]
    K --> L["Balas 200 OK ke Gateway"]
    L --> Z
    J -- "Sukses (VERIFIED)" --> M["Jalankan Alur 7: Transaksi Atomik Penerbitan Akses"]
    M --> L
```

- **Keamanan & Idempotensi:** Verifikasi *signature* wajib dilakukan sebelum membaca/mengubah data. Pengiriman ulang webhook untuk `Payment` yang sudah `VERIFIED` tidak menggandakan `Transaction` maupun `EbookAccess`.

---

## 7. Penerbitan Akses E-Book (Transaksi Atomik Database) `[RENCANA]`

**Deskripsi:** Proses atomik (`prisma.$transaction`) yang dipicu saat pembayaran terverifikasi `VERIFIED`.

```mermaid
flowchart TD
    A(["Dipicu oleh Webhook VERIFIED"]) --> B["Mulai prisma.$transaction"]
    B --> C["Update Payment.status = VERIFIED & paidAt = now()"]
    C --> D["Update Order.status = PAID"]
    D --> E["Buat record Transaction (orderId, paymentId, transactionCode, amount)"]
    E --> F["Untuk setiap OrderItem: upsert EbookAccess (userId, ebookId, orderId, isRevoked = false)"]
    F --> G["Increment Ebook.salesCount (+1) untuk tiap e-book terjual"]
    G --> H{"Seluruh operasi DB berhasil?"}
    H -- "Ya" --> I["Commit transaksi DB -> Hak akses aktif"]
    I --> Z(["Selesai"])
    H -- "Tidak" --> J["Rollback seluruh perubahan DB -> Log error kritis untuk retry"]
    J --> Z
```

- **Integritas Data:** Jika salah satu langkah gagal (mis. pembuatan `EbookAccess`), seluruh transaksi di-rollback sehingga tidak pernah terjadi kondisi pembayaran lunas tanpa hak akses.

---

## 8. Permintaan Signed URL dan Pembacaan PDF Dalam Aplikasi `[RENCANA]`

**Deskripsi:** Alur akses konten PDF dari Supabase Storage bucket **privat** melalui *signed URL* sementara untuk dibaca di *in-app PDF reader* (Keputusan #4 `[ADA]`).

```mermaid
flowchart TD
    A(["Mulai"]) --> B["Pelanggan klik Baca E-Book di aplikasi"]
    B --> C["Klien kirim GET /api/v1/ebooks/:id/access + Bearer Token"]
    C --> D{"JWT valid?"}
    D -- "Tidak (401)" --> E["Tolak 401 Unauthorized"]
    E --> Z(["Selesai"])
    D -- "Ya" --> F["Backend cek EbookAccess untuk (userId, ebookId)"]
    F --> G{"EbookAccess ada & isRevoked == false?"}
    G -- "Tidak (403)" --> H["Tolak 403 Forbidden (Belum membeli / akses dicabut)"]
    H --> Z
    G -- "Ya" --> I["Backend ambil storagePath dari tabel Ebook (isActive tidak wajib memblokir pembeli lama)"]
    I --> J["Backend panggil Supabase Storage API (Service Role) buat Signed URL (TTL singkat)"]
    J --> K{"Signed URL berhasil dibuat?"}
    K -- "Tidak (500)" --> L["Catat error storage & kembalikan 500"]
    L --> Z
    K -- "Ya" --> M["Backend kirim signedUrl & expiresInSeconds ke klien"]
    M --> N["In-App PDF Reader muat PDF dari signedUrl (tanpa tombol ekspor publik)"]
    N --> Z
```

---

## 9. Admin Mengelola Kategori dan E-Book `[RENCANA]`

**Deskripsi:** Alur pengelolaan master data katalog dan unggah file PDF ke bucket privat oleh Admin melalui `web/admin-web`.

```mermaid
flowchart TD
    A(["Mulai"]) --> B["Admin buka menu Kategori / Katalog di Admin Web"]
    B --> C["Admin isi form & unggah file PDF/sampul -> kirim ke Backend + Bearer Token"]
    C --> D{"JWT valid & role == ADMIN?"}
    D -- "Tidak (401/403)" --> E["Backend tolak akses (401/403)"]
    E --> Z(["Selesai"])
    D -- "Ya" --> F{"Validasi Zod & tipe/ukuran file PDF lolos?"}
    F -- "Tidak (400)" --> G["Backend kembalikan 400 Validation Error"]
    G --> Z
    F -- "Ya" --> H{"Operasi melibatkan file PDF baru?"}
    H -- "Ya" --> I["Backend unggah PDF ke Supabase Storage bucket privat -> dapat storagePath"]
    I --> J["Simpan/Update metadata Category atau Ebook di PostgreSQL"]
    H -- "Tidak" --> J
    J --> K{"Operasi hapus pada data yang masih berelasi?"}
    K -- "Ya" --> L["Tolak hard delete (409) atau lakukan soft-archive (isActive = false)"]
    L --> Z
    K -- "Tidak" --> M["Kembalikan 200/201 Sukses ke Admin Web"]
    M --> Z
```

---

## 10. Admin Mengubah Konfigurasi Bobot SAW `[RENCANA]`

**Deskripsi:** Alur pembaruan bobot kriteria SAW oleh Admin dengan validasi ketat sebelum digunakan pada perhitungan rekomendasi.

```mermaid
flowchart TD
    A(["Mulai"]) --> B["Admin buka menu Konfigurasi SAW di Admin Web"]
    B --> C["Admin ubah bobot kriteria & simpan -> kirim ke Backend + Bearer Token"]
    C --> D{"JWT valid & role == ADMIN?"}
    D -- "Tidak (401/403)" --> E["Backend tolak (401/403)"]
    E --> Z(["Selesai"])
    D -- "Ya" --> F{"Validasi Zod: semua bobot > 0 dan Sum(bobot) == 1.0?"}
    F -- "Tidak (400)" --> G["Backend tolak 400 Bad Request (Total bobot harus 1.0)"]
    G --> Z
    F -- "Ya" --> H["Transaksi DB: simpan konfigurasi bobot baru + catat log/riwayat perubahan"]
    H --> I["Kembalikan 200 OK & pratinjau peringkat SAW terbaru ke Admin Web"]
    I --> Z
```
