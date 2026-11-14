# Manajemen Environment Variables Deployment

**Status:** `[ADA]` (skema Zod `backend/src/config/env.ts` & file `.env.example`) | `[RENCANA]` (pengisian nilai produksi & manajer secret hosting)  
**Referensi Utama:** [`backend/src/config/env.ts`](../../backend/src/config/env.ts), [`backend/.env.example`](../../backend/.env.example), [`web/admin-web/.env.example`](../../web/admin-web/.env.example), [`web/pengunjung-web/.env.example`](../../web/pengunjung-web/.env.example).

---

## 1. Inventaris Variabel Lingkungan Backend (`backend/src/config/env.ts`)

Seluruh variabel di bawah ini diverifikasi langsung dari skema Zod (`envSchema`) pada `backend/src/config/env.ts` (`[ADA]`):

| Nama Variabel | Wajib / Opsional di Zod | Default Aktual | Kegunaan | Sifat |
|---|---|---|---|---|
| `PORT` | Opsional (`coerce.number`) | `3000` | Port HTTP server Express | Non-secret |
| `NODE_ENV` | Opsional (`development` / `test` / `production`) | `development` | Mode runtime Express | Non-secret |
| `CORS_ORIGINS` | Opsional (`string`) | `http://localhost:5173,http://localhost:5174` | Daftar origin web yang diizinkan CORS (dipisah koma) | Non-secret |
| `DATABASE_URL` | Opsional di schema (wajib di runtime DB) | — | Connection string PostgreSQL pooler port `6543` (`?pgbouncer=true`) | **SECRET** |
| `DIRECT_URL` | Opsional di schema (wajib saat migrasi) | — | Connection string PostgreSQL direct port `5432` untuk Prisma CLI | **SECRET** |
| `SUPABASE_URL` | Opsional di schema (`url`) | — | URL proyek Supabase (`https://PROJECT_REF.supabase.co`) | Non-secret |
| `SUPABASE_ANON_KEY` | Opsional di schema | — | Anon/public key Supabase untuk verifikasi auth klien | Publik terbatas |
| `SUPABASE_SERVICE_ROLE_KEY` | Opsional di schema | — | Kunci admin penuh Supabase (akses bucket privat & bypass RLS) | **SECRET KRITIS** |
| `SUPABASE_EBOOK_BUCKET` | Opsional (`min(1)`) | `ebooks-private` | Nama bucket privat penyimpanan file PDF | Non-secret |
| `PAYMENT_GATEWAY_SERVER_KEY` | Opsional di schema | — | Server key API Payment Gateway (Midtrans/Xendit) | **SECRET KRITIS** |
| `PAYMENT_GATEWAY_WEBHOOK_SECRET` | Opsional di schema | — | Secret verifikasi signature callback webhook gateway | **SECRET KRITIS** |

> **Catatan Audit Dokumen Lama:** Pada [`docs/08-development/environment-configuration.md`](../08-development/environment-configuration.md), masih tercantum usulan lama `JWT_SECRET` / `JWT_EXPIRES_IN` (`[RENCANA]`). Implementasi aktual di `backend/src/config/env.ts` (`[ADA]`) menggunakan **Supabase Auth** (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`), bukan `JWT_SECRET`.

> **Catatan Kesiapan Produksi (`[RENCANA]`):** Saat ini banyak field di `envSchema` masih `.optional()` agar server dapat boot untuk test dasar tanpa DB. Sebelum go-live produksi, pertimbangkan validasi ketat (`.min(1)` / wajib) saat `NODE_ENV === 'production'`.

---

## 2. Inventaris Variabel Lingkungan Frontend Web (`VITE_*`)

Berlaku untuk `web/admin-web/.env.example` dan `web/pengunjung-web/.env.example` (`[ADA]`):

| Nama Variabel | Contoh Lokal (`[ADA]`) | Contoh Produksi (`[RENCANA]`) | Sifat |
|---|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:3000/api/v1` | `https://api.domain-anda.tld/api/v1` | Publik (tertanam di bundle) |
| `VITE_SUPABASE_URL` | `https://PROJECT_REF.supabase.co` | `https://<PROJECT_REF_PROD>.supabase.co` | Publik |
| `VITE_SUPABASE_ANON_KEY` | `ganti_dengan_supabase_anon_key` | `<anon_key_proyek_prod>` | Publik (terbatas RLS) |

---

## 3. Konfigurasi Lingkungan Mobile (`mobile/ebook_store/`) `[RENCANA]`

- Tidak menggunakan file `.env` berbasis Vite.
- Konfigurasi `API_BASE_URL` direncanakan menggunakan `--dart-define` saat `flutter run` / `flutter build` atau file konfigurasi non-secret di `lib/core/config/` (`[RENCANA]`).
- Nilai target: `http://10.0.2.2:3000/api/v1` (emulator Android), `http://<IP_LAN>:3000/api/v1` (perangkat fisik lokal), dan `https://<domain-backend>/api/v1` (produksi).

---

## 4. Aturan Pengelolaan `.env` & Secret

1. `.gitignore` di root repository wajib mengabaikan `.env` dan `.env.*` (kecuali `!.env.example`).
2. Dilarang menaruh kredensial nyata, token JWT, `DATABASE_URL` berpassword, atau `SUPABASE_SERVICE_ROLE_KEY` di dalam dokumentasi, kode sumber, atau commit Git.
3. Di lingkungan produksi, seluruh secret disuntikkan melalui *Environment Variables Manager* platform hosting (bukan dengan mengunggah file `.env` ke server).
