# ADR-0003: Urutan Pengembangan Backend -> Admin Web -> Mobile

## Status
Diterima

- **Status Keputusan:** Diterima
- **Status Implementasi:** `[ADA]` (urutan kerja terkunci di `AGENTS.md` & Fase 0 fondasi) | `[RENCANA]` (penyelesaian Fase 1–4)
- **Tanggal Keputusan:** 2026-11-14 *(diperluas dari keputusan awal fondasi proyek)*
- **Tanggal Pembaruan:** 2026-11-14
- **Pemutus:** Tim Proyek
- **Pengganti:** Tidak ada

## Konteks
Aplikasi mobile (`mobile/ebook_store`) membutuhkan data katalog nyata, autentikasi Supabase Auth yang sinkron, serta endpoint rekomendasi SAW yang sudah teruji dari backend. Membangun antarmuka mobile secara penuh sebelum backend dan alat input data admin (`web/admin-web`) tersedia berisiko memunculkan ketergantungan pada data palsu (*hardcoded mock*) dan pekerjaan integrasi ulang akibat perubahan kontrak API.

### Faktor yang Mempengaruhi
- Ketergantungan data nyata dari database dan storage privat sebelum UI pelanggan dibangun.
- Risiko *rework* integrasi jika skema API belum stabil saat pengembangan UI.
- Efisiensi pembagian kerja tim beranggotakan 3 orang.

### Stakeholder
- **Tim Pengembang (3 Orang):** Memerlukan alur kerja bertahap dengan titik verifikasi (*gate*) yang jelas antar fase.
- **Dosen Pembimbing:** Memastikan progres tiap lapisan dapat diuji secara bertahap dan terukur.

## Alternatif yang Dipertimbangkan

### Alternatif 1: Berurutan `Backend -> Admin Web -> Mobile`
- **Deskripsi:** Menyelesaikan dan menguji backend API terlebih dahulu, diikuti Admin Web untuk pengelolaan data nyata, lalu aplikasi Mobile dan Pengunjung Web.
- **Kelebihan:** Kontrak API stabil lebih awal, Admin Web langsung menjadi alat pengisi katalog nyata ke database, dan aplikasi mobile langsung mengonsumsi API yang siap pakai.
- **Kekurangan:** Pembangunan antarmuka mobile dimulai pada fase lebih akhir.
- **Status:** Dipilih

### Alternatif 2: Pengembangan Paralel Penuh Sejak Hari Pertama
- **Deskripsi:** Backend, Admin Web, dan Mobile dikembangkan bersamaan tanpa menunggu kontrak API stabil.
- **Kelebihan:** Antarmuka terlihat lebih cepat di awal.
- **Kekurangan:** Risiko tinggi ketidaksesuaian DTO, duplikasi data dummy, dan biaya *rework* saat integrasi.
- **Status:** Ditolak

### Alternatif 3: *Mobile-First* (UI Mobile Sebelum Backend)
- **Deskripsi:** Membangun seluruh layar Flutter dengan data statis terlebih dahulu baru membuat backend.
- **Kelebihan:** Demo visual mobile cepat terlihat.
- **Kekurangan:** Rentan memakai data palsu tanpa alur pembayaran/storage nyata dan menyulitkan pengujian konektivitas sejak dini.
- **Status:** Ditolak

## Keputusan
Urutan pengerjaan proyek dikunci menjadi: **`Backend -> Admin Web -> Mobile`**, dengan kewajiban uji konektivitas (health check / auth / endpoint dasar) sebelum membangun antarmuka penuh pada setiap lapisan.

### Alasan
1. Menstabilkan kontrak API, validasi Zod, dan skema database sebelum dikonsumsi oleh klien.
2. Memungkinkan Admin Web menginput data katalog dan PDF nyata sehingga aplikasi mobile tidak bergantung pada data palsu.

## Konsekuensi

### Positif
- Risiko integrasi ulang berkurang drastis karena endpoint diuji lewat Vitest/Supertest sebelum fase frontend.
- Admin Web langsung berfungsi sebagai penyedia data operasional bagi klien pelanggan.
- Setiap fase memiliki kriteria keluar (*exit gate*) yang objektif.

### Negatif
- Pengujian visual aplikasi mobile tertunda hingga Fase 1 dan Fase 2 mencapai kestabilan dasar.

### Netral
- Pengembangan `web/pengunjung-web` berjalan selaras pada fase klien pelanggan bersama `mobile/ebook_store`.

## Dampak Teknis

### Arsitektur
- Penataan tahapan proyek menjadi Fase 0–4 pada [`project-plan.md`](../00-project/project-plan.md).

### Database
- Skema Prisma disiapkan pada Fase 0 (`[ADA]` di `schema.prisma`) dan dimigrasi pada Fase 1 (`[RENCANA]`) sebelum fase UI.

### API
- Kontrak endpoint REST (`/api/v1/*`) distabilkan dan diuji pada Fase 1 sebelum dikonsumsi Admin Web (Fase 2) dan Mobile/Pengunjung Web (Fase 3).

### Keamanan
- Middleware autentikasi, RBAC, validasi Zod, dan proteksi storage disiapkan di backend terlebih dahulu sebelum UI admin/pelanggan dibangun.

### Pengujian
- Setiap fase wajib lolos *quality gate* masing-masing: `typecheck`, `test`, `build` (Backend), `lint` & `build` (Web), serta `flutter analyze` & `flutter test` (Mobile).

### Deployment
- Urutan rilis produksi mengikuti ketergantungan yang sama: Database/Backend terlebih dahulu, diikuti Web, lalu rilis Mobile Android.

## Referensi Silang
- **Kebutuhan:** `NFR-08` pada [`requirements.md`](../00-project/requirements.md)
- **Dokumen Arsitektur:** [`project-plan.md`](../00-project/project-plan.md) (Fase 0–4, Milestone M1–M6), [`architecture-decisions-summary.md`](../02-architecture/architecture-decisions-summary.md)
- **Dokumen Desain:** [`system-scope.md`](../01-project-overview/system-scope.md)
- **Dokumen Modul:** Tidak ada dampak khusus per modul tunggal (berlaku lintas seluruh modul)
- **Keputusan Terbuka:** Tidak ada ketergantungan langsung
- **ADR Terkait:** [`ADR-0001`](./0001-single-seller-b2c.md), [`ADR-0007`](./0007-pengunjung-web-dipertahankan.md)
- **Bukti Teknis:** [`AGENTS.md`](../../AGENTS.md) (bagian *Urutan Kerja & Perencanaan*)

## Catatan
Keputusan ini mempertahankan keputusan asli `ADR-0003` dan menyelaraskannya dengan fase di `project-plan.md`.
