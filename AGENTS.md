# AGENTS.md — Panduan Agen Proyek E-Book E-Commerce & SPK (SAW)

## Sumber Kebenaran & Status
- Sumber kebenaran utama: `docs/docs-proyek-ebook-ecommerce.md`.
- Setiap dokumen atau fitur wajib ditandai statusnya secara eksplisit: `[ADA]` atau `[RENCANA]`.

## Stack Terkunci (Dilarang Mengganti Tanpa Persetujuan)
- **Mobile:** Flutter + Dart + Riverpod + Dio (proyek `ebook_store`, Android)
- **Admin Web:** React + TypeScript + Vite (desain neo-brutalism, 3 zona intensitas)
- **Backend:** Node.js + Express + TypeScript + Zod + Prisma 7 (ESM, `"type": "module"`)
- **Database & Storage:** PostgreSQL Supabase; file PDF di Supabase Storage bucket **PRIVAT** (akses via signed URL)
- **SPK:** Metode Simple Additive Weighting (SAW), dihitung **HANYA di backend**
- **Shell:** Windows PowerShell

## Aturan Mutlak
1. Jangan klaim fitur selesai tanpa implementasi **DAN** pengujian yang benar-benar dijalankan.
2. Tidak ada endpoint palsu atau tombol tanpa aksi.
3. Data placeholder wajib berlabel `"DATA SIMULASI"`.
4. SAW hanya di backend; bobot dari klien tidak dipercaya.
5. Otorisasi di backend (token + role); menyembunyikan menu di UI hanya kosmetik.
6. Dilarang commit `.env` atau secret; dilarang menaruh secret di `VITE_*` atau kode Flutter.
7. Satu tahap per waktu; berhenti dan laporkan sebelum lanjut ke tahap berikutnya.
8. Jika tidak bisa memverifikasi sesuatu, katakan terus terang.

## Konvensi Teknis
- Backend menggunakan ESM: semua import relatif di file `.ts` wajib memakai ekstensi `.js`.
- Prisma 7 menggunakan `prisma.config.ts`. Sebelum menginstal Prisma, jalankan `npm view prisma dist-tags` untuk menghindari versi RC yang bertag `latest`.
- Selalu verifikasi output CLI langsung di mesin ini, jangan mengandalkan tutorial lama.

## Urutan Kerja & Perencanaan
- Urutan pengembangan: `backend` -> `admin-web` -> `mobile`.
- Uji konektivitas (health check / auth / endpoint dasar) sebelum membangun UI penuh.
- Untuk tugas besar, buat rencana (**Implementation Plan**) terlebih dahulu dan tunggu persetujuan pengguna sebelum eksekusi.

## Format Laporan Tiap Tugas
Setiap laporan penyelesaian tugas wajib memuat:
1. **File berubah**
2. **Tujuan**
3. **Perintah verifikasi**
4. **Hasil yang BENAR-BENAR dijalankan**
5. **Sisa pekerjaan**
