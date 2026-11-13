# Technology Stack

**Status:** `[IMPLEMENTED]` (paket yang sudah terpasang di template) | `[CONFIRMED]` (stack terkunci di `AGENTS.md`) | `[NOT AVAILABLE]` (paket backend & database)

---

## 1. Perbandingan Stack Aktual vs Stack Terkunci

| Lapisan | Teknologi Aktual di Repository | Status Aktual | Stack Terkunci / Target (`AGENTS.md`) |
|---|---|---|---|
| **Mobile (`mobile/ebook_store`)** | Dart SDK `^3.12.0`, Flutter, `cupertino_icons ^1.0.8`, `flutter_lints ^6.0.0` | `[IMPLEMENTED]` (template) | Flutter + Dart + **Riverpod** + **Dio** (`[CONFIRMED]`) |
| **Admin Web (`web/admin-web`)** | React `^19.3.1`, React DOM `^19.3.1`, Vite `^8.3.6`, ESLint `^10.14.0`, JavaScript (`.jsx`) | `[IMPLEMENTED]` (template) | React + **TypeScript** + Vite (Neo-brutalism) (`[CONFIRMED]`) |
| **Pengunjung Web (`web/pengunjung-web`)** | React `^19.3.1`, React DOM `^19.3.1`, Vite `^8.3.6`, ESLint `^10.14.0`, JavaScript (`.jsx`) | `[IMPLEMENTED]` (template) | Belum tercantum di `AGENTS.md` (`[ASSUMPTION]`) |
| **Backend (`backend/`)** | `package.json` ESM (`"type": "module"`); `node_modules` & dependencies belum terpasang | `[NOT AVAILABLE]` | Node.js + **Express** + **TypeScript** + **Zod** + **Prisma 7** (`[CONFIRMED]`) |
| **Database** | Belum ada skema maupun koneksi | `[NOT AVAILABLE]` | **PostgreSQL Supabase** (`[CONFIRMED]`) |
| **Object Storage** | Belum ada integrasi | `[NOT AVAILABLE]` | **Supabase Storage** bucket privat + Signed URL (`[CONFIRMED]`) |
| **SPK / Rekomendasi** | Belum diimplementasikan | `[NOT AVAILABLE]` | Metode **Simple Additive Weighting (SAW)** di backend (`[CONFIRMED]`) |
| **Testing** | Flutter `flutter_test` (default); skrip `vitest run` tercantum di `backend/package.json` | `[IMPLEMENTED]` (minimal) | Vitest (backend), Flutter test (mobile) (`[CONFIRMED]`/`[PROPOSED]`) |

---

## 2. Catatan Ketidaksesuaian yang Ditemukan

1. **`web/admin-web` masih `.jsx`:** `AGENTS.md` menetapkan React + TypeScript + Vite, tetapi template saat ini masih menggunakan JavaScript (`.jsx`) tanpa `tsconfig.json`.
2. **`mobile/ebook_store/pubspec.yaml` belum memiliki Riverpod & Dio:** Dependensi tersebut belum ditambahkan.
3. **`web/pengunjung-web` ada di repository tetapi belum didokumentasikan di `AGENTS.md`:** Perlu konfirmasi apakah proyek ini tetap dipertahankan atau diarsipkan.
4. **`backend/` belum memiliki `dependencies` di `package.json`:** Baru mendefinisikan `scripts` tanpa daftar paket terpasang.
