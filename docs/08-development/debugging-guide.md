# Panduan Debugging Sehari-hari (`Debugging Guide`)

**Status:** `[ADA]` (aturan teknis & temuan lingkungan) | `[RENCANA]` (panduan debugging operasional produksi)  
**Referensi Utama:** [`docs/10-maintenance/troubleshooting.md`](../10-maintenance/troubleshooting.md), [`AGENTS.md`](../../AGENTS.md), [`docs/09-testing/test-results.md`](../09-testing/test-results.md).

---

## 1. Masalah Pengembangan yang Diketahui (`troubleshooting.md` & `test-results.md`)

| # | Gejala / Masalah | Penyebab Umum | Solusi (PowerShell) | Status |
|---|---|---|---|---|
| 1 | Error import module ESM di `backend/` | Import relatif `.ts` tanpa ekstensi `.js` saat `"type": "module"` aktif | Tambahkan ekstensi `.js` pada seluruh import relatif | `[ADA]` |
| 2 | Versi Prisma tidak sesuai saat install | Tag `latest` npm mengarah ke versi RC | Jalankan `npm view prisma dist-tags` sebelum install | `[ADA]` |
| 3 | Migrasi Prisma menggantung di Supabase | Memakai transaction pooler port `6543` untuk CLI | Gunakan `DIRECT_URL` (port `5432`) di `prisma.config.ts` | `[RENCANA]` |
| 4 | Emulator Android gagal akses backend lokal | Memakai `localhost` / `127.0.0.1` di Flutter | Gunakan `10.0.2.2` (emulator) atau IP LAN (perangkat fisik) | `[ADA]` |
| 5 | Gagal buka PDF dari signed URL | Signed URL kedaluwarsa (>300s) atau tidak ada `EbookAccess` | Minta ulang signed URL setelah `Order.PAID` | `[RENCANA]` |
| 6 | `flutter analyze` gagal di Windows | Windows Developer Mode belum aktif | Aktifkan Windows Developer Mode di Settings | `[ADA]` |

---

## 2. Masalah Harian Tambahan

| # | Gejala | Penyebab | Solusi | Status |
|---|---|---|---|---|
| 7 | `npm run typecheck` gagal | Error tipe TypeScript (`strict: true`, `noUncheckedIndexedAccess`) | Periksa null/undefined check dan tipe Zod | `[ADA]` |
| 8 | `npm test` gagal | Kegagalan assertion atau import path | Periksa output Vitest & ekstensi `.js` | `[ADA]` |
| 9 | `npm run build` gagal | Error kompilasi `tsc` | Jalankan `npm --prefix backend run typecheck` dan perbaiki | `[ADA]` |
| 10 | ESLint error di `web/*` | Aturan lint dilanggar | Jalankan `npm --prefix web/admin-web run lint -- --fix` | `[ADA]` |
| 11 | Vitest tidak menemukan file test | File tidak berada di `tests/**/*.test.ts` | Pastikan pola penamaan `*.test.ts` di folder `tests/` | `[ADA]` |
| 12 | Error CORS di browser | Origin belum terdaftar di `CORS_ORIGINS` | Perbarui `CORS_ORIGINS` di `backend/.env` | `[ADA]` |
| 13 | Port `3000` sudah terpakai | Proses Node.js sebelumnya masih berjalan | Cek & hentikan proses atau ubah `PORT` di `.env` | `[ADA]` |
| 14 | Prisma Client belum ditemukan | Belum menjalankan `prisma generate` | Jalankan `npx --prefix backend prisma generate` | `[RENCANA]` |
| 15 | `.env` tidak terbaca | Entry point tidak memuat `dotenv/config` | Pastikan `import 'dotenv/config'` di `env.ts` (`[ADA]`) | `[ADA]` |

---

## 3. Tips Debugging PowerShell, ESM, & Prisma

- **Cek port & hentikan proses:** `Get-NetTCPConnection -LocalPort 3000` lalu `Stop-Process -Id <PID>`.
- **Cek versi environment:** `node -v; npm -v; flutter --version`.
- **Debugging ESM:** Pastikan `"type": "module"` di `backend/package.json`, pakai `import` (bukan `require`), dan selalu beri `.js` di import relatif.
- **Debugging Prisma:** Jalankan `npm --prefix backend run prisma:validate`, `npx prisma migrate status`, atau `npx prisma studio`.
