# Aturan Normalisasi Metode SAW

> **Status Dokumen:** `[ADA]` (Dokumentasi aturan normalisasi) | **Implementasi Kode:** `[RENCANA]`
> **Referensi:** [`saw-method.md`](./saw-method.md), [`saw-recommendation-workflow.md`](../03-business-process/saw-recommendation-workflow.md)

---

## 1. Definisi & Rumus Normalisasi

1. **Kriteria *Benefit*:** Kriteria di mana nilai yang lebih besar lebih disukai (contoh: `ratingAvg`, `salesCount`).
   - Rumus: $r_{ij} = \frac{x_{ij}}{\max_i(x_{ij})}$
   - Cara memperoleh $\max_i(x_{ij})$: nilai maksimum dari seluruh alternatif kandidat aktif pada kriteria ke-$j$.
2. **Kriteria *Cost*:** Kriteria di mana nilai yang lebih kecil lebih disukai (contoh: `price`).
   - Rumus: $r_{ij} = \frac{\min_i(x_{ij})}{x_{ij}}$
   - Cara memperoleh $\min_i(x_{ij})$: nilai minimum dari seluruh alternatif kandidat aktif yang valid pada kriteria ke-$j$.

---

## 2. Tabel Keputusan *Edge Case* Normalisasi

| Kondisi | Benefit | Cost | Perilaku Backend yang Diharapkan | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Kandidat kosong (0 e-book aktif)** | Tidak dieksekusi | Tidak dieksekusi | Mengembalikan array `recommendations: []` dengan HTTP `200 OK` tanpa error. | `[RENCANA]` |
| **Hanya 1 kandidat e-book** | $\max = x_{1j} \Rightarrow r_{1j} = 1.0$ (jika $x_{1j} > 0$) | $\min = x_{1j} \Rightarrow r_{1j} = 1.0$ (jika $x_{1j} > 0$) | Kandidat tetap mendapat skor valid (`1.0` bila semua nilai positif) tanpa pembagian nol. | `[RENCANA]` |
| **Semua kandidat bernilai nol (`0`)** | $\max_i(x_{ij}) = 0$ | $\min_i(x_{ij}) = 0$ & $x_{ij} = 0$ | Tetapkan $r_{ij} = 0$ secara eksplisit; **dilarang** menghasilkan `NaN` atau `Infinity`. | `[RENCANA]` |
| **Salah satu nilai *Cost* bernilai nol (`0`)** | Tidak relevan | $\min = 0$ atau pembagi $x_{ij} = 0$ | **Rekomendasi `[RENCANA]`:** Untuk `price = 0` (e-book gratis jika ada) atau nilai cost `0`, hindari pembagian nol ($x_{ij} = 0 \Rightarrow r_{ij} = 1.0$ untuk *free item*, atau tolak bila kriteria melarang nilai `0` seperti `pageCount > 0`). Memerlukan penetapan kebijakan final. | `[RENCANA]` |
| **Nilai `null` / `undefined` pada atribut opsional** | Tidak valid sebagai angka | Tidak valid sebagai angka | **Rekomendasi `[RENCANA]`:** Normalisasi sebagai `0` atau kecualikan kriteria opsional yang belum lengkap datanya (`pageCount`, `publishedYear`). Tidak boleh menghasilkan `NaN`. | `[RENCANA]` |
| **Nilai negatif (`< 0`)** | Ditolak / tidak valid | Ditolak / tidak valid | Data negatif melanggar constraint DB (`price >= 0`); backend mencatat error integritas data dan tidak memproses nilai negatif diam-diam. | `[RENCANA]` |

---

## 3. Presisi Angka & Aturan Pembulatan

- **Presisi Perhitungan:** Seluruh pembagian normalisasi ($r_{ij}$) dan penjumlahan terbobot ($V_i$) dijalankan dalam presisi penuh *IEEE 754 double-precision floating-point* di TypeScript/Node.js (atau tipe desimal presisi tinggi) **tanpa pembulatan di tengah proses**.
- **Aturan Pembulatan Tampilan (`[RENCANA]`):** Pembulatan skor akhir (misalnya `toFixed(3)` atau `4` angka di belakang koma) hanya diterapkan pada representasi tampilan UI setelah pemeringkatan dan *tie-breaker* selesai dieksekusi pada nilai presisi penuh.

---

## 4. Contoh Singkat (`DATA SIMULASI`)

Misalkan pada kriteria **Benefit** (`ratingAvg`) terdapat dua kandidat `DATA SIMULASI`:
- `B1`: `ratingAvg = 0` (belum ada rating)
- `B2`: `ratingAvg = 4.0`

Maka $\max = 4.0$:
- $r_{B1} = 0 / 4.0 = 0$
- $r_{B2} = 4.0 / 4.0 = 1.0$

Apabila **kedua** kandidat memiliki `ratingAvg = 0` ($\max = 0$), aturan *guard* menetapkan $r_{B1} = 0$ dan $r_{B2} = 0$ sehingga tidak muncul `0 / 0 = NaN`.
