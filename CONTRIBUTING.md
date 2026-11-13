# Panduan Kontribusi (Contributing Guidelines)

Terima kasih telah berkontribusi pada pengembangan **Sistem Informasi E-Commerce E-Book**.

---

## 1. Prasyarat
- Node.js & npm (teruji dengan Node `v24.15.0` / npm `11.12.1`)
- Flutter SDK (Dart `^3.12.0`) untuk pengembangan `mobile/ebook_store`
- Git

---

## 2. Setup Repository Lokal
1. Salin file `.env.example` menjadi `.env` pada `backend/`, `web/admin-web/`, dan `web/pengunjung-web/`.
2. Pasang dependensi pada masing-masing workspace:
   - `npm --prefix backend install`
   - `npm --prefix web/admin-web install`
   - `npm --prefix web/pengunjung-web install`
   - `flutter pub get` di `mobile/ebook_store/`
3. Jangan melakukan commit terhadap file `.env` atau kredensial apa pun.

---

## 3. Penamaan Branch
Gunakan penamaan branch yang jelas dan deskriptif:
- `feat/<nama-fitur>` — penambahan fitur baru
- `fix/<nama-perbaikan>` — perbaikan bug
- `docs/<topik>` — pembaruan dokumentasi
- `chore/<tugas>` — konfigurasi, dependensi, atau pemeliharaan

---

## 4. Konvensi Commit (Conventional Commits)
Gunakan format:

```text
<type>(<scope>): <description>
```

Contoh:
```text
feat(ebook): add ebook catalog endpoint
fix(auth): handle expired Supabase access token
docs(readme): update setup and testing instructions
test(order): add order validation unit tests
refactor(payment): simplify payment verification helper
```

---

## 5. Standar Kode
- **Backend (`backend/`):**
  - Menggunakan TypeScript ESM (`"type": "module"`): seluruh import relatif wajib memakai ekstensi `.js`.
  - Validasi input HTTP wajib menggunakan **Zod** (`src/middleware/validate.ts`).
  - Ikuti aturan pada [`AGENTS.md`](./AGENTS.md).
- **Web (`web/admin-web/`, `web/pengunjung-web/`):**
  - Pastikan lolos `npm run lint` dan `npm run build` sebelum PR.
- **Mobile (`mobile/ebook_store/`):**
  - Gunakan Riverpod, Dio, dan tangani state `loading`, `empty`, dan `error`.

---

## 6. Persyaratan Pengujian
Sebelum melakukan commit atau membuka Pull Request:
- Jalankan `npm --prefix backend run typecheck` dan `npm --prefix backend test`.
- Jalankan `npm --prefix web/admin-web run lint` dan `npm --prefix web/admin-web run build` bila mengubah Admin Web.
- Jalankan `flutter test` di `mobile/ebook_store/` bila mengubah aplikasi mobile.
- Jangan mengklaim pengujian lulus jika perintah tidak benar-benar dijalankan.

---

## 7. Prosedur Pull Request & Code Review
1. Lakukan staging selektif (`git add <file>`), hindari `git add .` secara membabi buta.
2. Isi checklist pada [`.github/pull_request_template.md`](./.github/pull_request_template.md) beserta bukti hasil verifikasi nyata.
3. Pastikan tidak ada secret, token, atau dokumen internal yang ikut masuk ke diff.

---

## 8. Pembaruan Dokumentasi
Setiap perubahan yang memengaruhi:
- Skema database → perbarui dokumentasi di `docs/04-database/`.
- Endpoint API → perbarui `docs/05-api/` dan `docs/02-api/api-spec.yaml`.
- Variabel environment → perbarui `.env.example` dan `docs/08-development/environment-configuration.md`.
- Status implementasi fitur (`[ADA]` / `[RENCANA]`) → perbarui [`docs/docs-proyek-ebook-ecommerce.md`](./docs/docs-proyek-ebook-ecommerce.md).
