# Keamanan Basis Data (`Database Security`)

> **Status Dokumen:** `[ADA]` (Dokumentasi kebijakan keamanan data) | **Implementasi Kontrol Penuh:** `[RENCANA]`
> **Referensi:** [`AGENTS.md`](../../AGENTS.md), [`business-rules.md`](../03-business-process/business-rules.md), [`ebook-access-workflow.md`](../03-business-process/ebook-access-workflow.md)

---

## 1. Prinsip Arsitektur Keamanan Data

1. **PostgreSQL Supabase Sebagai Penyimpanan Transaksional:** Hanya menyimpan data terstruktur (pengguna, katalog, pesanan, pembayaran, transaksi, hak akses).
2. **Pemisahan Database dan Storage Privat:** File PDF disimpan di Supabase Storage **bucket privat** (bukan di PostgreSQL). Bucket PDF **dilarang** bersifat publik; `Ebook.storagePath` tidak diekspos ke endpoint katalog publik.
3. **Akses Database Eksklusif via Backend & Prisma:** Klien (`mobile/ebook_store`, `web/admin-web`, `web/pengunjung-web`) dilarang terhubung langsung ke PostgreSQL maupun menyimpan kredensial koneksi.
4. **Perlindungan Secret & Kredensial:**
   - Dilarang keras meng-commit `.env`, `DATABASE_URL`, `DIRECT_URL`, `SUPABASE_SERVICE_ROLE_KEY`, atau secret payment gateway ke repositori Git (`[ADA]` pada `.gitignore` & validasi `env.ts`).
   - Dilarang menaruh secret pada variabel `VITE_*` di `admin-web`/`pengunjung-web` maupun pada kode Flutter.
5. **Aturan Service Role & *Least Privilege*:** `SUPABASE_SERVICE_ROLE_KEY` hanya boleh dipakai di sisi backend untuk menerbitkan *signed URL* sementara atau administrasi storage privat setelah lolos verifikasi JWT + RBAC + `EbookAccess`.
6. **Perlindungan Data Pribadi Pengguna:** Password tidak disimpan di tabel `users` (dikelola Supabase Auth); query admin dan API publik membatasi field sensitif agar tidak bocor.
7. **Validasi Transaksi & Anti-Duplikasi Webhook:** Pelunasan pesanan hanya dipicu oleh verifikasi signature webhook gateway di backend dengan *idempotency check* + constraint unik `Transaction.orderId` & `Transaction.paymentId` dalam `prisma.$transaction`.

---

## 2. Matriks Aset Data, Ancaman, dan Kontrol

| Aset Data | Ancaman | Kontrol | Penanggung Jawab | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Kredensial DB & `SUPABASE_SERVICE_ROLE_KEY`** | Kebocoran secret via Git, log, atau bundle klien (`VITE_*` / Flutter) | `.gitignore`, validasi env backend (`env.ts`), pemisahan env server-only | Backend & DevOps | `[ADA]` aturan / `[RENCANA]` audit berkala |
| **File PDF E-Book (`storagePath`)** | Akses ilegal / unduh gratis tanpa membeli e-book | Bucket Supabase Storage privat + verifikasi `EbookAccess` (`!isRevoked`) + *signed URL* berumur pendek (300 detik) | Backend (`createPrivatePdfSignedUrl`) | `[ADA]` helper / `[RENCANA]` endpoint |
| **Data Pengguna (`users`)** | Eskalasi peran (`CUSTOMER` -> `ADMIN`) atau kebocoran data pribadi | `User.role` diabaikan dari input publik; verifikasi JWT + `authorize('ADMIN')` di backend | Backend (`auth.middleware.ts`) | `[ADA]` kerangka / `[RENCANA]` endpoint |
| **Data Pesanan, Pembayaran & Transaksi** | Manipulasi harga checkout atau transaksi ganda akibat webhook duplikat | Harga dihitung backend (`Ebook.price`), verifikasi signature webhook, `prisma.$transaction`, `@unique` di `Transaction` | Backend & PostgreSQL | `[ADA]` schema / `[RENCANA]` service |
| **Data Backup, Recovery & Audit Log DB** | Kehilangan data akibat insiden atau tidak adanya jejak perubahan sensitif | Kebijakan backup/restore berkala Supabase, retensi data, penghapusan data aman, dan tabel audit log | Tim Pengelola / Backend | `[RENCANA]` *(belum ada kebijakan & tabel audit)* |
