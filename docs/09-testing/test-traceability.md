# Matriks Keterlacakan Pengujian (`Test Traceability`)

**Status:** `[ADA]` (pemetaan kebutuhan ke test case) | `[RENCANA]` (eksekusi test bisnis)  
**Referensi Utama:** [`requirements.md`](../00-project/requirements.md), [`test-cases.md`](./test-cases.md), [`test-saw.md`](./test-saw.md), [`test-security.md`](./test-security.md), [`test-integration.md`](./test-integration.md).

---

## Matriks Keterlacakan `FR-*` & `NFR-*` ke Test Case

| Requirement ID | Proses Bisnis | Modul | Test Case ID | Tipe Test | Endpoint / API | Dokumen Referensi | Status |
|---|---|---|---|---|---|---|---|
| **FR-C01** | `BP-C01` | Authentication | `TC-AUTH-01..04` | Integration | `POST /api/v1/auth/sync` | `test-cases.md` | `[RENCANA]` |
| **FR-C02** | `BP-C01` | Authentication | `TC-AUTH-10` | Integration | `GET/PATCH /api/v1/users/me` | `test-cases.md` | `[RENCANA]` |
| **FR-C03** | `BP-C02`, `BP-C04` | E-Book Catalog | `TC-CAT-01`, `04`–`06` | Integration | `GET /categories`, `GET /ebooks` | `test-cases.md` | `[RENCANA]` |
| **FR-C04** | `BP-C03` | E-Book Catalog | `TC-CAT-03` | Integration | `GET /api/v1/ebooks?search=` | `test-cases.md` | `[RENCANA]` |
| **FR-C05** | `BP-C05` | E-Book Catalog | `TC-CAT-02` | Integration | `GET /api/v1/ebooks/:id` | `test-cases.md` | `[RENCANA]` |
| **FR-C06** | `BP-C06` | Catalog / SAW | `TC-SAW-01..16` | Unit / Int | `GET /api/v1/recommendations/saw` | `test-saw.md` | `[RENCANA]` |
| **FR-C07** | `BP-C07` | Order | `TC-ORD-01..06` | Integration | `POST /api/v1/orders` | `test-cases.md` | `[RENCANA]` |
| **FR-C08** | `BP-C08` | Payment | `TC-PAY-01..06` | Integration | `POST /payments`, `/payments/webhook` | `test-cases.md` | `[RENCANA]` |
| **FR-C09** | `BP-C09`, `BP-C10` | Order & Payment | `TC-ORD-07..09`, `TC-PAY-07..11` | Integration | `GET /orders/:id`, `GET /payments/:id` | `test-cases.md` | `[RENCANA]` |
| **FR-C10** | `BP-C10` | Order & Access | `TC-ORD-07` | Integration | `GET /orders/me`, `/transactions/my` | `test-cases.md` | `[RENCANA]` |
| **FR-C11** | `BP-C11`, `BP-C12` | E-Book Access | `TC-ACC-01..07` | Integration | `GET /ebooks/:id/access-url` | `test-cases.md` | `[RENCANA]` |
| **FR-C12** | — | Catalog | *Keputusan #6 & #7* | — | — | `test-gap-register.md` | `[RENCANA]` |
| **FR-A01** | `BP-A01` | Auth & Admin | `TC-AUTH-05..06`, `TC-ADM-11`, `TC-FOUND-02` | Integration | `GET /admin/ping` (`[ADA]`), `/admin/*` | `test-cases.md` | `[ADA]` (ping) / `[RENCANA]` |
| **FR-A02** | `BP-A13` | Admin Dashboard | `TC-ADM-01` | Integration | `GET /api/v1/admin/dashboard` | `test-cases.md` | `[RENCANA]` |
| **FR-A03** | `BP-A03` | Catalog | `TC-CAT-07..09`, `TC-ADM-02` | Integration | `/api/v1/admin/categories*` | `test-cases.md` | `[RENCANA]` |
| **FR-A04** | `BP-A04`–`A08` | Catalog | `TC-ADM-03` | Integration | `/api/v1/admin/ebooks*` | `test-cases.md` | `[RENCANA]` |
| **FR-A05** | `BP-A09` | Authentication | `TC-ADM-04` | Integration | `GET /api/v1/admin/customers*` | `test-cases.md` | `[RENCANA]` |
| **FR-A06** | `BP-A10` | Order | `TC-ADM-05` | Integration | `GET /api/v1/admin/orders*` | `test-cases.md` | `[RENCANA]` |
| **FR-A07** | `BP-A11` | Payment | `TC-ADM-06` | Integration | `GET /api/v1/admin/payments` | `test-cases.md` | `[RENCANA]` |
| **FR-A08** | `BP-A12` | Payment | `TC-ADM-07` | Integration | `GET /api/v1/admin/transactions` | `test-cases.md` | `[RENCANA]` |
| **FR-A09** | `BP-A13` | Admin Dashboard | `TC-ADM-08` | Integration | `GET /api/v1/admin/reports/sales` | `test-cases.md` | `[RENCANA]` |
| **FR-A10** | `BP-A14` | Catalog / SAW | `TC-ADM-09..10`, `TC-SAW-16` | Integration | `GET/PUT /api/v1/admin/saw/weights` | `test-cases.md`, `test-saw.md` | `[RENCANA]` |
| **FR-A11** | `BP-A16` | E-Book Access | `TC-ACC-06..07` | Integration | `PATCH /api/v1/admin/accesses/:id` | `test-cases.md` | `[RENCANA]` |
| **FR-S01** | `BP-C06` | SAW | `TC-SAW-01`, `TC-SAW-14` | Unit / Int | `GET /api/v1/recommendations/saw` | `test-saw.md` | `[RENCANA]` |
| **FR-S02** | `BP-A14` | SAW | `TC-SAW-02..04` | Unit / Int | `PUT /api/v1/admin/saw/weights` | `test-saw.md` | `[RENCANA]` |
| **FR-S03** | `BP-C06` | SAW | `TC-SAW-05..08` | Unit | `SawService` | `test-saw.md` | `[RENCANA]` |
| **FR-S04** | `BP-C06` | SAW | `TC-SAW-09`, `TC-SAW-15` | Unit | `SawService` | `test-saw.md` | `[RENCANA]` |
| **FR-S05** | `BP-C06` | SAW | *Keputusan #11* | — | — | `test-gap-register.md` | `[RENCANA]` |
| **FR-S06** | `BP-C06` | SAW | `TC-SAW-01` | Unit | `SawService` | `test-saw.md` | `[RENCANA]` |
| **NFR-01** | `BP-C01`, `BP-A01` | Security / Auth | `TC-SEC-01..06` (`01` `[ADA]`) | Integration | Seluruh terproteksi | `test-security.md` | `[ADA]` (01) / `[RENCANA]` |
| **NFR-02** | `BP-C11`, `BP-C12` | Security / Access | `TC-SEC-10..14` | Integration | `GET /ebooks/:id/access-url` | `test-security.md` | `[RENCANA]` |
| **NFR-03** | — | Security | `TC-SEC-19..22` | Audit | — | `test-security.md` | `[RENCANA]` |
| **NFR-04** | — | Security / API | `TC-SEC-23..26` (`24` `[ADA]`) | Unit / Int | Seluruh endpoint | `test-security.md` | `[ADA]` (24) / `[RENCANA]` |
| **NFR-05** | `BP-C02`..`C06` | Performance | Pagination & index tests | Integration | `/ebooks`, `/recommendations/saw` | `test-cases.md` | `[RENCANA]` |
| **NFR-06** | `BP-C08` | Payment | `TC-PAY-06..07`, `TC-INT-03..04` | Integration | `POST /payments/webhook` | `test-integration.md` | `[RENCANA]` |
| **NFR-07** | `BP-C06`..`C08` | SAW & Order | `TC-SAW-13`, `TC-ORD-02` | Unit / Int | `/orders`, `/recommendations/saw` | `test-saw.md` | `[RENCANA]` |
| **NFR-08** | — | Quality / Code | `TC-FOUND-01..05`, `TC-WEB-01..04`, `TC-MOB-01..02` | Static / Unit | — | `test-results.md` | `[ADA]` |
