# Struktur Proyek Monorepo (`Project Structure`)

**Status:** `[ADA]` (struktur monorepo & file fondasi) | `[RENCANA]` (direktori modul bisnis backend, web, & mobile)  
**Referensi Utama:** [`AGENTS.md`](../../AGENTS.md), [`mobile/AGENTS.md`](../../mobile/AGENTS.md), [`docs/docs-proyek-ebook-ecommerce.md`](../docs-proyek-ebook-ecommerce.md).

---

## 1. Pohon Direktori Root Monorepo (`[ADA]`)

```text
ebook-ecommerce/
├── AGENTS.md                  # Panduan & aturan mutlak agen/pengembangan [ADA]
├── CHANGELOG.md               # Catatan perubahan proyek [ADA]
├── CONTRIBUTING.md            # Aturan branching, commit, & PR [ADA]
├── SECURITY.md                # Kebijakan pelaporan keamanan [ADA]
├── README.md                  # Ringkasan proyek [ADA]
├── .gitignore                 # Abaikan .env, node_modules, dist, keystore [ADA]
├── .github/                   # Template PR & placeholder CI [ADA]
├── backend/                   # REST API Express 5 + Prisma 7 + Vitest [ADA]
├── web/
│   ├── admin-web/             # Dashboard Admin (React + TS + Vite) [ADA]
│   └── pengunjung-web/        # Web Pengunjung (React + JSX + Vite) [ADA]
├── mobile/
│   ├── AGENTS.md              # Aturan khusus mobile Flutter [ADA]
│   └── ebook_store/           # Aplikasi Android (Flutter + Riverpod + Dio) [ADA]
└── docs/                      # Dokumentasi sistem terstruktur [ADA]
```

---

## 2. Struktur Detail `backend/`

- `src/config/` (`[ADA]`): `env.ts` (Zod env), `prisma.ts` (`PrismaPg` + `Pool`), `supabase.ts` (klien Supabase).
- `src/middleware/` (`[ADA]`): `validate.ts` (middleware Zod).
- `src/middlewares/` (`[ADA]`): `auth.middleware.ts`, `error.middleware.ts`, `rate-limit.middleware.ts`. *(Catatan inkonsistensi: folder singular `middleware/` vs plural `middlewares/` dicatat di [`development-gap-register.md`](./development-gap-register.md)).*
- `src/integrations/storage/` (`[ADA]`): `supabase-storage.ts` (`createPrivatePdfSignedUrl`).
- `src/utils/` (`[ADA]`): `app-error.ts`, `response.ts` (`sendSuccess`).
- `src/routes/`, `src/controllers/`, `src/services/`, `src/validators/` (`[RENCANA]` — belum dibuat).
- `tests/` (`[ADA]`): `health.test.ts` dan `unit/validate.test.ts`.
- `prisma/` (`[ADA]`): `schema.prisma`; `migrations/` masih `[RENCANA]`.

---

## 3. Struktur `web/` & `mobile/`

- **`web/admin-web/` (`[ADA]` template TS):** `src/` (`App.tsx`, `main.tsx`), `tsconfig.json`, `eslint.config.js`, `vite.config.ts`, `.env.example`. Folder `src/components/`, `src/pages/` `[RENCANA]`.
- **`web/pengunjung-web/` (`[ADA]` template JSX):** `src/` (`App.jsx`, `main.jsx`), `eslint.config.js`, `vite.config.js`, `.env.example`.
- **`mobile/ebook_store/` (`[ADA]` template Flutter):** `lib/main.dart`, `test/widget_test.dart`, `pubspec.yaml`, `analysis_options.yaml`. Folder `lib/core/network/` & `lib/features/<nama>/{data,domain,presentation}/` `[RENCANA]`.

---

## 4. Struktur `docs/` (`[ADA]`)

- `00-project/` (requirements, project-plan, keputusan-terbuka)
- `01-project-overview/` (ringkasan bisnis, ruang lingkup, metrik sukses)
- `01-design/` (architecture, ERD, DFD, use case, sequence, class, UI/UX `design.md`)
- `02-architecture/` & `02-api/` (arsitektur teknis & kontrak OpenAPI `api-spec.yaml`)
- `03-business-process/` & `03-saw/` (alur proses bisnis & spesifikasi matematis SAW)
- `04-database/` & `04-testing/` & `09-testing/` (desain DB & strategi/kasus/hasil uji)
- `05-api/` & `05-deployment/` (dokumentasi endpoint & panduan deployment)
- `06-modules/`, `07-security/`, `08-development/`, `10-maintenance/`, `adr/`

---

## 5. Aturan Penamaan & Penempatan File Baru

- **Backend:** Middleware `kebab-case.middleware.ts`, config/utils `camelCase.ts`; routes -> `src/routes/`, controllers -> `src/controllers/`, services -> `src/services/`, validators -> `src/validators/` (`[RENCANA]`).
- **Web:** Komponen `PascalCase.tsx`, utilitas `camelCase.ts`; taruh di `src/components/` dan `src/pages/` (`[RENCANA]`).
- **Mobile:** File `snake_case.dart`; taruh fitur di `lib/features/<nama>/` (`[RENCANA]`).
