# Pengujian Keamanan (`Security Testing`)

> **Status Dokumen:** `[ADA]` (Dokumentasi skenario keamanan)
> **Status Kontrol Aktual:** Sebagian fondasi `[ADA]` (mekanisme `401` pada `/admin/ping`, validasi Zod pada `validate.test.ts`, aturan `.gitignore`); sebagian besar pengujian keamanan bisnis masih `[RENCANA]`.
> **Referensi:** [`security-overview.md`](../07-security/security-overview.md), [`security-guidelines.md`](../07-security/security-guidelines.md), [`error-catalog.md`](../02-api/error-catalog.md)

---

## 1. Matriks Skenario Pengujian Keamanan

| ID | Skenario Keamanan | Ancaman | Hasil yang Diharapkan | Kontrol | Requirement | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **SEC-01** | Endpoint terproteksi tanpa token | Akses ilegal tanpa autentikasi | `401 Unauthorized` | `authenticate` middleware (`health.test.ts`) | `NFR-01` | `[ADA]` (`/admin/ping`) / `[RENCANA]` (endpoint bisnis) |
| **SEC-02** | Pelanggan (`CUSTOMER`) akses endpoint admin | Eskalasi hak akses vertikal | `403 Forbidden` | `authorize('ADMIN')` | `NFR-01`, `FR-A01` | `[RENCANA]` |
| **SEC-03** | Token kedaluwarsa atau akun `isActive = false` | Penggunaan sesi tidak sah | `401` (expired) / `403` (nonaktif) | Verifikasi JWT Supabase & status user DB | `NFR-01` | `[RENCANA]` |
| **SEC-04** | Manipulasi `role` / `isActive` dari payload klien | *Privilege escalation* | Ditolak/diabaikan oleh Zod & controller | Whitelist field & schema Zod ketat | `NFR-01`, `NFR-04` | `[RENCANA]` |
| **SEC-05** | Pelanggan mengakses pesanan/akses PDF milik user lain | **IDOR** (*Insecure Direct Object Reference*) | `403 Forbidden` | Validasi kepemilikan berbasis `req.user.id` dari JWT | `NFR-01`, `FR-C10` | `[RENCANA]` |
| **SEC-06** | Minta akses PDF tanpa pembelian atau saat `isRevoked = true` | Pembajakan konten berbayar | `403 EBOOK_ACCESS_DENIED` | Cek `EbookAccess` & `!isRevoked` di backend | `NFR-02`, `FR-C11` | `[RENCANA]` |
| **SEC-07** | Verifikasi TTL *signed URL* & penyembunyian `storagePath` | Kebocoran URL PDF permanen | *Signed URL* TTL pendek (300s); `storagePath` tidak ada di API katalog | Bucket privat + `createPrivatePdfSignedUrl` | `NFR-02`, `FR-C03` | `[RENCANA]` *(helper `[ADA]`)* |
| **SEC-08** | Webhook dengan signature tidak valid | *Webhook spoofing* / pelunasan palsu | `401 WEBHOOK_SIGNATURE_INVALID` | Verifikasi HMAC/signature gateway | `FR-C08`, `NFR-06` | `[RENCANA]` |
| **SEC-09** | Webhook duplikat & nominal berbeda | Transaksi ganda / manipulasi nominal | `200 DUPLICATE_WEBHOOK` (idempoten); `400 PAYMENT_VERIFICATION_FAILED` | `prisma.$transaction` + `@unique` DB + cek nominal | `NFR-06` | `[RENCANA]` |
| **SEC-10** | Manipulasi harga pada request checkout | Pembayaran di bawah harga asli | Harga klien diabaikan; backend memakai `Ebook.price` | Kalkulasi total murni di backend | `FR-C07`, `NFR-07` | `[RENCANA]` |
| **SEC-11** | Audit secret (.env, `VITE_*`, Flutter) & kebocoran pesan error | Kebocoran kredensial & informasi internal | Tidak ada secret di Git/klien; error tidak bocorkan SQL/stack trace/`storagePath` | `.gitignore`, `env.ts`, `error.middleware.ts` | `NFR-03` | `[ADA]` (aturan) / `[RENCANA]` (audit CI) |
| **SEC-12** | Rate limiting pada endpoint sensitif (login, webhook, access-url) | *Brute-force* / *abuse* | `429 RATE_LIMITED` | `rate-limit.middleware.ts` *(belum terpasang di `app.ts`)* | `NFR-04` | `[RENCANA]` |
| **SEC-13** | Validasi input tidak valid, SQLi, & XSS | Injeksi payload berbahaya | `400 VALIDATION_ERROR` oleh Zod; query terparameter Prisma; header Helmet | Zod `validate.ts` (`validate.test.ts`), Prisma, Helmet | `NFR-04` | `[ADA]` (`validate.test.ts`) / `[RENCANA]` (per modul) |
