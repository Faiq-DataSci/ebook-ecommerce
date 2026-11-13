# Matriks Keterlacakan Ikhtisar Proyek (`Overview Traceability Matrix`)

**Status:** `[RENCANA]` (keterlacakan fitur bisnis target) | `[ADA]` (hanya pada definisi `schema.prisma`, fondasi middleware, dan `/api/v1/health`)

Dokumen ini memastikan setiap kebutuhan bisnis pada [`business-requirements.md`](./business-requirements.md) tertelusur hingga ke kebutuhan fungsional (`requirements.md`), aktor, modul, artefak desain (`01-design/`), rancangan API (`05-api/`), entitas data (`schema.prisma`), serta skenario pengujian (`09-testing/test-cases.md`).

---

## 1. Matriks Keterlacakan End-to-End

| ID Bisnis | ID Fungsional (`requirements.md`) | Aktor | Modul Sistem (`06-modules/`) | Desain (`01-design/`) | Rancangan API (`05-api/api-endpoints.md`) `[RENCANA]` | Entitas Data (`schema.prisma`) | Skenario Uji (`test-cases.md`) | Status |
|---|---|---|---|---|---|---|---|---|
| **BR-C01** | `FR-C01`, `FR-C02` | Pelanggan | `authentication.md` | `UC-C01..C02`, AD #1, SD #1 | `GET /users/me` *(auth via Supabase Auth)* | `User` | `TC-AUTH-01`, `TC-AUTH-02` | `[RENCANA]` |
| **BR-C02** | `FR-C03`–`FR-C05` | Pelanggan | `ebook-catalog.md` | `UC-C03..C05`, AD #2 | `GET /categories`, `GET /ebooks`, `GET /ebooks/:id` | `Category`, `Ebook` | `TC-CAT-01` | `[RENCANA]` |
| **BR-C03** | `FR-C07` | Pelanggan | `order-management.md` | `UC-C07`, AD #4, SD #2 | `POST /orders` | `Order`, `OrderItem`, `Ebook`, `EbookAccess` | `TC-ORD-01` | `[RENCANA]` |
| **BR-C04** | `FR-C09`, `FR-C10` | Pelanggan | `order-management.md`, `ebook-access.md` | `UC-C09..C10`, AD #7, SD #3 | `GET /orders`, `GET /transactions/my` | `Order`, `Payment`, `Transaction` | `TC-PAY-01` | `[RENCANA]` |
| **BR-C05** | `FR-C12` | Pelanggan | *(Belum ada modul)* | `UC-C12` *(Gap — Keputusan #6, #7)* | *(Belum ada — Gap)* | `Review` `[RENCANA]` | *(Belum ada — Gap)* | `[RENCANA]` |
| **BR-A01** | `FR-A01` | Admin | `authentication.md` | `UC-A01`, AD #1, SD #1 | Endpoint `/admin/*` (role `ADMIN`) | `User`, `UserRole` | `TC-AUTH-03` | `[RENCANA]` |
| **BR-A02** | `FR-A02` | Admin | `admin-dashboard.md` | `UC-A02` | `GET /admin/reports/sales` | `Order`, `Transaction`, `Ebook`, `User` | *(Gap tes dashboard)* | `[RENCANA]` |
| **BR-A03** | `FR-A04` | Admin | `ebook-catalog.md` | `UC-A04`, AD #9 | `POST/PATCH/DELETE /admin/ebooks` | `Ebook`, `Category` | *(Gap tes CRUD e-book)* | `[RENCANA]` |
| **BR-A04** | `FR-A03` | Admin | `ebook-catalog.md` | `UC-A03`, AD #9 | `POST/PATCH/DELETE /admin/categories` | `Category` | *(Gap tes kategori)* | `[RENCANA]` |
| **BR-A05** | *(Gap)* | Admin | *(Opsional di `ebook-catalog.md`)* | *(Dikeluarkan dari `class-diagram.md`)* | *(Belum ada)* | `Ebook.author` (string) | *(Tidak ada)* | `[RENCANA]` |
| **BR-A06** | `FR-A05` | Admin | `authentication.md` | `UC-A05` | `GET /admin/customers` | `User` | *(Gap tes admin customer)* | `[RENCANA]` |
| **BR-O01** | `NFR-01` | Sistem (`backend`) | `authentication.md` | `component-diagram.md`, `data-flow.md` | Middleware JWT & RBAC | `User`, `UserRole` | `TC-AUTH-03` | `[ADA]` kerangka / `[RENCANA]` JWT |
| **BR-O02** | `FR-A04`, `NFR-07` | Sistem (`backend`) | `ebook-catalog.md` | `class-diagram.md` | `DELETE /admin/ebooks/:id` (*soft delete*) | `Ebook.isActive` | *(Gap tes arsip)* | `[RENCANA]` |
| **BR-S01** | `FR-C06`, `FR-S01`–`S04`, `FR-S06` | Pelanggan, Sistem | `ebook-catalog.md` | `UC-C06`, `UC-S01`, AD #3, SD #5 | `GET /ebooks/recommendations` | `Ebook` | `TC-SAW-01` | `[RENCANA]` |
| **BR-S02** | `FR-A10`, `FR-S02`, `FR-S05` | Admin, Sistem | `ebook-catalog.md` | `UC-A10`, `UC-S02`, AD #10 | *(Belum ada di `05-api/` — Gap)* | `SawCriterionConfig`, `SawCalculationSnapshot` `[RENCANA]` | *(Gap tes bobot SAW)* | `[RENCANA]` |
| **BR-K01** | `FR-C11`, `NFR-02` | Pelanggan, Sistem | `ebook-access.md` | `UC-C11`, AD #8, SD #4 | `GET /ebooks/:id/access` | `EbookAccess`, `Ebook` | `TC-ACC-01`, `TC-ACC-02` | `[RENCANA]` |
| **BR-K02** | `FR-A11` | Admin | `ebook-access.md` | `UC-A11` | *(Belum ada di `05-api/` — Gap)* | `EbookAccess.isRevoked` | *(Gap tes pencabutan)* | `[RENCANA]` |
| **BR-T01** | `FR-C08`, `NFR-06` | Pelanggan, Gateway, Sistem | `payment-management.md` | `UC-C08`, AD #5–#7, SD #2–#3 | `POST /payments`, `POST /payments/:id/verify` / webhook | `Payment`, `Order`, `Transaction`, `EbookAccess` | `TC-PAY-01`, `TC-PAY-02` | `[RENCANA]` |
| **BR-R01** | `FR-A06`–`FR-A09` | Admin | `order-management.md`, `payment-management.md`, `admin-dashboard.md` | `UC-A06..A09` | `GET /admin/orders`, `/admin/transactions`, `/admin/reports/sales` | `Order`, `Payment`, `Transaction` | *(Gap tes laporan)* | `[RENCANA]` |

---

## 2. Temuan Konsistensi & Gap dari Pelacakan
1. **Tidak ada kebutuhan yatim pada alur inti:** Seluruh kebutuhan inti transaksi, akses PDF, dan `SPK SAW` telah tertelusur dari `BR-*` ke `FR-*`, desain, dan skema `Prisma`.
2. **Gap dokumentasi API & skema yang menunggu keputusan:** `BR-C05` (ulasan/rating -> Keputusan #6/#7), `BR-S02` (bobot & snapshot SAW -> Keputusan #5/#9/#11), `BR-K02` (endpoint pencabutan akses), dan `BR-A05` (entitas penulis terpisah) belum memiliki spesifikasi endpoint di `docs/05-api/api-endpoints.md`.
3. **Konflik penamaan/mekanisme lintas folder lama:** `docs/05-api/api-endpoints.md` masih mencantumkan endpoint register/login kredensial lokal (sebelum Keputusan #2 Supabase Auth) dan variasi penamaan `/access` vs `/access-url` serta `/ebooks/recommendations` vs `/recommendations/saw`.
