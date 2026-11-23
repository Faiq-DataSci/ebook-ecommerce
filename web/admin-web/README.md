# Admin Web — E-Book E-Commerce & SPK (Metode SAW)

Aplikasi web administrasi (`web/admin-web`) untuk pengelolaan toko e-book B2C (*single-seller*) dan pemantauan Sistem Pendukung Keputusan (SPK) rekomendasi e-book menggunakan metode *Simple Additive Weighting* (SAW).

Aplikasi dibangun dengan **React 19 + TypeScript 6 + Vite 8**, mengusung arsitektur berbasis fitur (**Feature-Based Modular Architecture**), serta menerapkan desain sistem **Neo-Brutalism (3 Zona Intensitas)** sesuai spesifikasi [`design.md`](file:///D:/Semester%203/Sistem%20Informasi/Project/ebook-ecommerce/docs/01-design/ui-ux/design.md).

---

## 1. Arsitektur Folder Proyek (Feature-Based Architecture)

Struktur kode diatur dengan prinsip **Separation of Concerns (SoC)**, **High Cohesion**, dan **Loose Coupling**:

```text
web/admin-web/
├── public/                          # Aset statis publik (favicon, icons, manifest)
├── src/
│   ├── app/                         # Shell aplikasi & infrastruktur tata letak global
│   │   ├── layouts/                 # Shell layout admin & subkomponen layout
│   │   │   ├── AdminLayout.tsx      # Pembungkus layout utama (Sidebar + Header + Main Area)
│   │   │   └── components/
│   │   │       ├── AdminHeader.tsx  # Topbar: breadcrumb, pencarian, notifikasi, profil
│   │   │       ├── AdminSidebar.tsx # Sidebar navigasi (desktop rail & mobile drawer)
│   │   │       ├── SidebarDropdown.tsx # Submenu akordeon & flyout
│   │   │       └── SidebarMenuItem.tsx # Item menu tunggal
│   │   ├── navigation/              # Definisi rute, menu, breadcrumb resolver
│   │   │   └── adminNavigation.ts   # Skema menu grup & resolver navigasi
│   │   └── hooks/                   # Hooks infrastruktur shell
│   │       └── useSidebar.ts        # State management collapse, drawer, & history router
│   │
│   ├── features/                    # Modul bisnis independen per domain
│   │   ├── dashboard/               # Fitur: Dashboard & Ringkasan Penjualan
│   │   │   ├── components/          # DashboardContent, grafik penjualan, aktivitas
│   │   │   ├── data/                # dashboardData.ts (KPI simulation dataset)
│   │   │   ├── types/               # dashboard.ts (Domain models)
│   │   │   └── pages/               # DashboardPage.tsx
│   │   │
│   │   ├── ebooks/                  # Fitur: Manajemen Katalog E-Book
│   │   │   ├── components/          # PrivateAssetUploader (upload PDF bucket privat)
│   │   │   ├── data/                # catalogData.ts
│   │   │   ├── types/               # catalog.ts
│   │   │   └── pages/               # EbookCatalogPage.tsx
│   │   │
│   │   ├── categories/              # Fitur: Kategori & Tag Katalog
│   │   │   └── pages/               # CategoryCatalogPage.tsx
│   │   │
│   │   ├── authors-publishers/      # Fitur: Penulis & Penerbit E-Book
│   │   │   ├── data/                # authorPublisherData.ts
│   │   │   ├── types/               # authorPublisher.ts
│   │   │   └── pages/               # AuthorPublisherPage.tsx
│   │   │
│   │   ├── transactions/            # Fitur: Operasional Transaksi & Webhook
│   │   │   ├── components/          # OrderWebhookTimeline, EbookAccessControlPanel,
│   │   │   │                        # OrderDetailModal, RawWebhookModal
│   │   │   ├── data/                # transactionFinanceData.ts (Orders & Payment audit)
│   │   │   ├── types/               # transactionFinance.ts
│   │   │   └── pages/               # TransactionFinancePage.tsx
│   │   │
│   │   ├── finance/                 # Fitur: Akuntansi, Omzet, & Settlement Kas
│   │   │   ├── components/          # SettlementBatchModal
│   │   │   └── pages/               # FinancePage.tsx
│   │   │
│   │   └── analytics/               # Fitur: Analitik Bisnis & Konversi SAW
│   │       ├── data/                # analyticsData.ts
│   │       ├── types/               # analytics.ts
│   │       └── pages/               # AnalyticsPage.tsx
│   │
│   ├── shared/                      # Komponen & utilitas bersama lintas modul
│   │   ├── components/
│   │   │   └── ui/                  # Komponen antarmuka Neo-Brutalism reusable
│   │   │       ├── ConfirmDialog.tsx # Dialog konfirmasi tindakan destruktif/kritis
│   │   │       ├── EmptyState.tsx   # Tampilan kosong informatif
│   │   │       ├── FilterChipGroup.tsx # Filter pil horizontal
│   │   │       ├── FilterSelect.tsx # Dropdown filter kustom
│   │   │       ├── Pagination.tsx   # Navigasi paginasi tabel
│   │   │       ├── SearchInput.tsx  # Input pencarian terpadu
│   │   │       ├── SimulationBadge.tsx # Label identifikasi data simulasi
│   │   │       ├── StatusBadge.tsx  # Badge status transaksi/katalog
│   │   │       ├── TableSkeleton.tsx # Skeleton loader tabel Zona C
│   │   │       ├── Toast.tsx        # Notifikasi feedback sistem
│   │   │       ├── ToggleSwitch.tsx # Sakelar status aktif/non-aktif
│   │   │       └── index.ts         # Barrel export shared UI components
│   │   ├── types/                   # Tipe data bersama (navigation.ts, dll)
│   │   └── utils/                   # Fungsi murni (formatRupiah, formatPercent)
│   │       └── formatters.ts
│   │
│   ├── styles/                      # Desain token & stylesheet Neo-Brutalism
│   │   ├── tokens.css               # Variabel CSS (warna, border 2px-3px, shadow 3px-4px)
│   │   ├── admin-layout.css         # Styling grid layout utama
│   │   ├── admin-sidebar.css        # Styling sidebar & akordeon menu
│   │   ├── dashboard.css            # Styling KPI & chart dashboard
│   │   ├── catalog.css              # Styling katalog e-book & form
│   │   ├── transaction-finance.css  # Styling Zona C (tabel transaksi, timeline, ledger)
│   │   └── analytics.css            # Styling grafik metrik analitik
│   │
│   ├── App.tsx                      # Root component pengatur router halaman
│   ├── main.tsx                     # React application entry point
│   ├── index.css                    # Pemuatan token global
│   └── vite-env.d.ts                # TypeScript definition untuk Vite client
│
├── index.html                       # HTML Template & Web Fonts
├── package.json                     # Konfigurasi dependensi dan skrip proyek
├── tsconfig.json                    # Root TypeScript configuration
├── tsconfig.app.json                # Strict TypeScript configuration untuk aplikasi
├── tsconfig.node.json               # TypeScript configuration untuk lingkungan Vite
└── vite.config.ts                   # Konfigurasi bundler Vite
```

---

## 2. Penjelasan Tanggung Jawab Folder

| Folder | Tanggung Jawab |
| :--- | :--- |
| `src/app/` | Mengelola *app shell*, routing navigation resolver, layout wrapper (`AdminLayout`), sidebar, dan header global. Folder ini tidak memuat business logic spesifik fitur bisnis. |
| `src/features/` | Mengelompokkan kode berdasarkan domain fitur bisnis. Setiap sub-folder fitur bersifat modular dan mandiri (memiliki `components/`, `pages/`, `types/`, dan `data/` sendiri). |
| `src/shared/components/ui/` | Berisi komponen antarmuka umum yang benar-benar digunakan lintas fitur (misal: `ConfirmDialog`, `Toast`, `Pagination`, `StatusBadge`). |
| `src/shared/utils/` | Fungsi utilitas murni (*pure functions*) tanpa dependensi state, seperti pemformatan Rupiah dan tanggal. |
| `src/shared/types/` | Definisi TypeScript antarmuka bersama yang dipakai lintas domain (misal: navigasi dan rute). |
| `src/styles/` | Desain token Neo-Brutalism (Zona A, B, C) yang terpusat agar konsistensi border hitam, bayangan kaku, dan palet warna tetap terjaga. |

---

## 3. Standar Penamaan & Clean Code

- **Komponen React**: Wajib menggunakan `PascalCase` (contoh: `OrderDetailModal.tsx`, `ConfirmDialog.tsx`).
- **Fungsi & Variabel**: Wajib menggunakan `camelCase` (contoh: `formatRupiah`, `handleToggleAccess`).
- **Tipe Data / Interface**: Wajib menggunakan `PascalCase` (contoh: `OrderRecord`, `SettlementRecord`).
- **File Data / Utilities**: Wajib menggunakan `camelCase` (contoh: `formatters.ts`, `catalogData.ts`).
- **Prinsip Separation of Concerns**:
  1. Halaman (`pages/`) bertugas mengatur komposisi komponen dan alur rute.
  2. Komponen fitur (`components/`) menangani UI spesifik domain.
  3. Formatter dan logika matematika murni diletakkan di `shared/utils/`.
  4. Hindari membuat file berukuran raksasa; pecah komponen modal atau section kompleks menjadi sub-komponen terpisah di folder `components/` milik fitur terkait.

---

## 4. Panduan Pengembangan

### A. Cara Menambahkan Fitur Baru

1. Buat folder baru di bawah `src/features/<nama-fitur>/`.
2. Siapkan struktur internal fitur sesuai kebutuhan:
   ```text
   src/features/<nama-fitur>/
   ├── components/    # Komponen spesifik fitur
   ├── data/          # Dataset simulasi / mock awal
   ├── types/         # Interface & type TypeScript domain
   └── pages/         # Halaman utama fitur
   ```
3. Daftarkan path rute baru di `src/app/navigation/adminNavigation.ts` pada grup yang sesuai (`ADMIN_NAVIGATION_GROUPS`).
4. Hubungkan halaman baru ke switch-case di `src/App.tsx`.

### B. Cara Menambahkan Komponen Reusable

1. Jika komponen digunakan oleh **lebih dari dua domain berbeda**, letakkan di `src/shared/components/ui/<NamaKomponen>.tsx`.
2. Pastikan komponen menggunakan token Neo-Brutalism (`var(--nb-border-25)`, `var(--nb-shadow-sm)`).
3. Ekspor komponen melalui `src/shared/components/ui/index.ts` agar dapat di-import secara ringkas:
   ```tsx
   import { ConfirmDialog, StatusBadge } from '../../../shared/components/ui'
   ```

### C. Cara Menambahkan Service API / Integrasi Backend

Ketika mengintegrasikan endpoint backend Express atau Supabase:
1. Buat folder `src/services/api/` untuk menyimpan HTTP client terpusat.
2. Buat file service per domain di dalam folder fitur masing-masing (misal: `src/features/ebooks/services/ebookService.ts`).
3. Selalu simpan token otentikasi di storage yang aman dan jangan pernah menaruh credential sensitif / *service role key* di kode frontend.

---

## 5. Cara Menjalankan Project

Pastikan Node.js (v20+ disarankan) telah terinstal.

```bash
# 1. Masuk ke direktori admin-web
cd web/admin-web

# 2. Menjalankan server pengembangan (Hot Module Replacement)
npm run dev

# 3. Menjalankan pemeriksaan typecheck TypeScript & build produksi Vite
npm run build

# 4. Menjalankan pemeriksaan linting kode (ESLint)
npm run lint

# 5. Pratinjau hasil build produksi secara lokal
npm run preview
```

---

## 6. Kepatuhan Aturan Data Simulasi

Sesuai ketentuan **`AGENTS.md`**:
- Seluruh data yang belum terhubung ke endpoint REST API produksi backend wajib diberi tanda/label eksplisit **`"DATA SIMULASI"`**.
- Tidak diperbolehkan membuat tombol tanpa aksi; seluruh tombol interaktif telah dilengkapi dialog konfirmasi atau notifikasi toast.
