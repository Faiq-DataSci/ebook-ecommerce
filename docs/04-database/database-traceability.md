# Matriks Keterlacakan Basis Data (`Database Traceability`)

> **Status Dokumen:** `[ADA]` (Dokumentasi pemetaan) | **Implementasi Endpoint & Migrasi:** `[RENCANA]`
> **Sumber Kebenaran:** [`requirements.md`](../00-project/requirements.md), [`schema.prisma`](../../backend/prisma/schema.prisma), [`api-spec.yaml`](../02-api/api-spec.yaml)

---

## 1. Pemetaan Kebutuhan ke Entitas & Kolom Basis Data

| Requirement ID | Proses Bisnis | Entitas | Kolom Penting | Endpoint/API | Test Case | Dokumen Referensi | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FR-C01, FR-C12, FR-A01** | Auth, Login & Profil (`BP-C01`, `BP-A01`–`02`) | `User` | `id`, `supabaseUserId`, `email`, `role`, `isActive` | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` `[RENCANA]`; `GET /admin/ping` `[ADA]` | `TC-AUTH-01`–`03` | [`data-dictionary.md`](./data-dictionary.md), [`api-spec.yaml`](../02-api/api-spec.yaml) | `[ADA]` skema / `[RENCANA]` fitur |
| **FR-C02, FR-C03, FR-A02** | Kategori & Filter Katalog (`BP-C04`, `BP-A03`) | `Category` | `id`, `name`, `slug`, `isActive` | `GET /categories`, `/admin/categories*` | `TC-CAT-01` | [`database-design.md`](./database-design.md) | `[ADA]` skema / `[RENCANA]` API |
| **FR-C02–C04, FR-A03–A05** | Katalog & Detail E-Book (`BP-C02`–`05`, `BP-A04`–`08`) | `Ebook`, `Category` | `id`, `categoryId`, `title`, `price`, `coverUrl`, `storagePath`, `isActive` | `GET /ebooks`, `GET /ebooks/:id`, `/admin/ebooks*` | — | [`data-dictionary.md`](./data-dictionary.md), [`database-indexing.md`](./database-indexing.md) | `[ADA]` skema / `[RENCANA]` API |
| **FR-C06** | Buat Pesanan / Checkout (`BP-C07`) | `Order`, `OrderItem`, `Ebook`, `EbookAccess` | `orderNumber`, `totalAmount`, `status`, `unitPrice`, `expiresAt` | `POST /orders`, `GET /orders` | `TC-ORD-01` | [`database-rules.md`](./database-rules.md), [`transaction-workflow.md`](../03-business-process/transaction-workflow.md) | `[ADA]` skema / `[RENCANA]` API |
| **FR-C07, FR-C08** | Pembayaran, Webhook & Transaksi (`BP-C08`–`10`) | `Payment`, `Transaction`, `Order` | `paymentMethod`, `amount`, `status`, `externalRef`, `transactionCode`, `paidAt` | `POST /payments`, `POST /webhooks/payment`, `GET /orders/:id` | `TC-PAY-01`–`02` | [`database-constraints.md`](./database-constraints.md) | `[ADA]` skema / `[RENCANA]` API |
| **FR-C09–C11, FR-A11** | Hak Akses E-Book & Signed URL (`BP-C11`–`12`, `BP-A16`) | `EbookAccess`, `Ebook` | `userId`, `ebookId`, `orderId`, `isRevoked`, `storagePath` | `GET /library`, `POST /ebooks/:id/access-url`, `PATCH /admin/ebook-accesses/:id` | `TC-ACC-01`–`02` | [`database-security.md`](./database-security.md), [`ebook-access-workflow.md`](../03-business-process/ebook-access-workflow.md) | `[ADA]` skema / `[RENCANA]` API |
| **FR-A06–A09** | Dashboard Admin, Pelanggan & Laporan Penjualan (`BP-A09`–`13`) | `User`, `Order`, `Payment`, `Transaction`, `Ebook` | `role`, `status`, `totalAmount`, `recordedAt`, `salesCount` | `/admin/customers`, `/admin/orders`, `/admin/payments`, `/admin/transactions`, `/admin/reports/sales` | — | [`admin-workflow.md`](../03-business-process/admin-workflow.md) | `[ADA]` skema / `[RENCANA]` API |
| **FR-C05, FR-S01–S04, FR-S06** | Rekomendasi SPK SAW (`BP-C06`) | `Ebook`, `Category` | `price`, `ratingAvg`, `salesCount`, `pageCount`, `publishedYear`, `isActive` | `GET /recommendations/saw` | `TC-SAW-01`–`15` | [`saw-method.md`](../03-saw/saw-method.md), [`saw-traceability.md`](../03-saw/saw-traceability.md) | `[ADA]` kolom `Ebook` / `[RENCANA]` SAW |
| **FR-A10, FR-S02** | Konfigurasi Bobot SAW (`BP-A14`) | `SawCriterionConfig` `[RENCANA]` | `weight`, `type`, `isActive`, `version` `[RENCANA]` | `GET/PUT /admin/saw/weights` | `TC-SAW-02`–`04`, `TC-SAW-16` | [`criteria-and-weights.md`](../03-saw/criteria-and-weights.md) | `[RENCANA]` |
| **FR-S05** | Snapshot Rekomendasi SAW (`BP-A15`) | `SawCalculationSnapshot` `[RENCANA]` | `criteriaVersion`, `executedAt`, `resultsJson` `[RENCANA]` | `GET /admin/saw/audit` `[RENCANA]` | — | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) (#11) | `[RENCANA]` |
| **Keputusan #6 & #7** | Review & Rating E-Book | `Review` `[RENCANA]`, `Ebook` | `rating`, `comment` `[RENCANA]`, `Ebook.ratingAvg` | Belum ada di `api-spec.yaml` | `TC-SAW-12` | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) (#6, #7) | `[RENCANA]` |
