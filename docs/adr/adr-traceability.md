# Matriks Keterlacakan ADR (`ADR Traceability Matrix`)

**Status:** `[ADA]` (pemetaan ADR `0001`–`0007` dan inventaris keputusan terbuka `#5`–`#11`).  
**Referensi Utama:** [`docs/00-project/requirements.md`](../00-project/requirements.md), [`docs/00-project/keputusan-terbuka.md`](../00-project/keputusan-terbuka.md), [`docs/02-architecture/architecture-decisions-summary.md`](../02-architecture/architecture-decisions-summary.md).

---

## 1. Keterlacakan ADR Aktif (`ADR-0001` s.d. `ADR-0007`)

| ADR | Keputusan Terbuka | Kebutuhan (`FR`/`NFR`) | Dokumen Arsitektur | Dokumen Modul | Bukti Teknis | Status Keputusan |
|---|---|---|---|---|---|---|
| [**ADR-0001**](./0001-single-seller-b2c.md) | #1 (referensi) | `FR-C*`, `FR-A*` | [`system-scope.md`](../01-project-overview/system-scope.md) | [`admin-dashboard.md`](../06-modules/admin-dashboard.md) | [`schema.prisma`](../../backend/prisma/schema.prisma) (`UserRole`) | **Diterima** (`[RENCANA]` impl.) |
| [**ADR-0002**](./0002-backend-only-saw.md) | #5, #7, #9, #11 *(dependensi terbuka)* | `FR-S01`–`FR-S06`, `FR-C06` | [`architecture-decisions-summary.md`](../02-architecture/architecture-decisions-summary.md) | [`ebook-catalog.md`](../06-modules/ebook-catalog.md) | [`saw-backend-contract.md`](../03-saw/saw-backend-contract.md) | **Diterima** (`[RENCANA]` impl.) |
| [**ADR-0003**](./0003-admin-web-sebelum-mobile.md) | — | `NFR-08` | [`project-plan.md`](../00-project/project-plan.md) | — | [`AGENTS.md`](../../AGENTS.md) (urutan) | **Diterima** (`[ADA]` urutan / `[RENCANA]` selesai) |
| [**ADR-0004**](./0004-supabase-auth.md) | #2 (`[ADA]`) | `FR-C01`, `FR-A01`, `NFR-01` | [`security-architecture.md`](../02-architecture/security-architecture.md) | [`authentication.md`](../06-modules/authentication.md) | [`auth.middleware.ts`](../../backend/src/middlewares/auth.middleware.ts) | **Diterima** (`[ADA]` middleware / `[RENCANA]` sync) |
| [**ADR-0005**](./0005-payment-gateway-nyata.md) | #3 (`[ADA]`) | `FR-C08`, `NFR-06` | [`integration-architecture.md`](../02-architecture/integration-architecture.md) | [`payment-management.md`](../06-modules/payment-management.md) | [`schema.prisma`](../../backend/prisma/schema.prisma) (`Payment`) | **Diterima** (`[RENCANA]` impl.) |
| [**ADR-0006**](./0006-pdf-storage-privat-signed-url.md) | #4 (`[ADA]`) | `FR-C11`, `NFR-02` | [`security-architecture.md`](../02-architecture/security-architecture.md) | [`ebook-access.md`](../06-modules/ebook-access.md) | [`supabase-storage.ts`](../../backend/src/integrations/storage/supabase-storage.ts) | **Diterima** (`[ADA]` helper / `[RENCANA]` endpoint) |
| [**ADR-0007**](./0007-pengunjung-web-dipertahankan.md) | #1 (`[ADA]`) | `FR-C03`–`FR-C11` | [`application-architecture.md`](../02-architecture/application-architecture.md) | — | [`web/pengunjung-web/`](../../web/pengunjung-web/package.json) | **Diterima** (`[ADA]` template / `[RENCANA]` bisnis) |

---

## 2. Keputusan Terbuka yang Belum Memiliki ADR (`[RENCANA]`)

Sesuai [`adr-conventions.md`](./adr-conventions.md), keputusan `#5`–`#11` di [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) **belum difinalisasi** sehingga belum boleh dibuat menjadi ADR berstatus `Diterima`:

| Keputusan Terbuka | Topik | Dampak | Butuh ADR? | Status |
|---|---|---|---|---|
| **#5** | Pengubahan bobot SAW (Admin-only vs preset pelanggan) | Parameter `GET /recommendations/saw` & UI kontrol bobot | Ya, setelah final | `[RENCANA]` |
| **#6** | Ulasan & rating e-book | Penambahan model `Review` & validasi kepemilikan | Ya, setelah final | `[RENCANA]` |
| **#7** | Perlakuan e-book tanpa rating (`ratingAvg = 0`) | Aturan normalisasi & *edge case* fungsi murni SAW | Ya, setelah final | `[RENCANA]` |
| **#8** | Identitas & logo resmi aplikasi | Branding UI, `index.html`, `pubspec.yaml` | Opsional (non-teknis) | `[RENCANA]` |
| **#9** | Konflik 4 vs 5 kriteria SAW | Dataset SAW, `perhitungan-manual.md`, & unit test SAW | Ya, setelah final | `[RENCANA]` |
| **#10** | Platform hosting backend (PaaS vs serverless) | Entry point server, pooling DB, webhook, & monitoring | Ya, setelah final | `[RENCANA]` |
| **#11** | Penyimpanan riwayat / snapshot hasil SAW | Penambahan tabel snapshot di `schema.prisma` | Ya, setelah final | `[RENCANA]` |
