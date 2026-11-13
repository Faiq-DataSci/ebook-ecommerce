# Gambaran Umum Keamanan (`Security Overview`)

**Status:** `[RENCANA]` (kontrol runtime backend/klien belum diimplementasikan) | `[RENCANA]` (kebijakan keamanan pada `AGENTS.md`) | `[RENCANA]` (kontrol teknis target)

> **Catatan Kejujuran Audit:** Karena kode backend, database, dan fitur aplikasi klien belum diimplementasikan, **sistem ini belum dapat diklaim aman secara operasional**. Dokumen ini memetakan kebijakan yang telah ditetapkan dan kontrol keamanan yang wajib dibangun serta diuji sebelum rilis.

---

## 1. Matriks Status Kontrol Keamanan

| Domain Keamanan | Status Aktual | Target / Kebijakan yang Ditetapkan |
|---|---|---|
| **Authentication** | `[RENCANA]` | Autentikasi berbasis token (Express JWT kustom atau Supabase Auth — menunggu keputusan) `[RENCANA]` |
| **Authorization (RBAC)** | `[RENCANA]` | Penegakan token + role (`CUSTOMER` / `ADMIN`) di backend; UI hanya kosmetik `[RENCANA]` |
| **Password Hashing** | `[RENCANA]` | Hashing satu arah (`bcrypt` / `argon2id` dengan salt per-user) `[RENCANA]` |
| **Session / Token Management** | `[RENCANA]` | Access token berumur pendek, penyimpanan aman di klien (`flutter_secure_storage` untuk mobile `[RENCANA]`) |
| **Validasi Input** | `[RENCANA]` | Validasi skema ketat menggunakan **Zod** di backend `[RENCANA]` |
| **Proteksi API** | `[RENCANA]` | CORS terkonfigurasi, rate limiting pada auth/payment, header keamanan (`helmet`) `[RENCANA]` |
| **Perlindungan Kredensial & `.env`** | `[ADA]` (sebagian di `.gitignore`) | `.env` & `.env.*` (kecuali `.env.example`) diabaikan Git; dilarang menaruh secret di `VITE_*` atau Flutter `[RENCANA]` |
| **Perlindungan Data Pelanggan** | `[RENCANA]` | Penyaringan `password_hash` dari respons API, pencegahan IDOR dengan verifikasi `req.user.id` `[RENCANA]` |
| **Keamanan File E-Book (PDF)** | `[RENCANA]` | Penyimpanan pada **Supabase Storage bucket privat**; akses hanya via *signed URL* sementara dari backend `[RENCANA]` |
| **Validasi Pembayaran** | `[RENCANA]` | Verifikasi nominal & signature di server, idempotensi callback, transaksi DB atomik `[RENCANA]` |
| **Pencegahan Akses Tanpa Hak** | `[RENCANA]` | Verifikasi record `ebook_accesses` (`is_revoked = false`) sebelum menerbitkan *signed URL* `[RENCANA]` |
| **Penanganan Error** | `[RENCANA]` | Pesan error generik untuk klien; detail teknis/stack trace hanya dicatat di log server `[RENCANA]` |
| **Audit Log** | `[RENCANA]` | Pencatatan aktivitas kritis (login gagal berulang, verifikasi pembayaran, perubahan katalog/hak akses) `[RENCANA]` |
