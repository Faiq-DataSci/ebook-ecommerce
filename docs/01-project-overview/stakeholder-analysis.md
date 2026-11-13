# Analisis Pemangku Kepentingan (`Stakeholder Analysis`)

**Status:** `[ADA]` (peran aktor & pembagian tim dasar di `project-plan.md` dan `AGENTS.md`) | `[RENCANA]` (rencana komunikasi & keterlibatan operasional selama eksekusi proyek)

Dokumen ini mengidentifikasi pemangku kepentingan (*stakeholder*) internal dan eksternal proyek **Sistem Informasi E-Commerce E-Book dan SPK SAW** beserta peran, kepentingan, pengaruh, risiko, dan pola komunikasinya.

---

## 1. Daftar Stakeholder Internal & Eksternal

| Stakeholder | Kategori | Peran & Tanggung Jawab | Kepentingan & Kebutuhan Informasi | Tingkat Pengaruh | Kaitan Fitur Sistem | Status |
|---|---|---|---|---|---|---|
| **Pemilik Proyek / Tim Proyek (3 Orang)** | Internal | Menetapkan keputusan bisnis (#5–#11), mengelola prioritas, dan bertanggung jawab atas penyelesaian proyek. | Kejelasan status `[ADA]`/`[RENCANA]`, penyelesaian keputusan terbuka tepat waktu, dan kesiapan demo. | **Tinggi** | Seluruh sistem (`backend`, `admin-web`, `pengunjung-web`, `mobile`) | `[ADA]` (struktur tim) |
| **Dosen Pembimbing / Penilai Akademik** | Eksternal / Akademik | Mengevaluasi kelayakan sistem, ketepatan metodologi `SPK SAW`, kualitas dokumentasi, dan bukti pengujian nyata. | Kesesuaian teori vs implementasi SAW, kejujuran laporan hasil uji, dan keterlacakan kebutuhan. | **Tinggi** | `SPK SAW`, dokumentasi `docs/`, bukti uji (`test-results.md`) | `[RENCANA]` (evaluasi akhir) |
| **Pelanggan** (*Customer*) | Eksternal / Pengguna Akhir | Menjelajah katalog, melihat rekomendasi `SPK SAW`, membeli, membayar, dan membaca `e-book`. | Katalog jelas, rekomendasi relevan, pembayaran aman, serta akses *in-app PDF reader* yang lancar. | **Tinggi** | Katalog, Rekomendasi SAW, Checkout, Payment, Riwayat, Reader | `[RENCANA]` |
| **Admin Operasional** | Internal / Pengguna Akhir | Mengelola kategori, katalog & file PDF, memantau pelanggan, pesanan, pembayaran, laporan penjualan, dan bobot `SPK SAW`. | Dashboard ringkas, manajemen CRUD yang mudah, laporan akurat, dan kontrol pencabutan akses. | **Tinggi** | `web/admin-web` & endpoint `/api/v1/admin/*` | `[RENCANA]` |
| **Tim Backend, Web Frontend, Mobile, QA & Dokumentasi** | Internal / Pelaksana Teknis | Membangun, menguji, dan mendokumentasikan masing-masing lapisan sesuai urutan `Backend -> Admin Web -> Mobile`. | Kontrak API jelas, skema database stabil, aturan teknis `AGENTS.md`, dan hasil uji yang dapat direproduksi. | **Tinggi** | Seluruh komponen teknis monorepo | `[ADA]` (peran di `project-plan.md`) |
| **Supabase** (Auth, PostgreSQL, Storage) | Eksternal / Penyedia Layanan | Menyediakan layanan autentikasi JWT (**Supabase Auth**), basis data **PostgreSQL**, dan penyimpanan objek **`bucket privat`**. | Ketersediaan layanan, kepatuhan batas kuota proyek, dan pengamanan *service role key* hanya di `backend`. | **Sedang** | Autentikasi, seluruh persistensi data, penyimpanan & `signed URL` PDF | `[ADA]` (keputusan #2, #4) / `[RENCANA]` (integrasi penuh) |
| **Payment Gateway** (Midtrans / Xendit) | Eksternal / Penyedia Layanan | Memproses pembayaran daring nyata dan mengirimkan notifikasi status ke *webhook* `backend`. | Validitas payload transaksi, keamanan *signature webhook*, dan respons `200 OK` yang idempoten. | **Sedang** | Modul Pembayaran & *Webhook* (Keputusan #3 `[ADA]`) | `[ADA]` (keputusan #3) / `[RENCANA]` (integrasi sandbox/produksi) |

---

## 2. Risiko Bila Kebutuhan Stakeholder Tidak Terpenuhi

| Stakeholder | Dampak / Risiko Utama | Mitigasi |
|---|---|---|
| **Dosen Penilai Akademik** | Penilaian akademik menurun apabila hasil `SPK SAW` di `backend` tidak cocok dengan perhitungan manual atau status dokumentasi tidak jujur. | Wajibkan unit test SAW terhadap dataset manual dan pertahankan label `[ADA]`/`[RENCANA]` berbasis bukti nyata. |
| **Pelanggan** | Kepercayaan pengguna hilang jika pembayaran sukses tetapi `EbookAccess` gagal aktif, atau UI gagal memuat PDF. | Terapkan transaksi atomik (`prisma.$transaction`), *webhook* idempoten, dan uji *end-to-end* pada Android & web. |
| **Admin Operasional** | Kesalahan pengelolaan harga/file PDF dapat memengaruhi transaksi atau membocorkan konten. | Terapkan validasi Zod di `backend`, unggah PDF langsung ke `bucket privat`, dan *soft-archive* (`isActive = false`). |
| **Tim Teknis (Web & Mobile)** | Pekerjaan terhambat atau terjadi integrasi ulang jika kontrak API dan keputusan #5–#11 terlambat dikunci. | Patuhi [ADR-0003](../adr/0003-admin-web-sebelum-mobile.md) (stabilkan `backend` dulu) dan kunci keputusan terbuka pada Milestone M1. |

---

## 3. Matriks Komunikasi Proyek (`[RENCANA]`)

| Forum / Media | Peserta | Frekuensi / Momen | Tujuan & Keluaran |
|---|---|---|---|
| **Sinkronisasi Tim Internal** | Tim Backend, Web, Mobile, QA | Mingguan (selama Fase 1–4) | Koordinasi progres milestone (M1–M6), penyelesaian blocker integrasi API, dan review kode. |
| **Review Keputusan Terbuka** | Pemilik Proyek & Tim Teknis | Menjelang Milestone M1 & M4 | Mengunci keputusan `[RENCANA]` (#5–#11) pada [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md). |
| **Bimbingan & Evaluasi Akademik** | Tim Proyek & Dosen Pembimbing | Sesuai jadwal bimbingan & evaluasi | Validasi arsitektur, perhitungan manual `SPK SAW`, dan demo sistem terpadu. |
| **Pembaruan Dokumentasi & PR** | Seluruh Tim Teknis | Setiap selesai satu tahap/fitur | Memastikan laporan penyelesaian tugas memuat file berubah, perintah verifikasi, dan hasil nyata. |
