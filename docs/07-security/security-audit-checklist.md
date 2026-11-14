# Checklist Audit Keamanan (`Security Audit Checklist`)

**Status:** `[RENCANA]` (digunakan sebelum dan sesudah rilis staging/produksi)  
**Referensi Utama:** [`AGENTS.md`](../../AGENTS.md), [`security-guidelines.md`](./security-guidelines.md), [`docs/09-testing/test-cases.md`](../09-testing/test-cases.md).

---

## 1. Checklist Audit Pra-Rilis (`[RENCANA]`)

| ID | Kategori | Item Pemeriksaan | Cara Verifikasi | Status |
|---|---|---|---|---|
| **SEC-01** | Secret Management | Tidak ada file `.env` atau keystore di Git | Jalankan `git status` & cek riwayat commit | `[RENCANA]` |
| **SEC-02** | Secret Management | Tidak ada secret di `VITE_*` (`web/*`) | Cari pola `SERVICE_ROLE`, `WEBHOOK_SECRET`, `DATABASE_URL` di `web/` | `[RENCANA]` |
| **SEC-03** | Secret Management | Tidak ada secret di kode Flutter (`mobile/`) | Periksa `mobile/ebook_store/lib/` | `[RENCANA]` |
| **SEC-04** | Secret Management | Secret produksi di env manager hosting | Verifikasi dashboard platform hosting | `[RENCANA]` |
| **SEC-05** | Database & Storage | Bucket `ebooks-private` berstatus Private | Cek dashboard Supabase Storage (public access OFF) | `[RENCANA]` |
| **SEC-06** | Database & Storage | `DATABASE_URL` (6543) & `DIRECT_URL` (5432) tepat | Verifikasi konfigurasi runtime & `prisma.config.ts` | `[RENCANA]` |
| **SEC-07** | Database & Storage | Backup harian PostgreSQL Supabase aktif | Cek pengaturan backup di proyek Supabase | `[RENCANA]` |
| **SEC-08** | API & Network | HTTPS/TLS aktif di backend, web, & webhook | Uji koneksi `https://` & validitas sertifikat | `[RENCANA]` |
| **SEC-09** | API & Network | `CORS_ORIGINS` hanya mengizinkan domain resmi | Uji preflight dari origin asing (harus ditolak) | `[RENCANA]` |
| **SEC-10** | API & Network | `helmet()`, `express.json({ limit: '1mb' })`, & rate limiter aktif | Cek `app.ts` dan header respons HTTP | `[ADA]` sebagian / `[RENCANA]` limiter |
| **SEC-11** | Auth & RBAC | `authenticate` & `authorize('ADMIN')` menegakkan 401/403 | Uji endpoint admin memakai token `CUSTOMER` -> `403` | `[ADA]` `/admin/ping` / `[RENCANA]` bisnis |
| **SEC-12** | Auth & RBAC | Anti-IDOR (`req.user.id`) & penolakan `isActive = false` | Uji akses order/akses milik user lain -> `403`/`404` | `[RENCANA]` |
| **SEC-13** | PDF Protection | `storagePath` tidak terekspos & `isRevoked` dicek | Periksa JSON `/ebooks` dan uji `EbookAccess.isRevoked = true` -> `403` | `[RENCANA]` |
| **SEC-14** | Payment Security | Signature webhook, nominal, idempotensi, & atomik | Uji webhook signature salah (`401`) & duplikat (`200` no mutation) | `[RENCANA]` |
| **SEC-15** | SAW Security | Bobot klien ditolak; validasi `Σ = 1.0`; admin-only | Uji `GET /recommendations/saw` & `PUT /admin/saw/weights` | `[RENCANA]` |
| **SEC-16** | Error Sanitization | Tidak ada stack trace, query SQL, atau `storagePath` di error | Picu error `400` dan `500`, periksa payload JSON | `[ADA]` (`errorHandler`) / `[RENCANA]` modul |

---

## 2. Audit Pasca-Rilis (`[RENCANA]`)

- Pemindaian secret otomatis pada repository (*secret scanning*).
- Uji penetrasi ringan pada endpoint auth, checkout, webhook, dan signed URL.
- Verifikasi langsung bahwa bucket `ebooks-private` tidak bisa diakses tanpa signed URL.
- Pengaktifan audit log terpusat dan alerting lonjakan `401`/`403`/`5xx`.

---

## 3. Template Tabel Hasil Audit (`[RENCANA]`)

| ID | Item | Hasil Audit | Temuan | Tindakan | Status |
|---|---|---|---|---|---|
| `SEC-xx` | *Contoh: Verifikasi `storagePath` tidak terekspos* | *Belum dijalankan* | *—* | *Jalankan saat endpoint katalog selesai* | `[RENCANA]` |
