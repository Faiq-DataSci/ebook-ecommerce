# Pedoman Keamanan Pengembangan (`Security Guidelines`)

**Status:** `[CONFIRMED]` (aturan proyek pada `AGENTS.md` & `.agents/rules/keamanan.md`) | `[PROPOSED]` (praktik implementasi)

---

## 1. Perlindungan Kredensial dan Environment Variables

1. **Dilarang menaruh secret di repository:** Tidak boleh ada API key, password database, `JWT_SECRET`, atau `SUPABASE_SERVICE_ROLE_KEY` di dalam kode sumber, dokumen, atau commit Git (`[CONFIRMED]`).
2. **Pemisahan Environment Klien vs Server:**
   - Variabel `VITE_*` pada `web/admin-web` dan `web/pengunjung-web` bersifat **publik** setelah di-build. Dilarang keras menaruh secret atau *service role key* di `VITE_*` (`[CONFIRMED]`).
   - Aplikasi Flutter (`mobile/ebook_store`) tidak boleh menyimpan kunci privat atau mengakses database/storage privat secara langsung (`[CONFIRMED]`).
3. **Gunakan `.env.example`:** Setiap modul yang membutuhkan variabel lingkungan wajib menyediakan `.env.example` berisi nama variabel dan nilai placeholder non-rahasia (`[PROPOSED]`).

---

## 2. Keamanan API, Autentikasi, dan Otorisasi

1. **Validasi Input di Backend (`Zod`):** Semua `req.body`, `req.params`, dan `req.query` wajib divalidasi sebelum diproses (`[CONFIRMED]`).
2. **Otorisasi di Backend:** Seluruh endpoint admin wajib memeriksa token dan role `ADMIN` di server; menyembunyikan menu di frontend tidak dianggap sebagai kontrol keamanan (`[CONFIRMED]`).
3. **Pencegahan IDOR (*Insecure Direct Object Reference*):** Endpoint pelanggan (`orders`, `transactions`, `ebooks/:id/access`) wajib memverifikasi kepemilikan berdasarkan `id` pengguna dari token sesi, bukan dari parameter input klien (`[PROPOSED]`).
4. **SAW Backend-Only:** Perhitungan rekomendasi SAW hanya dijalankan di backend; bobot yang dikirim klien tidak boleh langsung dipercaya tanpa validasi/konfigurasi server (`[CONFIRMED]`).

---

## 3. Keamanan Transaksi dan Konten Digital (PDF)

1. **Bucket Privat untuk PDF:** File e-book tidak boleh disimpan di bucket publik atau disajikan melalui URL statis permanen (`[CONFIRMED]`).
2. **Signed URL Berjangka Pendek:** Backend hanya menerbitkan *signed URL* sementara setelah memastikan adanya record aktif pada `ebook_accesses` (`[CONFIRMED]` / `[PROPOSED]`).
3. **Integritas Harga & Pembayaran:** Total pesanan harus dihitung ulang dari harga database di server. Verifikasi pembayaran wajib memeriksa kecocokan nominal dan bersifat idempoten (`[PROPOSED]`).
4. **Non-Hard-Delete Data Terkait Transaksi:** E-book yang sudah pernah dibeli tidak boleh dihapus permanen agar riwayat pembelian dan hak akses pelanggan tidak rusak (`[PROPOSED]`).
