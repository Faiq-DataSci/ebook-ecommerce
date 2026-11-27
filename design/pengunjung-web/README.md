# Web Pengunjung Design (FigCraft) — `[ADA]` Lengkap (Tahap 1–3)

Dokumen desain visual FigCraft hasil rekonstruksi *code-to-design* menyeluruh dari implementasi kode [web/pengunjung-web/src/](file:///D:/Semester%203/Sistem%20Informasi/Project/ebook-ecommerce/web/pengunjung-web/src).

## File Utama
- `pengunjung-web.figcraft` — Dokumen native FigCraft lengkap (**11 halaman**, **1.477 node**, **15 variabel**; siap dibuka di FigCraft Desktop).
- `previews/` — Snapshot render PNG tiap halaman untuk verifikasi visual (`01` s.d. `11`).

## Daftar Halaman `[ADA]`

### Tahap 1 — Fondasi & Etalase Utama
1. **01 — Design Tokens (Storefront)**: Koleksi variabel `Storefront Neubrutalism` + spesifikasi palet, tipografi, border, shadow, dan komponen `BookCard`.
2. **02 — Navbar & Footer Shell (`1440x900`)**: `NavbarMarquee`, `Navbar` utama (`E-BOOK STORE`), dan `Footer` 3 kolom.
3. **03 — Home Page (`1440x2680`)**: `HeroSection`, `FeaturedBooks` (4 kartu), `CategorySection` (7 kategori), `Alur Pembelian & Hak Akses` (3 langkah), `PromotionalSection` (Download Apps Android), dan `Footer`.
4. **04 — Catalog Page (`1440x1760`)**: `CatalogHero`, `CatalogFilters` sidebar (`300px`), `CatalogControlBar`, `BookGrid` (6 kartu e-book), `Pagination`, dan `Footer`.

### Tahap 2 — Detail Buku, SPK SAW & Pustaka Digital
5. **05 — Book Detail Page (`1440x1920`)**: `Breadcrumb`, layout 2 kolom (`BookInformation`, `Informasi Produk Digital`, `Ringkasan Skor Kualitas SPK SAW` C1–C4, `Ulasan Pembaca Terverifikasi`, sticky `PurchasePanel` pembelian langsung tanpa keranjang), dan `Footer`.
6. **06 — Recommendations SPK SAW Page (`1440x1760`)**: `RecommendationHeader` (stripe lavender + metadata engine SAW), `RecommendationFilterBar`, 4 `RecommendationRankCard` (`#1` highlight kuning s.d. `#4` dengan `SawScoreBar` & tombol detail), dan `Footer`.
7. **07 — Library Page (Pustaka Saya) (`1440x1480`)**: Welcome Header kuning + `Ringkasan Profil Pelanggan`, `LibraryAccessRulesCard` + 4 tombol mode simulasi state, grid 2 kolom `PurchasedBookCard` (`AKSES AKTIF • SIGNED URL`), `NonVerifiedOrdersSection` (pesanan tertunda dengan PDF terkunci), dan `Footer`.

### Tahap 3 — Riwayat Transaksi, Autentikasi & Akun Pelanggan
8. **08 — Purchase History Page (`1440x1360`)**: Header & filter status (`Semua`, `Lunas`, `Menunggu`, `Gagal`, `Kedaluwarsa`) + tombol uji state, `OrderTable` 4 baris representatif semua status, dan `Footer`.
9. **09 — Transaction Detail Page (`1440x1480`)**: `Breadcrumb`, panel pratinjau 4 state pembayaran, layout 2 kolom (`TransactionSummary` + `PaymentStatus`), dan `Footer`.
10. **10 — Login & Register Pages (`1440x1340`)**: Showcase berdampingan `LoginForm` (banner kuning, alat bantu simulasi) dan `RegisterForm` (banner biru, indikator kekuatan kata sandi 3-bar, checkbox aturan bisnis), dan `Footer`.
11. **11 — Account Page (`1440x1460`)**: Header kuning + 3 tombol aksi, grid 2 kolom `AccountProfileCard` & `AccountMetricsCard` (4 kartu KPI), `AccountRecentOrdersCard` (3 pesanan terbaru), dan `Footer`.
