# Matriks Keterlacakan Arsitektur (`Architecture Traceability`)

**Status:** `[ADA]` (hanya pada komponen fondasi `/health`, `/admin/ping`, `schema.prisma`, dan middleware dasar) | `[RENCANA]` (seluruh fitur bisnis dan integrasi runtime)

Matriks ini memetakan ID kebutuhan dari [`docs/00-project/requirements.md`](../00-project/requirements.md) ke komponen arsitektur, modul, entitas data, kontrak API, diagram, dan pengujian.

---

## Matriks Keterlacakan Arsitektur

| Requirement ID | Komponen Arsitektur | Modul (`06-modules/`) | Entitas Data (`schema.prisma`) | Endpoint atau Kontrak (`02-api/`) | Diagram Terkait | Test Terkait (`09-testing/`) | Status |
|---|---|---|---|---|---|---|---|
| **FR-C01, FR-C02, FR-A01** (Login & Role) | `mobile`, `pengunjung-web`, `admin-web`, `backend`, `Supabase Auth` | `authentication.md` | `User`, `UserRole` | `POST /auth/sync`, `GET/PATCH /users/me`, `GET /admin/ping` (`[ADA]`) | `system-architecture`, `security-architecture` | `TC-AUTH-01`–`03` | `[ADA]` ping & middleware / `[RENCANA]` bisnis |
| **FR-C03, FR-C04, FR-C05** (Katalog & Kategori) | `mobile`, `pengunjung-web`, `backend`, `PostgreSQL` | `ebook-catalog.md` | `Category`, `Ebook` | `GET /categories`, `GET /ebooks`, `GET /ebooks/{id}` | `system-architecture`, `data-architecture` | `TC-CAT-01` | `[RENCANA]` |
| **FR-C06, FR-S01..S06** (Rekomendasi SAW) | `mobile`, `pengunjung-web`, `backend (SAW Service)`, `PostgreSQL` | `ebook-catalog.md` | `Ebook`, `SawCriterionConfig` `[RENCANA]`, `SawCalculationSnapshot` `[RENCANA]` | `GET /recommendations/saw` | `application-architecture`, `integration-architecture` | `TC-SAW-01` + Manual Match | `[RENCANA]` |
| **FR-C07** (Checkout) | `mobile`, `pengunjung-web`, `backend`, `PostgreSQL` | `order-management.md` | `Order`, `OrderItem`, `Ebook`, `EbookAccess` | `POST /orders` | `integration-architecture` | `TC-ORD-01` | `[RENCANA]` |
| **FR-C08, FR-C09, FR-C10** (Pembayaran & Webhook) | `mobile`, `pengunjung-web`, `backend`, `Payment Gateway`, `PostgreSQL` | `payment-management.md`, `ebook-access.md` | `Payment`, `Order`, `Transaction`, `EbookAccess` | `POST /payments`, `POST /payments/webhook`, [`webhook-contract.md`](../02-api/webhook-contract.md) | `integration-architecture` | `TC-PAY-01`, `TC-PAY-02` | `[RENCANA]` |
| **FR-C11** (Akses PDF Privat) | `mobile`, `pengunjung-web`, `backend`, `Supabase Storage Privat` | `ebook-access.md` | `EbookAccess`, `Ebook` | `GET /ebooks/{id}/access-url` | `security-architecture`, `integration-architecture` | `TC-ACC-01`, `TC-ACC-02` | `[ADA]` helper storage / `[RENCANA]` endpoint |
| **FR-C12** (Ulasan & Rating) | `mobile`, `pengunjung-web`, `backend` | *(Gap — Keputusan #6, #7)* | `Review` `[RENCANA]` | *(Belum ada — Gap)* | `class-diagram.md` (`[RENCANA]`) | *(Gap)* | `[RENCANA]` |
| **FR-A03, FR-A04** (Admin Katalog & Kategori) | `admin-web`, `backend`, `PostgreSQL`, `Supabase Storage Privat` | `ebook-catalog.md` | `Category`, `Ebook` | `/admin/categories*`, `/admin/ebooks*` | `application-architecture` | *(Gap di `test-cases.md`)* | `[RENCANA]` |
| **FR-A02, FR-A05..A09** (Laporan & Pantau Admin) | `admin-web`, `backend`, `PostgreSQL` | `admin-dashboard.md`, `order-management.md`, `payment-management.md` | `User`, `Order`, `Payment`, `Transaction` | `/admin/dashboard`, `/admin/customers*`, `/admin/orders*`, `/admin/payments`, `/admin/transactions`, `/admin/reports/sales` | `application-architecture` | *(Gap di `test-cases.md`)* | `[RENCANA]` |
| **FR-A10, FR-A11** (Konfigurasi SAW & Cabut Akses) | `admin-web`, `backend`, `PostgreSQL` | `ebook-catalog.md`, `ebook-access.md` | `SawCriterionConfig` `[RENCANA]`, `EbookAccess` | `/admin/saw/weights`, `/admin/accesses/{id}` | `application-architecture` | *(Gap di `test-cases.md`)* | `[RENCANA]` |
| **NFR-01..NFR-08** (Audit Keamanan & Kualitas) | Seluruh lapisan (`backend` pusat kontrol) | Semua modul | Semua entitas | `error-catalog.md`, `api-conventions.md` | `security-architecture`, `deployment-architecture` | `test-results.md` (`[ADA]` fondasi) + `security-audit` (`[RENCANA]`) | `[ADA]` fondasi / `[RENCANA]` audit penuh |
