# Dokumentasi Proyek: Sistem Informasi E-Book dan SPK Berbasis Mobile (Metode SAW)

## A. Identitas Dokumen

- **Judul Proyek:** Sistem Informasi E-Commerce E-Book dan Sistem Pendukung Keputusan (SPK) Metode Simple Additive Weighting (SAW)
- **Status Proyek Keseluruhan:** Sebagian besar `[ADA]` (fondasi monorepo, REST API inti & Admin CRUD lengkap backend dengan 17 file Vitest dan 146 test lulus, verifikasi live database PostgreSQL Supabase termigrasi & terseed, verifikasi live Supabase Auth Admin & Storage privat `ebooks-private`, antarmuka `web/admin-web` Neo-Brutalism terhubung API dashboard/SAW/analitik/keuangan, etalase `web/pengunjung-web` 9 layar terhubung API katalog/SAW/order dengan fallback simulasi, modul `mobile/ebook_store` dengan 152/152 skenario test lulus & `flutter analyze` tanpa issue, serta 43 halaman desain FigCraft lintas 3 platform di `design/`); sebagian `[RENCANA]` (pengujian E2E live lintas platform, aktivasi default remote `mobile/ebook_store`, dan deployment hosting).
- **Fungsi Dokumen:** Sumber kebenaran utama (_single source of truth_) dan indeks resmi status proyek.
- **Tanggal Pembaruan Terakhir:** 27 November 2026
- **Audiens Dokumen:** Dosen pembimbing/penilai akademik, pemilik proyek, tim pengembang (`backend`, `web`, `mobile`), QA, serta pihak nonteknis.

### Cara Membaca Status

| Label       | Arti                                                                                                  |
| ----------- | ----------------------------------------------------------------------------------------------------- |
| `[ADA]`     | Artefak, implementasi, atau pengujian telah tersedia dan dapat dibuktikan secara nyata di repository. |
| `[RENCANA]` | Belum diimplementasikan, masih dalam perancangan, atau masih membutuhkan keputusan final.             |

---

## B. Ringkasan Eksekutif

- **Masalah yang Diselesaikan:** Pengelolaan katalog `e-book`, transaksi pembelian daring, perlindungan file PDF dari akses bebas, serta pemilihan rekomendasi `e-book` secara objektif dan konsisten.
- **Solusi yang Dibangun:** Sistem informasi e-commerce `e-book` berbasis arsitektur _Client–Server_ terpusat dengan integrasi _payment gateway_ nyata, **Supabase Auth**, penyimpanan PDF pada **Supabase Storage `bucket privat`**, serta mesin rekomendasi **SPK SAW** yang berjalan eksklusif di `backend/`.
- **Model Bisnis:** _Single-Seller B2C_ (satu toko resmi menjual langsung ke pembeli; bukan _marketplace_ multi-vendor, lihat [ADR-0001](./adr/0001-single-seller-b2c.md)).
- **Aktor Utama:** **Pelanggan** (_Customer_) dan **Admin**.
- **Platform Utama:** Aplikasi mobile Android (`mobile/ebook_store`), portal web pelanggan (`web/pengunjung-web`), dan aplikasi web administrasi (`web/admin-web`).
- **Peran Backend:** Menjadi pusat otorisasi (`JWT` + `RBAC`), validasi input (**Zod**), pengelolaan pesanan & _webhook_ pembayaran idempoten, penerbitan `signed URL`, dan perhitungan `SPK SAW`.
- **Peran SAW:** Membantu **Pelanggan** memperoleh peringkat rekomendasi `e-book` berbasis kriteria terukur; perhitungan dikunci **hanya di `backend/`** ([ADR-0002](./adr/0002-backend-only-saw.md)).
- **Batasan Akses PDF:** File PDF disimpan di `bucket privat` dan hanya dapat dibaca di dalam aplikasi (_in-app PDF reader_) via `signed URL` sementara setelah `backend/` memvalidasi `EbookAccess` aktif.
- **Status Implementasi Umum:** Fondasi teknis backend, REST API inti (`/auth/sync`, `/users/me`, katalog, pesanan, transaksi, webhook pembayaran, signed URL, dan rekomendasi SAW), `schema.prisma`, migrasi dan seeding database Supabase live, bucket privat Supabase Storage live, serta 16 file test Vitest dengan 104 test lulus sudah `[ADA]`; antarmuka `web/admin-web` Neo-Brutalism, etalase `web/pengunjung-web` (9 layar lengkap), serta modul `mobile/ebook_store` (23 file test / 151 skenario, 150 lulus dan 1 gagal pada `splash_screen_test.dart`) juga sudah `[ADA]`. aktivasi routing/submenu operasional admin-web, koneksi REST API penuh `pengunjung-web`, aktivasi default remote mobile, dan deployment cloud tetap `[RENCANA]`.

---

## C. Arsitektur Ringkas

```mermaid
flowchart LR
    Customer["Pelanggan"]
    Admin["Admin"]

    Mobile["Flutter Mobile"]
    VisitorWeb["Web Pengunjung"]
    AdminWeb["Admin Web"]

    Backend["Express REST API"]
    Auth["Supabase Auth"]
    Database[("PostgreSQL Supabase")]
    Storage["Supabase Storage Privat"]
    Payment["Payment Gateway"]

    Customer --> Mobile
    Customer --> VisitorWeb
    Admin --> AdminWeb

    Mobile --> Backend
    VisitorWeb --> Backend
    AdminWeb --> Backend

    Backend --> Auth
    Backend --> Database
    Backend --> Storage
    Backend --> Payment
    Payment --> Backend
```

**Penjelasan Prinsip Arsitektur:**

- Aplikasi klien (`Flutter Mobile`, `Web Pengunjung`, `Admin Web`) **tidak boleh** mengakses PostgreSQL atau `Supabase Storage Privat` secara langsung.
- `Express REST API` (`backend/`) menangani otorisasi peran, transaksi database atomik, perhitungan `SPK SAW`, dan penerbitan `signed URL` sementara.
- Storage file PDF bersifat **privat** (tidak ada unduhan publik bebas).
- _Payment gateway_ hanya mengirimkan notifikasi status pembayaran ke `backend/` melalui _webhook_ bertanda tangan yang tervalidasi.

---

## D. Status Implementasi Saat Ini

| Area                                             | Status                                                                                    | Bukti atau Catatan                                                                                                                                                                                                                                  | Dokumen Detail                                                                        |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Fondasi Monorepo**                             | `[ADA]`                                                                                   | Struktur `backend/`, `web/`, `mobile/`, `docs/`, `.gitignore`, `AGENTS.md`                                                                                                                                                                          | [`application-architecture.md`](./02-architecture/application-architecture.md)        |
| **Backend Express**                              | `[ADA]` API inti & Admin CRUD lengkap / `[RENCANA]` verifikasi E2E live                    | `GET /api/v1/health`, autentikasi, profil, katalog, pesanan, transaksi, webhook pembayaran, signed URL, rekomendasi SPK SAW, serta seluruh Admin CRUD (`/admin/ebooks`, `/admin/categories`, `/admin/customers`, `/admin/orders`, `/admin/orders/:id`, `/admin/payments`, `/admin/transactions`, `/admin/reports/sales`, `/admin/accesses/:id`, `/admin/saw/weights`, `/admin/dashboard`) tersedia di `backend/src/`. | [`api-overview.md`](./02-api/api-overview.md)                                         |
| **Prisma & Schema Database**                     | `[ADA]` skema, migrasi & seeding live                     | `backend/prisma/schema.prisma` valid; migrasi awal `20261116000000_init/` terdeploy ke Supabase live (`aws-0-ap-northeast-1.pooler.supabase.com:5432`); seeding simulasi 3 user, 3 kategori, 3 e-book, 2 order, 1 transaksi sukses via `seed.ts` dan diverifikasi via `test:cloud`. | [`erd.md`](./01-design/erd.md)                                                        |
| **Autentikasi Supabase**                         | `[ADA]` sinkronisasi backend & admin API live             | `auth.middleware.ts` memanggil `supabase.auth.getUser(token)`; endpoint `POST /api/v1/auth/sync` teruji; API Admin Auth Supabase live terhubung dan terverifikasi via `test:cloud`.                                  | [`authentication-and-authorization.md`](./02-api/authentication-and-authorization.md) |
| **Otorisasi Role (`RBAC`)**                      | `[ADA]` kerangka / `[RENCANA]` penuh                                                      | `authorize('ADMIN')` terpasang pada `/api/v1/admin/ping`; otorisasi endpoint bisnis belum ada                                                                                                                                                       | [`authentication-and-authorization.md`](./02-api/authentication-and-authorization.md) |
| **Katalog & Kategori**                           | `[ADA]` UI, router, service, dan test backend / `[RENCANA]` verifikasi data live          | UI penjelajahan katalog, filter kategori, pencarian, dan detail buku tersedia di `web/pengunjung-web` & `mobile/ebook_store`; router, service, repository, serta test katalog tersedia di backend. Koneksi data live belum diverifikasi. | [`ebook-catalog.md`](./06-modules/ebook-catalog.md)                                   |
| **Pembayaran**                                   | `[ADA]` Xendit Dynamic QRIS live Test Mode, kontrak webhook & test | UI alur pesanan & simulator status bayar tersedia di `web/pengunjung-web`; adapter pembuatan Dynamic QRIS Xendit (`xendit.client.ts`), penyimpanan `qrPayload` di `OrderService`, handler webhook `x-callback-token` Xendit + HMAC-SHA512 internal, 152 test Vitest lulus, dan verifikasi live Xendit Dynamic QRIS Test Mode (`npm run test:cloud` 4/4 `success: true`, `hasQrString: true`) telah berhasil dijalankan. | [`webhook-contract.md`](./02-api/webhook-contract.md)                                 |
| **Storage PDF Privat**                           | `[ADA]` bucket privat & signed URL live terverifikasi     | Bucket `ebooks-private` terkonfirmasi `public: false`; pengujian live upload file dummy PDF, verifikasi Signed URL sementara (HTTP 200), dan penolakan akses publik (HTTP 400) sukses terverifikasi via `test:cloud`. | [`ebook-access.md`](./06-modules/ebook-access.md)                                     |
| **Akses Signed URL**                             | `[ADA]` implementasi, test & live storage                 | Endpoint `GET /api/v1/ebooks/{id}/access-url`, validasi kepemilikan `EbookAccess`, dan integrasi Supabase Storage live terverifikasi dengan TTL 60 detik. | [`sequence-diagram.md`](./01-design/sequence-diagram.md)                              |
| **SPK SAW & Admin API**                           | `[ADA]` dataset, kalkulator, unit test, endpoint rekomendasi & admin SAW/dashboard | Dataset uji manual, fungsi normalisasi, pembobotan, tie-breaker, dan penanganan edge case di `saw.service.ts`; endpoint `GET /api/v1/recommendations/saw`, `GET /api/v1/admin/dashboard`, serta `GET/PUT /api/v1/admin/saw/weights` dan test integrasinya `[ADA]`. | [`saw-method.md`](./03-saw/saw-method.md)                                             |
| **Admin Web (`web/admin-web`)**                  | `[ADA]` konsol Neo-Brutalism & integrasi API (dashboard, CRUD, SAW, analitik, keuangan) / `[RENCANA]` uji E2E live | Fitur Login Admin Supabase Auth + RBAC backend, konsol admin Neo-Brutalism lengkap (`ebooks`, `categories`, `customers`, `transactions`, `spk-recommendations`, `analytics`, `finance`; `tsc --noEmit` & `eslint` PASS); fallback `"DATA SIMULASI"` otomatis aktif bila backend offline. | [`admin-dashboard.md`](./06-modules/admin-dashboard.md)                               |
| **Portal Pengunjung Web (`web/pengunjung-web`)** | `[ADA]` UI etalase 9 layar & service API (katalog, SAW, order, signed URL) / `[RENCANA]` uji E2E live | Etalase pelanggan lengkap 9 layar (`tsc --noEmit` & `eslint` PASS); `book.service.ts`, `recommendation.service.ts`, dan `order.service.ts` terhubung ke endpoint backend dengan fallback `"DATA SIMULASI"`. | [`system-scope.md`](./01-project-overview/system-scope.md)                            |
| **Mobile Flutter (`mobile/ebook_store`)**        | `[ADA]` 15 layar lengkap & 152/152 test lulus / `[RENCANA]` aktivasi default remote | Modul Splash, Auth (Login & Register), Katalog, Beranda, Keranjang, Checkout, Library + _in-app PDF reader_, Profil & Transaksi, Ulasan Pembaca, Peringkat SAW; `flutter analyze` (0 issue) & `flutter test` (152/152 lulus). Remote datasource `[ADA]` via flag, default masih mock. | [`application-architecture.md`](./02-architecture/application-architecture.md)        |
| **Dokumentasi API**                              | `[ADA]` spesifikasi OpenAPI 3.1 & endpoint inti + Admin CRUD lengkap                     | `docs/02-api/` lengkap (OpenAPI 3.1, kontrak webhook, katalog error, keterlacakan); seluruh endpoint inti dan Admin CRUD telah diimplementasikan & diuji. | [`api-spec.yaml`](./02-api/api-spec.yaml)                                             |
| **Dokumentasi Desain**                           | `[ADA]` dokumen UML/ERD & 43 halaman desain FigCraft (`design/`)                          | `docs/01-design/` lengkap + 3 file native FigCraft terverifikasi visual: `admin-web.figcraft` (16 hal), `pengunjung-web.figcraft` (11 hal), `ebook-store-mobile.figcraft` (16 hal). | [`design-traceability.md`](./01-design/design-traceability.md)                        |
| **Pengujian**                                    | `[ADA]` 146 test backend + 152 test mobile + security guard / `[RENCANA]` E2E live       | `npm run typecheck` backend lulus; 17 file test Vitest (146/146 lulus); `tsc` & `eslint` pada `admin-web` & `pengunjung-web` lulus; `flutter analyze` (0 issue) & `flutter test` (152/152 lulus); `scripts/security-check.mjs` PASS (1.001 file, 0 kebocoran). | [`test-results.md`](./09-testing/test-results.md)                                     |
| **Deployment**                                   | `[RENCANA]`                                                                               | Panduan konseptual tersedia; hosting backend menunggu Keputusan #10                                                                                                                                                                                 | [`deployment.md`](./05-deployment/deployment.md)                                      |
| **Audit Keamanan**                               | `[ADA]` aturan `.gitignore` / `[RENCANA]` audit runtime                                   | Aturan pencegahan secret di Git & klien `[ADA]`; audit runtime JWT & RBAC live `[RENCANA]`                                                                                                                                                          | [`security-overview.md`](./07-security/security-overview.md)                          |

---

## E. Indeks Dokumentasi Terstruktur

1. **Memahami Proyek:**
   - [`project-overview.md`](./01-project-overview/project-overview.md) — Latar belakang, tujuan, aktor, dan status aktual proyek (`[RENCANA]` / `[ADA]` fondasi).
   - [`project-plan.md`](./00-project/project-plan.md) — Peran tim 3 orang, tahapan kerja, milestone, dan mitigasi risiko (`[RENCANA]`).
   - [`stakeholder-analysis.md`](./01-project-overview/stakeholder-analysis.md) — Analisis pemangku kepentingan dan matriks komunikasi (`[ADA]` / `[RENCANA]`).
   - [`glossary.md`](./01-project-overview/glossary.md) — Kamus istilah resmi proyek (`[ADA]`).
2. **Memahami Kebutuhan & Ruang Lingkup:**
   - [`business-requirements.md`](./01-project-overview/business-requirements.md) — Kebutuhan bisnis terklasifikasi `BR-*` (`[RENCANA]`).
   - [`requirements.md`](./00-project/requirements.md) — Spesifikasi kebutuhan fungsional `FR-*` & non-fungsional `NFR-*` (`[RENCANA]`).
   - [`system-scope.md`](./01-project-overview/system-scope.md) — Batasan _in-scope_, _out-of-scope_, asumsi, dan kriteria penerimaan (`[ADA]` batasan / `[RENCANA]` fitur).
   - [`success-metrics.md`](./01-project-overview/success-metrics.md) & [`overview-traceability.md`](./01-project-overview/overview-traceability.md) — Indikator keberhasilan & keterlacakan bisnis (`[RENCANA]`).
3. **Memahami Desain Sistem (`01-design/`):**
   - [`use-case-diagram.md`](./01-design/use-case-diagram.md) & [`use-cases.md`](./01-design/use-cases.md) — Pemodelan aktor dan spesifikasi use case (`[RENCANA]`).
   - [`activity-diagram.md`](./01-design/activity-diagram.md), [`sequence-diagram.md`](./01-design/sequence-diagram.md), & [`dfd.md`](./01-design/dfd.md) — Alur proses, interaksi komponen, dan arus data (`[RENCANA]`).
   - [`class-diagram.md`](./01-design/class-diagram.md), [`component-diagram.md`](./01-design/component-diagram.md), [`data-flow.md`](./01-design/data-flow.md), [`design-traceability.md`](./01-design/design-traceability.md), & [`design-assumptions-and-gaps.md`](./01-design/design-assumptions-and-gaps.md) (`[ADA]` sebagian skema / `[RENCANA]` fitur).
4. **Memahami Arsitektur:**
   - [`architecture.md`](./01-design/architecture.md), [`system-architecture.md`](./02-architecture/system-architecture.md), [`application-architecture.md`](./02-architecture/application-architecture.md), & [`technology-stack.md`](./02-architecture/technology-stack.md) (`[ADA]` kerangka / `[RENCANA]` integrasi).
5. **Memahami Database:**
   - [`erd.md`](./01-design/erd.md) — Acuan ERD terbaru berbasis `schema.prisma` (`[ADA]` definisi model & migrasi live).
   - [`database-design.md`](./04-database/database-design.md), [`data-dictionary.md`](./04-database/data-dictionary.md), & [`04-database/erd.md`](./04-database/erd.md) — Rancangan awal (`[RENCANA]`, memiliki perbedaan penamaan tabel lama yang dicatat di `design-assumptions-and-gaps.md`).
6. **Memahami API:**
   - [`api-spec.yaml`](./02-api/api-spec.yaml), [`api-overview.md`](./02-api/api-overview.md), [`authentication-and-authorization.md`](./02-api/authentication-and-authorization.md), [`api-conventions.md`](./02-api/api-conventions.md), [`error-catalog.md`](./02-api/error-catalog.md), [`webhook-contract.md`](./02-api/webhook-contract.md), & [`api-traceability.md`](./02-api/api-traceability.md) (`[ADA]` endpoint inti: health, auth, katalog, pesanan, transaksi, webhook, signed URL, SAW, dashboard & bobot admin / `[RENCANA]` admin CRUD lanjutan).
   - [`05-api/api-overview.md`](./05-api/api-overview.md) & [`05-api/api-endpoints.md`](./05-api/api-endpoints.md) — Rancangan API tahap awal (`[RENCANA]`).
7. **Memahami Proses Bisnis:**
   - [`customer-workflow.md`](./03-business-process/customer-workflow.md), [`admin-workflow.md`](./03-business-process/admin-workflow.md), & [`transaction-workflow.md`](./03-business-process/transaction-workflow.md) (`[ADA]` dokumen alur / sebagian `[ADA]` implementasi backend).
8. **Memahami SAW:**
   - [`saw-method.md`](./03-saw/saw-method.md) & [`perhitungan-manual.md`](./03-saw/perhitungan-manual.md) (`[ADA]` metode, dataset uji, & kalkulator backend).
9. **Memahami Modul Aplikasi (`06-modules/`):**
   - [`authentication.md`](./06-modules/authentication.md), [`ebook-catalog.md`](./06-modules/ebook-catalog.md), [`order-management.md`](./06-modules/order-management.md), [`payment-management.md`](./06-modules/payment-management.md), [`ebook-access.md`](./06-modules/ebook-access.md), & [`admin-dashboard.md`](./06-modules/admin-dashboard.md) (`[ADA]` modul inti / `[RENCANA]` admin CRUD lanjutan).
10. **Menjalankan Proyek (`08-development/`):**
    - [`installation.md`](./08-development/installation.md), [`development-guide.md`](./08-development/development-guide.md), [`environment-configuration.md`](./08-development/environment-configuration.md), & [`coding-conventions.md`](./08-development/coding-conventions.md) (`[ADA]` panduan setup).
11. **Menguji Proyek (`09-testing/` & `04-testing/`):**
    - [`testing-strategy.md`](./09-testing/testing-strategy.md), [`test-cases.md`](./09-testing/test-cases.md), [`test-results.md`](./09-testing/test-results.md) (`[ADA]` hasil backend & mobile), serta [`04-testing/test-report.md`](./04-testing/test-report.md).
12. **Melakukan Audit Keamanan (`07-security/`):**
    - [`security-overview.md`](./07-security/security-overview.md) & [`security-guidelines.md`](./07-security/security-guidelines.md) (`[RENCANA]` kontrol runtime / `[ADA]` pedoman).
13. **Melakukan Deployment & Pemeliharaan:**
    - [`deployment.md`](./05-deployment/deployment.md), [`maintenance-guide.md`](./10-maintenance/maintenance-guide.md), & [`troubleshooting.md`](./10-maintenance/troubleshooting.md) (`[RENCANA]` / panduan operasional).
14. **Memahami Keputusan Arsitektur:**
    - [`0001-single-seller-b2c.md`](./adr/0001-single-seller-b2c.md), [`0002-backend-only-saw.md`](./adr/0002-backend-only-saw.md), [`0003-admin-web-sebelum-mobile.md`](./adr/0003-admin-web-sebelum-mobile.md), & [`keputusan-terbuka.md`](./00-project/keputusan-terbuka.md).

---

## F. Roadmap Pengembangan (Urutan Terkunci)

Mengacu pada [ADR-0003](./adr/0003-admin-web-sebelum-mobile.md) dan [`project-plan.md`](./00-project/project-plan.md):

| Fase                                                  | Tujuan                                                                                    | Output Utama                                                                                                                                                                               | Ketergantungan                               | Kriteria Selesai                                                               | Status                                                                                   |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| **Fase 0 — Fondasi**                                  | Menyiapkan struktur monorepo, skema awal, dan kerangka aplikasi.                          | Express + Zod + `schema.prisma`, unit test Vitest, template Vite & Flutter.                                                                                                                | —                                            | `typecheck`, `lint`, `build`, `prisma:validate`, dan tes dasar PASS.           | `[ADA]`                                                                                  |
| **Fase 1 — Backend**                                  | Membangun seluruh REST API, migrasi DB, integrasi Supabase/Gateway, dan `SPK SAW`.        | Migrasi Prisma, seeding, API Auth, Profil, Katalog Publik, Pemesanan, Webhook Pembayaran, Signed URL PDF, rekomendasi SPK SAW, dashboard admin, & bobot SAW `[ADA]`; API Admin CRUD lanjutan `[RENCANA]`. | Penguncian keputusan terbuka #5–#7, #9, #11. | Seluruh unit & integration test backend PASS + uji konektivitas DB berhasil.   | Sebagian besar `[ADA]` / `[RENCANA]` (API Admin CRUD lanjutan)                          |
| **Fase 2 — Admin Web**                                | Menyediakan antarmuka operasional **Admin** bergaya Neo-Brutalism.                        | `web/admin-web` konsol Neo-Brutalism `[ADA]`; integrasi API dashboard & bobot SAW `[ADA]`; submenu operasional live `[RENCANA]`.                                                           | Fase 1 selesai & teruji.                     | Admin dapat CRUD katalog/PDF & pantau transaksi; `lint` & `build` PASS.        | Sebagian `[ADA]` (UI & API dashboard/SAW) / `[RENCANA]` (submenu operasional)            |
| **Fase 3 — Mobile & Web Pengunjung**                  | Menyediakan aplikasi **Pelanggan** di Android (`ebook_store`) dan web (`pengunjung-web`). | Etalase 9 layar pengunjung web `[ADA]`; modul mobile lengkap (Splash, Auth, Katalog, Beranda, Keranjang, Checkout, Library/PDF Reader, Profil & Transaksi, Ulasan, Peringkat SAW) `[ADA]`; koneksi REST API penuh & aktivasi default remote `[RENCANA]`. | Fase 1 & Fase 2 (data katalog nyata) siap.   | Alur _end-to-end_ beli hingga baca PDF lulus; `flutter analyze` & `test` PASS. | Sebagian `[ADA]` (UI & remote datasource) / `[RENCANA]` (koneksi default/live)           |
| **Fase 4 — Pengujian Terpadu, Keamanan & Deployment** | Memverifikasi kualitas, keamanan, dan kesiapan rilis sistem.                              | Laporan uji `test-cases.md`, audit secret/RBAC/PDF privat, konfigurasi deploy.                                                                                                             | Fase 1–3 selesai + Keputusan #10.            | Nol kebocoran secret, seluruh skenario `test-cases.md` lulus.                  | `[RENCANA]`                                                                              |

---

## G. Aturan Kritis Proyek (`[ADA]` pada `AGENTS.md`)

1. **SAW hanya di backend:** Klien dilarang menghitung skor akhir SAW atau mengirim bobot mentah yang dipercaya server.
2. **Otorisasi di backend:** Token `JWT` dan `UserRole` diverifikasi di `backend/`; menyembunyikan menu di UI hanya kosmetik.
3. **Bucket PDF privat & `signed URL` sementara:** File PDF dilarang diletakkan di bucket publik; akses hanya via `signed URL` TTL singkat setelah validasi `EbookAccess`.
4. **Tidak ada secret pada repository:** Dilarang commit `.env` atau menaruh secret di variabel `VITE_*` maupun kode Flutter.
5. **Data simulasi wajib berlabel:** Setiap data placeholder wajib diberi label `"DATA SIMULASI"`.
6. **Status dokumentasi konsisten & jujur:** Fitur tidak boleh diklaim `[ADA]` sebelum implementasi dan pengujiannya benar-benar dijalankan.
7. **Urutan pengerjaan terkunci:** `Backend -> Admin Web -> Mobile`.

---

## H. Keputusan Terbuka dan Risiko

Ringkasan keputusan yang masih `[RENCANA]` (rincian lengkap tersedia di [`keputusan-terbuka.md`](./00-project/keputusan-terbuka.md)):

| ID          | Topik                                 | Dampak Utama                                                                              | Status      | Dokumen Detail                                              |
| ----------- | ------------------------------------- | ----------------------------------------------------------------------------------------- | ----------- | ----------------------------------------------------------- |
| **#5**      | Pengubahan bobot SAW oleh pelanggan   | Menentukan apakah API rekomendasi menerima pilihan preset bobot atau terkunci oleh Admin. | `[RENCANA]` | [`keputusan-terbuka.md`](./00-project/keputusan-terbuka.md) |
| **#6 & #7** | Ulasan, rating, & e-book tanpa rating | Menentukan penambahan model `Review` di Prisma dan aturan normalisasi `ratingAvg = 0`.    | `[RENCANA]` | [`keputusan-terbuka.md`](./00-project/keputusan-terbuka.md) |
| **#8**      | Identitas & logo final aplikasi       | Memengaruhi penamaan tampilan UI pada `admin-web`, `pengunjung-web`, dan `ebook_store`.   | `[RENCANA]` | [`keputusan-terbuka.md`](./00-project/keputusan-terbuka.md) |
| **#9**      | Konflik 4 vs 5 kriteria SAW           | **Kritis:** Menentukan kriteria final, bobot, perhitungan manual, dan unit test backend.  | `[RENCANA]` | [`keputusan-terbuka.md`](./00-project/keputusan-terbuka.md) |
| **#10**     | Platform hosting backend              | Memengaruhi manajemen koneksi Prisma/PostgreSQL dan stabilitas _webhook_.                 | `[RENCANA]` | [`keputusan-terbuka.md`](./00-project/keputusan-terbuka.md) |
| **#11**     | Penyimpanan riwayat rekomendasi SAW   | Menentukan perlu tidaknya tabel snapshot historis SAW di `schema.prisma`.                 | `[RENCANA]` | [`keputusan-terbuka.md`](./00-project/keputusan-terbuka.md) |
