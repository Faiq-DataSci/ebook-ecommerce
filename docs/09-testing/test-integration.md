# Rencana Pengujian Integrasi (`Integration Test Plan`)

**Status:** `[RENCANA]` (0 tes integrasi DB/Auth/Storage/Gateway dieksekusi; baru terdapat 2 tes Supertest in-memory pada `health.test.ts` `[ADA]`)  
**Referensi Utama:** [`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma), [`docs/02-api/webhook-contract.md`](../02-api/webhook-contract.md), [`supabase-storage.ts`](../../backend/src/integrations/storage/supabase-storage.ts).

---

## 1. Lingkup Pengujian Integrasi

1. **Backend <-> PostgreSQL Supabase:** Query Prisma 7 + `PrismaPg`, constraint `@unique`, `onDelete: Restrict`, dan `prisma.$transaction`.
2. **Backend <-> Supabase Auth:** Verifikasi JWT (`getUser`) dan sinkronisasi tabel `users`.
3. **Backend <-> Supabase Storage:** Upload PDF ke bucket privat `ebooks-private` dan penerbitan signed URL sementara.
4. **Backend <-> Payment Gateway:** Inisiasi pembayaran sandbox dan callback webhook ber-signature.
5. **Klien (Mobile/Web) <-> Backend:** Bearer JWT, respons terpaginasi, dan *in-app reader* via signed URL.

---

## 2. Matriks Test Case Integrasi (`TC-INT-01` – `TC-INT-23` — `[RENCANA]`)

| ID | Integrasi | Skenario | Hasil yang Diharapkan | Prasyarat | Status |
|---|---|---|---|---|---|
| **TC-INT-01** | Database (Prisma) | Koneksi DB (`checkDatabaseConnection`) | `SELECT 1` berhasil | DB test aktif | `[RENCANA]` |
| **TC-INT-02** | Database (Prisma) | Query `Ebook` aktif berpaginasi | List sesuai filter & indeks | Migrasi + seed | `[RENCANA]` |
| **TC-INT-03** | Database (Prisma) | Transaksi atomik `prisma.$transaction` | `Payment`, `Order`, `Transaction`, `EbookAccess` commit bersama | DB test | `[RENCANA]` |
| **TC-INT-04** | Database (Prisma) | Rollback transaksi saat gagal | Seluruh perubahan batal | DB test | `[RENCANA]` |
| **TC-INT-05** | Database (Prisma) | Constraint `@@unique([orderId, ebookId])` | Tolak duplikasi item order | DB test | `[RENCANA]` |
| **TC-INT-06** | Database (Prisma) | Constraint `@@unique([userId, ebookId])` | Tolak duplikasi `EbookAccess` | DB test | `[RENCANA]` |
| **TC-INT-07** | Database (Prisma) | `onDelete: Restrict` kategori ber-e-book | Tolak hapus (`409`) | DB test | `[RENCANA]` |
| **TC-INT-08** | Supabase Auth | Verifikasi JWT valid via `getUser()` | `req.user` terisi | Supabase test | `[RENCANA]` |
| **TC-INT-09** | Supabase Auth | Verifikasi JWT kedaluwarsa | `401` | Supabase test | `[RENCANA]` |
| **TC-INT-10** | Supabase Auth | Verifikasi JWT tidak valid | `401` | Supabase test | `[RENCANA]` |
| **TC-INT-11** | Supabase Auth | Sinkronisasi `User` (`POST /auth/sync`) | Record `users` terbuat/terupdate | Supabase + DB | `[RENCANA]` |
| **TC-INT-12** | Supabase Storage | Upload PDF ke bucket privat oleh admin | File tersimpan di `ebooks-private` | Bucket test | `[RENCANA]` |
| **TC-INT-13** | Supabase Storage | Generate signed URL dari `storagePath` | URL bertanda tangan valid | Bucket test | `[RENCANA]` |
| **TC-INT-14** | Supabase Storage | Signed URL expired setelah TTL | Akses ditolak Storage | Bucket test | `[RENCANA]` |
| **TC-INT-15** | Supabase Storage | Akses bucket privat tanpa service role | Ditolak (`403`/`401`) | Bucket privat | `[RENCANA]` |
| **TC-INT-16** | Payment Gateway | Buat transaksi pembayaran sandbox | `Payment (PENDING)` + `externalRef` | Gateway sandbox | `[RENCANA]` |
| **TC-INT-17** | Payment Gateway | Webhook `VERIFIED` | Atomik update `PAID` + `EbookAccess` | Sandbox + secret | `[RENCANA]` |
| **TC-INT-18** | Payment Gateway | Webhook `FAILED` | Status `FAILED`, tanpa akses | Sandbox + secret | `[RENCANA]` |
| **TC-INT-19** | Payment Gateway | Webhook duplikat | `200 DUPLICATE_WEBHOOK` | Sandbox + DB | `[RENCANA]` |
| **TC-INT-20** | Payment Gateway | Webhook signature salah | `401 WEBHOOK_SIGNATURE_INVALID` | Handler webhook | `[RENCANA]` |
| **TC-INT-21** | Klien <-> Backend | Mobile/Web kirim Bearer JWT | Backend verifikasi sukses | Klien + Backend | `[RENCANA]` |
| **TC-INT-22** | Klien <-> Backend | Mobile/Web terima data terpaginasi | Render daftar katalog | Klien + Backend | `[RENCANA]` |
| **TC-INT-23** | Klien <-> Backend | Mobile/Web buka PDF via signed URL | Render PDF *in-app* | Klien + Storage | `[RENCANA]` |

---

## 3. Prasyarat Lingkungan Integrasi & Strategi Mock vs Real (`[RENCANA]`)

- **Prasyarat:** Database Supabase test terpisah (`.env.test`), Supabase Auth aktif, bucket privat test dibuat, gateway sandbox aktif, dan tunneling lokal (ngrok) untuk callback webhook.
- **Mock vs Real:** Unit test menggunakan mock penuh (Prisma, Auth, Storage, Gateway); integration test menggunakan DB test & Auth test nyata, serta Storage/Gateway sandbox.
