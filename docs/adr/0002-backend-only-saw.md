# ADR-0002: Perhitungan SAW Hanya di Backend

## Status
Diterima

- **Status Keputusan:** Diterima
- **Status Implementasi:** `[RENCANA]` (layanan dan endpoint SAW belum diimplementasikan di `backend/src/`)
- **Tanggal Keputusan:** 2026-11-14 *(diperluas dari keputusan awal fondasi proyek)*
- **Tanggal Pembaruan:** 2026-11-14
- **Pemutus:** Tim Proyek & Pembimbing Akademik
- **Pengganti:** Tidak ada

## Konteks
Metode **Simple Additive Weighting (SAW)** digunakan sebagai Sistem Pendukung Keputusan (SPK) untuk merekomendasikan e-book kepada pelanggan. Apabila perhitungan normalisasi, pembobotan, dan pemeringkatan dilakukan di sisi klien (mobile Flutter atau web React), bobot kriteria dapat dimanipulasi oleh pengguna, hasil antar perangkat berisiko tidak konsisten akibat perbedaan pembulatan *floating-point*, serta jejak audit hasil historis sulit dijamin integritasnya.

### Faktor yang Mempengaruhi
- Keamanan dan integritas bobot kriteria terhadap manipulasi dari sisi klien.
- Konsistensi hasil peringkat di seluruh platform klien (`mobile/ebook_store` dan `web/pengunjung-web`).
- Kemudahan audit akademik terhadap kesesuaian rumus dan perhitungan manual.

### Stakeholder
- **Dosen Pembimbing & Penguji Akademik:** Membutuhkan bukti matematis bahwa hasil SAW di aplikasi identik dengan perhitungan manual.
- **Tim Pengembang:** Membutuhkan satu sumber kebenaran (*single source of truth*) yang mudah diuji dengan unit test.
- **Pelanggan & Admin:** Membutuhkan rekomendasi yang konsisten, adil, dan dapat dipertanggungjawabkan.

## Alternatif yang Dipertimbangkan

### Alternatif 1: Perhitungan SAW Sepenuhnya di Backend (*Backend-Only*)
- **Deskripsi:** Seluruh proses pengambilan matriks keputusan dari database, validasi bobot, normalisasi *Benefit*/*Cost*, skor preferensi $V_i$, dan *tie-breaker* dijalankan di backend sebagai fungsi murni.
- **Kelebihan:** Bobot terlindungi di server, hasil identik untuk semua klien, mudah diuji lewat unit test terhadap dataset manual, dan mendukung penyimpanan snapshot audit (`[RENCANA]`).
- **Kekurangan:** Menambah beban komputasi ringan di server saat request rekomendasi masuk, dan klien tidak dapat menghitung ulang secara offline.
- **Status:** Dipilih

### Alternatif 2: Perhitungan SAW di Sisi Klien (*Client-Side*)
- **Deskripsi:** Backend mengirim data mentah katalog dan bobot ke Flutter/React untuk dihitung di perangkat pengguna.
- **Kelebihan:** Mengurangi sedikit beban CPU backend.
- **Kekurangan:** Bobot dan logika ranking mudah dimanipulasi di klien, berisiko terjadi perbedaan pembulatan antara Dart dan JavaScript, serta sulit diaudit.
- **Status:** Ditolak

### Alternatif 3: Pendekatan Hibrida (*Hybrid*)
- **Deskripsi:** Normalisasi awal di backend tetapi pembobotan atau pengurutan dilakukan di klien.
- **Kelebihan:** Klien dapat mengubah tampilan urutan secara lokal.
- **Kekurangan:** Menambah kompleksitas sinkronisasi kontrak data dan tetap membuka celah manipulasi skor/bobot di sisi klien.
- **Status:** Ditolak

## Keputusan
Seluruh perhitungan SAW dijalankan **hanya di backend** sebagai fungsi murni (*pure function*) dengan validasi bobot ketat ($\sum w_j = 1.0$, $w_j > 0$), dan bobot mentah dari klien publik tidak dipercaya. *(Rencana penyimpanan snapshot hasil historis mengikuti finalisasi Keputusan #11).*

### Alasan
1. Menjamin konsistensi hasil peringkat antara perhitungan manual akademik, Admin Web, Pengunjung Web, dan Mobile Android.
2. Melindungi integritas bobot kriteria dari manipulasi sisi klien sesuai aturan mutlak [`AGENTS.md`](../../AGENTS.md).

## Konsekuensi

### Positif
- Klien hanya menerima daftar peringkat, skor akhir, dan metadata kriteria yang telah divalidasi backend.
- Konsistensi hasil terhadap perhitungan manual dapat diverifikasi langsung melalui unit test Vitest di backend.
- Audit akademik lebih mudah karena seluruh logika berada di satu modul backend.

### Negatif
- Klien memerlukan koneksi ke backend untuk memperoleh daftar rekomendasi SAW terbaru.
- Kustomisasi bobot oleh pelanggan tidak diizinkan secara bebas (hanya dimungkinkan melalui preset tervalidasi jika disepakati pada Keputusan #5 `[RENCANA]`).

### Netral
- Aplikasi mobile dan web hanya bertugas menampilkan hasil rekomendasi dan menangani state `loading`, `empty`, serta `error`.

## Dampak Teknis

### Arsitektur
- Penempatan layanan murni `SawService` di `backend/` yang terpisah dari layer HTTP controller (`[RENCANA]`).

### Database
- Mengambil kandidat e-book aktif (`Ebook.isActive = true`) beserta kolom kriteria (`price`, `ratingAvg`, `salesCount`, dan kolom lain sesuai Keputusan #9) dari `backend/prisma/schema.prisma`.
- Penyimpanan konfigurasi bobot dan tabel snapshot SAW masih menunggu keputusan final (`#5`, `#9`, `#11` `[RENCANA]`).

### API
- Endpoint publik/pelanggan `GET /api/v1/recommendations/saw` (`[RENCANA]`) dan endpoint admin `PUT /api/v1/admin/saw/weights` (`[RENCANA]`).

### Keamanan
- Menolak bobot mentah dari klien publik; perubahan bobot dibatasi hanya untuk role `ADMIN` dengan validasi Zod ketat ($\sum w_j = 1.0$).

### Pengujian
- Unit test backend wajib memverifikasi 16 skenario SAW (`TC-SAW-01`–`TC-SAW-16`) dan kesesuaian presisi `toBeCloseTo(expected, 6)` terhadap [`perhitungan-manual.md`](../03-saw/perhitungan-manual.md) (`[RENCANA]`).

### Deployment
- Tidak ada dampak infrastruktur khusus; berjalan di proses runtime backend Express yang sama.

## Referensi Silang
- **Kebutuhan:** `FR-S01`–`FR-S06`, `FR-C06`, `FR-A10` pada [`requirements.md`](../00-project/requirements.md)
- **Dokumen Arsitektur:** [`architecture-decisions-summary.md`](../02-architecture/architecture-decisions-summary.md), [`AGENTS.md`](../../AGENTS.md)
- **Dokumen Desain:** [`saw-method.md`](../03-saw/saw-method.md), [`saw-backend-contract.md`](../03-saw/saw-backend-contract.md), [`perhitungan-manual.md`](../03-saw/perhitungan-manual.md), [`saw-test-specification.md`](../03-saw/saw-test-specification.md)
- **Dokumen Modul:** [`ebook-catalog.md`](../06-modules/ebook-catalog.md)
- **Keputusan Terbuka:** [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md) (#5, #7, #9, #11 masih `[RENCANA]`)
- **ADR Terkait:** [`ADR-0001`](./0001-single-seller-b2c.md)
- **Bukti Teknis:** [`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma) (`Ebook.isActive`, `Ebook.price`, `Ebook.ratingAvg`, `Ebook.salesCount`)

## Catatan
Keputusan ini mempertahankan keputusan asli `ADR-0002`. Catatan mengenai "penyimpanan snapshot hasil" pada keputusan awal masih berketergantungan pada finalisasi **Keputusan #11** di `keputusan-terbuka.md` (`[RENCANA]`).
