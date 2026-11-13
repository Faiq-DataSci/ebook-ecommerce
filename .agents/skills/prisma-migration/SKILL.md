---
name: prisma-migration
description: Gunakan saat membuat atau mengubah schema.prisma, konfigurasi Prisma 7, dan menjalankan migrasi database PostgreSQL Supabase.
---

# Skill: Prisma 7 & Migrasi Database

## Aturan Prisma 7
1. Sebelum instalasi pertama kali, jalankan `npm view prisma dist-tags` untuk memastikan tidak memasang versi RC yang bertag `latest`.
2. Konfigurasi koneksi dan migrasi menggunakan `backend/prisma.config.ts` (bukan pola lama).
3. Gunakan `DIRECT_URL` (session pooler port 5432) untuk CLI/migrasi, dan `DATABASE_URL` (transaction pooler port 6543) untuk runtime.

## Konvensi Skema Data
- Gunakan tipe `Decimal` (bukan `Float`) untuk nilai uang/harga dan skor/bobot SAW.
- Gunakan `UUID` sebagai primary key entitas utama.
- Definisikan `@@unique` / `@unique` dan `@@index` pada kolom pencarian atau foreign key yang sering di-query.
- Simpan **snapshot harga** (dan metadata transaksi relevan) pada `order_items` agar perubahan harga e-book di katalog tidak mengubah riwayat pesanan.
- Hindari *hard delete* pada data historis (gunakan soft delete atau status nonaktif).

## Larangan & Verifikasi
- Migrasi yang bersifat destruktif (drop tabel/kolom, reset data, `migrate reset`, `db push --force-reset`) **dilarang tanpa persetujuan eksplisit pengguna**.
- Setiap perubahan skema wajib diverifikasi dengan menjalankan `npx prisma validate` dan melaporkan output aktualnya.
