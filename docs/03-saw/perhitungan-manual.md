# Perhitungan Manual Metode SAW (`DATA SIMULASI`)

> **PERINGATAN INTEGRITAS DATA:** Seluruh judul e-book, harga, rating, jumlah terjual, bobot, skor, dan hasil ranking pada dokumen ini adalah **`DATA SIMULASI`** untuk keperluan verifikasi matematis dan acuan pembuatan unit test backend.
> **Status Dokumen:** `[ADA]` (Contoh perhitungan manual `DATA SIMULASI`) | **Status Unit Test Backend:** `[RENCANA]` (Belum ada implementasi `saw.service` maupun unit test SAW yang dijalankan)

---

## 1. Catatan Ketidakfinalan Konfigurasi Produksi

Karena jumlah kriteria final (4 vs 5 kriteria) dan bobot produksi masih berstatus `[RENCANA]` pada [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) (#9), contoh simulasi di bawah ini menggunakan **3 kriteria utama** (`0,40 / 0,35 / 0,25`) yang sesuai dengan kerangka uji awal (`A3, A1, A2`) dan seluruh datanya telah tersedia di model `Ebook` (`price`, `ratingAvg`, `salesCount`). Contoh ini **bukan** penetapan konfigurasi produksi final.

---

## 2. Konfigurasi Kriteria & Bobot (`DATA SIMULASI`)

| Kode | Nama Kriteria | Sumber Field | Tipe | Bobot ($w_j$) |
| :--- | :--- | :--- | :--- |---:|
| `C1` | Harga E-Book | `Ebook.price` | **Cost** | `0.40` |
| `C2` | Rating Rata-Rata | `Ebook.ratingAvg` | **Benefit** | `0.35` |
| `C3` | Jumlah Terjual | `Ebook.salesCount` | **Benefit** | `0.25` |
| **Total** | | | | **`1.00`** |

Validasi bobot: $0.40 + 0.35 + 0.25 = 1.00$ (memenuhi $\sum w_j = 1.0$ dan seluruh $w_j > 0$).

---

## 3. Alternatif & Matriks Keputusan ($X$) — `DATA SIMULASI`

Misalkan terdapat 3 alternatif e-book aktif (`DATA SIMULASI`):
- `A1`: `"DATA SIMULASI - Arsitektur Backend Modern"` (`ebook-sim-001`)
- `A2`: `"DATA SIMULASI - Dasar Basis Data Relasional"` (`ebook-sim-002`)
- `A3`: `"DATA SIMULASI - Panduan Praktis Flutter"` (`ebook-sim-003`)

### Matriks keputusan

| Alternatif | Harga (`C1` — Cost) | Rating (`C2` — Benefit) | Jumlah Terjual (`C3` — Benefit) | Kriteria lain yang disetujui |
|---|---:|---:|---:|---:|
| **A1** (`Arsitektur Backend Modern`) | `50000` | `4.5` | `120` | — *(belum final)* |
| **A2** (`Dasar Basis Data Relasional`) | `75000` | `4.0` | `80` | — *(belum final)* |
| **A3** (`Panduan Praktis Flutter`) | `40000` | `4.8` | `150` | — *(belum final)* |

Nilai ekstrem per kriteria:
- $\min(C_1) = \min(50000, 75000, 40000) = 40000$
- $\max(C_2) = \max(4.5, 4.0, 4.8) = 4.8$
- $\max(C_3) = \max(120, 80, 150) = 150$

---

## 4. Langkah Normalisasi ($R$) — Presisi Penuh

1. **Kriteria `C1` (Cost: $r_{i1} = \min(x_{1}) / x_{i1}$):**
   - $r_{11} = 40000 / 50000 = 0.8$
   - $r_{21} = 40000 / 75000 = 8/15 = 0.5333333333333333\dots$
   - $r_{31} = 40000 / 40000 = 1.0$
2. **Kriteria `C2` (Benefit: $r_{i2} = x_{i2} / \max(x_{2})$):**
   - $r_{12} = 4.5 / 4.8 = 15/16 = 0.9375$
   - $r_{22} = 4.0 / 4.8 = 5/6 = 0.8333333333333334\dots$
   - $r_{32} = 4.8 / 4.8 = 1.0$
3. **Kriteria `C3` (Benefit: $r_{i3} = x_{i3} / \max(x_{3})$):**
   - $r_{13} = 120 / 150 = 0.8$
   - $r_{23} = 80 / 150 = 8/15 = 0.5333333333333333\dots$
   - $r_{33} = 150 / 150 = 1.0$

### Matriks normalisasi

| Alternatif | R1 (`C1` Cost) | R2 (`C2` Benefit) | R3 (`C3` Benefit) | Rn |
|---|---:|---:|---:|---:|
| **A1** | `0.800000000000` | `0.937500000000` | `0.800000000000` | — |
| **A2** | `0.533333333333` | `0.833333333333` | `0.533333333333` | — |
| **A3** | `1.000000000000` | `1.000000000000` | `1.000000000000` | — |

*(Catatan: Selama perhitungan di memori backend, tidak dilakukan pembulatan pada $r_{ij}$.)*

---

## 5. Perhitungan Nilai Preferensi ($V_i$) & Pemeringkatan

Rumus: $V_i = (0.40 \times r_{i1}) + (0.35 \times r_{i2}) + (0.25 \times r_{i3})$.

- **$V_1$ (`A1`):** $(0.40 \times 0.8) + (0.35 \times 0.9375) + (0.25 \times 0.8) = 0.32 + 0.328125 + 0.20 = 0.848125$
- **$V_2$ (`A2`):** $(0.40 \times \frac{8}{15}) + (0.35 \times \frac{5}{6}) + (0.25 \times \frac{8}{15}) = \frac{19.15}{30} = 0.6383333333333333\dots$
- **$V_3$ (`A3`):** $(0.40 \times 1.0) + (0.35 \times 1.0) + (0.25 \times 1.0) = 1.0$

### Nilai preferensi

| Peringkat | Alternatif | Perhitungan | Nilai Preferensi Presisi Penuh | Nilai Tampilan (3 Desimal `[RENCANA]`) |
|---:|---|---|---:|---:|
| **1** | **A3** (`DATA SIMULASI - Panduan Praktis Flutter`) | `(0.40×1) + (0.35×1) + (0.25×1)` | `1.000000000000` | `1.000` |
| **2** | **A1** (`DATA SIMULASI - Arsitektur Backend Modern`) | `(0.40×0.8) + (0.35×0.9375) + (0.25×0.8)` | `0.848125000000` | `0.848` |
| **3** | **A2** (`DATA SIMULASI - Dasar Basis Data Relasional`) | `(0.40×8/15) + (0.35×5/6) + (0.25×8/15)` | `0.638333333333` | `0.638` |

**Urutan Ranking Akhir:** `A3` (Peringkat 1) → `A1` (Peringkat 2) → `A2` (Peringkat 3).

---

## 6. Simulasi *Tie-Breaker* & Aturan Pembulatan Tampilan

1. **Simulasi *Tie-Breaker* (`DATA SIMULASI`):**
   Misalkan dua alternatif memiliki skor presisi penuh yang identik:
   - `"DATA SIMULASI - Kriptografi Terapan"` dengan $V = 0.825000000000$
   - `"DATA SIMULASI - Algoritma Pemrograman"` dengan $V = 0.825000000000$
   Berdasarkan aturan *tie-breaker* deterministik (`FR-S04`: urutan alfabetis judul A–Z), `"DATA SIMULASI - Algoritma Pemrograman"` menempati peringkat lebih tinggi karena huruf `A` mendahului `K`.
2. **Aturan Pembulatan Tampilan (`[RENCANA]`):**
   Selama proses normalisasi ($r_{ij}$) dan penjumlahan ($V_i$), **pembulatan dilarang**. Pembulatan (misal 3 atau 4 angka desimal untuk UI, seperti `0.848` pada `design.md`) hanya dilakukan pada layer presentasi/serialisasi tampilan setelah peringkat final ditentukan.

---

## 7. Expected Output Unit Test (`JSON DATA SIMULASI`)

```json
{
  "success": true,
  "data": {
    "isSimulation": true,
    "criteriaVersion": "DATA SIMULASI",
    "recommendations": [
      {
        "rank": 1,
        "ebookId": "ebook-sim-003",
        "title": "DATA SIMULASI - Panduan Praktis Flutter",
        "sawScore": 1.0,
        "displayScore": "1.000"
      },
      {
        "rank": 2,
        "ebookId": "ebook-sim-001",
        "title": "DATA SIMULASI - Arsitektur Backend Modern",
        "sawScore": 0.848125,
        "displayScore": "0.848"
      },
      {
        "rank": 3,
        "ebookId": "ebook-sim-002",
        "title": "DATA SIMULASI - Dasar Basis Data Relasional",
        "sawScore": 0.6383333333333333,
        "displayScore": "0.638"
      }
    ]
  }
}
```

> **Catatan Verifikasi:** Contoh perhitungan manual di atas telah diverifikasi secara aritmetika, tetapi **tidak membuktikan implementasi kode** sebelum `saw.service` dan unit test backend benar-benar ditulis serta dijalankan lulus.
