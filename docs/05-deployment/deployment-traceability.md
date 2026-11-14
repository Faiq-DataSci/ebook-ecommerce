# Matriks Keterlacakan Deployment (`Deployment Traceability`)

**Status:** `[ADA]` (pemetaan audit aktual) | `[RENCANA]` (keterlacakan target produksi)  
**Tujuan:** Memastikan setiap kebutuhan arsitektur deployment, aturan keamanan, dan keputusan terbuka terhubung langsung ke dokumen `docs/05-deployment/` dan artefak kode di repository.

---

## 1. Matriks Keterlacakan Kebutuhan & Artefak

| ID / Sumber | Topik / Kebutuhan | Artefak Repo Aktual (`[ADA]` / `[RENCANA]`) | Dokumen Deployment Terkait | Status |
|---|---|---|---|---|
| **DEP-01** | Peta 3 lingkungan & arsitektur deployment | [`deployment-architecture.md`](../02-architecture/deployment-architecture.md) | [`deployment.md`](./deployment.md) | `[RENCANA]` |
| **DEP-02** | Build, runtime ESM, health check, & hosting backend (Keputusan #10) | `backend/package.json`, `backend/src/app.ts`, `backend/src/server.ts` (`[ADA]`) | [`deployment-backend.md`](./deployment-backend.md) | `[ADA]` fondasi / `[RENCANA]` hosting |
| **DEP-03** | Build statis Vite `admin-web` & `pengunjung-web`, aturan `VITE_*` | `web/admin-web/package.json`, `web/pengunjung-web/package.json` (`[ADA]`) | [`deployment-web.md`](./deployment-web.md) | `[ADA]` skrip build / `[RENCANA]` CDN |
| **DEP-04** | Build Android Flutter, `baseUrl` (`10.0.2.2` vs LAN vs HTTPS), signing & PDF | `mobile/AGENTS.md`, `mobile/ebook_store/pubspec.yaml` (`[ADA]`) | [`deployment-mobile.md`](./deployment-mobile.md) | `[ADA]` template / `[RENCANA]` signing & rilis |
| **DEP-05** | Supabase PostgreSQL (`6543` pooler vs `5432` direct), Prisma 7, bucket privat | `backend/prisma.config.ts`, `backend/src/config/prisma.ts`, `backend/src/config/supabase.ts` (`[ADA]`) | [`deployment-database.md`](./deployment-database.md) | `[ADA]` config / `[RENCANA]` migrasi & backup |
| **DEP-06** | Skema env Zod & pemisahan template `.env.example` | `backend/src/config/env.ts`, `backend/.env.example`, `web/*/.env.example` (`[ADA]`) | [`deployment-environment.md`](./deployment-environment.md) | `[ADA]` template / `[RENCANA]` nilai prod |
| **DEP-07** | Hardening produksi (`helmet`, CORS, rate limit, TLS, signed URL, webhook) | `backend/src/app.ts`, `backend/src/middlewares/rate-limit.middleware.ts` (`[ADA]`) | [`deployment-security.md`](./deployment-security.md) | `[ADA]` parsial / `[RENCANA]` prod |
| **DEP-08** | Pipeline CI/CD otomatis lintas modul | `.github/workflows/ci.yml` (`[ADA]` placeholder) | [`deployment-ci-cd.md`](./deployment-ci-cd.md) | `[ADA]` placeholder / `[RENCANA]` penuh |
| **DEP-09** | Urutan rilis `Backend -> Admin Web -> Mobile`, smoke test, & rollback | `AGENTS.md` (`[ADA]` aturan) | [`deployment-checklist.md`](./deployment-checklist.md) | `[RENCANA]` |
| **DEP-10** | Pencatatan seluruh kesenjangan deployment aktual vs target | Seluruh audit `backend/`, `web/`, `mobile/`, `.github/` | [`deployment-gap-register.md`](./deployment-gap-register.md) | `[ADA]` register audit |

---

## 2. Keterlacakan Keputusan Terbuka Terkait Deployment

| No. Keputusan (`keputusan-terbuka.md`) | Topik | Dampak pada Deployment | Dokumen yang Mencatat |
|---|---|---|---|
| **#8** | Nama resmi aplikasi & logo (`[RENCANA]`) | Penamaan `applicationId`, launcher label, dan aset ikon APK/AAB | [`deployment-mobile.md`](./deployment-mobile.md), [`deployment-checklist.md`](./deployment-checklist.md) |
| **#10** | Platform hosting backend (`[RENCANA]`) | Menentukan PaaS Node.js (`app.listen`) vs Serverless Vercel Functions (`api/index.ts`) dan konfigurasi CD | [`deployment.md`](./deployment.md), [`deployment-backend.md`](./deployment-backend.md), [`deployment-ci-cd.md`](./deployment-ci-cd.md) |
