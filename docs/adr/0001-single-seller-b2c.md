# ADR-0001: Model Bisnis Single-Seller (B2C)

## Status
Diterima

- **Status Keputusan:** Diterima
- **Status Implementasi:** `[RENCANA]` (fitur bisnis belum berjalan; enum `UserRole` sudah `[ADA]` di `schema.prisma`)
- **Tanggal Keputusan:** 2026-11-14 *(diperluas dari keputusan awal fondasi proyek)*
- **Tanggal Pembaruan:** 2026-11-14
- **Pemutus:** Tim Proyek & Pemilik Proyek
- **Pengganti:** Tidak ada

## Konteks
Proyek ini adalah sistem informasi e-commerce e-book dengan SPK metode SAW berbasis mobile (didukung web) untuk kebutuhan akademik tim beranggotakan 3 orang. Mengadopsi model marketplace multi-penjual akan menambah kompleksitas signifikan seperti manajemen toko/penjual, perhitungan komisi, pencairan dana vendor (*payout*), moderasi konten pihak ketiga, dan isolasi data multi-tenant yang tidak dibutuhkan oleh ruang lingkup tugas maupun kapasitas waktu tim.

### Faktor yang Mempengaruhi
- Kompleksitas arsitektur dan skema basis data terhadap kapasitas tim 3 orang.
- Batas waktu pengembangan akademik agar seluruh fitur inti (katalog, SPK SAW, transaksi nyata, akses PDF privat) selesai teruji.
- Kebutuhan kejelasan alur otorisasi antara pengelola tunggal dan pembeli.

### Stakeholder
- **Pemilik Proyek & Dosen Pembimbing:** Memastikan ruang lingkup proyek terukur, realistis, dan selesai tepat waktu.
- **Tim Pengembang (3 Orang):** Memfokuskan implementasi pada alur transaksi inti dan algoritma SPK SAW tanpa beban fitur marketplace.
- **Pelanggan & Admin:** Mendapatkan pengalaman belanja tunggal yang konsisten dan pengelolaan katalog terpusat.

## Alternatif yang Dipertimbangkan

### Alternatif 1: Single-Seller B2C (2 Aktor: Pelanggan & Admin)
- **Deskripsi:** Seluruh katalog e-book dimiliki dan dikelola oleh satu pihak penjual resmi melalui Admin, sedangkan pengguna lain berperan sebagai Pelanggan.
- **Kelebihan:** Skema database ringkas, alur checkout dan pembayaran tunggal, RBAC sederhana (2 peran), katalog terpusat dan terkontrol.
- **Kekurangan:** Tidak mendukung pendaftaran penjual eksternal maupun pembagian pendapatan multi-vendor.
- **Status:** Dipilih

### Alternatif 2: Marketplace Multi-Vendor
- **Deskripsi:** Membuka pendaftaran penjual pihak ketiga untuk mengunggah e-book masing-masing dengan sistem komisi.
- **Kelebihan:** Skalabilitas variasi penjual dari pihak ketiga.
- **Kekurangan:** Membutuhkan tabel toko, verifikasi penjual, *split payment* / komisi, serta moderasi legalitas PDF yang berisiko tinggi dan di luar ruang lingkup.
- **Status:** Ditolak

### Alternatif 3: Model C2C / Peer-to-Peer
- **Deskripsi:** Pengguna dapat berperan ganda sebagai pembeli sekaligus penjual e-book antar-pengguna.
- **Kelebihan:** Fleksibilitas transaksi antar-pengguna.
- **Kekurangan:** Tidak sesuai dengan kebutuhan kontrol kurasi katalog akademik maupun proteksi aset digital terpusat.
- **Status:** Ditolak

## Keputusan
Sistem dirancang sebagai e-commerce e-book **single-seller (B2C)** dengan hanya dua aktor utama: **Pelanggan (`CUSTOMER`)** dan **Admin (`ADMIN`)**.

### Alasan
1. Menjaga skema database, endpoint API, dan alur transaksi tetap fokus pada kebutuhan inti proyek.
2. Menghindari kompleksitas manajemen toko, komisi, dan moderasi multi-penjual yang berada di luar ruang lingkup akademik.

## Konsekuensi

### Positif
- Skema database fokus pada entitas inti (`User`, `Category`, `Ebook`, `Order`, `OrderItem`, `Payment`, `Transaction`, `EbookAccess`).
- Alur transaksi dan rekonsiliasi pembayaran ke satu rekening merchant menjadi sederhana dan jelas.
- Kontrol otorisasi RBAC terpusat dan mudah diuji.

### Negatif
- Tidak mendukung fitur multi-vendor, manajemen komisi penjual, maupun moderasi konten *user-generated*.
- Penambahan aktor penjual di masa depan memerlukan perubahan skema dan arsitektur yang besar.

### Netral
- Seluruh pengelolaan katalog, harga, dan file PDF berada di bawah tanggung jawab Admin melalui `web/admin-web/`.

## Dampak Teknis

### Arsitektur
- Backend terpusat melayani klien pelanggan (`mobile/ebook_store` dan `web/pengunjung-web`) serta klien pengelola (`web/admin-web`).

### Database
- Tidak ada entitas `Seller` atau `Store` pada `backend/prisma/schema.prisma`.
- Enum `UserRole` pada `schema.prisma` (`[ADA]`) hanya memiliki dua nilai: `CUSTOMER` dan `ADMIN`.

### API
- Pemisahan jalur endpoint menjadi endpoint publik/pelanggan (`/api/v1/ebooks*`, `/api/v1/orders*`, `/api/v1/payments*`) dan endpoint administrasi (`/api/v1/admin/*`).

### Keamanan
- Penegakan RBAC 2 peran di backend melalui middleware `authenticate` dan `authorize('ADMIN')` (`[ADA]` kerangka di `auth.middleware.ts`).

### Pengujian
- Skenario uji otorisasi cukup memvalidasi 2 peran (`CUSTOMER` vs `ADMIN`) tanpa skenario isolasi antar-vendor.

### Deployment
- Cukup satu layanan backend dan satu database PostgreSQL Supabase terpusat.

## Referensi Silang
- **Kebutuhan:** `FR-C01`–`FR-C11`, `FR-A01`–`FR-A11` pada [`requirements.md`](../00-project/requirements.md)
- **Dokumen Arsitektur:** [`system-scope.md`](../01-project-overview/system-scope.md), [`business-requirements.md`](../01-project-overview/business-requirements.md), [`architecture-decisions-summary.md`](../02-architecture/architecture-decisions-summary.md)
- **Dokumen Desain:** [`use-cases.md`](../01-design/use-cases.md)
- **Dokumen Modul:** [`admin-dashboard.md`](../06-modules/admin-dashboard.md)
- **Keputusan Terbuka:** [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) (#1 sebagai referensi portal pelanggan)
- **ADR Terkait:** [`ADR-0003`](./0003-admin-web-sebelum-mobile.md), [`ADR-0007`](./0007-pengunjung-web-dipertahankan.md)
- **Bukti Teknis:** [`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma) (enum `UserRole`)

## Catatan
Keputusan ini mempertahankan keputusan asli `ADR-0001` dan memperluas detailnya sesuai standar template ADR proyek.
