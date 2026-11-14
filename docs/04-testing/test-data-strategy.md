# Strategi Data Uji (`Test Data Strategy`)

> **Status Dokumen:** `[ADA]` (Dokumentasi strategi data uji) | **Implementasi Fixture & Seed:** `[RENCANA]`
> **Referensi:** [`perhitungan-manual.md`](../03-saw/perhitungan-manual.md), [`database-seeding-plan.md`](../04-database/database-seeding-plan.md), [`webhook-contract.md`](../02-api/webhook-contract.md)

---

## 1. Tujuan & Prinsip Wajib Data Uji

- **Tujuan:** Menyediakan data uji yang konsisten, deterministik, dan aman bagi unit test, integration test, serta uji verifikasi SAW.
- **Prinsip Wajib:**
  1. Seluruh data contoh dan fixture wajib berlabel **`"DATA SIMULASI"`**.
  2. Dilarang memakai akun nyata, email nyata, atau kredensial nyata.
  3. Dilarang menggunakan data produksi.
  4. Data uji harus bersifat idempoten (dapat dibuat ulang dan dibersihkan dengan aman).

---

## 2. Kategori & Sumber Data Uji (`"DATA SIMULASI"`)

1. **Kategori & E-Book Simulasi:** Memakai `storagePath` referensi uji (bukan file PDF nyata di production).
2. **Pelanggan & Admin Simulasi:** Memakai `supabaseUserId` dummy dan email domain simulasi (`*.example.test`).
3. **Pesanan, Pembayaran, Transaksi & `EbookAccess` Simulasi:** Mencakup status `PENDING`, `PAID`/`VERIFIED`, `FAILED`, `EXPIRED`, serta akses `isRevoked = true` dan `false`.
4. **Dataset SAW Simulasi ([`perhitungan-manual.md`](../03-saw/perhitungan-manual.md)):**
   - 3 alternatif (`A1`, `A2`, `A3`), bobot `[0.40, 0.35, 0.25]`, ranking **`A3 -> A1 -> A2`**.
   - Toleransi *floating-point* unit test: `toBeCloseTo(expected, 6)` ($10^{-6}$).
   - Expected output JSON mengacu pada bagian 7 `perhitungan-manual.md`.
5. **Payload Webhook Simulasi:** Mengacu kontrak [`webhook-contract.md`](../02-api/webhook-contract.md) (signature valid, invalid, nominal mismatch, duplikat).

---

## 3. Urutan Pembuatan Data Uji Berdasarkan Foreign Key (`[RENCANA]`)

| Urutan | Entitas | Tujuan Data Uji | Ketergantungan | Label Data | Status |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | `Category` | Pengelompokan katalog e-book uji | Tidak ada | `"DATA SIMULASI"` | `[RENCANA]` |
| **2** | `Ebook` | Katalog aktif/arsip & dataset SAW manual | `Category` | `"DATA SIMULASI"` | `[RENCANA]` |
| **3** | `User` | Akun uji `CUSTOMER` & `ADMIN` | Tidak ada | `"DATA SIMULASI"` | `[RENCANA]` |
| **4** | `Order` | Pesanan `PENDING`, `PAID`, `EXPIRED` | `User` | `"DATA SIMULASI"` | `[RENCANA]` |
| **5** | `OrderItem` | Item pesanan dengan snapshot `unitPrice` | `Order`, `Ebook` | `"DATA SIMULASI"` | `[RENCANA]` |
| **6** | `Payment` | Pembayaran `PENDING`, `VERIFIED`, `FAILED` | `Order` | `"DATA SIMULASI"` | `[RENCANA]` |
| **7** | `Transaction` | Buku besar transaksi sah 1-to-1 | `Order`, `Payment`, `User` | `"DATA SIMULASI"` | `[RENCANA]` |
| **8** | `EbookAccess` | Hak akses aktif & dicabut (`isRevoked`) | `User`, `Ebook`, `Order` | `"DATA SIMULASI"` | `[RENCANA]` |

---

## 4. Strategi Fixture, Mock, Idempotency & Cleanup (`[RENCANA]`)

- **Fixture Factory:** Fungsi pembuat data uji dengan nilai default `"DATA SIMULASI"` dan opsi *override* field per skenario.
- **Strategi Mock:** Mock Prisma Client untuk unit test murni; mock Supabase Auth `getUser()` untuk uji middleware RBAC; mock Supabase Storage `createSignedUrl()` untuk uji akses PDF; mock request webhook untuk uji payment gateway.
- **Idempotency & Cleanup:** Gunakan UUID deterministik atau generate per suite, reset state DB test sebelum suite, rollback transaksi per test, dan hapus hanya record berlabel simulasi agar tidak pernah menyentuh data produksi.
