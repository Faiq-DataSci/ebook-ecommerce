# Prosedur Update & Upgrade (`Update Procedures`)

**Status:** `[ADA]` (perintah build, lint, typecheck, dan test lokal tersedia) | `[RENCANA]` (prosedur update & deployment produksi).  
**Referensi Utama:** [`AGENTS.md`](../../AGENTS.md), [`backend/package.json`](../../backend/package.json), [`web/admin-web/package.json`](../../web/admin-web/package.json), [`web/pengunjung-web/package.json`](../../web/pengunjung-web/package.json), [`mobile/ebook_store/pubspec.yaml`](../../mobile/ebook_store/pubspec.yaml), [`docs/05-deployment/deployment-checklist.md`](../05-deployment/deployment-checklist.md).

Sesuai aturan urutan pengembangan di [`AGENTS.md`](../../AGENTS.md), pembaruan sistem mengikuti urutan ketergantungan: **Database/Backend -> Admin Web -> Pengunjung Web & Mobile**.

---

## 1. Prosedur Update Backend (`backend/`)

1. Ambil kode terbaru: `git pull origin main` (`[ADA]` Git).
2. Pasang dependensi deterministik: `npm --prefix backend ci` (atau `npm --prefix backend install` di lokal) (`[ADA]`).
3. Generate Prisma Client: `npx --prefix backend prisma generate` (`[RENCANA]` bila DB/migrations aktif).
4. Jalankan migrasi produksi (setelah backup): `npx --prefix backend prisma migrate deploy` (`[RENCANA]`).
5. Jalankan typecheck: `npm --prefix backend run typecheck` (`[ADA]`).
6. Jalankan unit & integration tests: `npm --prefix backend test` (`[ADA]`).
7. Kompilasi TypeScript ke `dist/`: `npm --prefix backend run build` (`[ADA]`).
8. Restart layanan backend (`npm --prefix backend run start` / `node dist/server.js`) (`[RENCANA]`).
9. Verifikasi endpoint health check: `GET /api/v1/health` mengembalikan `200 OK` (`[ADA]`).

---

## 2. Prosedur Update Admin Web (`web/admin-web/`)

1. Ambil kode terbaru dari repository.
2. Pasang dependensi: `npm --prefix web/admin-web ci` (atau `install`).
3. Jalankan linter: `npm --prefix web/admin-web run lint` (`[ADA]`).
4. Jalankan typecheck & build statis (`tsc --noEmit` + `vite build`): `npm --prefix web/admin-web run build` (`[ADA]`).
5. Deploy isi folder `web/admin-web/dist/` ke layanan hosting statis/CDN (`[RENCANA]`).
6. Verifikasi halaman termuat dan terhubung ke backend tanpa error CORS atau console error (`[RENCANA]`).

---

## 3. Prosedur Update Pengunjung Web (`web/pengunjung-web/`)

1. Ambil kode terbaru dari repository.
2. Pasang dependensi: `npm --prefix web/pengunjung-web ci` (atau `install`).
3. Jalankan linter: `npm --prefix web/pengunjung-web run lint` (`[ADA]`).
4. Jalankan build statis (`vite build`): `npm --prefix web/pengunjung-web run build` (`[ADA]`).
5. Deploy isi folder `web/pengunjung-web/dist/` ke layanan hosting statis/CDN (`[RENCANA]`).
6. Verifikasi katalog publik, fallback SPA, dan koneksi API backend (`[RENCANA]`).

---

## 4. Prosedur Update Mobile (`mobile/ebook_store/`)

1. Ambil kode terbaru dari repository.
2. Masuk ke direktori mobile dan unduh paket: `cd mobile/ebook_store; flutter pub get` (`[ADA]`).
3. Jalankan analisis statis: `flutter analyze` (`[ADA]`).
4. Jalankan pengujian: `flutter test` (`[ADA]`).
5. Build artefak rilis Android: `flutter build appbundle` (untuk Play Store) atau `flutter build apk` (untuk pengujian internal) (`[RENCANA]`).
6. Lakukan penandatanganan rilis (*signing*) menggunakan keystore produksi di luar Git (`[RENCANA]`).
7. Unggah AAB ke Google Play Console dan pantau rollout (`[RENCANA]`).

---

## 5. Prosedur Update Database Schema (`[RENCANA]`)

1. **Backup Wajib:** Ambil backup database terlebih dahulu (lihat [`maintenance-backup-restore.md`](./maintenance-backup-restore.md)).
2. **Validasi Skema:** Jalankan `npm --prefix backend run prisma:validate` (`[ADA]`).
3. **Terapkan Migrasi:** Jalankan `npx --prefix backend prisma migrate deploy` via `DIRECT_URL` port `5432` (`[RENCANA]`).
4. **Sinkronisasi Client:** Jalankan `npx --prefix backend prisma generate` (`[RENCANA]`).
5. **Restart & Verifikasi:** Restart backend, verifikasi `GET /api/v1/health` (`[ADA]`), lalu jalankan regression test (`[RENCANA]`).

---

## 6. Prosedur Rollback per Komponen (`[RENCANA]`)

| Komponen | Prosedur Rollback | Status |
|---|---|---|
| **Backend (`backend/`)** | Deploy ulang rilis/artefak `dist/` versi stabil sebelumnya melalui fitur rollback platform hosting | `[RENCANA]` |
| **Web (`admin-web` & `pengunjung-web`)** | Aktifkan kembali deployment `dist/` versi stabil sebelumnya di CDN/hosting statis | `[RENCANA]` |
| **Mobile (`ebook_store`)** | Hentikan rollout di Play Console dan rilis versi stabil sebelumnya dengan `versionCode` lebih tinggi | `[RENCANA]` |
| **Database (`PostgreSQL Supabase`)** | Restore dari backup pra-migrasi atau tandai migrasi gagal dengan `npx prisma migrate resolve --rolled-back <nama>` | `[RENCANA]` |

---

## 7. Strategi Zero-Downtime Update (`[RENCANA]`)

> Implementasi akhir bergantung pada pilihan platform hosting di **Keputusan #10** (`keputusan-terbuka.md`).

- **Blue-Green Deployment (`[RENCANA]`):** Menyiapkan instance versi baru, memverifikasi `GET /api/v1/health`, lalu mengalihkan trafik sebelum mematikan instance lama.
- **Rolling Update (`[RENCANA]`):** Mengganti instance backend secara bertahap dengan graceful shutdown (`disconnectDatabase()`).
- **Dukungan Transaction Pooler (`[RENCANA]`):** Penggunaan `DATABASE_URL` via Supabase Transaction Pooler (port `6543`) membantu menjaga stabilitas manajemen koneksi saat instance backend melakukan restart cepat.
