# Keamanan Modul SPK SAW (`SAW Module Security`)

**Status:** `[ADA]` (keputusan arsitektur `ADR-0002` backend-only) | `[RENCANA]` (implementasi service SAW & endpoint admin/publik)  
**Sumber:** [`ADR-0002`](../adr/0002-backend-only-saw.md), [`docs/03-saw/saw-backend-contract.md`](../03-saw/saw-backend-contract.md), [`docs/03-saw/saw-method.md`](../03-saw/saw-method.md).

---

## Prinsip Mutlak (`ADR-0002`)

Perhitungan *Simple Additive Weighting* (SAW) — pengambilan matriks keputusan dari database, normalisasi benefit/cost, perkalian bobot, pemeringkatan, dan *tie-breaker* — **wajib dijalankan 100% di backend**. Klien (`mobile/ebook_store`, `web/pengunjung-web`, `web/admin-web`) hanya menerima hasil akhir.

---

## 1. Input yang Boleh Diterima vs Ditolak

| Jenis Input | Sumber | Status Kepercayaan | Penanganan |
|---|---|---|---|
| **Filter kandidat (`categoryId`, `limit`)** | Klien publik / Pelanggan | Dipercaya setelah validasi Zod | Diterapkan sebagai filter `where` Prisma pada e-book aktif |
| **Bobot mentah dari klien publik** | Query/body `GET /recommendations/saw` | **TIDAK DIPERCAYA** | Ditolak atau diabaikan; backend selalu memakai bobot resmi server |
| **Pembaruan bobot (`PUT /admin/saw/weights`)** | `web/admin-web` (`ADMIN`) | Dipercaya jika JWT + `ADMIN` + lolos validasi | Wajib `w_j > 0` dan `Σ w_j = 1.0` (toleransi `1e-6`) |

---

## 2. Validasi Bobot & Penanganan Edge Case

- **Validasi Bobot:** Setiap bobot kriteria `w_j > 0` (tidak negatif, tidak nol) dan `|Σ w_j - 1.0| <= 1e-6`.
- **Error Konfigurasi:** Jika bobot tidak valid -> kembalikan `SAW_CONFIGURATION_INVALID` (`400` saat admin memperbarui bobot, `500` saat runtime konfigurasi rusak).
- **Guard Pembagi Nol & `NaN`/`Infinity`:** Normalisasi benefit/cost wajib menangani nilai maksimum/minimum `0` (mis. `ratingAvg = 0` untuk e-book baru) agar tidak menghasilkan `NaN` atau `Infinity`.

---

## 3. Anti-Tampering & Otorisasi

- Endpoint `GET /api/v1/recommendations/saw` tidak menerima parameter bobot dari klien publik.
- Endpoint `GET /api/v1/admin/saw/weights` dan `PUT /api/v1/admin/saw/weights` dilindungi oleh `authenticate` + `authorize('ADMIN')`. Pelanggan (`CUSTOMER`) yang mencoba mengakses ditolak dengan `403 FORBIDDEN`.

---

## 4. Proteksi Data Internal pada Respons SAW

- Respons rekomendasi SAW hanya mengembalikan metadata publik e-book (`id`, `title`, `author`, `price`, `coverUrl`, `ratingAvg`, `salesCount`), `rank`, dan skor `V_i`.
- **`storagePath`**, query SQL mentah, dan stack trace internal **tidak boleh** dikirim ke klien.

---

## 5. Ketergantungan Keputusan Terbuka Terkait SAW

- **#5:** Hak ubah bobot SAW (Admin vs bobot tetap) `[RENCANA]`.
- **#7:** Perlakuan e-book tanpa rating (`ratingAvg = 0`) `[RENCANA]`.
- **#9:** Jumlah kriteria SAW (4 vs 5 kriteria) `[RENCANA]`.
- **#11:** Penyimpanan snapshot historis SAW untuk audit trail `[RENCANA]`.
