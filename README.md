# Sistem Informasi E-Book dan SPK Berbasis Mobile (Metode SAW)

Proyek akademik Sains Data (Sistem Informasi / SPK, Universitas Putra Bangsa, kelas 2DSRA).

- **Model bisnis:** E-commerce e-book *single-seller* (B2C, bukan marketplace)
- **Aktor:** Pelanggan dan Admin
- **Status:** `[RENCANA]` — Fondasi direktori & aturan agen

## Struktur Monorepo
- `backend/` — Node.js + Express + TypeScript + Zod + Prisma 7 (ESM, PostgreSQL Supabase, Supabase Storage privat)
- `admin-web/` — React + TypeScript + Vite (Desain neo-brutalism)
- `mobile/` — Flutter + Dart + Riverpod + Dio (proyek `ebook_store`, Android)
- `docs/` — Dokumentasi proyek, desain sistem, API spec, metode SAW, pengujian, deployment, dan ADR
- `.agents/` — Aturan, skill, dan workflow agen

## Sumber Kebenaran
Lihat [`AGENTS.md`](./AGENTS.md) dan [`docs/docs-proyek-ebook-ecommerce.md`](./docs/docs-proyek-ebook-ecommerce.md).
