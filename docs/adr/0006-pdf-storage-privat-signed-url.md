# ADR-0006: Penyimpanan PDF di Bucket Privat & Akses via Signed URL

## Status
Diterima

- **Status Keputusan:** Diterima (Keputusan #4 `[ADA]` di `keputusan-terbuka.md`)
- **Status Implementasi:** `[ADA]` helper `createPrivatePdfSignedUrl` (`supabase-storage.ts`) & model DB `EbookAccess` | `[RENCANA]` endpoint akses PDF & in-app reader
- **Tanggal Keputusan:** 2026-11-14
- **Tanggal Pembaruan:** 2026-11-14
- **Pemutus:** Pemilik Proyek & Tim Pengembang
- **Pengganti:** Tidak ada

## Konteks
File PDF e-book adalah aset digital utama yang diperjualbelikan. Jika file PDF disimpan pada bucket publik atau diakses melalui URL statis permanen, siapa pun yang mengetahui tautan dapat mengunduh dan menyebarkan e-book secara gratis tanpa melewati alur pembayaran. Untuk melindungi hak kekayaan konten dan memastikan hanya pembeli sah yang dapat membaca e-book, dibutuhkan mekanisme penyimpanan tertutup yang dikontrol penuh oleh backend.

### Faktor yang Mempengaruhi
- Perlindungan file PDF dari akses tidak sah atau pembagian tautan permanen.
- Verifikasi kepemilikan (`EbookAccess`) dan status pencabutan akses (`isRevoked`) sebelum file dapat dibaca.
- Pengalaman baca langsung di dalam aplikasi (*in-app PDF reader*) di mobile dan web.

### Stakeholder
- **Pemilik Proyek / Admin:** Menginginkan aset PDF terlindungi dari kebocoran dan unduhan bebas.
- **Pelanggan:** Membutuhkan akses baca yang lancar untuk e-book yang sudah dibayar lunas.
- **Tim Pengembang:** Membutuhkan mekanisme penerbitan akses sementara yang terintegrasi dengan Supabase Storage.

## Alternatif yang Dipertimbangkan

### Alternatif 1: Supabase Storage Bucket Privat + Signed URL Sementara + In-App Reader
- **Deskripsi:** PDF disimpan di bucket privat (`ebooks-private`). Backend memeriksa `EbookAccess` aktif (`!isRevoked`) lalu menerbitkan signed URL ber-TTL pendek (<= 300 detik) untuk dibuka di *in-app PDF reader*.
- **Kelebihan:** File terlindungi total dari akses publik, setiap permintaan akses melewati validasi JWT & database, TTL pendek membatasi penyebaran tautan.
- **Kekurangan:** Klien harus meminta ulang signed URL baru apabila TTL kedaluwarsa saat sesi baca lama, dan tidak mendukung fitur unduhan permanen ke penyimpanan publik perangkat.
- **Status:** Dipilih

### Alternatif 2: Supabase Storage Bucket Publik
- **Deskripsi:** Menyimpan PDF di bucket publik dan menyimpannya sebagai URL langsung.
- **Kelebihan:** Implementasi sangat sederhana tanpa penerbitan signed URL.
- **Kekurangan:** URL dapat diakses siapa saja tanpa login atau pembelian, melanggar prinsip dasar e-commerce konten digital.
- **Status:** Ditolak

### Alternatif 3: Menyimpan File PDF Sebagai BLOB di PostgreSQL
- **Deskripsi:** Menyimpan binary file PDF langsung di kolom tabel PostgreSQL.
- **Kelebihan:** Semua data berada di satu database.
- **Kekurangan:** Membengkakkan ukuran database, membebani koneksi pooler & memori backend saat streaming, dan mahal dari sisi performa.
- **Status:** Ditolak

### Alternatif 4: URL Statis Permanen Melalui Proxy Manual Tanpa Expiry
- **Deskripsi:** Memberikan tautan unduhan statis permanen setelah pembelian.
- **Kelebihan:** Pengguna tidak perlu meminta ulang URL.
- **Kekurangan:** Tautan permanen mudah dibagikan ke pihak luar dan sulit dicabut per sesi apabila akses di-revoke (`isRevoked = true`).
- **Status:** Ditolak

## Keputusan
File PDF e-book wajib disimpan pada **Supabase Storage bucket privat** (`ebooks-private`). Akses baca hanya diberikan melalui **signed URL sementara** berdurasi pendek (`<= 300` detik) yang diterbitkan backend setelah memverifikasi kepemilikan `EbookAccess` aktif (`isRevoked = false`), dan hanya ditampilkan di dalam **in-app PDF reader** (tanpa fitur unduhan bebas).

### Alasan
1. Menjamin kontrol akses berbasis pembelian dan memungkinkan pencabutan akses (`isRevoked`) berlaku efektif secara *real-time*.
2. Memisahkan penyimpanan file biner berukuran besar ke Object Storage sambil menjaga metadata path tetap tersembunyi di backend.

## Konsekuensi

### Positif
- File PDF terlindungi dari akses anonim dan *hotlinking* permanen.
- Hanya pengguna terautentikasi dengan `EbookAccess` aktif yang memperoleh signed URL.
- TTL singkat (default `300` detik) menekan risiko penyalahgunaan tautan.

### Negatif
- Klien memerlukan mekanisme refresh signed URL bila pengguna membaca melewati masa berlaku URL.
- Pengguna tidak memperoleh file PDF mentah secara permanen di luar aplikasi.

### Netral
- Kolom `Ebook.storagePath` hanya menyimpan path internal di bucket privat dan **dilarang** diekspos ke endpoint katalog publik.

## Dampak Teknis

### Arsitektur
- Backend bertindak sebagai mediator tunggal ke Supabase Storage menggunakan helper `createPrivatePdfSignedUrl` (`[ADA]` di `backend/src/integrations/storage/supabase-storage.ts`).

### Database
- Model `Ebook` memiliki kolom `storagePath` dan model `EbookAccess` memiliki `@@unique([userId, ebookId])` serta `isRevoked` pada `backend/prisma/schema.prisma` (`[ADA]`).

### API
- Endpoint `GET /api/v1/ebooks/:id/access-url` (`[RENCANA]`) untuk memvalidasi `EbookAccess` milik `req.user.id` dan mengembalikan signed URL sementara.
- Endpoint admin unggah PDF ke bucket privat (`[RENCANA]`).

### Keamanan
- Bucket `SUPABASE_EBOOK_BUCKET` (`ebooks-private`) wajib dikonfigurasi **Private** tanpa policy baca `anon`.
- `SUPABASE_SERVICE_ROLE_KEY` hanya digunakan di backend untuk membuat signed URL.
- Pencegahan IDOR wajib memeriksa `userId = req.user.id` pada `EbookAccess`.

### Pengujian
- Suite uji `TC-ACC-*` dan `TC-SEC-*`: pengguna belum membeli (`403`), akses dicabut `isRevoked = true` (`403`), pemilik sah (`200` + signed URL), dan verifikasi `storagePath` tidak bocor (`[RENCANA]`).

### Deployment
- Memerlukan `SUPABASE_EBOOK_BUCKET` (default `ebooks-private`) dan `SUPABASE_SERVICE_ROLE_KEY` di environment backend (`env.ts` `[ADA]`).

## Referensi Silang
- **Kebutuhan:** `FR-C11`, `FR-A04`, `FR-A11`, `NFR-02` pada [`requirements.md`](../00-project/requirements.md)
- **Dokumen Arsitektur:** [`security-architecture.md`](../02-architecture/security-architecture.md), [`architecture-decisions-summary.md`](../02-architecture/architecture-decisions-summary.md)
- **Dokumen Desain:** [`ebook-access-workflow.md`](../03-business-process/ebook-access-workflow.md)
- **Dokumen Modul:** [`ebook-access.md`](../06-modules/ebook-access.md)
- **Keputusan Terbuka:** [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) (#4 `[ADA]`)
- **ADR Terkait:** [`ADR-0004`](./0004-supabase-auth.md), [`ADR-0005`](./0005-payment-gateway-nyata.md)
- **Bukti Teknis:** [`backend/src/integrations/storage/supabase-storage.ts`](../../backend/src/integrations/storage/supabase-storage.ts), [`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma), [`backend/src/config/env.ts`](../../backend/src/config/env.ts)

## Catatan
Helper `createPrivatePdfSignedUrl(objectPath, expiresInSeconds = 300)` sudah tersedia di repository (`[ADA]`), sedangkan integrasi ke controller/endpoint `access-url` dan *in-app PDF reader* di mobile/web masih berstatus `[RENCANA]`.
