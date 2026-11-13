# Ruang Lingkup Sistem (`System Scope`)

**Status:** `[RENCANA]` (batasan lingkup) | `[RENCANA]` (implementasi fitur)

---

## 1. Dalam Ruang Lingkup (*In-Scope*)

Sistem Informasi E-Commerce E-Book mencakup komponen dan kapabilitas berikut:

### A. Aplikasi Klien (Pelanggan)
- **Aplikasi Mobile (`mobile/ebook_store`):** Aplikasi Android berbasis Flutter untuk autentikasi, penjelajahan katalog, pencarian, pemesanan, pembayaran, riwayat pembelian, dan akses e-book `[RENCANA]`.
- **Aplikasi Web Pengunjung (`web/pengunjung-web`):** Direktori aplikasi web berbasis React + Vite ditemukan di repository `[ADA]` sebagai template; penggunaannya sebagai portal web pelanggan dicatat sebagai `[RENCANA]` hingga dikonfirmasi pemilik proyek.

### B. Aplikasi Administrasi
- **Admin Web (`web/admin-web`):** Aplikasi web berbasis React + Vite untuk pengelolaan katalog e-book, kategori, data pelanggan, pemantauan pesanan & pembayaran, transaksi, dashboard, serta laporan penjualan `[RENCANA]`.

### C. Backend & Basis Data
- **Backend API (`backend/`):** Layanan REST API terpusat yang menangani autentikasi, otorisasi berbasis role, validasi input, logika transaksi, penerbitan akses e-book, dan perhitungan SPK metode SAW `[RENCANA]`. Implementasi aktual belum tersedia (`[RENCANA]`).
- **Database & Penyimpanan File:** Basis data relasional (rencana: PostgreSQL Supabase) dan penyimpanan file e-book privat (rencana: Supabase Storage bucket privat dengan signed URL) `[ADA]` pada `AGENTS.md`, belum tersedia di repository (`[RENCANA]`).

---

## 2. Di Luar Ruang Lingkup (*Out-of-Scope*)

Hal-hal berikut **tidak** termasuk dalam ruang lingkup proyek ini:
- Fitur marketplace multi-penjual / multi-vendor (`[RENCANA]` pada ADR-0001).
- Penjualan buku fisik, manajemen stok gudang, atau integrasi kurir pengiriman fisik (`[RENCANA]`).
- Perhitungan skor rekomendasi SAW di sisi klien (Flutter atau React) (`[RENCANA]` pada ADR-0002).
- Dukungan resmi platform iOS/Desktop untuk aplikasi mobile pada fase awal (target utama adalah Android, meskipun template Flutter default menyertakan folder platform lain) (`[RENCANA]`).

---

## 3. Matriks Kesiapan Modul Saat Ini

| No | Modul | Status Implementasi |
|---|---|---|
| 1 | Authentication Module | `[RENCANA]` |
| 2 | User Management Module | `[RENCANA]` |
| 3 | E-Book Catalog Module | `[RENCANA]` |
| 4 | Category Management Module | `[RENCANA]` |
| 5 | Order Management Module | `[RENCANA]` |
| 6 | Payment Module | `[RENCANA]` |
| 7 | Transaction Module | `[RENCANA]` |
| 8 | Purchase History Module | `[RENCANA]` |
| 9 | E-Book Access Module | `[RENCANA]` |
| 10 | Admin Dashboard Module | `[RENCANA]` |
| 11 | Sales Reporting Module | `[RENCANA]` |
| 12 | SPK SAW Recommendation Module *(dari `AGENTS.md`)* | `[RENCANA]` |
