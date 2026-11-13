# Ringkasan Proyek (`Project Overview`)

**Status:** `[RENCANA]` (konsep & identitas proyek) | `[ADA]` (kerangka monorepo awal) | `[RENCANA]` (fitur bisnis)

---

## 1. Identitas Proyek

| Atribut | Keterangan | Status |
|---|---|---|
| **Nama Proyek** | Sistem Informasi E-Commerce E-Book | `[RENCANA]` |
| **Nama Aplikasi** | E-Book Store | `[RENCANA]` |
| **Model Bisnis** | E-Commerce *Single-Seller* (B2C, bukan marketplace) | `[RENCANA]` |
| **Konteks Akademik** | Proyek Sains Data — Sistem Informasi / SPK (Universitas Putra Bangsa, kelas 2DSRA) | `[RENCANA]` |
| **Aktor Utama** | Pelanggan (*Customer*) dan Admin | `[RENCANA]` |

---

## 2. Latar Belakang dan Deskripsi Sistem

**E-Book Store** adalah sistem informasi e-commerce yang menyediakan layanan pencarian, pemilihan, pembelian, dan akses terhadap buku elektronik (e-book) secara daring. Selain fungsi transaksi e-commerce standar, proyek ini juga merencanakan fitur Sistem Pendukung Keputusan (SPK) menggunakan metode **Simple Additive Weighting (SAW)** di sisi backend untuk membantu pelanggan menemukan rekomendasi e-book yang sesuai (`[ADA]` pada `AGENTS.md`).

---

## 3. Tujuan Sistem

Berdasarkan ruang lingkup proyek, sistem ini bertujuan untuk:

1. **Mempermudah pelanggan menemukan e-book** melalui katalog, pencarian, kategori, dan rekomendasi berbasis SPK (SAW) `[RENCANA]`.
2. **Menyediakan proses pembelian e-book secara daring** yang terstruktur mulai dari pemesanan hingga pembayaran `[RENCANA]`.
3. **Mengelola informasi katalog dan kategori e-book** secara terpusat oleh admin `[RENCANA]`.
4. **Mencatat pesanan, pembayaran, dan transaksi** secara akurat dan dapat diaudit `[RENCANA]`.
5. **Menyediakan riwayat pembelian pelanggan** sebagai bukti kepemilikan dan catatan transaksi `[RENCANA]`.
6. **Memberikan akses e-book berdasarkan status pembayaran yang telah diverifikasi** sehingga konten digital hanya dapat diakses oleh pembeli yang sah `[RENCANA]`.
7. **Membantu admin mengelola katalog dan memantau aktivitas penjualan** melalui dashboard dan laporan penjualan `[RENCANA]`.

---

## 4. Kondisi Repository Saat Ini

Berdasarkan pemeriksaan aktual pada repository:

- **`mobile/ebook_store/`** `[ADA]` — Kerangka aplikasi Flutter (`lib/main.dart`) masih berupa template default (*counter app*). Dependensi seperti Riverpod dan Dio belum ditambahkan ke `pubspec.yaml`.
- **`web/admin-web/`** `[ADA]` — Kerangka aplikasi React + Vite (`.jsx`) masih berupa template default. Konfigurasi TypeScript dan UI administrasi belum dibuat.
- **`web/pengunjung-web/`** `[ADA]` — Kerangka aplikasi React + Vite (`.jsx`) template default ditemukan di repository, namun perannya belum tercantum dalam `README.md` maupun `AGENTS.md` (`[RENCANA]`: disiapkan untuk antarmuka web pelanggan).
- **`backend/`** `[RENCANA]` — Baru berisi `backend/package.json` dengan skrip dasar (`tsx`, `tsc`, `vitest`, `prisma`), tanpa `node_modules`, tanpa kode sumber (`src/`), dan tanpa skema database.
- **Database & Storage** `[RENCANA]` — Belum ada file skema Prisma maupun konfigurasi koneksi database/storage.
