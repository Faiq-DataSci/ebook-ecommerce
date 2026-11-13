# Panduan Penanganan Masalah (`Troubleshooting`)

**Status:** `[ADA]` (aturan teknis lingkungan dari `AGENTS.md`) | `[RENCANA]` (panduan operasional)

---

## 1. Masalah Pengembangan yang Diketahui dari Konvensi Proyek

| Gejala / Masalah | Penyebab Umum | Solusi |
|---|---|---|
| **Error import module ESM di `backend/`** | File `.ts` mengimpor modul relatif tanpa ekstensi `.js` saat `"type": "module"` aktif | Pastikan seluruh import relatif di `backend/src/**/*.ts` memakai ekstensi `.js` (`[ADA]` pada `AGENTS.md`). |
| **Versi Prisma tidak sesuai saat instalasi** | Tag `latest` pada npm kadang mengarah ke versi RC | Jalankan `npm view prisma dist-tags` terlebih dahulu sebelum menginstal Prisma 7 (`[ADA]` pada `AGENTS.md`). |
| **Koneksi migrasi Prisma menggantung / gagal di Supabase** | Menggunakan transaction pooler port `6543` untuk perintah CLI/migrasi | Gunakan `DIRECT_URL` (port `5432`) untuk migrasi/CLI dan `DATABASE_URL` (port `6543`) untuk runtime (`[RENCANA]`). |
| **Emulator Android gagal menghubungi backend lokal** | Menggunakan `localhost` / `127.0.0.1` di kode Flutter | Gunakan `10.0.2.2` untuk emulator Android, dan IP LAN untuk perangkat fisik (`[ADA]` pada `mobile/AGENTS.md`). |
| **Gagal membuka PDF dari *signed URL*** | *Signed URL* kedaluwarsa atau belum ada record di `ebook_accesses` | Minta ulang *signed URL* melalui endpoint akses setelah memastikan status pesanan `PAID` (`[RENCANA]`). |
