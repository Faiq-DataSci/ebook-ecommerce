# Register Gap & Keputusan API (`API Gap Register`)

> **Status Dokumen:** `[ADA]` (Dokumentasi audit gap API)
> **Referensi:** [`docs/02-api/api-spec.yaml`](../02-api/api-spec.yaml), [`docs/05-api/api-endpoints.md`](./api-endpoints.md), [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md)

---

## 1. Perbedaan Rancangan Lama (`05-api/api-endpoints.md`) vs `02-api/api-spec.yaml`

| ID | Gap atau Keputusan | Dampak pada API | Dokumen Sumber | Status | Tindakan Lanjutan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **API-GAP-01** | **`POST /auth/register` & `/auth/login` vs `POST /auth/sync`:** Versi lama memakai register/login lokal; `api-spec.yaml` memakai `/auth/sync` karena Supabase Auth mengelola registrasi/login | Backend Express tidak menerbitkan JWT sendiri, hanya memverifikasi JWT Supabase dan menyinkronkan `User` | [`api-endpoints.md`](./api-endpoints.md) vs [`api-spec.yaml`](../02-api/api-spec.yaml) | `[ADA]` keputusan Supabase Auth / `[RENCANA]` endpoint | Gunakan `POST /api/v1/auth/sync` sebagai acuan resmi. |
| **API-GAP-02** | **`GET /ebooks/:id/access` vs `GET /ebooks/:id/access-url`:** Penamaan endpoint *signed URL* berbeda | Klien mobile harus memanggil path kanonik `/ebooks/:id/access-url` | [`api-spec.yaml`](../02-api/api-spec.yaml) | `[RENCANA]` | Gunakan `/api/v1/ebooks/:id/access-url`. |
| **API-GAP-03** | **`GET /ebooks/recommendations` vs `GET /recommendations/saw`:** Path rekomendasi SAW berbeda | Penyelarasan router Express & klien ke `/recommendations/saw` | [`api-spec.yaml`](../02-api/api-spec.yaml) | `[RENCANA]` | Gunakan `/api/v1/recommendations/saw`. |
| **API-GAP-04** | **`POST /payments/:id/verify` vs `POST /payments/webhook`:** Versi lama menyertakan token Admin; `api-spec.yaml` memakai webhook gateway dengan signature | Verifikasi pelunasan hanya via webhook resmi payment gateway | [`api-spec.yaml`](../02-api/api-spec.yaml), [`webhook-contract.md`](../02-api/webhook-contract.md) | `[RENCANA]` | Gunakan `POST /api/v1/payments/webhook`. |
| **API-GAP-05** | **`GET /orders` vs `GET /orders/me`:** Endpoint daftar pesanan pelanggan pada `api-spec.yaml` memakai `/orders/me` | Konsistensi path pelanggan (`/orders/me` vs `POST /orders`) | [`api-spec.yaml`](../02-api/api-spec.yaml) | `[RENCANA]` | Gunakan `/api/v1/orders/me`. |
| **API-GAP-06** | **Endpoint baru di `api-spec.yaml` yang belum ada di versi lama:** `PATCH /users/me`, `GET /orders/:id`, `GET /payments/:id`, `GET /admin/ping` `[ADA]`, `GET /admin/dashboard`, `GET /admin/customers/:id`, `GET /admin/orders/:id`, `GET /admin/payments`, `GET/PUT /admin/saw/weights`, `PATCH /admin/accesses/:id` | Melengkapi kebutuhan profil, cek detail, monitoring admin, kontrol bobot SAW, dan pencabutan `EbookAccess` | [`api-spec.yaml`](../02-api/api-spec.yaml) | `[ADA]` (`/admin/ping`) / `[RENCANA]` (lainnya) | Sudah dimasukkan ke [`api-endpoints.md`](./api-endpoints.md). |
| **API-GAP-07** | **`GET /transactions/my` ada di `api-endpoints.md` lama & `FR-C10`, namun tidak tercantum di 29 path `api-spec.yaml`** | Pelanggan memerlukan riwayat transaksi resmi selain `/orders/me` | [`api-endpoints.md`](./api-endpoints.md), [`api-spec.yaml`](../02-api/api-spec.yaml) | `[RENCANA]` | Tambahkan `/transactions/my` ke `api-spec.yaml` saat pembaruan OpenAPI berikutnya atau gunakan `/orders/me`. |

---

## 2. Gap Implementasi & Keputusan Terbuka yang Memengaruhi API

| ID | Gap atau Keputusan | Dampak pada API | Dokumen Sumber | Status | Tindakan Lanjutan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **API-GAP-08** | **Keputusan #5 (Hak ubah bobot SAW):** Admin-only vs preferensi pelanggan | Menentukan otorisasi dan parameter query `GET /recommendations/saw` serta `PUT /admin/saw/weights` | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` | Kunci kebijakan aktor bobot sebelum implementasi `SawModule`. |
| **API-GAP-09** | **Keputusan #6 & #7 (Ulasan & tanpa rating):** Belum ada endpoint review di `api-spec.yaml` | Menentukan apakah perlu endpoint `POST /ebooks/:id/reviews` serta struktur field rating di `GET /ebooks/:id` & SAW | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` | Tetapkan ruang lingkup fitur ulasan. |
| **API-GAP-10** | **Keputusan #9 (4 vs 5 kriteria SAW):** Jumlah kriteria & bobot aktif | Memengaruhi skema validasi `SawWeightsUpdateRequest` | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` | Rekonsiliasi konflik kriteria sebelum implementasi `PUT /admin/saw/weights`. |
| **API-GAP-11** | **Keputusan #10 (Hosting backend):** Penentuan host API produksi | Memengaruhi Base URL produksi & konfigurasi `CORS` | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` | Tetapkan environment deployment backend. |
| **API-GAP-12** | **Keputusan #11 (Snapshot SAW):** Perlu/tidaknya endpoint audit historis | Menentukan penambahan endpoint `GET /api/v1/admin/saw/audit` | [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) | `[RENCANA]` | Putuskan kebijakan penyimpanan snapshot. |
| **API-GAP-13** | **Inkonsistensi kode error `UNAUTHORIZED` vs `UNAUTHENTICATED`** | [`auth.middleware.ts`](../../backend/src/middlewares/auth.middleware.ts) melempar `'UNAUTHORIZED'`, sedangkan [`error-catalog.md`](../02-api/error-catalog.md) menstandarkan `'UNAUTHENTICATED'` | [`auth.middleware.ts`](../../backend/src/middlewares/auth.middleware.ts) | `[RENCANA]` | Seragamkan kode error autentikasi saat implementasi modul Auth. |
| **API-GAP-14** | **Rate limiter belum terpasang di `app.ts`** | Kode `429 RATE_LIMITED` belum aktif pada endpoint sensitif | [`app.ts`](../../backend/src/app.ts) | `[RENCANA]` | Pasang `rate-limit.middleware.ts` di router backend. |
| **API-GAP-15** | **Belum ada ESLint backend & implementasi router/controller bisnis** | 27 path bisnis di `api-spec.yaml` baru berupa spesifikasi OpenAPI | [`app.ts`](../../backend/src/app.ts), [`package.json`](../../backend/package.json) | `[RENCANA]` | Implementasikan modul backend bertahap sesuai urutan kerja `AGENTS.md`. |
