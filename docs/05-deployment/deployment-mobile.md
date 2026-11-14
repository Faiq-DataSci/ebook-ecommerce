# Panduan Build & Distribusi Mobile (`Flutter Android — ebook_store`)

**Status:** `[RENCANA]` (proyek template Flutter & `pubspec.yaml` `[ADA]`; fitur, signing release, dan distribusi `[RENCANA]`)  
**Target Kode:** `mobile/ebook_store/`  
**Referensi Utama:** [`mobile/AGENTS.md`](../../mobile/AGENTS.md), [`mobile/ebook_store/pubspec.yaml`](../../mobile/ebook_store/pubspec.yaml).

---

## 1. Status Konfigurasi Proyek Saat Ini (`[ADA]` vs `[RENCANA]`)

- **Yang Sudah `[ADA]`:**
  - Proyek Flutter `ebook_store` pada `mobile/ebook_store/` dengan Dart SDK `^3.12.0`.
  - Dependensi inti di `pubspec.yaml`: `flutter_riverpod ^2.6.1`, `dio ^5.8.0+1`, `flutter_secure_storage ^9.2.4`, `cupertino_icons ^1.0.8`.
  - Entry point awal `lib/main.dart` (masih template dasar Flutter).
- **Yang Masih `[RENCANA]`:**
  - Implementasi arsitektur fitur (`data/`, `domain/`, `presentation/`), Dio client terpusat (`lib/core/network/`), dan konfigurasi `baseUrl` per lingkungan.
  - Pemilihan package PDF viewer untuk membaca e-book dari signed URL.
  - Keputusan #8 pada [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md): Nama resmi aplikasi (`applicationId` / label launcher) dan logo.
  - Konfigurasi signing release Android (`key.properties` dan keystore produksi).

---

## 2. Konfigurasi `baseUrl` Lintas Lingkungan (`mobile/AGENTS.md`)

Sesuai aturan di [`mobile/AGENTS.md`](../../mobile/AGENTS.md), aplikasi mobile wajib membedakan target endpoint backend melalui konfigurasi terpusat (misalnya `--dart-define=API_BASE_URL=...` `[RENCANA]`):

| Lingkungan Target | Contoh `baseUrl` | Keterangan |
|---|---|---|
| **Emulator Android (Lokal)** | `http://10.0.2.2:3000/api/v1` | `10.0.2.2` merujuk ke `localhost` host Windows dari dalam emulator Android (`[ADA]` aturan di `mobile/AGENTS.md`) |
| **Perangkat Fisik (LAN Lokal)** | `http://<IP-LAN-HOST>:3000/api/v1` | Perangkat dan laptop harus berada pada jaringan LAN yang sama; port `3000` dibuka di firewall lokal |
| **Staging / Production** | `https://<domain-backend>/api/v1` | Wajib menggunakan **HTTPS** (`[RENCANA]`) |

> **Larangan Keras:** Jangan pernah menyematkan `SUPABASE_SERVICE_ROLE_KEY`, secret payment gateway, atau kredensial privat di kode Dart/Flutter maupun `--dart-define`.

---

## 3. Keamanan Penyimpanan & Konten Digital di Mobile

1. **Penyimpanan Token Sesi:** Menggunakan `flutter_secure_storage` (`[ADA]` di `pubspec.yaml`) untuk menyimpan access/refresh token secara terenkripsi di perangkat (`[RENCANA]` implementasi).
2. **Akses E-Book PDF:** File PDF dari Supabase Storage bucket privat hanya diakses melalui **signed URL berjangka pendek** yang diterbitkan backend setelah verifikasi record `ebook_accesses` (`[RENCANA]`).
3. **Perhitungan SAW:** Dilakukan 100% di backend; aplikasi Flutter hanya mengirimkan parameter/preferensi yang diizinkan dan menampilkan hasil peringkat dari API.

---

## 4. Alur Build & Signing Android Target (`[RENCANA]`)

1. **Verifikasi Statis & Unit Test:**
   - `flutter pub get`
   - `flutter analyze`
   - `flutter test`
2. **Konfigurasi Signing Release (`[RENCANA]`):**
   - Buat keystore produksi (`.jks` / `.keystore`) **di luar repository Git**.
   - Simpan referensi path dan kredensial signing pada `android/key.properties` yang **wajib diabaikan Git** (`.gitignore`).
   - Pastikan `applicationId`, `versionCode`, dan `versionName` sesuai dengan Keputusan #8.
3. **Build Artefak Distribusi (`[RENCANA]`):**
   - **APK (pengujian perangkat / distribusi internal):**
     `flutter build apk --release --dart-define=API_BASE_URL=https://<domain-backend>/api/v1`
   - **Android App Bundle / AAB (distribusi Play Store):**
     `flutter build appbundle --release --dart-define=API_BASE_URL=https://<domain-backend>/api/v1`
4. **Uji Asap Pasca-Build (`[RENCANA]`):**
   - Pasang APK release pada perangkat fisik Android, verifikasi koneksi HTTPS ke `/api/v1/health`, alur login, katalog, SPK SAW, checkout, dan pembacaan PDF via signed URL.
