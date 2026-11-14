# Suite Pengujian Keamanan (`Security Test Suite`)

**Status:** `[RENCANA]` (kecuali `TC-SEC-01` pada `health.test.ts` dan `TC-SEC-24` pada `validate.test.ts` yang `[ADA]`)  
**Referensi Utama:** [`docs/07-security/`](../07-security/security-overview.md), [`docs/02-api/error-catalog.md`](../02-api/error-catalog.md), [`backend/tests/health.test.ts`](../../backend/tests/health.test.ts), [`backend/tests/unit/validate.test.ts`](../../backend/tests/unit/validate.test.ts).

---

## 1. Matriks Test Case Keamanan (`TC-SEC-01` – `TC-SEC-26`)

| ID | Skenario Keamanan | Ancaman | Hasil yang Diharapkan | Kontrol | Requirement | Status |
|---|---|---|---|---|---|---|
| **TC-SEC-01** | Endpoint terproteksi tanpa token (`/api/v1/admin/ping`) | Akses tanpa autentikasi | `401 Unauthorized` (`UNAUTHORIZED`) | `authenticate` (`auth.middleware.ts`) | `NFR-01` | `[ADA]` (PASS) |
| **TC-SEC-02** | Pelanggan (`CUSTOMER`) akses `/api/v1/admin/*` | Escalation of Privilege | `403 FORBIDDEN` | `authorize('ADMIN')` | `NFR-01`, `FR-A01` | `[RENCANA]` |
| **TC-SEC-03** | Admin (`ADMIN`) akses `/api/v1/admin/*` | Otorisasi sah | `200 OK` | `authorize('ADMIN')` | `NFR-01`, `FR-A01` | `[RENCANA]` |
| **TC-SEC-04** | Token JWT kedaluwarsa | Replay token lama | `401` | `supabase.auth.getUser()` | `NFR-01` | `[RENCANA]` |
| **TC-SEC-05** | Akun nonaktif (`isActive = false`) | Akses akun diblokir | `403 FORBIDDEN` | Cek `User.isActive` | `NFR-01` | `[RENCANA]` |
| **TC-SEC-06** | Klien mengirim `role: "ADMIN"` saat sync/update | Manipulasi role | Ditolak (`400`) / diabaikan | Zod `.strict()` | `FR-C02`, `NFR-01` | `[RENCANA]` |
| **TC-SEC-07** | Pelanggan melihat pesanan milik user lain | IDOR Order | `403 FORBIDDEN` | Filter `req.user.id` | `NFR-01` | `[RENCANA]` |
| **TC-SEC-08** | Pelanggan meminta akses e-book milik user lain | IDOR EbookAccess | `403 EBOOK_ACCESS_DENIED` | Filter `req.user.id` | `NFR-02` | `[RENCANA]` |
| **TC-SEC-09** | Parameter `userId` dikirim lewat body/query | IDOR Spoofing | Backend memakai `req.user.id` dari JWT | Auth middleware | `NFR-01` | `[RENCANA]` |
| **TC-SEC-10** | Akses PDF tanpa pembelian | Pembajakan konten | `403 EBOOK_ACCESS_DENIED` | Cek `EbookAccess` | `NFR-02` | `[RENCANA]` |
| **TC-SEC-11** | Akses PDF dengan `isRevoked = true` | Akses dicabut | `403 EBOOK_ACCESS_DENIED` | Cek `!isRevoked` | `NFR-02`, `FR-A11` | `[RENCANA]` |
| **TC-SEC-12** | Signed URL memiliki TTL pendek (<= 300s) | Penyebaran URL | `expiresInSeconds <= 300` | `createPrivatePdfSignedUrl` | `NFR-02` | `[RENCANA]` |
| **TC-SEC-13** | `storagePath` tidak muncul di respons API publik | Kebocoran path bucket | Field `storagePath` tidak ada di JSON | DTO publik | `NFR-02` | `[RENCANA]` |
| **TC-SEC-14** | Bucket Supabase Storage tetap privat | Akses publik langsung | Akses langsung tanpa signed URL ditolak | Private bucket | `NFR-02` | `[RENCANA]` |
| **TC-SEC-15** | Webhook signature tidak valid | Webhook palsu | `401 WEBHOOK_SIGNATURE_INVALID` | Verifikasi HMAC/signature | `NFR-06` | `[RENCANA]` |
| **TC-SEC-16** | Webhook dikirim dua kali (duplikat) | Transaksi ganda | `200 DUPLICATE_WEBHOOK` (idempoten) | Cek status final | `NFR-06` | `[RENCANA]` |
| **TC-SEC-17** | Nominal webhook != `Payment.amount` | Manipulasi nominal | `400 PAYMENT_VERIFICATION_FAILED` | Cek nominal DB | `FR-C08` | `[RENCANA]` |
| **TC-SEC-18** | Harga checkout dikirim klien | Manipulasi harga | `totalAmount` tetap dihitung dari DB | Harga DB | `FR-C07`, `NFR-07` | `[RENCANA]` |
| **TC-SEC-19** | Tidak ada file `.env` ter-commit di Git | Kebocoran secret repo | `git status` & diff bebas `.env` | `.gitignore` | `NFR-03` | `[RENCANA]` |
| **TC-SEC-20** | Tidak ada secret di `VITE_*` | Kebocoran bundle web | Tidak ada `SERVICE_ROLE`/`WEBHOOK_SECRET` | Aturan `AGENTS.md` | `NFR-03` | `[RENCANA]` |
| **TC-SEC-21** | Tidak ada secret di kode Flutter | Reverse engineering APK | Tidak ada kunci privat di Dart | `mobile/AGENTS.md` | `NFR-03` | `[RENCANA]` |
| **TC-SEC-22** | Pesan error aman (no stack trace/SQL/`storagePath`) | Information Disclosure | Respons error generik terstruktur | `errorHandler` | `NFR-04` | `[RENCANA]` |
| **TC-SEC-23** | Rate limiter aktif pada endpoint sensitif | Brute-force / flood | `429 RATE_LIMITED` | `sensitiveEndpointLimiter` | `NFR-04` | `[RENCANA]` |
| **TC-SEC-24** | Payload tidak valid ditolak Zod | Input korup / malformed | `400 VALIDATION_ERROR` (`ZodError`) | `validate.ts` | `NFR-04` | `[ADA]` (PASS) |
| **TC-SEC-25** | Upaya SQL injection pada query/search | SQL Injection | Query terparameter Prisma aman | Prisma ORM | `NFR-04` | `[RENCANA]` |
| **TC-SEC-26** | Upaya XSS pada input string | Cross-Site Scripting | Ditolak Zod / header `helmet()` aktif | `helmet()` + Zod | `NFR-04` | `[RENCANA]` |

---

## 2. Status Kontrol Keamanan Aktual

- **`[ADA]`:** Mekanisme `401` (`health.test.ts`), validasi Zod (`validate.test.ts`), `helmet()`, CORS, `errorHandler`, `.gitignore`, dan helper `createPrivatePdfSignedUrl`.
- **`[RENCANA]`:** Pemasangan `sensitiveEndpointLimiter` di `app.ts`, seluruh test keamanan bisnis (`TC-SEC-02` s.d. `TC-SEC-23`, `25`–`26`), serta audit penetrasi pra-rilis.
