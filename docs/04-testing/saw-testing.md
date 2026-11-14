# Pengujian Modul SPK SAW (`SAW Testing`)

> **Status Dokumen:** `[ADA]` (Dokumentasi spesifikasi pengujian SAW)
> **Status Implementasi & Eksekusi:** `[RENCANA]` — **0 tes SAW dieksekusi.** Seluruh fungsi perhitungan SAW dan unit/integration test belum diimplementasikan di `backend/`.
> **Sumber Utama:** [`saw-test-specification.md`](../03-saw/saw-test-specification.md), [`saw-edge-cases.md`](../03-saw/saw-edge-cases.md), [`perhitungan-manual.md`](../03-saw/perhitungan-manual.md), [`requirements.md`](../00-project/requirements.md) (`FR-S01`–`FR-S06`)

---

## 1. Tujuan, Lingkup & Ketentuan Teknis Pengujian SAW

- **Tujuan:** Memastikan fungsi SAW di backend (`SawService`) bersifat murni (*pure function*), deterministik, bebas `NaN`/`Infinity`, menolak bobot tidak valid, dan menghasilkan skor serta ranking yang identik dengan [`perhitungan-manual.md`](../03-saw/perhitungan-manual.md).
- **Lingkup Unit Test:** Fungsi murni normalisasi *Benefit*/*Cost*, validasi bobot, kalkulasi $V_i$, *tie-breaker*, dan *edge case* tanpa HTTP/database.
- **Lingkup Integration Test:** Endpoint `GET /api/v1/recommendations/saw` dan `PUT /api/v1/admin/saw/weights` bersama middleware auth (`401`/`403`), validasi Zod, dan query Prisma/mock.
- **Ketentuan Teknis:**
  - Dataset uji: `"DATA SIMULASI"` (`w = [0.40, 0.35, 0.25]`, ranking `A3 -> A1 -> A2`).
  - Toleransi *floating-point*: `toBeCloseTo(expected, 6)` ($10^{-6}$).
  - *Tie-breaker*: Judul alfabetis menaik (`A–Z`).
  - Penolakan bobot mentah klien publik dan larangan kalkulasi SAW di klien (`ADR-0002`).

---

## 2. Matriks 16 Kasus Uji SAW (`TC-SAW-01` – `TC-SAW-16` — `[RENCANA]`)

| Test ID | Skenario | Input | Expected Output | Jenis Test | Requirement | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-SAW-01** | Hasil sama dengan perhitungan manual (`DATA SIMULASI`) | 3 alternatif `A1, A2, A3`; bobot `0.40, 0.35, 0.25` | Ranking `A3 (1.0)`, `A1 (0.848125)`, `A2 (0.638333...)` | Unit Test | `FR-C06`, `FR-S01`, `FR-S06` | `[RENCANA]` |
| **TC-SAW-02** | Konfigurasi bobot valid (`Σ = 1.0`) | `[0.40, 0.35, 0.25]` | Validasi lolos (`true`) | Unit Test | `FR-S02`, `FR-A10` | `[RENCANA]` |
| **TC-SAW-03** | Bobot tidak berjumlah `1.0` | `[0.50, 0.30, 0.10]` (`Σ = 0.90`) | Error `SAW_CONFIGURATION_INVALID` | Unit / Integration | `FR-S02`, `FR-A10` | `[RENCANA]` |
| **TC-SAW-04** | Bobot bernilai negatif | `[0.60, 0.50, -0.10]` | Error validasi (`400`) | Unit / Integration | `FR-S02`, `FR-A10` | `[RENCANA]` |
| **TC-SAW-05** | Normalisasi kriteria *Benefit* | `ratingAvg`: `[4.5, 4.0, 4.8]` ($\max=4.8$) | `[0.9375, 0.833333..., 1.0]` | Unit Test | `FR-S03` | `[RENCANA]` |
| **TC-SAW-06** | Normalisasi kriteria *Cost* | `price`: `[50000, 75000, 40000]` ($\min=40000$) | `[0.8, 0.533333..., 1.0]` | Unit Test | `FR-S03` | `[RENCANA]` |
| **TC-SAW-07** | Semua kandidat bernilai `0` pada satu kriteria | `salesCount`: `[0, 0, 0]` | $r_{ij} = 0$ semua, bebas `NaN` / `Infinity` | Unit Test | `FR-S03` | `[RENCANA]` |
| **TC-SAW-08** | Data kandidat e-book kosong | `[]` | `recommendations: []` (`200 OK`) | Unit / Integration | `FR-S01`, `FR-S03` | `[RENCANA]` |
| **TC-SAW-09** | *Tie-breaker* deterministik | 2 e-book skor identik (`0.825`), judul `"Zebra"` & `"Alfa"` | `"Alfa"` peringkat `1`, `"Zebra"` peringkat `2` | Unit Test | `FR-S04` | `[RENCANA]` |
| **TC-SAW-10** | Hanya satu kandidat e-book | `1` alternatif valid | Peringkat `1` dengan skor valid (`1.0`) | Unit Test | `FR-S03` | `[RENCANA]` |
| **TC-SAW-11** | Kriteria tidak valid / kosong / tanpa sumber data | Kriteria `[]` atau field tak dikenal | Error `SAW_CONFIGURATION_INVALID` | Unit Test | `FR-S02` | `[RENCANA]` |
| **TC-SAW-12** | E-book tanpa rating (`ratingAvg = 0`) | 2 kandidat (`0` dan `4.5`) | Tidak error, `r = 0` (menunggu Keputusan #7) | Unit Test | `FR-S03` | `[RENCANA]` |
| **TC-SAW-13** | Pencegahan `NaN` dan `Infinity` | Variasi angka `0`, `null` opsional, angka kecil | `Number.isFinite(score) === true` | Unit Test | `FR-S03`, `NFR-07` | `[RENCANA]` |
| **TC-SAW-14** | Tolak/abaikan bobot mentah dari request publik | `GET /api/v1/recommendations/saw?weights=...` | Backend memakai bobot server | Integration Test | `FR-S01`, `FR-S02` | `[RENCANA]` |
| **TC-SAW-15** | Konsistensi urutan rekomendasi berulang | Panggil fungsi SAW 5x pada dataset identik | Output & urutan identik 100% | Unit Test | `FR-S04` | `[RENCANA]` |
| **TC-SAW-16** | Otorisasi ubah bobot oleh non-Admin | `PUT /api/v1/admin/saw/weights` (`CUSTOMER`) | `403 Forbidden` | Integration Test | `FR-A10`, `NFR-01` | `[RENCANA]` |

---

## 3. Matriks 20 *Edge Case* SAW (`EC-01` – `EC-20` — `[RENCANA]`)

| ID | Kondisi | Dampak | Penanganan yang Diharapkan | Error/Respons | Test Case | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **EC-01** | Katalog aktif kosong | Tidak ada alternatif | Kembalikan `recommendations: []` | `200 OK` | `TC-SAW-08` | `[RENCANA]` |
| **EC-02** | Hanya 1 kandidat | $\max = \min = x_{1j}$ | Normalisasi `1.0` (jika `> 0`) | `200 OK` | `TC-SAW-10` | `[RENCANA]` |
| **EC-03** | Semua nilai *Benefit* `0` | $\max = 0$ berisiko `NaN` | Tetapkan $r_{ij} = 0$ | `200 OK` | `TC-SAW-07` | `[RENCANA]` |
| **EC-04** | Satu kandidat *Benefit* `0` | Pembilang `0` | $r_{ij} = 0$ (jika $\max > 0$) | `200 OK` | `TC-SAW-05` | `[RENCANA]` |
| **EC-05** | Nilai *Cost* `0` | Pembagi $x_{ij} = 0$ berisiko `Infinity` | Guard bebas `Infinity` (`[RENCANA]` kebijakan final) | `200 OK` / `500` | `TC-SAW-13` | `[RENCANA]` |
| **EC-06** | Semua nilai *Cost* sama | $\min / x_{ij} = 1.0$ | Semua $r_{ij} = 1.0$ | `200 OK` | `TC-SAW-06` | `[RENCANA]` |
| **EC-07** | Nilai opsional `null`/`undefined` | Risiko `NaN` | Konversi aman sesuai kebijakan #9 | Bebas `NaN` | `TC-SAW-11` | `[RENCANA]` |
| **EC-08** | Nilai input negatif | Merusak rasio SAW | Tolak data negatif & log error | `500` | `TC-SAW-13` | `[RENCANA]` |
| **EC-09** | E-book `isActive = false` | E-book arsip ikut terhitung | Filter `isActive: true` di query DB | Tidak tampil | `TC-SAW-01` | `[RENCANA]` |
| **EC-10** | E-book tanpa rating (`0`) | Pergeseran peringkat | Tangani aman (`0`) + label `"Belum ada rating"` | `200 OK` (#7) | `TC-SAW-12` | `[RENCANA]` |
| **EC-11** | `salesCount = 0` | Pembilang `0` | $r_{ij} = 0$ | `200 OK` | `TC-SAW-07` | `[RENCANA]` |
| **EC-12** | Total bobot `!= 1.0` | Skor keluar `[0, 1]` | Tolak `SAW_CONFIGURATION_INVALID` | `400` / `500` | `TC-SAW-03` | `[RENCANA]` |
| **EC-13** | Bobot negatif | Arah preferensi terbalik | Tolak oleh Zod & validator | `400` | `TC-SAW-04` | `[RENCANA]` |
| **EC-14** | Daftar bobot kosong | Tidak ada kriteria | Hentikan kalkulasi | `500` | `TC-SAW-11` | `[RENCANA]` |
| **EC-15** | ID kriteria tidak ditemukan | Mapping field gagal | Tolak konfigurasi invalid | `400` / `500` | `TC-SAW-11` | `[RENCANA]` |
| **EC-16** | Kriteria tanpa sumber DB | Atribut `undefined` | Whitelist field `Ebook` | `500` | `TC-SAW-11` | `[RENCANA]` |
| **EC-17** | Skor preferensi identik | Urutan berpotensi acak | *Tie-breaker* judul A–Z | `200 OK` | `TC-SAW-09` | `[RENCANA]` |
| **EC-18** | Katalog berubah saat hitung | Data tidak konsisten | Satu query read konsisten per eksekusi | `200 OK` | `TC-SAW-15` | `[RENCANA]` |
| **EC-19** | Kegagalan query DB | Gagal ambil kandidat | Tangkap di `error.middleware.ts` | `500` | — | `[RENCANA]` |
| **EC-20** | Gagal simpan snapshot SAW | Audit tidak tercatat | Kebijakan menunggu Keputusan #11 | `[RENCANA]` | — | `[RENCANA]` |

---

## 4. Expected Output JSON (`DATA SIMULASI`) & Keputusan Terbuka

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

**Ketergantungan Keputusan Terbuka (`[RENCANA]`):** Keputusan **#5** (hak ubah bobot), **#7** (`ratingAvg = 0`), **#9** (4 vs 5 kriteria), dan **#11** (snapshot historis) pada [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md).
