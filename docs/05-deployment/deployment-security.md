# Keamanan Deployment & Hardening Produksi

**Status:** `[RENCANA]` (kontrol runtime & hardening produksi belum aktif penuh; `helmet` & `cors` dasar `[ADA]` di `app.ts`)  
**Referensi Utama:** [`security-overview.md`](../07-security/security-overview.md), [`security-guidelines.md`](../07-security/security-guidelines.md), [`backend/src/app.ts`](../../backend/src/app.ts).

---

## 1. Status Kontrol Keamanan Deployment (`[ADA]` vs `[RENCANA]`)

| Kontrol Keamanan | Status Aktual | Detail / Target Produksi |
|---|---|---|
| **HTTP Security Headers (`helmet`)** | `[ADA]` di `backend/src/app.ts` | Dipasang global sebelum route API |
| **Kebijakan CORS (`cors`)** | `[ADA]` di `backend/src/app.ts` | Memeriksa `env.CORS_ORIGINS`; produksi wajib membatasi ke domain HTTPS resmi (`[RENCANA]`) |
| **Batas Payload JSON** | `[ADA]` di `backend/src/app.ts` | `express.json({ limit: '1mb' })` |
| **Rate Limiting (`express-rate-limit`)** | `[ADA]` file `rate-limit.middleware.ts` / `[RENCANA]` mount | File middleware tersedia, namun belum dipasang di `app.ts` (`[RENCANA]`) |
| **HTTPS / TLS End-to-End** | `[RENCANA]` | Wajib aktif untuk backend API, static web, dan webhook gateway |
| **Bucket Privat & Signed URL** | `[RENCANA]` | `ebooks-private` (`SUPABASE_EBOOK_BUCKET`); PDF tidak pernah diekspos publik |
| **Verifikasi Signature Webhook** | `[RENCANA]` | Validasi menggunakan `PAYMENT_GATEWAY_WEBHOOK_SECRET` + idempotensi |
| **Pemisahan Secret Klien vs Server** | `[ADA]` aturan / `[RENCANA]` audit CI | `SUPABASE_SERVICE_ROLE_KEY` & kunci gateway dilarang di `VITE_*` & Flutter |

---

## 2. Hardening Infrastruktur & Runtime (`[RENCANA]`)

1. **Enkripsi Transport (TLS/HTTPS):**
   - Seluruh endpoint API produksi, hosting static web (`admin-web` & `pengunjung-web`), dan callback payment gateway wajib berjalan di atas HTTPS (TLS 1.2+).
   - Aplikasi mobile `ebook_store` di produksi tidak boleh menggunakan cleartext HTTP (`http://`).
2. **Manajemen Secret & Rotasi Kredensial:**
   - Gunakan secret manager platform hosting untuk `DATABASE_URL`, `DIRECT_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `PAYMENT_GATEWAY_SERVER_KEY`, dan `PAYMENT_GATEWAY_WEBHOOK_SECRET`.
   - Pisahkan kredensial proyek Supabase & Payment Gateway antara lingkungan **Development/Staging** dan **Production**.
   - Siapkan prosedur rotasi segera apabila terjadi indikasi kebocoran secret.
3. **Perlindungan Endpoint Publik & Webhook:**
   - Pasang `rate-limit.middleware.ts` pada `app.ts` sebelum rilis produksi, khususnya untuk endpoint autentikasi, checkout, dan SAW (`[RENCANA]`).
   - Pastikan endpoint webhook payment gateway memverifikasi signature kriptografis dan mengabaikan pemrosesan ganda (idempoten).
4. **Perlindungan Konten Digital (PDF):**
   - Pastikan bucket `ebooks-private` di Supabase Storage berstatus **Private** dan tidak memiliki policy baca publik (`SELECT` untuk `anon`).
   - Signed URL yang diterbitkan backend harus berumur pendek (misalnya 60–300 detik `[RENCANA]`) dan hanya dibuat jika `ebook_accesses` aktif (`is_revoked = false`).
5. **Audit Dependensi & Error Handling:**
   - Jalankan `npm audit` secara berkala sebelum rilis (`[RENCANA]`).
   - Pastikan respons error produksi (`NODE_ENV=production`) tidak membocorkan stack trace, query SQL, atau path internal ke klien (`error.middleware.ts`).
