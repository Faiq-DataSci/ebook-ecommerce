# Panduan Alur Kerja Git (`Git Workflow`)

**Status:** `[ADA]` (`CONTRIBUTING.md`, `CHANGELOG.md`, `.gitignore`) | `[RENCANA]` (CI/CD enforcement otomatis)  
**Referensi Utama:** [`CONTRIBUTING.md`](../../CONTRIBUTING.md), [`CHANGELOG.md`](../../CHANGELOG.md), [`.gitignore`](../../.gitignore), [`AGENTS.md`](../../AGENTS.md).

---

## 1. Aturan Branching

| Branch | Tujuan | Status |
|---|---|---|
| `main` | Kode stabil siap rilis / produksi | `[ADA]` |
| `develop` | Integrasi pengembangan aktif | `[RENCANA]` |
| `feat/<nama-fitur>` | Penambahan fitur baru | `[ADA]` (`CONTRIBUTING.md`) |
| `fix/<nama-perbaikan>` | Perbaikan bug | `[ADA]` (`CONTRIBUTING.md`) |
| `docs/<topik>` | Pembaruan dokumentasi | `[ADA]` (`CONTRIBUTING.md`) |
| `chore/<tugas>` | Konfigurasi, dependensi, pemeliharaan | `[ADA]` (`CONTRIBUTING.md`) |

---

## 2. Conventional Commits (`CONTRIBUTING.md`)

Format wajib: `<type>(<scope>): <description>`
- **Type:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `perf`.
- **Scope:** `backend`, `admin-web`, `pengunjung-web`, `mobile`, `docs`, `db`, `security`, `ebook`, `auth`, `order`, `payment`.
- **Contoh:** `feat(backend): tambah endpoint GET /api/v1/ebooks`.

---

## 3. Prosedur Pull Request & Pre-Commit Checks

1. Buat branch fitur/perbaikan baru.
2. Implementasikan perubahan secara bertahap (`AGENTS.md`: satu tahap per waktu).
3. Jalankan verifikasi di PowerShell:
   - `npm --prefix backend run typecheck`
   - `npm --prefix backend test`
   - `npm --prefix web/admin-web run lint; npm --prefix web/admin-web run build` (bila mengubah web)
   - `cd mobile\ebook_store; flutter analyze; flutter test` (bila mengubah mobile)
   - `git status` (pastikan tidak ada `.env`, secret, atau keystore `.jks`).
4. Lakukan staging selektif (`git add <file>`), hindari `git add .` secara membabi buta.
5. Perbarui `CHANGELOG.md` (format Keep a Changelog) dan status `[ADA]`/`[RENCANA]` di dokumen terkait.
6. Buat Pull Request dengan mengisi [`.github/pull_request_template.md`](../../.github/pull_request_template.md) beserta bukti output verifikasi nyata.

---

## 4. Checklist Code Review

| Item | Deskripsi | Status |
|---|---|---|
| Typecheck & Test | `typecheck`, `test`, `lint`, `build`, `analyze` sesuai modul PASS | `[ADA]` aturan |
| Kebersihan Secret | Tidak ada `.env`, kunci privat, atau token di diff | `[ADA]` (`.gitignore`) |
| Konvensi ESM | Import relatif di `backend/` memakai `.js` | `[ADA]` aturan |
| Kejujuran Status & Data | Status `[ADA]`/`[RENCANA]` akurat; data simulasi berlabel `"DATA SIMULASI"` | `[ADA]` aturan |
