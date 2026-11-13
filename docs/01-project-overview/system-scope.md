# Ruang Lingkup Sistem (`System Scope`)

**Status:** `[CONFIRMED]` (batasan lingkup) | `[NOT AVAILABLE]` (implementasi fitur)

---

## 1. Dalam Ruang Lingkup (*In-Scope*)

Sistem Informasi E-Commerce E-Book mencakup komponen dan kapabilitas berikut:

### A. Aplikasi Klien (Pelanggan)
- **Aplikasi Mobile (`mobile/ebook_store`):** Aplikasi Android berbasis Flutter untuk autentikasi, penjelajahan katalog, pencarian, pemesanan, pembayaran, riwayat pembelian, dan akses e-book `[CONFIRMED]`.
- **Aplikasi Web Pengunjung (`web/pengunjung-web`):** Direktori aplikasi web berbasis React + Vite ditemukan di repository `[IMPLEMENTED]` sebagai template; penggunaannya sebagai portal web pelanggan dicatat sebagai `[ASSUMPTION]` hingga dikonfirmasi pemilik proyek.

### B. Aplikasi Administrasi
- **Admin Web (`web/admin-web`):** Aplikasi web berbasis React + Vite untuk pengelolaan katalog e-book, kategori, data pelanggan, pemantauan pesanan & pembayaran, transaksi, dashboard, serta laporan penjualan `[CONFIRMED]`.

### C. Backend & Basis Data
- **Backend API (`backend/`):** Layanan REST API terpusat yang menangani autentikasi, otorisasi berbasis role, validasi input, logika transaksi, penerbitan akses e-book, dan perhitungan SPK metode SAW `[CONFIRMED]`. Implementasi aktual belum tersedia (`[NOT AVAILABLE]`).
- **Database & Penyimpanan File:** Basis data relasional (rencana: PostgreSQL Supabase) dan penyimpanan file e-book privat (rencana: Supabase Storage bucket privat dengan signed URL) `[CONFIRMED]` pada `AGENTS.md`, belum tersedia di repository (`[NOT AVAILABLE]`).

---

## 2. Di Luar Ruang Lingkup (*Out-of-Scope*)

Hal-hal berikut **tidak** termasuk dalam ruang lingkup proyek ini:
- Fitur marketplace multi-penjual / multi-vendor (`[CONFIRMED]` pada ADR-0001).
- Penjualan buku fisik, manajemen stok gudang, atau integrasi kurir pengiriman fisik (`[CONFIRMED]`).
- Perhitungan skor rekomendasi SAW di sisi klien (Flutter atau React) (`[CONFIRMED]` pada ADR-0002).
- Dukungan resmi platform iOS/Desktop untuk aplikasi mobile pada fase awal (target utama adalah Android, meskipun template Flutter default menyertakan folder platform lain) (`[ASSUMPTION]`).

---

## 3. Matriks Kesiapan Modul Saat Ini

| No | Modul | Status Implementasi |
|---|---|---|
| 1 | Authentication Module | `[NOT AVAILABLE]` |
| 2 | User Management Module | `[NOT AVAILABLE]` |
| 3 | E-Book Catalog Module | `[NOT AVAILABLE]` |
| 4 | Category Management Module | `[NOT AVAILABLE]` |
| 5 | Order Management Module | `[NOT AVAILABLE]` |
| 6 | Payment Module | `[NOT AVAILABLE]` |
| 7 | Transaction Module | `[NOT AVAILABLE]` |
| 8 | Purchase History Module | `[NOT AVAILABLE]` |
| 9 | E-Book Access Module | `[NOT AVAILABLE]` |
| 10 | Admin Dashboard Module | `[NOT AVAILABLE]` |
| 11 | Sales Reporting Module | `[NOT AVAILABLE]` |
| 12 | SPK SAW Recommendation Module *(dari `AGENTS.md`)* | `[NOT AVAILABLE]` |
