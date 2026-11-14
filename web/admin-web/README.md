# Admin Web — E-Book E-Commerce & SPK (Metode SAW)

Aplikasi web administrasi (`web/admin-web`) untuk pengelolaan toko e-book B2C (*single-seller*) dan pemantauan Sistem Pendukung Keputusan (SPK) metode *Simple Additive Weighting* (SAW). Dibangun menggunakan **React 19 + TypeScript + Vite 8** dengan pendekatan desain **Neo-Brutalism (3 Zona Intensitas)**.

> **Status Modul:**
> - **`[ADA]`**: Kerangka proyek React + TypeScript + Vite, sistem token CSS Neo-Brutalism (`src/styles/`), tata letak konsol admin (`AdminLayout`, `AdminHeader`, `AdminSidebar` dengan navigasi *collapsible* Desktop & *drawer* Mobile, *flyout* submenu, aksesibilitas ARIA & pintasan `Escape`), serta halaman pratinjau `DashboardPage` & `DashboardContent` berlabel `"DATA SIMULASI"`.
> - **`[RENCANA]`**: Integrasi autentikasi login admin ke Supabase Auth & backend (`GET /api/v1/admin/ping` sudah `[ADA]` di backend), koneksi API data nyata (`/api/v1/admin/dashboard`, `/api/v1/admin/reports/sales`), serta halaman modul submenu operasional (Katalog, Transaksi, Analitik, SPK SAW, dan Manajemen Sistem).

---

## 1. Prinsip Desain Neo-Brutalism (3 Zona Intensitas)

Antarmuka `web/admin-web` menerapkan aturan visual Neo-Brutalism yang dibagi ke dalam 3 zona agar tetap tegas namun tidak melelahkan mata saat bekerja dengan tabel data:

1. **Zona 1 — Aksen Tegas (Hero / Primary CTA / Status Penting):**
   Warna kontras tinggi (`#FFD23F` kuning, `#FF6B6B` koral, `#A8E6CF` mint), border hitam tegas (`2px`–`3px solid #000000`), dan *hard shadow* tanpa blur (`4px 4px 0px #000000`).
2. **Zona 2 — Navigasi & Kartu Ringkasan (`AdminSidebar`, `AdminHeader`, KPI Cards):**
   Border jelas (`2px solid #000000`), latar hangat/terang (`#FFFDF5` / `#FFFFFF`), dan *hard shadow* sedang (`3px 3px 0px #000000`).
3. **Zona 3 — Layar Padat Data (Tabel Pesanan, Daftar Katalog, Form Panjang):**
   Dibuat lebih tenang dengan latar bersih, pemisah baris yang rapi, dan tipografi monospace (`JetBrains Mono`) untuk angka, nominal Rupiah, kode transaksi, dan skor SAW agar mudah dipindai.

> **Aturan Kejujuran Data (`AGENTS.md`):**
> Selama endpoint bisnis backend masih berstatus `[RENCANA]`, seluruh metrik, grafik, dan tabel contoh di UI wajib menyertakan penanda eksplisit **`"DATA SIMULASI"`**.

---

## 2. Struktur Direktori (`web/admin-web`)

```text
web/admin-web/
├── .env.example                 # Template variabel environment publik (VITE_*) [ADA]
├── .gitignore                   # Aturan pengabaian Git lokal admin-web [ADA]
├── index.html                   # Entry HTML + pemuatan font & Material Symbols [ADA]
├── package.json                 # Skrip npm & dependensi React 19 + TS + Vite 8 [ADA]
├── tsconfig.json                # Konfigurasi TypeScript utama [ADA]
├── vite.config.ts               # Konfigurasi bundler Vite [ADA]
└── src/
    ├── main.tsx                 # Entry point aplikasi React (TypeScript) [ADA]
    ├── App.tsx                  # Root component yang merender DashboardPage [ADA]
    ├── components/
    │   └── admin/
    │       ├── AdminHeader.tsx      # Topbar: toggle sidebar, breadcrumb, pencarian, aksi [ADA]
    │       ├── AdminSidebar.tsx     # Sidebar responsif (collapsed rail & mobile drawer) [ADA]
    │       ├── SidebarMenuItem.tsx  # Item menu tunggal dengan tooltip saat collapsed [ADA]
    │       ├── SidebarDropdown.tsx  # Grup menu akordeon + flyout saat collapsed [ADA]
    │       └── DashboardContent.tsx # Konten utama dashboard (KPI, chart, tabel, SAW) [ADA]
    ├── data/
    │   ├── adminNavigation.ts   # Konfigurasi grup menu, rute, & status [ADA]/[RENCANA] [ADA]
    │   └── dashboardData.ts     # Dataset pratinjau berlabel "DATA SIMULASI" [ADA]
    ├── hooks/
    │   └── useSidebar.ts        # Custom hook state sidebar, localStorage, & History API [ADA]
    ├── layouts/
    │   └── AdminLayout.tsx      # Pembungkus layout sidebar + header + main content [ADA]
    ├── pages/
    │   └── admin/
    │       └── DashboardPage.tsx # Halaman konsol admin & banner status rute [ADA]
    ├── styles/
    │   ├── tokens.css           # Token warna, border, shadow, dan font Neo-Brutalism [ADA]
    │   ├── admin-layout.css     # Styling kerangka halaman dan topbar [ADA]
    │   ├── admin-sidebar.css    # Styling sidebar, dropdown, tooltip, dan flyout [ADA]
    │   └── dashboard.css        # Styling kartu KPI, grafik, tabel, dan komponen SAW [ADA]
    └── types/
        └── admin.ts             # Definisi tipe TypeScript navigasi & data dashboard [ADA]
```

---

## 3. Daftar Rute Navigasi & Status Implementasi

| Grup | Menu / Submenu | Path Rute | Status UI |
|---|---|---|---|
| **UTAMA** | Dashboard | `/admin/dashboard` | `[ADA]` (dengan `"DATA SIMULASI"`) |
| **OPERASIONAL & TOKO** | Koleksi E-Book | `/admin/katalog/ebook` | `[RENCANA]` |
| **OPERASIONAL & TOKO** | Kategori & Tag | `/admin/katalog/kategori` | `[RENCANA]` |
| **OPERASIONAL & TOKO** | Penulis & Penerbit | `/admin/katalog/penulis` | `[RENCANA]` |
| **OPERASIONAL & TOKO** | Semua Pesanan | `/admin/transaksi/pesanan` | `[RENCANA]` |
| **OPERASIONAL & TOKO** | Verifikasi Bayar | `/admin/transaksi/verifikasi` | `[RENCANA]` |
| **OPERASIONAL & TOKO** | Laporan Omzet | `/admin/transaksi/laporan` | `[RENCANA]` |
| **INTELIJEN & SISTEM** | Analitik Bisnis | `/admin/analitik` | `[RENCANA]` |
| **INTELIJEN & SISTEM** | Kriteria & Bobot (SAW) | `/admin/spk/kriteria` | `[RENCANA]` |
| **INTELIJEN & SISTEM** | Matriks SAW | `/admin/spk/matriks` | `[RENCANA]` |
| **INTELIJEN & SISTEM** | Pelanggan & User | `/admin/sistem/pelanggan` | `[RENCANA]` |
| **INTELIJEN & SISTEM** | Lisensi & DRM | `/admin/sistem/drm` | `[RENCANA]` |
| **INTELIJEN & SISTEM** | Pengaturan | `/admin/sistem/pengaturan` | `[RENCANA]` |

> **Catatan Arsitektur SPK SAW:**
> Sesuai `AGENTS.md` dan `ADR-0002`, seluruh perhitungan normalisasi matriks dan perankingan SAW dilakukan **eksklusif di backend**. Antarmuka `web/admin-web` hanya menampilkan hasil perhitungan dari API backend dan mengelola parameter yang diizinkan.

---

## 4. Konfigurasi Environment (`.env`)

Salin file [`.env.example`](./.env.example) menjadi `.env` di dalam direktori `web/admin-web/`:

```powershell
Copy-Item .env.example .env
```

Isi variabel yang tersedia di `.env`:

```env
VITE_API_BASE_URL="http://localhost:3000/api/v1"
VITE_SUPABASE_URL="https://PROJECT_REF.supabase.co"
VITE_SUPABASE_ANON_KEY="ganti_dengan_supabase_anon_key"
```

> **PERINGATAN KEAMANAN (`VITE_*`):**
> Semua variabel yang diawali `VITE_` akan **dibundle ke dalam kode JavaScript browser** dan dapat dilihat oleh publik.
> - **BOLEH:** URL API backend (`VITE_API_BASE_URL`), URL proyek Supabase (`VITE_SUPABASE_URL`), dan kunci publik anonim (`VITE_SUPABASE_ANON_KEY`).
> - **DILARANG KERAS:** Menaruh `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, `DIRECT_URL`, secret JWT, atau *server key* payment gateway di dalam `web/admin-web/.env` maupun kode frontend.

---

## 5. Cara Menjalankan & Memverifikasi

Jalankan perintah berikut dari direktori `web/admin-web` (atau gunakan `--prefix web/admin-web` dari root monorepo):

```powershell
# 1. Pasang dependensi
npm install

# 2. Jalankan server development (HMR)
npm run dev

# 3. Periksa kualitas kode (ESLint)
npm run lint

# 4. Pemeriksaan tipe TypeScript & build produksi
npm run build

# 5. Pratinjau hasil build produksi secara lokal
npm run preview
```

---

## 6. Checklist Pengecekan `.gitignore` & Keamanan (Agar Tidak Lupa Sebelum Commit/Push)

Sebelum melakukan `git add`, `git commit`, atau `git push`, selalu jalankan daftar periksa berikut di PowerShell agar file sensitif atau artefak build tidak ikut ter-commit:

### A. Pastikan File `.env` Ter-ignore oleh Git
Jalankan perintah `git check-ignore -v` untuk membuktikan bahwa file `.env` benar-benar diabaikan oleh `.gitignore` (baik di root maupun di `web/admin-web`):

```powershell
# Dari direktori web/admin-web:
git check-ignore -v .env .env.local .env.production ../backend/.env
```
- **Hasil yang benar:** Git menampilkan baris aturan `.gitignore` yang cocok untuk setiap file `.env` tersebut.
- **File yang BOLEH ter-track:** Hanya `.env.example` (karena dikecualikan melalui `!.env.example`).

### B. Pastikan Artefak Build & Dependensi Tidak Masuk Staging
Folder `node_modules/`, `dist/`, `dist-ssr/`, dan file `*.log` / `*.local` sudah terdaftar di [`.gitignore`](./.gitignore) dan [`../../.gitignore`](../../.gitignore). Pastikan dengan:

```powershell
git status --ignored
```

### C. Periksa Daftar File yang Ter-track di Git
Pastikan tidak ada file `.env`, kunci privat (`*.pem`, `*.key`), atau database dump yang tidak sengaja sudah ter-track:

```powershell
git ls-files
```

### D. Pindai Potensi Kebocoran Secret di Variabel `VITE_*`
Pastikan tidak ada `SERVICE_ROLE` atau secret backend di dalam folder `web/admin-web`:

```powershell
Select-String -Path "src/**/*", ".env*" -Pattern "SERVICE_ROLE|DATABASE_URL|DIRECT_URL|SECRET" -ErrorAction SilentlyContinue
```

---

## 7. Referensi Dokumen Terkait
- Sumber Kebenaran Proyek: [`docs/docs-proyek-ebook-ecommerce.md`](../../docs/docs-proyek-ebook-ecommerce.md)
- Spesifikasi Modul Dashboard Admin: [`docs/06-modules/admin-dashboard.md`](../../docs/06-modules/admin-dashboard.md)
- Panduan Agen & Aturan Proyek: [`AGENTS.md`](../../AGENTS.md)
- Kebijakan Keamanan: [`SECURITY.md`](../../SECURITY.md)
