# Arsitektur Data (`Data Architecture`)

**Status:** `[ADA]` (definisi 8 model transaksional & 3 enum pada [`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma)) | `[RENCANA]` (migrasi SQL, data `SPK SAW`, snapshot rekomendasi, dan `Review`)

---

## 1. Sumber Data & Pemisahan Penyimpanan

- **Basis Data Transaksional:** **PostgreSQL Supabase** (diakses via **Prisma 7** dari `backend/`) menyimpan seluruh data terstruktur, relasional, dan finansial.
- **Penyimpanan File Objek:** **Supabase Storage (`bucket privat`)** menyimpan file PDF `e-book` secara terpisah; PostgreSQL hanya menyimpan referensi `storagePath`.

---

## 2. Domain Data & Kepemilikan

| Domain Data | Entitas Utama | Pemilik Data | Operasi Utama | Retensi atau Aturan | Status |
|---|---|---|---|---|---|
| **Pengguna** | `User` (`users`) | Supabase Auth (identitas) & Backend (profil/role) | Sinkronisasi profil, cek role & `isActive` | `supabaseUserId` & `email` unik; non-hard-delete | `[ADA]` model / `[RENCANA]` migrasi |
| **Kategori** | `Category` (`categories`) | Admin | CRUD kategori, filter katalog | `slug` unik; `onDelete: Restrict` terhadap `Ebook` | `[ADA]` model / `[RENCANA]` migrasi |
| **Katalog E-Book** | `Ebook` (`ebooks`) | Admin | CRUD metadata, arsip (`isActive`), baca publik | `storagePath` disembunyikan dari API publik; `price` `Decimal(12,2)` | `[ADA]` model / `[RENCANA]` migrasi |
| **Pesanan & Item** | `Order`, `OrderItem` | Pelanggan (pembuat) & Backend (kalkulasi) | Buat order, *snapshot* `unitPrice`, pantau status | `totalAmount` & `unitPrice` diambil dari DB; `@@unique([orderId, ebookId])` | `[ADA]` model / `[RENCANA]` migrasi |
| **Pembayaran** | `Payment` (`payments`) | Backend & Payment Gateway | Inisiasi bayar, update status via *webhook* | Simpan `externalRef`; dukung percobaan ulang per `Order` | `[ADA]` model / `[RENCANA]` migrasi |
| **Transaksi Resmi** | `Transaction` (`transactions`) | Backend | Pencatatan buku besar saat `Payment` `VERIFIED` | `orderId` & `paymentId` unik (1-to-1) cegah duplikasi | `[ADA]` model / `[RENCANA]` migrasi |
| **Hak Akses E-Book** | `EbookAccess` (`ebook_accesses`) | Backend & Admin (kontrol `isRevoked`) | Aktivasi atomik saat `PAID`, cek baca, cabut akses | `@@unique([userId, ebookId])`; pembeli lama tetap akses meski e-book diarsip | `[ADA]` model / `[RENCANA]` migrasi |
| **File PDF E-Book** | Objek di `Bucket Privat` | Admin (unggah) & Backend (issuer) | Unggah privat, terbit `signed URL` TTL singkat | Tidak pernah dibuka publik; baca hanya via `signed URL` | `[RENCANA]` |
| **Konfigurasi & Snapshot SAW** | `SawCriterionConfig`, `SawCalculationSnapshot` | Admin / Backend SAW | Simpan bobot (`Σ = 1.0`) & snapshot audit | Menunggu Keputusan #5, #9, dan #11 | `[RENCANA]` |
| **Ulasan & Rating** | `Review` | Pelanggan (pembeli sah) | Beri rating `1–5` & hitung `ratingAvg` | Menunggu Keputusan #6 dan #7 | `[RENCANA]` |

---

## 3. Aturan Integritas, Privasi, & Risiko Data

1. **Integritas Relasi:** `onDelete: Restrict` menjaga riwayat pembelian dan `EbookAccess` tetap utuh ketika katalog diarsipkan (`isActive = false`).
2. **Keamanan Data Pribadi Pelanggan:** Endpoint pelanggan wajib memfilter berdasarkan `req.user.id` dari `JWT` terverifikasi (anti-IDOR) dan tidak mengembalikan data pribadi pengguna lain.
3. **Presisi Moneter & Larangan Harga Klien:** Seluruh nominal uang menggunakan `Decimal(12,2)`; `backend/` dilarang memercayai harga atau total pesanan dari request klien.
4. **Risiko Data Duplikat Akibat Webhook:** Ditangani melalui pengecekan status final (`idempotensi`) dan batasan unik `orderId`/`paymentId` pada `Transaction` serta `(userId, ebookId)` pada `EbookAccess`.

> **Catatan Sinkronisasi:** Dokumen lama pada `docs/04-database/` masih memakai penamaan `customers`, `admins`, dan `order_details`, sedangkan skema aktual `schema.prisma` (`[ADA]`) memakai `users` dan `order_items`.
