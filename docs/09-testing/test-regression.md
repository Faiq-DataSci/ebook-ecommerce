# Rencana Pengujian Regresi (`Regression Test Plan`)

**Status:** `[ADA]` (baseline fondasi 13 Nov 2026) | `[RENCANA]` (regresi otomatis CI/CD & suite bisnis penuh)  
**Referensi Utama:** [`test-results.md`](./test-results.md), [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml).

---

## 1. Tujuan & Lingkup Regresi

Memastikan setiap perubahan kode, refaktor, atau migrasi database tidak merusak fungsionalitas yang telah berjalan, baik pada setiap `git push` / Pull Request, sebelum rilis, maupun setelah migrasi skema.

---

## 2. Suite Regresi Fondasi (`[ADA]`) & Bisnis (`[RENCANA]`)

| ID | Test / Pemeriksaan | Komponen | Frekuensi | Status |
|---|---|---|---|---|
| **REG-01** | `npm --prefix backend run typecheck` | Backend | Setiap perubahan backend / PR | `[ADA]` |
| **REG-02** | `npm --prefix backend test` (5 tes fondasi) | Backend | Setiap perubahan backend / PR | `[ADA]` |
| **REG-03** | `npm --prefix backend run build` & `prisma:validate` | Backend | Setiap perubahan backend / schema | `[ADA]` |
| **REG-04** | `npm --prefix web/admin-web run lint` & `build` | Admin Web | Setiap perubahan `admin-web` | `[ADA]` |
| **REG-05** | `npm --prefix web/pengunjung-web run lint` & `build` | Pengunjung Web | Setiap perubahan `pengunjung-web` | `[ADA]` |
| **REG-06** | `flutter analyze` & `flutter test` | Mobile | Setiap perubahan `mobile/` | `[ADA]` |
| **REG-07** | Full Suite Bisnis (`TC-AUTH-*`, `CAT`, `ORD`, `PAY`, `ACC`, `SAW`, `SEC`) | Semua | Sebelum merge ke `main` & pra-rilis | `[RENCANA]` |

---

## 3. Matriks Dampak Perubahan (`Change Impact Matrix`)

| Jenis Perubahan | Test yang Wajib Dijalankan | Status |
|---|---|---|
| Ubah `backend/prisma/schema.prisma` | `prisma:validate`, seluruh `backend test`, `build` | `[ADA]` (validate) / `[RENCANA]` |
| Ubah `auth.middleware.ts` | `health.test.ts` + auth tests, `typecheck` | `[ADA]` (health/401) / `[RENCANA]` |
| Ubah `validate.ts` | `validate.test.ts`, `typecheck` | `[ADA]` |
| Ubah `app.ts` | `health.test.ts`, `typecheck`, `build` | `[ADA]` |
| Ubah `response.ts` | `validate.test.ts` (`sendSuccess`), `typecheck` | `[ADA]` |
| Ubah komponen `web/*` | `lint`, `build` | `[ADA]` |
| Ubah kode Flutter `mobile/` | `flutter analyze`, `flutter test` | `[ADA]` |

---

## 4. Regression Baseline (`[ADA]` — 13 November 2026)

Snapshot awal mengacu [`test-results.md`](./test-results.md): Backend (`typecheck`, `5` tes Vitest `0.64 s`, `build`, `prisma:validate` PASS), Admin Web (`lint` & `build` PASS), Pengunjung Web (`lint` & `build` PASS), dan Mobile (`flutter analyze` & `1` tes template PASS).
