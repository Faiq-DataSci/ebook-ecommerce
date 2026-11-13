# Ruang Lingkup Sistem (`System Scope`)

**Status:** `[RENCANA]` (implementasi fitur bisnis & antarmuka klien) | `[ADA]` (batasan arsitektur terkunci pada `AGENTS.md`, ADR, dan 4 keputusan terkonfirmasi)

Dokumen ini menetapkan batas resmi sistem agar seluruh anggota tim, dosen penilai, dan pemangku kepentingan memiliki pemahaman yang seragam mengenai apa yang dibangun dan apa yang dikecualikan.

---

## 1. Ruang Lingkup *In-Scope*

| Komponen / Domain | Cakupan yang Termasuk | Status |
|---|---|---|
| **Backend REST API (`backend/`)** | Layanan terpusat (Node.js + Express + TypeScript + Zod + Prisma 7 ESM) untuk verifikasi token Supabase Auth, `RBAC`, katalog, pesanan, integrasi *payment gateway* & *webhook* idempoten, penerbitan `signed URL`, laporan admin, dan perhitungan `SPK SAW`. | `[ADA]` fondasi `/health`, `schema.prisma`, env/validate; `[RENCANA]` fitur bisnis & migrasi |
| **Admin Web (`web/admin-web/`)** | Aplikasi web React + TypeScript + Vite (desain Neo-Brutalism) untuk pengelolaan katalog & kategori, unggah PDF ke `bucket privat`, pemantauan pelanggan/pesanan/pembayaran/transaksi, laporan penjualan, dan konfigurasi `SPK SAW`. | `[ADA]` template Vite; `[RENCANA]` migrasi TS & fitur |
| **Mobile Pelanggan (`mobile/ebook_store/`)** | Aplikasi Android (Flutter + Riverpod + Dio) untuk registrasi/login, katalog & pencarian, rekomendasi `SPK SAW`, *checkout*, pembayaran, riwayat pembelian, dan *in-app PDF reader*. | `[ADA]` template Flutter; `[RENCANA]` dependensi & fitur |
| **Portal Web Pelanggan (`web/pengunjung-web/`)** | Portal web pelanggan (React + Vite) yang melengkapi aplikasi mobile sesuai Keputusan #1 [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md). | `[ADA]` keputusan & template Vite; `[RENCANA]` fitur |
| **Database & Storage** | PostgreSQL Supabase (via Prisma 7) dan Supabase Storage **`bucket privat`** untuk penyimpanan file PDF. | `[ADA]` `schema.prisma`; `[RENCANA]` migrasi DB & bucket privat |

---

## 2. Ruang Lingkup *Out-of-Scope*

Hal-hal berikut **secara eksplisit berada di luar ruang lingkup** proyek:
1. **Marketplace multi-vendor:** Tidak ada pendaftaran penjual pihak ketiga, pembagian komisi, maupun etalase multi-toko ([ADR-0001](../adr/0001-single-seller-b2c.md)).
2. **Penjualan buku fisik dan pengiriman:** Tidak ada manajemen stok gudang, ongkos kirim, maupun integrasi kurir logistik.
3. **Perhitungan `SPK SAW` di klien:** Aplikasi Flutter maupun React dilarang menghitung skor SAW atau mengirim bobot mentah yang dipercaya langsung ([ADR-0002](../adr/0002-backend-only-saw.md)).
4. **Akses PDF publik atau unduhan bebas:** File PDF dilarang diletakkan di bucket publik dan tidak tersedia untuk diunduh bebas tanpa pemeriksaan hak akses (`EbookAccess`) dan `signed URL` sementara (Keputusan #4 `[ADA]`).
5. **Dukungan resmi iOS dan Desktop pada fase awal:** Target rilis mobile fase awal difokuskan pada **Android** (meskipun kerangka bawaan Flutter menyertakan folder platform lain).

---

## 3. Batasan Sistem (*System Boundaries & Constraints*)

| Kategori Batasan | Ketentuan Terkunci |
|---|---|
| **Batasan Aktor** | Hanya terdapat **2 aktor utama**: **Pelanggan** (`CUSTOMER`) dan **Admin** (`ADMIN`). |
| **Batasan Platform** | Mobile: Android (Flutter + Riverpod + Dio); Web Admin: React + TypeScript + Vite; Portal Pelanggan: React + Vite; Backend: Node.js + Express + TypeScript (ESM). |
| **Batasan Bisnis (*Single-Seller B2C*)** | Seluruh katalog dimiliki dan dikelola oleh satu pihak penjual resmi melalui **Admin**. |
| **Batasan Pembayaran** | Wajib menggunakan integrasi *payment gateway* nyata (Keputusan #3 `[ADA]`) dengan verifikasi *signature webhook*, idempotensi, dan transaksi database atomik. |
| **Batasan Akses File PDF** | PDF disimpan di Supabase Storage **`bucket privat`**; akses baca hanya melalui *in-app PDF reader* menggunakan `signed URL` berjangka waktu singkat setelah validasi `EbookAccess` (`!isRevoked`). |
| **Batasan `SPK SAW`** | Perhitungan normalisasi (*Benefit*/*Cost*), pembobotan, nilai preferensi, dan *tie-breaker* hanya berjalan di `backend`. |
| **Batasan Keamanan** | Otorisasi ditegakkan di `backend` (token + role); menyembunyikan menu di UI hanya kosmetik. Rahasia (`.env`, *service role key*, kunci gateway) dilarang masuk ke Git, `VITE_*`, maupun kode Flutter. |
| **Batasan Implementasi & Fase** | Urutan pengerjaan dikunci: **`Backend -> Admin Web -> Mobile`** ([ADR-0003](../adr/0003-admin-web-sebelum-mobile.md)) dengan uji konektivitas sebelum UI penuh dibangun. |

---

## 4. Daftar Asumsi yang Masih `[RENCANA]`

Asumsi berikut bergantung pada penyelesaian keputusan terbuka di [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md):
1. Pengaturan bobot `SPK SAW` diasumsikan hanya dilakukan oleh **Admin** hingga Keputusan #5 dikunci.
2. Fitur ulasan/rating pelanggan dan perlakuan skor `e-book` baru tanpa rating diasumsikan menunggu Keputusan #6 dan #7.
3. Himpunan final kriteria SAW (4 kriteria vs 5 kriteria) menunggu penyelesaian Keputusan #9 sebelum implementasi modul SAW.
4. Penyimpanan *snapshot* riwayat rekomendasi per pengguna/sesi menunggu Keputusan #11.
5. Pemilihan platform hosting `backend` menunggu Keputusan #10.

---

## 5. Kriteria Penerimaan Tingkat Sistem (`[RENCANA]`)

Sistem dinyatakan memenuhi ruang lingkup rilis apabila seluruh kriteria berikut lulus uji nyata:
1. **Keamanan & Otorisasi:** Permintaan tanpa token ditolak `401`, akses endpoint Admin oleh `Pelanggan` ditolak `403`, dan akses PDF tanpa `EbookAccess` aktif ditolak `403`.
2. **Integritas Transaksi:** Pesanan mengunci harga database, *webhook* pembayaran terverifikasi signature berjalan idempoten, dan `Transaction` + `EbookAccess` terbuat secara atomik.
3. **Konsistensi `SPK SAW`:** Output unit test `backend` cocok 100% dengan perhitungan manual yang disepakati, dan klien hanya menampilkan hasil dari `backend`.
4. **Kepatuhan Kualitas & Build:** Seluruh pemeriksaan `typecheck`, `lint`, `test`, `build`, `flutter analyze`, dan `flutter test` lulus tanpa error serta nol kebocoran kredensial.
