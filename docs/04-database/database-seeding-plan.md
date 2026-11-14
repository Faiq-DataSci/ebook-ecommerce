# Rencana Seeding Data (`Database Seeding Plan`)

> **Status Dokumen:** `[ADA]` (Dokumentasi rencana seeding) | **Implementasi Skrip Seed:** `[RENCANA]` (Belum ada skrip seed di `backend/`)
> **Peringatan Integritas:** Seluruh data contoh dan skrip seed wajib berlabel **`"DATA SIMULASI"`** dan **dilarang** memakai akun, email, atau kredensial nyata.

---

## 1. Tujuan & Batasan Keamanan Seed

- **Tujuan:** Menyediakan data awal yang konsisten untuk pengembangan lokal, pengujian API, verifikasi perhitungan manual SAW (`A3, A1, A2`), dan demonstrasi UI tanpa mencampur data dummy sebagai data produksi.
- **Batasan Keamanan:**
  - Tidak boleh memasukkan password asli, token JWT asli, atau email pengguna sungguhan (gunakan domain contoh non-aktif seperti `simulasi.example.test`).
  - Seluruh record simulasi ditandai jelas dengan prefiks/label `"DATA SIMULASI"` pada judul/nama.
  - Seed hanya dijalankan di lingkungan pengembangan/staging, **bukan** sebagai data bisnis nyata di production.

---

## 2. Urutan Seeding Berdasarkan Ketergantungan Foreign Key (`[RENCANA]`)

| Urutan | Entitas | Tujuan | Ketergantungan | Label Data | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | `User` (Admin & Pelanggan simulasi) | Menyediakan akun uji `ADMIN` dan `CUSTOMER` tertaut `supabaseUserId` simulasi | Tidak ada | `"DATA SIMULASI"` | `[RENCANA]` |
| **2** | `Category` | Menyediakan kategori e-book uji (`Teknologi`, `Bisnis`, dll.) | Tidak ada | `"DATA SIMULASI"` | `[RENCANA]` |
| **3** | `Ebook` | Menyediakan minimal 3–5 e-book simulasi lengkap dengan `price`, `ratingAvg`, `salesCount`, `storagePath` uji (dataset SAW manual) | `Category` | `"DATA SIMULASI"` | `[RENCANA]` |
| **4** | `Order` | Menyediakan contoh pesanan simulasi (`PENDING` dan `PAID`) | `User` | `"DATA SIMULASI"` | `[RENCANA]` |
| **5** | `OrderItem` | Menyediakan rincian item pesanan dengan `unitPrice` snapshot | `Order`, `Ebook` | `"DATA SIMULASI"` | `[RENCANA]` |
| **6** | `Payment` | Menyediakan rekaman pembayaran simulasi (`PENDING` / `VERIFIED`) | `Order` | `"DATA SIMULASI"` | `[RENCANA]` |
| **7** | `Transaction` | Menyediakan transaksi resmi simulasi untuk pesanan `PAID` | `Order`, `Payment`, `User` | `"DATA SIMULASI"` | `[RENCANA]` |
| **8** | `EbookAccess` | Memberikan hak akses baca simulasi untuk pesanan `PAID` (serta 1 contoh `isRevoked = true` untuk uji `403`) | `User`, `Ebook`, `Order` | `"DATA SIMULASI"` | `[RENCANA]` |

---

## 3. Dataset SAW Simulasi untuk Pengujian Manual

Seed `Ebook` disarankan menyertakan 3 alternatif uji dari [`perhitungan-manual.md`](../03-saw/perhitungan-manual.md) dengan bobot simulasi `0.40 / 0.35 / 0.25`:
- `"DATA SIMULASI - Arsitektur Backend Modern"` (`price: 50000`, `ratingAvg: 4.50`, `salesCount: 120`)
- `"DATA SIMULASI - Dasar Basis Data Relasional"` (`price: 75000`, `ratingAvg: 4.00`, `salesCount: 80`)
- `"DATA SIMULASI - Panduan Praktis Flutter"` (`price: 40000`, `ratingAvg: 4.80`, `salesCount: 150`)

---

## 4. Strategi Idempotency & Pembersihan Aman

- **Idempotency:** Gunakan operasi `upsert` berdasarkan kunci unik (`email`/`supabaseUserId` pada `User`, `slug` pada `Category`, `orderNumber` pada `Order`, `(userId, ebookId)` pada `EbookAccess`) agar eksekusi ulang seed tidak gagal atau menggandakan data.
- **Pembersihan Data Simulasi:** Pembersihan hanya menargetkan record dengan penanda simulasi eksplisit (misal `orderNumber LIKE 'ORD-SIM-%'` atau `title LIKE 'DATA SIMULASI%'`) dan **tidak pernah** menggunakan perintah `TRUNCATE` atau penghapusan menyeluruh pada lingkungan yang berisi data produksi.
