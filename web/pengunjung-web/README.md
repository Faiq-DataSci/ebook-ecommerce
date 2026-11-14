# Storefront Web E-Book (`web/pengunjung-web`)

Antarmuka web etalase pelanggan (*Customer Storefront*) untuk **Sistem Informasi E-Commerce E-Book** dengan identitas visual **Modern Neubrutalism** (`DESIGN.md` v2.0).

---

## 1. Status Implementasi (`AGENTS.md`)

- **Antarmuka Etalase Pelanggan (`web/pengunjung-web`):** `[ADA]`
  - Mencakup 8 layar utama pelanggan, sistem desain token `nb-*`, komponen UI Neubrutalism, kontrol akses rute pelanggan, dan simulasi alur transaksi beserta pembukaan hak akses baca PDF bersyarat (`paymentStatus === 'paid'` dan `orderStatus === 'completed'`).
  - Seluruh katalog contoh, transaksi contoh, dan unduhan manifes APK diberi label eksplisit **`"DATA SIMULASI"`**.
- **Integrasi REST API Backend Produksi (`backend`):** `[RENCANA]`
  - Lapisan layanan di `src/services/` telah memisahkan kontrak endpoint (`src/services/api/endpoints.ts`) dari data simulasi (`src/data/`) sehingga siap dihubungkan ke backend Express + TypeScript + Prisma 7.
- **Aplikasi Mobile Android (`ebook_store` - Flutter):** `[RENCANA]`
  - Tersedia tombol navigasi **Download Apps E-Book Store** di header dan beranda untuk mengunduh manifes informasi rilis simulasi aplikasi Android.

---

## 2. Batasan Lingkup (*Scope Constraints*)

1. **Toko Tunggal B2C (*Single-Store Digital Bookstore*):** Bukan *multi-vendor marketplace*.
2. **Khusus Pengunjung & Pelanggan:** Tidak memuat rute, menu, maupun komponen *Admin Dashboard*.
3. **Bebas Modul SAW di Etalase:** Sesuai spesifikasi proyek, metode rekomendasi *Simple Additive Weighting* (SAW) tidak ditampilkan di etalase ini dan perhitungannya hanya berada di sisi backend.
4. **Pembelian Langsung (*Direct Single-Book Order*):** Tidak menggunakan keranjang belanja (*shopping cart*).
5. **Hak Akses Baca Bersyarat:** E-Book di **Pustaka Saya (`/library`)** hanya dapat dibuka atau diunduh apabila status pembayaran telah terverifikasi lunas (`paid`) dan status pesanan selesai (`completed`).

---

## 3. Daftar Layar & Rute (`[ADA]`)

| No | Layar | Rute | Akses | Deskripsi |
| :- | :--- | :--- | :--- | :--- |
| 1 | **Storefront Homepage** | `/` | Publik | Hero editorial, eksplorasi kategori, e-book pilihan, koleksi terbaru, alur hak akses, dan seksi unduh aplikasi Android (`#download-app`). |
| 2 | **E-Book Catalog** | `/catalog` | Publik | Pencarian *debounced*, filter kategori & rentang harga, pengurutan, grid kartu e-book, dan paginasi. |
| 3 | **E-Book Detail** | `/books/:id` | Publik | Rincian e-book, informasi hak akses digital, buku terkait, dan panel pembuatan pesanan langsung. |
| 4 | **Customer Login** | `/login` | Publik | Formulir masuk pelanggan dengan validasi, kontrol visibilitas kata sandi, dan tombol akun demo satu klik. |
| 5 | **Customer Registration** | `/register` | Publik | Formulir pendaftaran pelanggan baru dengan validasi kecocokan kata sandi. |
| 6 | **My E-Books Library** | `/library` | Pelanggan (`CUSTOMER`) | Pustaka digital pelanggan dengan pemisahan e-book aktif (`paid`) vs terkunci (`pending`/`failed`/`expired`), pratinjau baca PDF, dan *Signed URL* simulasi. |
| 7 | **Customer Account** | `/account` | Pelanggan (`CUSTOMER`) | Profil pelanggan terdaftar, ringkasan metrik pustaka & transaksi, transaksi terbaru, serta kontrol keluar/reset simulasi. |
| 8 | **Purchase History** | `/orders` | Pelanggan (`CUSTOMER`) | Ringkasan metrik pesanan, filter status pembayaran, tabel desktop, dan kartu responsif mobile. |
| 9 | **Transaction Detail** | `/orders/:id` | Pelanggan (`CUSTOMER`) | Rincian pesanan, referensi pembayaran Midtrans Snap, lini masa transaksi, serta simulator perubahan status pembayaran (`DATA SIMULASI`). |

---

## 4. Struktur Direktori (`src/`)

```text
src/
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   └── providers/
│       └── AppProviders.tsx
├── components/
│   ├── ui/             # Button, Input, Badge, Card, Modal, Spinner
│   ├── layout/         # Navbar, Footer, MainLayout, AuthLayout
│   └── shared/         # BookCard, CategoryCard, SearchBar, Pagination, PriceDisplay, EmptyState, Breadcrumb
├── features/
│   ├── home/           # HeroSection, CategorySection, FeaturedBooks, PromotionalSection, HomePage
│   ├── catalog/        # CatalogFilters, SortSelector, BookGrid, useCatalog, CatalogPage
│   ├── book-detail/    # BookInformation, PurchasePanel, BookDetailPage
│   ├── auth/           # LoginForm, RegisterForm, useAuth, LoginPage, RegisterPage
│   ├── library/        # PurchasedBookCard, LibraryPage
│   └── orders/         # OrderTable, PaymentStatus, TransactionSummary, PurchaseHistoryPage, TransactionDetailPage
├── services/
│   ├── api/            # apiClient.ts, endpoints.ts
│   ├── auth.service.ts
│   ├── book.service.ts
│   ├── order.service.ts
│   └── payment.service.ts
├── data/               # mock-books.ts, mock-categories.ts (berlabel "DATA SIMULASI")
├── hooks/              # useDebounce.ts
├── types/              # book.types.ts, user.types.ts, order.types.ts, payment.types.ts
├── utils/              # formatCurrency.ts, formatDate.ts, validators.ts
├── constants/          # routes.ts, app.constants.ts
└── styles/             # variables.css, globals.css, utilities.css
```

---

## 5. Perintah Pengembangan & Verifikasi

Pastikan berada di direktori `web/pengunjung-web`:

```powershell
# Menjalankan server pengembangan lokal (Vite)
npm run dev

# Memeriksa tipe TypeScript (tsconfig.app.json & tsconfig.node.json)
npm run typecheck

# Memeriksa kualitas kode dengan ESLint
npm run lint

# Membuat bundel produksi di folder dist/
npm run build
```
