# Prinsip Arsitektur (`Architecture Principles`)

**Status:** `[ADA]` (prinsip terkunci pada `AGENTS.md` dan ADR-0001..0003) | `[RENCANA]` (penerapan penuh pada seluruh modul bisnis runtime)

Dokumen ini menetapkan **12 prinsip arsitektur wajib** yang memandu seluruh keputusan desain dan implementasi proyek.

---

## Daftar Prinsip Arsitektur

| Prinsip | Penjelasan | Penerapan | Risiko Bila Dilanggar | Status |
|---|---|---|---|---|
| **1. Backend sebagai Sumber Otoritas Bisnis** | Seluruh otorisasi, kalkulasi harga, status pesanan, dan aturan bisnis ditegakkan di `backend/`. | Middleware `authenticate` + `authorize`, perhitungan `totalAmount` dari DB. | Manipulasi harga, bypass akses admin, atau inkonsistensi antar klien. | `[ADA]` aturan / `[RENCANA]` modul |
| **2. *Security by Default*** | Endpoint non-publik tertutup secara default kecuali diizinkan eksplisit dengan token & role sah. | `helmet`, `CORS`, Zod `validate`, rate limit, penyaringan `storagePath`. | Kebocoran data pelanggan, IDOR, atau eksekusi aksi ilegal. | `[ADA]` kerangka / `[RENCANA]` penuh |
| **3. SAW Hanya di Backend** | Perhitungan normalisasi dan skor preferensi `SPK SAW` dilarang dilakukan di klien ([ADR-0002](../adr/0002-backend-only-saw.md)). | Fungsi murni `saw.service` di `backend/` + validasi bobot `Σ = 1.0`. | Manipulasi bobot oleh klien dan perbedaan skor antar platform. | `[ADA]` keputusan / `[RENCANA]` kode |
| **4. Storage PDF Privat** | File PDF `e-book` disimpan pada `bucket privat`, hanya diakses via `signed URL` sementara setelah cek `EbookAccess`. | `createPrivatePdfSignedUrl` dengan TTL singkat di `backend/`. | Pembajakan dan unduhan bebas konten PDF berbayar. | `[ADA]` helper & keputusan #4 / `[RENCANA]` endpoint |
| **5. *Data Integrity Over Convenience*** | Integritas historis data lebih diutamakan daripada penghapusan cepat atau jalan pintas skema. | `unitPrice` snapshot di `OrderItem`, `onDelete: Restrict`, *soft-archive* `isActive`. | Riwayat pembelian rusak atau nilai transaksi historis berubah. | `[ADA]` `schema.prisma` / `[RENCANA]` migrasi |
| **6. Kontrak API Terdokumentasi** | Setiap endpoint dirancang lebih dulu di OpenAPI 3.1 dan dokumen kontrak sebelum/bersamaan kode. | [`api-spec.yaml`](../02-api/api-spec.yaml) dan [`webhook-contract.md`](../02-api/webhook-contract.md). | Ketidakselarasan kontrak antara `backend`, `web`, dan `mobile`. | `[ADA]` dokumen / `[RENCANA]` implementasi |
| **7. Status Dokumentasi Berdasarkan Bukti** | Label `[ADA]` hanya diberikan bila kode dan verifikasinya benar-benar ada di repository. | Pemisahan tegas `[ADA]` vs `[RENCANA]` di seluruh `docs/`. | Klaim palsu yang menyesatkan tim maupun penilai akademik. | `[ADA]` |
| **8. *Separation of Concerns*** | Pemisahan tanggung jawab antar lapisan (Router, Middleware, Controller, Service, Repository) dan antar aplikasi klien. | Arsitektur berlapis di `backend/` serta pemisahan `admin-web`, `pengunjung-web`, `ebook_store`. | Kode monolitik sulit diuji dan rawan efek samping lintas modul. | `[ADA]` kerangka / `[RENCANA]` modul |
| **9. *Error Handling* Konsisten** | Seluruh kesalahan dipetakan ke format JSON seragam tanpa membocorkan detail internal/stack trace. | `AppError` + `errorHandler` (`error.middleware.ts`) + [`error-catalog.md`](../02-api/error-catalog.md). | Kebocoran informasi database dan penanganan error tidak konsisten di klien. | `[ADA]` handler dasar / `[RENCANA]` kode bisnis |
| **10. *Testability* & *Traceability*** | Setiap kebutuhan harus dapat ditelusuri ke desain, kode, dan pengujian otomatis. | Matriks keterlacakan (`overview`, `design`, `api`, `architecture`) + Vitest + Flutter test. | Fitur tidak teruji atau kebutuhan bisnis hilang saat implementasi. | `[ADA]` fondasi / `[RENCANA]` bisnis |
| **11. Idempotensi untuk Proses Pembayaran** | Pemrosesan *webhook* berulang tidak boleh menggandakan transaksi maupun hak akses. | Cek status final `Payment`, kunci unik `orderId`/`paymentId`, `prisma.$transaction`. | Pencatatan ganda di laporan penjualan atau akses korup. | `[RENCANA]` |
| **12. Dokumentasi sebagai Bagian *Definition of Done*** | Perubahan fitur wajib disertai pembaruan status dokumen dan laporan hasil verifikasi nyata. | Format laporan 5 butir pada `AGENTS.md`. | Dokumentasi tertinggal jauh dari kondisi kode aktual. | `[ADA]` aturan |
