# Kontrak API SPK SAW (`API SAW Contract`)

> **Status Dokumen:** `[ADA]` (Rancangan kontrak API SAW) | **Implementasi Endpoint & Engine:** `[RENCANA]`
> **Sumber Utama:** [`ADR-0002`](../adr/0002-backend-only-saw.md), [`saw-backend-contract.md`](../03-saw/saw-backend-contract.md), [`perhitungan-manual.md`](../03-saw/perhitungan-manual.md), [`requirements.md`](../00-project/requirements.md) (`FR-S01`–`FR-S06`)

---

## 1. Prinsip Mutlak Backend-Only SAW

1. Perhitungan SAW **hanya** dijalankan di backend (`ADR-0002`).
2. Klien (`mobile`, `admin-web`, `pengunjung-web`) hanya menerima hasil akhir (peringkat dan skor) dan dilarang menghitung skor sendiri.
3. Bobot mentah yang dikirim dari klien publik ditolak/diabaikan oleh backend.

---

## 2. Kontrak Endpoint Rekomendasi & Admin Bobot (`[RENCANA]`)

### 2.1 `GET /api/v1/recommendations/saw`
- **Authentication:** Opsional / Wajib `[RENCANA]` (menunggu Keputusan #5).
- **Authorization:** Publik / `CUSTOMER`.
- **Query Parameters:** `categoryId` (UUID, opsional), `limit` (integer `1–100`, default `20`).
- **Request Body:** Tidak ada (bobot diambil dari konfigurasi server).
- **Response (`DATA SIMULASI`):**
```json
{
  "success": true,
  "data": {
    "isSimulation": true,
    "criteriaVersion": "DATA SIMULASI",
    "recommendations": [
      { "rank": 1, "ebookId": "ebook-sim-003", "title": "DATA SIMULASI - Panduan Praktis Flutter", "sawScore": 1.0, "displayScore": "1.000" },
      { "rank": 2, "ebookId": "ebook-sim-001", "title": "DATA SIMULASI - Arsitektur Backend Modern", "sawScore": 0.848125, "displayScore": "0.848" },
      { "rank": 3, "ebookId": "ebook-sim-002", "title": "DATA SIMULASI - Dasar Basis Data Relasional", "sawScore": 0.6383333333333333, "displayScore": "0.638" }
    ]
  }
}
```

### 2.2 `GET /api/v1/admin/saw/weights` & `PUT /api/v1/admin/saw/weights`
- **Authorization:** `ADMIN` saja (`403 Forbidden` bagi non-Admin).
- **Validasi `PUT`:** Setiap bobot `> 0` (kebijakan bobot nol masih `[RENCANA]`), total bobot `= 1.0` (toleransi `1e-6`). Jika gagal → `400 SAW_CONFIGURATION_INVALID`.

---

## 3. Aturan Teknis & Ketergantungan Keputusan Terbuka

- **Dataset Simulasi:** 3 kriteria (`C1` Harga Cost `0.40`, `C2` Rating Benefit `0.35`, `C3` Terjual Benefit `0.25`), 3 alternatif `A1, A2, A3`, ranking `A3 (1.0) -> A1 (0.848125) -> A2 (0.638333...)`.
- **Rumus & Guard:**
  - Benefit: $r_{ij} = x_{ij} / \max(x_{ij})$; Cost: $r_{ij} = \min(x_{ij}) / x_{ij}$; $V_i = \sum (w_j \times r_{ij})$ dengan presisi penuh.
  - *Tie-breaker:* Judul alfabetis **A–Z**.
  - Bebas `NaN` dan `Infinity`; e-book `isActive = false` dikecualikan dari kandidat.
- **Ketergantungan Keputusan Terbuka (`[RENCANA]`):** Keputusan **#5** (hak ubah bobot), **#7** (`ratingAvg = 0`), **#9** (4 vs 5 kriteria), dan **#11** (endpoint audit snapshot `GET /admin/saw/audit`).
