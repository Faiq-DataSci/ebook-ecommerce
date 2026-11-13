# Konvensi API (`API Conventions`)

**Status:** `[ADA]` (prefix `/api/v1`, helper `sendSuccess`, `AppError`, middleware `validate`, dan `errorHandler` di `backend/src/`) | `[RENCANA]` (penerapan seragam pada seluruh endpoint bisnis, paginasi standar, dan idempotency pembayaran)

---

## 1. Versioning, Penamaan Resource, & HTTP Method

- **Prefix & Versioning:** Seluruh endpoint menggunakan prefix `/api/v1` (`[ADA]` di `backend/src/app.ts`).
- **Penamaan Resource:** Kata benda jamak (*plural*), *lowercase*, *kebab-case* bila multi-kata (`/ebooks`, `/orders/me`, `/access-url`).
- **HTTP Method:**
  - `GET`: Membaca data (idempoten, tanpa efek samping mutasi).
  - `POST`: Membuat *resource* baru (`201 Created`) atau memicu aksi/webhook (`200 OK`).
  - `PATCH`: Pembaruan parsial (profil, metadata e-book, `isRevoked`).
  - `PUT`: Penggantian konfigurasi utuh (bobot SAW).
  - `DELETE`: Penghapusan atau *soft-archive* (`isActive = false`).

---

## 2. Format Data, ID, Timestamp, & Nilai Uang

| Aspek | Konvensi Resmi | Sumber / Status |
|---|---|---|
| **Format ID** | `UUID v4` (sesuai `@id @default(uuid()) @db.Uuid` di `schema.prisma`) | `[ADA]` di `schema.prisma` |
| **Timestamp** | **ISO 8601 UTC** (`YYYY-MM-DDTHH:mm:ss.sssZ`), disimpan sebagai `TIMESTAMPTZ` | `[ADA]` di `schema.prisma` |
| **Nilai Uang** | `Decimal(12,2)` (direpresentasikan sebagai string desimal tetap, mis. `"75000.00"` untuk mencegah galat *floating-point*) | `[ADA]` di `schema.prisma` |
| **Nilai Rating & SAW** | `ratingAvg` memakai `Decimal(3,2)`; perhitungan SAW memakai presisi penuh di server sebelum pembulatan tampilan | `[ADA]` di `schema.prisma` / `[RENCANA]` logika |

---

## 3. Konvensi Pagination, Filtering, & Sorting (`[RENCANA]`)

- **Query Parameter Standar:**
  - `page` (integer, default `1`, minimal `1`)
  - `limit` (integer, default `20`, maksimal `100`)
  - `search` (string pencarian judul/penulis/nama)
  - Filter spesifik: `categoryId` (UUID), `status` (`OrderStatus`), `startDate` & `endDate` (ISO 8601).
- **Metadata Paginasi (`meta`):** `{ "page": 1, "limit": 20, "total": 42, "totalPages": 3 }`.

---

## 4. Struktur Response Sukses & Error

### 4.1 Response Sukses (`[ADA]` sebagian di `utils/response.ts` & `app.ts`)
Helper `sendSuccess` (`backend/src/utils/response.ts`) menghasilkan bentuk:
```json
{
  "success": true,
  "data": {
    "id": "00000000-0000-0000-0000-000000000001",
    "title": "DATA SIMULASI - Pengantar Sains Data",
    "price": "75000.00"
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```
*(Catatan fakta aktual: `GET /api/v1/health` di `app.ts` juga menyertakan field `message` di tingkat root selain `success` dan `data`.)*

### 4.2 Response Error (`[ADA]` di `middlewares/error.middleware.ts`)
`errorHandler` yang aktif di `app.ts` mengembalikan struktur:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Payload tidak valid.",
    "details": []
  }
}
```
> **Catatan Fakta Kode:** Di `backend/src/` terdapat dua berkas error handler (`middlewares/error.middleware.ts` yang dipakai `app.ts` dan `middleware/error-handler.ts` yang tidak dipakai). Rancangan standar API mengacu pada format `middlewares/error.middleware.ts` di atas, sementara penyatuan dua berkas tersebut dicatat sebagai `[RENCANA]` pembersihan kode.

---

## 5. Validasi Input (Zod) & Idempotency

- **Validasi Zod (`[ADA]` di `middleware/validate.ts`):** Memvalidasi `body`, `query`, dan `params` sebelum masuk ke *controller*; kegagalan otomatis menghasilkan `400 Bad Request` (`VALIDATION_ERROR`).
- **Idempotency Pembayaran (`[RENCANA]`):**
  - *Webhook* pembayaran menggunakan `externalRef` / `orderId` serta pengecekan status final (`VERIFIED`/`FAILED`/`EXPIRED`) dalam transaksi database agar pengiriman ulang tidak menimbulkan mutasi ganda.
- **Konvensi Status Endpoint:** Setiap endpoint pada `api-spec.yaml` wajib mencantumkan `x-implementation-status: "[ADA]"` atau `"[RENCANA]"`.
