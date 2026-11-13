# Aturan Konvensi Kode

1. **Stack Terkunci**
   - Backend: Node.js + Express + TypeScript + Zod + Prisma 7 (ESM, `"type": "module"`).
   - Admin Web: React + TypeScript + Vite.
   - Mobile: Flutter + Dart + Riverpod + Dio (`ebook_store`).
   - Dilarang mengganti stack tanpa persetujuan pengguna.

2. **Konvensi Backend (ESM & Modular)**
   - Setiap import relatif di file `.ts` wajib menggunakan ekstensi `.js`.
   - Setiap modul bisnis di `backend/src/modules/<nama>/` mengikuti pola:
     `*.routes.ts`, `*.controller.ts`, `*.service.ts`, `*.repository.ts`, `*.schema.ts`, `*.types.ts`.
   - Semua input HTTP divalidasi dengan Zod sebelum masuk ke service.
   - Prisma 7 dikonfigurasi melalui `prisma.config.ts`.

3. **Konvensi UI & Data**
   - Admin Web memakai desain neo-brutalism dengan 3 zona intensitas (lebih tenang di layar padat data).
   - Semua data placeholder/contoh wajib diberi label `"DATA SIMULASI"`.
   - Tidak ada tombol tanpa aksi atau endpoint palsu.
