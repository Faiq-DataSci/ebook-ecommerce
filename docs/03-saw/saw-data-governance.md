# Tata Kelola Data SPK SAW (`Data Governance`)

> **Status Dokumen:** `[ADA]` (Dokumentasi tata kelola data) | **Implementasi Mekanisme:** `[RENCANA]`
> **Referensi:** [`schema.prisma`](../../backend/prisma/schema.prisma), [`data-dictionary.md`](../04-database/data-dictionary.md), [`business-rules.md`](../03-business-process/business-rules.md)

---

## 1. Matriks Tata Kelola Data SAW

| Data | Sumber | Validasi | Siapa yang Mengubah | Siapa yang Membaca | Retensi atau Audit | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Harga E-Book (`price`)** | PostgreSQL (`Ebook.price`, `Decimal(12,2)`) | `price >= 0`, `NOT NULL` | Admin (`ADMIN`) via API Admin | Backend (`SawService`), Pelanggan/Publik (tampilan) | Perubahan tercatat di `updatedAt`; pesanan lama memakai snapshot `OrderItem.unitPrice` | `[ADA]` skema / `[RENCANA]` endpoint |
| **Rating Rata-Rata (`ratingAvg`)** | PostgreSQL (`Ebook.ratingAvg`, `Decimal(3,2)`) | `0.00 <= ratingAvg <= 5.00` | Sistem/Admin *(sumber ulasan menunggu Keputusan #6)* | Backend (`SawService`), Pelanggan/Publik | Audit pembaruan `ratingAvg` menunggu Keputusan #6 & #7 | `[ADA]` skema / `[RENCANA]` sumber |
| **Jumlah Terjual (`salesCount`)** | PostgreSQL (`Ebook.salesCount`, `Int`) | `salesCount >= 0`, integer | Sistem backend atomik saat pelunasan webhook (`OrderStatus = PAID`) | Backend (`SawService`), Admin, Pelanggan/Publik | Konsisten dengan jumlah `OrderItem` dari `Order` berstatus `PAID` | `[ADA]` skema / `[RENCANA]` increment atomik |
| **Jumlah Halaman (`pageCount`) & Tahun Terbit (`publishedYear`)** | PostgreSQL (`Ebook`, `Int?`) | `> 0` bila diisi; opsional/nullable | Admin (`ADMIN`) | Backend (`SawService` bila masuk kriteria #9), Publik | Perubahan tercatat di `updatedAt` | `[ADA]` skema / `[RENCANA]` inklusi SAW |
| **Status Aktif E-Book (`isActive`)** | PostgreSQL (`Ebook.isActive`, `Boolean`) | Boolean (`true`/`false`) | Admin (`ADMIN`) | Backend (`where: { isActive: true }`) | E-book nonaktif (`false`) dikecualikan dari kandidat rekomendasi SAW | `[ADA]` skema / `[RENCANA]` filter SAW |
| **Konfigurasi Bobot SAW** | Tabel/konfigurasi backend (`SawCriterionConfig` `[RENCANA]`) | `Σ w_j = 1.0`, `w_j >= 0` | Admin (`ADMIN`) *(Keputusan #5)* | Backend (`SawService`), Admin | Disarankan berversi (`version`) agar konfigurasi lama tetap terlacak | `[RENCANA]` |
| **Snapshot Hasil Rekomendasi** | Tabel snapshot (`SawCalculationSnapshot` `[RENCANA]`) | Timestamp & integritas hasil | Sistem backend | Admin (audit), Pelanggan *(jika diaktifkan)* | Menunggu Keputusan #11 apakah disimpan persisten | `[RENCANA]` |

---

## 2. Kebijakan Kualitas, Konsistensi & Perlindungan Data

1. **Konsistensi dengan Transaksi & Katalog:**
   - `salesCount` hanya bertambah melalui transaksi atomik (`prisma.$transaction`) saat webhook pembayaran resmi terverifikasi (`PAID`), bukan dari klik tombol di klien.
   - E-book berstatus arsip (`isActive = false`) tidak pernah masuk ke matriks keputusan SAW.
2. **Perlakuan Data Kosong & Tanpa Rating:**
   - Field opsional (`pageCount`, `publishedYear`) yang bernilai `null` tidak boleh menghasilkan `NaN`; perlakuan finalnya mengikuti Keputusan #9.
   - `ratingAvg = 0` diperlakukan aman sesuai aturan normalisasi dan Keputusan #7.
3. **Perlindungan Data Pelanggan & Batasan Akses:**
   - Perhitungan SAW tidak menggunakan data pribadi sensitif Pelanggan (email, password hash, alamat IP, riwayat pembayaran individu).
   - Pelanggan dan Pengunjung Publik hanya dapat membaca hasil rekomendasi (`GET /api/v1/recommendations/saw`), sedangkan Admin dapat mengelola bobot dan mengaudit matriks (`[RENCANA]`).
4. **Frekuensi Pembaruan Data:**
   - Perhitungan rekomendasi membaca data terbaru dari PostgreSQL pada saat permintaan (real-time query) kecuali apabila kebijakan *caching* atau *snapshot* ditetapkan kemudian (`[RENCANA]`).
