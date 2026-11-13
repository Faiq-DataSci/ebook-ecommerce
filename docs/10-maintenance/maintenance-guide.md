# Panduan Pemeliharaan (`Maintenance Guide`)

**Status:** `[PROPOSED]` — Rencana prosedur pemeliharaan rutin setelah sistem memasuki fase pengembangan aktif dan produksi.

---

## 1. Pemeliharaan Rutin (`[PROPOSED]`)

1. **Audit Keamanan & Dependensi:**
   - Jalankan `npm audit` (pada `backend/`, `web/admin-web/`, `web/pengunjung-web/`) dan `flutter pub outdated` secara berkala.
   - Aktifkan Dependabot alerts & Secret scanning pada repository GitHub.
2. **Rotasi Kredensial:**
   - Lakukan rotasi berkala untuk `JWT_SECRET` dan `SUPABASE_SERVICE_ROLE_KEY`, serta segera cabut kredensial apabila dicurigai bocor.
3. **Pemeliharaan Database & Pesanan Kedaluwarsa:**
   - Jalankan pembersihan/pembaruan status otomatis (*scheduled job*) untuk mengubah pesanan `PENDING` yang melewati `expires_at` menjadi `EXPIRED`.
   - Pastikan *backup* otomatis PostgreSQL Supabase aktif sebelum menjalankan migrasi skema baru.
4. **Sinkronisasi Dokumentasi:**
   - Setiap perubahan skema Prisma, endpoint API, atau keputusan arsitektur wajib memperbarui dokumen terkait di `docs/` dan mengubah label status dari `[PROPOSED]`/`[RENCANA]` menjadi `[IMPLEMENTED]`/`[ADA]` setelah teruji.
