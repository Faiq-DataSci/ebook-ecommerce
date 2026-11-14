# Suite Pengujian SPK SAW (`SAW Test Suite`)

**Status:** `[ADA]` (spesifikasi di `docs/03-saw/`) | `[RENCANA]` (implementasi `saw.service` & eksekusi unit/integration test)  
**Sumber Utama:** [`saw-test-specification.md`](../03-saw/saw-test-specification.md), [`saw-edge-cases.md`](../03-saw/saw-edge-cases.md), [`perhitungan-manual.md`](../03-saw/perhitungan-manual.md), [`normalization-rules.md`](../03-saw/normalization-rules.md), [`saw-backend-contract.md`](../03-saw/saw-backend-contract.md), [`ADR-0002`](../adr/0002-backend-only-saw.md).

---

## 1. Tujuan, Lingkup, & Ketentuan Teknis

- **Tujuan:** Memastikan fungsi SAW di backend bersifat murni (*pure function*), deterministik, tahan terhadap *edge case* (`0`, `null`, `NaN`, `Infinity`), menolak bobot tidak valid, dan hasilnya identik dengan [`perhitungan-manual.md`](../03-saw/perhitungan-manual.md).
- **Lingkup Unit Test:** Normalisasi benefit/cost, validasi bobot, skor $V_i$, *tie-breaker*, dan 20 *edge case* tanpa HTTP/DB.
- **Lingkup Integration Test:** Endpoint `GET /api/v1/recommendations/saw` dan `PUT /api/v1/admin/saw/weights` bersama `authenticate`/`authorize('ADMIN')`, Zod, dan Prisma/mock.
- **Ketentuan Teknis:**
  - Dataset acuan: `"DATA SIMULASI"` (`w = [0.40, 0.35, 0.25]`, ranking `A3 -> A1 -> A2`).
  - Toleransi floating-point: `toBeCloseTo(expected, 6)`.
  - Tie-breaker deterministik: judul alfabetis A–Z.
  - Bobot mentah dari klien publik ditolak/diabaikan (`ADR-0002`).

---

## 2. Matriks 16 Test Case SAW (`TC-SAW-01` – `TC-SAW-16` — `[RENCANA]`)

| Test ID | Skenario | Input | Expected Output | Jenis | Requirement | Status |
|---|---|---|---|---|---|---|
| **TC-SAW-01** | Hasil sama dengan perhitungan manual (`DATA SIMULASI`) | `A1, A2, A3`; bobot `[0.40, 0.35, 0.25]` | Ranking `A3 (1.0)`, `A1 (0.848125)`, `A2 (0.638333...)` | Unit | `FR-C06`, `FR-S01`, `FR-S06` | `[RENCANA]` |
| **TC-SAW-02** | Bobot valid (`Σ = 1.0`) | `[0.40, 0.35, 0.25]` | Validasi lolos (`true`) | Unit | `FR-S02`, `FR-A10` | `[RENCANA]` |
| **TC-SAW-03** | Bobot tidak berjumlah `1.0` | `[0.50, 0.30, 0.10]` | Error `SAW_CONFIGURATION_INVALID` | Unit/Int | `FR-S02`, `FR-A10` | `[RENCANA]` |
| **TC-SAW-04** | Bobot bernilai negatif | `[0.60, 0.50, -0.10]` | Ditolak (`400`) | Unit/Int | `FR-S02`, `FR-A10` | `[RENCANA]` |
| **TC-SAW-05** | Normalisasi kriteria *Benefit* | `ratingAvg`: `[4.5, 4.0, 4.8]` | `[0.9375, 0.833333..., 1.0]` | Unit | `FR-S03` | `[RENCANA]` |
| **TC-SAW-06** | Normalisasi kriteria *Cost* | `price`: `[50000, 75000, 40000]` | `[0.8, 0.533333..., 1.0]` | Unit | `FR-S03` | `[RENCANA]` |
| **TC-SAW-07** | Semua kandidat bernilai `0` pada satu kriteria | `salesCount`: `[0, 0, 0]` | $r_{ij} = 0$, bebas `NaN`/`Infinity` | Unit | `FR-S03` | `[RENCANA]` |
| **TC-SAW-08** | Data kandidat kosong | `[]` | `recommendations: []` (`200 OK`) | Unit/Int | `FR-S01`, `FR-S03` | `[RENCANA]` |
| **TC-SAW-09** | Tie-breaker alfabetis A–Z | 2 e-book skor `0.825`, `"Zebra"` & `"Alfa"` | `"Alfa"` peringkat `1`, `"Zebra"` peringkat `2` | Unit | `FR-S04` | `[RENCANA]` |
| **TC-SAW-10** | Hanya satu kandidat e-book | `1` alternatif valid | Peringkat `1`, skor `1.0` | Unit | `FR-S03` | `[RENCANA]` |
| **TC-SAW-11** | Kriteria kosong / tak dikenal | `[]` / field invalid | Error `SAW_CONFIGURATION_INVALID` | Unit | `FR-S02` | `[RENCANA]` |
| **TC-SAW-12** | E-book tanpa rating (`ratingAvg = 0`) | `[0, 4.5]` | Aman, `r = 0` untuk kandidat tanpa rating | Unit | `FR-S03` | `[RENCANA]` |
| **TC-SAW-13** | Pencegahan `NaN` dan `Infinity` | Variasi `0`, `null`, nilai kecil | `Number.isFinite(score) === true` | Unit | `FR-S03`, `NFR-07` | `[RENCANA]` |
| **TC-SAW-14** | Tolak/abaikan bobot mentah klien publik | `GET /recommendations/saw?weights=...` | Pakai bobot server | Integration | `FR-S01`, `FR-S02` | `[RENCANA]` |
| **TC-SAW-15** | Konsistensi urutan berulang | Panggil 5x dataset identik | Output & urutan 100% identik | Unit | `FR-S04` | `[RENCANA]` |
| **TC-SAW-16** | Non-admin ubah bobot SAW | `PUT /admin/saw/weights` token `CUSTOMER` | `403 FORBIDDEN` | Integration | `FR-A10`, `NFR-01` | `[RENCANA]` |

---

## 3. Matriks 20 Edge Case (`EC-01` – `EC-20` — `saw-edge-cases.md`)

| ID | Kondisi | Dampak | Penanganan | Error / Respons | Test Case | Status |
|---|---|---|---|---|---|---|
| **EC-01** | Katalog aktif kosong | Tidak ada alternatif | Kembalikan array kosong | `200 OK`, `[]` | `TC-SAW-08` | `[RENCANA]` |
| **EC-02** | Hanya 1 kandidat aktif | `max == min == x` | Normalisasi `1.0` (atau `0` jika 0) | `200 OK`, rank `1` | `TC-SAW-10` | `[RENCANA]` |
| **EC-03** | Semua *Benefit* bernilai `0` | Pembagi `0` | Guard $r_{ij} = 0$ | `200 OK`, bebas `NaN` | `TC-SAW-07` | `[RENCANA]` |
| **EC-04** | Salah satu *Benefit* `0` | Pembilang `0` | $r_{ij} = 0$ | `200 OK` | `TC-SAW-05` | `[RENCANA]` |
| **EC-05** | Nilai *Cost* `0` | Pembagi `0` | Guard cegah `Infinity` | `200 OK` / `500` korup | `TC-SAW-13` | `[RENCANA]` |
| **EC-06** | Semua *Cost* sama (`> 0`) | Pembeda nol | $r_{ij} = 1.0$ semua | `200 OK` | `TC-SAW-06` | `[RENCANA]` |
| **EC-07** | Atribut opsional `null` | Potensi `NaN` | Konversi aman `[RENCANA]` | Bebas `NaN` | `TC-SAW-13` | `[RENCANA]` |
| **EC-08** | Data kriteria negatif (`< 0`) | Rusak asumsi rasio | Tolak & log server | `500 INTERNAL_SERVER_ERROR` | `TC-SAW-13` | `[RENCANA]` |
| **EC-09** | `Ebook.isActive = false` | Buku arsip muncul | Filter `isActive: true` | Tidak muncul | `TC-SAW-01` | `[RENCANA]` |
| **EC-10** | `ratingAvg = 0` | Belum ada rating | Aman (`r = 0`), Keputusan #7 | `200 OK` | `TC-SAW-12` | `[RENCANA]` |
| **EC-11** | `salesCount = 0` | Buku baru | $r_{ij} = 0$ | `200 OK` | `TC-SAW-07` | `[RENCANA]` |
| **EC-12** | `\|Σw - 1.0\| > 1e-6` | Skor di luar `[0,1]` | Tolak konfigurasi | `400`/`500 SAW_CONFIGURATION_INVALID` | `TC-SAW-03` | `[RENCANA]` |
| **EC-13** | Bobot negatif (`w_j < 0`) | Balik preferensi | Tolak Zod & validator | `400` | `TC-SAW-04` | `[RENCANA]` |
| **EC-14** | Kriteria aktif kosong (`[]`) | Tidak ada bobot | Hentikan kalkulasi | `500 SAW_CONFIGURATION_INVALID` | `TC-SAW-11` | `[RENCANA]` |
| **EC-15** | Kode kriteria tak dikenal | Mapping gagal | Tolak konfigurasi | `400`/`500 SAW_CONFIGURATION_INVALID` | `TC-SAW-11` | `[RENCANA]` |
| **EC-16** | Sumber data field invalid | `undefined` runtime | Whitelist field `Ebook` | `500 SAW_CONFIGURATION_INVALID` | `TC-SAW-11` | `[RENCANA]` |
| **EC-17** | Skor $V_i$ identik | Urutan acak | Tie-breaker judul A–Z | `200 OK` konsisten | `TC-SAW-09` | `[RENCANA]` |
| **EC-18** | Katalog berubah saat request | Inkonsistensi baca | Satu query read konsisten | `200 OK` konsisten | `TC-SAW-15` | `[RENCANA]` |
| **EC-19** | Kegagalan query PostgreSQL | DB error | Tangkap `errorHandler` | `500 INTERNAL_SERVER_ERROR` | — | `[RENCANA]` |
| **EC-20** | Gagal simpan snapshot SAW | Keputusan #11 | Log error / kebijakan #11 | `[RENCANA]` | — | `[RENCANA]` |

---

## 4. Expected Output Simulasi (`"DATA SIMULASI"`) & Status

```json
{
  "success": true,
  "data": {
    "items": [
      { "rank": 1, "id": "ebook-sim-003", "title": "DATA SIMULASI - Panduan Praktis Flutter", "score": 1.0 },
      { "rank": 2, "id": "ebook-sim-001", "title": "DATA SIMULASI - Arsitektur Backend Modern", "score": 0.848125 },
      { "rank": 3, "id": "ebook-sim-002", "title": "DATA SIMULASI - Dasar Basis Data Relasional", "score": 0.638333 }
    ]
  }
}
```
- **Ketergantungan Keputusan:** #5 (bobot), #7 (rating 0), #9 (4 vs 5 kriteria), #11 (snapshot SAW).
- **Status Aktual:** `0` tes SAW dieksekusi (`[RENCANA]`).
