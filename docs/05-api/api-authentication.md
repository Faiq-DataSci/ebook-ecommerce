# Autentikasi & Otorisasi API (`API Authentication & Authorization`)

> **Status Dokumen:** `[ADA]` (Dokumentasi desain & audit middleware)
> **Status Implementasi:** `[ADA]` (`authenticate` & `authorize('ADMIN')` pada [`auth.middleware.ts`](../../backend/src/middlewares/auth.middleware.ts), terpasang pada `GET /api/v1/admin/ping`) | `[RENCANA]` (`POST /auth/sync`, `GET/PATCH /users/me`, `authorize('CUSTOMER')`, dan integrasi pada endpoint bisnis)
> **Referensi:** [`docs/02-api/authentication-and-authorization.md`](../02-api/authentication-and-authorization.md), [`auth.middleware.ts`](../../backend/src/middlewares/auth.middleware.ts)

---

## 1. Sumber Autentikasi & Skema Token

- **Penyedia Autentikasi:** **Supabase Auth** mengelola registrasi, login, dan penerbitan JWT. Backend Express tidak menyimpan `password_hash`.
- **Skema Header:** `Authorization: Bearer <access_token>`
- **Verifikasi Token di Backend:** Middleware `authenticate` pada `backend/src/middlewares/auth.middleware.ts` memanggil `supabase.auth.getUser(token)` dan menyematkan konteks `req.user = { id, email, role }`.

---

## 2. Alur Autentikasi & Sinkronisasi Profil

1. Klien (`mobile/ebook_store`, `web/admin-web`, `web/pengunjung-web`) mendaftar atau masuk melalui Supabase Auth.
2. Supabase menerbitkan JWT access token.
3. Klien mengirim `Authorization: Bearer <access_token>` ke endpoint terproteksi backend.
4. Backend memverifikasi JWT melalui `supabase.auth.getUser(token)`.
5. Klien memanggil `POST /api/v1/auth/sync` (`[RENCANA]`) untuk menyinkronkan profil `User` (`supabaseUserId`, `email`, `fullName`, `phone`) ke PostgreSQL dengan role default `CUSTOMER`.

---

## 3. Otorisasi Berbasis Peran (`RBAC`), Pencegahan IDOR & Proteksi Data

- **RBAC di Backend:**
  - `authorize('ADMIN')` (`[ADA]` di `auth.middleware.ts`) menolak user non-Admin dengan `403 Forbidden`.
  - `authorize('CUSTOMER')` (`[RENCANA]`) untuk endpoint khusus Pelanggan.
  - Token tidak ada / tidak valid / kedaluwarsa mengembalikan `401 Unauthorized`.
  - Akun nonaktif (`isActive = false`) mengembalikan `403 Forbidden` (`[RENCANA]`).
- **Pencegahan IDOR:** Endpoint milik pelanggan (`/orders/me`, `/orders/:id`, `/payments/:id`, `/ebooks/:id/access-url`, `/transactions/my`) **wajib** memverifikasi kepemilikan memakai `req.user.id` dari token JWT, bukan menerima `userId` dari request body/query klien.
- **Proteksi Data:** Pesan gagal autentikasi bersifat generik (*"Email atau password salah"*) agar tidak membocorkan keberadaan akun.

---

## 4. Tabel Otorisasi per Kelompok Endpoint

| Endpoint | Authentication | Role | Status |
| :--- | :--- | :--- | :--- |
| `GET /api/v1/health` | Tidak diperlukan | Publik | `[ADA]` |
| `GET /api/v1/categories`, `GET /api/v1/ebooks`, `GET /api/v1/ebooks/:id` | Tidak diperlukan | Publik | `[RENCANA]` |
| `GET /api/v1/recommendations/saw` | Opsional / Wajib *(Keputusan #5)* | Publik / `CUSTOMER` | `[RENCANA]` |
| `POST /api/v1/auth/sync`, `GET/PATCH /api/v1/users/me` | Wajib (Bearer JWT) | `CUSTOMER` / `ADMIN` | `[RENCANA]` |
| `POST /api/v1/orders`, `GET /api/v1/orders/me`, `GET /api/v1/orders/:id` | Wajib (Bearer JWT) | `CUSTOMER` (pemilik) | `[RENCANA]` |
| `POST /api/v1/payments`, `GET /api/v1/payments/:id`, `GET /api/v1/transactions/my` | Wajib (Bearer JWT) | `CUSTOMER` (pemilik) | `[RENCANA]` |
| `GET /api/v1/ebooks/:id/access-url` | Wajib (Bearer JWT) | `CUSTOMER` (`EbookAccess` aktif) | `[RENCANA]` |
| `POST /api/v1/payments/webhook` | Tidak pakai JWT; wajib **Signature** | `PAYMENT_GATEWAY` | `[RENCANA]` |
| `GET /api/v1/admin/ping` | Wajib (Bearer JWT) | `ADMIN` | `[ADA]` |
| Seluruh `/api/v1/admin/*` lainnya | Wajib (Bearer JWT) | `ADMIN` | `[RENCANA]` |
