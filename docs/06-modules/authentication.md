# Modul Autentikasi & Manajemen Pengguna

**Status Implementasi:** `[RENCANA]` — Belum ada implementasi di `backend/`, `web/admin-web/`, maupun `mobile/ebook_store/`.

Dokumen ini mencakup **1. Authentication Module** dan **2. User Management Module**.

---

## A. Authentication Module (`[RENCANA]` / `[RENCANA]`)

| Aspek | Keterangan |
|---|---|
| **Tujuan Modul** | Mengamankan akses sistem melalui registrasi, login, penerbitan token sesi, dan penegakan otorisasi berbasis role (`CUSTOMER` / `ADMIN`). |
| **Fungsi Utama** | Registrasi pelanggan, login pelanggan & admin, verifikasi token pada setiap permintaan terproteksi, dan pengelolaan sesi/logout (`[RENCANA]`). |
| **Aktor** | Pelanggan (*Customer*) dan Admin. |
| **Input** | Registrasi: `fullName`, `email`, `password`, `phone?`. Login: `email`, `password`. Permintaan terproteksi: `Authorization: Bearer <token>`. |
| **Proses** | 1) Validasi input via Zod (`[RENCANA]`). 2) Hashing/verifikasi password (`bcrypt`/`argon2` `[RENCANA]`). 3) Penerbitan token JWT atau sesi Supabase Auth (menunggu keputusan di `keputusan-terbuka.md`). 4) Middleware memeriksa token dan role sebelum masuk ke controller. |
| **Output** | Token akses (`accessToken`), profil ringkas user (tanpa `password_hash`), atau status error `401`/`403`. |
| **Hubungan Modul** | Menjadi prasyarat bagi seluruh modul terproteksi (User, Order, Payment, E-Book Access, Admin Dashboard, Reporting). |
| **File/Direktori Aktual** | Belum tersedia di `backend/`, `web/admin-web/`, maupun `mobile/ebook_store/`. |
| **Potensi Masalah / Keterbatasan** | Pilihan antara JWT Express kustom vs Supabase Auth belum diputuskan (`keputusan-terbuka.md` no. 3). |

---

## B. User Management Module (`[RENCANA]` / `[RENCANA]`)

| Aspek | Keterangan |
|---|---|
| **Tujuan Modul** | Mengelola data profil pelanggan serta menyediakan fungsi pemantauan pelanggan bagi admin sesuai kewenangan. |
| **Fungsi Utama** | Melihat & memperbarui profil pelanggan sendiri; melihat daftar dan status aktif pelanggan oleh admin (`[RENCANA]`). |
| **Aktor** | Pelanggan (profil sendiri) dan Admin (daftar pelanggan). |
| **Input** | ID user dari token sesi; parameter pencarian/paginasi (admin); data pembaruan profil (`fullName`, `phone`). |
| **Proses** | Validasi hak akses (hanya pemilik akun atau role `ADMIN`), query ke tabel `customers`/`admins`, dan penyaringan kolom sensitif sebelum dikirim ke klien. |
| **Output** | Objek profil pengguna atau daftar pelanggan berpaginasi (tanpa kredensial/hash). |
| **Hubungan Modul** | Bergantung pada Authentication Module; direferensikan oleh Order, Transaction, dan E-Book Access Module. |
| **File/Direktori Aktual** | Belum tersedia. |
| **Potensi Masalah / Keterbatasan** | Perlu pembatasan ketat agar admin tidak dapat mengubah data sensitif tanpa jejak audit dan pelanggan tidak dapat mengakses data pelanggan lain (IDOR). |
