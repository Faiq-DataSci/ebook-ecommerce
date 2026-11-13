# Dokumentasi Proyek — E-Book Store & SPK (Metode SAW)

## A. Pengantar Singkat

- **Apa proyek ini:** Sistem informasi e-commerce penjualan buku elektronik (`e-book`) berbasis *single-seller B2C* yang dilengkapi Sistem Pendukung Keputusan (`SPK SAW`) untuk rekomendasi `e-book`.
- **Tujuan sistem:** Mempermudah **Pelanggan** menemukan, membeli, dan membaca `e-book` secara aman di dalam aplikasi, serta membantu **Admin** mengelola katalog, transaksi, laporan penjualan, dan bobot rekomendasi secara terpusat.
- **Pengguna utama:** **Pelanggan** (`mobile/ebook_store` dan `web/pengunjung-web`) serta **Admin** (`web/admin-web`).
- **Status umum proyek:** `[RENCANA]` — fondasi `backend/` (`/api/v1/health`, `/api/v1/admin/ping`, middleware dasar, `schema.prisma`, dan 5 unit test) serta template awal klien sudah `[ADA]`, sedangkan seluruh fitur bisnis belum diimplementasikan (`[RENCANA]`).
- **Sumber kebenaran utama:** [`docs-proyek-ebook-ecommerce.md`](./docs-proyek-ebook-ecommerce.md).

---

## B. Mulai dari Sini

| Saya ingin... | Baca dokumen ini |
|---|---|
| Memahami proyek secara umum | [`docs-proyek-ebook-ecommerce.md`](./docs-proyek-ebook-ecommerce.md) |
| Memahami kebutuhan bisnis & fungsional | [`01-project-overview/`](./01-project-overview/project-overview.md) dan [`requirements.md`](./00-project/requirements.md) |
| Memahami desain dan diagram sistem | [`01-design/`](./01-design/use-case-diagram.md) |
| Memahami arsitektur | [`02-architecture/`](./02-architecture/system-architecture.md) |
| Memahami API (OpenAPI 3.1 & rancangan lama) | [`02-api/`](./02-api/api-overview.md) dan [`05-api/`](./05-api/api-overview.md) |
| Memahami metode SAW | [`03-saw/`](./03-saw/saw-method.md) |
| Memahami database | [`erd.md`](./01-design/erd.md) dan [`04-database/`](./04-database/database-design.md) |
| Menjalankan proyek secara lokal | [`08-development/`](./08-development/installation.md) |
| Menguji proyek | [`09-testing/`](./09-testing/testing-strategy.md) |
| Memeriksa keamanan | [`07-security/`](./07-security/security-overview.md) |
| Memahami keputusan teknis & terbuka | [`adr/`](./adr/0001-single-seller-b2c.md) dan [`keputusan-terbuka.md`](./00-project/keputusan-terbuka.md) |

---

## C. Peta Dokumentasi Lengkap

Struktur aktual folder pada `docs/`:

```text
docs/
├── 00-project/
├── 01-project-overview/
├── 01-design/
├── 02-architecture/
├── 02-api/
├── 03-business-process/
├── 03-saw/
├── 04-database/
├── 04-testing/
├── 05-api/
├── 05-deployment/
├── 06-modules/
├── 07-security/
├── 08-development/
├── 09-testing/
├── 10-maintenance/
└── adr/
```

| Folder | Tujuan | Dokumen Utama | Status Dokumentasi |
|---|---|---|---|
| **`00-project/`** | Rencana kerja, spesifikasi kebutuhan, dan keputusan terbuka | [`project-plan.md`](./00-project/project-plan.md), [`requirements.md`](./00-project/requirements.md), [`keputusan-terbuka.md`](./00-project/keputusan-terbuka.md) | `[ADA]` dokumen / `[RENCANA]` target |
| **`01-project-overview/`** | Ringkasan, kebutuhan bisnis, ruang lingkup, stakeholder, metrik, glosarium | [`project-overview.md`](./01-project-overview/project-overview.md), [`business-requirements.md`](./01-project-overview/business-requirements.md), [`system-scope.md`](./01-project-overview/system-scope.md) | `[ADA]` dokumen / `[RENCANA]` fitur |
| **`01-design/`** | Diagram UML/Mermaid, arsitektur, ERD terkini, DFD, keterlacakan | [`architecture.md`](./01-design/architecture.md), [`erd.md`](./01-design/erd.md), [`use-cases.md`](./01-design/use-cases.md), [`dfd.md`](./01-design/dfd.md) | `[ADA]` dokumen / `[RENCANA]` implementasi |
| **`02-architecture/`** | Arsitektur sistem, aplikasi monorepo, perbandingan stack | [`system-architecture.md`](./02-architecture/system-architecture.md), [`technology-stack.md`](./02-architecture/technology-stack.md) | `[ADA]` dokumen awal |
| **`02-api/`** | Spesifikasi OpenAPI 3.1, autentikasi, konvensi, error, kontrak webhook | [`api-spec.yaml`](./02-api/api-spec.yaml), [`api-overview.md`](./02-api/api-overview.md), [`webhook-contract.md`](./02-api/webhook-contract.md) | `[ADA]` spesifikasi / `[RENCANA]` endpoint bisnis |
| **`03-business-process/`** | Alur proses Pelanggan, Admin, dan siklus transaksi | [`customer-workflow.md`](./03-business-process/customer-workflow.md), [`transaction-workflow.md`](./03-business-process/transaction-workflow.md) | `[RENCANA]` |
| **`03-saw/`** | Metodologi SAW dan perhitungan manual dataset uji | [`saw-method.md`](./03-saw/saw-method.md), [`perhitungan-manual.md`](./03-saw/perhitungan-manual.md) | `[RENCANA]` (kerangka awal) |
| **`04-database/`** | Rancangan konseptual database & kamus data tahap awal | [`database-design.md`](./04-database/database-design.md), [`data-dictionary.md`](./04-database/data-dictionary.md) | `[RENCANA]` (perlu selaras `schema.prisma`) |
| **`04-testing/`** | Laporan pengujian struktur lama (referensi historis) | [`test-report.md`](./04-testing/test-report.md) | `[ADA]` arsip awal |
| **`05-api/`** | Rancangan endpoint API tahap awal (referensi transisi) | [`api-overview.md`](./05-api/api-overview.md), [`api-endpoints.md`](./05-api/api-endpoints.md) | `[RENCANA]` |
| **`05-deployment/`** | Panduan deployment sistem | [`deployment.md`](./05-deployment/deployment.md) | `[RENCANA]` |
| **`06-modules/`** | Deskripsi tanggung jawab per modul aplikasi | [`authentication.md`](./06-modules/authentication.md), [`ebook-catalog.md`](./06-modules/ebook-catalog.md), [`ebook-access.md`](./06-modules/ebook-access.md) | `[RENCANA]` |
| **`07-security/`** | Kebijakan dan pedoman keamanan sistem | [`security-overview.md`](./07-security/security-overview.md), [`security-guidelines.md`](./07-security/security-guidelines.md) | `[ADA]` pedoman / `[RENCANA]` kontrol runtime |
| **`08-development/`** | Panduan instalasi, konfigurasi `.env`, dan konvensi kode | [`installation.md`](./08-development/installation.md), [`coding-conventions.md`](./08-development/coding-conventions.md) | `[ADA]` panduan |
| **`09-testing/`** | Strategi uji, skenario uji, dan hasil validasi aktual | [`testing-strategy.md`](./09-testing/testing-strategy.md), [`test-cases.md`](./09-testing/test-cases.md), [`test-results.md`](./09-testing/test-results.md) | `[ADA]` hasil fondasi / `[RENCANA]` uji bisnis |
| **`10-maintenance/`** | Pemecahan masalah dan panduan pemeliharaan | [`troubleshooting.md`](./10-maintenance/troubleshooting.md), [`maintenance-guide.md`](./10-maintenance/maintenance-guide.md) | `[ADA]` panduan |
| **`adr/`** | *Architecture Decision Records* proyek | [`0001-single-seller-b2c.md`](./adr/0001-single-seller-b2c.md), [`0002-backend-only-saw.md`](./adr/0002-backend-only-saw.md), [`0003-admin-web-sebelum-mobile.md`](./adr/0003-admin-web-sebelum-mobile.md) | `[ADA]` keputusan terkunci |

---

## D. Aturan Membaca Status

- **`[ADA]`**: Sudah tersedia secara nyata di repository (kode, konfigurasi, skema, dokumen, atau hasil pengujian yang telah dijalankan).
- **`[RENCANA]`**: Belum diimplementasikan di kode sumber, masih berupa rancangan, atau menunggu keputusan final.

> **Catatan Penting:**
> - Dokumen rancangan **bukan** bukti implementasi.
> - Fitur baru hanya boleh dilabeli `[ADA]` setelah kode dan pengujiannya benar-benar tersedia serta dijalankan.
> - Informasi yang masih menunggu konfirmasi pemilik proyek harus tetap berstatus `[RENCANA]`.

---

## E. Ringkasan Stack

| Area | Teknologi | Status Berdasarkan Bukti |
|---|---|---|
| **Backend** | Node.js, Express, TypeScript, Zod, Prisma 7 (ESM) | `[ADA]` di `backend/package.json` & `backend/src/` |
| **Database** | PostgreSQL Supabase | `[ADA]` definisi di `backend/prisma/schema.prisma`; migrasi `[RENCANA]` |
| **Storage** | Supabase Storage privat (`signed URL`) | `[ADA]` helper dasar di `backend/src/integrations/storage/`; bucket & endpoint `[RENCANA]` |
| **Admin Web** | React, TypeScript, Vite (Neo-Brutalism) | `[ADA]` template TypeScript di `web/admin-web/package.json`; UI bisnis `[RENCANA]` |
| **Mobile** | Flutter, Riverpod, Dio (Android) | `[ADA]` template & paket di `mobile/ebook_store/pubspec.yaml`; fitur `[RENCANA]` |
| **SPK** | Metode SAW di `backend/` | Aturan arsitektur terkunci ([ADR-0002](./adr/0002-backend-only-saw.md)); implementasi `[RENCANA]` |

---

## F. Tautan Penting

- **Sumber Kebenaran Proyek:** [`docs-proyek-ebook-ecommerce.md`](./docs-proyek-ebook-ecommerce.md)
- **Rencana Proyek & Requirements:** [`project-plan.md`](./00-project/project-plan.md) | [`requirements.md`](./00-project/requirements.md)
- **Keputusan Terbuka & ADR:** [`keputusan-terbuka.md`](./00-project/keputusan-terbuka.md) | [`adr/`](./adr/0001-single-seller-b2c.md)
- **Desain & API:** [`01-design/`](./01-design/architecture.md) | [`api-spec.yaml`](./02-api/api-spec.yaml) | [`webhook-contract.md`](./02-api/webhook-contract.md)
- **Database & SAW:** [`erd.md`](./01-design/erd.md) | [`saw-method.md`](./03-saw/saw-method.md) | [`perhitungan-manual.md`](./03-saw/perhitungan-manual.md)
- **Pengujian & Keamanan:** [`test-cases.md`](./09-testing/test-cases.md) | [`test-results.md`](./09-testing/test-results.md) | [`security-overview.md`](./07-security/security-overview.md)
- **Setup, Deployment & Pemeliharaan:** [`installation.md`](./08-development/installation.md) | [`deployment.md`](./05-deployment/deployment.md) | [`troubleshooting.md`](./10-maintenance/troubleshooting.md)

---

## G. Kontribusi Dokumentasi

1. Perbarui dokumentasi terkait setiap kali ada perubahan fitur atau arsitektur.
2. Selalu gunakan label status `[ADA]` atau `[RENCANA]` secara jujur dan konsisten.
3. Dilarang memasukkan secret, token, API key, URL database, atau isi `.env`.
4. Periksa seluruh tautan Markdown relatif sebelum melakukan *commit*.
5. Sinkronkan dokumentasi dengan kondisi implementasi aktual di `backend/`, `web/`, dan `mobile/`.
6. Catat keputusan arsitektur penting sebagai ADR atau pada [`keputusan-terbuka.md`](./00-project/keputusan-terbuka.md).
7. Dilarang mengklaim hasil pengujian tanpa benar-benar menjalankannya.
