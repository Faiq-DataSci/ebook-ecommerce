# Daftar Keputusan Terbuka & Keputusan Terkonfirmasi

**Status:** Sebagian `[CONFIRMED]`, sebagian masih `[RENCANA]` — diperbarui berdasarkan konfirmasi pemilik proyek.

## Keputusan yang Sudah Ditetapkan (`[CONFIRMED]`)

1. **Aplikasi Pengunjung Web (`web/pengunjung-web/`):** Dipertahankan sebagai portal web pelanggan (melengkapi aplikasi mobile `ebook_store`).
2. **Autentikasi:** Menggunakan **Supabase Auth** dengan verifikasi token Supabase di backend (`Express`).
3. **Pembayaran:** Menggunakan integrasi **payment gateway nyata** (seperti Midtrans/Xendit) sejak awal.
4. **Akses PDF:** Hanya dapat dibaca di dalam aplikasi (*in-app PDF reader*) melalui *signed URL* sementara dari bucket privat.

## Keputusan yang Masih Terbuka (`[RENCANA]`)

5. **Pengubahan Bobot SAW:** Apakah pelanggan diperbolehkan mengubah bobot kriteria SAW atau hanya admin? (Dokumen saat ini: hanya admin).
6. **Ulasan & Rating:** Bagaimana cakupan fitur ulasan/rating e-book (siapa yang boleh memberi rating, moderasi, dan pengaruhnya ke SAW)?
7. **Kebijakan E-Book Tanpa Rating:** Bagaimana perlakuan skor SAW untuk e-book baru yang belum memiliki rating?
8. **Identitas Aplikasi:** Penentuan nama final aplikasi dan desain logo.
9. **Konflik Kriteria & Bobot SAW:** Penyelesaian konflik antara 4 kriteria (`0,35 / 0,30 / 0,20 / 0,15`) vs 5 kriteria pada perhitungan manual awal.
10. **Hosting Backend:** Pilihan platform hosting backend (Vercel Functions vs layanan Node.js lain).
11. **Riwayat Rekomendasi:** Perlu atau tidaknya menyimpan riwayat hasil rekomendasi SAW per pengguna/sesi.
