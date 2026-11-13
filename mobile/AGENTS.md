# AGENTS.md — Mobile (`mobile/`)

- Stack: Flutter + Dart + Riverpod + Dio (proyek `ebook_store`, target Android).
- Struktur tiap fitur di `lib/features/<nama>/` mengikuti arsitektur 3 lapis:
  `data/` (datasource, model/DTO, repository impl), `domain/` (entity, repository interface, usecase), `presentation/` (provider, screen, widget).
- State management wajib memakai **Riverpod**; komunikasi HTTP wajib melalui **Dio** client terpusat di `lib/core/network/`.
- Konfigurasi `baseUrl` harus membedakan lingkungan **emulator Android** (`10.0.2.2`) dan **perangkat fisik** (IP LAN / domain).
- Setiap layar yang mengambil data wajib menangani 3 state utama: `loading`, `empty`, dan `error` dengan tombol coba lagi.
- Dilarang menyimpan secret atau key privat (seperti Supabase service role key) di kode Flutter.
- Perhitungan SAW dan validasi otorisasi tetap dilakukan di backend; aplikasi mobile hanya menampilkan hasil dari API.
- File PDF dari Supabase Storage bucket privat hanya diakses melalui signed URL yang diberikan backend.
- Data simulasi sebelum API siap wajib diberi label `"DATA SIMULASI"`.
