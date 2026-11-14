# Matriks Keterlacakan Kebutuhan Keamanan (`Security Traceability`)

**Status:** `[ADA]` (pemetaan kebutuhan & aturan ke kontrol serta bukti aktual)  
**Referensi Utama:** [`requirements.md`](../00-project/requirements.md), [`AGENTS.md`](../../AGENTS.md), [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md), [`test-cases.md`](../09-testing/test-cases.md).

---

## 1. Keterlacakan `NFR-01` – `NFR-08`

| Requirement ID | Kategori Keamanan | Kontrol | Mekanisme | Bukti File | Test Case | Status |
|---|---|---|---|---|---|---|
| **NFR-01** | Autentikasi & RBAC | Verifikasi JWT + RBAC `CUSTOMER`/`ADMIN` | `authenticate`, `authorize` | `backend/src/middlewares/auth.middleware.ts`, `app.ts` | `TC-AUTH-01`..`03` | `[ADA]` kerangka / `[RENCANA]` penuh |
| **NFR-02** | Perlindungan File PDF | Bucket privat + signed URL + cek `EbookAccess` | `createPrivatePdfSignedUrl` (TTL 300s) | `backend/src/integrations/storage/supabase-storage.ts` | `TC-ACC-01`, `TC-ACC-02` | `[ADA]` helper / `[RENCANA]` endpoint |
| **NFR-03** | Kredensial & Secret | `.gitignore` + env Zod + larangan `VITE_*`/Flutter | `.env` diabaikan Git, validasi env | `.gitignore`, `backend/src/config/env.ts`, `.env.example` | Audit pra-rilis (`SEC-01`..`04`) | `[ADA]` aturan & `.gitignore` |
| **NFR-04** | Validasi Input & Rate Limiting | Zod + `helmet()` + `express-rate-limit` | `validate`, `helmet`, `sensitiveEndpointLimiter` | `validate.ts`, `app.ts`, `rate-limit.middleware.ts` | `TC-AUTH-*`, `SEC-10` | `[ADA]` sebagian / `[RENCANA]` mount |
| **NFR-05** | Latensi API & SAW | Pagination & query terindeks | `@@index([categoryId])`, `@@index([isActive])`, dll. | `backend/prisma/schema.prisma` | Performance tests | `[ADA]` indeks schema / `[RENCANA]` |
| **NFR-06** | Atomisitas & Idempotensi | `prisma.$transaction` + idempotensi webhook | Cek status final + transaksi atomik | `docs/02-api/webhook-contract.md` | `TC-PAY-01`, `TC-PAY-02` | `[RENCANA]` |
| **NFR-07** | Presisi Numerik | `Decimal(12,2)` & presisi penuh SAW | Tipe kolom PostgreSQL + pure function SAW | `backend/prisma/schema.prisma`, `docs/03-saw/` | `TC-SAW-01`..`16` | `[ADA]` schema / `[RENCANA]` SAW |
| **NFR-08** | Kepatuhan Kode | Typecheck + ESM `.js` + test suite | `tsc --noEmit`, `vitest run` | `backend/package.json`, `backend/tsconfig.json` | `docs/09-testing/test-results.md` (5 tests) | `[ADA]` fondasi / `[RENCANA]` bisnis |

---

## 2. Keterlacakan Aturan `AGENTS.md` & Keputusan Terbuka

| Sumber | Aturan / Keputusan | Kontrol Keamanan Terkait | Bukti / Dokumen | Status |
|---|---|---|---|---|
| **`AGENTS.md` #1** | SAW hanya di backend | Bobot klien ditolak; validasi server | [`ADR-0002`](../adr/0002-backend-only-saw.md), [`security-saw.md`](./security-saw.md) | `[ADA]` keputusan / `[RENCANA]` kode |
| **`AGENTS.md` #2** | Otorisasi di backend (token + role) | `authenticate` + `authorize('ADMIN')` | `backend/src/middlewares/auth.middleware.ts` | `[ADA]` kerangka / `[RENCANA]` bisnis |
| **`AGENTS.md` #3** | Bucket privat + signed URL sementara | `ebooks-private` + `createPrivatePdfSignedUrl` | `backend/src/integrations/storage/supabase-storage.ts` | `[ADA]` helper / `[RENCANA]` endpoint |
| **`AGENTS.md` #4** | Tidak ada secret di repo / `VITE_*` / Flutter | `.gitignore`, `.env.example`, audit secret | `.gitignore`, [`security-guidelines.md`](./security-guidelines.md) | `[ADA]` aturan & `.gitignore` |
| **`AGENTS.md` #5** | Data simulasi berlabel `"DATA SIMULASI"` | Kejujuran data contoh di UI & dokumen | [`AGENTS.md`](../../AGENTS.md) | `[ADA]` aturan |
| **`AGENTS.md` #6** | Status dokumentasi jujur `[ADA]` / `[RENCANA]` | Catatan audit kejujuran di `security-overview.md` | [`security-overview.md`](./security-overview.md) | `[ADA]` |
| **Keputusan #2** | Autentikasi menggunakan Supabase Auth | `supabase.auth.getUser(token)` | `backend/src/middlewares/auth.middleware.ts` | `[ADA]` |
| **Keputusan #3** | Payment gateway nyata | Verifikasi signature & idempotensi webhook | [`security-payment.md`](./security-payment.md) | `[RENCANA]` |
| **Keputusan #4** | Baca PDF *in-app reader* | Signed URL TTL 300s tanpa unduh bebas | [`security-data-protection.md`](./security-data-protection.md) | `[ADA]` keputusan / `[RENCANA]` reader |
