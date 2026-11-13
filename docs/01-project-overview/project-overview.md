# Ringkasan Proyek (`Project Overview`)

**Status:** `[RENCANA]` (solusi bisnis, fitur transaksi, dan SPK SAW) | `[ADA]` (fondasi monorepo, kerangka backend, skema Prisma awal, dan 4 keputusan arsitektur utama)

Dokumen ini menjadi ringkasan eksekutif dan rujukan utama tingkat proyek bagi dosen penilai, anggota tim, pengguna bisnis, serta pengembang `backend`, `web`, dan `mobile`. Pernyataan kondisi aktual merujuk pada sumber kebenaran utama [`docs-proyek-ebook-ecommerce.md`](../docs-proyek-ebook-ecommerce.md).

---

## 1. Identitas Proyek

| Atribut | Keterangan | Status |
|---|---|---|
| **Nama Proyek** | Sistem Informasi E-Commerce E-Book dan SPK (Metode SAW) | `[RENCANA]` |
| **Nama Aplikasi** | E-Book Store *(nama final dan logo menunggu Keputusan #8)* | `[RENCANA]` |
| **Konteks Akademik** | Proyek Sains Data — Sistem Informasi / Sistem Pendukung Keputusan (Universitas Putra Bangsa, kelas 2DSRA) | `[RENCANA]` |
| **Model Bisnis** | *Single-Seller B2C* (toko tunggal langsung ke pelanggan; lihat [ADR-0001](../adr/0001-single-seller-b2c.md)) | `[ADA]` (keputusan) / `[RENCANA]` (implementasi) |
| **Aktor Utama** | **Pelanggan** (*Customer*) dan **Admin** | `[RENCANA]` |
| **Struktur Monorepo** | `backend/`, `web/admin-web/`, `web/pengunjung-web/`, `mobile/ebook_store/`, `docs/` | `[ADA]` |

---

## 2. Latar Belakang & Permasalahan yang Diselesaikan

### 2.1 Latar Belakang Masalah
Penjualan buku elektronik (`e-book`) secara daring membutuhkan pengelolaan katalog digital yang terpusat, mekanisme transaksi yang mampu menjaga integritas harga serta status pembayaran, dan perlindungan konten PDF agar hanya dapat dibaca oleh pembeli yang sah. Selain itu, pelanggan sering kesulitan memilih `e-book` yang paling sesuai di antara banyak pilihan apabila tidak tersedia sistem peringkat berbasis kriteria yang terukur.

### 2.2 Permasalahan yang Ingin Diselesaikan
1. **Fragmentasi pengelolaan katalog dan transaksi:** Ketiadaan sistem terpusat untuk mengelola kategori, metadata `e-book`, pesanan, pembayaran, dan riwayat pembelian secara teraudit (`[RENCANA]`).
2. **Risiko kebocoran aset digital PDF:** Penyimpanan file PDF pada tautan publik berisiko memungkinkan akses tanpa pembelian (`[RENCANA]`).
3. **Subjektivitas atau manipulasi rekomendasi:** Jika peringkat rekomendasi dihitung di sisi klien, bobot dapat dimanipulasi dan hasil antar-platform menjadi tidak konsisten ([ADR-0002](../adr/0002-backend-only-saw.md)).

---

## 3. Tujuan Umum, Tujuan Khusus & Nilai Proyek

### 3.1 Tujuan Umum
Membangun sistem informasi e-commerce `e-book` *single-seller B2C* yang terintegrasi dengan Sistem Pendukung Keputusan (`SPK SAW`) di `backend`, aman dalam pengelolaan pembayaran serta akses konten PDF, dan terdokumentasi secara terstruktur untuk kebutuhan akademik maupun operasional (`[RENCANA]`).

### 3.2 Tujuan Khusus
1. Menyediakan katalog, pencarian, filter kategori, dan rekomendasi `SPK SAW` yang dihitung **hanya di `backend`** (`[RENCANA]`).
2. Mengelola alur pemesanan (*checkout*) dengan *snapshot* harga database serta integrasi *payment gateway* nyata yang terverifikasi via *webhook* idempoten (`[RENCANA]`).
3. Melindungi file PDF pada **Supabase Storage `bucket privat`** dan hanya menerbitkan **`signed URL`** sementara bagi pemilik hak akses (`EbookAccess`) yang sah untuk dibaca melalui *in-app PDF reader* (`[RENCANA]`).
4. Menyediakan antarmuka administrasi (`web/admin-web`) untuk manajemen katalog, kategori, pelanggan, pemantauan pesanan/pembayaran, laporan penjualan, dan konfigurasi bobot `SPK SAW` (`[RENCANA]`).

### 3.3 Nilai Akademik & Nilai Bisnis
- **Nilai Akademik:** Menerapkan konsep perancangan sistem informasi berlapis, pemodelan basis data relasional (Prisma 7 + PostgreSQL), pengujian otomatis, serta implementasi nyata algoritma *Simple Additive Weighting* (SAW) yang terverifikasi terhadap perhitungan manual (`[RENCANA]`).
- **Nilai Bisnis:** Menjaga keamanan aset digital `e-book`, memastikan akurasi pencatatan transaksi keuangan, dan membantu **Pelanggan** mengambil keputusan pembelian lebih cepat melalui peringkat rekomendasi berbasis kriteria (`[RENCANA]`).

---

## 4. Ringkasan Solusi, Aktor & Fitur Inti

### 4.1 Ringkasan Solusi & Stack Terkunci (`[ADA]` pada `AGENTS.md`)
Solusi dibangun dengan arsitektur *Client–Server* terpusat:
- **`backend/`** *(Node.js, Express, TypeScript, Zod, Prisma 7, ESM)*: Pusat logika bisnis, verifikasi token **Supabase Auth**, otorisasi `RBAC`, integrasi *payment gateway*, penerbitan `signed URL` dari `bucket privat`, dan perhitungan `SPK SAW`.
- **`web/admin-web/`** *(React, TypeScript, Vite — desain Neo-Brutalism)*: Antarmuka operasional **Admin**.
- **`mobile/ebook_store/`** *(Flutter, Dart, Riverpod, Dio — target Android)* & **`web/pengunjung-web/`** *(React, Vite)*: Antarmuka **Pelanggan**.

### 4.2 Aktor Utama & Perannya
| Aktor | Peran dalam Sistem | Aplikasi Target |
|---|---|---|
| **Pelanggan** | Registrasi/login, menjelajah katalog, melihat rekomendasi `SPK SAW`, membuat pesanan, membayar via *payment gateway*, memantau status & riwayat pembelian, serta membaca `e-book` melalui *in-app PDF reader*. | `mobile/ebook_store` (`[RENCANA]`), `web/pengunjung-web` (`[RENCANA]`) |
| **Admin** | Mengelola kategori dan katalog `e-book` (termasuk unggah PDF ke `bucket privat`), memantau data pelanggan, pesanan, pembayaran, transaksi, laporan penjualan, hak akses, dan bobot `SPK SAW`. | `web/admin-web` (`[RENCANA]`) |

### 4.3 Ringkasan Fitur Inti (`[RENCANA]`)
1. Autentikasi terintegrasi **Supabase Auth** dengan verifikasi JWT dan kontrol peran (`CUSTOMER` / `ADMIN`) di `backend`.
2. Katalog `e-book`, kategori, pencarian, dan rekomendasi `SPK SAW` (*backend-only*).
3. Pemesanan, pembayaran via *payment gateway* nyata, *webhook* idempoten, transaksi atomik, dan buku besar `Transaction`.
4. Hak akses `EbookAccess` dan pembacaan PDF dalam aplikasi melalui `signed URL` sementara dari `bucket privat`.
5. Dashboard, pelaporan penjualan, dan kontrol operasional **Admin**.

---

## 5. Batasan Utama & Status Implementasi Aktual

- **Batasan Utama:** Model *single-seller B2C* (bukan marketplace), urutan pengembangan terkunci `Backend -> Admin Web -> Mobile` ([ADR-0003](../adr/0003-admin-web-sebelum-mobile.md)), perhitungan `SPK SAW` hanya di `backend`, dan file PDF tidak tersedia untuk unduhan publik bebas. Rincian lengkap tersedia di [`system-scope.md`](./system-scope.md).
- **Status Implementasi Aktual (`[ADA]` vs `[RENCANA]`):**
  - **`[ADA]`:** Fondasi `backend/` (Express, env Zod, middleware error/validate/auth dasar, helper storage dasar, endpoint `/api/v1/health`, 5 unit test Vitest lulus, dan [`schema.prisma`](../../backend/prisma/schema.prisma) berisi 8 model inti tervalidasi `prisma validate`), serta template awal `web/admin-web/`, `web/pengunjung-web/`, dan `mobile/ebook_store/` (lihat [`test-results.md`](../09-testing/test-results.md)).
  - **`[RENCANA]`:** Migrasi database ke Supabase (`prisma/migrations/`), seluruh fitur bisnis & endpoint modul, integrasi penuh Supabase Auth/Storage privat, integrasi *payment gateway*, perhitungan `SPK SAW`, serta seluruh antarmuka bisnis di `admin-web`, `pengunjung-web`, dan `ebook_store`.

---

## 6. Dokumen Rujukan Utama
- [`docs-proyek-ebook-ecommerce.md`](../docs-proyek-ebook-ecommerce.md) — Sumber kebenaran utama & indeks status implementasi
- [`00-project/project-plan.md`](../00-project/project-plan.md) — Rencana proyek, tim, jadwal, dan risiko
- [`00-project/requirements.md`](../00-project/requirements.md) — Spesifikasi kebutuhan fungsional & non-fungsional
- [`00-project/keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) — Daftar keputusan terkunci (`[ADA]`) dan terbuka (`[RENCANA]`)
- [`01-design/`](../01-design/use-case-diagram.md) — Artefak desain sistem (Use Case, Activity, Sequence, Class, Component, Data Flow)
