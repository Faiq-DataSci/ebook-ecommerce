# Design Assumptions, Conflicts, and Gaps (`design-assumptions-and-gaps.md`)

**Status:** `[ADA]` (4 keputusan terkunci & skema Prisma awal) | `[RENCANA]` (7 keputusan terbuka, konflik dokumen yang perlu diselaraskan, serta risiko desain).

Dokumen ini merangkum asumsi desain, konflik antar dokumen yang ditemukan selama audit `docs/01-design/`, dependensi keputusan terbuka pada [`docs/00-project/keputusan-terbuka.md`](../00-project/keputusan-terbuka.md), serta risiko desain beserta dampak keterlambatannya.

---

## 1. Keputusan Sudah Terkunci (`[ADA]`)

Keputusan berikut telah dikonfirmasi dan menjadi dasar mutlak seluruh desain pada `docs/01-design/`:

| No | Keputusan Terkunci | Referensi | Implikasi Desain |
|---|---|---|---|
| **#1** | **Portal `web/pengunjung-web/` dipertahankan** | `keputusan-terbuka.md` #1 | Seluruh diagram komponen, aliran data, dan keterlacakan pelanggan mencakup baik `mobile/ebook_store` maupun `web/pengunjung-web`. |
| **#2** | **Autentikasi memakai Supabase Auth + verifikasi JWT di backend** | `keputusan-terbuka.md` #2 | Desain memakai model `User` dengan `supabaseUserId` (tanpa `password_hash` di database aplikasi); backend memverifikasi JWT sebelum mengakses database. |
| **#3** | **Pembayaran memakai Payment Gateway nyata sejak awal** | `keputusan-terbuka.md` #3 | Desain wajib mencakup inisiasi pembayaran eksternal dan webhook terverifikasi *signature* yang idempoten. |
| **#4** | **Akses PDF hanya via *In-App Reader* & *Signed URL* privat** | `keputusan-terbuka.md` #4 | Bucket Supabase Storage wajib privat; tidak ada unduhan publik bebas; akses hanya setelah verifikasi `EbookAccess` aktif (`!isRevoked`). |
| **ADR-1** | **Model bisnis Single-Seller (B2C)** | `adr/0001-single-seller-b2c.md` | Hanya ada 2 aktor (`Pelanggan` dan `Admin`); tanpa entitas toko/vendor. |
| **ADR-2** | **Perhitungan SAW hanya di backend** | `adr/0002-backend-only-saw.md` | Klien tidak pernah menghitung skor SAW atau mengirim bobot mentah yang langsung dipercaya. |
| **ADR-3** | **Urutan pengembangan: Backend -> Admin Web -> Mobile** | `adr/0003-admin-web-sebelum-mobile.md` | Kontrak API dan skema data distabilkan di backend sebelum UI penuh dibangun. |

---

## 2. Keputusan Terbuka (`[RENCANA]`)

Keputusan berikut **belum ditetapkan** dan tidak boleh diasumsikan sepihak pada desain implementasi:

| No | Topik Keputusan Terbuka (`keputusan-terbuka.md`) | Dampak pada Desain Sistem (`docs/01-design/`) |
|---|---|---|
| **#5** | **Pengubahan Bobot SAW:** Hanya admin atau juga pelanggan (mis. preset)? | Menentukan apakah endpoint `GET /ebooks/recommendations` menerima parameter preset dan apakah `UC-C06` memiliki alur pemilihan preferensi. |
| **#6** | **Ulasan & Rating:** Cakupan fitur ulasan/rating (siapa boleh memberi rating, moderasi, pengaruh ke SAW). | Menentukan apakah model `Review` ditambahkan ke `schema.prisma` (`class-diagram.md`) serta mekanisme pembaruan `Ebook.ratingAvg`. |
| **#7** | **Kebijakan E-Book Tanpa Rating:** Perlakuan skor SAW untuk e-book baru (`ratingAvg = 0`). | Menentukan aturan normalisasi *edge case* pada Activity Diagram SAW (#3) dan unit test backend. |
| **#8** | **Identitas Aplikasi:** Nama final aplikasi dan desain logo. | Berdampak pada penamaan tampilan UI `admin-web`, `pengunjung-web`, dan `ebook_store` (tidak mengubah skema backend). |
| **#9** | **Konflik Kriteria & Bobot SAW:** 4 kriteria (`0,35 / 0,30 / 0,20 / 0,15`) vs 5 kriteria pada perhitungan manual awal. | **Kritis:** Menentukan jumlah kriteria, tipe (`Benefit`/`Cost`), dan kolom sumber pada `Ebook` / `SawCriterionConfig`. |
| **#10** | **Hosting Backend:** Vercel Functions (serverless) vs layanan Node.js *long-running*. | Memengaruhi manajemen koneksi Prisma/PostgreSQL (pooling) dan stabilitas endpoint webhook. |
| **#11** | **Riwayat Rekomendasi SAW:** Perlu atau tidaknya menyimpan snapshot hasil SAW per pengguna/sesi. | Menentukan perlu tidaknya tabel `SawCalculationSnapshot` di `schema.prisma` dan langkah penyimpanan pada Sequence Diagram #5. |

---

## 3. Konflik & Inkonsistensi Antar Dokumen yang Ditemukan (`[RENCANA]` untuk Diselaraskan)

| No | Lokasi Konflik | Uraian Konflik | Penanganan Sementara di `docs/01-design/` |
|---|---|---|---|
| **K-1** | `docs/04-database/*` vs `backend/prisma/schema.prisma` | Dokumen `04-database/` (`data-dictionary.md`, `erd.md`) masih memakai entitas terpisah `customers` & `admins` (dengan `password_hash`) serta `order_details`, dan `database-design.md` menyebut `schema.prisma` belum ada. Faktanya, `backend/prisma/schema.prisma` (`[ADA]`) sudah memakai tabel tunggal `users` (`supabaseUserId`, `UserRole`) dan `order_items`. | `class-diagram.md` mengikuti `backend/prisma/schema.prisma` (`[ADA]`) dan mencatat perbedaan ini secara eksplisit tanpa mengubah `04-database/` atau `schema.prisma`. |
| **K-2** | `docs/05-api/api-endpoints.md` vs Keputusan #2 (`Supabase Auth`) | `api-endpoints.md` masih mencantumkan `POST /api/v1/auth/register` dan `/auth/login` dengan validasi password lokal, padahal Keputusan #2 menetapkan Supabase Auth dengan verifikasi JWT di backend. | Sequence Diagram #1 dan Activity Diagram #1 mengikuti Keputusan #2 (login di Supabase Auth -> verifikasi JWT di backend). |
| **K-3** | Penamaan Endpoint Akses PDF & SAW | `api-endpoints.md` menulis `/api/v1/ebooks/:id/access` dan `/api/v1/ebooks/recommendations`, sedangkan `requirements.md` menulis `/api/v1/ebooks/:id/access-url` dan `/api/v1/recommendations/saw`. | Dicatat sebagai variasi rancangan `[RENCANA]`; kontrak final perlu diselaraskan di `05-api/` dan `02-api/api-spec.yaml` sebelum implementasi Fase 1. |
| **K-4** | Entitas Penulis (`BR-A05` / `use-cases.md` vs `schema.prisma`) | `use-cases.md` dan `BR-A05` menyinggung manajemen penulis terpisah, sedangkan `schema.prisma` menyimpan `author` sebagai string pada `Ebook`. | Tidak dimodelkan sebagai entitas terpisah di `class-diagram.md`; dicatat sebagai `[RENCANA]` jika suatu saat dipisah. |
| **K-5** | Konvensi Visual Diagram Lama (`Times New Roman`, `#FFFFFF`) vs Mermaid | File kerangka lama di `01-design/` mencantumkan catatan font Times New Roman / latar putih, sedangkan rendering standar Markdown menggunakan Mermaid. | Seluruh diagram dibuat dengan Mermaid yang bersih dan mudah dirender agar portabel di repository. |

---

## 4. Asumsi Desain & Risiko Keterlambatan Keputusan

### 4.1 Asumsi Desain yang Digunakan (Sementara)
1. Satu pengguna memiliki tepat satu `role` (`CUSTOMER` atau `ADMIN`) pada tabel `users` sesuai `schema.prisma`.
2. Satu pesanan dapat berisi beberapa e-book berbeda (`OrderItem` unik per `(orderId, ebookId)`), namun tidak mendukung kuantitas `> 1` untuk judul yang sama.
3. Penghapusan kategori ditolak bila masih dipakai e-book (`Restrict`), dan e-book yang sudah pernah dipesan dinonaktifkan melalui `isActive = false` (non-hard-delete).

### 4.2 Risiko Desain & Dampak Keterlambatan Keputusan

| Risiko | Terkait Keputusan | Dampak Bila Keputusan Terlambat Dibuat (Melewati Milestone M1) |
|---|---|---|
| **Perubahan ulang skema database & migrasi Prisma** | #6, #9, #11 | Mengakibatkan migrasi ulang PostgreSQL, perubahan kontrak DTO API, dan penyesuaian ulang unit test SAW. |
| **Ketidakcocokan perhitungan manual akademik vs unit test backend** | #7, #9 | Risiko nilai/peringkat SAW di laporan akademik tidak identik dengan hasil API `backend/`. |
| **Penyesuaian arsitektur koneksi DB & timeout webhook** | #10 | Jika berpindah ke serverless di akhir proyek, perlu refaktor pooling Prisma dan penanganan *cold start* webhook. |
| **Revisi UI klien sebelum rilis** | #5, #8 | Perubahan nama/logo atau penambahan pemilih preset SAW memaksa pembaruan komponen di `admin-web`, `pengunjung-web`, dan `ebook_store`. |
