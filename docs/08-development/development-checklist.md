# Checklist Pengembangan (`Development Checklist & Definition of Done`)

**Status:** `[ADA]` (aturan `AGENTS.md` & `CONTRIBUTING.md`) | `[RENCANA]` (enforcement otomatis via CI/CD)

---

## 1. Definition of Done (`DoD`)

| ID | Kategori | Item | Cara Verifikasi | Status |
|---|---|---|---|---|
| **DOD-01** | Kode | Fitur terimplementasi nyata (bukan endpoint palsu atau tombol tanpa aksi) | Inspeksi handler & alur end-to-end | `[ADA]` aturan |
| **DOD-02** | Kode | Otorisasi & validasi input berjalan di backend | Uji `401`/`403` dan validasi Zod | `[ADA]` aturan |
| **DOD-03** | Kode | Pengujian otomatis dijalankan dan lulus | Output nyata perintah test | `[ADA]` aturan |
| **DOD-04** | Backend | `typecheck`, `test`, & `build` PASS | `npm --prefix backend run typecheck`, `test`, `build` | `[ADA]` skrip |
| **DOD-05** | Backend | Seluruh import relatif `.ts` memakai `.js` & bebas `console.log` sensitif | `tsc --noEmit` & review diff | `[ADA]` aturan |
| **DOD-06** | Web | `lint` & `build` PASS; tanpa secret di `VITE_*` | `npm run lint`, `npm run build`, grep `VITE_` | `[ADA]` skrip |
| **DOD-07** | Mobile | `flutter analyze` & `flutter test` PASS; tanpa secret di kode Dart | `flutter analyze`, `flutter test`, review diff | `[ADA]` skrip |
| **DOD-08** | Dokumentasi | Status `[ADA]`/`[RENCANA]` diperbarui; data simulasi berlabel `"DATA SIMULASI"` | Review dokumen & UI | `[ADA]` aturan |
| **DOD-09** | Keamanan | Tidak ada `.env` di `git status` & `storagePath` tidak bocor di respons | `git status` & inspeksi DTO | `[ADA]` aturan |

---

## 2. Pre-Push Checklist (PowerShell)

| ID | Item | Perintah | Status |
|---|---|---|---|
| **PP-01** | Tidak ada `.env` / keystore di staging Git | `git status` | `[ADA]` |
| **PP-02** | Backend typecheck, test, build, & schema valid | `npm --prefix backend run typecheck; npm --prefix backend test; npm --prefix backend run build; npm --prefix backend run prisma:validate` | `[ADA]` |
| **PP-03** | Web lint & build lulus | `npm --prefix web/admin-web run lint; npm --prefix web/admin-web run build` | `[ADA]` |
| **PP-04** | Mobile analyze & test lulus | `cd mobile\ebook_store; flutter analyze; flutter test` | `[ADA]` |
| **PP-05** | `CHANGELOG.md` diperbarui untuk perubahan signifikan | Inspeksi `CHANGELOG.md` | `[ADA]` |

---

## 3. Pre-Merge Checklist (`[RENCANA]` CI Enforcement)

- [ ] Code review oleh minimal 1 reviewer selesai.
- [ ] Seluruh check CI lulus.
- [ ] Tidak ada konflik merge terhadap branch target.
- [ ] Dokumentasi terkait (`docs/`) sudah diselaraskan.
