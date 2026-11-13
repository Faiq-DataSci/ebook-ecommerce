# Gambaran Umum Keamanan (`Security Overview`)

**Status:** `[NOT AVAILABLE]` (kontrol runtime backend/klien belum diimplementasikan) | `[CONFIRMED]` (kebijakan keamanan pada `AGENTS.md`) | `[PROPOSED]` (kontrol teknis target)

> **Catatan Kejujuran Audit:** Karena kode backend, database, dan fitur aplikasi klien belum diimplementasikan, **sistem ini belum dapat diklaim aman secara operasional**. Dokumen ini memetakan kebijakan yang telah ditetapkan dan kontrol keamanan yang wajib dibangun serta diuji sebelum rilis.

---

## 1. Matriks Status Kontrol Keamanan

| Domain Keamanan | Status Aktual | Target / Kebijakan yang Ditetapkan |
|---|---|---|
| **Authentication** | `[NOT AVAILABLE]` | Autentikasi berbasis token (Express JWT kustom atau Supabase Auth — menunggu keputusan) `[PROPOSED]` |
| **Authorization (RBAC)** | `[NOT AVAILABLE]` | Penegakan token + role (`CUSTOMER` / `ADMIN`) di backend; UI hanya kosmetik `[CONFIRMED]` |
| **Password Hashing** | `[NOT AVAILABLE]` | Hashing satu arah (`bcrypt` / `argon2id` dengan salt per-user) `[PROPOSED]` |
| **Session / Token Management** | `[NOT AVAILABLE]` | Access token berumur pendek, penyimpanan aman di klien (`flutter_secure_storage` untuk mobile `[PROPOSED]`) |
| **Validasi Input** | `[NOT AVAILABLE]` | Validasi skema ketat menggunakan **Zod** di backend `[CONFIRMED]` |
| **Proteksi API** | `[NOT AVAILABLE]` | CORS terkonfigurasi, rate limiting pada auth/payment, header keamanan (`helmet`) `[PROPOSED]` |
| **Perlindungan Kredensial & `.env`** | `[IMPLEMENTED]` (sebagian di `.gitignore`) | `.env` & `.env.*` (kecuali `.env.example`) diabaikan Git; dilarang menaruh secret di `VITE_*` atau Flutter `[CONFIRMED]` |
| **Perlindungan Data Pelanggan** | `[NOT AVAILABLE]` | Penyaringan `password_hash` dari respons API, pencegahan IDOR dengan verifikasi `req.user.id` `[PROPOSED]` |
| **Keamanan File E-Book (PDF)** | `[NOT AVAILABLE]` | Penyimpanan pada **Supabase Storage bucket privat**; akses hanya via *signed URL* sementara dari backend `[CONFIRMED]` |
| **Validasi Pembayaran** | `[NOT AVAILABLE]` | Verifikasi nominal & signature di server, idempotensi callback, transaksi DB atomik `[PROPOSED]` |
| **Pencegahan Akses Tanpa Hak** | `[NOT AVAILABLE]` | Verifikasi record `ebook_accesses` (`is_revoked = false`) sebelum menerbitkan *signed URL* `[PROPOSED]` |
| **Penanganan Error** | `[NOT AVAILABLE]` | Pesan error generik untuk klien; detail teknis/stack trace hanya dicatat di log server `[PROPOSED]` |
| **Audit Log** | `[NOT AVAILABLE]` | Pencatatan aktivitas kritis (login gagal berulang, verifikasi pembayaran, perubahan katalog/hak akses) `[PROPOSED]` |
