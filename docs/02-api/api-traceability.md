# API Traceability Matrix (`api-traceability.md`)

**Status:** `[ADA]` (hanya `GET /api/v1/health` dan `GET /api/v1/admin/ping`) | `[RENCANA]` (seluruh endpoint bisnis pada `api-spec.yaml`)

Matriks ini memetakan setiap ID kebutuhan dari [`docs/00-project/requirements.md`](../00-project/requirements.md) ke Use Case ([`use-cases.md`](../01-design/use-cases.md)), Endpoint pada [`api-spec.yaml`](./api-spec.yaml), Entitas pada [`schema.prisma`](../../backend/prisma/schema.prisma), serta Kasus Uji pada [`test-cases.md`](../09-testing/test-cases.md).

---

## 1. Matriks Keterlacakan Kebutuhan ke API

| Requirement ID | Use Case | Endpoint | HTTP Method | Role | Request Schema | Response Schema | Entity | Test Case | Status |
|---|---|---|---|---|---|---|---|---|---|
| **FR-C01** | `UC-C01` | `/api/v1/auth/sync` | `POST` | `CUSTOMER \| ADMIN` | `{ fullName?, phone? }` | `UserSuccessResponse` | `User` | `TC-AUTH-01`, `TC-AUTH-02` | `[RENCANA]` |
| **FR-C02** | `UC-C02` | `/api/v1/users/me` | `GET`, `PATCH` | `CUSTOMER \| ADMIN` | `{ fullName?, phone? }` | `UserSuccessResponse` | `User` | Auth & Profile Tests | `[RENCANA]` |
| **FR-C03** | `UC-C03` | `/api/v1/categories`, `/api/v1/ebooks` | `GET` | Publik | `PageParam`, `LimitParam`, `categoryId` | `PaginatedEbooksResponse` | `Category`, `Ebook` | `TC-CAT-01` | `[RENCANA]` |
| **FR-C04** | `UC-C04` | `/api/v1/ebooks` | `GET` | Publik | `SearchParam`, `PageParam`, `LimitParam` | `PaginatedEbooksResponse` | `Ebook` | `TC-CAT-01` | `[RENCANA]` |
| **FR-C05** | `UC-C05` | `/api/v1/ebooks/{id}` | `GET` | Publik | `UuidIdParam` | `SuccessResponse` | `Ebook`, `Category` | `TC-CAT-01` | `[RENCANA]` |
| **FR-C06** | `UC-C06` | `/api/v1/recommendations/saw` | `GET` | Publik / `CUSTOMER` | `categoryId?`, `LimitParam` | `SuccessResponse` (`sawScore`, `rank`) | `Ebook` | `TC-SAW-01` | `[RENCANA]` |
| **FR-C07** | `UC-C07` | `/api/v1/orders` | `POST` | `CUSTOMER` | `{ ebookIds[] }` | `SuccessResponse` | `Order`, `OrderItem`, `Ebook`, `EbookAccess` | `TC-ORD-01` | `[RENCANA]` |
| **FR-C08** | `UC-C08`, `UC-SYS02` | `/api/v1/payments`, `/api/v1/payments/webhook` | `POST` | `CUSTOMER` / Gateway | `{ orderId, paymentMethod }` / Webhook payload | `SuccessResponse` | `Payment`, `Order`, `Transaction`, `EbookAccess` | `TC-PAY-01`, `TC-PAY-02` | `[RENCANA]` |
| **FR-C09** | `UC-C09` | `/api/v1/orders/me`, `/api/v1/orders/{id}`, `/api/v1/payments/{id}` | `GET` | `CUSTOMER` | `UuidIdParam` / `OrderStatusParam` | `SuccessResponse` | `Order`, `Payment` | Order & Payment Status Tests | `[RENCANA]` |
| **FR-C10** | `UC-C09`, `UC-SYS03` | `/api/v1/orders/me`, `/api/v1/orders/{id}` | `GET` | `CUSTOMER` | `PageParam`, `LimitParam` | `SuccessResponse` | `Transaction`, `Order`, `OrderItem` | `TC-PAY-01` | `[RENCANA]` |
| **FR-C11** | `UC-C10`, `UC-SYS05` | `/api/v1/ebooks/{id}/access-url` | `GET` | `CUSTOMER` | `UuidIdParam` | `{ signedUrl, expiresInSeconds }` | `EbookAccess`, `Ebook` | `TC-ACC-01`, `TC-ACC-02` | `[RENCANA]` |
| **FR-C12** | `UC-C12` | *(Gap — Keputusan #6, #7)* | — | `CUSTOMER` | — | — | `Review` `[RENCANA]` | — | `[RENCANA]` |
| **FR-A01** | `UC-A01`, `UC-SYS01` | `/api/v1/admin/ping` (`[ADA]`), `/api/v1/admin/*` | `GET` | `ADMIN` | Bearer JWT | `SuccessResponse` | `User`, `UserRole` | `TC-AUTH-03` | `[ADA]` ping / `[RENCANA]` bisnis |
| **FR-A02** | `UC-A08` | `/api/v1/admin/dashboard` | `GET` | `ADMIN` | — | `SuccessResponse` | `Order`, `Transaction`, `Ebook`, `User` | Dashboard Tests *(Gap)* | `[RENCANA]` |
| **FR-A03** | `UC-A02` | `/api/v1/admin/categories`, `/api/v1/admin/categories/{id}` | `POST`, `PATCH`, `DELETE` | `ADMIN` | `{ name, slug, description? }` | `SuccessResponse` | `Category` | Category Admin Tests *(Gap)* | `[RENCANA]` |
| **FR-A04** | `UC-A03`, `UC-A04` | `/api/v1/admin/ebooks`, `/api/v1/admin/ebooks/{id}` | `POST`, `PATCH`, `DELETE` | `ADMIN` | `multipart/form-data` / metadata | `SuccessResponse` | `Ebook`, `Category` | Ebook Admin & Storage Tests *(Gap)* | `[RENCANA]` |
| **FR-A05** | `UC-A05` | `/api/v1/admin/customers`, `/api/v1/admin/customers/{id}` | `GET` | `ADMIN` | `PageParam`, `SearchParam`, `UuidIdParam` | `SuccessResponse` | `User`, `Order` | Customer Admin Tests *(Gap)* | `[RENCANA]` |
| **FR-A06** | `UC-A06` | `/api/v1/admin/orders`, `/api/v1/admin/orders/{id}` | `GET` | `ADMIN` | `OrderStatusParam`, `StartDateParam`, `EndDateParam` | `SuccessResponse` | `Order`, `OrderItem` | Admin Orders Tests *(Gap)* | `[RENCANA]` |
| **FR-A07** | `UC-A06` | `/api/v1/admin/payments` | `GET` | `ADMIN` | `PageParam`, `LimitParam` | `SuccessResponse` | `Payment`, `Order` | Admin Payments Tests *(Gap)* | `[RENCANA]` |
| **FR-A08** | `UC-A07` | `/api/v1/admin/transactions` | `GET` | `ADMIN` | `StartDateParam`, `EndDateParam` | `SuccessResponse` | `Transaction` | Admin Transactions Tests *(Gap)* | `[RENCANA]` |
| **FR-A09** | `UC-A08` | `/api/v1/admin/reports/sales` | `GET` | `ADMIN` | `StartDateParam`, `EndDateParam`, `groupBy` | `SuccessResponse` | `Transaction`, `OrderItem` | Sales Report Tests *(Gap)* | `[RENCANA]` |
| **FR-A10** | `UC-A09` | `/api/v1/admin/saw/weights` | `GET`, `PUT` | `ADMIN` | Bobot kriteria (`Σ = 1.0`) | `SuccessResponse` | `SawCriterionConfig` `[RENCANA]` | SAW Weight Tests *(Gap)* | `[RENCANA]` |
| **FR-A11** | `UC-A10` | `/api/v1/admin/accesses/{id}` | `PATCH` | `ADMIN` | `{ isRevoked }` | `SuccessResponse` | `EbookAccess` | Access Revoke Tests *(Gap)* | `[RENCANA]` |
| **FR-S01..S06** | `UC-SYS04` | `/api/v1/recommendations/saw` | `GET` | Publik / `CUSTOMER` | `categoryId?`, `LimitParam` | `SuccessResponse` (`sawScore`, `rank`) | `Ebook`, `SawCalculationSnapshot` `[RENCANA]` | `TC-SAW-01` + Manual Match | `[RENCANA]` |
| **NFR-01..NFR-08** | `UC-SYS01..05` | Seluruh endpoint `/api/v1/*` | Semua | Sesuai endpoint | Validasi Zod, Bearer JWT, Signature | `SuccessResponse` / `ErrorResponse` | Semua entitas | Unit & Integration Tests | `[ADA]` kerangka / `[RENCANA]` bisnis |

---

## 2. Catatan Konsistensi & Gap
1. Hanya `GET /api/v1/health` dan `GET /api/v1/admin/ping` yang berstatus `[ADA]` di `backend/src/app.ts`; seluruh endpoint bisnis lain berstatus `[RENCANA]`.
2. Endpoint `FR-C12` (ulasan/rating) belum dimasukkan ke `api-spec.yaml` karena menunggu Keputusan #6 dan #7 pada [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md).
3. Sebagian endpoint admin baru (`FR-A02`–`FR-A11`) belum memiliki skenario uji bernomor di [`test-cases.md`](../09-testing/test-cases.md) dan ditandai sebagai *Gap*.
