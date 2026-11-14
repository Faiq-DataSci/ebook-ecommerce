# Matriks Keterlacakan Pengujian (`Test Traceability`)

> **Status Dokumen:** `[ADA]` (Dokumentasi pemetaan keterlacakan)
> **Sumber Kebutuhan:** [`requirements.md`](../00-project/requirements.md) | **API:** [`api-spec.yaml`](../02-api/api-spec.yaml)

---

## 1. Matriks Keterlacakan Kebutuhan ke Kasus Uji

| Requirement ID | Proses Bisnis | Modul | Test Case ID | Tipe Test | Endpoint/API | Dokumen Referensi | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-C01** | `BP-C01` (Registrasi & Login) | Auth | `TC-AUTH-01`–`04` | Integration | `POST /api/v1/auth/register`, `POST /api/v1/auth/login` | [`test-cases.md`](./test-cases.md) | `[RENCANA]` |
| **FR-C02** | `BP-C01` (Manajemen Profil) | Auth/User | `TC-AUTH-10` | Integration | `GET/PATCH /api/v1/auth/me` | [`test-cases.md`](./test-cases.md) | `[RENCANA]` |
| **FR-C03** | `BP-C02`, `BP-C04` (Katalog & Filter) | Catalog | `TC-CAT-01`, `TC-CAT-04`–`06` | Integration | `GET /api/v1/ebooks`, `GET /api/v1/categories` | [`test-cases.md`](./test-cases.md) | `[RENCANA]` |
| **FR-C04** | `BP-C03` (Pencarian E-Book) | Catalog | `TC-CAT-03` | Integration | `GET /api/v1/ebooks?search=...` | [`test-cases.md`](./test-cases.md) | `[RENCANA]` |
| **FR-C05** | `BP-C05` (Detail E-Book) | Catalog | `TC-CAT-02`, `TC-CAT-05` | Integration | `GET /api/v1/ebooks/:id` | [`test-cases.md`](./test-cases.md) | `[RENCANA]` |
| **FR-C06** | `BP-C06` (Rekomendasi SAW) | SPK SAW | `TC-SAW-01`–`16` | Unit & Integration | `GET /api/v1/recommendations/saw` | [`saw-testing.md`](./saw-testing.md) | `[RENCANA]` |
| **FR-C07** | `BP-C07` (Pembuatan Pesanan) | Order | `TC-ORD-01`–`06` | Integration | `POST /api/v1/orders` | [`test-cases.md`](./test-cases.md) | `[RENCANA]` |
| **FR-C08** | `BP-C08` (Pembayaran & Webhook) | Payment | `TC-PAY-01`–`10` | Integration | `POST /api/v1/payments`, `POST /api/v1/webhooks/payment` | [`webhook-contract.md`](../02-api/webhook-contract.md) | `[RENCANA]` |
| **FR-C09** | `BP-C09` (Status Pesanan & Pembayaran) | Order/Payment | `TC-ORD-09`, `TC-PAY-08`–`10` | Integration | `GET /api/v1/payments/:id`, `GET /api/v1/orders/:id` | [`test-cases.md`](./test-cases.md) | `[RENCANA]` |
| **FR-C10** | `BP-C10` (Riwayat Pembelian) | Order | `TC-ORD-07`, `TC-ORD-08` | Integration | `GET /api/v1/orders`, `GET /api/v1/orders/:id` | [`test-cases.md`](./test-cases.md) | `[RENCANA]` |
| **FR-C11** | `BP-C11`, `BP-C12` (Akses & Baca PDF) | Ebook Access | `TC-ACC-01`–`05` | Integration | `GET /api/v1/library`, `POST /api/v1/ebooks/:id/access-url` | [`test-cases.md`](./test-cases.md) | `[RENCANA]` |
| **FR-C12** | Ulasan & Rating *(Terbuka)* | Review | — *(menunggu Keputusan #6, #7)* | — | Belum ada | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` |
| **FR-A01** | `BP-A01`, `BP-A02` (Login & RBAC Admin) | Admin Auth | `TC-FOUND-02`, `TC-AUTH-05`, `06`, `TC-ADM-10` | Integration | `GET /api/v1/admin/ping`, `/admin/*` | [`security-testing.md`](./security-testing.md) | `[ADA]` (`401` ping) / `[RENCANA]` |
| **FR-A02** | Dashboard Admin | Admin | `TC-ADM-01` | Integration | `GET /api/v1/admin/dashboard` | [`test-cases.md`](./test-cases.md) | `[RENCANA]` |
| **FR-A03** | `BP-A03` (Manajemen Kategori) | Admin Category | `TC-CAT-07`–`09`, `TC-ADM-02` | Integration | `/api/v1/admin/categories*` | [`test-cases.md`](./test-cases.md) | `[RENCANA]` |
| **FR-A04** | `BP-A04`–`08` (Katalog & Upload PDF) | Admin Ebook | `TC-ADM-03` | Integration | `/api/v1/admin/ebooks*` | [`test-cases.md`](./test-cases.md) | `[RENCANA]` |
| **FR-A05** | `BP-A09` (Manajemen Pelanggan) | Admin User | `TC-ADM-04` | Integration | `GET /api/v1/admin/customers` | [`test-cases.md`](./test-cases.md) | `[RENCANA]` |
| **FR-A06** | `BP-A10` (Pemantauan Pesanan) | Admin Order | `TC-ADM-05` | Integration | `GET /api/v1/admin/orders` | [`test-cases.md`](./test-cases.md) | `[RENCANA]` |
| **FR-A07** | `BP-A11` (Pemantauan Pembayaran) | Admin Payment | `TC-ADM-06` | Integration | `GET /api/v1/admin/payments` | [`test-cases.md`](./test-cases.md) | `[RENCANA]` |
| **FR-A08** | `BP-A12` (Audit Transaksi) | Admin Transaction | `TC-ADM-06` | Integration | `GET /api/v1/admin/transactions` | [`test-cases.md`](./test-cases.md) | `[RENCANA]` |
| **FR-A09** | `BP-A13` (Laporan Penjualan) | Admin Report | `TC-ADM-07` | Integration | `GET /api/v1/admin/reports/sales` | [`test-cases.md`](./test-cases.md) | `[RENCANA]` |
| **FR-A10** | `BP-A14`, `BP-A15` (Bobot & Audit SAW) | Admin SAW | `TC-ADM-08`, `09`, `TC-SAW-02`–`04`, `16` | Unit & Integration | `GET/PUT /api/v1/admin/saw/weights` | [`saw-testing.md`](./saw-testing.md) | `[RENCANA]` |
| **FR-A11** | `BP-A16` (Cabut/Pulihkan Akses) | Admin Access | `TC-ACC-06`, `07` | Integration | `PATCH /api/v1/admin/ebook-accesses/:id` | [`test-cases.md`](./test-cases.md) | `[RENCANA]` |
| **FR-S01** | Perhitungan Eksklusif Backend | SPK SAW | `TC-SAW-01`, `TC-SAW-14` | Unit & Integration | `GET /api/v1/recommendations/saw` | [`ADR-0002`](../adr/0002-backend-only-saw.md) | `[RENCANA]` |
| **FR-S02** | Validasi Bobot SAW | SPK SAW | `TC-SAW-02`–`04`, `11` | Unit & Integration | `PUT /api/v1/admin/saw/weights` | [`saw-testing.md`](./saw-testing.md) | `[RENCANA]` |
| **FR-S03** | Normalisasi Benefit & Cost | SPK SAW | `TC-SAW-05`–`08`, `10`, `12`, `13` | Unit Test | Fungsi murni `SawService` | [`saw-testing.md`](./saw-testing.md) | `[RENCANA]` |
| **FR-S04** | Nilai Preferensi & Tie-Breaker | SPK SAW | `TC-SAW-09`, `TC-SAW-15` | Unit Test | Fungsi murni `SawService` | [`saw-testing.md`](./saw-testing.md) | `[RENCANA]` |
| **FR-S05** | Snapshot & Immutability *(Terbuka)* | SPK SAW | — *(menunggu Keputusan #11)* | — | `GET /api/v1/admin/saw/audit` `[RENCANA]` | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` |
| **FR-S06** | Verifikasi Perhitungan Manual | SPK SAW | `TC-SAW-01` | Unit Test | Fungsi murni `SawService` | [`perhitungan-manual.md`](../03-saw/perhitungan-manual.md) | `[RENCANA]` |
| **NFR-01** | Autentikasi & RBAC | Security | `TC-FOUND-02`, `TC-AUTH-05`–`10`, `SEC-01`–`05` | Integration | Semua endpoint terproteksi | [`security-testing.md`](./security-testing.md) | `[ADA]` (`401` ping) / `[RENCANA]` |
| **NFR-02** | Perlindungan File PDF | Security/Storage | `TC-ACC-01`–`05`, `SEC-06`–`07` | Integration | `POST /api/v1/ebooks/:id/access-url` | [`security-testing.md`](./security-testing.md) | `[RENCANA]` |
| **NFR-03** | Kredensial & Secret | Security | `SEC-11` | Static / Audit | `.gitignore`, `env.ts`, `VITE_*` | [`security-testing.md`](./security-testing.md) | `[ADA]` (aturan) / `[RENCANA]` (audit CI) |
| **NFR-04** | Validasi Input & Rate Limiting | Middleware | `TC-FOUND-03`, `04`, `SEC-12`, `13` | Unit & Integration | Semua endpoint | [`security-testing.md`](./security-testing.md) | `[ADA]` (`validate.test.ts`) / `[RENCANA]` (`429`) |
| **NFR-05** | Latensi API & SAW | Performance | — *(belum ada benchmark)* | Performance | `/ebooks`, `/recommendations/saw` | [`requirements.md`](../00-project/requirements.md) | `[RENCANA]` |
| **NFR-06** | Atomisitas & Idempotensi Webhook | Payment | `TC-PAY-06`, `07`, `11`, `SEC-09` | Integration | `POST /api/v1/webhooks/payment` | [`webhook-contract.md`](../02-api/webhook-contract.md) | `[RENCANA]` |
| **NFR-07** | Presisi Numerik | Data/SAW | `TC-ORD-01`, `02`, `TC-SAW-01`, `13` | Unit & Integration | `/orders`, `/recommendations/saw` | [`saw-testing.md`](./saw-testing.md) | `[RENCANA]` |
| **NFR-08** | Kepatuhan Kode & Maintainability | Quality | `TC-FOUND-05`, `TC-WEB-01`–`02`, `TC-MOB-01`–`02` | Static / Build / Unit | Seluruh repo | [`test-results.md`](./test-results.md) | `[ADA]` (baseline) / `[RENCANA]` (bisnis) |
