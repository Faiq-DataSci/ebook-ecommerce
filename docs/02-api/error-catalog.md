# Katalog Error API (`Error Catalog`)

**Status:** `[ADA]` (format error pada `middlewares/error.middleware.ts` untuk `VALIDATION_ERROR`, `INTERNAL_SERVER_ERROR`, serta `UNAUTHORIZED` dan `FORBIDDEN` dari `auth.middleware.ts`) | `[RENCANA]` (kode error bisnis spesifik transaksi, akses PDF, webhook, dan `SPK SAW`)

Seluruh pesan error yang dikirim ke klien **dilarang** membocorkan keberadaan email, detail token, query SQL, `storagePath`, maupun *stack trace*.

---

## Daftar Kode Error Standar

| Kode | HTTP Status | Kondisi | Pesan Aman untuk Klien | Endpoint Terkait | Status |
|---|---:|---|---|---|---|
| **`VALIDATION_ERROR`** | `400` | Payload `body`, `query`, atau `params` gagal validasi skema **Zod**. | `"Input tidak valid."` | Seluruh endpoint | `[ADA]` (`error.middleware.ts`) |
| **`UNAUTHENTICATED`** | `401` | Token Bearer tidak ada, format salah, tidak valid, atau kedaluwarsa. *(Catatan: `auth.middleware.ts` saat ini memakai kode `"UNAUTHORIZED"`.)* | `"Autentikasi diperlukan atau sesi telah kedaluwarsa."` | Seluruh endpoint terproteksi | `[ADA]` (mekanisme 401) / `[RENCANA]` (penyeragaman kode) |
| **`FORBIDDEN`** | `403` | Peran tidak mencukupi (`CUSTOMER` ke `/admin/*`), akun nonaktif, atau bukan pemilik resource. | `"Anda tidak memiliki hak akses untuk operasi ini."` | `/admin/*`, `/orders/{id}`, `/payments/{id}` | `[ADA]` (`auth.middleware.ts`) |
| **`NOT_FOUND`** | `404` | ID e-book, kategori, pesanan, atau pembayaran tidak ditemukan. | `"Data yang diminta tidak ditemukan."` | `/ebooks/{id}`, `/orders/{id}`, `/admin/*` | `[RENCANA]` |
| **`CONFLICT`** | `409` | Konflik aturan bisnis (e-book sudah dimiliki, pesanan tidak `PENDING`, kategori masih dipakai e-book). | `"Permintaan tidak dapat diproses karena konflik status data."` | `/orders`, `/payments`, `/admin/categories/{id}` | `[RENCANA]` |
| **`RATE_LIMITED`** | `429` | Jumlah permintaan melebihi batas *rate limiter*. | `"Terlalu banyak permintaan. Silakan coba beberapa saat lagi."` | Auth sync, orders, payments | `[RENCANA]` (`rate-limit.middleware.ts` belum dipasang di `app.ts`) |
| **`ORDER_EXPIRED`** | `409` | Pesanan telah melewati batas waktu pembayaran (`expiresAt`) sebelum dibayar. | `"Batas waktu pembayaran pesanan telah berakhir."` | `/payments` | `[RENCANA]` |
| **`PAYMENT_PENDING`** | `409` | Masih terdapat upaya pembayaran aktif yang belum selesai untuk pesanan terkait. | `"Pembayaran untuk pesanan ini masih menunggu konfirmasi."` | `/payments` | `[RENCANA]` |
| **`PAYMENT_VERIFICATION_FAILED`** | `400` | Nominal atau status pembayaran dari gateway tidak cocok dengan data `Order`/`Payment`. | `"Verifikasi pembayaran gagal."` | `/payments/webhook` | `[RENCANA]` |
| **`WEBHOOK_SIGNATURE_INVALID`** | `401` | *Signature* kriptografis pada header *webhook* tidak cocok dengan secret gateway. | `"Signature webhook tidak valid."` | `POST /api/v1/payments/webhook` | `[RENCANA]` |
| **`DUPLICATE_WEBHOOK`** | `200` | *Webhook* dikirim ulang untuk `Payment` yang sudah berstatus final (diabaikan secara idempoten). | `"Notifikasi pembayaran sudah diproses sebelumnya."` | `POST /api/v1/payments/webhook` | `[RENCANA]` |
| **`EBOOK_ACCESS_DENIED`** | `403` | Pelanggan belum membeli `e-book` atau `EbookAccess.isRevoked == true`. | `"Anda tidak memiliki akses aktif untuk e-book ini."` | `GET /api/v1/ebooks/{id}/access-url` | `[RENCANA]` |
| **`SIGNED_URL_GENERATION_FAILED`** | `500` | Layanan Supabase Storage gagal menerbitkan *signed URL* sementara. | `"Gagal menyiapkan akses baca e-book sementara."` | `GET /api/v1/ebooks/{id}/access-url` | `[RENCANA]` |
| **`SAW_CONFIGURATION_INVALID`** | `400` / `500` | Bobot SAW negatif/nol atau total bobot tidak sama dengan `1.0`. | `"Konfigurasi bobot kriteria SAW tidak valid."` | `/admin/saw/weights`, `/recommendations/saw` | `[RENCANA]` |
| **`INTERNAL_SERVER_ERROR`** | `500` | Kesalahan internal tak terduga pada server atau database. | `"Terjadi kesalahan internal pada server."` | Seluruh endpoint | `[ADA]` (`error.middleware.ts`) |
