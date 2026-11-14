# Panduan Deployment Backend (`Express 5 + TypeScript + Prisma 7`)

**Status:** `[RENCANA]` (belum di-deploy ke server produksi; fondasi aplikasi & build script `[ADA]`)  
**Target Kode:** `backend/`  
**Referensi Utama:** [`backend/package.json`](../../backend/package.json), [`backend/src/app.ts`](../../backend/src/app.ts), [`backend/src/server.ts`](../../backend/src/server.ts), [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md).

---

## 1. Spesifikasi Build & Runtime Aktual (`[ADA]`)

Berdasarkan `backend/package.json` dan `backend/src/`:

- **Runtime & Module:** Node.js ESM (`"type": "module"`). Semua import relatif di `backend/src/**/*.ts` wajib memakai ekstensi `.js`.
- **Framework & Dependensi Inti:** `express ^5.3.0`, `@prisma/client ^7.10.0`, `@prisma/adapter-pg ^7.10.0`, `@supabase/supabase-js ^2.119.0`, `pg ^8.23.1`, `zod ^4.6.7`, `helmet ^8.3.0`, `express-rate-limit ^8.7.4`.
- **Skrip NPM (`backend/package.json`):**
  - `npm run dev`: `tsx watch src/server.ts` (development lokal).
  - `npm run typecheck`: `tsc --noEmit`.
  - `npm run build`: `tsc` (mengompilasi ke `dist/`).
  - `npm run start`: `node dist/server.js`.
  - `npm run test`: `vitest run`.
  - `npm run prisma:validate`: `prisma validate`.
- **Entry Point (`backend/src/server.ts`):** Memanggil `app.listen(env.PORT, ...)` dengan `PORT` default `3000` dari `env.ts`.
- **Endpoint yang Sudah Tersedia (`backend/src/app.ts`):**
  - `GET /api/v1/health` -> mengembalikan HTTP `200` dengan `{ success: true, message: "Backend E-Book Store siap", data: { status: "ok", environment } }`.
  - `GET /api/v1/admin/ping` -> dilindungi `authenticate` dan `authorize('ADMIN')`.

---

## 2. Perbandingan Opsi Hosting Produksi (`[RENCANA]` — Keputusan #10)

Sesuai [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md), pemilihan hosting backend produksi masih terbuka antara dua opsi:

| Kriteria | Opsi A: PaaS Node.js *Long-Running* (Railway / Render / VPS) `[RENCANA]` | Opsi B: Serverless (Vercel Functions) `[RENCANA]` |
|---|---|---|
| **Kesesuaian Kode Saat Ini** | Langsung kompatibel dengan `app.listen(env.PORT)` di `server.ts` | Membutuhkan wrapper/export handler Express (`api/index.ts`) tanpa `app.listen` permanen |
| **Koneksi Database Prisma (`PrismaPg`)** | `pg.Pool` stabil menggunakan `DATABASE_URL` (port `6543` atau `5432`) | Wajib memakai Supabase Transaction Pooler (`port 6543`, `?pgbouncer=true`) dan batas koneksi rendah agar tidak kehabisan koneksi |
| **Cold Start & Webhook** | Tidak ada cold start pada instance aktif; aman untuk webhook payment gateway | Rentan *cold start* yang dapat memicu timeout pada callback payment gateway |
| **Operasional & Biaya** | Pengelolaan proses/port standar; dukungan *graceful shutdown* penuh | Skalabilitas otomatis per request, namun ada batas durasi eksekusi fungsi |

> **Catatan:** Jangan memilih atau mengunci salah satu opsi di luar persetujuan pengguna pada Keputusan #10. Dokumentasi ini menjaga kompatibilitas rancangan untuk kedua opsi.

---

## 3. Kebutuhan Kesiapan Produksi yang Belum Terpasang (`[RENCANA]`)

1. **Graceful Shutdown (`backend/src/server.ts`):**
   - `backend/src/config/prisma.ts` sudah menyediakan fungsi `disconnectDatabase()` (`[ADA]`), namun `server.ts` belum menangkap sinyal `SIGTERM` dan `SIGINT` untuk menutup HTTP server dan memanggil `disconnectDatabase()` sebelum proses berhenti (`[RENCANA]`).
2. **Mounting Rate Limiter (`backend/src/app.ts`):**
   - File `backend/src/middlewares/rate-limit.middleware.ts` (`[ADA]`) dan paket `express-rate-limit` sudah tersedia, tetapi belum dipasang ke `app.ts` (`[RENCANA]`).
3. **Readiness Check Database pada Health Endpoint:**
   - `backend/src/config/prisma.ts` menyediakan `checkDatabaseConnection()` (`[ADA]`), namun `GET /api/v1/health` saat ini baru mengembalikan status proses Express statis (belum mengecek konektivitas DB/readiness) (`[RENCANA]`).
4. **Konfigurasi `CORS_ORIGINS` Produksi:**
   - Default di `env.ts` adalah `http://localhost:5173,http://localhost:5174` (`[ADA]`). Di produksi wajib diisi domain HTTPS resmi `admin-web` dan `pengunjung-web` (`[RENCANA]`).
5. **Endpoint Webhook Payment Gateway (`POST /api/v1/payments/webhook`):**
   - Wajib diekspos via HTTPS publik, memverifikasi signature menggunakan `PAYMENT_GATEWAY_WEBHOOK_SECRET`, dan bersifat idempoten (`[RENCANA]`).

---

## 4. Alur Build & Start Produksi Target (`[RENCANA]`)

Urutan perintah standar untuk target PaaS Node.js `[RENCANA]`:

1. Pasang dependensi bersih: `npm ci`
2. Generate Prisma Client: `npx prisma generate`
3. Jalankan migrasi produksi (menggunakan `DIRECT_URL` port `5432`): `npx prisma migrate deploy`
4. Validasi tipe & kompilasi TypeScript: `npm run typecheck && npm run build`
5. Jalankan server hasil kompilasi: `npm run start` (`node dist/server.js`)
6. Verifikasi kesiapan: `GET https://<domain-backend>/api/v1/health` mengembalikan HTTP `200`.
