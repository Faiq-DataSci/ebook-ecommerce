# Ketertelusuran Proses Bisnis (Process Traceability)

> **Status Dokumen:** `[ADA]` (Dokumentasi pemetaan ketertelusuran) | **Implementasi Fitur:** `[RENCANA]`
> **Sumber Kebenaran Utama:** [`requirements.md`](../00-project/requirements.md), [`api-spec.yaml`](../02-api/api-spec.yaml), [`schema.prisma`](../../backend/prisma/schema.prisma), [`test-cases.md`](../09-testing/test-cases.md)

Dokumen ini memetakan keterkaitan menyeluruh dari **Kebutuhan (`Requirement ID`)** ke **Proses Bisnis (`BP-*`)**, **Aktor**, **Modul & Endpoint**, **Entitas Prisma**, **Test Case**, dan **Status Implementasi**.

---

## 1. Pemetaan Kebutuhan Fungsional Pelanggan (`FR-C*`)

| Requirement ID | ID Proses | Nama Proses | Aktor | Modul Terkait | Endpoint API | Entitas Prisma | Test Case | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-C01** | `BP-C01` | Registrasi & Login Akun Pelanggan | Pelanggan | Auth, Mobile, Web Pengunjung | `POST /api/v1/auth/register`, `POST /api/v1/auth/login` `[RENCANA]` | `User` | `TC-AUTH-01`, `TC-AUTH-02` | `[RENCANA]` |
| **FR-C02** | `BP-C02` | Penelusuran Katalog E-Book | Pelanggan, Pengunjung Publik | Catalog, Mobile, Web Pengunjung | `GET /api/v1/ebooks` `[RENCANA]` | `Ebook`, `Category` | — | `[RENCANA]` |
| **FR-C03** | `BP-C03`, `BP-C04` | Pencarian & Filter Kategori E-Book | Pelanggan, Pengunjung Publik | Catalog, Mobile, Web Pengunjung | `GET /api/v1/ebooks`, `GET /api/v1/categories` `[RENCANA]` | `Ebook`, `Category` | `TC-CAT-01` | `[RENCANA]` |
| **FR-C04** | `BP-C05` | Melihat Detail E-Book | Pelanggan, Pengunjung Publik | Catalog, Mobile, Web Pengunjung | `GET /api/v1/ebooks/:id` `[RENCANA]` | `Ebook`, `Category` | — | `[RENCANA]` |
| **FR-C05** | `BP-C06` | Mendapatkan Rekomendasi E-Book Berbasis SPK SAW | Pelanggan, Pengunjung Publik | SAW Recommendation, Mobile, Web | `GET /api/v1/recommendations/saw` `[RENCANA]` | `Ebook`, `Category` | `TC-SAW-01` | `[RENCANA]` |
| **FR-C06** | `BP-C07` | Membuat Pesanan (Checkout) | Pelanggan | Order, Mobile | `POST /api/v1/orders` `[RENCANA]` | `Order`, `OrderItem`, `Ebook`, `EbookAccess` | `TC-ORD-01` | `[RENCANA]` |
| **FR-C07** | `BP-C08`, `BP-C09` | Memulai Pembayaran & Memantau Status | Pelanggan, Payment Gateway | Payment, Webhook, Mobile | `POST /api/v1/payments`, `GET /api/v1/payments/:id`, `POST /api/v1/webhooks/payment` `[RENCANA]` | `Payment`, `Order`, `Transaction`, `EbookAccess` | `TC-PAY-01`, `TC-PAY-02` | `[RENCANA]` |
| **FR-C08** | `BP-C10` | Melihat Riwayat Pesanan & Transaksi | Pelanggan | Order, Transaction, Mobile | `GET /api/v1/orders`, `GET /api/v1/orders/:id` `[RENCANA]` | `Order`, `OrderItem`, `Payment`, `Transaction` | — | `[RENCANA]` |
| **FR-C09** | `BP-C11` | Mengakses Koleksi E-Book Saya (`EbookAccess`) | Pelanggan | Ebook Access, Mobile | `GET /api/v1/library` `[RENCANA]` | `EbookAccess`, `Ebook` | `TC-ACC-01` | `[RENCANA]` |
| **FR-C10** | `BP-C11` | Mendapatkan Signed URL E-Book Terproteksi | Pelanggan | Ebook Access, Supabase Storage | `POST /api/v1/ebooks/:id/access-url` `[RENCANA]` | `EbookAccess`, `Ebook` | `TC-ACC-01`, `TC-ACC-02` | `[RENCANA]` |
| **FR-C11** | `BP-C12` | Membaca E-Book di Dalam Aplikasi | Pelanggan | Mobile PDF Reader | — *(menggunakan signed URL)* | `EbookAccess` | — | `[RENCANA]` |
| **FR-C12** | `BP-C01` *(profil)* | Melihat & Memperbarui Profil Pelanggan | Pelanggan | User/Auth, Mobile | `GET /api/v1/auth/me` `[RENCANA]` | `User` | `TC-AUTH-03` | `[RENCANA]` |

---

## 2. Pemetaan Kebutuhan Fungsional Admin (`FR-A*`)

| Requirement ID | ID Proses | Nama Proses | Aktor | Modul Terkait | Endpoint API | Entitas Prisma | Test Case | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-A01** | `BP-A01`, `BP-A02` | Autentikasi & Profil Admin | Admin | Auth, Admin Web | `POST /api/v1/auth/login`, `GET /api/v1/auth/me` `[RENCANA]`; `GET /api/v1/admin/ping` `[ADA]` | `User` | `TC-AUTH-03` | `[RENCANA]` *(ping `[ADA]`)* |
| **FR-A02** | `BP-A03` | Mengelola Kategori E-Book (CRUD) | Admin | Category Admin, Admin Web | `/api/v1/admin/categories` `[RENCANA]` | `Category` | — | `[RENCANA]` |
| **FR-A03** | `BP-A04`, `BP-A05`, `BP-A06` | Mengelola Katalog E-Book (Buat, Ubah, Arsip) | Admin | Ebook Admin, Admin Web | `/api/v1/admin/ebooks` `[RENCANA]` | `Ebook`, `Category` | — | `[RENCANA]` |
| **FR-A04** | `BP-A07` | Mengunggah Sampul E-Book | Admin | Storage/Upload, Admin Web | `POST /api/v1/admin/ebooks/:id/cover` `[RENCANA]` | `Ebook` | — | `[RENCANA]` |
| **FR-A05** | `BP-A08` | Mengunggah File PDF E-Book ke Bucket Privat | Admin | Storage/Upload, Supabase Storage | `POST /api/v1/admin/ebooks/:id/pdf` `[RENCANA]` | `Ebook` | — | `[RENCANA]` |
| **FR-A06** | `BP-A09` | Melihat Daftar Pelanggan | Admin | User Admin, Admin Web | `GET /api/v1/admin/customers` `[RENCANA]` | `User` | — | `[RENCANA]` |
| **FR-A07** | `BP-A10` | Memantau Daftar & Detail Pesanan | Admin | Order Admin, Admin Web | `GET /api/v1/admin/orders` `[RENCANA]` | `Order`, `OrderItem`, `User` | — | `[RENCANA]` |
| **FR-A08** | `BP-A11`, `BP-A12` | Memantau Pembayaran & Transaksi | Admin | Payment/Transaction Admin, Admin Web | `GET /api/v1/admin/payments`, `GET /api/v1/admin/transactions` `[RENCANA]` | `Payment`, `Transaction` | — | `[RENCANA]` |
| **FR-A09** | `BP-A13` | Melihat Ringkasan Laporan Penjualan | Admin | Report Admin, Admin Web | `GET /api/v1/admin/reports/sales` `[RENCANA]` | `Order`, `Transaction`, `Ebook` | — | `[RENCANA]` |
| **FR-A10** | `BP-A14`, `BP-A15` | Mengatur Bobot Kriteria & Mengaudit Hasil SAW | Admin | SAW Admin, Admin Web | `GET/PUT /api/v1/admin/saw/weights`, `GET /api/v1/admin/saw/audit` `[RENCANA]` | `Ebook` *(konfigurasi bobot `[RENCANA]`)* | `TC-SAW-01` | `[RENCANA]` |
| **FR-A11** | `BP-A16` | Mencabut atau Memulihkan `EbookAccess` | Admin | Access Admin, Admin Web | `PATCH /api/v1/admin/ebook-accesses/:id` `[RENCANA]` | `EbookAccess` | `TC-ACC-02` | `[RENCANA]` |

---

## 3. Pemetaan Kebutuhan Fungsional Sistem & Non-Fungsional (`FR-S*` & `NFR-*`)

| Requirement ID | Proses / Cakupan Terkait | Aktor / Komponen | Mekanisme Teknis | Referensi Dokumen | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-S01** | `BP-C08`, `EX-10` | Payment Gateway -> Backend | Verifikasi signature webhook dan status resmi pembayaran di backend | [`transaction-workflow.md`](./transaction-workflow.md) | `[RENCANA]` |
| **FR-S02** | `BP-C08`, `EX-11`, `EX-12` | Backend -> PostgreSQL | Idempotency webhook & `prisma.$transaction` untuk `Payment`, `Order`, `Transaction`, `EbookAccess` | [`transaction-workflow.md`](./transaction-workflow.md) | `[RENCANA]` |
| **FR-S03** | `BP-C06`, `BP-A14` | Backend (`SawService`) | Normalisasi matriks Benefit/Cost & peringkat SAW murni di backend | [`saw-recommendation-workflow.md`](./saw-recommendation-workflow.md) | `[RENCANA]` |
| **FR-S04** | `BP-C11`, `BP-A08` | Backend -> Supabase Storage | Bucket privat PDF + helper `createPrivatePdfSignedUrl` | [`ebook-access-workflow.md`](./ebook-access-workflow.md) | `[RENCANA]` *(helper `[ADA]`)* |
| **FR-S05** | `BP-C01`–`BP-C12`, `BP-A01`–`BP-A16` | Backend (`AuthMiddleware`) | Verifikasi JWT Supabase dan role `CUSTOMER`/`ADMIN` di backend | [`admin-workflow.md`](./admin-workflow.md) | `[ADA]` *(dasar `/admin/ping`)* / `[RENCANA]` *(bisnis)* |
| **FR-S06** | Seluruh proses mutasi & error | Backend (`validate.ts`, `error.middleware.ts`) | Validasi payload Zod dan format error standar terstruktur | [`exception-and-alternative-flows.md`](./exception-and-alternative-flows.md) | `[ADA]` *(middleware dasar)* |
| **NFR-01** | Keamanan & Privasi Data | Backend, Klien, Storage | Tidak ada secret di klien, bucket privat, RLS/izin ketat | [`business-rules.md`](./business-rules.md) | `[RENCANA]` *(partial env `[ADA]`)* |
| **NFR-02** | Keandalan & Konsistensi Data | Backend & Database | Transaksi atomik & constraint unik (`@@unique`) pada Prisma | [`schema.prisma`](../../backend/prisma/schema.prisma) | `[RENCANA]` *(schema `[ADA]`)* |
| **NFR-03** | Kinerja & Latensi Endpoint | Backend & Klien | Pagination katalog/admin, query terindeks, rate limiting | [`api-spec.yaml`](../02-api/api-spec.yaml) | `[RENCANA]` *(rate-limiter `[ADA]` belum terpasang)* |
| **NFR-04** | Kemudahan Pemeliharaan (Maintainability) | Seluruh Repository | TypeScript strict, ESM `.js`, modular service/controller | [`AGENTS.md`](../../AGENTS.md) | `[ADA]` *(fondasi struktur & typecheck)* |
| **NFR-05** | Keterujian (Testability) | Backend, Web, Mobile | Vitest di backend, lint/build web, `flutter test` mobile | [`test-results.md`](../09-testing/test-results.md) | `[ADA]` *(baseline 5 test backend)* / `[RENCANA]` *(fitur bisnis)* |
| **NFR-06** | Auditabilitas & Logging | Backend | Pencatatan error terstruktur & audit log transaksi/akses | [`admin-workflow.md`](./admin-workflow.md) | `[RENCANA]` |
| **NFR-07** | Ketersediaan (Availability) | Backend & Supabase | Health check endpoint `/api/v1/health` & fallback aman | [`app.ts`](../../backend/src/app.ts) | `[ADA]` *(`/health`)* / `[RENCANA]` *(hosting produksi)* |
| **NFR-08** | Kegunaan & Konsistensi UI | Admin Web, Web Pengunjung, Mobile | Neo-brutalism Admin Web (3 zona), UI responsif mobile/web | [`customer-workflow.md`](./customer-workflow.md), [`admin-workflow.md`](./admin-workflow.md) | `[RENCANA]` *(landing/kerangka `[ADA]`)* |
