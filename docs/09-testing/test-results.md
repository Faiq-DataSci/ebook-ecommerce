# Hasil Pengujian (`Test Results`)

**Status:** `[ADA]` — berisi hasil eksekusi nyata pada 13 November 2026.

**Lingkungan eksekusi:** Windows PowerShell 5.1, Node.js `v24.15.0`, npm `11.12.1`, Flutter `3.44.0` / Dart `3.12.0`.  
Validasi Prisma hanya memuat skema dan konfigurasi; tidak ada koneksi database.

---

## 1. Ringkasan Hasil (10 Pemeriksaan Aktual `[ADA]`)

| Komponen | Perintah | Hasil | Catatan |
|---|---|---|---|
| Backend typecheck | `npm run typecheck` | **PASS** | `tsc --noEmit`, tanpa error |
| Backend test | `npm run test` | **PASS** | 2 file, 5 tes lulus (Vitest 5.1.0, `0.64 s`) |
| Backend build | `npm run build` | **PASS** | `tsc` menghasilkan `dist/` (diabaikan Git) |
| Backend Prisma schema | `npm run prisma:validate` | **PASS** | `"The schema at prisma\schema.prisma is valid"` |
| Admin Web lint | `npm run lint` | **PASS** | ESLint tanpa temuan |
| Admin Web build | `npm run build` | **PASS** | `tsc --noEmit` + `vite build` |
| Pengunjung Web lint | `npm run lint` | **PASS** | ESLint tanpa temuan |
| Pengunjung Web build | `npm run build` | **PASS** | `vite build` |
| Mobile analyze | `flutter analyze` | **PASS** | `"No issues found!"` setelah Windows Developer Mode diaktifkan |
| Mobile test | `flutter test` | **PASS** | 1 tes template lulus |

---

## 2. Detail 5 Tes Backend yang Lulus (`[ADA]`)

| No | Nama Tes | File Sumber | Tipe Test | Hasil |
|---|---|---|---|---|
| 1 | `GET /api/v1/health returns 200 OK` | `backend/tests/health.test.ts` | Integration (Supertest) | **PASS** |
| 2 | `GET /api/v1/admin/ping without token returns 401 Unauthorized` | `backend/tests/health.test.ts` | Integration (Supertest) | **PASS** |
| 3 | `validate middleware meneruskan ke next() dan mem-parsing body valid` | `backend/tests/unit/validate.test.ts` | Unit | **PASS** |
| 4 | `validate middleware meneruskan ZodError ke next(err) saat body tidak valid` | `backend/tests/unit/validate.test.ts` | Unit | **PASS** |
| 5 | `sendSuccess helper mengirim format respons sukses standar` | `backend/tests/unit/validate.test.ts` | Unit | **PASS** |

---

## 3. Cakupan Pengujian Aktual

- **Backend:** 2 file, 5 tes fondasi. Belum ada tes untuk katalog, pesanan, pembayaran, akses e-book, maupun perhitungan SAW.
- **Admin Web & Pengunjung Web:** Belum ada tes otomatis; validasi baru sebatas lint dan build.
- **Mobile:** Hanya `test/widget_test.dart` bawaan template (*counter app*).

---

## 4. Temuan dan Tindak Lanjut

1. **Tes fitur bisnis belum tersedia** (`[RENCANA]`; lihat [`test-cases.md`](./test-cases.md) dan [`test-saw.md`](./test-saw.md)).
2. **Migrasi Prisma belum dibuat** (`backend/prisma/migrations/` belum ada).
3. **Lint backend belum tersedia** (`backend/` belum memiliki ESLint).
4. **Admin Web dan Pengunjung Web belum memiliki tes otomatis**.

---

## 5. Perintah Reproduksi (Dokumentasi PowerShell)

```powershell
# Backend
cd backend
npm run typecheck
npm run test
npm run build
npm run prisma:validate

# Web
cd web/admin-web; npm run lint; npm run build
cd web/pengunjung-web; npm run lint; npm run build

# Mobile (pastikan Windows Developer Mode aktif untuk flutter analyze)
cd mobile/ebook_store; flutter analyze; flutter test
```
