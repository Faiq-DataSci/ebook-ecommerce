# Hardening API (`API Hardening`)

**Status:** `[ADA]` (`helmet()`, CORS, `validate.ts`, `errorHandler`, batas `1mb`, berkas `rate-limit.middleware.ts`) | `[RENCANA]` (pemasangan rate limiter di `app.ts`, skema Zod per modul, audit keamanan)  
**Referensi Utama:** [`backend/src/app.ts`](../../backend/src/app.ts), [`backend/src/middleware/validate.ts`](../../backend/src/middleware/validate.ts), [`backend/src/middlewares/error.middleware.ts`](../../backend/src/middlewares/error.middleware.ts), [`backend/src/middlewares/rate-limit.middleware.ts`](../../backend/src/middlewares/rate-limit.middleware.ts).

---

## 1. Validasi Input (Zod)

- Middleware `validate(schemas)` (`[ADA]` di `validate.ts`) memvalidasi `req.body`, `req.query`, dan `req.params` sebelum menyentuh logika bisnis.
- Jika gagal validasi, `ZodError` diteruskan ke `errorHandler` dan dikembalikan sebagai HTTP `400 VALIDATION_ERROR`.
- Skema Zod spesifik per modul bisnis (UUID, email, rentang angka, batas panjang string, penolakan payload berbahaya) berstatus `[RENCANA]`.

---

## 2. Helmet (HTTP Security Headers)

- `app.use(helmet())` aktif secara global di `backend/src/app.ts` (`[ADA]`).
- Menambahkan header keamanan standar seperti `X-Content-Type-Options`, `X-Frame-Options`, `Content-Security-Policy` default, dan menyembunyikan header `X-Powered-By`.
- Penyesuaian kebijakan CSP/HSTS eksplisit untuk produksi berstatus `[RENCANA]`.

---

## 3. CORS (`Cross-Origin Resource Sharing`)

- Dikonfigurasi di `app.ts` (`[ADA]`) membaca `env.CORS_ORIGINS` (dipisah koma).
- **Default lokal (`env.ts`):** `http://localhost:5173,http://localhost:5174` (Admin Web & Pengunjung Web).
- **Produksi (`[RENCANA]`):** Wajib diisi domain HTTPS resmi `admin-web` dan `pengunjung-web` (tanpa wildcard `*`).
- `credentials: true` diaktifkan untuk mendukung pengiriman header/cookie autentikasi secara aman.

---

## 4. Rate Limiting

- Berkas `sensitiveEndpointLimiter` (`express-rate-limit`) sudah `[ADA]` di `rate-limit.middleware.ts` (`windowMs: 15 * 60 * 1000`, `max: 30`, mengembalikan `RATE_LIMITED`).
- **Status Pemasangan:** Belum dipasang ke rute di `app.ts` (`[RENCANA]`).
- **Target Pemasangan (`[RENCANA]`):** Endpoint autentikasi (`/auth/sync`), pembuatan pesanan (`/orders`), pembayaran (`/payments`), dan webhook (`/payments/webhook`).

---

## 5. Sanitasi Error (`errorHandler`)

- `errorHandler` di `error.middleware.ts` (`[ADA]` di `app.ts`) menyembunyikan *stack trace* dan detail error database pada respons HTTP `500 INTERNAL_SERVER_ERROR`.
- Format error standar:
  ```json
  {
    "success": false,
    "error": {
      "code": "INTERNAL_SERVER_ERROR",
      "message": "Terjadi kesalahan internal pada server"
    }
  }
  ```
- Pesan error ke klien dilarang membocorkan query SQL, `storagePath`, email terdaftar, maupun token.

---

## 6. Pencegahan Injection

- **SQL Injection:** Dicegah dengan Prisma ORM *parameterized queries* (`[ADA]` arsitektur Prisma).
- **XSS:** Dicegah melalui `helmet()` CSP, validasi input Zod, dan escaping output standar di React & Flutter.
- **Command Injection:** Tidak menggunakan `exec()` atau `spawn()` dengan input klien.
- **NoSQL Injection:** Tidak relevan (memakai PostgreSQL + Prisma type-safe queries).

---

## 7. Request Size Limit & HTTPS/TLS

- **Batas Payload JSON (`[ADA]`):** `app.use(express.json({ limit: '1mb' }))` di `app.ts`.
- **Upload PDF (`[RENCANA]`):** Menggunakan `multipart/form-data` khusus admin dengan batas ukuran file yang ditetapkan di backend.
- **HTTPS / TLS (`[RENCANA]`):** Wajib aktif di lingkungan produksi untuk seluruh API, static web, dan webhook callback Payment Gateway.

---

## 8. Matriks Kontrol Hardening API

| Kontrol | Mekanisme | Status Bukti | Status |
|---|---|---|---|
| **HTTP Security Headers** | `helmet()` di `app.ts` | Ada di `backend/src/app.ts` | `[ADA]` (default) / `[RENCANA]` (CSP/HSTS) |
| **CORS Whitelist** | `cors({ origin, credentials: true })` | Ada di `app.ts` & `env.ts` | `[ADA]` mekanisme / `[RENCANA]` prod origin |
| **Input Validation** | `validate.ts` (Zod) | Ada di `backend/src/middleware/validate.ts` | `[ADA]` helper / `[RENCANA]` skema modul |
| **Rate Limiting** | `sensitiveEndpointLimiter` (`express-rate-limit`) | Ada file `rate-limit.middleware.ts` | `[ADA]` file / `[RENCANA]` mount di `app.ts` |
| **Error Sanitization** | `errorHandler` | Ada di `error.middleware.ts` | `[ADA]` |
| **Body Size Limit** | `express.json({ limit: '1mb' })` | Ada di `app.ts` | `[ADA]` |
| **HTTPS / TLS** | Reverse proxy / hosting TLS | Belum ada deployment prod | `[RENCANA]` |
