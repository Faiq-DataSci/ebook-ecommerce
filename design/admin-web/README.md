# Admin Web Design (FigCraft) — `[ADA]` Lengkap (Tahap 1–5)

Dokumen desain visual FigCraft hasil rekonstruksi *code-to-design* lengkap dari seluruh antarmuka Admin Web di [web/admin-web/src/](file:///D:/Semester%203/Sistem%20Informasi/Project/ebook-ecommerce/web/admin-web/src).

## File Utama
- `admin-web.figcraft` — Dokumen native FigCraft lengkap (**16 halaman, 3.399 node, 21 variabel desain, 1 logo**; siap dibuka di FigCraft Desktop).
- `previews/` — 16 snapshot render PNG (`01` s.d. `16`) untuk verifikasi visual tiap halaman.

## Daftar Lengkap 16 Halaman `[ADA]`

### Tahap 1 — Fondasi, Shell, Login & Dashboard
1. **01 — Design Tokens (`1440x1180`)**: Koleksi variabel `Neubrutalism Tokens` + artboard palet, tipografi, border, shadow, dan primitif UI.
2. **02 — Shell Layout (`1440x900` & `72x900`)**: `AdminSidebar` expanded & collapsed + `AdminHeader` (`64px`) + slot `.main-content`.
3. **03 — Login Page (`1440x900`)**: `.login-card-wrapper` (`1040x580`), Zona A (`481px`) & Zona C (`553px`).
4. **04 — Dashboard Page (`1440x2160`)**: Shell + Welcome Banner + 4 KPI Cards + Stacked Bar Sales Chart + Live Stream Transaksi + Pintasan Cepat + Top Bestselling + Aktivitas & Notifikasi.

### Tahap 2 — Katalog & Produk
5. **05 — E-Book Catalog Page (`1440x1460`)**: Koleksi E-Book, badge `API LIVE`, 4 KPI cards, filter bar + category shelf, tabel 8 kolom + paginasi.
6. **06 — Category Catalog Page (`1440x1120`)**: Kategori & Tag, 4 KPI cards, filter bar, tabel 6 kolom + paginasi.
7. **07 — Author & Publisher Page (`1440x1280`)**: Penulis & Penerbit, 4 KPI cards, tabs `Direktori Penulis / Mitra Penerbit`, tabel 7 kolom + paginasi.

### Tahap 3 — Transaksi & Keuangan
8. **08 — Orders & Transactions Page (`1440x1300`)**: Semua Pesanan, 4 KPI cards beraksen atas 5px, filter bar + quick chips, tabel 9 kolom (`EbookAccess`) + paginasi.
9. **09 — Payment & Webhook Page (`1440x1540`)**: Verifikasi & Webhook, `WebhookSimulatorCard` + terminal console HMAC SHA512, 3 KPI cards, tabel 9 kolom audit callback.
10. **10 — Finance & Omzet Page (`1440x1100`)**: Laporan Omzet & Beban Gateway, 4 KPI finansial, `Distribusi Saluran & Tarif MDR`, dan tabel `Transaksi Masuk Terbaru`.

### Tahap 4 — Intelijen & Sistem
11. **11 — Analytics Page (`1440x1920`)**: Analitik Bisnis & Penjualan, period bar, 5 Executive KPI cards, grafik tren 14 hari, Corong Konversi, Kontribusi Kategori + banner korelasi SAW, dan tabel Performa E-Book Teratas.
12. **12 — SPK SAW Matrix Page (`1440x1620`)**: Audit Matriks SAW, 3 kartu referensi kriteria (`C1`–`C3`), panel rumus matematis Cost/Benefit & `V_i`, tabel Matriks Keputusan (X) & Normalisasi (R), serta kartu peringkat teratas (`#1`–`#3`).
13. **13 — Customers & Users Page (`1440x1160`)**: Pelanggan & User, banner `DATA SIMULASI`, 4 KPI cards, toolbar filter, dan tabel 6 kolom akun pengguna + paginasi.
14. **14 — System Settings Page (`1440x940`)**: Pengaturan Sistem, 4 tab (`Umum`, `Akun Admin`, `Sistem`, `Keamanan`), panel Identitas Platform (`READ-ONLY`), dan Konfigurasi Profil Toko Dinamis.

### Tahap 5 — Formulir, Modal & Drawer
15. **15 — EbookForm & Live Preview (`1440x1340`)**: Form 3 tahap (Metadata, Harga & SPK SAW, Aset Sampul Publik & PDF Bucket Privat) + Sticky `EbookLivePreview`.
16. **16 — Modals & Drawers Kit (`1440x1280`)**: `OrderDetailModal` (`800px` dengan `EbookAccessControlPanel` & `OrderWebhookTimeline`), `SawWeightEditModal` (`520px`), dan `CustomerDetailDrawer` (`520px`).
