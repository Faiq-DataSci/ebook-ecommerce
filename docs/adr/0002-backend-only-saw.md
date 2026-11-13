# ADR-0002: Perhitungan SAW Hanya di Backend

## Konteks
Metode Simple Additive Weighting (SAW) digunakan untuk memberikan rekomendasi e-book. Jika perhitungan dilakukan di sisi klien (mobile/web), bobot dapat dimanipulasi, hasil antar klien bisa tidak konsisten akibat perbedaan pembulatan, dan snapshot historis sulit dijamin integritasnya.

## Keputusan
Seluruh perhitungan SAW dijalankan **hanya di backend** sebagai fungsi murni dengan validasi bobot ketat dan penyimpanan snapshot hasil.

## Konsekuensi
- Klien hanya menerima hasil peringkat dan skor yang telah divalidasi backend.
- Konsistensi hasil antara perhitungan manual, admin web, dan mobile lebih mudah diuji melalui unit test backend.

## Status
Diterima (`[RENCANA]` implementasi)
