# Ringkasan Proyek (`Project Overview`)

**Status:** `[CONFIRMED]` (konsep & identitas proyek) | `[IMPLEMENTED]` (kerangka monorepo awal) | `[NOT AVAILABLE]` (fitur bisnis)

---

## 1. Identitas Proyek

| Atribut | Keterangan | Status |
|---|---|---|
| **Nama Proyek** | Sistem Informasi E-Commerce E-Book | `[CONFIRMED]` |
| **Nama Aplikasi** | E-Book Store | `[CONFIRMED]` |
| **Model Bisnis** | E-Commerce *Single-Seller* (B2C, bukan marketplace) | `[CONFIRMED]` |
| **Konteks Akademik** | Proyek Sains Data — Sistem Informasi / SPK (Universitas Putra Bangsa, kelas 2DSRA) | `[CONFIRMED]` |
| **Aktor Utama** | Pelanggan (*Customer*) dan Admin | `[CONFIRMED]` |

---

## 2. Latar Belakang dan Deskripsi Sistem

**E-Book Store** adalah sistem informasi e-commerce yang menyediakan layanan pencarian, pemilihan, pembelian, dan akses terhadap buku elektronik (e-book) secara daring. Selain fungsi transaksi e-commerce standar, proyek ini juga merencanakan fitur Sistem Pendukung Keputusan (SPK) menggunakan metode **Simple Additive Weighting (SAW)** di sisi backend untuk membantu pelanggan menemukan rekomendasi e-book yang sesuai (`[CONFIRMED]` pada `AGENTS.md`).

---

## 3. Tujuan Sistem

Berdasarkan ruang lingkup proyek, sistem ini bertujuan untuk:

1. **Mempermudah pelanggan menemukan e-book** melalui katalog, pencarian, kategori, dan rekomendasi berbasis SPK (SAW) `[CONFIRMED]`.
2. **Menyediakan proses pembelian e-book secara daring** yang terstruktur mulai dari pemesanan hingga pembayaran `[CONFIRMED]`.
3. **Mengelola informasi katalog dan kategori e-book** secara terpusat oleh admin `[CONFIRMED]`.
4. **Mencatat pesanan, pembayaran, dan transaksi** secara akurat dan dapat diaudit `[CONFIRMED]`.
5. **Menyediakan riwayat pembelian pelanggan** sebagai bukti kepemilikan dan catatan transaksi `[CONFIRMED]`.
6. **Memberikan akses e-book berdasarkan status pembayaran yang telah diverifikasi** sehingga konten digital hanya dapat diakses oleh pembeli yang sah `[CONFIRMED]`.
7. **Membantu admin mengelola katalog dan memantau aktivitas penjualan** melalui dashboard dan laporan penjualan `[CONFIRMED]`.

---

## 4. Kondisi Repository Saat Ini

Berdasarkan pemeriksaan aktual pada repository:

- **`mobile/ebook_store/`** `[IMPLEMENTED]` — Kerangka aplikasi Flutter (`lib/main.dart`) masih berupa template default (*counter app*). Dependensi seperti Riverpod dan Dio belum ditambahkan ke `pubspec.yaml`.
- **`web/admin-web/`** `[IMPLEMENTED]` — Kerangka aplikasi React + Vite (`.jsx`) masih berupa template default. Konfigurasi TypeScript dan UI administrasi belum dibuat.
- **`web/pengunjung-web/`** `[IMPLEMENTED]` — Kerangka aplikasi React + Vite (`.jsx`) template default ditemukan di repository, namun perannya belum tercantum dalam `README.md` maupun `AGENTS.md` (`[ASSUMPTION]`: disiapkan untuk antarmuka web pelanggan).
- **`backend/`** `[NOT AVAILABLE]` — Baru berisi `backend/package.json` dengan skrip dasar (`tsx`, `tsc`, `vitest`, `prisma`), tanpa `node_modules`, tanpa kode sumber (`src/`), dan tanpa skema database.
- **Database & Storage** `[NOT AVAILABLE]` — Belum ada file skema Prisma maupun konfigurasi koneksi database/storage.
