# Rencana Respons Insiden (`Incident Response Plan`)

**Status:** `[RENCANA]` — Rencana operasional penanganan insiden setelah sistem memasuki tahap staging/produksi.  
**Referensi Utama:** [`SECURITY.md`](../../SECURITY.md), [`docs/07-security/security-guidelines.md`](../07-security/security-guidelines.md), [`backend/src/app.ts`](../../backend/src/app.ts), [`backend/src/config/prisma.ts`](../../backend/src/config/prisma.ts).

---

## 1. Tujuan

Meminimalkan dampak gangguan layanan, melindungi integritas data transaksi dan konten PDF privat, serta memulihkan sistem secara terstruktur dan terdokumentasi.

---

## 2. Klasifikasi Tingkat Insiden (`[RENCANA]`)

| Level | Kriteria | Contoh Insiden | Eskalasi | Status |
|---|---|---|---|---|
| **P1 (Kritis)** | Sistem lumpuh total, kehilangan data, kebocoran secret/PDF privat, atau kegagalan pembayaran total | Backend down total, `SUPABASE_SERVICE_ROLE_KEY` bocor, bucket Storage menjadi publik, webhook gagal massal | Seluruh Tim + Pemilik Proyek | `[RENCANA]` |
| **P2 (Tinggi)** | Fitur inti terganggu berat atau performa sangat lambat bagi sebagian besar pengguna | Endpoint checkout/SAW gagal, database pool sering timeout, error rate `5xx` > 5% | Tech Lead / Backend Lead | `[RENCANA]` |
| **P3 (Sedang)** | Fitur non-kritis gagal atau error rate meningkat namun layanan inti masih berjalan | Gagal ekspor laporan admin, sebagian gambar cover gagal muat | Developer On-Call | `[RENCANA]` |
| **P4 (Rendah)** | Bug minor atau masalah tampilan kosmetik tanpa dampak transaksi | Ketidakselarasan layout minor pada ukuran layar tertentu | Backlog Perbaikan | `[RENCANA]` |

---

## 3. Tahapan Respons Insiden & SLA (`[RENCANA]`)

| Tahap | Aktivitas Utama | Penanggung Jawab | Target SLA (`P1`) | Status |
|---|---|---|---|---|
| **1. Deteksi** | Menerima alert dari monitoring atau laporan pengguna/admin | On-Call / Monitoring | 5 menit | `[RENCANA]` |
| **2. Acknowledge** | Konfirmasi insiden aktif, tetapkan level (`P1`–`P4`), buka kanal koordinasi | On-Call | 10 menit | `[RENCANA]` |
| **3. Investigasi** | Analisis log error, cek health/DB/gateway, identifikasi akar masalah | Developer / DBA | 30 menit | `[RENCANA]` |
| **4. Mitigasi** | Terapkan pemulihan cepat (rollback rilis, restart, rotasi kunci, kunci bucket) | Developer / DevOps | 1 jam | `[RENCANA]` |
| **5. Resolusi** | Terapkan perbaikan permanen, uji ulang, dan verifikasi sistem stabil | Developer | 4 jam | `[RENCANA]` |
| **6. Post-Mortem** | Susun dokumen post-mortem dan daftar tindakan pencegahan | Tech Lead | 48 jam | `[RENCANA]` |

---

## 4. Playbook Skenario Insiden Spesifik

### A. Backend Down (`[RENCANA]` Operasional / `[ADA]` Endpoint & Helper)
1. Periksa status endpoint `GET /api/v1/health` (`[ADA]`).
2. Periksa log server hosting untuk melihat error startup atau `Unhandled server error`.
3. Periksa konektivitas database menggunakan `checkDatabaseConnection()` (`[ADA]` di `prisma.ts`).
4. Lakukan restart proses backend (`[RENCANA]`).
5. Jika masih gagal setelah update terbaru, lakukan rollback ke versi stabil sebelumnya (`[RENCANA]`).

### B. Database Tidak Terhubung (`[RENCANA]`)
1. Periksa validitas `DATABASE_URL` (port `6543`) dan `DIRECT_URL` (port `5432`) di secret manager hosting.
2. Cek status layanan Supabase melalui Supabase Dashboard / Status Page.
3. Periksa kondisi pool koneksi `pg` Pool (`[ADA]` konfigurasi di `prisma.ts`).
4. Restart backend apabila koneksi pool mengalami *exhaustion*, dan evaluasi batas koneksi pooler (`[RENCANA]`).

### C. Webhook Pembayaran Gagal (`[RENCANA]`)
1. Periksa `PAYMENT_GATEWAY_WEBHOOK_SECRET` pada environment backend.
2. Periksa log handler `POST /api/v1/payments/webhook` (error verifikasi signature, format payload, atau timeout).
3. Periksa status `Payment` dan `Order` terkait di database PostgreSQL.
4. Cek status layanan Payment Gateway (Midtrans/Xendit); jika provider mengalami gangguan, pantau antrean retry webhook gateway.
5. Pastikan pengecekan idempotensi aktif saat webhook dikirim ulang agar tidak memicu duplikasi `Transaction` atau `EbookAccess`.

### D. Kebocoran Secret (`[RENCANA]`)
1. Identifikasi secret yang bocor dan lingkup paparan (Git commit, log, atau bundle klien).
2. **Cabut dan rotasi** secret terkait segera di dashboard Supabase / Payment Gateway (`SECURITY.md`).
3. Bersihkan riwayat Git menggunakan BFG Repo-Cleaner atau `git filter-repo` jika secret masuk ke repository.
4. Audit log akses untuk mendeteksi penggunaan tidak sah selama periode kebocoran.
5. Perbarui seluruh environment dengan secret baru, restart layanan, dan laporkan ke pemangku kepentingan.

### E. Bucket Storage Publik — File PDF Terekspos (`[RENCANA]`)
1. **Segera** ubah pengaturan bucket `ebooks-private` menjadi **Private** dan hapus seluruh policy akses publik/anon di Supabase Storage.
2. Audit log akses Storage untuk mengidentifikasi file mana yang diakses selama bucket terbuka.
3. Rotasi `SUPABASE_SERVICE_ROLE_KEY` apabila dicurigai terjadi penyalahgunaan kredensial admin.
4. Verifikasi ulang bahwa seluruh akses PDF klien hanya memakai signed URL ber-TTL pendek (default `300` detik) setelah lolos verifikasi `EbookAccess`.

---

## 5. Template Post-Mortem Insiden (`[RENCANA]`)

| Bagian | Isi yang Wajib Didokumentasikan |
|---|---|
| **Ringkasan** | Deskripsi singkat insiden, tingkat keparahan (`P1`–`P4`), layanan terdampak, dan total durasi gangguan. |
| **Timeline** | Catatan waktu kronologis: waktu mulai, deteksi, *acknowledge*, mitigasi sementara, dan pemulihan penuh. |
| **Root Cause** | Akar masalah teknis atau prosedural yang menyebabkan insiden terjadi. |
| **Dampak** | Jumlah pengguna terdampak, transaksi gagal/tertunda, serta ada/tidaknya dampak keamanan data. |
| **Tindakan** | Langkah mitigasi cepat dan perbaikan permanen yang telah diterapkan. |
| **Pencegahan** | Perubahan kode, pengujian, monitoring, atau kebijakan untuk mencegah insiden berulang. |
| **Pelajaran** | Hal yang berjalan baik, hal yang perlu diperbaiki dalam respons tim, dan tindak lanjut pemilik tugas. |
