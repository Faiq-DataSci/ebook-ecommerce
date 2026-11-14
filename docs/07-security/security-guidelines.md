# Pedoman Keamanan Pengembangan (`Security Guidelines`)

**Status:** `[ADA]` (aturan proyek pada `AGENTS.md`, `mobile/AGENTS.md`, & `.gitignore`) | `[RENCANA]` (penerapan menyeluruh pada fitur bisnis)

---

## 1. Perlindungan Kredensial dan Environment Variables

1. **Dilarang menaruh secret di repository:** Tidak boleh ada API key, password database, `SUPABASE_SERVICE_ROLE_KEY`, atau secret gateway di dalam kode sumber, dokumen, atau commit Git (`[ADA]` aturan).
2. **Pemisahan Environment Klien vs Server:**
   - Variabel `VITE_*` (`web/admin-web`, `web/pengunjung-web`) disematkan ke bundle JavaScript publik saat build.
   - Aplikasi Flutter (`mobile/ebook_store`) tidak boleh menyimpan kunci privat atau mengakses database/Storage privat secara langsung.
3. **`.env.example` Wajib Non-Rahasia (`[ADA]`):** Tersedia di `backend/.env.example`, `web/admin-web/.env.example`, dan `web/pengunjung-web/.env.example` dengan nilai placeholder.

### Daftar Variabel Sensitif yang Dilarang di Klien (`VITE_*` & Flutter)

| Variabel | Hanya di Backend? | Dilarang di `VITE_*`? | Dilarang di Flutter? | Alasan |
|---|---|---|---|---|
| `DATABASE_URL` | Ya | **Ya** | **Ya** | Kredensial koneksi langsung pooler PostgreSQL |
| `DIRECT_URL` | Ya | **Ya** | **Ya** | Kredensial koneksi direct PostgreSQL untuk migrasi |
| `SUPABASE_SERVICE_ROLE_KEY` | Ya | **Ya** | **Ya** | Memberi akses admin penuh & bypass RLS + baca bucket privat |
| `PAYMENT_GATEWAY_SERVER_KEY` | Ya | **Ya** | **Ya** | Kunci otorisasi API transaksi Payment Gateway |
| `PAYMENT_GATEWAY_WEBHOOK_SECRET` | Ya | **Ya** | **Ya** | Kunci verifikasi signature callback webhook |

### Daftar Variabel Aman untuk `VITE_*` (`[ADA]` di `.env.example`)
- `VITE_API_BASE_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY` (hanya kunci publik anon, tetap dilindungi otorisasi backend)

---

## 2. Keamanan API, Autentikasi, dan Otorisasi

1. **Validasi Input (`Zod`):** Semua `req.body`, `req.params`, dan `req.query` wajib divalidasi melalui `validate.ts` (`[ADA]`) sebelum masuk ke service bisnis (`[RENCANA]`).
2. **Otorisasi di Backend:** Seluruh endpoint admin wajib menggunakan `authenticate` + `authorize('ADMIN')`; menyembunyikan menu di UI hanya kosmetik.
3. **Pencegahan IDOR:** Endpoint pelanggan wajib memfilter kepemilikan berdasarkan `req.user.id`, bukan ID dari parameter body/query.
4. **SAW Backend-Only (`ADR-0002`):** Bobot dari klien publik ditolak/diabaikan.

| Endpoint | Otorisasi | Pencegahan IDOR | Validasi Zod | Status |
|---|---|---|---|---|
| `GET /api/v1/health` | Publik | Tidak relevan | Tidak perlu | `[ADA]` |
| `GET /api/v1/admin/ping` | `ADMIN` | Role check server | — | `[ADA]` |
| `GET/PATCH /api/v1/users/me` | `CUSTOMER` / `ADMIN` | Pakai `req.user.id` | Body (`PATCH`) | `[RENCANA]` |
| `POST/GET /api/v1/orders*` | `CUSTOMER` | Filter `userId = req.user.id` | Body, Params, Query | `[RENCANA]` |
| `POST/GET /api/v1/payments*` | `CUSTOMER` | Cek kepemilikan `Order` | Body, Params | `[RENCANA]` |
| `POST /api/v1/payments/webhook` | Signature Gateway | Cek `externalRef` + nominal | Body | `[RENCANA]` |
| `GET /api/v1/ebooks/:id/access-url` | `CUSTOMER` | Cek `EbookAccess(req.user.id, id)` | Params (`uuid`) | `[RENCANA]` |
| Seluruh `/api/v1/admin/*` | `ADMIN` | Role `ADMIN` di backend | Body, Params, Query | `[RENCANA]` |

---

## 3. Keamanan Transaksi dan Konten Digital (PDF)

1. **Bucket Privat untuk PDF:** File e-book disimpan di bucket `ebooks-private`; dilarang memakai bucket publik atau URL statis permanen.
2. **Signed URL Berjangka Pendek:** Diterbitkan via `createPrivatePdfSignedUrl` (`[ADA]` helper, default 300 detik) hanya setelah verifikasi `EbookAccess` aktif (`!isRevoked`).
3. **Integritas Harga:** `Order.totalAmount` dan `OrderItem.unitPrice` dihitung dari `Ebook.price` di database.
4. **Verifikasi Pembayaran:** Signature webhook, kecocokan nominal, idempotensi, dan `prisma.$transaction` wajib diterapkan.
5. **Non-Hard-Delete:** E-book yang sudah pernah dibeli tidak boleh dihapus permanen (`isActive = false`).

---

## 4. Keamanan Mobile (`Flutter — ebook_store`)

- Token sesi wajib disimpan menggunakan `flutter_secure_storage` (`[ADA]` di `pubspec.yaml` / `[RENCANA]` implementasi).
- Dilarang menyimpan secret di kode Dart atau `--dart-define`.
- Perhitungan SAW dan validasi otorisasi tetap berada di backend.
- Pembacaan PDF dilakukan *in-app* melalui signed URL sementara dari backend.
- `baseUrl` wajib memisahkan emulator (`http://10.0.2.2:3000/api/v1`), perangkat fisik LAN, dan produksi (`https://...`).

---

## 5. Keamanan Web (`admin-web` & `pengunjung-web`)

- Tidak ada secret pada `VITE_*`.
- Pengelolaan token sesi di web menggunakan mekanisme aman (`httpOnly` cookie atau *in-memory* `[RENCANA]`).
- Penerapan gaya neo-brutalism (`docs/01-design/ui-ux/design.md`) murni pada lapisan UI dan tidak boleh melemahkan kontrol otorisasi backend.

---

## 6. Konvensi Kode Aman (`backend/`)

- **ESM Wajib `.js`:** Seluruh import relatif pada file `.ts` wajib memakai ekstensi `.js` (`AGENTS.md`).
- **Query Terparameter:** Gunakan Prisma ORM; hindari string concatenation SQL mentah untuk mencegah SQL Injection.
- **Larangan Evaluasi Dinamis:** Dilarang menggunakan `eval()` atau `new Function()`.
- **Kebersihan Log:** Dilarang mencatat token JWT, password, `SUPABASE_SERVICE_ROLE_KEY`, atau stack trace ke respons klien (`errorHandler` `[ADA]`) maupun log produksi yang tidak tersanitasi.
