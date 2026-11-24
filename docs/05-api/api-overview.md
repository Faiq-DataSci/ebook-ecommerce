# Gambaran Umum API (`API Overview`)

> **Status Dokumen:** `[ADA]` (Dokumentasi gambaran umum API)
> **Status Implementasi Aktual:** `[ADA]` (`GET /api/v1/health` dan `GET /api/v1/admin/ping` pada [`backend/src/app.ts`](../../backend/src/app.ts) & [`backend/tests/health.test.ts`](../../backend/tests/health.test.ts)) | `[RENCANA]` (Seluruh endpoint bisnis, SAW, transaksi, akses PDF, dan admin)
> **Sumber Kebenaran Utama:** [`api-spec.yaml`](../02-api/api-spec.yaml) & [`docs-proyek-ebook-ecommerce.md`](../docs-proyek-ebook-ecommerce.md)

---

## 1. Tujuan & Teknologi Backend

REST API ini berfungsi sebagai satu-satunya gerbang terpusat (*single source of truth*) bagi aplikasi klien (`mobile/ebook_store`, `web/admin-web`, `web/pengunjung-web`) untuk mengakses katalog e-book, rekomendasi SPK SAW, manajemen pesanan, webhook pembayaran, penerbitan *signed URL* PDF privat, serta administrasi sistem.

- **Stack Backend:** **Express 5** + **TypeScript (ESM)** + **Zod** + **Prisma 7** + **PostgreSQL Supabase**.
- **Base Path:** `/api/v1`
- **Format Pertukaran Data:** `application/json` (UTF-8), kecuali endpoint unggah berkas yang menggunakan `multipart/form-data`.
- **Skema Autentikasi:** Bearer Token (`Authorization: Bearer <token>`) menggunakan JWT yang diterbitkan oleh **Supabase Auth** dan diverifikasi di backend (`supabase.auth.getUser(token)`).

---

## 2. Format Respons Standar

### 2.1 Respons Sukses Tunggal
```json
{
  "success": true,
  "message": "Deskripsi singkat hasil operasi",
  "data": {}
}
```

### 2.2 Respons Sukses Terpaginasi
```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

### 2.3 Respons Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Ringkasan kesalahan yang aman untuk klien",
    "details": []
  }
}
```

---

## 3. Kode Status HTTP Standar

| HTTP Status | Makna | Penggunaan Utama |
| :--- | :--- | :--- |
| `200 OK` | Permintaan berhasil | Pengambilan data, pembaruan, verifikasi, health check |
| `201 Created` | Resource baru berhasil dibuat | Sinkronisasi akun, tambah kategori/e-book, buat pesanan, inisiasi pembayaran |
| `204 No Content` | Berhasil tanpa body respons | Penghapusan/pengarsipan resource tertentu (bila tidak mengembalikan payload) |
| `400 Bad Request` | Input tidak valid / gagal validasi Zod | Format payload salah, field wajib kosong, bobot SAW tidak valid |
| `401 Unauthorized` | Token/signature tidak ada, tidak valid, atau kedaluwarsa | Akses endpoint terproteksi tanpa JWT valid atau webhook signature salah |
| `403 Forbidden` | Role atau kepemilikan tidak mencukupi | `CUSTOMER` mengakses `/admin/*`, IDOR pesanan, atau akses PDF tanpa `EbookAccess` aktif |
| `404 Not Found` | Resource tidak ditemukan | ID kategori, e-book, pesanan, atau pembayaran tidak tersedia |
| `409 Conflict` | Konflik aturan bisnis | Kategori masih dipakai e-book, e-book sudah dimiliki, pesanan bukan `PENDING`, atau `ORDER_EXPIRED` |
| `429 Too Many Requests` | Batas laju permintaan terlampaui | Rate limiting endpoint sensitif (`[RENCANA]` pemasangan di `app.ts`) |
| `500 Internal Server Error` | Kesalahan tak terduga di server | Kegagalan DB/storage/konfigurasi (tanpa membocorkan stack trace atau query SQL) |

---

## 4. Status Implementasi Aktual & Ringkasan Kategori Endpoint

> **Catatan:** Dokumen `docs/05-api/` adalah rancangan tahap awal. Sumber kebenaran terkini adalah [`docs/02-api/`](../02-api/api-overview.md) dan kode di `backend/src/`.

Berdasarkan [`backend/src/app.ts`](../../backend/src/app.ts) dan [`api-spec.yaml`](../02-api/api-spec.yaml):
- **Sudah `[ADA]` (endpoint inti):**
  - `GET /api/v1/health` — Cek kesehatan server Express.
  - `GET /api/v1/admin/ping` — Uji otorisasi `authenticate` + `authorize('ADMIN')`.
  - `POST /api/v1/auth/sync`, `GET/PATCH /api/v1/users/me`
  - `GET /api/v1/categories`, `GET /api/v1/ebooks`, `GET /api/v1/ebooks/:id`, `GET /api/v1/ebooks/:id/access-url`
  - `GET /api/v1/recommendations/saw`
  - `POST /api/v1/orders`, `GET /api/v1/orders/me`, `GET /api/v1/orders/:id`
  - `POST /api/v1/payments/webhook`
  - `GET /api/v1/transactions/my`
  - `GET /api/v1/admin/dashboard`, `GET/PUT /api/v1/admin/saw/weights`
- **Masih `[RENCANA]`:**
  1. **Pembayaran:** `POST /payments`, `GET /payments/:id`
  2. **Admin CRUD & laporan:** `/admin/categories*`, `/admin/ebooks*`, `/admin/customers*`, `/admin/orders*`, `/admin/payments`, `/admin/transactions`, `/admin/reports/sales`, `/admin/accesses/:id`

---

## 5. Hubungan dengan `docs/02-api/`

- [`docs/02-api/api-spec.yaml`](../02-api/api-spec.yaml) merupakan spesifikasi OpenAPI 3.1 yang menjadi **sumber kebenaran rancangan endpoint paling lengkap**.
- Folder `docs/05-api/` menyajikan rancangan yang sama dalam format Markdown terstruktur agar mudah dibaca oleh tim backend, frontend, mobile, dan QA.
- Apabila terdapat perbedaan antara dokumentasi `docs/05-api/` versi lama dan `api-spec.yaml`, maka **`api-spec.yaml` dijadikan acuan utama** dan perbedaannya dicatat di [`api-gap-register.md`](./api-gap-register.md).
