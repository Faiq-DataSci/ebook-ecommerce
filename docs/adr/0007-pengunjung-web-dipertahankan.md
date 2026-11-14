# ADR-0007: Portal Pengunjung Web (`web/pengunjung-web/`) Dipertahankan

## Status
Diterima

- **Status Keputusan:** Diterima (Keputusan #1 `[ADA]` di `keputusan-terbuka.md`)
- **Status Implementasi:** `[ADA]` scaffold template Vite (`web/pengunjung-web/`) & lint/build | `[RENCANA]` implementasi fitur bisnis pelanggan
- **Tanggal Keputusan:** 2026-11-14
- **Tanggal Pembaruan:** 2026-11-14
- **Pemutus:** Pemilik Proyek & Tim Pengembang
- **Pengganti:** Tidak ada

## Konteks
Aplikasi mobile Android (`mobile/ebook_store`) merupakan platform utama pelanggan dalam proyek ini. Namun muncul pertanyaan arsitektural apakah direktori `web/pengunjung-web/` yang sudah ada di monorepo perlu dipertahankan sebagai portal web pelanggan atau dihapus agar fokus hanya pada mobile dan `admin-web`. Tidak semua calon pengguna atau penguji ingin memasang aplikasi APK di Android hanya untuk melihat katalog, membaca rekomendasi SAW, atau melakukan pembelian.

### Faktor yang Mempengaruhi
- Aksesibilitas bagi pengguna yang mengakses sistem melalui browser desktop/mobile tanpa menginstal aplikasi.
- Ketersediaan demonstrasi sistem multi-platform (Mobile Android + Web) untuk kebutuhan akademik.
- Konsistensi penggunaan satu REST API backend yang sama tanpa duplikasi logika bisnis.

### Stakeholder
- **Pemilik Proyek & Dosen Pembimbing:** Menginginkan jangkauan akses pelanggan yang lebih luas dan demonstrasi klien multi-platform.
- **Pelanggan Web:** Membutuhkan akses katalog, rekomendasi SAW, pembelian, dan baca e-book dari browser.
- **Tim Pengembang:** Perlu menjaga agar tidak terjadi duplikasi logika bisnis maupun perbedaan aturan API antar klien.

## Alternatif yang Dipertimbangkan

### Alternatif 1: Mobile Android + Portal Pengunjung Web (`web/pengunjung-web/`)
- **Deskripsi:** Mempertahankan `web/pengunjung-web/` sebagai portal web pelanggan yang mengonsumsi REST API backend yang sama persis dengan aplikasi mobile `ebook_store`.
- **Kelebihan:** Pengguna dapat mengakses sistem tanpa instalasi APK, mendukung demonstrasi multi-platform, dan tetap terpusat pada satu backend.
- **Kekurangan:** Menambah beban pemeliharaan dua aplikasi klien pelanggan, serta terdapat perbedaan bahasa antara `pengunjung-web` (saat ini `.jsx`) dan `ebook_store` (Dart).
- **Status:** Dipilih

### Alternatif 2: Mobile Only (Menghapus `web/pengunjung-web/`)
- **Deskripsi:** Hanya menyediakan `web/admin-web/` untuk Admin dan `mobile/ebook_store/` untuk Pelanggan.
- **Kelebihan:** Mengurangi satu aplikasi frontend yang harus dibangun dan dirawat.
- **Kekurangan:** Pengguna atau penguji tanpa perangkat/emulator Android tidak dapat mencoba alur pelanggan.
- **Status:** Ditolak

### Alternatif 3: Web Only (Menghapus Aplikasi Mobile)
- **Deskripsi:** Mengganti aplikasi mobile dengan portal web responsif saja.
- **Kelebihan:** Satu basis kode antarmuka pelanggan.
- **Kekurangan:** Bertentangan dengan topik utama proyek berbasis mobile Flutter (`ebook_store`).
- **Status:** Ditolak

## Keputusan
Direktori `web/pengunjung-web/` **dipertahankan** sebagai portal web pelanggan untuk melengkapi aplikasi mobile `ebook_store`, dengan mengonsumsi REST API backend yang sama (`CUSTOMER` role) dan dilarang menyimpan logika SAW maupun secret pada klien.

### Alasan
1. Memberikan akses alternatif berbasis browser bagi pelanggan dan mempermudah demonstrasi/pengujian lintas platform.
2. Tidak menambah kompleksitas backend karena seluruh endpoint, otorisasi, dan perhitungan SAW tetap tunggal di backend.

## Konsekuensi

### Positif
- Pelanggan dapat menjelajah katalog, melihat rekomendasi SAW, membeli, dan membaca e-book tanpa menginstal aplikasi mobile.
- Satu backend melayani Mobile Android dan Pengunjung Web secara seragam.

### Negatif
- Tim perlu merawat dua codebase klien pelanggan (`web/pengunjung-web/` dan `mobile/ebook_store/`).
- Saat ini `web/pengunjung-web/` masih menggunakan JavaScript (`.jsx`) tanpa konfigurasi TypeScript seperti `web/admin-web/`.

### Netral
- Kedua klien pelanggan memakai kontrak API, validasi backend, dan alur transaksi yang identik.

## Dampak Teknis

### Arsitektur
- Pola *Multi-Client Single Backend*: `mobile/ebook_store` + `web/pengunjung-web` + `web/admin-web` -> `backend/`.

### Database
- Tidak ada dampak signifikan; skema database PostgreSQL Supabase sama untuk seluruh klien.

### API
- Tidak ada endpoint terpisah khusus `pengunjung-web`; seluruhnya memakai endpoint pelanggan (`/api/v1/ebooks*`, `/api/v1/recommendations/saw`, `/api/v1/orders*`, `/api/v1/payments*`).

### Keamanan
- Variabel `VITE_*` (`VITE_API_BASE_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) bersifat publik dan **dilarang** memuat `SUPABASE_SERVICE_ROLE_KEY` atau secret gateway.
- `CORS_ORIGINS` di backend wajib mendaftarkan domain resmi `pengunjung-web`.

### Pengujian
- Skrip `npm run lint` dan `npm run build` di `web/pengunjung-web/` sudah `[ADA]` dan lulus pada verifikasi fondasi; pengujian alur bisnis UI masih `[RENCANA]`.

### Deployment
- Di-build secara statis (`vite build` -> `dist/`) dan di-deploy ke layanan hosting statis/CDN dengan `VITE_API_BASE_URL` mengarah ke backend produksi (`[RENCANA]`).

## Referensi Silang
- **Kebutuhan:** `FR-C01`–`FR-C11` pada [`requirements.md`](../00-project/requirements.md)
- **Dokumen Arsitektur:** [`system-scope.md`](../01-project-overview/system-scope.md), [`application-architecture.md`](../02-architecture/application-architecture.md), [`architecture-decisions-summary.md`](../02-architecture/architecture-decisions-summary.md)
- **Dokumen Desain:** [`component-diagram.md`](../01-design/component-diagram.md)
- **Dokumen Modul:** Tidak ada modul khusus terpisah (mengonsumsi modul pelanggan yang sama)
- **Keputusan Terbuka:** [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) (#1 `[ADA]`)
- **ADR Terkait:** [`ADR-0001`](./0001-single-seller-b2c.md), [`ADR-0003`](./0003-admin-web-sebelum-mobile.md)
- **Bukti Teknis:** [`web/pengunjung-web/package.json`](../../web/pengunjung-web/package.json), [`web/pengunjung-web/.env.example`](../../web/pengunjung-web/.env.example)

## Catatan
Sesuai [`ADR-0003`](./0003-admin-web-sebelum-mobile.md), pembangunan fitur penuh `pengunjung-web` dijadwalkan pada Fase 3 setelah Backend dan Admin Web stabil. Evaluasi migrasi `.jsx` ke `.tsx` dicatat pada [`adr-gap-register.md`](./adr-gap-register.md).
