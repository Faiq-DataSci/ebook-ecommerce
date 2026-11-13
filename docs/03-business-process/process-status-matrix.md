# Matriks Status Proses Bisnis (Process Status Matrix)

> **Status Dokumen:** `[ADA]` (Dokumentasi audit status terkini)
> **Prinsip Verifikasi:** Status `[ADA]` hanya diberikan pada bagian yang **benar-benar memiliki implementasi kode dan bukti pengujian/verifikasi** di repositori. Seluruh alur bisnis penuh yang belum diimplementasikan dan diuji tetap berstatus `[RENCANA]`.

---

## 1. Status Fondasi Teknis Saat Ini (`[ADA]` vs `[RENCANA]`)

Berdasarkan inspeksi langsung terhadap [`backend/src/app.ts`](../../backend/src/app.ts), [`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma), dan [`test-results.md`](../09-testing/test-results.md):
- **Fondasi yang `[ADA]`:**
  - Backend: Server Express + TypeScript ESM, `GET /api/v1/health`, `GET /api/v1/admin/ping` (dengan `authenticate` + `authorize('ADMIN')`), middleware `validate.ts`, `error.middleware.ts`, `rate-limit.middleware.ts` *(belum dipasang di `app.ts`)*, helper `createPrivatePdfSignedUrl`, dan `schema.prisma` (8 model, 3 enum; belum ada migrasi database).
  - Pengujian Backend: `npm run typecheck`, `npm test` (Vitest: 2 file, 5 pengujian dasar lulus), `npm run build`, dan `npx prisma validate` lulus.
  - Web (`admin-web` & `pengunjung-web`): Kerangka Vite + React + TypeScript, lolos `lint` dan `build`.
  - Mobile (`ebook_store`): Kerangka Flutter, lolos `flutter analyze` dan `flutter test` (1 widget test template).
- **Proses Bisnis yang Masih `[RENCANA]`:** Seluruh endpoint dan UI bisnis Pelanggan, Admin, Checkout/Webhook, Akses Signed URL penuh, serta Engine SPK SAW belum diimplementasikan.

---

## 2. Matriks Status Proses Pelanggan (`BP-C01` – `BP-C12`)

| ID Proses | Nama Proses | Backend | Admin Web | Web Pengunjung | Mobile (`ebook_store`) | Dokumentasi | Pengujian | Status Keseluruhan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BP-C01** | Registrasi & Login Akun Pelanggan | `[RENCANA]` *(middleware JWT `[ADA]`)* | — | `[RENCANA]` | `[RENCANA]` | `[ADA]` | `[RENCANA]` | `[RENCANA]` |
| **BP-C02** | Penelusuran Katalog E-Book | `[RENCANA]` | — | `[RENCANA]` | `[RENCANA]` | `[ADA]` | `[RENCANA]` | `[RENCANA]` |
| **BP-C03** | Pencarian E-Book | `[RENCANA]` | — | `[RENCANA]` | `[RENCANA]` | `[ADA]` | `[RENCANA]` | `[RENCANA]` |
| **BP-C04** | Filter Katalog Berdasarkan Kategori | `[RENCANA]` | — | `[RENCANA]` | `[RENCANA]` | `[ADA]` | `[RENCANA]` | `[RENCANA]` |
| **BP-C05** | Melihat Detail E-Book | `[RENCANA]` | — | `[RENCANA]` | `[RENCANA]` | `[ADA]` | `[RENCANA]` | `[RENCANA]` |
| **BP-C06** | Mendapatkan Rekomendasi SPK SAW | `[RENCANA]` | — | `[RENCANA]` | `[RENCANA]` | `[ADA]` | `[RENCANA]` | `[RENCANA]` |
| **BP-C07** | Membuat Pesanan (Checkout) | `[RENCANA]` | — | — | `[RENCANA]` | `[ADA]` | `[RENCANA]` | `[RENCANA]` |
| **BP-C08** | Pembayaran Pesanan & Webhook | `[RENCANA]` | — | — | `[RENCANA]` | `[ADA]` | `[RENCANA]` | `[RENCANA]` |
| **BP-C09** | Memantau Status Pembayaran | `[RENCANA]` | — | — | `[RENCANA]` | `[ADA]` | `[RENCANA]` | `[RENCANA]` |
| **BP-C10** | Melihat Riwayat Pesanan & Transaksi | `[RENCANA]` | — | — | `[RENCANA]` | `[ADA]` | `[RENCANA]` | `[RENCANA]` |
| **BP-C11** | Akses Koleksi & Signed URL PDF | `[RENCANA]` *(helper signed URL `[ADA]`)* | — | — | `[RENCANA]` | `[ADA]` | `[RENCANA]` | `[RENCANA]` |
| **BP-C12** | Membaca PDF di Dalam Aplikasi | `[RENCANA]` | — | — | `[RENCANA]` | `[ADA]` | `[RENCANA]` | `[RENCANA]` |

---

## 3. Matriks Status Proses Admin (`BP-A01` – `BP-A16`)

| ID Proses | Nama Proses | Backend | Admin Web | Web Pengunjung | Mobile (`ebook_store`) | Dokumentasi | Pengujian | Status Keseluruhan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **BP-A01** | Login Admin & Verifikasi Role | `[RENCANA]` *(`/admin/ping` `[ADA]`)* | `[RENCANA]` | — | — | `[ADA]` | `[RENCANA]` *(401 test `[ADA]`)* | `[RENCANA]` |
| **BP-A02** | Melihat Profil & Sesi Admin | `[RENCANA]` | `[RENCANA]` | — | — | `[ADA]` | `[RENCANA]` | `[RENCANA]` |
| **BP-A03** | Mengelola Kategori E-Book | `[RENCANA]` | `[RENCANA]` | — | — | `[ADA]` | `[RENCANA]` | `[RENCANA]` |
| **BP-A04** | Menambah Data E-Book Baru | `[RENCANA]` | `[RENCANA]` | — | — | `[ADA]` | `[RENCANA]` | `[RENCANA]` |
| **BP-A05** | Memperbarui Metadata & Harga E-Book | `[RENCANA]` | `[RENCANA]` | — | — | `[ADA]` | `[RENCANA]` | `[RENCANA]` |
| **BP-A06** | Mengarsipkan / Menonaktifkan E-Book | `[RENCANA]` | `[RENCANA]` | — | — | `[ADA]` | `[RENCANA]` | `[RENCANA]` |
| **BP-A07** | Mengunggah Sampul E-Book | `[RENCANA]` | `[RENCANA]` | — | — | `[ADA]` | `[RENCANA]` | `[RENCANA]` |
| **BP-A08** | Mengunggah File PDF ke Bucket Privat | `[RENCANA]` | `[RENCANA]` | — | — | `[ADA]` | `[RENCANA]` | `[RENCANA]` |
| **BP-A09** | Melihat Daftar Data Pelanggan | `[RENCANA]` | `[RENCANA]` | — | — | `[ADA]` | `[RENCANA]` | `[RENCANA]` |
| **BP-A10** | Memantau Daftar & Detail Pesanan | `[RENCANA]` | `[RENCANA]` | — | — | `[ADA]` | `[RENCANA]` | `[RENCANA]` |
| **BP-A11** | Memantau Status Pembayaran | `[RENCANA]` | `[RENCANA]` | — | — | `[ADA]` | `[RENCANA]` | `[RENCANA]` |
| **BP-A12** | Memantau Riwayat Transaksi | `[RENCANA]` | `[RENCANA]` | — | — | `[ADA]` | `[RENCANA]` | `[RENCANA]` |
| **BP-A13** | Melihat Ringkasan Laporan Penjualan | `[RENCANA]` | `[RENCANA]` | — | — | `[ADA]` | `[RENCANA]` | `[RENCANA]` |
| **BP-A14** | Mengatur Bobot Kriteria SPK SAW | `[RENCANA]` | `[RENCANA]` | — | — | `[ADA]` | `[RENCANA]` | `[RENCANA]` |
| **BP-A15** | Mengaudit Matriks & Hasil Ranking SAW | `[RENCANA]` | `[RENCANA]` | — | — | `[ADA]` | `[RENCANA]` | `[RENCANA]` |
| **BP-A16** | Mencabut / Memulihkan `EbookAccess` | `[RENCANA]` | `[RENCANA]` | — | — | `[ADA]` | `[RENCANA]` | `[RENCANA]` |
