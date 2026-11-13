---
name: saw-algorithm
description: Gunakan saat merancang, mengimplementasikan, atau menguji perhitungan Simple Additive Weighting (SAW) untuk sistem rekomendasi e-book di backend.
---

# Skill: Algoritma SAW (Simple Additive Weighting)

## Aturan Dasar
1. Perhitungan SAW **hanya** berjalan di backend. Bobot dari klien tidak dipercaya.
2. Fungsi perhitungan SAW harus berupa **fungsi murni (pure function)** tanpa akses database atau efek samping.

## Rumus Normalisasi & Preferensi
- **Kriteria Benefit:** `r_ij = x_ij / MAX(x_j)`
- **Kriteria Cost:** `r_ij = MIN(x_j) / x_ij`
- **Nilai Preferensi:** `V_i = Σ (w_j * r_ij)`

## Validasi & Edge Cases
- Validasi bobot: harus numerik, `>= 0`, dan total bobot `= 1` (± toleransi floating point kecil, misal `1e-6`).
- Tangani nilai kosong/null dan cegah pembagi nol (`MAX = 0` untuk benefit atau `x_ij = 0` untuk cost).
- **Pengurutan & Pembulatan:** Urutkan ranking menggunakan nilai presisi penuh **sebelum** pembulatan tampilan.
- **Tie-break:** Jika nilai `V_i` sama persis, urutkan berdasarkan **judul e-book secara alfabetis (A–Z)**.
- Dokumentasikan satuan dan format angka tiap kriteria, karena ambiguitas satuan/format angka dapat membalik ranking alternatif yang nyaris seri.

## Snapshot & Immutability
- Simpan snapshot lengkap (kriteria, bobot, nilai mentah, hasil normalisasi, nilai `V`, dan peringkat) pada saat perhitungan dijalankan.
- Hasil historis tidak boleh berubah meski master data e-book atau bobot berubah di masa depan.

## Konflik Terbuka (WAJIB Tanyakan!)
- Konfigurasi bobot proyek saat ini masih **KONFLIK**: dokumen awal menyebut 4 kriteria (`0,35 / 0,30 / 0,20 / 0,15`) vs 5 kriteria pada hitungan manual awal. **Jangan memilih diam-diam** — konfirmasikan kepada pengguna sebelum implementasi final.

## Pengujian Wajib
- Unit test wajib mencocokkan hasil fungsi murni dengan perhitungan manual (label `DATA SIMULASI`), antara lain skenario uji bobot `0,40 / 0,35 / 0,25` yang menghasilkan urutan ranking `A3, A1, A2`.
