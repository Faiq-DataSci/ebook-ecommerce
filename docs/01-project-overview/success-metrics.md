# Indikator Keberhasilan (`Success Metrics`)

**Status:** `[ADA]` (verifikasi fondasi teknis awal pada `test-results.md`) | `[RENCANA]` (seluruh target fungsional, keamanan runtime, operasional, dan `SPK SAW` masih berupa **target verifikasi**)

Dokumen ini mendefinisikan indikator keberhasilan proyek secara objektif. Tidak ada angka pengguna, proyeksi penjualan, ataupun capaian SLA yang diklaim tanpa bukti pengujian nyata di repository.

---

## 1. Indikator Keberhasilan Akademik (`[RENCANA]`)

| ID Metrik | Definisi | Cara Pengukuran | Sumber Bukti | Target (*Target Verifikasi*) | Status | Batasan Interpretasi |
|---|---|---|---|---|---|---|
| **SM-AK01** | Kelengkapan & konsistensi dokumentasi | Audit silang `docs/` terhadap `docs-proyek-ebook-ecommerce.md` dan kondisi kode aktual. | `docs/`, `AGENTS.md` | Target verifikasi: 100% fitur & dokumen berlabel `[ADA]`/`[RENCANA]` akurat tanpa klaim palsu. | `[RENCANA]` | Kelengkapan dokumen tidak menggantikan bukti pengujian kode runtime. |
| **SM-AK02** | Keterlacakan kebutuhan ke desain & uji | Pemeriksaan matriks `overview-traceability.md` & `design-traceability.md`. | `docs/01-project-overview/`, `docs/01-design/` | Target verifikasi: seluruh `BR-*` dan `FR-*` terpetakan jelas beserta gap-nya. | `[RENCANA]` | Gap akibat keputusan terbuka (#5–#11) dicatat eksplisit. |

---

## 2. Indikator Keberhasilan Fungsional (`[RENCANA]`)

| ID Metrik | Definisi | Cara Pengukuran | Sumber Bukti | Target (*Target Verifikasi*) | Status | Batasan Interpretasi |
|---|---|---|---|---|---|---|
| **SM-FN01** | Ketuntasan alur transaksi *end-to-end* | Uji integrasi & E2E: registrasi/login -> katalog -> checkout -> payment gateway -> *webhook* -> `EbookAccess`. | Vitest + Supertest, uji manual/E2E terrekam | Target verifikasi: 100% skenario *happy path* & gagal/expired di `test-cases.md` lulus. | `[RENCANA]` | Belum dapat diukur sebelum Fase 1–3 diimplementasikan. |
| **SM-FN02** | Kelengkapan fitur Admin & Pelanggan tanpa aksi palsu | Pemeriksaan seluruh tombol UI dan endpoint API yang terhubung ke database nyata. | `web/admin-web`, `web/pengunjung-web`, `mobile/ebook_store`, `backend` | Target verifikasi: 0 endpoint palsu dan 0 tombol tanpa aksi nyata. | `[RENCANA]` | Data awal uji wajib berlabel `"DATA SIMULASI"`. |

---

## 3. Indikator Keberhasilan Keamanan (`[RENCANA]`)

| ID Metrik | Definisi | Cara Pengukuran | Sumber Bukti | Target (*Target Verifikasi*) | Status | Batasan Interpretasi |
|---|---|---|---|---|---|---|
| **SM-SC01** | Penegakan autentikasi & `RBAC` di `backend` | Uji endpoint terproteksi tanpa token (`401`) dan endpoint admin dengan token `Pelanggan` (`403`). | Suite tes backend (`TC-AUTH-03` dll.) | Target verifikasi: 100% endpoint admin & privat menolak akses tidak sah (`401`/`403`). | `[RENCANA]` | Baru uji penolakan `401` dasar pada `/health`/auth kerangka yang `[ADA]`. |
| **SM-SC02** | Perlindungan PDF pada `bucket privat` | Uji permintaan akses PDF tanpa `EbookAccess` aktif (`403`) dan verifikasi status bucket privat. | `TC-ACC-01`, `TC-ACC-02`, konfigurasi Supabase | Target verifikasi: 0 file PDF dapat diakses via URL publik tanpa `signed URL` sementara. | `[RENCANA]` | Keamanan diuji di server; perlindungan tangkapan layar di OS klien bersifat *best-effort*. |
| **SM-SC03** | Kebersihan kredensial & `.env` | Audit Git & pemindaian secret sebelum commit/push. | `.gitignore`, hasil audit `security-audit` | Target verifikasi: 0 secret di Git, `VITE_*`, maupun kode Flutter. | `[ADA]` (aturan & `.gitignore`) / `[RENCANA]` (audit rilis) | Perlu dijalankan ulang setiap sebelum rilis/commit besar. |

---

## 4. Indikator Kualitas Perangkat Lunak

| ID Metrik | Definisi | Cara Pengukuran | Sumber Bukti | Target | Status | Batasan Interpretasi |
|---|---|---|---|---|---|---|
| **SM-QL01** | Kepatuhan *typecheck*, *lint*, *analyze*, dan *build* fondasi | Eksekusi CLI: `tsc --noEmit`, `npm run lint`, `npm run build`, `prisma validate`, `flutter analyze`. | [`test-results.md`](../09-testing/test-results.md) | Seluruh komponen monorepo **PASS** tanpa error. | `[ADA]` (untuk fondasi saat ini) | Baru mencerminkan kerangka awal/template; wajib diulang di tiap fase. |
| **SM-QL02** | Cakupan pengujian otomatis modul bisnis | Eksekusi `npm run test` (Vitest) dan `flutter test` mencakup seluruh modul bisnis. | `backend/tests/`, `mobile/ebook_store/test/` | Target verifikasi: seluruh skenario pada `test-cases.md` memiliki tes otomatis lulus. | `[RENCANA]` | Saat ini baru 2 file (5 tes) fondasi backend dan 1 tes template Flutter yang `[ADA]`. |

---

## 5. Indikator Operasional (`[RENCANA]`)

| ID Metrik | Definisi | Cara Pengukuran | Sumber Bukti | Target (*Target Verifikasi*) | Status | Batasan Interpretasi |
|---|---|---|---|---|---|---|
| **SM-OP01** | Idempotensi *webhook* & atomisitas transaksi | Pengiriman ulang payload *webhook* identik pada status `VERIFIED` serta simulasi kegagalan tengah transaksi. | `TC-PAY-01`, `TC-PAY-02` | Target verifikasi: 0 duplikasi `Transaction`/`EbookAccess` dan 0 *partial commit*. | `[RENCANA]` | Bergantung pada integrasi *sandbox* payment gateway nyata. |
| **SM-OP02** | Integritas riwayat & *non-hard-delete* | Uji arsip (`isActive = false`) pada `e-book` yang sudah memiliki `OrderItem` / `EbookAccess`. | Tes integrasi katalog & akses | Target verifikasi: pembeli lama tetap dapat membaca `e-book` yang diarsipkan. | `[RENCANA]` | Menunggu implementasi modul katalog & akses. |

---

## 6. Indikator `SPK SAW` (`[RENCANA]`)

| ID Metrik | Definisi | Cara Pengukuran | Sumber Bukti | Target (*Target Verifikasi*) | Status | Batasan Interpretasi |
|---|---|---|---|---|---|---|
| **SM-SW01** | Akurasi fungsi SAW terhadap perhitungan manual | Unit test membandingkan output `saw.service` dengan dataset uji manual pada [`perhitungan-manual.md`](../03-saw/perhitungan-manual.md). | Unit test Vitest SAW | Target verifikasi: 100% urutan peringkat dan skor preferensi identik (dalam toleransi pembulatan). | `[RENCANA]` | Menunggu penyelesaian Keputusan #9 (4 vs 5 kriteria). |
| **SM-SW02** | Keamanan & ketahanan *edge case* SAW | Uji penolakan bobot klien (`!= 1.0` atau negatif), pembagi nol, dan *tie-breaker* judul A–Z. | Unit test Vitest SAW | Target verifikasi: 0 `NaN`/`Infinity` dan 100% bobot tidak sah ditolak. | `[RENCANA]` | Perlakuan `e-book` tanpa rating menunggu Keputusan #7. |
