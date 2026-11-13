# Arsitektur Sistem (`System Architecture`)

**Status:** `[RENCANA]` (arsitektur target pada `AGENTS.md`) | `[RENCANA]` (detail alur komunikasi & pemrosesan) | `[RENCANA]` (implementasi backend & database)

---

## 1. Gambaran Umum Arsitektur

Sistem Informasi E-Commerce E-Book dirancang menggunakan arsitektur **Client–Server (N-Tier)** dengan satu layanan backend terpusat sebagai *single source of truth* untuk logika bisnis, otorisasi, transaksi, pemberian hak akses e-book, serta perhitungan SPK (SAW).

```mermaid
flowchart LR
    subgraph Clients["Aplikasi Klien"]
        M["Mobile App (Flutter: ebook_store) [IMPLEMENTED: Template]"]
        AW["Admin Web (React + Vite: web/admin-web) [IMPLEMENTED: Template]"]
        PW["Pengunjung Web (React + Vite: web/pengunjung-web) [RENCANA]"]
    end

    subgraph Backend["Backend Layer [RENCANA]"]
        API["REST API Server (Express + TypeScript + Zod) [RENCANA]"]
        SAW["SAW Recommendation Engine [CONFIRMED: Backend-Only]"]
    end

    subgraph Data["Data & Storage Layer [RENCANA]"]
        DB[("PostgreSQL (Supabase via Prisma 7) [RENCANA]")]
        ST["Supabase Storage Bucket Privat (PDF E-Book) [RENCANA]"]
    end

    M -->|"HTTPS / REST JSON + Bearer Token [RENCANA]"| API
    AW -->|"HTTPS / REST JSON + Bearer Token [RENCANA]"| API
    PW -.->|"HTTPS / REST JSON [RENCANA]"| API
    API --> SAW
    API -->|"Prisma ORM [RENCANA]"| DB
    API -->|"Service Role / Signed URL [RENCANA]"| ST
    M -.->|"Akses PDF via Signed URL Sementara [RENCANA]"| ST
```

---

## 2. Hubungan Antarkomponen

### A. Mobile Application (`mobile/ebook_store`) dengan Backend
- **Status:** `[RENCANA]` (belum ada HTTP client maupun endpoint; `lib/main.dart` masih berupa template default).
- **Rancangan (`[RENCANA]` / `[RENCANA]`):**
  - Aplikasi mobile menggunakan **Dio** (`[ADA]` pada `AGENTS.md`) untuk berkomunikasi dengan Backend REST API melalui JSON.
  - Aplikasi mobile **tidak** terhubung langsung ke database PostgreSQL dan **tidak** menyimpan *service role key* Supabase (`[RENCANA]`).
  - Perhitungan rekomendasi e-book (SAW) hanya dipanggil dari endpoint backend; klien mobile hanya menerima hasil peringkat (`[RENCANA]`).

### B. Admin Web (`web/admin-web`) dengan Backend
- **Status:** `[RENCANA]` (belum ada integrasi API; `src/App.jsx` masih berupa template Vite).
- **Rancangan (`[RENCANA]` / `[RENCANA]`):**
  - Admin Web berkomunikasi dengan Backend REST API yang sama dengan proteksi role `ADMIN` (`[RENCANA]`).
  - Penyembunyian menu di UI hanya bersifat kosmetik; seluruh validasi hak akses admin wajib ditegakkan di backend (`[RENCANA]`).

### C. Pengunjung Web (`web/pengunjung-web`) dengan Backend
- **Status:** `[RENCANA]` — Direktori ditemukan sebagai template React + Vite, namun belum tercantum dalam `AGENTS.md`. Jika digunakan untuk pelanggan versi web, komunikasinya mengikuti pola yang sama dengan Mobile App melalui REST API.

### D. Backend dengan Database & Storage
- **Status:** `[RENCANA]` — Belum ada `schema.prisma` maupun kode backend.
- **Rancangan (`[RENCANA]`):**
  - Backend mengakses PostgreSQL Supabase menggunakan **Prisma 7** (`DATABASE_URL` port 6543 untuk runtime dan `DIRECT_URL` port 5432 untuk migrasi).
  - File PDF e-book disimpan pada **Supabase Storage bucket privat**; backend menghasilkan *signed URL* berjangka waktu pendek hanya setelah hak akses pelanggan terverifikasi.

---

## 3. Alur Komunikasi API, Autentikasi, Transaksi, dan Hak Akses E-Book (`[RENCANA]`)

```mermaid
sequenceDiagram
    actor C as Pelanggan (Mobile)
    participant API as Backend API [RENCANA]
    participant DB as PostgreSQL [RENCANA]
    participant ST as Supabase Storage Privat [RENCANA]

    C->>API: 1. Login (email, password)
    API->>DB: Verifikasi kredensial user
    DB-->>API: Data user + role
    API-->>C: Access Token (JWT)

    C->>API: 2. Buat Pesanan (ebook_ids) + Bearer Token
    API->>DB: Simpan Order (status PENDING) + snapshot harga
    DB-->>API: Order ID
    API-->>C: Detail Pesanan & Instruksi Pembayaran

    C->>API: 3. Kirim / Konfirmasi Pembayaran
    API->>DB: Verifikasi pembayaran -> Update PAID -> Catat Transaction & Ebook Access
    DB-->>API: Status berhasil
    API-->>C: Pembayaran terverifikasi

    C->>API: 4. Minta Akses E-Book (ebook_id) + Bearer Token
    API->>DB: Cek kepemilikan di Ebook Access
    DB-->>API: Hak akses valid
    API->>ST: Minta Signed URL sementara
    ST-->>API: Signed URL (TTL singkat)
    API-->>C: Signed URL untuk membaca e-book
```

### Prinsip Arsitektur Kunci (`[ADA]`)
1. **Otorisasi Terpusat di Backend:** Setiap endpoint terproteksi memeriksa validitas token dan role (`CUSTOMER` / `ADMIN`).
2. **Integritas Harga & Transaksi:** Harga item pada pesanan diambil dari harga database saat transaksi dibuat (*snapshot*), bukan dari input klien.
3. **Pemberian Hak Akses E-Book Berbasis Verifikasi:** Hak akses (`Ebook Access`) hanya diberikan setelah status pembayaran berstatus terverifikasi/lunas (`PAID`), bukan sekadar saat pesanan dibuat.
