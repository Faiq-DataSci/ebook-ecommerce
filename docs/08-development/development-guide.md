# Panduan Pengembangan (`Development Guide`)

**Status:** `[ADA]` (urutan kerja, skrip package.json, & struktur awal backend) | `[RENCANA]` (alur pengembangan fitur bisnis penuh)  
**Referensi Utama:** [`AGENTS.md`](../../AGENTS.md), [`backend/package.json`](../../backend/package.json), [`web/admin-web/package.json`](../../web/admin-web/package.json), [`web/pengunjung-web/package.json`](../../web/pengunjung-web/package.json).

---

## 1. Urutan Pengembangan Terkunci (`[ADA]` di `AGENTS.md`)

1. **`backend/`** — Skema Prisma, migrasi database, autentikasi/otorisasi, REST API, dan engine SAW.
2. **`web/admin-web/`** — Dashboard admin React + TypeScript + Vite (desain neo-brutalism).
3. **`mobile/ebook_store/`** — Aplikasi pelanggan Flutter + Riverpod + Dio.

> Uji konektivitas dasar (`GET /api/v1/health`, `GET /api/v1/admin/ping`) wajib diverifikasi sebelum membangun antarmuka penuh (`[RENCANA]`).

---

## 2. Skrip Tersedia per Komponen

### A. Backend (`backend/package.json` — `[ADA]`)

| Skrip | Perintah | Tujuan | Status |
|---|---|---|---|
| `dev` | `tsx watch src/server.ts` | Server lokal dengan auto-restart | `[ADA]` |
| `build` | `tsc` | Kompilasi TypeScript ke `dist/` | `[ADA]` |
| `start` | `node dist/server.js` | Menjalankan hasil build produksi | `[ADA]` |
| `typecheck` | `tsc --noEmit` | Pemeriksaan tipe statis TypeScript | `[ADA]` |
| `test` | `vitest run` | Menjalankan unit & integration test | `[ADA]` |
| `prisma:validate` | `npx prisma validate` | Validasi `prisma/schema.prisma` | `[ADA]` |

### B. Web (`web/admin-web/package.json` & `web/pengunjung-web/package.json` — `[ADA]`)

| Skrip | Perintah (`admin-web` / `pengunjung-web`) | Tujuan | Status |
|---|---|---|---|
| `dev` | `vite` | Dev server dengan Vite HMR | `[ADA]` |
| `build` | `tsc --noEmit ... && vite build` (`admin-web`) / `vite build` (`pengunjung-web`) | Build statis ke `dist/` | `[ADA]` |
| `lint` | `eslint .` | Pemeriksaan lint ESLint | `[ADA]` |
| `preview` | `vite preview` | Pratinjau hasil build `dist/` | `[ADA]` |

### C. Mobile (`mobile/ebook_store/`)

| Perintah | Tujuan | Status |
|---|---|---|
| `flutter run` | Menjalankan aplikasi dengan hot reload (`r`) & hot restart (`R`) | `[ADA]` |
| `flutter analyze` | Analisis statis Dart (`flutter_lints`) | `[ADA]` |
| `flutter test` | Menjalankan test Flutter | `[ADA]` |
| `flutter build apk` / `flutter build appbundle` | Build artefak rilis Android | `[RENCANA]` |

---

## 3. Menjalankan Komponen Secara Paralel (PowerShell)

Buka terminal PowerShell terpisah untuk setiap komponen:
- **Backend (port 3000):** `npm --prefix backend run dev`
- **Admin Web (port 5173):** `npm --prefix web/admin-web run dev`
- **Pengunjung Web (port 5174):** `npm --prefix web/pengunjung-web run dev`
- **Mobile:** `cd mobile\ebook_store; flutter run`

---

## 4. Aturan Data Simulasi & Audit Pra-Push (`[ADA]`)

- Seluruh data tiruan pada UI sebelum terhubung ke API backend wajib berlabel **`"DATA SIMULASI"`**.
- Dilarang membuat endpoint palsu atau tombol tanpa aksi.
- Sebelum commit/push, periksa `.gitignore`, `git status`, dan pastikan tidak ada secret yang ikut masuk ke diff.

---

## 5. Struktur Direktori Backend Aktual (`[ADA]` kecuali yang bertanda `[RENCANA]`)

```text
backend/
├── src/
│   ├── config/          # env.ts, prisma.ts, supabase.ts [ADA]
│   ├── middleware/      # validate.ts [ADA]
│   ├── middlewares/     # auth.middleware.ts, error.middleware.ts, rate-limit.middleware.ts [ADA]
│   ├── integrations/    # storage/supabase-storage.ts [ADA]
│   ├── utils/           # app-error.ts, response.ts [ADA]
│   ├── app.ts           # Setup Express app [ADA]
│   └── server.ts        # Entry point server [ADA]
├── tests/
│   ├── health.test.ts   # Integration test Supertest [ADA]
│   └── unit/
│       └── validate.test.ts  # Unit test Zod & response [ADA]
├── prisma/
│   ├── schema.prisma    # 8 model & 3 enum [ADA]
│   └── migrations/      # [RENCANA] belum ada
├── prisma.config.ts     # Konfigurasi Prisma 7 [ADA]
├── vitest.config.ts     # Konfigurasi Vitest [ADA]
├── tsconfig.json        # Konfigurasi TypeScript [ADA]
├── package.json         # Dependensi & skrip [ADA]
└── .env.example         # Template env [ADA]
```

---

## 6. Checklist Sebelum Mulai Mengembangkan Fitur Baru

1. Pastikan `npm --prefix backend run typecheck` PASS.
2. Pastikan `npm --prefix backend test` PASS.
3. Pastikan `npm --prefix web/admin-web run lint` PASS.
4. Pastikan `flutter analyze` PASS (bila menyentuh `mobile/ebook_store/`).
5. Buat branch baru sesuai [`git-workflow.md`](./git-workflow.md).
