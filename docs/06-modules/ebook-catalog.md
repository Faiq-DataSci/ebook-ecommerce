# Modul Katalog, Kategori E-Book & Rekomendasi SAW

**Status Implementasi:** `[RENCANA]` — Belum ada implementasi di kode sumber.

Dokumen ini mencakup **3. E-Book Catalog Module**, **4. Category Management Module**, serta **Modul SPK SAW** (`[ADA]` pada `AGENTS.md`).

---

## A. E-Book Catalog Module (`[RENCANA]` / `[RENCANA]`)

| Aspek | Keterangan |
|---|---|
| **Tujuan Modul** | Menyediakan pengelolaan dan penelusuran informasi e-book yang dijual secara daring. |
| **Fungsi Utama** | Menampilkan katalog e-book aktif, pencarian & filter kategori, detail e-book (judul, penulis, kategori, deskripsi, harga), serta CRUD e-book dan unggah file PDF ke bucket privat oleh admin (`[RENCANA]`). |
| **Aktor** | Pelanggan (baca/cari), Admin (kelola). |
| **Input** | Query pencarian (`search`, `categoryId`, `page`, `limit`), ID e-book, atau payload metadata e-book + file PDF (admin). |
| **Proses** | Validasi input via Zod; query daftar/detail dari tabel `ebooks` (hanya `is_active = true` untuk publik); unggah PDF ke Supabase Storage bucket privat oleh backend (`[RENCANA]`). |
| **Output** | Daftar/detail e-book tanpa mengekspos `storage_path` privat. |
| **Hubungan Modul** | Bergantung pada Category Management; digunakan oleh Order Management, E-Book Access, dan SPK SAW Module. |
| **File/Direktori Aktual** | Belum tersedia. |
| **Potensi Masalah / Keterbatasan** | Penghapusan permanen e-book dapat merusak riwayat pesanan/akses lama; wajib menggunakan *soft delete* (`is_active = false`). |

---

## B. Category Management Module (`[RENCANA]` / `[RENCANA]`)

| Aspek | Keterangan |
|---|---|
| **Tujuan Modul** | Mengelompokkan e-book ke dalam kategori yang terstruktur agar mudah ditemukan pelanggan. |
| **Fungsi Utama** | Menampilkan daftar kategori (publik) dan tambah/ubah/hapus kategori (admin). |
| **Aktor** | Pelanggan (filter katalog) dan Admin (kelola). |
| **Input** | `name`, `slug`, `description?`, atau `categoryId`. |
| **Proses** | Validasi keunikan `name` dan `slug`; pemeriksaan relasi sebelum penghapusan agar kategori yang masih memiliki e-book tidak dihapus sembarangan. |
| **Output** | Daftar kategori atau hasil operasi CRUD. |
| **Hubungan Modul** | Relasi `1-to-N` dengan E-Book Catalog Module. |
| **File/Direktori Aktual** | Belum tersedia. |
| **Potensi Masalah / Keterbatasan** | Penghapusan kategori tanpa pengecekan relasi dapat menyebabkan error referensial. |

---

## C. SPK SAW Recommendation Module (`[RENCANA]` di `AGENTS.md`, `[RENCANA]` di kode)

- **Tujuan:** Memberikan peringkat rekomendasi e-book menggunakan metode *Simple Additive Weighting* (SAW) yang dihitung **hanya di backend** (`[RENCANA]` pada ADR-0002).
- **Batasan Keamanan:** Bobot dari klien tidak dipercaya secara langsung; validasi dan perhitungan matriks normalisasi dilakukan sepenuhnya di server.
- **Keterbatasan Saat Ini:** Konflik jumlah kriteria (4 kriteria vs 5 kriteria) dan perlakuan e-book tanpa rating masih tercatat sebagai keputusan terbuka di [keputusan-terbuka.md](../00-project/keputusan-terbuka.md).
