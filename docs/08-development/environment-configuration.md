# Konfigurasi Lingkungan (`Environment Configuration`)

**Status:** `[ADA]` (template `.env.example` tersedia di `backend/`, `web/admin-web/`, dan `web/pengunjung-web/`) | `[RENCANA]` (file `.env` lokal belum dibuat dan variabel belum diisi nilainya)

---

## 1. Aturan Keamanan Environment (`[ADA]`)

- File `.env` dan `.env.*` wajib diabaikan oleh `.gitignore` (sudah dikonfigurasi pada root [`.gitignore`](../../.gitignore), dengan pengecualian `!.env.example`).
- Dilarang menyimpan secret atau `SUPABASE_SERVICE_ROLE_KEY` pada variabel `VITE_*` (`web/admin-web`, `web/pengunjung-web`) maupun di kode Flutter (`mobile/ebook_store`).
- Gunakan file `.env.example` berisi nilai placeholder tanpa kredensial asli.

---

## 2. Usulan Variabel Lingkungan — Backend (`backend/.env.example`) `[RENCANA]`

```env
PORT=3000
NODE_ENV=development

# Database PostgreSQL Supabase (sesuai panduan Prisma 7 di AGENTS.md)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://USER:PASSWORD@HOST:5432/postgres"

# Autentikasi
JWT_SECRET="ganti_dengan_secret_acak_minimal_32_karakter"
JWT_EXPIRES_IN="1d"

# Supabase Storage Privat (hanya di backend)
SUPABASE_URL="https://PROJECT_REF.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="ganti_dengan_service_role_key"
SUPABASE_EBOOK_BUCKET="ebooks-private"
```

---

## 3. Usulan Variabel Lingkungan — Frontend Web (`web/admin-web/.env.example`) `[RENCANA]`

```env
VITE_API_BASE_URL="http://localhost:3000/api/v1"
```

---

## 4. Konfigurasi Base URL — Mobile (`mobile/ebook_store`) `[ADA]` pada `mobile/AGENTS.md`

- Emulator Android: `http://10.0.2.2:3000/api/v1` (`[RENCANA]` port 3000)
- Perangkat fisik: IP LAN host pengembangan atau domain staging/produksi (`HTTPS`)
