# Register Kesenjangan ADR (`ADR Gap Register`)

**Status:** `[ADA]` (hasil audit jujur kesenjangan keputusan & implementasi ADR saat ini)  
**Referensi Utama:** [`docs/00-project/keputusan-terbuka.md`](../00-project/keputusan-terbuka.md), [`docs/adr/README.md`](./README.md), [`backend/src/app.ts`](../../backend/src/app.ts).

---

## Daftar Gap & Keputusan yang Masih Membutuhkan ADR / Penyelesaian

| ID | Gap atau Keputusan | Dampak pada ADR & Arsitektur | Dokumen Sumber | Status | Tindakan Lanjutan |
|---|---|---|---|---|---|
| **GAP-ADR-01** | **Keputusan #5:** Pengubahan bobot SAW | Menentukan apakah pelanggan boleh memilih preset bobot atau terkunci oleh Admin | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` | Kunci di Milestone M1 lalu buat `ADR-0008` |
| **GAP-ADR-02** | **Keputusan #6:** Fitur ulasan & rating (`Review`) | Menentukan penambahan model `Review` & mekanisme update `Ebook.ratingAvg` | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` | Kunci cakupan `Review` di M1 lalu buat ADR bila perlu |
| **GAP-ADR-03** | **Keputusan #7:** Kebijakan e-book tanpa rating (`ratingAvg = 0`) | Menentukan normalisasi *edge case* SAW untuk produk baru | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` | Finalisasi di M1 & dokumentasikan dalam ADR/SAW spec |
| **GAP-ADR-04** | **Keputusan #8:** Identitas & logo final aplikasi | Berdampak pada branding UI & `applicationId` Android (non-arsitektural) | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` | Putuskan di M4; cukup di `keputusan-terbuka.md` atau ADR opsional |
| **GAP-ADR-05** | **Keputusan #9:** Konflik 4 vs 5 kriteria SAW | Menentukan struktur final bobot dan kesesuaian dengan `perhitungan-manual.md` | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` | Wajib dikunci sebelum implementasi `SawService` lalu buat ADR |
| **GAP-ADR-06** | **Keputusan #10:** Platform hosting backend (PaaS vs Serverless) | Menentukan manajemen koneksi pooler, timeout webhook, dan deployment | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` | Kunci di M5–M6 lalu buat ADR hosting produksi |
| **GAP-ADR-07** | **Keputusan #11:** Penyimpanan snapshot hasil rekomendasi SAW | Menentukan ada/tidaknya tabel `SawCalculationSnapshot` di `schema.prisma` | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` | Finalisasi sebelum migrasi SAW lalu buat ADR |
| **GAP-ADR-08** | Inkonsistensi `ADR-0002` menyebut *"penyimpanan snapshot hasil"* sementara Keputusan #11 masih terbuka | Berpotensi menimbulkan ambiguitas apakah tabel snapshot wajib dibuat di Fase 1 | [`0002-backend-only-saw.md`](./0002-backend-only-saw.md), [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[ADA]` konflik | Sinkronkan begitu Keputusan #11 dikunci |
| **GAP-ADR-09** | `ADR-0005` (Payment Gateway Nyata) belum mengunci penyedia spesifik (**Midtrans** vs **Xendit**) | Menentukan format verifikasi signature HMAC/callback token dan paket adapter backend | [`0005-payment-gateway-nyata.md`](./0005-payment-gateway-nyata.md) | `[RENCANA]` | Pilih satu penyedia gateway sebelum implementasi modul payment |
| **GAP-ADR-10** | Implementasi bisnis seluruh `ADR-0001` s.d. `ADR-0007` belum lengkap | Baru fondasi (`UserRole`, `auth.middleware.ts`, `createPrivatePdfSignedUrl`, template Vite/Flutter) yang `[ADA]` | [`docs/adr/README.md`](./README.md) | `[RENCANA]` | Eksekusi bertahap sesuai urutan `ADR-0003` (`Backend -> Admin -> Mobile`) |
| **GAP-ADR-11** | Belum ada standar/keputusan untuk struktur folder middleware backend (`src/middleware/` vs `src/middlewares/`) | Inkonsistensi lokasi file `validate.ts` vs `auth/error/rate-limit.middleware.ts` | `backend/src/` | `[ADA]` konflik | Standarkan ke satu konvensi folder pada refactor terencana |
| **GAP-ADR-12** | Belum ada keputusan & setup ESLint untuk `backend/` | Pemeriksaan gaya kode backend baru bergantung pada `tsc` | [`backend/package.json`](../../backend/package.json) | `[RENCANA]` | Putuskan standar linter backend sebelum kode bisnis membesar |
| **GAP-ADR-13** | Belum ada keputusan migrasi `.jsx` ke `.tsx` untuk `web/pengunjung-web` | Inkonsistensi tipe statis antara `admin-web` (`.tsx`) dan `pengunjung-web` (`.jsx`) | [`web/pengunjung-web/package.json`](../../web/pengunjung-web/package.json) | `[ADA]` kondisi | Evaluasi migrasi ke TypeScript sebelum Fase 3 UI penuh |
