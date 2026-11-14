# Matriks Keterlacakan Modul (`Module Traceability`)

**Status:** `[ADA]` (pemetaan dokumentasi lintas artefak) | `[RENCANA]` (implementasi modul bisnis)  
**Referensi Utama:** [`requirements.md`](../00-project/requirements.md), [`api-spec.yaml`](../02-api/api-spec.yaml), [`process-traceability.md`](../03-business-process/process-traceability.md), [`test-cases.md`](../09-testing/test-cases.md), [`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma).

---

## 1. Keterlacakan Kebutuhan Fungsional Pelanggan (`FR-C01` – `FR-C12`)

| Requirement ID | Modul | Endpoint API | Proses Bisnis (`BP-*`) | Test Case | Entitas Prisma | Status |
|---|---|---|---|---|---|---|
| **FR-C01** | Authentication (`authentication.md`) | `POST /api/v1/auth/sync` | `BP-C01` | `TC-AUTH-01`, `TC-AUTH-02` | `User` | `[RENCANA]` |
| **FR-C02** | Authentication (`authentication.md`) | `GET/PATCH /api/v1/users/me` | `BP-C01` | Auth & Profile Tests | `User` | `[RENCANA]` |
| **FR-C03** | E-Book Catalog (`ebook-catalog.md`) | `GET /api/v1/categories`, `GET /api/v1/ebooks` | `BP-C02`, `BP-C04` | `TC-CAT-01` | `Category`, `Ebook` | `[RENCANA]` |
| **FR-C04** | E-Book Catalog (`ebook-catalog.md`) | `GET /api/v1/ebooks?search=` | `BP-C03` | `TC-CAT-01` | `Ebook` | `[RENCANA]` |
| **FR-C05** | E-Book Catalog (`ebook-catalog.md`) | `GET /api/v1/ebooks/:id` | `BP-C05` | `TC-CAT-01` | `Ebook`, `Category` | `[RENCANA]` |
| **FR-C06** | E-Book Catalog / SAW (`ebook-catalog.md`) | `GET /api/v1/recommendations/saw` | `BP-C06` | `TC-SAW-01` s.d. `TC-SAW-16` | `Ebook`, `Category` | `[RENCANA]` |
| **FR-C07** | Order Management (`order-management.md`) | `POST /api/v1/orders` | `BP-C07` | `TC-ORD-01` | `Order`, `OrderItem`, `Ebook` | `[RENCANA]` |
| **FR-C08** | Payment Management (`payment-management.md`) | `POST /api/v1/payments`, `POST /api/v1/payments/webhook` | `BP-C08` | `TC-PAY-01`, `TC-PAY-02` | `Payment`, `Order`, `Transaction` | `[RENCANA]` |
| **FR-C09** | Order & Payment (`order-management.md`, `payment-management.md`) | `GET /api/v1/orders/me`, `GET /api/v1/orders/:id`, `GET /api/v1/payments/:id` | `BP-C09`, `BP-C10` | Order & Payment Tests | `Order`, `Payment` | `[RENCANA]` |
| **FR-C10** | Payment & E-Book Access (`payment-management.md`, `ebook-access.md`) | `GET /api/v1/transactions/my`, `GET /api/v1/orders/me` | `BP-C10` | Purchase History Tests | `Transaction`, `Order` | `[RENCANA]` |
| **FR-C11** | E-Book Access (`ebook-access.md`) | `GET /api/v1/ebooks/:id/access-url` | `BP-C11`, `BP-C12` | `TC-ACC-01`, `TC-ACC-02` | `EbookAccess`, `Ebook` | `[RENCANA]` (helper `[ADA]`) |
| **FR-C12** | E-Book Catalog (`ebook-catalog.md`) | *Menunggu Keputusan #6 & #7* | — | — | `Review` (`[RENCANA]`) | `[RENCANA]` |

---

## 2. Keterlacakan Kebutuhan Fungsional Admin (`FR-A01` – `FR-A11`)

| Requirement ID | Modul | Endpoint API | Proses Bisnis (`BP-*`) | Test Case | Entitas Prisma | Status |
|---|---|---|---|---|---|---|
| **FR-A01** | Authentication & Admin (`authentication.md`, `admin-dashboard.md`) | `GET /api/v1/admin/ping` (`[ADA]`), `POST /api/v1/auth/sync` | `BP-A01` | `TC-AUTH-03` | `User` | `[ADA]` (ping) / `[RENCANA]` |
| **FR-A02** | Admin Dashboard (`admin-dashboard.md`) | `GET /api/v1/admin/dashboard` | `BP-A13` | Admin Dashboard Tests | `Order`, `Transaction`, `Ebook`, `User` | `[RENCANA]` |
| **FR-A03** | E-Book Catalog (`ebook-catalog.md`) | `POST/PATCH/DELETE /api/v1/admin/categories*` | `BP-A03` | Admin Category Tests | `Category` | `[RENCANA]` |
| **FR-A04** | E-Book Catalog (`ebook-catalog.md`) | `POST/PATCH/DELETE /api/v1/admin/ebooks*` | `BP-A04`–`BP-A08` | Admin Ebook & Upload Tests | `Ebook` | `[RENCANA]` |
| **FR-A05** | Authentication (`authentication.md`) | `GET /api/v1/admin/customers*` | `BP-A09` | Admin Customer Tests | `User` | `[RENCANA]` |
| **FR-A06** | Order Management (`order-management.md`) | `GET /api/v1/admin/orders*` | `BP-A10` | Admin Order Tests | `Order`, `OrderItem` | `[RENCANA]` |
| **FR-A07** | Payment Management (`payment-management.md`) | `GET /api/v1/admin/payments` | `BP-A11` | Admin Payment Tests | `Payment` | `[RENCANA]` |
| **FR-A08** | Payment Management (`payment-management.md`) | `GET /api/v1/admin/transactions` | `BP-A12` | Admin Transaction Tests | `Transaction` | `[RENCANA]` |
| **FR-A09** | Admin Dashboard (`admin-dashboard.md`) | `GET /api/v1/admin/reports/sales` | `BP-A13` | Sales Report Tests | `Transaction`, `Order`, `OrderItem` | `[RENCANA]` |
| **FR-A10** | E-Book Catalog / SAW (`ebook-catalog.md`) | `GET/PUT /api/v1/admin/saw/weights` | `BP-A14` | SAW Weight Validation Tests | Config SAW (`[RENCANA]`) | `[RENCANA]` |
| **FR-A11** | E-Book Access (`ebook-access.md`) | `PATCH /api/v1/admin/accesses/:id` | `BP-A16` | Access Revoke Tests | `EbookAccess` | `[RENCANA]` |

---

## 3. Keterlacakan Kebutuhan SAW (`FR-S01` – `FR-S06`) & Non-Fungsional (`NFR-01` – `NFR-08`)

| Requirement ID | Modul | Endpoint API | Proses Bisnis (`BP-*`) | Test Case | Entitas Prisma | Status |
|---|---|---|---|---|---|---|
| **FR-S01** | E-Book Catalog / SAW (`ebook-catalog.md`) | `GET /api/v1/recommendations/saw` | `BP-C06` | `TC-SAW-01` | `Ebook` | `[RENCANA]` |
| **FR-S02** | E-Book Catalog / SAW (`ebook-catalog.md`) | `PUT /api/v1/admin/saw/weights` | `BP-A14` | `TC-SAW-02`..`04` | Config SAW (`[RENCANA]`) | `[RENCANA]` |
| **FR-S03** | E-Book Catalog / SAW (`ebook-catalog.md`) | `GET /api/v1/recommendations/saw` | `BP-C06` | `TC-SAW-05`..`09` | `Ebook` | `[RENCANA]` |
| **FR-S04** | E-Book Catalog / SAW (`ebook-catalog.md`) | `GET /api/v1/recommendations/saw` | `BP-C06` | `TC-SAW-10`..`13` | `Ebook` | `[RENCANA]` |
| **FR-S05** | E-Book Catalog / SAW (`ebook-catalog.md`) | *Snapshot SAW (Keputusan #11)* | `BP-C06` | `TC-SAW-14`..`15` | Snapshot SAW (`[RENCANA]`) | `[RENCANA]` |
| **FR-S06** | E-Book Catalog / SAW (`ebook-catalog.md`) | `GET /api/v1/recommendations/saw` | `BP-C06` | `TC-SAW-16` (Manual Match) | `Ebook` | `[RENCANA]` |
| **NFR-01** | Authentication & Admin | Seluruh endpoint terproteksi | `BP-C01`, `BP-A01` | `TC-AUTH-03` | `User` | `[ADA]` kerangka / `[RENCANA]` |
| **NFR-02** | E-Book Access & Catalog | `GET /api/v1/ebooks/:id/access-url` | `BP-C11`, `BP-C12` | `TC-ACC-01`, `TC-ACC-02` | `EbookAccess`, `Ebook` | `[ADA]` helper / `[RENCANA]` |
| **NFR-03** | Seluruh Modul | — | — | Security Audit | — | `[ADA]` aturan & `.gitignore` |
| **NFR-04** | Seluruh Modul | Seluruh endpoint | — | Validation & Rate Limit Tests | — | `[ADA]` middleware / `[RENCANA]` mount |
| **NFR-05** | E-Book Catalog & Order | `GET /ebooks`, `GET /recommendations/saw` | `BP-C02`..`BP-C06` | Performance Tests | `Ebook`, `Order` | `[RENCANA]` |
| **NFR-06** | Payment Management | `POST /api/v1/payments/webhook` | `BP-C08` | `TC-PAY-01`, `TC-PAY-02` | `Payment`, `Order`, `Transaction`, `EbookAccess` | `[RENCANA]` |
| **NFR-07** | Order, Payment, Catalog/SAW | `/orders`, `/payments`, `/recommendations/saw` | `BP-C06`..`BP-C08` | Decimal & SAW Precision Tests | `Ebook`, `Order`, `Payment`, `Transaction` | `[ADA]` schema / `[RENCANA]` |
| **NFR-08** | Seluruh Modul Backend | Seluruh endpoint | — | `tsc --noEmit`, `vitest run` | Seluruh schema | `[ADA]` config / `[RENCANA]` bisnis |
