# Kontrak Backend SPK SAW (`SawService` & API Contract)

> **Status Dokumen:** `[ADA]` (Dokumentasi kontrak rancangan) | **Implementasi Endpoint & Service:** `[RENCANA]`
> **Referensi API Kanonik:** [`api-spec.yaml`](../02-api/api-spec.yaml) & [`api-overview.md`](../02-api/api-overview.md)

---

## 1. Input yang Boleh Diterima vs Ditolak

| Jenis Input | Sumber | Status Kepercayaan | Penanganan Backend |
| :--- | :--- | :--- | :--- |
| **Filter kandidat** (`categoryId?`, `limit?`) | Query param publik (`GET /api/v1/recommendations/saw`) | Boleh diterima setelah validasi Zod | Memfilter kandidat `Ebook` aktif (`isActive = true`) dan membatasi jumlah hasil |
| **Bobot mentah / skor dari klien publik** | Request body/query klien (`mobile`, `pengunjung-web`) | **TIDAK DIPERCAYA** | Ditolak oleh Zod (strict schema) atau diabaikan sepenuhnya; backend hanya memakai bobot server |
| **Pembaruan bobot resmi** | Request Admin (`PUT /api/v1/admin/saw/weights`) | Dipercaya hanya jika `ADMIN` + lolos validasi | Wajib melalui `authenticate` + `authorize('ADMIN')` + validasi $\sum w_j = 1.0$ & $w_j \ge 0$ |

> **Catatan Keputusan #5:** Apabila di kemudian hari Pelanggan diizinkan mengirim *preset*/preferensi bobot, hal tersebut wajib tetap diproses dan divalidasi di backend (`[RENCANA]`).

---

## 2. Sumber Data & Validasi Konfigurasi

1. **Sumber Data Kandidat:** Query Prisma terhadap model `Ebook` dengan syarat `isActive = true` (serta `categoryId` jika filter kategori diberikan).
2. **Sumber Konfigurasi Kriteria & Bobot:** Diambil dari konfigurasi backend/database (`SawCriterionConfig` `[RENCANA]`).
3. **Validasi Konfigurasi Sebelum Eksekusi:**
   - Minimal 1 kriteria aktif.
   - Seluruh tipe kriteria valid (`BENEFIT` atau `COST`).
   - Seluruh bobot memenuhi $w_j \ge 0$ (tidak negatif) dan $|\sum w_j - 1.0| \le 10^{-6}$.
   - Jika gagal, hentikan kalkulasi dan kembalikan error `SAW_CONFIGURATION_INVALID` ([`error-catalog.md`](../02-api/error-catalog.md)).

---

## 3. Informasi yang Dikirim ke Klien vs Internal Backend

- **Dikirim ke Klien (Publik / Pelanggan):**
  - Peringkat (`rank`), identitas e-book (`ebookId`, `title`, `author`, `price`, `coverUrl`, `ratingAvg`), skor akhir (`sawScore`), serta rincian transparansi perhitungan per kriteria bila diperlukan UI (`design.md` bagian 11).
  - Penanda `isSimulation` jika data berasal dari simulasi.
- **Internal Backend (Tidak Dikirim ke Klien Publik):**
  - Path file privat PDF (`storagePath`), query mentah database, log error internal, atau detail kredensial konfigurasi server.

---

## 4. Kontrak Endpoint Terkait SAW (`[RENCANA]`)

| Endpoint Kanonik (`api-spec.yaml`) | Method | Akses | Tujuan | Status |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/recommendations/saw` | `GET` | Publik / `CUSTOMER` *(Keputusan #5)* | Menjalankan perhitungan SAW di backend dan mengembalikan peringkat e-book | `[RENCANA]` |
| `/api/v1/admin/saw/weights` | `GET` | `ADMIN` | Melihat konfigurasi bobot kriteria SAW aktif | `[RENCANA]` |
| `/api/v1/admin/saw/weights` | `PUT` | `ADMIN` | Memperbarui bobot kriteria SAW (`Σ w_j = 1.0`) | `[RENCANA]` |

> **Catatan Sinkronisasi Dokumen Lama:** [api-endpoints.md](../05-api/api-endpoints.md) sebelumnya mencantumkan path `/api/v1/ebooks/recommendations`. Acuan path terbaru dan kanonik yang digunakan proyek adalah `/api/v1/recommendations/saw` pada [api-spec.yaml](../02-api/api-spec.yaml).

---

## 5. Contoh Bentuk Response Simulasi (`DATA SIMULASI` — `[RENCANA]`)

```json
{
  "success": true,
  "data": {
    "criteriaVersion": "DATA SIMULASI",
    "recommendations": [
      {
        "rank": 1,
        "ebookId": "DATA SIMULASI",
        "title": "DATA SIMULASI",
        "score": 0.875
      }
    ]
  }
}
```

*(Penamaan field akhir seperti `score` vs `sawScore` dan struktur detail `breakdown` akan disinkronkan penuh dengan `api-spec.yaml` saat endpoint diimplementasikan.)*

---

## 6. Kontrak Admin Bobot & Snapshot Hasil (`[RENCANA]`)

- **Perubahan Bobot Admin (`PUT /api/v1/admin/saw/weights`):** Hanya tersedia untuk role `ADMIN`, memvalidasi daftar bobot secara atomik sebelum menyimpan versi konfigurasi baru.
- **Snapshot & Audit Hasil (`[RENCANA]` — Keputusan #11):** Apabila fitur penyimpanan snapshot (`SawCalculationSnapshot`) disetujui, backend menyimpan snapshot bobot, matriks keputusan, skor, dan timestamp setiap eksekusi agar audit Admin tidak berubah oleh perubahan harga/rating di masa depan.
