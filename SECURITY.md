# Security Policy

## 1. Kebijakan Keamanan
Keamanan data pelanggan, kredensial infrastruktur (PostgreSQL Supabase, Supabase Service Role Key, Payment Gateway), dan hak akses file PDF di Supabase Storage bucket privat merupakan prioritas utama pada pengembangan proyek **Sistem Informasi E-Commerce E-Book**.

> **Catatan Status:** Fitur autentikasi endpoint bisnis, webhook pembayaran, dan penerbitan *signed URL* masih dalam tahap pengembangan (`[RENCANA]`). Saat ini baru tersedia middleware `authenticate`/`authorize`, `helmet`, `cors`, dan `express-rate-limit` di `backend/`.

---

## 2. Versi yang Didukung
Proyek saat ini berada pada tahap pra-rilis (`0.1.0` / cabang `master`). Pembaruan keamanan diterapkan langsung pada cabang pengembangan aktif.

---

## 3. Pelaporan Kerentanan
Jika Anda menemukan celah keamanan atau potensi kebocoran kredensial:
1. **Jangan** membuat *public issue* di GitHub yang memaparkan detail eksploitasi atau nilai kredensial.
2. Laporkan secara privat kepada pengelola repository (tim proyek 2DSRA / pemilik repository).
3. Sertakan deskripsi singkat, lokasi file/endpoint, langkah reproduksi, dan dampak potensial.

---

## 4. Pedoman Informasi Sensitif
Dilarang keras menyimpan atau melakukan commit ke repository Git untuk:
- File `.env` atau `.env.*` (kecuali `.env.example` yang hanya berisi placeholder).
- `SUPABASE_SERVICE_ROLE_KEY`, password database (`DATABASE_URL`, `DIRECT_URL`), kunci payment gateway (`PAYMENT_GATEWAY_SERVER_KEY`, `PAYMENT_GATEWAY_WEBHOOK_SECRET`), atau token aktif.
- File signing Android (`*.keystore`, `*.jks`), sertifikat privat (`*.pem`, `*.key`, `*.p12`, `*.pfx`), maupun dump database (`*.sql`, `*.sqlite`, `*.db`, `*.bak`).
- Data pribadi pelanggan asli atau dokumen internal/akademik yang tidak ditujukan untuk publik.

---

## 5. Pengelolaan Kredensial
- Seluruh secret hanya disimpan di file `.env` lokal atau *environment secret manager* pada platform deployment.
- Variabel frontend (`VITE_*` pada `web/admin-web` dan `web/pengunjung-web`) serta kode aplikasi `mobile/ebook_store` hanya boleh menggunakan key publik (`VITE_SUPABASE_ANON_KEY`), **tidak boleh** memuat `SUPABASE_SERVICE_ROLE_KEY` atau secret server.
- Akses file PDF e-book di Supabase Storage bucket privat hanya diberikan melalui *signed URL* sementara dari backend setelah verifikasi kepemilikan (`[RENCANA]`).

---

## 6. Prosedur Pembaruan & Insiden Keamanan
Jika kredensial terlanjur masuk ke working tree atau riwayat Git:
1. Hentikan proses commit/push.
2. Segera lakukan **rotasi / revoke** kredensial terkait di dashboard Supabase atau penyedia payment gateway.
3. Evaluasi pembersihan riwayat Git sebelum repository dibagikan.
4. Periksa pengaturan GitHub: pastikan repository berstatus **Private**, serta fitur **Secret scanning** dan **Push protection** aktif.
