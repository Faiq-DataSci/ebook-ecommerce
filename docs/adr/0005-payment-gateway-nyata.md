# ADR-0005: Integrasi Payment Gateway Nyata

## Status
Diterima

- **Status Keputusan:** Diterima (Keputusan #3 `[ADA]` di `keputusan-terbuka.md`)
- **Status Implementasi:** `[RENCANA]` (integrasi SDK/API gateway & endpoint webhook belum ada; model DB `Payment` & `Transaction` sudah `[ADA]` di `schema.prisma`)
- **Tanggal Keputusan:** 2026-11-14
- **Tanggal Pembaruan:** 2026-11-14
- **Pemutus:** Pemilik Proyek & Tim Pengembang
- **Pengganti:** Tidak ada

## Konteks
Proyek ini membangun sistem informasi e-commerce e-book yang harus memproses pembayaran transaksi pembelian secara kredibel. Mengandalkan simulasi pembayaran lokal tanpa integrasi penyedia pembayaran tidak mencerminkan alur e-commerce nyata dan tidak menguji penanganan *callback webhook*, verifikasi signature, maupun atomisitas pembaruan status pesanan. Layanan payment gateway Indonesia (seperti Midtrans atau Xendit) menyediakan mode *sandbox* untuk pengujian aman serta webhook otomatis untuk berbagai metode pembayaran.

### Faktor yang Mempengaruhi
- Kredibilitas akademik dan kesesuaian alur sistem dengan praktik e-commerce produksi.
- Kebutuhan pembaruan status pembayaran otomatis dan aman melalui *webhook* server-to-server.
- Perlindungan transaksi dari manipulasi status pembayaran di sisi klien.

### Stakeholder
- **Pemilik Proyek & Dosen Pembimbing:** Menginginkan alur transaksi pembayaran nyata yang terverifikasi.
- **Tim Pengembang:** Membutuhkan kontrak API pembayaran dan webhook yang jelas untuk diuji di mode sandbox.
- **Pelanggan & Admin:** Membutuhkan kejelasan status pembayaran (`PENDING`, `VERIFIED`, `FAILED`, `EXPIRED`) dan catatan transaksi resmi.

## Alternatif yang Dipertimbangkan

### Alternatif 1: Integrasi Payment Gateway Nyata (Midtrans / Xendit)
- **Deskripsi:** Backend berkomunikasi dengan REST API payment gateway (mode sandbox saat pengembangan/uji) dan menerima callback webhook resmi untuk memfinalisasi pesanan.
- **Kelebihan:** Alur pembayaran realistis, mendukung banyak metode pembayaran, memiliki mekanisme verifikasi signature webhook, dan kredibel untuk demonstrasi akademik.
- **Kekurangan:** Ketergantungan pada layanan gateway eksternal, kompleksitas penanganan webhook/idempotensi, dan biaya transaksi bila diaktifkan di mode live.
- **Status:** Dipilih

### Alternatif 2: Simulasi Pembayaran Internal (Tombol "Bayar Langsung Sukses")
- **Deskripsi:** Klien memanggil endpoint backend yang langsung mengubah status pesanan menjadi `PAID` tanpa penyedia pembayaran.
- **Kelebihan:** Sangat cepat diimplementasikan tanpa integrasi eksternal.
- **Kekurangan:** Tidak kredibel sebagai sistem e-commerce, tidak menguji keamanan webhook, dan rentan terhadap pola manipulasi status dari klien.
- **Status:** Ditolak

### Alternatif 3: Transfer Bank Manual + Verifikasi Bukti oleh Admin
- **Deskripsi:** Pelanggan mengunggah bukti transfer dan Admin menyetujui secara manual.
- **Kelebihan:** Tidak perlu API payment gateway.
- **Kekurangan:** Akses e-book digital tidak dapat terbuka otomatis (*real-time*), beban kerja manual admin tinggi, dan tidak scalable.
- **Status:** Ditolak

## Keputusan
Sistem menggunakan integrasi **payment gateway nyata (Midtrans / Xendit)** sejak awal pengembangan (berjalan pada mode *sandbox* saat pengujian), dengan kewajiban verifikasi signature webhook, pemeriksaan nominal, idempotensi, dan eksekusi atomik di backend.

### Alasan
1. Menjamin status `Order.PAID`, pembuatan `Transaction`, dan pemberian `EbookAccess` hanya dipicu oleh bukti pembayaran sah dari gateway, bukan klaim klien.
2. Membentuk rancangan arsitektur transaksi yang siap pakai (*production-grade*) dengan perlindungan atomisitas dan idempotensi.

## Konsekuensi

### Positif
- Alur pembayaran dan rekonsiliasi transaksi bersifat otomatis dan kredibel.
- Mendukung beragam kanal pembayaran yang disediakan payment gateway.
- Menguji keandalan transaksi atomik (`prisma.$transaction`) dan penanganan duplikasi webhook.

### Negatif
- Menambah kompleksitas pengujian lokal karena webhook dari gateway membutuhkan URL HTTPS publik (atau tunnel/simulasi payload terverifikasi di integration test).
- Ketergantungan pada ketersediaan API dan kebijakan penyedia gateway terpilih.

### Netral
- Kolom `Payment.externalRef` digunakan untuk menyimpan referensi transaksi dari payment gateway.

## Dampak Teknis

### Arsitektur
- Pola komunikasi asinkron: Klien -> Backend (`POST /payments`) -> Payment Gateway -> Webhook Callback -> Backend (`POST /payments/webhook`).

### Database
- Model `Payment` (`externalRef`, `amount`, `status: PaymentStatus`, `paidAt`) dan `Transaction` (`orderId @unique`, `paymentId @unique`, `transactionCode @unique`) sudah tersedia di `backend/prisma/schema.prisma` (`[ADA]`).

### API
- Endpoint inisiasi pembayaran `POST /api/v1/payments` dan callback publik `POST /api/v1/payments/webhook` (`[RENCANA]`).

### Keamanan
- Webhook wajib memverifikasi signature kriptografis memakai `PAYMENT_GATEWAY_WEBHOOK_SECRET`, memeriksa kecocokan `Payment.amount` vs `Order.totalAmount`, menerapkan idempotensi terhadap pengiriman ulang webhook, dan membungkus pembaruan dalam `prisma.$transaction` (`[RENCANA]`).

### Pengujian
- Suite `TC-PAY-*` dan pengujian webhook sandbox (sukses, gagal, kedaluwarsa, signature invalid, webhook duplikat) (`[RENCANA]`).

### Deployment
- Membutuhkan `PAYMENT_GATEWAY_SERVER_KEY` dan `PAYMENT_GATEWAY_WEBHOOK_SECRET` yang disimpan eksklusif di environment backend (`env.ts` `[ADA]`), serta URL webhook HTTPS publik pada hosting backend.

## Referensi Silang
- **Kebutuhan:** `FR-C07`, `FR-C08`, `FR-C09`, `FR-C10`, `NFR-06` pada [`requirements.md`](../00-project/requirements.md)
- **Dokumen Arsitektur:** [`integration-architecture.md`](../02-architecture/integration-architecture.md), [`architecture-decisions-summary.md`](../02-architecture/architecture-decisions-summary.md)
- **Dokumen Desain:** [`webhook-contract.md`](../02-api/webhook-contract.md), [`transaction-workflow.md`](../03-business-process/transaction-workflow.md)
- **Dokumen Modul:** [`payment-management.md`](../06-modules/payment-management.md)
- **Keputusan Terbuka:** [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) (#3 `[ADA]`)
- **ADR Terkait:** [`ADR-0004`](./0004-supabase-auth.md), [`ADR-0006`](./0006-pdf-storage-privat-signed-url.md)
- **Bukti Teknis:** [`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma) (`Payment`, `Transaction`, `PaymentStatus`), [`backend/src/config/env.ts`](../../backend/src/config/env.ts)

## Catatan
Keputusan memakai payment gateway nyata sudah final (`Diterima`), namun pemilihan penyedia spesifik antara **Midtrans** atau **Xendit** serta pemasangan SDK/adapter terkait di `backend/package.json` masih terbuka sebelum implementasi modul pembayaran (`[RENCANA]`).
