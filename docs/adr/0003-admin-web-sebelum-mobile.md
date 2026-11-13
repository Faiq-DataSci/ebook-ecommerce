# ADR-0003: Urutan Pengembangan Backend -> Admin Web -> Mobile

## Konteks
Aplikasi mobile membutuhkan data katalog, autentikasi, dan endpoint rekomendasi yang sudah teruji. Membangun UI mobile sebelum backend dan alat input data admin siap berisiko memunculkan data palsu dan integrasi ulang.

## Keputusan
Urutan pengerjaan dikunci menjadi: **Backend** -> **Admin Web** -> **Mobile**, dengan pengujian konektivitas terlebih dahulu sebelum membangun antarmuka penuh.

## Konsekuensi
- Endpoint API dan kontrak data distabilkan lebih dulu di backend.
- Admin Web dapat langsung digunakan untuk mengelola data nyata yang dikonsumsi aplikasi mobile.

## Status
Diterima (`[RENCANA]` implementasi)
