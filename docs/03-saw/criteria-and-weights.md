# Kriteria dan Bobot SPK SAW

> **Status Dokumen:** `[ADA]` (Dokumentasi inventarisasi kriteria & konflik) | **Penetapan Final & Implementasi Konfigurasi:** `[RENCANA]`
> **Referensi Keputusan Terbuka:** [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) (#5, #6, #7, #9, #11)

---

## 1. Kriteria yang Sudah Dapat Dibuktikan Sumber Datanya di Skema (`[ADA]` pada `schema.prisma`, `[RENCANA]` pada Logika SAW)

Berikut daftar atribut pada model `Ebook` di [`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma) yang berpotensi menjadi kriteria SAW:

| ID Kriteria | Nama Kriteria | Sumber Data | Tipe | Benefit atau Cost | Satuan | Validasi | Bobot | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **C1** | Harga E-Book | `Ebook.price` (`Decimal(12,2)`) | Numerik (`NOT NULL`) | **Cost** | Rupiah (`IDR`) | `price >= 0` | `[RENCANA]` | `[ADA]` di `schema.prisma` / `[RENCANA]` bobot |
| **C2** | Rating Rata-Rata | `Ebook.ratingAvg` (`Decimal(3,2)`) | Numerik (`default 0`) | **Benefit** | Skala bintang (`0.00–5.00`) | `0 <= ratingAvg <= 5` | `[RENCANA]` | `[ADA]` di `schema.prisma` / `[RENCANA]` sumber ulasan (#6, #7) |
| **C3** | Popularitas / Jumlah Terjual | `Ebook.salesCount` (`Int`) | Numerik (`default 0`) | **Benefit** | Jumlah transaksi sukses | `salesCount >= 0` | `[RENCANA]` | `[ADA]` di `schema.prisma` / `[RENCANA]` logika SAW |
| **C4** | Jumlah Halaman *(Kandidat)* | `Ebook.pageCount` (`Int?`) | Numerik (*nullable*) | **Benefit** / **Cost** *(belum final)* | Halaman | `pageCount > 0` jika terisi | `[RENCANA]` | `[ADA]` kolom opsional / `[RENCANA]` inklusi kriteria (#9) |
| **C5** | Tahun Terbit *(Kandidat)* | `Ebook.publishedYear` (`Int?`) | Numerik (*nullable*) | **Benefit** *(kebaruan)* | Tahun (`YYYY`) | `publishedYear > 0` jika terisi | `[RENCANA]` | `[ADA]` kolom opsional / `[RENCANA]` inklusi kriteria (#9) |

> **Catatan Penting:** Belum ada satu pun kriteria di atas yang diimplementasikan di `backend/src/` sebagai engine SAW aktif. Status `[ADA]` di atas hanya merujuk pada keberadaan kolom di `schema.prisma`.

---

## 2. Kriteria yang Masih `[RENCANA]`

Seluruh hal berikut berstatus `[RENCANA]` hingga keputusan proyek dikunci:
1. **Penetapan Jumlah Kriteria Aktif (Keputusan #9):** Apakah menggunakan **4 kriteria** (`price`, `ratingAvg`, `salesCount`, plus 1 atribut `pageCount`/`publishedYear`) atau **5 kriteria**.
2. **Arah Kriteria `pageCount` (Keputusan #9):** Apakah jumlah halaman lebih banyak dianggap **Benefit** (materi lebih lengkap) atau **Cost** (lebih ringkas).
3. **Sumber Pembaruan `ratingAvg` (Keputusan #6 & #7):** Belum ada model `Review` pada `schema.prisma`, sehingga mekanisme pengisian `ratingAvg` dan perlakuan e-book yang memiliki `ratingAvg = 0` masih terbuka.

---

## 3. Kriteria yang Ditolak atau Tidak Digunakan

Kriteria berikut **tidak digunakan** dalam perhitungan SAW karena tidak memiliki sumber data numerik yang valid pada `schema.prisma` atau bersifat non-objektif:
- Deskripsi teks, judul, nama penulis, atau slug kategori (tidak bersifat kuantitatif).
- Ukuran file PDF (`storagePath` mengacu ke lokasi file privat, bukan kriteria peringkat).
- Atribut yang tidak tersedia di database seperti jumlah klik/views tanpa tabel pelacakan (*analytics*) yang tervalidasi.

---

## 4. Konflik Kriteria dan Bobot (Catatan Audit)

Berdasarkan audit dokumen lintas fase, ditemukan tiga variasi konfigurasi yang belum direkonsiliasi:
1. **Variasi 4 Kriteria:** Referensi awal proyek mencantumkan 4 kriteria dengan bobot `0,35 / 0,30 / 0,20 / 0,15`.
2. **Variasi 5 Kriteria:** Dokumen perhitungan manual lama mencantumkan 5 kriteria (termasuk kelengkapan atribut tahun terbit/halaman).
3. **Variasi 3 Kriteria pada Stub `perhitungan-manual.md`:** Kerangka uji lama mencantumkan bobot `0,40 / 0,35 / 0,25` (`DATA SIMULASI`).

Sesuai aturan proyek, dokumen ini **tidak** memaksakan salah satu variasi sebagai konfigurasi produksi. Penetapan final tercatat sebagai **`[RENCANA]`** pada [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) (#9).

---

## 5. Konfigurasi Bobot Aktif & Validasi Bobot (`[RENCANA]`)

1. **Total Bobot (`Σ w_j = 1.0`):** Jumlah seluruh bobot kriteria aktif harus sama dengan `1.0` dengan toleransi *floating-point* yang direkomendasikan sebesar `1e-6` (`|Σ w_j - 1.0| <= 0.000001`).
2. **Larangan Bobot Negatif:** Setiap bobot wajib memenuhi $w_j \ge 0$. Nilai negatif ditolak oleh validator Zod backend (`400 Bad Request` / `SAW_CONFIGURATION_INVALID`).
3. **Kebijakan Bobot Nol (`w_j = 0`):** `[RENCANA]` — Belum ada keputusan final apakah kriteria aktif boleh diberi bobot `0` atau harus ketat $w_j > 0$. Hingga diputuskan, rancangan merekomendasikan bobot aktif $w_j > 0$ agar setiap kriteria aktif benar-benar berkontribusi.
4. **Siapa yang Boleh Mengubah Bobot:**
   - **Admin (`ADMIN`):** Diusulkan dapat mengelola bobot melalui `PUT /api/v1/admin/saw/weights` (`[RENCANA]`).
   - **Pelanggan / Klien Publik:** **Tidak boleh** mengirim bobot mentah yang langsung dipercaya backend. Dukungan preset/preferensi bobot pelanggan masih berstatus `[RENCANA]` (Keputusan #5).

---

## 6. Riwayat Perubahan Bobot dan Snapshot (`[RENCANA]`)

Penyimpanan riwayat perubahan bobot (`SawCriterionConfig` berversi) dan *snapshot* hasil rekomendasi (`SawCalculationSnapshot`) agar hasil historis tetap *immutable* masih berstatus **`[RENCANA]`** menunggu Keputusan #11 pada [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md).
