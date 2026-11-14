# Panduan Monitoring & Alerting (`Monitoring & Alerting`)

**Status:** `[RENCANA]` — Rencana sistem pemantauan dan peringatan operasional produksi (endpoint health check & error handler dasar sudah `[ADA]`).  
**Referensi Utama:** [`docs/02-architecture/deployment-architecture.md`](../02-architecture/deployment-architecture.md), [`backend/src/app.ts`](../../backend/src/app.ts), [`backend/src/config/prisma.ts`](../../backend/src/config/prisma.ts), [`backend/src/middlewares/error.middleware.ts`](../../backend/src/middlewares/error.middleware.ts).

---

## 1. Health Check Endpoint (`[ADA]` Endpoint / `[RENCANA]` Probe Produksi)

Backend menyediakan endpoint health check publik pada [`backend/src/app.ts`](../../backend/src/app.ts):
- **Endpoint:** `GET /api/v1/health` (`[ADA]`)
- **Respons Sukses (`200 OK`):**
  ```json
  {
    "success": true,
    "message": "Backend E-Book Store siap",
    "data": {
      "status": "ok",
      "environment": "development"
    }
  }
  ```
- **Penggunaan Operasional (`[RENCANA]`):** Digunakan sebagai *liveness/readiness probe* oleh platform hosting maupun monitor eksternal setiap 30–60 detik. Untuk pemeriksaan koneksi database mendalam, gunakan helper `checkDatabaseConnection()` dari `prisma.ts` (`[ADA]`).

---

## 2. Metrik Pemantauan Target (`[RENCANA]`)

| Metrik | Sumber Data | Frekuensi Cek | Ambang Batas Alert (*Threshold*) | Status |
|---|---|---|---|---|
| **Uptime Backend** | `GET /api/v1/health` | 1 menit | Uptime < 99.5% atau 2x gagal berturut-turut | `[RENCANA]` |
| **Response Time API** | Log HTTP / APM Backend | 5 menit | P95 latensi > 500 ms (lihat `NFR-05`) | `[RENCANA]` |
| **Error Rate (`5xx`)** | Log `errorHandler` backend | Real-time | Rasio respons `5xx` > 1% dari total request | `[RENCANA]` |
| **Koneksi Database** | `checkDatabaseConnection()` / Pool metrics | 5 menit | Gagal `SELECT 1` atau pool *exhausted* | `[RENCANA]` |
| **Disk & Kuota Supabase** | Supabase Dashboard | Harian | Pemakaian disk DB atau Storage > 80% | `[RENCANA]` |
| **Uptime Web (`admin-web` & `pengunjung-web`)** | Hosting / CDN Static Monitor | 1 menit | Uptime < 99.9% atau status non-`200` | `[RENCANA]` |
| **Webhook Success Rate** | Log `POST /api/v1/payments/webhook` | Real-time | Tingkat keberhasilan < 95% atau signature gagal berulang | `[RENCANA]` |
| **Status Payment Gateway** | Dashboard / Status Page Penyedia | Real-time | Gangguan layanan dari penyedia gateway | `[RENCANA]` |

---

## 3. Logging (`[ADA]` Dasar / `[RENCANA]` Terpusat)

- **Sudah `[ADA]`:** [`errorHandler`](../../backend/src/middlewares/error.middleware.ts) mencatat `Unhandled server error` melalui `console.error` dan mengembalikan respons JSON tersanitasi tanpa stack trace ke klien.
- **Rencana Produksi (`[RENCANA]`):**
  - Gunakan format log terstruktur (**JSON**) dengan `timestamp`, `level`, `requestId`, `method`, `path`, `statusCode`, dan `durationMs`.
  - Integrasikan *log aggregation* (mis. Logtail, Datadog, atau sistem log bawaan platform hosting sesuai Keputusan #10).
  - Tetapkan masa retensi log operasional selama **30–90 hari**.
- **Aturan Keamanan Log (`[ADA]` aturan):** Dilarang keras mencatat token JWT, password, `SUPABASE_SERVICE_ROLE_KEY`, secret webhook, atau `storagePath` internal di dalam log.

---

## 4. Konfigurasi Alerting (`[RENCANA]`)

| Alert | Kondisi Pemicu | Channel Notifikasi | Eskalasi | Status |
|---|---|---|---|---|
| **Backend Down** | `GET /api/v1/health` gagal 2x berturut-turut | Email / Slack / Telegram On-Call | `P1` — On-call -> Tech Lead (5 menit) | `[RENCANA]` |
| **Database Connection Fail** | `checkDatabaseConnection()` gagal atau timeout | Email / Slack On-Call | `P1` — DBA / Backend Lead | `[RENCANA]` |
| **Error Rate Spike (`5xx`)** | Error `5xx` > 1% selama > 5 menit | Slack / Email Tim | `P2` — Developer On-Call | `[RENCANA]` |
| **Webhook Payment Failure** | Webhook gagal diproses / signature error beruntun | Slack / Email Tim & Keuangan | `P1`/`P2` — Backend Lead | `[RENCANA]` |
| **Disk / Kuota Penuh** | Penggunaan DB/Storage Supabase > 80% | Email Admin Infrastruktur | `P3` — DevOps / DBA | `[RENCANA]` |
| **SSL Cert Expiring** | Masa berlaku sertifikat TLS < 14 hari | Email Infrastruktur | `P3` — DevOps | `[RENCANA]` |
| **Secret Leak Detected** | Temuan GitHub Secret Scanning / Gitleaks | Alert Keamanan Segera | `P1` — Security & Pemilik Proyek | `[RENCANA]` |

---

## 5. Alat & Dashboard Monitoring (`[RENCANA]`)

> Pilihan final alat pemantauan menyesuaikan platform hosting yang dipilih pada **Keputusan #10** di [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md).

- **Uptime Monitoring:** UptimeRobot, Pingdom, atau monitor bawaan platform hosting (`[RENCANA]`).
- **Error Tracking:** Sentry, Logtail, atau agregator log JSON (`[RENCANA]`).
- **Metrik Database & Storage:** Supabase Dashboard Reports & Query Performance (`[RENCANA]`).
- **Keamanan Repository:** GitHub Security Alerts & Dependabot (`[RENCANA]`).
- **Panel Dashboard Operasional Target (`[RENCANA]`):** Menampilkan status kesehatan Backend, PostgreSQL Supabase, Storage Privat, Payment Gateway, Web, serta metrik uptime, response time, error rate `5xx`, dan jumlah transaksi harian.
