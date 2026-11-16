# BUKUKITA (`ebook_store`)

Aplikasi mobile Flutter untuk **Sistem Informasi E-Commerce E-Book & Sistem Pendukung Keputusan (SPK)** berbasis metode **Simple Additive Weighting (SAW)**.

> **Catatan Arsitektur Penting:** Perhitungan skor SAW, validasi otorisasi, serta penerbitan *signed URL* untuk file PDF (Supabase Storage bucket privat) dilakukan sepenuhnya di **backend**. Aplikasi mobile hanya mengirim preferensi/permintaan dan menampilkan hasil dari API.

---

## Status Implementasi

### `[ADA]` Sudah Tersedia Saat Ini
- **Beranda Mobile (Neubrutalism):** Implementasi UI Light Mode (*Newsprint Palette* `#FFFDF5`) di `lib/screens/home/home_screen.dart` dan `lib/widgets/home/` yang mencakup:
  - Header (`BUKUKITA`), tombol indikator mode terang, badge keranjang, sapaan pengguna, dan badge `KURASI PINTAR`.
  - Search bar (`Cari judul, penulis, ISBN...`) dengan filter langsung.
  - Hero Banner (`ASISTEN BACAAN` / `Bingung Pilih Buku?`) dan modal `REKOMENDASI TERKURASI`.
  - Bagian `KATEGORI PILIHAN` (6 bidang: Semua, Teknologi & AI, Bisnis & Finansial, Desain & UI/UX, Sains & Riset, Sastra & Fiksi).
  - Kartu Rekomendasi Terbaik `#1` (`Rekomendasi Terbaik Untukmu`), `Rilisan Terbaru`, `FLASH SALE & BUNDEL HEMAT`, serta Bottom Navigation (`Beranda`, `Katalog`, `Pustaka`, `Profil`).
- **State Management (`flutter_riverpod`):** `HomeNotifier` di `lib/providers/home_provider.dart` mengelola pencarian, pemilihan kategori, tab navigasi, penghitung keranjang, dan 4 status tampilan (`loaded`, `loading`, `empty`, `error` lengkap dengan tombol coba lagi).
- **Konfigurasi HTTP & Lingkungan (`dio`):** `ApiConfig` (`lib/core/config/api_config.dart`) dan `dioClientProvider` (`lib/core/network/dio_client.dart`) sudah disiapkan secara terpusat.
- **Data Simulasi (`DATA SIMULASI`):** `HomeMockData` (`lib/data/mock/home_mock_data.dart`) menyediakan data contoh berlabel eksplisit `"DATA SIMULASI"` sebelum integrasi API penuh.
- **Pratinjau & Pengujian:** Dukungan `DevicePreview` (default iPhone 13 pada mode non-release) di `lib/main.dart` serta widget test di `test/widget_test.dart`.

### `[RENCANA]` Tahap Pengembangan Berikutnya
- **Integrasi Backend REST API (`/api/v1`):** Menghubungkan katalog, detail buku, keranjang, transaksi, dan hasil rekomendasi SAW langsung ke backend Express + TypeScript.
- **Autentikasi & Penyimpanan Aman:** Login/registrasi pengguna dengan penyimpanan token menggunakan `flutter_secure_storage`.
- **Halaman Lanjutan:** Implementasi penuh layar Katalog, Pustaka Saya, Profil, Checkout, dan pembaca PDF melalui *signed URL* sementara dari backend.
- **Arsitektur 3 Lapis per Fitur:** Penataan modul fitur ke `lib/features/<nama>/` (`data/`, `domain/`, `presentation/`) sesuai panduan di `mobile/AGENTS.md`.

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
├── data/
│   └── mock/
│       └── home_mock_data.dart       # Data placeholder berlabel "DATA SIMULASI"
├── models/
│   ├── category.dart                 # Model kategori e-book
│   └── ebook.dart                    # Model e-book, bundel, dan breakdown SAW
├── providers/
│   └── home_provider.dart            # StateNotifierProvider untuk layar Beranda
├── screens/
│   └── home/
│       └── home_screen.dart          # Layar utama Beranda Mobile (Neubrutalism)
├── theme/
│   ├── app_colors.dart               # Token warna Neubrutalism (NbPalette)
│   └── app_theme.dart                # Tema Material & helper AppTheme.brutalBox
└── widgets/
    ├── common/
    │   └── iphone_preview_frame.dart # Frame pratinjau iPhone
    └── home/                         # Komponen modular Beranda (header, banner, kartu, dll.)
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
