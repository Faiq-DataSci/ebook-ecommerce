# Konfigurasi Lingkungan (`Environment Configuration`)

**Status:** `[ADA]` (template `.env.example` & validasi Zod di `backend/src/config/env.ts`) | `[RENCANA]` (file `.env` lokal & nilai produksi)  
**Referensi Utama:** [`backend/src/config/env.ts`](../../backend/src/config/env.ts), [`backend/.env.example`](../../backend/.env.example), [`web/admin-web/.env.example`](../../web/admin-web/.env.example), [`web/pengunjung-web/.env.example`](../../web/pengunjung-web/.env.example), [`mobile/AGENTS.md`](../../mobile/AGENTS.md).

---

## 1. Aturan Keamanan Environment (`[ADA]`)

- File `.env` dan `.env.*` wajib diabaikan Git (sudah dikonfigurasi di [`.gitignore`](../../.gitignore) dengan pengecualian `!.env.example`).
- Dilarang menaruh `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `DIRECT_URL`, atau kunci Payment Gateway pada variabel `VITE_*` maupun di kode Flutter (`mobile/ebook_store`).
- Cara membuat `.env` lokal di Windows PowerShell:
  ```powershell
  Copy-Item backend\.env.example backend\.env
  Copy-Item web\admin-web\.env.example web\admin-web\.env
  Copy-Item web\pengunjung-web\.env.example web\pengunjung-web\.env
  ```

---

## 2. Variabel Lingkungan Backend (`backend/src/config/env.ts` — `[ADA]`)

Validasi dijalankan otomatis saat boot menggunakan Zod (`envSchema`); jika gagal, aplikasi mencatat field error dan memanggil `process.exit(1)`.

| Variabel | Tipe Zod | Required | Default | Deskripsi | Contoh Placeholder | Status |
|---|---|---|---|---|---|---|
| `PORT` | `coerce.number().int().positive()` | Opsional | `3000` | Port HTTP Express | `3000` | `[ADA]` |
| `NODE_ENV` | `enum('development','test','production')` | Opsional | `development` | Mode runtime | `development` | `[ADA]` |
| `CORS_ORIGINS` | `string` | Opsional | `http://localhost:5173,http://localhost:5174` | Origin web diizinkan (pisahkan koma) | `http://localhost:5173,http://localhost:5174` | `[ADA]` |
| `DATABASE_URL` | `string().min(1)` | Opsional di Zod | — | Pooler PostgreSQL port `6543` (`?pgbouncer=true`) | `postgresql://USER:PASSWORD@HOST:6543/postgres?pgbouncer=true` | `[ADA]` |
| `DIRECT_URL` | `string().min(1)` | Opsional di Zod | — | Koneksi direct port `5432` untuk Prisma CLI | `postgresql://USER:PASSWORD@HOST:5432/postgres` | `[ADA]` |
| `SUPABASE_URL` | `string().url()` | Opsional di Zod | — | URL proyek Supabase | `https://PROJECT_REF.supabase.co` | `[ADA]` |
| `SUPABASE_ANON_KEY` | `string().min(1)` | Opsional di Zod | — | Anon key Supabase | `ganti_dengan_supabase_anon_key` | `[ADA]` |
| `SUPABASE_SERVICE_ROLE_KEY` | `string().min(1)` | Opsional di Zod | — | Service role key privat (backend only) | `ganti_dengan_service_role_key` | `[ADA]` |
| `SUPABASE_EBOOK_BUCKET` | `string().min(1)` | Opsional | `ebooks-private` | Nama bucket privat PDF | `ebooks-private` | `[ADA]` |
| `PAYMENT_GATEWAY_SERVER_KEY` | `string().min(1)` | Opsional di Zod | — | Server key Payment Gateway | `ganti_dengan_server_key_payment_gateway` | `[ADA]` |
| `PAYMENT_GATEWAY_WEBHOOK_SECRET` | `string().min(1)` | Opsional di Zod | — | Secret verifikasi signature webhook | `ganti_dengan_webhook_secret` | `[ADA]` |

> **Catatan Audit Konsistensi:**
> - Dokumen versi sebelumnya pernah mencantumkan usulan lama `JWT_SECRET` / `JWT_EXPIRES_IN` yang **tidak ada** di `env.ts` karena proyek memakai **Supabase Auth**.
> - Pada `backend/.env.example` saat ini, `CORS_ORIGINS` belum dicantumkan (mengandalkan nilai default di `env.ts`), sedangkan `SUPABASE_ANON_KEY`, `PAYMENT_GATEWAY_SERVER_KEY`, dan `PAYMENT_GATEWAY_WEBHOOK_SECRET` sudah tercantum. Perbedaan ini dicatat di [`development-gap-register.md`](./development-gap-register.md).

---

## 3. Variabel Lingkungan Web (`VITE_*` — `[ADA]` Template)

| Variabel | Komponen | Required | Default / Placeholder | Aman di `VITE_*`? | Deskripsi | Status |
|---|---|---|---|---|---|---|
| `VITE_API_BASE_URL` | `admin-web`, `pengunjung-web` | Ya | `http://localhost:3000/api/v1` | Ya | Base URL REST API backend | `[ADA]` |
| `VITE_SUPABASE_URL` | `admin-web`, `pengunjung-web` | Ya | `https://PROJECT_REF.supabase.co` | Ya | URL proyek Supabase | `[ADA]` |
| `VITE_SUPABASE_ANON_KEY` | `admin-web`, `pengunjung-web` | Ya | `ganti_dengan_supabase_anon_key` | Ya (publik) | Kunci anon Supabase Auth klien | `[ADA]` |

---

## 4. Konfigurasi Base URL Mobile (`mobile/ebook_store` — `mobile/AGENTS.md`)

Aplikasi mobile tidak memakai `.env` Vite; `baseUrl` dikonfigurasi per lingkungan (mis. via `--dart-define` `[RENCANA]`):

| Lingkungan | Base URL | Catatan | Status |
|---|---|---|---|
| **Emulator Android** | `http://10.0.2.2:3000/api/v1` | `10.0.2.2` mengarah ke `localhost` host Windows | `[ADA]` aturan |
| **Perangkat Fisik (LAN)** | `http://<IP_LAN_HOST>:3000/api/v1` | Satu jaringan LAN dengan backend lokal | `[ADA]` aturan |
| **Staging** | `https://staging-api.domain.tld/api/v1` | Wajib HTTPS | `[RENCANA]` |
| **Production** | `https://api.domain.tld/api/v1` | Wajib HTTPS | `[RENCANA]` |

---

## 5. Matriks Perbandingan Lingkungan

| Variabel | Development | Testing | Staging `[RENCANA]` | Production `[RENCANA]` |
|---|---|---|---|---|
| `NODE_ENV` | `development` | `test` | `production` | `production` |
| `PORT` | `3000` | `3000` (atau ephemeral test) | Ditetapkan platform | Ditetapkan platform |
| `CORS_ORIGINS` | `localhost:5173,5174` | `localhost` | Domain staging HTTPS | Domain resmi HTTPS |
| `DATABASE_URL` | Pooler dev (`6543`) | Mock / DB test terisolasi | Pooler staging (`6543`) | Pooler prod (`6543`) |
| `DIRECT_URL` | Direct dev (`5432`) | — / DB test | Direct staging (`5432`) | Direct prod (`5432`) |
| `SUPABASE_EBOOK_BUCKET` | `ebooks-private` | `ebooks-private` | `ebooks-private` | `ebooks-private` |
