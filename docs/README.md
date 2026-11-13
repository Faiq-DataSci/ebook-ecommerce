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

### 02. Arsitektur Sistem (`02-architecture/`) *(Tahap 2)*
- `system-architecture.md` — Gambaran umum arsitektur, alur API, autentikasi, transaksi, dan akses e-book
- `application-architecture.md` — Struktur aplikasi Mobile, Admin Web, Pengunjung Web, dan Backend
- `technology-stack.md` — Perbandingan stack aktual di repository vs stack terkunci proyek

### 03. Proses Bisnis (`03-business-process/`) *(Tahap 2)*
- `customer-workflow.md` — Alur pelanggan & skenario alternatif
- `admin-workflow.md` — Alur administrasi
- `transaction-workflow.md` — Siklus pesanan, pembayaran, transaksi, dan hak akses e-book

### 04. Basis Data (`04-database/`) *(Tahap 3)*
- `database-design.md` — Rancangan konseptual basis data (`[PROPOSED]`)
- `data-dictionary.md` — Kamus data entitas utama (`[PROPOSED]`)
- `erd.md` — Entity Relationship Diagram (Mermaid) (`[PROPOSED]`)

### 05. Spesifikasi API (`05-api/`) *(Tahap 3)*
- `api-overview.md` — Konvensi REST API, autentikasi, otorisasi, dan format respons
- `api-endpoints.md` — Rancangan endpoint per modul (`[PROPOSED]`)

### 06. Dokumentasi Modul (`06-modules/`) *(Tahap 4)*
- `authentication.md` — Modul Autentikasi & Manajemen Pengguna
- `ebook-catalog.md` — Modul Katalog & Kategori E-Book (serta integrasi SPK SAW)
- `order-management.md` — Modul Manajemen Pesanan
- `payment-management.md` — Modul Pembayaran & Transaksi
- `ebook-access.md` — Modul Riwayat Pembelian & Hak Akses E-Book
- `admin-dashboard.md` — Modul Dashboard Admin & Laporan Penjualan

### 07. Keamanan (`07-security/`) *(Tahap 4)*
- `security-overview.md` — Analisis kontrol keamanan aktual dan target
- `security-guidelines.md` — Pedoman perlindungan kredensial, API, file PDF, dan data pelanggan

### 08. Pengembangan (`08-development/`) *(Tahap 5)*
- `installation.md` — Panduan instalasi & setup lokal
- `development-guide.md` — Panduan alur pengembangan monorepo
- `environment-configuration.md` — Variabel lingkungan & template `.env.example`
- `coding-conventions.md` — Standar kode & aturan teknis

### 09. Pengujian (`09-testing/`) *(Tahap 5)*
- `testing-strategy.md` — Strategi pengujian per lapisan
- `test-cases.md` — Skenario uji fungsional & keamanan
- `test-results.md` — Catatan hasil pengujian aktual

### 10. Pemeliharaan (`10-maintenance/`) *(Tahap 5)*
- `troubleshooting.md` — Penanganan masalah umum pengembangan & runtime
- `maintenance-guide.md` — Panduan pemeliharaan sistem

---

## Dokumen Referensi Awal Proyek (Eksisting)
Dokumen berikut sudah tersedia sebelumnya di repository dan tetap dipertahankan sebagai referensi:
- [Indeks Sumber Kebenaran (`docs-proyek-ebook-ecommerce.md`)](./docs-proyek-ebook-ecommerce.md)
- [Keputusan Terbuka (`00-project/keputusan-terbuka.md`)](./00-project/keputusan-terbuka.md)
- [Architecture Decision Records (`adr/`)](./adr/0001-single-seller-b2c.md)
- [Spesifikasi OpenAPI Kerangka (`02-api/api-spec.yaml`)](./02-api/api-spec.yaml)
