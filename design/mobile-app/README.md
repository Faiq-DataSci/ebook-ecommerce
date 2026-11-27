# Mobile App Design (FigCraft — Flutter `ebook_store`) — `[ADA]` Lengkap (Tahap 1–4)

Dokumen desain visual FigCraft hasil rekonstruksi *code-to-design* menyeluruh dari implementasi aplikasi mobile Flutter [mobile/ebook_store/lib/](file:///D:/Semester%203/Sistem%20Informasi/Project/ebook-ecommerce/mobile/ebook_store/lib).

## File Utama
- `ebook-store-mobile.figcraft` — Dokumen native FigCraft lengkap (**16 halaman**, **1.041 node**, **15 variabel**, **1 gambar logo asli `app_logo.png`**; siap dibuka di FigCraft Desktop).
- `previews/` — Snapshot render PNG tiap halaman untuk verifikasi visual (`01` s.d. `16`).

## Daftar Halaman `[ADA]`

### Tahap 1 — Design System, Splash & Autentikasi
1. **01 — Mobile Design Tokens & UI Kit (`1200x880`)**: Koleksi variabel `Mobile Neubrutalism`, `AppColors`, `AppTheme`, primitives, dan `BottomNavBar`.
2. **02 — Splash Screen (`390x884`)**: `SplashHeader`, `SplashHeroCard` dengan logo asli `app_logo.png`, `SplashFooter` status 100% siap.
3. **03 — Login Screen (`390x884`)**: `LoginNavBar`, `LoginHeroZoneA`, `LoginFormZoneC` (autofill demo `DATA SIMULASI`), `LoginRegisterCard`, `LoginFooter`.
4. **04 — Register Screen (`390x1040`)**: `RegisterNavBar`, `RegisterHeroZoneA`, `RegisterFormZoneC` (4 field bertag mono, kekuatan sandi 4-bar, checkbox aturan bisnis).

### Tahap 2 — Eksplorasi Katalog & Rekomendasi SAW
5. **05 — Home Screen (`390x1180`)**: `HomeHeader`, `HomeSearchBar`, `HomeBanner` SPK SAW, `CategorySection`, grid 2×2 `BookCard`, `BottomNavBar`.
6. **06 — Catalog Screen (`390x1120`)**: `CatalogHeader`, `CatalogSearchBar`, `CategoryPillsBar`, `CatalogToolbar`, `ActiveFilterChips`, grid 2×2 `EbookCard`, `BottomNavBar`.
7. **07 — E-Book Detail Screen (`390x1160`)**: App Bar + Wishlist, Cover Showcase, spesifikasi, `Tentang E-Book Ini`, `Skor Kualitas SPK SAW` (C1–C4), pratinjau ulasan, sticky bottom CTA.
8. **08 — SAW Ranking Screen (`390x1100`)**: Header `SPK REKOMENDASI SAW`, `SawCriteriaInfoCard`, filter kategori, 4 `SawRankCard` (`#1` s.d. `#4`).

### Tahap 3 — Keranjang, Checkout & Pustaka PDF Reader
9. **09 — Cart Screen (`390x980`)**: `CartHeader`, `CartDigitalNotice`, `CartBulkSelectionBar`, 2 `CartItemCard`, `CartPromoSection`, `CartSummarySection`, sticky `CartBottomCheckoutBar`.
10. **10 — Checkout Screen (`390x960`)**: App Bar `CHECKOUT & PEMBAYARAN`, `CheckoutStepper` (3 langkah), `OrderSummaryCard`, `PaymentGatewayCard` (QRIS / VA / E-Wallet + info webhook), bottom CTA.
11. **11 — Library Screen (Pustaka Saya) (`390x980`)**: Header `PERPUSTAKAAN DIGITAL`, filter tab, 3 `LibraryBookCard` dengan progress baca & badge `AKSES AKTIF • SIGNED URL`, `BottomNavBar`.
12. **12 — In-App PDF Reader Screen (`390x884`)**: `InAppPdfReaderToolbar` (tanpa tombol unduh sesuai ADR-0006), strip `SIGNED URL AKTIF`, kanvas halaman PDF berdiagram, kontrol navigasi halaman bawah.

### Tahap 4 — Riwayat Pesanan, Detail Transaksi & Profil
13. **13 — Order History Screen (`390x960`)**: Header `RIWAYAT PESANAN`, filter status, 4 `OrderCard` representatif (`LUNAS`, `MENUNGGU`, `GAGAL`, `KEDALUWARSA`).
14. **14 — Order Detail Screen (`390x960`)**: `ProfileAppBar`, status lunas & verifikasi webhook, daftar e-book, rincian pembayaran, tombol `Buka E-Book di Pustaka Saya`.
15. **15 — Profile & Transactions Screen (`390x1080`)**: `ProfileHeaderCard` kuning, `AboutAppSection`, filter & daftar pesanan terbaru, `BottomNavBar`.
16. **16 — Edit Profile Screen (`390x844`)**: `ProfileAppBar`, form `INFORMASI PENGGUNA` (`Nama Lengkap`, `Email` terkunci, `Nomor Telepon`), catatan sinkronisasi `PUT /api/v1/users/me`, tombol `SIMPAN PERUBAHAN`.
