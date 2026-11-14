# Spesifikasi Pengujian Metode SAW (`Backend Test Specification`)

> **Status Dokumen:** `[ADA]` (Dokumentasi spesifikasi pengujian)
> **Status Pengujian Aktual:** `[RENCANA]` — Berdasarkan [`test-results.md`](../09-testing/test-results.md), backend saat ini baru memiliki 5 pengujian dasar Vitest (`/health`, `validate`, `response`, `401` pada `/admin/ping`). **Belum ada unit test maupun integration test SAW yang diimplementasikan atau dijalankan.**

---

## 1. Tujuan & Lingkup Pengujian

- **Tujuan:** Memastikan fungsi perhitungan SAW di backend (`SawService`) bersifat murni, deterministik, tahan terhadap *edge case* numerik (`0`, `null`, `NaN`, `Infinity`), menolak konfigurasi bobot tidak valid, dan menghasilkan skor serta peringkat yang **identik** dengan [`perhitungan-manual.md`](./perhitungan-manual.md).
- **Lingkup Unit Test:** Menguji fungsi murni normalisasi, validasi bobot, perhitungan $V_i$, *tie-breaker*, dan *edge case* tanpa bergantung pada HTTP/database.
- **Lingkup Integration Test:** Menguji endpoint `GET /api/v1/recommendations/saw` dan `PUT /api/v1/admin/saw/weights` bersama middleware autentikasi/otorisasi (`401`/`403`), validasi Zod, dan query Prisma (atau test mock terstruktur).

---

## 2. Ketentuan Teknis Pengujian

- **Dataset Simulasi:** Menggunakan dataset `"DATA SIMULASI"` pada [`perhitungan-manual.md`](./perhitungan-manual.md) (`w = [0.40, 0.35, 0.25]`, ranking `A3 -> A1 -> A2`).
- **Toleransi *Floating-Point*:** Pembandingan nilai skor presisi penuh di Vitest menggunakan `toBeCloseTo(expected, 6)` (toleransi $10^{-6}$).
- **Ketentuan *Tie-Breaker*:** Jika dua item memiliki skor $V_i$ identik, item dengan judul alfabetis A–Z lebih awal wajib mendapat peringkat lebih tinggi.
- **Ketentuan Error & Keamanan:** Tidak boleh ada keluaran `NaN` atau `Infinity`; request publik yang menyisipkan bobot mentah harus ditolak/diabaikan.

---

## 3. Matriks Kasus Uji SAW (`[RENCANA]`)

| Test ID | Skenario | Input | Expected Output | Jenis Test | Requirement | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-SAW-01** | Hasil sama dengan perhitungan manual (`DATA SIMULASI`) | 3 alternatif `A1, A2, A3`; bobot `0.40, 0.35, 0.25` | Ranking `A3 (1.0)`, `A1 (0.848125)`, `A2 (0.638333...)` | Unit Test | `FR-C06`, `FR-S01`, `FR-S06` | `[RENCANA]` |
| **TC-SAW-02** | Konfigurasi bobot valid (`Σ = 1.0`) | `[0.40, 0.35, 0.25]` | Validasi lolos (`true`) | Unit Test | `FR-S02`, `FR-A10` | `[RENCANA]` |
| **TC-SAW-03** | Bobot tidak berjumlah `1.0` | `[0.50, 0.30, 0.10]` (`Σ = 0.90`) | Ditolak dengan error `SAW_CONFIGURATION_INVALID` | Unit / Integration | `FR-S02`, `FR-A10` | `[RENCANA]` |
| **TC-SAW-04** | Bobot bernilai negatif | `[0.60, 0.50, -0.10]` | Ditolak dengan error validasi (`400`) | Unit / Integration | `FR-S02`, `FR-A10` | `[RENCANA]` |
| **TC-SAW-05** | Normalisasi kriteria *Benefit* | `ratingAvg`: `[4.5, 4.0, 4.8]` ($\max=4.8$) | `[0.9375, 0.833333..., 1.0]` | Unit Test | `FR-S03` | `[RENCANA]` |
| **TC-SAW-06** | Normalisasi kriteria *Cost* | `price`: `[50000, 75000, 40000]` ($\min=40000$) | `[0.8, 0.533333..., 1.0]` | Unit Test | `FR-S03` | `[RENCANA]` |
| **TC-SAW-07** | Semua kandidat bernilai `0` pada satu kriteria | `salesCount`: `[0, 0, 0]` | $r_{ij} = 0$ semua, tidak ada `NaN` / `Infinity` | Unit Test | `FR-S03` | `[RENCANA]` |
| **TC-SAW-08** | Data kandidat e-book kosong | `[]` | Mengembalikan `recommendations: []` (`200 OK`) | Unit / Integration | `FR-S01`, `FR-S03` | `[RENCANA]` |
| **TC-SAW-09** | *Tie-breaker* deterministik | 2 e-book skor identik (`0.825`), judul `"Zebra"` & `"Alfa"` | `"Alfa"` peringkat `1`, `"Zebra"` peringkat `2` | Unit Test | `FR-S04` | `[RENCANA]` |
| **TC-SAW-10** | Hanya satu kandidat e-book | `1` alternatif valid | Mengembalikan peringkat `1` dengan skor valid (`1.0`) | Unit Test | `FR-S03` | `[RENCANA]` |
| **TC-SAW-11** | Kriteria tidak valid / kosong / tanpa sumber data | Konfigurasi kriteria `[]` atau field tak dikenal | Mengembalikan error `SAW_CONFIGURATION_INVALID` | Unit Test | `FR-S02` | `[RENCANA]` |
| **TC-SAW-12** | E-book tanpa rating (`ratingAvg = 0`) | 2 kandidat (`ratingAvg: 0` dan `4.5`) | Tidak error, `r = 0` untuk kandidat tanpa rating (sesuai kebijakan #7) | Unit Test | `FR-S03` | `[RENCANA]` |
| **TC-SAW-13** | Pencegahan `NaN` dan `Infinity` | Variasi angka `0`, `null` opsional, angka sangat kecil | Seluruh skor terdefinisi (`Number.isFinite(score) === true`) | Unit Test | `FR-S03`, `NFR-07` | `[RENCANA]` |
| **TC-SAW-14** | Tolak/abaikan bobot mentah dari request publik | `GET /api/v1/recommendations/saw?weights=...` | Backend memakai bobot server, bukan bobot request | Integration Test | `FR-S01`, `FR-S02` | `[RENCANA]` |
| **TC-SAW-15** | Konsistensi urutan rekomendasi berulang | Panggil fungsi SAW 5 kali pada dataset identik | Output dan urutan identik 100% | Unit Test | `FR-S04` | `[RENCANA]` |
| **TC-SAW-16** | Otorisasi ubah bobot oleh non-Admin | `PUT /api/v1/admin/saw/weights` dengan token `CUSTOMER` | Ditolak dengan `403 Forbidden` | Integration Test | `FR-A10`, `NFR-01` | `[RENCANA]` |
