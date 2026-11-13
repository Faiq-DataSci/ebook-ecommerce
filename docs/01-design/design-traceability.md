# Design Traceability Matrix (`design-traceability.md`)

**Status:** `[RENCANA]` (matriks keterlacakan desain sistem) | `[ADA]` (hanya pada komponen fondasi & definisi skema Prisma awal)

Dokumen ini memetakan seluruh ID kebutuhan dari [`docs/00-project/requirements.md`](../00-project/requirements.md) ke artefak desain pada folder `docs/01-design/` agar setiap kebutuhan dapat ditelusuri hingga ke entitas data dan komponen implementasi.

> **Keterangan Singkatan:** **UC** = *Use Case*; **AD** = *Activity Diagram*; **SD** = *Sequence Diagram*; **SAW** = *Simple Additive Weighting*; **RBAC** = *Role-Based Access Control*; **JWT** = *JSON Web Token*.

---

## 1. Matriks Keterlacakan Kebutuhan Fungsional — Pelanggan (`FR-Cxx`)

| Req ID | Use Case (`use-case-diagram.md`) | Activity Diagram (`activity-diagram.md`) | Sequence Diagram (`sequence-diagram.md`) | Entitas Data (`class-diagram.md`) | Komponen (`component-diagram.md`) | Status |
|---|---|---|---|---|---|---|
| **FR-C01** | `UC-C01` | AD #1 (Registrasi & Login) | SD #1 (Login Supabase Auth + JWT) | `User`, `UserRole` | `mobile`, `pengunjung-web`, `backend`, `Supabase Auth` | `[RENCANA]` |
| **FR-C02** | `UC-C02` | AD #1 (Sesi Aktif) | SD #1 (`GET /users/me`) | `User` | `mobile`, `pengunjung-web`, `backend` | `[RENCANA]` |
| **FR-C03** | `UC-C03` | AD #2 (Jelajah Katalog & Filter) | *(Belum ada SD khusus — lihat Gap)* | `Category`, `Ebook` | `mobile`, `pengunjung-web`, `backend`, `PostgreSQL` | `[RENCANA]` |
| **FR-C04** | `UC-C04` | AD #2 (Pencarian E-Book) | *(Belum ada SD khusus — lihat Gap)* | `Ebook` | `mobile`, `pengunjung-web`, `backend`, `PostgreSQL` | `[RENCANA]` |
| **FR-C05** | `UC-C05` | AD #2 (Detail E-Book) | *(Belum ada SD khusus — lihat Gap)* | `Ebook`, `Category` | `mobile`, `pengunjung-web`, `backend` | `[RENCANA]` |
| **FR-C06** | `UC-C06` | AD #3 (Rekomendasi SAW) | SD #5 (Permintaan Rekomendasi SAW) | `Ebook`, `SawCriterionConfig` `[RENCANA]` | `mobile`, `pengunjung-web`, `backend (SAW Engine)` | `[RENCANA]` |
| **FR-C07** | `UC-C07` | AD #4 (Checkout Pesanan) | SD #2 (Checkout hingga Pembayaran) | `Order`, `OrderItem`, `Ebook`, `EbookAccess` | `mobile`, `pengunjung-web`, `backend`, `PostgreSQL` | `[RENCANA]` |
| **FR-C08** | `UC-C08` | AD #5 (Pembayaran Payment Gateway) | SD #2 & SD #3 (Gateway + Webhook) | `Order`, `Payment`, `PaymentStatus` | `mobile`, `pengunjung-web`, `backend`, `Payment Gateway` | `[RENCANA]` |
| **FR-C09** | `UC-C09` | AD #5 & AD #6 (Status Payment/Order) | SD #2 & SD #3 | `Order`, `Payment` | `mobile`, `pengunjung-web`, `backend` | `[RENCANA]` |
| **FR-C10** | `UC-C10` | AD #7 (Penerbitan Akses & Transaksi) | SD #3 (Webhook Atomik) | `Transaction`, `Order`, `OrderItem` | `mobile`, `pengunjung-web`, `backend`, `PostgreSQL` | `[RENCANA]` |
| **FR-C11** | `UC-C11` | AD #8 (Signed URL & In-App Reader) | SD #4 (Signed URL PDF) | `EbookAccess`, `Ebook` | `mobile`, `pengunjung-web`, `backend`, `Supabase Storage` | `[RENCANA]` |
| **FR-C12** | `UC-C12` | *(Gap — Keputusan #6 & #7)* | *(Gap — Keputusan #6)* | `Review` `[RENCANA]`, `Ebook` | `mobile`, `pengunjung-web`, `backend` | `[RENCANA]` |

---

## 2. Matriks Keterlacakan Kebutuhan Fungsional — Admin (`FR-Axx`)

| Req ID | Use Case (`use-case-diagram.md`) | Activity Diagram (`activity-diagram.md`) | Sequence Diagram (`sequence-diagram.md`) | Entitas Data (`class-diagram.md`) | Komponen (`component-diagram.md`) | Status |
|---|---|---|---|---|---|---|
| **FR-A01** | `UC-A01` | AD #1 (Login + Role `ADMIN`) | SD #1 (Verifikasi JWT & Role) | `User`, `UserRole` | `admin-web`, `backend`, `Supabase Auth` | `[RENCANA]` |
| **FR-A02** | `UC-A02` | *(Belum ada AD khusus — lihat Gap)* | *(Belum ada SD khusus — lihat Gap)* | `Order`, `Transaction`, `Ebook`, `User` | `admin-web`, `backend`, `PostgreSQL` | `[RENCANA]` |
| **FR-A03** | `UC-A03` | AD #9 (Kelola Kategori & E-Book) | *(Belum ada SD khusus — lihat Gap)* | `Category` | `admin-web`, `backend`, `PostgreSQL` | `[RENCANA]` |
| **FR-A04** | `UC-A04` | AD #9 (Kelola E-Book & Upload PDF) | *(Belum ada SD khusus — lihat Gap)* | `Ebook`, `Category` | `admin-web`, `backend`, `Supabase Storage` | `[RENCANA]` |
| **FR-A05** | `UC-A05` | *(Belum ada AD khusus — lihat Gap)* | *(Belum ada SD khusus — lihat Gap)* | `User`, `Order`, `Transaction` | `admin-web`, `backend`, `PostgreSQL` | `[RENCANA]` |
| **FR-A06** | `UC-A06` | *(Belum ada AD khusus — lihat Gap)* | *(Belum ada SD khusus — lihat Gap)* | `Order`, `OrderItem` | `admin-web`, `backend`, `PostgreSQL` | `[RENCANA]` |
| **FR-A07** | `UC-A07` | AD #6 (Webhook Pembayaran) | SD #3 (Webhook Payment Gateway) | `Payment`, `Order` | `admin-web`, `backend`, `Payment Gateway` | `[RENCANA]` |
| **FR-A08** | `UC-A08` | AD #7 (Pencatatan Transaksi) | SD #3 | `Transaction`, `Payment`, `Order` | `admin-web`, `backend`, `PostgreSQL` | `[RENCANA]` |
| **FR-A09** | `UC-A09` | *(Belum ada AD khusus — lihat Gap)* | *(Belum ada SD khusus — lihat Gap)* | `Transaction`, `OrderItem`, `Ebook` | `admin-web`, `backend`, `PostgreSQL` | `[RENCANA]` |
| **FR-A10** | `UC-A10` | AD #10 (Ubah Bobot SAW) | *(Gap — menunggu Keputusan #5/#9)* | `SawCriterionConfig` `[RENCANA]` | `admin-web`, `backend (SAW Engine)` | `[RENCANA]` |
| **FR-A11** | `UC-A11` | *(Belum ada AD khusus — lihat Gap)* | *(Belum ada SD khusus — lihat Gap)* | `EbookAccess` | `admin-web`, `backend`, `PostgreSQL` | `[RENCANA]` |

---

## 3. Matriks Keterlacakan SPK SAW (`FR-Sxx`) & Non-Fungsional (`NFR-xx`)

| Req ID | Use Case | Activity Diagram | Sequence Diagram | Entitas Data | Komponen & Kontrol | Status |
|---|---|---|---|---|---|---|
| **FR-S01** | `UC-S01` | AD #3 | SD #5 | `Ebook` | `backend (SAW Engine)` (Backend-Only) | `[RENCANA]` |
| **FR-S02** | `UC-S01`, `UC-A10` | AD #3, AD #10 | SD #5 | `SawCriterionConfig` `[RENCANA]` | `backend` (Zod & sum=1.0 validation) | `[RENCANA]` |
| **FR-S03** | `UC-S01` | AD #3 | SD #5 | `Ebook` | `backend (SAW Engine)` | `[RENCANA]` |
| **FR-S04** | `UC-S01` | AD #3 | SD #5 | `Ebook` | `backend (SAW Engine)` | `[RENCANA]` |
| **FR-S05** | `UC-S02` | AD #3 (Opsional #11) | SD #5 (`opt`) | `SawCalculationSnapshot` `[RENCANA]` | `backend`, `PostgreSQL` | `[RENCANA]` |
| **FR-S06** | `UC-S01` | AD #3 | SD #5 | `Ebook` | `backend` (Vitest unit test vs manual) | `[RENCANA]` |
| **NFR-01** | `UC-C01`, `UC-A01` | AD #1, AD #9, AD #10 | SD #1, SD #4 | `User`, `UserRole` | `backend/src/middlewares/auth.middleware.ts` (`[ADA]` kerangka; JWT Supabase `[RENCANA]`) | `[ADA]` / `[RENCANA]` |
| **NFR-02** | `UC-C11`, `UC-A04` | AD #8, AD #9 | SD #4 | `EbookAccess`, `Ebook` | `backend` + `Supabase Storage` bucket privat | `[RENCANA]` |
| **NFR-03** | — | — | — | — | `.gitignore` `[ADA]`, `.env` backend-only, larangan secret di `VITE_*` & Flutter | `[ADA]` (aturan) |
| **NFR-04** | Semua UC | AD #2, AD #4, AD #9, AD #10 | Semua SD | — | `backend/src/middleware/validate.ts` & `rate-limit.middleware.ts` (`[ADA]` kerangka) | `[ADA]` / `[RENCANA]` |
| **NFR-05** | `UC-C03`, `UC-C06` | AD #2, AD #3 | SD #5 | `Ebook`, `Order` | `backend`, `PostgreSQL` (pagination & index) | `[RENCANA]` |
| **NFR-06** | `UC-C08`, `UC-A07` | AD #6, AD #7 | SD #3 | `Payment`, `Order`, `Transaction`, `EbookAccess` | `backend` (`prisma.$transaction` + idempotency) | `[RENCANA]` |
| **NFR-07** | `UC-C07`, `UC-S01` | AD #3, AD #4 | SD #2, SD #5 | `Ebook`, `Order`, `OrderItem`, `Payment`, `Transaction` | `schema.prisma` (`Decimal(12,2)` `[ADA]`) | `[ADA]` (skema) / `[RENCANA]` (logika) |
| **NFR-08** | — | — | — | — | `backend/tsconfig.json`, `vitest.config.ts` (`[ADA]`); cakupan tes bisnis (`[RENCANA]`) | `[ADA]` / `[RENCANA]` |

---

## 4. Gap Dokumentasi Keterlacakan yang Teridentifikasi

1. **Ulasan & Rating (`FR-C12` / `UC-C12`):** Belum memiliki Activity Diagram, Sequence Diagram, maupun model Prisma karena menunggu Keputusan #6 dan #7 pada [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md).
2. **Model & Snapshot SAW (`FR-S02`, `FR-S05`, `FR-A10`):** Entitas `SawCriterionConfig` dan `SawCalculationSnapshot` belum ada di `backend/prisma/schema.prisma` karena menunggu Keputusan #5, #9, dan #11.
3. **Sequence Diagram Operasional Admin & Katalog Publik (`FR-C03`–`FR-C05`, `FR-A02`–`FR-A06`, `FR-A09`–`FR-A11`):** Belum dibuatkan Sequence Diagram tersendiri karena berfokus pada operasi CRUD/agregasi standar; Activity Diagram sudah mencakup alur inti katalog (#2) dan manajemen kategori/e-book (#9).
4. **Manajemen Penulis Terpisah (`BR-A05`):** Tidak dimasukkan ke matriks karena pada `schema.prisma` (`[ADA]`) penulis masih berupa atribut string `Ebook.author`.
