# Panduan Penanganan Masalah (`Troubleshooting`)

**Status:** `[ADA]` (aturan teknis lingkungan dari `AGENTS.md` & `mobile/AGENTS.md`) | `[RENCANA]` (panduan operasional penuh pasca-rilis)  
**Referensi Utama:** [`docs/08-development/debugging-guide.md`](../08-development/debugging-guide.md), [`AGENTS.md`](../../AGENTS.md), [`mobile/AGENTS.md`](../../mobile/AGENTS.md), [`backend/src/config/env.ts`](../../backend/src/config/env.ts).

Dokumen ini melengkapi [`debugging-guide.md`](../08-development/debugging-guide.md) dengan fokus pada katalog gejala lintas komponen, pencegahan, dan jalur eskalasi operasional.

---

## A. Backend (Express 5 + TypeScript ESM)

| ID | Gejala | Penyebab Umum | Solusi | Pencegahan | Status |
|---|---|---|---|---|---|
| **TS-01** | Error import modul ESM saat runtime atau test (`ERR_MODULE_NOT_FOUND`) | File `.ts` mengimpor modul relatif tanpa ekstensi `.js` saat `"type": "module"` aktif | Tambahkan ekstensi `.js` pada seluruh import relatif di `backend/` | Patuhi aturan ESM `.js` pada `AGENTS.md` | `[ADA]` |
| **TS-02** | `npm --prefix backend run typecheck` (`tsc --noEmit`) gagal | Error tipe TypeScript (`strict: true`, ketidakcocokan skema Prisma/Zod) | Periksa pesan error `tsc` dan perbaiki definisi tipe | Jalankan `typecheck` sebelum commit/PR | `[ADA]` |
| **TS-03** | `npm --prefix backend test` (`vitest run`) gagal | Kegagalan assertion unit/integration test atau path import salah | Perbaiki logika kode atau assertion di `backend/tests/` | Jalankan `vitest run` setiap perubahan modul | `[ADA]` |
| **TS-04** | `npm --prefix backend run build` gagal | Error kompilasi TypeScript ke folder `dist/` | Jalankan `typecheck` terlebih dahulu lalu selesaikan error TS | Wajib lolos `build` pada pipeline rilis | `[ADA]` |
| **TS-05** | Port `3000` sudah digunakan (`EADDRINUSE`) | Proses Node.js lain masih berjalan pada port yang sama | Cek PID dengan `Get-NetTCPConnection -LocalPort 3000`, hentikan proses atau ubah `PORT` di `.env` | Gunakan graceful shutdown dan hentikan server lokal sebelum restart | `[RENCANA]` |
| **TS-06** | Variabel `.env` tidak terbaca saat boot | Entry point tidak memuat `dotenv/config` sebelum membaca `process.env` | Pastikan `import 'dotenv/config'` aktif di [`backend/src/config/env.ts`](../../backend/src/config/env.ts) | Impor `env` dari `config/env.ts` secara terpusat | `[ADA]` |
| **TS-07** | Validasi environment gagal saat startup (`process.exit(1)`) | Nilai variabel `.env` tidak memenuhi skema Zod di `env.ts` (mis. `SUPABASE_URL` bukan URL valid) | Periksa log `Invalid environment configuration` dan sesuaikan `.env` dengan `.env.example` | Validasi `.env` sebelum restart server | `[ADA]` |
| **TS-08** | Error CORS di browser (`Origin tidak diizinkan oleh kebijakan CORS`) | Origin frontend belum tercantum pada variabel `CORS_ORIGINS` | Perbarui `CORS_ORIGINS` di `.env` (dipisah koma) sesuai domain resmi | Selaraskan `CORS_ORIGINS` per lingkungan (lokal/prod) | `[ADA]` |
| **TS-09** | Rate limiter tidak membatasi request | `sensitiveEndpointLimiter` pada `rate-limit.middleware.ts` belum dipasang di `app.ts` | Pasang `sensitiveEndpointLimiter` pada route sensitif di [`backend/src/app.ts`](../../backend/src/app.ts) | Verifikasi middleware rate limiter pada checklist pra-rilis | `[RENCANA]` |

---

## B. Database (Prisma 7 + PostgreSQL Supabase)

| ID | Gejala | Penyebab | Solusi | Status |
|---|---|---|---|---|
| **TS-10** | Versi Prisma tidak sesuai saat instalasi/update | Tag `latest` npm kadang mengarah ke versi RC | Jalankan `npm view prisma dist-tags` terlebih dahulu sebelum memasang/memperbarui Prisma 7 | `[ADA]` |
| **TS-11** | Koneksi migrasi Prisma menggantung / gagal di Supabase | Menggunakan transaction pooler port `6543` untuk perintah CLI migrasi | Gunakan `DIRECT_URL` (port `5432`) di `prisma.config.ts` untuk migrasi, dan `DATABASE_URL` (port `6543`) untuk runtime | `[RENCANA]` |
| **TS-12** | `npx prisma generate` gagal | `DATABASE_URL` atau `DIRECT_URL` belum terisi / format URL salah | Isi placeholder koneksi yang valid di `backend/.env` | `[RENCANA]` |
| **TS-13** | Error `PrismaClient` tidak ditemukan (`backend/src/generated/prisma`) | Belum menjalankan generate Prisma Client setelah clone atau ubah schema | Jalankan `npx --prefix backend prisma generate` | `[RENCANA]` |
| **TS-14** | `npm --prefix backend run prisma:validate` gagal | Kesalahan sintaks atau relasi pada `backend/prisma/schema.prisma` | Perbaiki sintaks model/relasi di `schema.prisma` lalu ulangi `prisma:validate` | `[ADA]` |
| **TS-15** | `prisma migrate` gagal di tengah jalan | Koneksi DB terputus atau *schema drift* terhadap database target | Periksa `DIRECT_URL`, lakukan backup sebelum migrasi, lalu cek `prisma migrate status` | `[RENCANA]` |
| **TS-16** | Query katalog/order terasa lambat | Filter/sort sering dilakukan pada kolom tanpa indeks | Evaluasi rencana eksekusi query dan tambahkan `@@index` pada `schema.prisma` bila diperlukan | `[RENCANA]` |
| **TS-17** | Transaksi `prisma.$transaction` gagal dan tidak tersimpan | Salah satu operasi di dalam blok transaksi melempar error | Periksa log error backend; Prisma melakukan rollback otomatis untuk menjaga atomisitas | `[RENCANA]` |

---

## C. Supabase (Auth & Storage Privat)

| ID | Gejala | Penyebab | Solusi | Status |
|---|---|---|---|---|
| **TS-18** | Verifikasi JWT gagal (`401`) | Token Supabase kedaluwarsa, rusak, atau header `Authorization: Bearer` tidak valid | Minta klien melakukan refresh sesi Supabase Auth dan kirim token terbaru | `[ADA]` (middleware) |
| **TS-19** | Pemanggilan `supabase.auth.getUser()` atau admin storage error | `SUPABASE_SERVICE_ROLE_KEY` atau `SUPABASE_URL` salah/kedaluwarsa | Periksa kecocokan `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY` di secret manager backend | `[RENCANA]` |
| **TS-20** | Upload PDF e-book gagal | Bucket `SUPABASE_EBOOK_BUCKET` (`ebooks-private`) belum dibuat atau permission bermasalah | Pastikan bucket privat tersedia di Supabase Storage dan nama bucket sesuai `.env` | `[RENCANA]` |
| **TS-21** | Pembuatan signed URL gagal | `storagePath` di tabel `ebooks` tidak cocok dengan objek di Supabase Storage | Cocokkan nilai `Ebook.storagePath` dengan path file aktual di bucket privat | `[RENCANA]` |
| **TS-22** | Signed URL gagal membuka PDF (`400`/`403` dari Storage) | TTL signed URL sudah habis (default 300 detik) | Minta ulang signed URL melalui endpoint akses backend setelah memastikan `EbookAccess` aktif (`!isRevoked`) | `[RENCANA]` |
| **TS-23** | File PDF dapat diakses langsung via URL publik | Misconfig bucket Supabase Storage disetel publik atau ada policy `SELECT` untuk `anon` | Segera ubah bucket ke **Private**, hapus policy publik, dan ikuti playbook di [`maintenance-incident-response.md`](./maintenance-incident-response.md) | `[RENCANA]` |

---

## D. Payment Gateway

| ID | Gejala | Penyebab | Solusi | Status |
|---|---|---|---|---|
| **TS-24** | Webhook callback tidak pernah masuk ke backend | URL webhook masih lokal (`localhost`) atau tidak menggunakan HTTPS publik | Pastikan endpoint `POST /api/v1/payments/webhook` terekspos via HTTPS publik dan terdaftar di dashboard gateway | `[RENCANA]` |
| **TS-25** | Verifikasi signature webhook ditolak (`401`/`403`) | `PAYMENT_GATEWAY_WEBHOOK_SECRET` salah atau verifikasi memakai body yang sudah diubah parser JSON | Periksa secret webhook dan pastikan verifikasi signature menggunakan raw body/format resmi gateway | `[RENCANA]` |
| **TS-26** | Webhook duplikat memicu error atau transaksi ganda | Mekanisme idempotensi belum memeriksa status final `Payment` | Cek apakah `Payment.status` sudah `VERIFIED`/`FAILED`/`EXPIRED` sebelum mutasi di `prisma.$transaction` | `[RENCANA]` |
| **TS-27** | Nominal pada webhook berbeda dengan pesanan | Ketidaksinkronan `Payment.amount` terhadap `Order.totalAmount` | Tolak mutasi pelunasan, catat peringatan keamanan di log, dan lakukan audit manual transaksi | `[RENCANA]` |
| **TS-28** | Request ke API payment gateway timeout | Gangguan sementara pada penyedia payment gateway atau jaringan keluar | Catat error, terapkan retry aman/status `PENDING`, dan pantau halaman status penyedia gateway | `[RENCANA]` |

---

## E. Mobile (Flutter — `mobile/ebook_store`)

| ID | Gejala | Penyebab | Solusi | Status |
|---|---|---|---|---|
| **TS-29** | Emulator Android tidak dapat menghubungi backend lokal | Kode Flutter memakai `localhost` atau `127.0.0.1` | Gunakan `http://10.0.2.2:3000/api/v1` untuk emulator Android | `[ADA]` |
| **TS-30** | Perangkat fisik Android tidak dapat menghubungi backend lokal | Menggunakan `10.0.2.2` atau IP salah di perangkat fisik | Gunakan IP LAN mesin host pada jaringan Wi-Fi yang sama dan pastikan firewall mengizinkan port | `[ADA]` |
| **TS-31** | `flutter analyze` gagal di Windows terkait symlink | Windows Developer Mode belum aktif | Aktifkan *Developer Mode* di Windows Settings lalu jalankan ulang `flutter analyze` | `[ADA]` |
| **TS-32** | `flutter test` gagal | Error pada widget/unit test di `mobile/ebook_store/test/` | Perbaiki implementasi atau assertion test terkait | `[ADA]` |
| **TS-33** | `flutter build apk` / `appbundle` gagal untuk rilis | Konfigurasi signing / keystore Android belum disiapkan | Siapkan file keystore (di luar Git) dan konfigurasi `key.properties` | `[RENCANA]` |
| **TS-34** | PDF tidak tampil di aplikasi mobile | Signed URL kedaluwarsa atau package PDF viewer belum terpasang/bermasalah | Minta ulang signed URL dari backend dan periksa integrasi package PDF viewer in-app | `[RENCANA]` |

---

## F. Web (`web/admin-web` & `web/pengunjung-web`)

| ID | Gejala | Penyebab | Solusi | Status |
|---|---|---|---|---|
| **TS-35** | `npm run lint` gagal di `admin-web` atau `pengunjung-web` | Kode melanggar aturan ESLint / React Hooks | Jalankan `npm run lint -- --fix` pada folder web terkait dan perbaiki sisa error | `[ADA]` |
| **TS-36** | `npm run build` gagal di `admin-web` atau `pengunjung-web` | Error tipe TypeScript (`admin-web`) atau bundling Vite | Periksa error `tsc --noEmit` / Vite dan perbaiki impor/komponen | `[ADA]` |
| **TS-37** | Halaman web menjadi blank (`404`) saat refresh route non-root | Server static hosting belum mengarahkan fallback SPA ke `index.html` | Konfigurasikan rewrite/fallback semua route SPA ke `/index.html` pada hosting statis | `[RENCANA]` |
| **TS-38** | Web tidak dapat terhubung ke backend | `VITE_API_BASE_URL` salah atau belum diatur di `.env` / environment hosting | Perbarui `VITE_API_BASE_URL` ke URL backend yang benar lalu rebuild (`vite build`) | `[ADA]` |

---

## G. Tips Debugging Cepat di Windows PowerShell

| Perintah PowerShell | Tujuan | Status |
|---|---|---|
| `Get-NetTCPConnection -LocalPort 3000` | Menemukan PID proses yang sedang memakai port `3000` | `[ADA]` (perintah OS) |
| `Stop-Process -Id <PID>` | Menghentikan proses Node.js yang menggantung pada port tertentu | `[ADA]` (perintah OS) |
| `Get-Content backend/.env` | Memeriksa konfigurasi `.env` lokal di mesin pengembang (jangan tampilkan di log publik) | `[ADA]` (perintah OS) |
| `node -v; npm -v; flutter --version` | Memverifikasi versi runtime lokal (teruji: Node `v24.15.0`, npm `11.12.1`, Flutter `3.44.0`) | `[ADA]` |

---

## H. Jalur Eskalasi Masalah

| Level | Kriteria | Tindakan | Status |
|---|---|---|---|
| **Level 1** | Error pengembangan lokal, kesalahan konfigurasi `.env`, lint/typecheck gagal | Diselesaikan langsung oleh developer menggunakan tabel `TS-01`–`TS-38` | `[ADA]` (alur tim) |
| **Level 2** | Kegagalan migrasi staging, konflik skema, integrasi payment gateway/Supabase bermasalah | Eskalasi ke Tech Lead / Backend Lead untuk investigasi lintas komponen | `[RENCANA]` |
| **Level 3** | Insiden produksi (`P1`/`P2`): sistem down, kebocoran secret, bucket Storage publik, pembayaran gagal massal | Aktifkan prosedur pada [`maintenance-incident-response.md`](./maintenance-incident-response.md) | `[RENCANA]` |
