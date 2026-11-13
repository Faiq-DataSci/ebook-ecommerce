# Dokumentasi Teknis — Sistem Informasi E-Commerce E-Book (E-Book Store)

**Status Umum Proyek:** `[RENCANA]` — Fondasi monorepo dan kerangka aplikasi telah tersedia (`[IMPLEMENTED]` sebagai template awal), sedangkan fitur bisnis, backend API, dan database belum diimplementasikan (`[NOT AVAILABLE]`).

Dokumentasi ini disusun sebagai panduan resmi pengembangan, arsitektur, basis data, API, keamanan, pengujian, dan pemeliharaan untuk proyek **E-Book Store** (Sistem Informasi E-Book dan SPK Metode SAW).

---

## Klasifikasi Status Informasi

Setiap bagian dalam dokumentasi ini menggunakan label status eksplisit berikut:

| Label | Makna |
|---|---|
| `[IMPLEMENTED]` | Sudah ditemukan secara aktual di dalam kode sumber atau konfigurasi repository. |
| `[CONFIRMED]` | Sudah dikonfirmasi sebagai keputusan proyek (misalnya pada `AGENTS.md` atau ADR). |
| `[PROPOSED]` | Rancangan atau rekomendasi teknis yang belum diimplementasikan. |
| `[ASSUMPTION]` | Asumsi sementara yang masih memerlukan validasi dari pemilik proyek/tim. |
| `[NOT AVAILABLE]` | Informasi, konfigurasi, atau implementasi belum tersedia di repository. |

---

## Peta Dokumentasi

### 01. Ringkasan Proyek (`01-project-overview/`)
- [Ringkasan Proyek (`project-overview.md`)](./01-project-overview/project-overview.md)
- [Kebutuhan Bisnis (`business-requirements.md`)](./01-project-overview/business-requirements.md)
- [Ruang Lingkup Sistem (`system-scope.md`)](./01-project-overview/system-scope.md)

### 02. Arsitektur Sistem (`02-architecture/`)
- [Arsitektur Sistem (`system-architecture.md`)](./02-architecture/system-architecture.md) — Gambaran umum arsitektur, alur API, autentikasi, transaksi, dan akses e-book
- [Arsitektur Aplikasi (`application-architecture.md`)](./02-architecture/application-architecture.md) — Struktur aplikasi Mobile, Admin Web, Pengunjung Web, dan Backend
- [Technology Stack (`technology-stack.md`)](./02-architecture/technology-stack.md) — Perbandingan stack aktual di repository vs stack terkunci proyek

### 03. Proses Bisnis (`03-business-process/`)
- [Alur Pelanggan (`customer-workflow.md`)](./03-business-process/customer-workflow.md) — Alur pelanggan & skenario alternatif
- [Alur Admin (`admin-workflow.md`)](./03-business-process/admin-workflow.md) — Alur administrasi
- [Alur Transaksi (`transaction-workflow.md`)](./03-business-process/transaction-workflow.md) — Siklus pesanan, pembayaran, transaksi, dan hak akses e-book

### 04. Basis Data (`04-database/`)
- [Rancangan Basis Data (`database-design.md`)](./04-database/database-design.md) — Rancangan konseptual basis data (`[PROPOSED]`)
- [Kamus Data (`data-dictionary.md`)](./04-database/data-dictionary.md) — Kamus data entitas utama (`[PROPOSED]`)
- [Entity Relationship Diagram (`erd.md`)](./04-database/erd.md) — Entity Relationship Diagram (Mermaid) (`[PROPOSED]`)

### 05. Spesifikasi API (`05-api/`)
- [Gambaran Umum API (`api-overview.md`)](./05-api/api-overview.md) — Konvensi REST API, autentikasi, otorisasi, dan format respons
- [Rancangan Endpoint API (`api-endpoints.md`)](./05-api/api-endpoints.md) — Rancangan endpoint per modul (`[PROPOSED]`)

### 06. Dokumentasi Modul (`06-modules/`)
- [Autentikasi & Manajemen Pengguna (`authentication.md`)](./06-modules/authentication.md) — Modul Autentikasi & Manajemen Pengguna
- [Katalog, Kategori & SPK SAW (`ebook-catalog.md`)](./06-modules/ebook-catalog.md) — Modul Katalog & Kategori E-Book (serta integrasi SPK SAW)
- [Manajemen Pesanan (`order-management.md`)](./06-modules/order-management.md) — Modul Manajemen Pesanan
- [Pembayaran & Transaksi (`payment-management.md`)](./06-modules/payment-management.md) — Modul Pembayaran & Transaksi
- [Riwayat Pembelian & Akses E-Book (`ebook-access.md`)](./06-modules/ebook-access.md) — Modul Riwayat Pembelian & Hak Akses E-Book
- [Dashboard Admin & Laporan Penjualan (`admin-dashboard.md`)](./06-modules/admin-dashboard.md) — Modul Dashboard Admin & Laporan Penjualan

### 07. Keamanan (`07-security/`)
- [Gambaran Umum Keamanan (`security-overview.md`)](./07-security/security-overview.md) — Analisis kontrol keamanan aktual dan target
- [Pedoman Keamanan (`security-guidelines.md`)](./07-security/security-guidelines.md) — Pedoman perlindungan kredensial, API, file PDF, dan data pelanggan

### 08. Pengembangan (`08-development/`)
- [Panduan Instalasi (`installation.md`)](./08-development/installation.md) — Panduan instalasi & setup lokal
- [Panduan Pengembangan (`development-guide.md`)](./08-development/development-guide.md) — Panduan alur pengembangan monorepo
- [Konfigurasi Lingkungan (`environment-configuration.md`)](./08-development/environment-configuration.md) — Variabel lingkungan & template `.env.example`
- [Konvensi Penulisan Kode (`coding-conventions.md`)](./08-development/coding-conventions.md) — Standar kode & aturan teknis

### 09. Pengujian (`09-testing/`)
- [Strategi Pengujian (`testing-strategy.md`)](./09-testing/testing-strategy.md) — Strategi pengujian per lapisan
- [Kasus Uji (`test-cases.md`)](./09-testing/test-cases.md) — Skenario uji fungsional & keamanan
- [Hasil Pengujian (`test-results.md`)](./09-testing/test-results.md) — Catatan hasil pengujian aktual

### 10. Pemeliharaan (`10-maintenance/`)
- [Penanganan Masalah (`troubleshooting.md`)](./10-maintenance/troubleshooting.md) — Penanganan masalah umum pengembangan & runtime
- [Panduan Pemeliharaan (`maintenance-guide.md`)](./10-maintenance/maintenance-guide.md) — Panduan pemeliharaan sistem

---

## Dokumen Referensi Awal Proyek (Eksisting)
Dokumen berikut sudah tersedia sebelumnya di repository dan tetap dipertahankan sebagai referensi:
- [Indeks Sumber Kebenaran (`docs-proyek-ebook-ecommerce.md`)](./docs-proyek-ebook-ecommerce.md)
- [Keputusan Terbuka (`00-project/keputusan-terbuka.md`)](./00-project/keputusan-terbuka.md)
- [Architecture Decision Records (`adr/`)](./adr/0001-single-seller-b2c.md)
- [Spesifikasi OpenAPI Kerangka (`02-api/api-spec.yaml`)](./02-api/api-spec.yaml)
