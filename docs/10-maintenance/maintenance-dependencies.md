# Manajemen Dependensi (`Dependency Management`)

**Status:** `[RENCANA]` — Prosedur audit dan pembaruan dependensi berkala (inventaris versi aktual berasal dari file manifest yang sudah `[ADA]`).  
**Referensi Utama:** [`backend/package.json`](../../backend/package.json), [`web/admin-web/package.json`](../../web/admin-web/package.json), [`web/pengunjung-web/package.json`](../../web/pengunjung-web/package.json), [`mobile/ebook_store/pubspec.yaml`](../../mobile/ebook_store/pubspec.yaml), [`AGENTS.md`](../../AGENTS.md).

---

## 1. Tujuan

Menjaga seluruh pustaka pada `backend/`, `web/admin-web/`, `web/pengunjung-web/`, dan `mobile/ebook_store/` tetap aman dari kerentanan (CVE), kompatibel dengan arsitektur proyek, serta terhindar dari pembaruan *breaking* yang tidak teruji.

---

## 2. Perintah Audit Dependensi (`[RENCANA]`)

| Komponen | Perintah Audit | Tujuan | Frekuensi | Status |
|---|---|---|---|---|
| **Backend (`backend/`)** | `npm --prefix backend audit` | Memeriksa kerentanan keamanan paket Node.js | Mingguan / Pra-Rilis | `[RENCANA]` |
| **Admin Web (`web/admin-web/`)** | `npm --prefix web/admin-web audit` | Memeriksa kerentanan paket React/Vite/ESLint | Mingguan / Pra-Rilis | `[RENCANA]` |
| **Pengunjung Web (`web/pengunjung-web/`)** | `npm --prefix web/pengunjung-web audit` | Memeriksa kerentanan paket React/Vite/ESLint | Mingguan / Pra-Rilis | `[RENCANA]` |
| **Mobile (`mobile/ebook_store/`)** | `flutter pub outdated` (di `mobile/ebook_store/`) | Memeriksa paket Dart/Flutter yang kedaluwarsa | Mingguan / Pra-Rilis | `[RENCANA]` |

---

## 3. Perintah Pembaruan Dependensi (`[RENCANA]`)

| Komponen | Perintah | Tingkat Risiko | Status |
|---|---|---|---|
| **Backend & Web (npm)** | `npm update` | Rendah–Sedang (update minor/patch sesuai semver) | `[RENCANA]` |
| **Backend & Web (npm)** | `npm audit fix` | Rendah–Sedang (patch kerentanan kompatibel) | `[RENCANA]` |
| **Backend & Web (npm)** | `npm audit fix --force` | **Tinggi** (dapat memicu *breaking changes* mayor — wajib review manual) | `[RENCANA]` |
| **Mobile (Flutter)** | `flutter pub upgrade` | Rendah–Sedang (update minor/patch kompatibel `pubspec.yaml`) | `[RENCANA]` |
| **Mobile (Flutter)** | `flutter pub upgrade --major-versions` | **Tinggi** (berpotensi *breaking changes* — wajib uji menyeluruh) | `[RENCANA]` |

---

## 4. Aturan Khusus Prisma 7 (`[ADA]` pada `AGENTS.md`)

1. Sebelum memasang atau memperbarui paket `prisma` / `@prisma/client` / `@prisma/adapter-pg`, wajib menjalankan:
   ```powershell
   npm view prisma dist-tags
   ```
2. Pastikan versi yang dipilih adalah rilis stabil (hindari versi RC yang kadang bertag `latest`).
3. Prisma 7 menggunakan [`backend/prisma.config.ts`](../../backend/prisma.config.ts) dan adapter `@prisma/adapter-pg` + `pg` pada [`backend/src/config/prisma.ts`](../../backend/src/config/prisma.ts) (`[ADA]`).

---

## 5. Dependabot & Otomasi Pembaruan (`[RENCANA]`)

- Aktifkan **Dependabot alerts** pada pengaturan keamanan repository GitHub (`[RENCANA]`).
- Tambahkan `.github/dependabot.yml` untuk membuat Pull Request pembaruan dependensi otomatis per ekosistem (`npm` dan `pub`) (`[RENCANA]`).
- Setiap PR dari Dependabot wajib ditinjau changelog-nya dan lolos seluruh pemeriksaan sebelum di-merge (`[RENCANA]`).

---

## 6. Inventaris Dependensi Kunci (`[ADA]` di Manifest)

| Paket | Versi Terkunci di Manifest | Komponen | Kritis? | Catatan | Status |
|---|---|---|---|---|---|
| `express` | `^5.3.0` | `backend/` | Ya | Express 5 ESM | `[ADA]` |
| `typescript` | `^7.0.2` (backend) / `^6.0.3` (admin-web) | `backend/`, `admin-web/` | Ya | `pengunjung-web` masih `.jsx` tanpa TS | `[ADA]` |
| `zod` | `^4.6.7` | `backend/` | Ya | Validasi env & request HTTP | `[ADA]` |
| `prisma` / `@prisma/client` / `@prisma/adapter-pg` | `^7.10.1` / `^7.10.0` | `backend/` | Ya | Cek `dist-tags` sebelum upgrade | `[ADA]` |
| `vitest` / `supertest` | `^5.1.0` / `^7.3.2` | `backend/` | Ya | Runner unit & integration test | `[ADA]` |
| `react` / `vite` | `^19.3.1` / `^8.3.6` | `web/admin-web/`, `web/pengunjung-web/` | Ya | UI web & bundler statis | `[ADA]` |
| Dart SDK | `^3.12.0` | `mobile/ebook_store/` | Ya | Teruji dengan Flutter `3.44.0` | `[ADA]` |
| `flutter_riverpod` | `^2.6.1` | `mobile/ebook_store/` | Ya | State management wajib (`mobile/AGENTS.md`) | `[ADA]` |
| `dio` | `^5.8.0+1` | `mobile/ebook_store/` | Ya | HTTP client wajib (`mobile/AGENTS.md`) | `[ADA]` |

---

## 7. Prosedur Standar Update Dependensi (`[RENCANA]`)

1. Jalankan perintah audit (`npm audit` / `flutter pub outdated`) untuk mengidentifikasi paket rentan atau usang.
2. Periksa *changelog* / *release notes* paket target untuk mengantisipasi *breaking changes*.
3. Buat branch baru (`chore/update-<nama-paket>`) sesuai [`CONTRIBUTING.md`](../../CONTRIBUTING.md).
4. Lakukan pembaruan paket dan jalankan ulang seluruh pemeriksaan komponen terkait:
   - Backend: `typecheck`, `test`, `build`, `prisma:validate` (`[ADA]` skrip).
   - Web: `lint`, `build` (`[ADA]` skrip).
   - Mobile: `flutter analyze`, `flutter test` (`[ADA]` perintah).
5. Jika seluruh pemeriksaan lulus, lakukan review dan merge ke branch utama.
6. Jika terdapat *breaking changes*, sesuaikan kode secara terukur lalu ulangi seluruh pengujian.
