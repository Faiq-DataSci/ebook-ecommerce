# Aturan Keamanan

> Catatan: Aturan teks ini hanya panduan kerja agen, bukan penjaga teknis. Pengaturan kebijakan terminal tetap diatur di pengaturan aplikasi.

1. **Perlindungan Rahasia & `.env`**
   - Dilarang membaca, menyalin, atau menampilkan isi file `.env` (kecuali `.env.example`).
   - Dilarang melakukan commit file `.env`, key signing (`*.keystore`, `*.jks`), atau kredensial apa pun ke repositori Git.
   - Dilarang menaruh secret atau `SUPABASE_SERVICE_ROLE_KEY` di variabel `VITE_*` (`admin-web`) maupun di kode klien (`mobile`).

2. **Perintah Berbahaya yang Dilarang Tanpa Persetujuan Eksplisit Pengguna**
   - `git push --force` (atau `-f`)
   - `npx prisma migrate reset`
   - `npx prisma db push --force-reset`
   - Perintah penghapusan massal (`Remove-Item -Recurse -Force`, `rm -rf`, `del /s /q`, `git clean -fd`, dll.)

3. **Keamanan Aplikasi**
   - Validasi autentikasi (`authenticate`) dan otorisasi peran (`authorize`) wajib dilakukan di backend.
   - Akses file PDF di Supabase Storage bucket privat hanya melalui signed URL yang diterbitkan backend setelah verifikasi kepemilikan.
