# Register Kesenjangan Keamanan (`Security Gap Register`)

**Status:** `[ADA]` (hasil audit jujur kondisi keamanan aktual repository)  
**Tujuan:** Mencatat seluruh kesenjangan kontrol keamanan, inkonsistensi, dan keputusan terbuka yang memengaruhi postur keamanan sistem sebelum rilis produksi.

---

## Daftar Gap & Keputusan Keamanan

| ID | Gap atau Keputusan | Dampak pada Keamanan | Dokumen Sumber | Status | Tindakan Lanjutan |
|---|---|---|---|---|---|
| **GAP-SEC-01** | Sistem belum dapat diklaim aman secara operasional | Seluruh fitur bisnis, DB, dan UI belum berjalan | `security-overview.md` | `[RENCANA]` | Selesaikan implementasi & uji seluruh kontrol |
| **GAP-SEC-02** | Sinkronisasi `User` ke PostgreSQL belum ada | Role DB & `User.isActive` belum dicek saat request | `auth.middleware.ts` | `[RENCANA]` | Implementasi `POST /auth/sync` & lookup DB |
| **GAP-SEC-03** | `sensitiveEndpointLimiter` belum dipasang di `app.ts` | Endpoint rentan brute-force & request flood | `backend/src/app.ts` | `[RENCANA]` | Pasang rate limiter pada route sensitif |
| **GAP-SEC-04** | Inkonsistensi kode error `UNAUTHORIZED` vs `UNAUTHENTICATED` | Klien bisa menerima kode error berbeda dengan katalog | `auth.middleware.ts`, `error-catalog.md` | `[ADA]` konflik | Seragamkan kode error `401` |
| **GAP-SEC-05** | Verifikasi signature webhook belum ada | Risiko aktivasi akses palsu bila endpoint dibuka | `webhook-contract.md` | `[RENCANA]` | Implementasi verifikasi HMAC/raw body |
| **GAP-SEC-06** | Idempotensi webhook belum diimplementasikan | Risiko duplikasi `Transaction` & `EbookAccess` | `webhook-contract.md` | `[RENCANA]` | Cek status final `Payment` sebelum mutasi |
| **GAP-SEC-07** | Transaksi atomik `prisma.$transaction` belum ada | Risiko *partial commit* saat pembayaran sukses | `transaction-workflow.md` | `[RENCANA]` | Bungkus mutasi pelunasan dalam `prisma.$transaction` |
| **GAP-SEC-08** | Pengecekan `EbookAccess` runtime belum ada | Kontrol akses PDF belum aktif di API | `ebook-access.md` | `[RENCANA]` | Cek `(userId, ebookId, isRevoked=false)` |
| **GAP-SEC-09** | Endpoint signed URL (`/ebooks/:id/access-url`) belum ada | Pembacaan PDF privat belum berjalan | `api-spec.yaml` | `[RENCANA]` | Hubungkan endpoint dengan `createPrivatePdfSignedUrl` |
| **GAP-SEC-10** | Upload PDF ke bucket privat belum diuji | Validasi MIME/ukuran & storage privat belum terverifikasi | `ebook-catalog.md` | `[RENCANA]` | Bangun & uji upload admin ke `ebooks-private` |
| **GAP-SEC-11** | Audit log keamanan belum tersedia | Sulit melacak insiden login gagal / perubahan akses | `security-overview.md` | `[RENCANA]` | Rancang logging terstruktur untuk event kritis |
| **GAP-SEC-12** | Backup database Supabase belum dikonfigurasi | Risiko kehilangan data transaksi jika terjadi insiden | `deployment-database.md` | `[RENCANA]` | Aktifkan backup harian & PITR Supabase |
| **GAP-SEC-13** | Monitoring & alerting keamanan belum tersedia | Serangan / lonjakan `401`/`403`/`5xx` tidak terpantau | `security-audit-checklist.md` | `[RENCANA]` | Integrasikan monitoring error & alert produksi |
| **GAP-SEC-14** | Pemindaian secret pra-rilis belum dijalankan | Potensi kebocoran secret tidak terdeteksi otomatis | `.github/workflows/ci.yml` | `[RENCANA]` | Tambahkan secret scanning di CI/pra-rilis |
| **GAP-SEC-15** | Uji penetrasi & security test suite belum dijalankan | Kerentanan runtime belum teruji empiris | `docs/09-testing/` | `[RENCANA]` | Jalankan `TC-AUTH-*`, `TC-PAY-*`, `TC-ACC-*`, & pentest |
| **GAP-SEC-16** | Kebijakan retensi & penghapusan data belum ada | Belum ada prosedur *right to be forgotten* / retensi | `security-data-protection.md` | `[RENCANA]` | Tetapkan kebijakan retensi data sebelum go-live |
| **GAP-SEC-17** | ESLint backend belum tersedia | Potensi pola kode tidak aman tidak terdeteksi lint | `backend/package.json` | `[RENCANA]` | Pertimbangkan setup ESLint untuk `backend/` |
| **GAP-SEC-18** | `web/pengunjung-web` masih memakai `.jsx` | Tidak ada type-checking statis pada klien pengunjung | `web/pengunjung-web/package.json` | `[RENCANA]` | Migrasi ke TypeScript atau perketat validasi |
| **GAP-SEC-19** | Mobile masih berupa template counter app | Penyimpanan token aman (`flutter_secure_storage`) belum aktif | `mobile/ebook_store/lib/main.dart` | `[RENCANA]` | Implementasi auth & secure storage pada fase mobile |
| **GAP-SEC-20** | **Keputusan #5:** Hak pengubahan bobot SAW | Menentukan kontrol otorisasi endpoint bobot SAW | `keputusan-terbuka.md` | `[RENCANA]` | Kunci keputusan sebelum implementasi SAW |
| **GAP-SEC-21** | **Keputusan #6:** Fitur review & rating | Potensi model `Review` baru perlu proteksi spam/IDOR | `keputusan-terbuka.md` | `[RENCANA]` | Tetapkan ruang lingkup model `Review` |
| **GAP-SEC-22** | **Keputusan #7:** E-book tanpa rating (`ratingAvg = 0`) | Edge case normalisasi SAW yang harus aman dari `NaN` | `keputusan-terbuka.md` | `[RENCANA]` | Verifikasi lewat unit test SAW |
| **GAP-SEC-23** | **Keputusan #9:** Jumlah kriteria SAW (4 vs 5) | Memengaruhi skema validasi bobot `Σ = 1.0` | `keputusan-terbuka.md` | `[RENCANA]` | Finalisasi kriteria sebelum implementasi |
| **GAP-SEC-24** | **Keputusan #10:** Platform hosting backend | Memengaruhi TLS, firewall, env manager, & rate limit | `keputusan-terbuka.md` | `[RENCANA]` | Kunci hosting produksi sebelum deployment |
| **GAP-SEC-25** | **Keputusan #11:** Snapshot historis SAW | Kebutuhan audit trail hasil rekomendasi SAW | `keputusan-terbuka.md` | `[RENCANA]` | Tentukan kebutuhan tabel snapshot |
| **GAP-SEC-26** | CSP (`Content-Security-Policy`) masih default Helmet | Kebijakan script/resource produksi belum dikustomisasi | `security-api-hardening.md` | `[RENCANA]` | Sesuaikan CSP dengan domain resmi saat produksi |
| **GAP-SEC-27** | HSTS belum dikonfigurasi eksplisit untuk produksi | Perlindungan downgrade HTTP perlu ditegakkan di prod | `security-api-hardening.md` | `[RENCANA]` | Aktifkan HSTS di reverse proxy / Helmet produksi |
| **GAP-SEC-28** | Mekanisme refresh token klien belum dirancang | Penanganan sesi kedaluwarsa di web & mobile belum lengkap | `security-authentication.md` | `[RENCANA]` | Rancang refresh flow Supabase Auth di klien |
| **GAP-SEC-29** | Belum ada WAF (*Web Application Firewall*) | Proteksi lapisan jaringan terhadap DDoS/bot belum ada | `security-api-hardening.md` | `[RENCANA]` | Pertimbangkan WAF CDN (Cloudflare/platform) saat prod |
