# Konvensi API (`API Conventions`)

> **Status Dokumen:** `[ADA]` (Dokumentasi standar konvensi API)
> **Referensi:** [`docs/02-api/api-conventions.md`](../02-api/api-conventions.md), [`api-spec.yaml`](../02-api/api-spec.yaml), [`schema.prisma`](../../backend/prisma/schema.prisma)

---

## 1. Base Path, Versioning & Format Pertukaran Data

- **Base Path & Versioning:** Seluruh endpoint berada di bawah prefix `/api/v1`.
- **Format Data:** `application/json` (UTF-8) untuk seluruh request/response standar; `multipart/form-data` khusus untuk unggah berkas (`pdfFile` untuk PDF e-book dan `coverImage` untuk gambar sampul).

---

## 2. Format Standar Respons

- **Sukses Tunggal:** `{ "success": true, "message": "string", "data": {} }`
- **Sukses Daftar (Paginasi):** `{ "success": true, "data": [], "meta": { "page": 1, "limit": 20, "total": 0, "totalPages": 0 } }`
- **Error:** `{ "success": false, "error": { "code": "ERROR_CODE", "message": "string", "details": [] } }`

---

## 3. Konvensi Penamaan, Paginasi & Filtering

- **Penamaan Field JSON:** Menggunakan `camelCase` selaras dengan model Prisma (mis. `fullName`, `isActive`, `totalAmount`, `unitPrice`).
- **Path & Query Parameter:** Path menggunakan `kebab-case` atau `camelCase` sesuai `api-spec.yaml` (`/access-url`, `/reports/sales`); query parameter menggunakan `camelCase` (`categoryId`, `startDate`, `endDate`).
- **Pagination:**
  - `page`: integer `>= 1`, default `1`.
  - `limit`: integer `1–100`, default `20`.
  - `meta`: `{ "page": 1, "limit": 20, "total": 0, "totalPages": 0 }`.
- **Filtering:**
  - `search`: string (maks 100 karakter) untuk pencarian teks.
  - `categoryId`: UUID v4.
  - `status`: enum `OrderStatus`.
  - `startDate` / `endDate`: ISO 8601 date-time UTC.

---

## 4. Konvensi Tipe Data, Enum & Upload Berkas

- **ID:** UUID v4 (`@db.Uuid`).
- **Nilai Moneter:** String representasi `Decimal(12,2)` pada JSON (mis. `"75000.00"`) agar presisi nominal rupiah terjaga.
- **Timestamp:** Format ISO 8601 UTC (mis. `"2026-11-14T04:30:00.000Z"`).
- **Enum (`schema.prisma`):**
  - `UserRole`: `CUSTOMER`, `ADMIN`.
  - `OrderStatus`: `PENDING`, `PAID`, `FAILED`, `EXPIRED`, `CANCELLED`.
  - `PaymentStatus`: `PENDING`, `VERIFIED`, `FAILED`, `EXPIRED`.
- **Upload File (`multipart/form-data`):**
  - `pdfFile` (binary) untuk file PDF e-book ke bucket privat.
  - `coverImage` (binary) untuk gambar sampul e-book.

---

## 5. Konvensi Keamanan & Pembatasan Field

- **Header Keamanan & Autentikasi:**
  - `Authorization: Bearer <token>` untuk endpoint terproteksi.
  - `X-Webhook-Signature` untuk verifikasi callback webhook payment gateway.
  - Middleware `helmet` untuk header keamanan HTTP (`[ADA]` di `app.ts`) dan `express-rate-limit` (`[RENCANA]` pemasangan di `app.ts`).
- **Field yang Tidak Boleh Muncul di Respons Publik:**
  - `storagePath` (referensi lokasi PDF di bucket privat).
  - `password_hash` (tidak disimpan di backend, tetap dilarang diekspos).
  - `supabaseUserId` (identitas internal auth).
  - `isActive` pada respons katalog publik (hanya untuk endpoint Admin).
- **Field yang Tidak Boleh Diterima dari Klien Publik:**
  - `role` (ditetapkan backend, default `CUSTOMER`), `isActive` (dikontrol Admin).
  - `totalAmount`, `unitPrice` (dihitung backend dari `Ebook.price`).
  - `status` pesanan/pembayaran (diperbarui sistem/webhook).
  - `ratingAvg`, `salesCount` (dikelola sistem), serta bobot mentah SAW.
