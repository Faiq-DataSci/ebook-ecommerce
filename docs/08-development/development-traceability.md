# Matriks Keterlacakan Pengembangan (`Development Traceability`)

**Status:** `[ADA]` (pemetaan fondasi pengembangan aktual) | `[RENCANA]` (otomasi CI & modul bisnis)  
**Referensi Utama:** [`requirements.md`](../00-project/requirements.md), [`AGENTS.md`](../../AGENTS.md), [`CONTRIBUTING.md`](../../CONTRIBUTING.md).

---

## Matriks Keterlacakan Kebutuhan & Aturan ke Artefak Pengembangan

| Requirement / Sumber | Komponen | Artefak Pengembangan | Skrip / Tool | Dokumen Referensi | Status |
|---|---|---|---|---|---|
| **NFR-04** (Validasi Input) | Backend | `backend/src/middleware/validate.ts` (Zod) | `npm run typecheck`, `npm test` | [`coding-conventions.md`](./coding-conventions.md) | `[ADA]` fondasi / `[RENCANA]` skema |
| **NFR-07** (Presisi Numerik) | Backend / DB | `backend/prisma/schema.prisma` (`Decimal(12,2)`) | `npm run prisma:validate` | [`database-development.md`](./database-development.md) | `[ADA]` schema / `[RENCANA]` SAW |
| **NFR-08** (Kepatuhan Kode) | Semua | `tsconfig.json`, `eslint.config.js`, `analysis_options.yaml` | `typecheck`, `lint`, `flutter analyze` | [`coding-conventions.md`](./coding-conventions.md), [`testing-guide.md`](./testing-guide.md) | `[ADA]` |
| **`AGENTS.md` #7** | Semua | Urutan `Backend -> Admin Web -> Mobile` | Alur kerja bertahap | [`development-guide.md`](./development-guide.md) | `[ADA]` aturan |
| **`AGENTS.md` #8** | Semua | Kejujuran hasil verifikasi & status | Audit manual & PR template | [`development-checklist.md`](./development-checklist.md) | `[ADA]` aturan |
| **Konvensi ESM `.js`** | Backend | `package.json` (`"type": "module"`), `tsconfig.json` (`NodeNext`) | `npm run typecheck`, `npm run build` | [`coding-conventions.md`](./coding-conventions.md) | `[ADA]` |
| **Prisma 7 `prisma.config.ts`** | Backend / DB | `backend/prisma.config.ts`, `src/config/prisma.ts` | `prisma validate`, `prisma generate` | [`database-development.md`](./database-development.md) | `[ADA]` config / `[RENCANA]` migrasi |
| **Vitest Config** | Backend | `backend/vitest.config.ts`, `backend/tests/` | `npm test` | [`testing-guide.md`](./testing-guide.md) | `[ADA]` |
| **Git Workflow** | Semua | `CONTRIBUTING.md`, `CHANGELOG.md`, `.gitignore` | `git`, PR template | [`git-workflow.md`](./git-workflow.md) | `[ADA]` aturan / `[RENCANA]` CI |
| **Troubleshooting** | Semua | `docs/10-maintenance/troubleshooting.md` | Perintah diagnostik PowerShell | [`debugging-guide.md`](./debugging-guide.md) | `[ADA]` aturan |
