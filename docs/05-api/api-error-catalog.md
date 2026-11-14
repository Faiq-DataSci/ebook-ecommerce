# Katalog Kode Error API (`API Error Catalog`)

> **Status Dokumen:** `[ADA]` (Dokumentasi katalog error)
> **Sumber Utama:** [`docs/02-api/error-catalog.md`](../02-api/error-catalog.md) & [`backend/src/middlewares/auth.middleware.ts`](../../backend/src/middlewares/auth.middleware.ts)
> **Prinsip Keamanan:** Pesan error yang dikirim ke klien **tidak boleh** membocorkan email terdaftar, token JWT, query SQL, `storagePath` privat, atau stack trace.

---

## 1. Format Standar Respons Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Data permintaan tidak valid.",
    "details": [
      {
        "field": "price",
        "message": "Harga harus bernilai >= 0"
      }
    ]
  }
}
```

---

## 2. Tabel Kode Error Lengkap

| Kode | HTTP Status | Kondisi | Pesan Aman untuk Klien | Endpoint Terkait | Status |
| :--- | :---: | :--- | :--- | :--- | :--- |
| **`VALIDATION_ERROR`** | `400` | Payload body, query, atau params gagal validasi Zod | `"Data permintaan tidak valid."` | Seluruh endpoint dengan schema Zod | `[ADA]` (`validate.ts` & `error.middleware.ts`) |
| **`UNAUTHORIZED`** | `401` | Token Bearer tidak ada, tidak valid, atau kedaluwarsa | `"Token autentikasi diperlukan."` / `"Sesi tidak valid."` | Seluruh endpoint terproteksi JWT | `[ADA]` (`auth.middleware.ts`) |
| **`FORBIDDEN`** | `403` | Role tidak mencukupi (`CUSTOMER` ke `/admin/*`), akun nonaktif, atau bukan pemilik resource (IDOR) | `"Anda tidak memiliki izin untuk mengakses resource ini."` | `/admin/*`, `/orders/:id`, `/payments/:id` | `[ADA]` (`authorize('ADMIN')`) / `[RENCANA]` (IDOR) |
| **`NOT_FOUND`** | `404` | Resource (kategori, e-book, pesanan, pembayaran) tidak ditemukan atau arsip | `"Data yang diminta tidak ditemukan."` | `/categories/:id`, `/ebooks/:id`, `/orders/:id`, `/admin/*` | `[RENCANA]` |
| **`CONFLICT`** | `409` | Konflik aturan bisnis (kategori masih dipakai, e-book sudah dimiliki, pesanan bukan `PENDING`) | `"Permintaan tidak dapat diproses karena konflik data."` | `/admin/categories/:id`, `/orders`, `/payments` | `[RENCANA]` |
| **`RATE_LIMITED`** | `429` | Batas jumlah permintaan per IP/sesi terlampaui | `"Terlalu banyak permintaan. Silakan coba beberapa saat lagi."` | Auth, webhook, `/ebooks/:id/access-url` | `[RENCANA]` (`rate-limit.middleware.ts` belum terpasang di `app.ts`) |
| **`ORDER_EXPIRED`** | `409` | Batas waktu pembayaran (`Order.expiresAt`) telah terlewati | `"Batas waktu pembayaran pesanan telah berakhir."` | `/payments`, `/payments/webhook` | `[RENCANA]` |
| **`PAYMENT_PENDING`** | `409` | Operasi memerlukan pelunasan, tetapi pembayaran masih `PENDING` | `"Pembayaran masih menunggu verifikasi."` | `/orders/:id`, `/ebooks/:id/access-url` | `[RENCANA]` |
| **`PAYMENT_VERIFICATION_FAILED`** | `400` | Nominal webhook berbeda dengan `Payment.amount` atau status tidak valid | `"Verifikasi pembayaran gagal."` | `POST /api/v1/payments/webhook` | `[RENCANA]` |
| **`WEBHOOK_SIGNATURE_INVALID`** | `401` | Signature header webhook tidak cocok dengan secret gateway | `"Signature webhook tidak valid."` | `POST /api/v1/payments/webhook` | `[RENCANA]` |
| **`DUPLICATE_WEBHOOK`** | `200` | Webhook diterima ulang untuk `Payment` yang sudah berstatus final | `"Webhook sudah diproses sebelumnya."` | `POST /api/v1/payments/webhook` | `[RENCANA]` |
| **`EBOOK_ACCESS_DENIED`** | `403` | Pelanggan belum membeli e-book atau `EbookAccess.isRevoked = true` | `"Anda belum memiliki akses aktif untuk e-book ini."` | `GET /api/v1/ebooks/:id/access-url` | `[RENCANA]` |
| **`SIGNED_URL_GENERATION_FAILED`** | `500` | Kegagalan menerbitkan *signed URL* dari Supabase Storage privat | `"Gagal menyiapkan tautan baca sementara."` | `GET /api/v1/ebooks/:id/access-url` | `[RENCANA]` |
| **`SAW_CONFIGURATION_INVALID`** | `400` / `500` | Bobot SAW bernilai negatif/nol atau total bobot `!= 1.0` | `"Konfigurasi bobot kriteria SAW tidak valid."` | `PUT /admin/saw/weights`, `GET /recommendations/saw` | `[RENCANA]` |
| **`INTERNAL_SERVER_ERROR`** | `500` | Kesalahan tak terduga (DB error, runtime exception) | `"Terjadi kesalahan internal pada server."` | Seluruh endpoint | `[ADA]` (`error.middleware.ts`) |

> **Catatan Inkonsistensi Penamaan:** `backend/src/middlewares/auth.middleware.ts` dan `backend/tests/health.test.ts` saat ini menggunakan kode `'UNAUTHORIZED'`, sedangkan `docs/02-api/error-catalog.md` menstandarkan `'UNAUTHENTICATED'`. Rekonsiliasi dicatat pada [`api-gap-register.md`](./api-gap-register.md).

---

## 3. Contoh Respons Error (`DATA SIMULASI`)

```json
{
  "success": false,
  "error": {
    "code": "EBOOK_ACCESS_DENIED",
    "message": "Anda belum memiliki akses aktif untuk e-book ini.",
    "details": []
  }
}
```
