---
name: flutter-feature
description: Gunakan saat membuat atau mengubah fitur pada aplikasi mobile Flutter (ebook_store) dengan Riverpod dan Dio.
---

# Skill: Fitur Mobile Flutter (`ebook_store`)

## Struktur Direktori Fitur
Setiap fitur di `mobile/lib/features/<nama>/` dibagi menjadi 3 lapisan:
- `data/` — Remote datasource (memakai Dio), DTO/model JSON, dan implementasi repository.
- `domain/` — Entity murni, kontrak repository, dan usecase (bila diperlukan).
- `presentation/` — Riverpod providers/notifiers, halaman (`screen`), dan widget khusus fitur.

## Aturan Teknis
- Gunakan **Riverpod** untuk state management dan injeksi dependensi.
- Gunakan instance **Dio** terpusat dari `mobile/lib/core/network/` dengan interceptor token dan error mapping yang konsisten.
- Konfigurasi `baseUrl` di `mobile/lib/core/config/` harus membedakan alamat emulator Android (`http://10.0.2.2:<port>`) dan perangkat fisik.
- Setiap layar yang memuat data asinkron wajib menangani 3 kondisi UI: `loading`, `empty`, dan `error` (disertai aksi coba lagi).
- Data placeholder sebelum terhubung ke API wajib berlabel `"DATA SIMULASI"`.
