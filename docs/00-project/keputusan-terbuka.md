# Daftar Keputusan Terbuka & Keputusan Terkonfirmasi

**Status:** Sebagian `[ADA]` (keputusan sudah ditetapkan), sebagian `[RENCANA]` (masih terbuka) — diperbarui berdasarkan konfirmasi pemilik proyek.

Dokumen ini berfungsi sebagai *Decision Register* untuk melacak keputusan arsitektur dan bisnis proyek, termasuk dampak teknis serta target waktu penyelesaiannya.

---

## Ringkasan Status Keputusan

| Kategori | Jumlah | Nomor Keputusan | Keterangan |
|---|---|---|---|
| **Sudah Ditetapkan (`[ADA]`)** | 4 | #1, #2, #3, #4 | Menjadi acuan terkunci dalam perancangan database, API, dan klien. |
| **Masih Terbuka (`[RENCANA]`)** | 7 | #5, #6, #7, #8, #9, #10, #11 | Wajib dikunci sebelum/pada **Milestone M1 (Minggu 2)** agar tidak menghambat migrasi skema final dan integrasi. |

---

## A. Keputusan yang Sudah Ditetapkan (`[ADA]`)

| No | Topik | Keputusan Final | Dampak Teknis & Arsitektur | Dokumen Terkait | Status |
|---|---|---|---|---|---|
| **1** | **Aplikasi Pengunjung Web (`web/pengunjung-web/`)** | Dipertahankan sebagai portal web pelanggan (melengkapi aplikasi mobile `ebook_store`). | Mengonsumsi REST API backend yang sama dengan aplikasi mobile (`CUSTOMER` role); tidak boleh menyimpan secret di `VITE_*`. | `system-scope.md`, `application-architecture.md` | `[ADA]` |
| **2** | **Autentikasi** | Menggunakan **Supabase Auth** dengan verifikasi token Supabase di backend (`Express`). | Backend tidak menyimpan `password_hash`; tabel `users` menyimpan `supabaseUserId` (`@unique`); seluruh endpoint terproteksi memverifikasi JWT Supabase di middleware backend. | `backend/prisma/schema.prisma`, `authentication.md` | `[ADA]` |
| **3** | **Pembayaran** | Menggunakan integrasi **payment gateway nyata** (seperti Midtrans/Xendit) sejak awal. | Memerlukan endpoint webhook terverifikasi signature, pencatatan `externalRef` pada `Payment`, penanganan status `PENDING/VERIFIED/FAILED/EXPIRED`, dan transaksi atomik + idempoten. | `payment-management.md`, `transaction-workflow.md` | `[ADA]` |
| **4** | **Akses PDF** | Hanya dapat dibaca di dalam aplikasi (*in-app PDF reader*) melalui *signed URL* sementara dari bucket privat. | Bucket Supabase Storage wajib **privat**; endpoint akses memverifikasi `EbookAccess` aktif (`!isRevoked`) sebelum menerbitkan signed URL berdurasi pendek; mobile/web memakai PDF viewer internal. | `ebook-access.md`, `security-guidelines.md` | `[ADA]` |

---

## B. Keputusan yang Masih Terbuka (`[RENCANA]`)

### 5. Pengubahan Bobot SAW
- **Pertanyaan:** Apakah pelanggan diperbolehkan mengubah bobot kriteria SAW atau hanya admin? (Dokumen saat ini: hanya admin).
- **Opsi:**
  1. **Hanya Admin (Terkunci):** Admin menetapkan bobot global; semua pelanggan menerima peringkat yang konsisten dan mudah diaudit.
  2. **Preset oleh Admin, Pilihan Preset oleh Pelanggan:** Admin menyediakan beberapa profil bobot tervalidasi (mis. *Hemat*, *Populer*, *Rating Tertinggi*), pelanggan memilih preset tanpa mengirim angka bobot mentah.
- **Rekomendasi Teknis:** Opsi 1 (atau Opsi 2 jika dibutuhkan personalisasi ringan), dengan tetap mematuhi [ADR-0002](../adr/0002-backend-only-saw.md) bahwa bobot mentah dari klien tidak pernah dipercaya langsung.
- **Dampak:** Skema tabel konfigurasi bobot SAW & parameter endpoint `/recommendations/saw`.
- **Target Kunci:** Milestone M1 (Minggu 2).

### 6. Ulasan & Rating
- **Pertanyaan:** Bagaimana cakupan fitur ulasan/rating e-book (siapa yang boleh memberi rating, moderasi, dan pengaruhnya ke SAW)?
- **Opsi:**
  1. **Hanya Pembeli Sah (`EbookAccess` aktif):** Hanya pelanggan yang sudah membeli e-book yang boleh memberi rating `1–5`, otomatis memperbarui `ratingAvg` pada tabel `ebooks`.
  2. **Rating Dikelola Admin / Awal Statis:** `ratingAvg` diinput/dikelola admin pada fase awal, fitur ulasan pelanggan ditunda ke fase berikutnya.
- **Rekomendasi Teknis:** Opsi 1 untuk integritas data bisnis (mencegah rating palsu), dengan validasi kepemilikan `EbookAccess` di backend.
- **Dampak:** Penambahan model `Review` pada `prisma/schema.prisma` bila Opsi 1 dipilih.
- **Target Kunci:** Milestone M1 (Minggu 2).

### 7. Kebijakan E-Book Tanpa Rating
- **Pertanyaan:** Bagaimana perlakuan skor SAW untuk e-book baru yang belum memiliki rating (`ratingAvg = 0`)?
- **Opsi:**
  1. **Nilai Netral / Baseline (mis. `0` atau rata-rata kategori):** Tetap diikutkan dengan nilai aktual `0` atau nilai default tertentu.
  2. **Pengecualian atau Penanda Khusus:** E-book baru tanpa rating diberi penanda *"Baru"* di katalog, dan pada SAW menggunakan nilai minimum aman agar tidak mengganggu pembagi normalisasi.
- **Rekomendasi Teknis:** Gunakan nilai aktual `0` pada kriteria `Benefit` (normalisasi `0 / max = 0`, aman dari pembagi nol) atau nilai baseline yang didokumentasikan eksplisit di [`saw-method.md`](../03-saw/saw-method.md).
- **Dampak:** Aturan *edge case* pada fungsi murni SAW dan dokumentasi perhitungan manual.
- **Target Kunci:** Milestone M1 (Minggu 2).

### 8. Identitas Aplikasi
- **Pertanyaan:** Penentuan nama final aplikasi dan desain logo.
- **Opsi:** Mempertahankan nama sementara `E-Book Store` atau menetapkan merek/nama resmi baru beserta aset logo untuk `admin-web`, `pengunjung-web`, dan `ebook_store`.
- **Dampak:** Teks antarmuka UI, `manifest.json`, `index.html`, `pubspec.yaml` / label aplikasi Android, dan sampul laporan akademik.
- **Target Kunci:** Milestone M4 (Minggu 7 — sebelum rilis UI penuh).

### 9. Konflik Kriteria & Bobot SAW
- **Pertanyaan:** Penyelesaian konflik antara 4 kriteria (`0,35 / 0,30 / 0,20 / 0,15`) vs 5 kriteria pada perhitungan manual awal.
- **Opsi:**
  1. **Gunakan 4 Kriteria** yang seluruh kolom datanya sudah tersedia nyata di `Ebook` (`price`, `ratingAvg`, `salesCount`, `pageCount`/`publishedYear`).
  2. **Gunakan 5 Kriteria** dengan memastikan seluruh kriteria ke-5 memiliki kolom sumber yang jelas di `prisma/schema.prisma`.
- **Rekomendasi Teknis:** Pilih himpunan kriteria yang 100% datanya tersedia di tabel `ebooks` tanpa data rekayasa, lalu sinkronkan [`saw-method.md`](../03-saw/saw-method.md) dan [`perhitungan-manual.md`](../03-saw/perhitungan-manual.md).
- **Dampak:** Skema kriteria SAW, perhitungan manual akademik, dan unit test backend.
- **Target Kunci:** Milestone M1 (Minggu 2) — **kritis sebelum implementasi SAW**.

### 10. Hosting Backend
- **Pertanyaan:** Pilihan platform hosting backend (Vercel Functions vs layanan Node.js lain).
- **Opsi:**
  1. **PaaS Node.js Long-Running** (mis. Railway, Render, Fly.io, atau VPS) — cocok untuk Express + Prisma + `pg` pool standar tanpa batasan *cold start* atau timeout serverless.
  2. **Serverless (Vercel Functions)** — memerlukan adaptasi handler Express dan manajemen koneksi PostgreSQL melalui pooling eksternal (Supabase Transaction Pooler).
- **Rekomendasi Teknis:** Opsi 1 (PaaS Node.js standar) untuk kesederhanaan Express + Prisma 7 dan keandalan penerimaan webhook payment gateway.
- **Dampak:** Konfigurasi `backend/src/server.ts`, variabel env pooling DB, dan panduan [`deployment.md`](../05-deployment/deployment.md).
- **Target Kunci:** Milestone M5–M6 (Minggu 10).

### 11. Riwayat Rekomendasi
- **Pertanyaan:** Perlu atau tidaknya menyimpan riwayat hasil rekomendasi SAW per pengguna/sesi.
- **Opsi:**
  1. **Simpan Snapshot Audit (`SawCalculationRun` / `SawResult`):** Menyimpan snapshot setiap kalkulasi atau perubahan bobot untuk keperluan audit akademik dan *immutability* hasil historis ([ADR-0002](../adr/0002-backend-only-saw.md)).
  2. **Hitung On-Demand Tanpa Penyimpanan Per Sesi:** Hanya menyimpan konfigurasi bobot aktif, sementara skor dihitung saat request.
- **Rekomendasi Teknis:** Opsi 1 (menyimpan snapshot run/audit di database) agar selaras dengan ADR-0002 (*"penyimpanan snapshot hasil"*).
- **Dampak:** Penambahan model snapshot SAW di `prisma/schema.prisma` dan migrasi database.
- **Target Kunci:** Milestone M1 (Minggu 2).

---

## C. Referensi Silang ADR & Dokumen Terkait
- [`docs-proyek-ebook-ecommerce.md`](../docs-proyek-ebook-ecommerce.md) — Indeks & sumber kebenaran utama
- [`01-single-seller-b2c`](../adr/0001-single-seller-b2c.md) — ADR-0001 Model Bisnis Single-Seller
- [`02-backend-only-saw`](../adr/0002-backend-only-saw.md) — ADR-0002 Perhitungan SAW Hanya di Backend
- [`03-admin-web-sebelum-mobile`](../adr/0003-admin-web-sebelum-mobile.md) — ADR-0003 Urutan Pengembangan
