# Glosarium Istilah (`Glossary`)

**Status:** `[ADA]` (istilah standar proyek yang dikunci untuk keseragaman seluruh dokumentasi)

Dokumen ini menjadi kamus istilah resmi proyek **Sistem Informasi E-Commerce E-Book dan SPK SAW** agar tidak terjadi perbedaan penamaan antara dokumen bisnis, desain, API, database, maupun kode sumber.

| Istilah | Definisi Resmi dalam Proyek |
|---|---|
| **E-book** | Buku elektronik berformat PDF yang dikelola **Admin** dalam katalog, dibeli oleh **Pelanggan**, dan disimpan pada `bucket privat`. |
| **Pelanggan** | Aktor pengguna akhir (`role = CUSTOMER`) yang menelusuri katalog, melihat rekomendasi `SPK SAW`, membeli `e-book`, dan membacanya di aplikasi (`mobile/ebook_store` atau `web/pengunjung-web`). |
| **Admin** | Aktor pengelola tunggal sistem (`role = ADMIN`) yang mengatur kategori, katalog `e-book`, file PDF, pelanggan, pemantauan pesanan/pembayaran, laporan penjualan, dan bobot `SPK SAW` melalui `web/admin-web`. |
| **Single-seller B2C** | Model bisnis (*Business-to-Consumer*) dengan hanya satu pihak penjual resmi (toko tunggal) yang menjual langsung ke **Pelanggan**, tanpa fitur *marketplace* multi-vendor ([ADR-0001](../adr/0001-single-seller-b2c.md)). |
| **Supabase Auth** | Layanan autentikasi terkelola yang digunakan untuk registrasi, login, dan penerbitan sesi pengguna; tokennya diverifikasi oleh `backend` (Keputusan #2 `[ADA]`). |
| **JWT** | *JSON Web Token*; token akses bertanda tangan yang dikirim klien pada header `Authorization: Bearer <token>` untuk diautentikasi oleh `backend`. |
| **Role-Based Access Control (RBAC)** | Mekanisme pengendalian akses di `backend` berdasarkan peran pengguna (`CUSTOMER` atau `ADMIN`) setelah token `JWT` terverifikasi; bukan sekadar penyembunyian menu di UI. |
| **Signed URL** | Tautan sementara bertanda tangan kriptografis dan berumur pendek (*TTL* singkat) yang diterbitkan `backend` agar **Pelanggan** pemilik `EbookAccess` sah dapat membaca PDF dari `bucket privat`. |
| **Bucket privat** | Wadah penyimpanan objek di Supabase Storage yang akses publiknya ditutup; seluruh file PDF `e-book` wajib ditempatkan di sini dan tidak dapat diunduh bebas tanpa `signed URL` dari `backend`. |
| **Checkout** | Proses pembuatan pesanan (`Order` berstatus `PENDING` beserta `OrderItem` yang mengunci *snapshot* harga dari database) oleh **Pelanggan** sebelum pembayaran. |
| **Payment gateway** | Penyedia layanan pembayaran eksternal nyata (seperti Midtrans/Xendit) yang memproses transaksi pembayaran daring dan mengirim notifikasi status ke `backend` (Keputusan #3 `[ADA]`). |
| **Webhook** | Permintaan HTTP callback asinkron dari *payment gateway* ke endpoint `backend` untuk melaporkan perubahan status pembayaran; wajib diverifikasi *signature*-nya. |
| **Idempotensi** | Sifat operasi `backend` (khususnya *webhook* pembayaran) di mana pemrosesan ulang permintaan yang sama persis tidak menimbulkan efek ganda (tidak menggandakan `Transaction` atau `EbookAccess`). |
| **Transaksi atomik** | Eksekusi beberapa perubahan basis data (`prisma.$transaction`) sebagai satu kesatuan: seluruh langkah berhasil (*commit*) atau seluruhnya dibatalkan (*rollback*) apabila ada kegagalan. |
| **SAW** | *Simple Additive Weighting*; metode Sistem Pendukung Keputusan (`SPK SAW`) berbasis penjumlahan terbobot dari rating kinerja ternormalisasi setiap alternatif `e-book`, yang wajib dihitung **hanya di `backend`** ([ADR-0002](../adr/0002-backend-only-saw.md)). |
| **Kriteria benefit** | Kriteria SAW di mana nilai yang lebih besar dianggap lebih baik (contoh: `ratingAvg`, `salesCount`); dinormalisasi dengan $r_{ij} = x_{ij} / \max_i(x_{ij})$. |
| **Kriteria cost** | Kriteria SAW di mana nilai yang lebih kecil dianggap lebih baik (contoh: `price`); dinormalisasi dengan $r_{ij} = \min_i(x_{ij}) / x_{ij}$. |
| **Normalisasi** | Proses mengubah nilai mentah kriteria yang bersatuan berbeda ke skala seragam $[0, 1]$ pada matriks $R$ sebelum dikalikan bobot. |
| **Nilai preferensi** | Skor akhir alternatif pada metode SAW yang dihitung sebagai $V_i = \sum_{j=1}^{n} w_j \cdot r_{ij}$ dan digunakan untuk mengurutkan peringkat rekomendasi. |
| **Tie-breaker** | Aturan penentuan urutan deterministik ketika dua atau lebih `e-book` memiliki **nilai preferensi** SAW yang sama persis (dalam proyek ini: pengurutan alfabetis judul A–Z). |
| **Prisma** | *Object-Relational Mapper* (**Prisma 7** dengan `prisma.config.ts`) yang digunakan `backend` untuk mendefinisikan skema, migrasi, dan kueri PostgreSQL Supabase secara *type-safe*. |
| **Zod** | Pustaka validasi skema TypeScript yang digunakan `backend` untuk memvalidasi variabel lingkungan serta seluruh input request (body, query, params). |
| **Riverpod** | Pustaka *state management* dan *dependency injection* yang dikunci untuk aplikasi mobile Flutter `mobile/ebook_store`. |
| **Dio** | Pustaka HTTP client yang dikunci untuk komunikasi REST API antara aplikasi mobile Flutter `mobile/ebook_store` dan `backend`. |
| **Neo-brutalism** | Gaya desain antarmuka visual (kontras tegas, garis tepi tebal, 3 zona intensitas) yang dikunci untuk aplikasi `web/admin-web`. |
