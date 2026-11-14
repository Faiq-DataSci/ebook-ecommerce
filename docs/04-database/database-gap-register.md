# Register Gap & Keputusan Basis Data (`Database Gap Register`)

> **Status Dokumen:** `[ADA]` (Dokumentasi inventarisasi gap)
> **Sumber Kebenaran Utama:** [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) & [`schema.prisma`](../../backend/prisma/schema.prisma)

---

## 1. Daftar Gap dan Keputusan Terbuka Terkait Basis Data

| ID | Gap atau Keputusan | Dampak pada Schema | Dokumen Sumber | Status | Tindakan Lanjutan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **DB-GAP-01** | **Keputusan #5: Pengubahan bobot SAW** | Menentukan perlu tidaknya tabel `SawCriterionConfig` (Admin-only) atau dukungan preferensi per Pelanggan | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` | Kunci kebijakan aktor pengubah bobot sebelum menambah model konfigurasi SAW ke `schema.prisma`. |
| **DB-GAP-02** | **Keputusan #6: Ulasan dan rating pembeli** | Saat ini tidak ada model `Review` di `schema.prisma`; `Ebook.ratingAvg` belum memiliki sumber mutasi otomatis | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` | Tetapkan apakah model `Review` ditambahkan atau `ratingAvg` dikelola Admin. |
| **DB-GAP-03** | **Keputusan #7: E-book tanpa rating (`ratingAvg = 0`)** | Menentukan perlu tidaknya kolom/flag pembeda antara belum dirating vs rating `0` | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` | Sahkan aturan normalisasi SAW bagi item `ratingAvg = 0`. |
| **DB-GAP-04** | **Keputusan #9: Jumlah kriteria dan bobot SAW** | Menentukan apakah `Ebook.pageCount` / `Ebook.publishedYear` wajib `NOT NULL` bila masuk 4 atau 5 kriteria SAW | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` | Rekonsiliasi konflik 4 vs 5 kriteria dan perketat validasi metadata e-book. |
| **DB-GAP-05** | **Keputusan #11: Snapshot hasil rekomendasi SAW** | Menentukan penambahan model `SawCalculationSnapshot` untuk menyimpan riwayat matriks & skor | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` | Putuskan kebutuhan audit historis SAW sebelum migrasi lanjutan. |
| **DB-GAP-06** | **Belum adanya migrasi database nyata** | Direktori `backend/prisma/migrations/` belum ada dan skema belum diterapkan ke PostgreSQL Supabase | [`database-migration-plan.md`](./database-migration-plan.md) | `[RENCANA]` | Siapkan `DATABASE_URL`/`DIRECT_URL` Supabase dan jalankan migrasi awal 8 model inti saat fase implementasi DB. |
| **DB-GAP-07** | **Belum adanya skrip seed data** | Belum ada seed `DATA SIMULASI` untuk `User`, `Category`, `Ebook`, dan dataset SAW di `backend/` | [`database-seeding-plan.md`](./database-seeding-plan.md) | `[RENCANA]` | Implementasikan skrip seed idempoten berlabel `"DATA SIMULASI"` setelah migrasi awal berjalan. |
| **DB-GAP-08** | **Belum adanya model SAW pada `schema.prisma`** | `schema.prisma` saat ini hanya memuat 8 model inti e-commerce tanpa model konfigurasi/snapshot SAW | [`schema.prisma`](../../backend/prisma/schema.prisma) | `[RENCANA]` | Tambahkan model SAW hanya setelah Keputusan #5, #9, #11 disahkan. |
| **DB-GAP-09** | **Kebutuhan kebijakan backup, restore, retensi, dan audit log** | Belum ada tabel `AuditLog` maupun SOP formal backup/restore/retensi data di Supabase | [`database-security.md`](./database-security.md) | `[RENCANA]` | Tetapkan kebijakan backup otomatis Supabase, retensi log transaksi, dan kebutuhan audit log Admin. |
| **DB-GAP-10** | **Belum adanya `CHECK` constraint SQL eksplisit** | Nilai uang/rating non-negatif baru dijaga oleh tipe data & rencana validasi Zod, belum ada `CHECK` SQL | [`database-constraints.md`](./database-constraints.md) | `[RENCANA]` | Evaluasi penambahan `CHECK` constraint pada migrasi SQL jika diperlukan pertahanan lapis DB. |
