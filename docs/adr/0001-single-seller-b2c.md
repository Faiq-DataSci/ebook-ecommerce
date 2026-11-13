# ADR-0001: Model Bisnis Single-Seller (B2C)

## Konteks
Proyek ini adalah sistem informasi e-book dan SPK berbasis mobile untuk kebutuhan akademik tim beranggotakan 3 orang. Model marketplace multi-penjual menambah kompleksitas manajemen toko, komisi, dan moderasi yang tidak dibutuhkan oleh ruang lingkup tugas.

## Keputusan
Sistem dirancang sebagai e-commerce e-book **single-seller (B2C)** dengan hanya dua aktor: **Pelanggan** dan **Admin**.

## Konsekuensi
- Skema database, alur transaksi, dan otorisasi menjadi lebih fokus dan terukur.
- Seluruh katalog e-book dikelola terpusat oleh Admin.

## Status
Diterima (`[RENCANA]` implementasi)
