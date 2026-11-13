# Technology Stack

**Status:** `[ADA]` (paket yang sudah terpasang di template) | `[ADA]` (stack terkunci di `AGENTS.md`) | `[RENCANA]` (paket backend & database)

---

## 1. Perbandingan Stack Aktual vs Stack Terkunci

| Lapisan | Teknologi Aktual di Repository | Status Aktual | Stack Terkunci / Target (`AGENTS.md`) |
|---|---|---|---|
| **Mobile (`mobile/ebook_store`)** | Dart SDK `^3.12.0`, Flutter, `cupertino_icons ^1.0.8`, `flutter_lints ^6.0.0` | `[ADA]` (template) | Flutter + Dart + **Riverpod** + **Dio** (`[RENCANA]`) |
| **Admin Web (`web/admin-web`)** | React `^19.3.1`, React DOM `^19.3.1`, Vite `^8.3.6`, ESLint `^10.14.0`, JavaScript (`.jsx`) | `[ADA]` (template) | React + **TypeScript** + Vite (Neo-brutalism) (`[RENCANA]`) |
| **Pengunjung Web (`web/pengunjung-web`)** | React `^19.3.1`, React DOM `^19.3.1`, Vite `^8.3.6`, ESLint `^10.14.0`, JavaScript (`.jsx`) | `[ADA]` (template) | Belum tercantum di `AGENTS.md` (`[RENCANA]`) |
| **Backend (`backend/`)** | `package.json` ESM (`"type": "module"`); `node_modules` & dependencies belum terpasang | `[RENCANA]` | Node.js + **Express** + **TypeScript** + **Zod** + **Prisma 7** (`[RENCANA]`) |
| **Database** | Belum ada skema maupun koneksi | `[RENCANA]` | **PostgreSQL Supabase** (`[RENCANA]`) |
| **Object Storage** | Belum ada integrasi | `[RENCANA]` | **Supabase Storage** bucket privat + Signed URL (`[RENCANA]`) |
| **SPK / Rekomendasi** | Belum diimplementasikan | `[RENCANA]` | Metode **Simple Additive Weighting (SAW)** di backend (`[RENCANA]`) |
| **Testing** | Flutter `flutter_test` (default); skrip `vitest run` tercantum di `backend/package.json` | `[ADA]` (minimal) | Vitest (backend), Flutter test (mobile) (`[RENCANA]`/`[RENCANA]`) |

---

## 2. Catatan Ketidaksesuaian yang Ditemukan

1. **`web/admin-web` masih `.jsx`:** `AGENTS.md` menetapkan React + TypeScript + Vite, tetapi template saat ini masih menggunakan JavaScript (`.jsx`) tanpa `tsconfig.json`.
2. **`mobile/ebook_store/pubspec.yaml` belum memiliki Riverpod & Dio:** Dependensi tersebut belum ditambahkan.
3. **`web/pengunjung-web` ada di repository tetapi belum didokumentasikan di `AGENTS.md`:** Perlu konfirmasi apakah proyek ini tetap dipertahankan atau diarsipkan.
4. **`backend/` belum memiliki `dependencies` di `package.json`:** Baru mendefinisikan `scripts` tanpa daftar paket terpasang.
