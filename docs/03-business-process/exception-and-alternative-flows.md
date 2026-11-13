# Alur Pengecualian dan Alternatif (`Exception and Alternative Flows`)

**Status:** `[ADA]` (mekanisme dasar `401`/`403`/`400`/`500` pada `auth.middleware.ts` & `error.middleware.ts`) | `[RENCANA]` (penanganan pengecualian bisnis, webhook, PDF privat, dan SAW)

Seluruh pesan untuk klien bersifat generik dan aman (tidak membocorkan query SQL, keberadaan email, *stack trace*, *secret*, maupun `storagePath`).

---

## Tabel Pengecualian & Kegagalan Lintas Proses

| ID | Proses | Kondisi | Dampak | Respons Sistem | Pesan untuk Klien | Status |
|---|---|---|---|---|---|---|
| **EX-01** | Auth / Semua Terproteksi | Token tidak ada atau tidak valid | Akses ditolak | `401` (`UNAUTHENTICATED` / `UNAUTHORIZED`) | `"Autentikasi diperlukan atau sesi telah kedaluwarsa."` | `[ADA]` mekanisme / `[RENCANA]` penyeragaman kode |
| **EX-02** | Admin / Kepemilikan | Role tidak memiliki akses (`CUSTOMER` ke `/admin/*` atau bukan pemilik resource) | Operasi diblokir | `403 FORBIDDEN` | `"Anda tidak memiliki hak akses untuk operasi ini."` | `[ADA]` (`auth.middleware.ts`) |
| **EX-03** | Auth / Semua | Akun nonaktif (`User.isActive == false`) | Pengguna tidak dapat bertransaksi | `403 FORBIDDEN` | `"Akun Anda sedang dinonaktifkan."` | `[RENCANA]` |
| **EX-04** | Katalog / Order | E-book tidak aktif atau tidak ditemukan | Produk tidak dapat dilihat/dipesan | `404 NOT_FOUND` | `"E-book tidak ditemukan atau sudah tidak tersedia."` | `[RENCANA]` |
| **EX-05** | Katalog / Admin | Kategori tidak ditemukan | Filter atau CRUD gagal | `404 NOT_FOUND` | `"Kategori tidak ditemukan."` | `[RENCANA]` |
| **EX-06** | Checkout | Keranjang atau daftar `ebookIds` kosong | Pesanan tidak dibuat | `400 VALIDATION_ERROR` | `"Daftar e-book pesanan tidak boleh kosong."` | `[RENCANA]` |
| **EX-07** | Checkout | E-book sudah dimiliki pelanggan (`EbookAccess` aktif) | Mencegah pembelian ganda | `409 CONFLICT` | `"Anda sudah memiliki akses untuk salah satu e-book yang dipilih."` | `[RENCANA]` |
| **EX-08** | Checkout | Total harga dari klien tidak cocok / dimanipulasi | Nilai klien diabaikan/ditolak | Backend menghitung ulang dari `Ebook.price` di DB | *(Harga resmi DB digunakan; atau `400` bila invalid)* | `[RENCANA]` |
| **EX-09** | Pembayaran | Pembayaran berstatus `PENDING` | Akses PDF tetap terkunci | `200` status `PENDING` / `409 PAYMENT_PENDING` saat duplikat bayar | `"Pembayaran masih menunggu konfirmasi."` | `[RENCANA]` |
| **EX-10** | Pembayaran | Pembayaran gagal (`FAILED`) | Order gagal, tanpa `EbookAccess` | Update `Payment` & `Order -> FAILED` | `"Pembayaran gagal diproses. Silakan coba lagi."` | `[RENCANA]` |
| **EX-11** | Pembayaran | Pembayaran kedaluwarsa (`EXPIRED`) | Order tidak dapat dibayar | Update `Order -> EXPIRED` / `409 ORDER_EXPIRED` | `"Batas waktu pembayaran pesanan telah berakhir."` | `[RENCANA]` |
| **EX-12** | Webhook | Signature webhook tidak valid | Webhook ditolak, log keamanan dicatat | `401 WEBHOOK_SIGNATURE_INVALID` | `"Signature webhook tidak valid."` | `[RENCANA]` |
| **EX-13** | Webhook | Webhook duplikat untuk status final | Tidak ada mutasi ganda (idempoten) | `200 OK` (`DUPLICATE_WEBHOOK`) | `"Notifikasi pembayaran sudah diproses sebelumnya."` | `[RENCANA]` |
| **EX-14** | Webhook | Data webhook / nominal tidak cocok | Tidak ada pembaruan status | `400 PAYMENT_VERIFICATION_FAILED` / `404` | `"Verifikasi pembayaran gagal."` | `[RENCANA]` |
| **EX-15** | Akses PDF | Akses e-book belum tersedia (belum membeli) | PDF tidak dapat dibuka | `403 EBOOK_ACCESS_DENIED` | `"Anda tidak memiliki akses aktif untuk e-book ini."` | `[RENCANA]` |
| **EX-16** | Akses PDF | Akses e-book dicabut (`isRevoked == true`) | PDF diblokir meski pernah beli | `403 EBOOK_ACCESS_DENIED` | `"Akses e-book Anda sedang dicabut."` | `[RENCANA]` |
| **EX-17** | Akses PDF | `Signed URL` kedaluwarsa saat membaca | Stream storage ditolak | Klien meminta ulang `GET /ebooks/{id}/access-url` | `"Sesi baca sementara berakhir, memuat ulang akses..."` | `[RENCANA]` |
| **EX-18** | Storage / Akses PDF | Bucket atau file PDF tidak tersedia di storage | Gagal menerbitkan `signed URL` | `500 SIGNED_URL_GENERATION_FAILED` + log server | `"Gagal menyiapkan akses baca e-book sementara."` | `[RENCANA]` |
| **EX-19** | Admin / SAW | Bobot SAW tidak valid (`!= 1.0` atau `<= 0`) | Perubahan bobot / kalkulasi ditolak | `400` / `500 SAW_CONFIGURATION_INVALID` | `"Konfigurasi bobot kriteria SAW tidak valid."` | `[RENCANA]` |
| **EX-20** | SAW | Katalog kandidat SAW kosong | Tidak ada alternatif dihitung | `200 OK` dengan array `[]` | `"Belum ada e-book tersedia untuk direkomendasikan."` | `[RENCANA]` |
| **EX-21** | Semua | Kegagalan database atau layanan eksternal | Transaksi di-*rollback*, tidak ada *partial commit* | `500 INTERNAL_SERVER_ERROR` / `502` + log internal | `"Terjadi kesalahan internal pada server."` | `[ADA]` handler 500 / `[RENCANA]` integrasi |
