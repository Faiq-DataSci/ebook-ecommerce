# Hasil Pengujian Aktual (`Test Results`)

> **Status Dokumen:** `[ADA]` — Berisi ringkasan hasil eksekusi pengujian aktual yang tercatat pada [`docs/09-testing/test-results.md`](../09-testing/test-results.md) dan diverifikasi dari file tes di repositori.
> **Prinsip Kejujuran:** Dokumen ini hanya mencatat pengujian yang benar-benar telah dijalankan. Seluruh tes fitur bisnis, SAW, keamanan penuh, dan integrasi payment gateway masih berstatus `[RENCANA]`.

---

## 1. Lingkungan Eksekusi Aktual (`[ADA]`)

- **Sistem Operasi & Shell:** Windows PowerShell 5.1
- **Runtime Node.js:** `v24.15.0` (npm `11.12.1`)
- **Framework Backend Test:** Vitest `^5.1.0` + Supertest `^7.3.2`
- **Flutter / Dart SDK:** Flutter `3.44.0` / Dart `3.12.0`

---

## 2. Tabel Ringkasan Hasil Aktual (`docs/09-testing/test-results.md`)

| Komponen | Perintah | Hasil | Catatan |
| :--- | :--- | :--- | :--- |
| **Backend (`backend/`)** | `npm --prefix backend run typecheck` | **PASS** `[ADA]` | `tsc --noEmit` keluar dengan kode `0` |
| **Backend (`backend/`)** | `npm --prefix backend test` | **PASS** `[ADA]` | 2 file tes (`health.test.ts`, `unit/validate.test.ts`), **5 tes lulus** (`0.64 s`) |
| **Backend (`backend/`)** | `npm --prefix backend run build` | **PASS** `[ADA]` | Kompilasi `tsc` sukses |
| **Backend (`backend/`)** | `npm --prefix backend run prisma:validate` | **PASS** `[ADA]` | `schema.prisma` valid (belum ada migrasi DB) |
| **Admin Web (`web/admin-web/`)** | `npm --prefix web/admin-web run lint` & `build` | **PASS** `[ADA]` | Lint ESLint & Vite build sukses; belum ada tes otomatis UI |
| **Pengunjung Web (`web/pengunjung-web/`)** | `npm --prefix web/pengunjung-web run lint` & `build` | **PASS** `[ADA]` | Lint ESLint & Vite build sukses; belum ada tes otomatis UI |
| **Mobile (`mobile/ebook_store/`)** | `flutter analyze` | **PASS** `[ADA]` | Tidak ada error analisis statis |
| **Mobile (`mobile/ebook_store/`)** | `flutter test` | **PASS** `[ADA]` | 1 tes template bawaan (`widget_test.dart`) lulus; belum ada tes fitur bisnis |

---

## 3. Daftar 5 Tes Backend Aktual yang Lulus (`[ADA]`)

Berdasarkan [`backend/tests/health.test.ts`](../../backend/tests/health.test.ts) dan [`backend/tests/unit/validate.test.ts`](../../backend/tests/unit/validate.test.ts):
1. `GET /api/v1/health returns 200 OK` — [`backend/tests/health.test.ts`](../../backend/tests/health.test.ts)
2. `GET /api/v1/admin/ping without token returns 401 Unauthorized` — [`backend/tests/health.test.ts`](../../backend/tests/health.test.ts)
3. `validate middleware meneruskan ke next() dan mem-parsing body valid` — [`backend/tests/unit/validate.test.ts`](../../backend/tests/unit/validate.test.ts)
4. `validate middleware meneruskan ZodError ke next(err) saat body tidak valid` — [`backend/tests/unit/validate.test.ts`](../../backend/tests/unit/validate.test.ts)
5. `sendSuccess helper mengirim format respons sukses standar` — [`backend/tests/unit/validate.test.ts`](../../backend/tests/unit/validate.test.ts)

---

## 4. Cakupan Aktual & Temuan Tindak Lanjut

- **Cakupan Aktual:** Pengujian otomatis saat ini baru mencakup fondasi backend (health, penolakan 401 tanpa token, middleware Zod `validate`, helper `sendSuccess`), pemeriksaan statis/build web, serta 1 widget test template mobile. **Belum ada tes untuk katalog, pesanan, pembayaran/webhook, `EbookAccess`/signed URL, maupun SPK SAW.**
- **Temuan & Tindak Lanjut:**
  1. Tes fitur bisnis (`TC-AUTH-*`, `TC-CAT-*`, `TC-ORD-*`, `TC-PAY-*`, `TC-ACC-*`, `TC-ADM-*`, `TC-SAW-*`) belum tersedia (`[RENCANA]`).
  2. Migrasi Prisma (`backend/prisma/migrations/`) belum dibuat (`[RENCANA]`).
  3. Skrip lint backend belum tersedia di `backend/package.json` (`[RENCANA]`).
  4. `admin-web` dan `pengunjung-web` belum memiliki framework/suite tes otomatis komponen UI (`[RENCANA]`).
  5. `health.test.ts` masih memeriksa `error.code === 'UNAUTHORIZED'`, perlu diselaraskan dengan `'UNAUTHENTICATED'` pada [`error-catalog.md`](../02-api/error-catalog.md) saat pembaruan middleware.

---

## 5. Perintah Reproduksi (Dokumentasi Referensi)

```powershell
npm --prefix backend run typecheck
npm --prefix backend test
npm --prefix backend run build
npm --prefix backend run prisma:validate
npm --prefix web/admin-web run lint
npm --prefix web/admin-web run build
npm --prefix web/pengunjung-web run lint
npm --prefix web/pengunjung-web run build
```
*(Untuk `mobile/ebook_store/`: `flutter analyze` dan `flutter test`.)*
