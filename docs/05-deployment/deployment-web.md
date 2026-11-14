# Panduan Deployment Web (`Admin Web & Pengunjung Web`)

**Status:** `[RENCANA]` (hosting produksi belum disiapkan; konfigurasi Vite & `.env.example` `[ADA]`)  
**Target Kode:** `web/admin-web/` dan `web/pengunjung-web/`  
**Referensi Utama:** [`web/admin-web/package.json`](../../web/admin-web/package.json), [`web/pengunjung-web/package.json`](../../web/pengunjung-web/package.json), [`AGENTS.md`](../../AGENTS.md).

---

## 1. Perbandingan Konfigurasi Aktual Kedua Aplikasi Web (`[ADA]`)

| Aspek | `web/admin-web` | `web/pengunjung-web` |
|---|---|---|
| **Framework & Bundler** | React `^19.3.1`, Vite `^8.3.6`, TypeScript `^6.0.3` | React `^19.3.1`, Vite `^8.3.6` (masih `.jsx`, belum TypeScript) |
| **Linter** | ESLint `^10.14.0` (`npm run lint`) | ESLint `^10.14.0` (`npm run lint`) |
| **Skrip Build (`package.json`)** | `tsc --noEmit -p tsconfig.app.json && tsc --noEmit -p tsconfig.node.json && vite build` | `vite build` |
| **Output Build** | `dist/` (aset statis HTML/JS/CSS) | `dist/` (aset statis HTML/JS/CSS) |
| **Template Environment** | `web/admin-web/.env.example` (`[ADA]`) | `web/pengunjung-web/.env.example` (`[ADA]`) |

---

## 2. Variabel Lingkungan Build (`VITE_*`)

Kedua aplikasi memiliki template `.env.example` (`[ADA]`) berisi:

- `VITE_API_BASE_URL` (contoh lokal: `http://localhost:3000/api/v1`; produksi: `https://<domain-backend>/api/v1` `[RENCANA]`)
- `VITE_SUPABASE_URL` (`https://<PROJECT_REF>.supabase.co`)
- `VITE_SUPABASE_ANON_KEY` (*anon/publishable key* Supabase untuk klien)

**Aturan Keamanan Wajib (`AGENTS.md` & `security-guidelines.md`):**
- Seluruh variabel berawalan `VITE_` **disematkan ke bundle JavaScript publik** saat `vite build` dijalankan.
- **Dilarang keras** menaruh `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `PAYMENT_GATEWAY_SERVER_KEY`, atau secret apa pun pada `VITE_*`.

---

## 3. Target Hosting & Konfigurasi Rilis (`[RENCANA]`)

1. **Hosting Statis / CDN:**
   - Hasil direktori `dist/` dari `web/admin-web` dan `web/pengunjung-web` dapat di-deploy secara terpisah ke layanan static hosting / CDN (misalnya Vercel, Cloudflare Pages, Netlify, atau Nginx static) `[RENCANA]`.
2. **SPA Routing Fallback (`[RENCANA]`):**
   - Karena aplikasi React menggunakan client-side routing, server statis wajib mengarahkan rute non-file kembali ke `/index.html` (HTTP `200`) agar refresh halaman pada sub-rute tidak menghasilkan `404`.
3. **Kesesuaian CORS Backend (`[RENCANA]`):**
   - Setiap origin produksi `admin-web` dan `pengunjung-web` (misalnya `https://admin.domain.tld` dan `https://domain.tld`) wajib didaftarkan pada `CORS_ORIGINS` di backend (`backend/src/app.ts` memisahkan berdasarkan koma).
4. **Otorisasi Admin (`AGENTS.md`):**
   - Menyembunyikan menu atau halaman di `admin-web` hanya bersifat kosmetik; proteksi sesungguhnya tetap ditegakkan oleh backend pada endpoint role `ADMIN`.
5. **Label Data Simulasi (`AGENTS.md`):**
   - Selama fitur/endpoint tertentu belum terhubung ke backend produksi, seluruh data placeholder di UI web wajib diberi label `"DATA SIMULASI"`.
