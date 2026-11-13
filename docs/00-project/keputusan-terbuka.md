# Daftar Keputusan Terbuka

**Status:** `[RENCANA]` — Menunggu keputusan tim/pemilik proyek sebelum implementasi fitur terkait dimulai.

1. **Akses PDF:** Apakah PDF e-book yang sudah dibeli boleh diunduh ke penyimpanan perangkat atau hanya dibaca di dalam aplikasi (*in-app reader*)?
2. **Pembayaran:** Apakah pembayaran menggunakan mekanisme simulasi atau payment gateway nyata (serta kebutuhan Google Play Billing bila aplikasi dipublikasikan)?
3. **Autentikasi:** Menggunakan autentikasi kustom di Express (JWT) atau Supabase Auth?
4. **Pengubahan Bobot SAW:** Apakah pelanggan diperbolehkan mengubah bobot kriteria SAW atau hanya admin? (Dokumen saat ini: hanya admin).
5. **Ulasan & Rating:** Bagaimana cakupan fitur ulasan/rating e-book (siapa yang boleh memberi rating, moderasi, dan pengaruhnya ke SAW)?
6. **Kebijakan E-Book Tanpa Rating:** Bagaimana perlakuan skor SAW untuk e-book baru yang belum memiliki rating?
7. **Identitas Aplikasi:** Penentuan nama final aplikasi dan desain logo.
8. **Konflik Kriteria & Bobot SAW:** Penyelesaian konflik antara 4 kriteria (`0,35 / 0,30 / 0,20 / 0,15`) vs 5 kriteria pada perhitungan manual awal.
9. **Hosting Backend:** Pilihan platform hosting backend (Vercel Functions vs layanan Node.js lain).
10. **Riwayat Rekomendasi:** Perlu atau tidaknya menyimpan riwayat hasil rekomendasi SAW per pengguna/sesi.
