# BUKUKITA (`ebook_store`)

Aplikasi mobile Flutter untuk **Sistem Informasi E-Commerce E-Book & Sistem Pendukung Keputusan (SPK)** berbasis metode **Simple Additive Weighting (SAW)**.

> **Catatan Arsitektur Penting:** Perhitungan skor SAW, validasi otorisasi, serta penerbitan *signed URL* untuk file PDF (Supabase Storage bucket privat) dilakukan sepenuhnya di **backend**. Aplikasi mobile hanya mengirim preferensi/permintaan dan menampilkan hasil dari API.

---

## Status Implementasi

### `[ADA]` Sudah Tersedia Saat Ini
- **Arsitektur Modular 3 Lapis (`lib/features/`):** Struktur fitur bersih memisahkan `data/` (models, datasources, repository impl), `domain/` (entities, repository contracts), dan `presentation/` (pages, widgets, providers) sesuai panduan `mobile/AGENTS.md`.
- **Splash Screen:** `lib/features/splash/presentation/pages/splash_screen.dart` dan widget terkait sebagai loading awal aplikasi.
- **Autentikasi (Login & Registrasi):** 
  - `lib/features/auth/presentation/pages/login_screen.dart` dan `register_screen.dart`.
  - Panel validasi, banner error, kontrol visibilitas kata sandi, dan penyimpanan token aman dengan `FlutterSecureStorage` via `auth_local_datasource.dart`.
  - State management autentikasi menggunakan `auth_provider.dart`.
- **Katalog & Detail E-Book:**
  - `lib/features/catalog/presentation/pages/catalog_screen.dart` dan `ebook_detail_screen.dart`.
  - Fitur pencarian terfilter, filter rentang harga modal sheet, pill kategori, dan active filter chips.
  - Data model `catalog_ebook_model.dart`, `catalog_category_model.dart`, dan mock datasource berlabel `"DATA SIMULASI"`.
- **Beranda Mobile (Neubrutalism):** Implementasi UI Light Mode (*Newsprint Palette* `#FFFDF5`) di `lib/features/home/presentation/pages/home_screen.dart` yang mencakup:
  - Header (`BUKUKITA`), tombol indikator mode terang, badge keranjang, sapaan pengguna, dan badge `KURASI PINTAR`.
  - Search bar dengan filter langsung, Hero Banner rekomendasi terkurasi, dan modal dialog.
  - Bagian `KATEGORI PILIHAN` (6 bidang: Semua, Teknologi & AI, Bisnis & Finansial, Desain & UI/UX, Sains & Riset, Sastra & Fiksi).
  - Kartu Rekomendasi Terbaik `#1`, Rilisan Terbaru, Flash Sale, dan Bottom Navigation.
- **State Management (`flutter_riverpod`):** Provider `home_provider.dart`, `catalog_provider.dart`, dan `auth_provider.dart` mengelola seluruh interaksi UI.
- **Konfigurasi HTTP & Lingkungan (`dio`):** `ApiConfig` (`lib/core/config/api_config.dart`) dan `dioClientProvider` (`lib/core/network/dio_client.dart`) siap pakai.
- **Data Simulasi (`DATA SIMULASI`):** Data mock terpusat berlabel eksplisit `"DATA SIMULASI"` sebelum integrasi API penuh.
- **Suite Pengujian Terpadu (9 File Tes):** Seluruh file pengujian di `test/` (`splash_screen_test.dart`, `login_screen_test.dart`, `register_screen_test.dart`, `login_error_state_test.dart`, `catalog_screen_test.dart`, `catalog_filter_test.dart`, `catalog_model_test.dart`, `home_book_detail_test.dart`, `widget_test.dart`).

### `[RENCANA]` Tahap Pengembangan Berikutnya
- **Integrasi Backend REST API Nyata (`/api/v1`):** Menghubungkan katalog, autentikasi Supabase, pesanan, dan hasil rekomendasi SAW langsung ke backend Express + TypeScript.
- **Pembaca PDF Dalam Aplikasi (*In-App PDF Reader*):** Membuka file PDF terenkripsi/privat melalui *signed URL* sementara dari backend setelah status pesanan lunas terverifikasi.
- **Checkout & Alur Pembayaran:** Integrasi formulir checkout dan pembayaran Midtrans Snap.

---

## Stack & Dependensi Utama

Berdasarkan `pubspec.yaml`:
- **Dart SDK:** `^3.12.0`
- **State Management:** `flutter_riverpod: ^2.6.1`
- **HTTP Client:** `dio: ^5.8.0+1`
- **Secure Storage:** `flutter_secure_storage: ^9.2.4`
- **UI Preview:** `device_preview: ^1.3.1`
- **Tipografi Lokal (`assets/fonts/`):** `Syne`, `Space Grotesk`, `Inter`, dan `Space Mono`
- **Aset Sampul (`assets/images/covers/`):** `desain_sistem_modern.png`, `algoritma_struktur_data.png`, `psikologi_produk_digital.png`

---

## Struktur Direktori `lib/`

```text
lib/
├── main.dart                         # Entry point & konfigurasi DevicePreview + ProviderScope
├── app/
│   └── app.dart                      # Root MaterialApp (EbookStoreApp)
├── core/
│   ├── config/
│   │   └── api_config.dart           # Konfigurasi baseUrl (emulator, fisik, web)
│   ├── constants/
│   │   └── app_assets.dart           # Konstanta path aset gambar/font
│   └── network/
│       └── dio_client.dart           # Provider Dio terpusat (dioClientProvider)
│   ├── utils/
│   │   └── rupiah_formatter.dart     # Formatter nominal Rupiah
│   └── widgets/
│       └── iphone_preview_frame.dart # Frame pratinjau iPhone
├── features/
│   ├── auth/                         # Data, Domain, Presentation (Login, Register, Token Storage)
│   ├── catalog/                      # Data, Domain, Presentation (Katalog, Filter, Detail E-Book)
│   ├── home/                         # Data, Domain, Presentation (Beranda, Banner, Rekomendasi)
│   └── splash/                       # Presentation (Splash screen & transisi)
└── theme/
    ├── app_colors.dart               # Token warna Neubrutalism (NbPalette)
    └── app_theme.dart                # Tema Material & helper AppTheme.brutalBox
```

---

## Konfigurasi Lingkungan API

`ApiConfig.baseUrl` di `lib/core/config/api_config.dart` otomatis menyesuaikan target platform (port default `3000`, prefix `/api/v1`):

| Lingkungan | Nilai `baseUrl` | Keterangan |
| :--- | :--- | :--- |
| **Web (Chrome)** | `http://localhost:3000/api/v1` | Otomatis saat `kIsWeb == true` |
| **Emulator Android** | `http://10.0.2.2:3000/api/v1` | Default pada target Android |
| **Perangkat Fisik** | `http://<API_HOST>:3000/api/v1` | Aktifkan dengan `--dart-define` |

Contoh menjalankan pada perangkat fisik Android dengan IP LAN server backend:

```powershell
flutter run --dart-define=USE_PHYSICAL_DEVICE=true --dart-define=API_HOST=192.168.1.100
```

> **Keamanan:** Jangan pernah menyimpan *secret*, API key privat, atau Supabase *service role key* di dalam kode Flutter.

---

## Menjalankan & Menguji Proyek

Pastikan Flutter SDK sudah terpasang, lalu jalankan perintah berikut dari direktori `mobile/ebook_store`:

```powershell
# 1. Unduh dependensi
flutter pub get

# 2. Jalankan aplikasi (pilih emulator Android, Chrome, atau perangkat fisik)
flutter run

# 3. Analisis statis (lint)
flutter analyze

# 4. Jalankan widget test
flutter test
```

Cakupan pengujian saat ini (`test/widget_test.dart`):
- Rendering seluruh section Beranda tanpa overflow pada viewport `390x884`, `360x800`, dan `412x915`.
- Interaksi UI: tombol mode terang, penambahan badge keranjang, modal rekomendasi terkurasi, pencarian ke state kosong (`empty`), serta simulasi state `loading` dan `error` beserta tombol coba lagi.
- Rendering di dalam `DevicePreview` pada viewport desktop (`1280x900`).
