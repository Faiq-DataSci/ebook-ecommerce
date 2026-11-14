# Perlindungan Data & Konten Digital (`Data & PDF Protection`)

**Status:** `[ADA]` (helper `createPrivatePdfSignedUrl`, `.gitignore`, skema `schema.prisma`) | `[RENCANA]` (endpoint akses, audit, kebijakan retensi & backup)

---

## 1. Perlindungan File PDF (Supabase Storage Privat)

- **Bucket Privat (`ebooks-private`):** File PDF dilarang disimpan pada bucket publik atau diakses via URL permanen.
- **Signed URL Sementara (`[ADA]` helper):** `createPrivatePdfSignedUrl(objectPath, expiresInSeconds = 300)` di [`supabase-storage.ts`](../../backend/src/integrations/storage/supabase-storage.ts) menerbitkan URL bertanda tangan berumur default 300 detik (5 menit).
- **Verifikasi `EbookAccess` (`[RENCANA]`):** Sebelum menerbitkan signed URL, backend wajib memastikan record `(userId, ebookId)` ada dan `isRevoked === false`. Jika dicabut (`isRevoked = true`) atau belum membeli -> `403 EBOOK_ACCESS_DENIED`.
- **Perlindungan `storagePath`:** Kolom `Ebook.storagePath` hanya dipakai internal backend dan **tidak boleh** muncul pada respons API publik maupun detail e-book.
- **Akses Pembeli Lama:** Jika e-book diarsipkan (`isActive = false`), pembeli sah lama tetap dapat membaca PDF-nya melalui *in-app reader*.

---

## 2. Perlindungan Data Pribadi Pelanggan (PII)

- **Tanpa `password_hash` (`[ADA]` skema):** Backend tidak menyimpan password maupun hash password karena autentikasi dikelola Supabase Auth.
- **Minimalisasi Eksposur Field:** `supabaseUserId` dan data sensitif internal tidak diekspos di respons publik.
- **Anti-IDOR (`[RENCANA]`):** Query pesanan, pembayaran, transaksi, dan akses pelanggan selalu memfilter `userId = req.user.id`.
- **Anti-Enumeration:** Pesan error login harus generik tanpa membocorkan apakah suatu email terdaftar.

---

## 3. Perlindungan Secret & Kredensial

- `.gitignore` (`[ADA]`) mengabaikan `.env`, `.env.*` (kecuali `!.env.example`), `*.pem`, `*.key`, `*.keystore`, `*.jks`.
- `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `DIRECT_URL`, `PAYMENT_GATEWAY_SERVER_KEY`, dan `PAYMENT_GATEWAY_WEBHOOK_SECRET` **hanya** boleh berada di backend.
- Ketiganya dilarang keras pada `VITE_*` (`web/*`) maupun kode `mobile/ebook_store`.
- Prosedur rotasi secret berkala berstatus `[RENCANA]`.

---

## 4. Integritas Data Transaksional (`schema.prisma`)

- **Harga dari DB (`[RENCANA]`):** `Order.totalAmount` dihitung dari `Ebook.price` di database; `OrderItem.unitPrice` (`Decimal(12,2)`) menyimpan snapshot harga saat checkout.
- **Immutability `Transaction`:** Catatan `Transaction` tidak boleh dimodifikasi/dihapus demi integritas audit keuangan.
- **Constraint Unik (`[ADA]` skema):** `@@unique([orderId, ebookId])` pada `OrderItem`, `@@unique([userId, ebookId])` pada `EbookAccess`, serta `Transaction.orderId @unique` dan `Transaction.paymentId @unique`.
- **Proteksi Penghapusan (`[ADA]` skema):** Relasi `onDelete: Restrict` mencegah penghapusan permanen `User`, `Category`, `Ebook`, `Order`, dan `Payment` yang sudah berelasi transaksi (non-hard-delete).

---

## 5. Data Retention & Backup (`[RENCANA]`)

- Kebijakan retensi data pelanggan, mekanisme penghapusan akun/anonymization, serta jadwal backup harian + Point-in-Time Recovery (PITR) PostgreSQL Supabase masih berstatus `[RENCANA]`.

---

## 6. Matriks Aset Data & Kontrol

| Aset Data | Lokasi | Ancaman Utama | Kontrol | Status |
|---|---|---|---|---|
| **File PDF E-Book** | Supabase Storage (`ebooks-private`) | Akses tanpa bayar, kebocoran URL | Bucket privat + cek `EbookAccess` + signed URL 300s | `[ADA]` helper / `[RENCANA]` endpoint |
| **Data Pengguna (PII)** | PostgreSQL (`users`) | IDOR, kebocoran email/profil | Filter `req.user.id`, tanpa `password_hash`, error generik | `[ADA]` skema / `[RENCANA]` handler |
| **Data Transaksi** | PostgreSQL (`orders`, `payments`, `transactions`) | Manipulasi harga, duplikasi, partial commit | Hitung DB, `Decimal(12,2)`, `prisma.$transaction`, `Restrict` | `[ADA]` skema / `[RENCANA]` logika |
| **Secret & Keys** | Env Manager Backend | Kebocoran via Git / `VITE_*` / Flutter | `.gitignore`, pemisahan env, rotasi | `[ADA]` `.gitignore` / `[RENCANA]` audit |
| **Token JWT** | Klien (`flutter_secure_storage` / Web) | Pencurian token di perangkat | Secure storage (mobile), TLS/HTTPS | `[RENCANA]` |
| **Bobot & Skor SAW** | Backend Config / DB | Manipulasi peringkat oleh klien | SAW murni di backend (`ADR-0002`), validasi admin | `[RENCANA]` |
