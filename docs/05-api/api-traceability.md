# Matriks Keterlacakan API (`API Traceability`)

> **Status Dokumen:** `[ADA]` (Dokumentasi pemetaan keterlacakan)
> **Referensi:** [`requirements.md`](../00-project/requirements.md), [`api-spec.yaml`](../02-api/api-spec.yaml), [`test-cases.md`](../04-testing/test-cases.md)

---

## 1. Matriks Keterlacakan Kebutuhan ke Endpoint API

| Requirement ID | Modul | Endpoint | HTTP Method | Role | Test Case | Dokumen Referensi | Status |
| :--- | :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| **FR-C01** | Auth | `/api/v1/auth/sync` | `POST` | `CUSTOMER` / `ADMIN` | `TC-AUTH-01`–`04` | [`api-authentication.md`](./api-authentication.md) | `[RENCANA]` |
| **FR-C02** | Profile | `/api/v1/users/me` | `GET`, `PATCH` | `CUSTOMER` / `ADMIN` | `TC-AUTH-10` | [`api-endpoints.md`](./api-endpoints.md) | `[RENCANA]` |
| **FR-C03** | Catalog | `/api/v1/ebooks`, `/api/v1/categories` | `GET` | Publik | `TC-CAT-01`, `TC-CAT-04`–`06` | [`api-endpoints.md`](./api-endpoints.md) | `[RENCANA]` |
| **FR-C04** | Catalog | `/api/v1/ebooks?search=` | `GET` | Publik | `TC-CAT-03` | [`api-endpoints.md`](./api-endpoints.md) | `[RENCANA]` |
| **FR-C05** | Catalog | `/api/v1/ebooks/:id` | `GET` | Publik | `TC-CAT-02`, `TC-CAT-05` | [`api-endpoints.md`](./api-endpoints.md) | `[RENCANA]` |
| **FR-C06** | SPK SAW | `/api/v1/recommendations/saw` | `GET` | Publik / `CUSTOMER` | `TC-SAW-01`–`16` | [`api-saw-contract.md`](./api-saw-contract.md) | `[RENCANA]` |
| **FR-C07** | Order | `/api/v1/orders` | `POST` | `CUSTOMER` | `TC-ORD-01`–`06` | [`api-endpoints.md`](./api-endpoints.md) | `[RENCANA]` |
| **FR-C08** | Payment | `/api/v1/payments`, `/api/v1/payments/:id`, `/api/v1/payments/webhook` | `POST`, `GET` | `CUSTOMER` / `PAYMENT_GATEWAY` | `TC-PAY-01`–`11` | [`api-webhook-contract.md`](./api-webhook-contract.md) | `[RENCANA]` |
| **FR-C09** | Order/Payment | `/api/v1/orders/me`, `/api/v1/orders/:id`, `/api/v1/payments/:id` | `GET` | `CUSTOMER` | `TC-ORD-07`–`09`, `TC-PAY-08`–`10` | [`api-endpoints.md`](./api-endpoints.md) | `[RENCANA]` |
| **FR-C10** | Transaction | `/api/v1/transactions/my` | `GET` | `CUSTOMER` | `TC-ORD-07`, `TC-ORD-08` | [`api-gap-register.md`](./api-gap-register.md) | `[RENCANA]` |
| **FR-C11** | Ebook Access | `/api/v1/ebooks/:id/access-url` | `GET` | `CUSTOMER` | `TC-ACC-01`–`05` | [`api-endpoints.md`](./api-endpoints.md) | `[RENCANA]` |
| **FR-C12** | Review *(Terbuka)* | — *(belum ada di `api-spec.yaml`)* | — | — | — | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) (#6, #7) | `[RENCANA]` |
| **FR-A01** | Admin Auth | `/api/v1/auth/sync`, `/api/v1/admin/ping` | `POST`, `GET` | `ADMIN` | `TC-FOUND-02`, `TC-AUTH-05`, `06` | [`api-authentication.md`](./api-authentication.md) | `[ADA]` (`/admin/ping`) / `[RENCANA]` |
| **FR-A02** | Admin Dashboard | `/api/v1/admin/dashboard` | `GET` | `ADMIN` | `TC-ADM-01` | [`api-endpoints.md`](./api-endpoints.md) | `[RENCANA]` |
| **FR-A03** | Admin Category | `/api/v1/admin/categories`, `/api/v1/admin/categories/:id` | `POST`, `PATCH`, `DELETE` | `ADMIN` | `TC-CAT-07`–`09`, `TC-ADM-02` | [`api-endpoints.md`](./api-endpoints.md) | `[RENCANA]` |
| **FR-A04** | Admin Ebook | `/api/v1/admin/ebooks`, `/api/v1/admin/ebooks/:id` | `POST`, `PATCH`, `DELETE` | `ADMIN` | `TC-ADM-03` | [`api-endpoints.md`](./api-endpoints.md) | `[RENCANA]` |
| **FR-A05** | Admin User | `/api/v1/admin/customers`, `/api/v1/admin/customers/:id` | `GET` | `ADMIN` | `TC-ADM-04` | [`api-endpoints.md`](./api-endpoints.md) | `[RENCANA]` |
| **FR-A06** | Admin Order | `/api/v1/admin/orders`, `/api/v1/admin/orders/:id` | `GET` | `ADMIN` | `TC-ADM-05` | [`api-endpoints.md`](./api-endpoints.md) | `[RENCANA]` |
| **FR-A07** | Admin Payment | `/api/v1/admin/payments` | `GET` | `ADMIN` | `TC-ADM-06` | [`api-endpoints.md`](./api-endpoints.md) | `[RENCANA]` |
| **FR-A08** | Admin Transaction | `/api/v1/admin/transactions` | `GET` | `ADMIN` | `TC-ADM-06` | [`api-endpoints.md`](./api-endpoints.md) | `[RENCANA]` |
| **FR-A09** | Admin Report | `/api/v1/admin/reports/sales` | `GET` | `ADMIN` | `TC-ADM-07` | [`api-endpoints.md`](./api-endpoints.md) | `[RENCANA]` |
| **FR-A10** | Admin SAW | `/api/v1/admin/saw/weights` | `GET`, `PUT` | `ADMIN` | `TC-ADM-08`, `09`, `TC-SAW-16` | [`api-saw-contract.md`](./api-saw-contract.md) | `[RENCANA]` |
| **FR-A11** | Admin Access | `/api/v1/admin/accesses/:id` | `PATCH` | `ADMIN` | `TC-ACC-06`, `07` | [`api-endpoints.md`](./api-endpoints.md) | `[RENCANA]` |
| **NFR-01** | Security | Seluruh endpoint terproteksi | Semua | `CUSTOMER` / `ADMIN` | `SEC-01`–`05` | [`api-authentication.md`](./api-authentication.md) | `[ADA]` (kerangka) / `[RENCANA]` |
| **NFR-02** | Storage PDF | `/api/v1/ebooks/:id/access-url` | `GET` | `CUSTOMER` | `SEC-06`, `SEC-07` | [`api-endpoints.md`](./api-endpoints.md) | `[RENCANA]` |
| **NFR-03** | Security | Konvensi API (tanpa secret/field privat di response) | Semua | Publik / Auth | `SEC-11` | [`api-conventions.md`](./api-conventions.md) | `[ADA]` (aturan) |
| **NFR-04** | Validation & Limit | Seluruh endpoint (`validate.ts` Zod + rate limit) | Semua | Semua | `TC-FOUND-03`, `04`, `SEC-12` | [`api-error-catalog.md`](./api-error-catalog.md) | `[ADA]` (`validate`) / `[RENCANA]` (`429`) |
| **NFR-06** | Atomicity | `/api/v1/payments/webhook` | `POST` | `PAYMENT_GATEWAY` | `TC-PAY-06`, `07`, `11` | [`api-webhook-contract.md`](./api-webhook-contract.md) | `[RENCANA]` |
| **NFR-07** | Precision | `/api/v1/recommendations/saw`, `/api/v1/orders` | `GET`, `POST` | Publik / `CUSTOMER` | `TC-ORD-01`, `02`, `TC-SAW-01` | [`api-conventions.md`](./api-conventions.md) | `[RENCANA]` |
| **NFR-08** | Quality | Seluruh endpoint (`typecheck`, ESM `.js`, `/health`) | Semua | Semua | `TC-FOUND-01`, `05` | [`api-overview.md`](./api-overview.md) | `[ADA]` (fondasi) / `[RENCANA]` (bisnis) |
