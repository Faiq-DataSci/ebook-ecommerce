# Kasus Batas & Penanganan Error SAW (`Edge Cases`)

> **Status Dokumen:** `[ADA]` (Dokumentasi analisis *edge case*) | **Implementasi Penanganan:** `[RENCANA]`
> **Referensi:** [`normalization-rules.md`](./normalization-rules.md), [`error-catalog.md`](../02-api/error-catalog.md), [`exception-and-alternative-flows.md`](../03-business-process/exception-and-alternative-flows.md)

---

## 1. Matriks Kasus Batas, Kondisi Error, dan Kualitas Data

| ID | Kondisi | Dampak | Penanganan yang Diharapkan | Error atau Respons | Test Case | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **EC-01** | Katalog e-book aktif kosong (`0` baris `isActive = true`) | Tidak ada alternatif yang dapat dibandingkan | Kembalikan daftar rekomendasi kosong tanpa memanggil fungsi normalisasi | `200 OK`, `recommendations: []` | `TC-SAW-05` | `[RENCANA]` |
| **EC-02** | Hanya terdapat `1` kandidat e-book aktif | Nilai $\max = \min = x_{1j}$ | Normalisasi menghasilkan `1.0` untuk nilai positif (atau `0` jika nilai nol) | `200 OK`, 1 item peringkat `1` | `TC-SAW-10` | `[RENCANA]` |
| **EC-03** | Semua nilai pada kriteria *Benefit* bernilai `0` | Pembagi $\max(x_{ij}) = 0$ berisiko `NaN` | Guard menetapkan $r_{ij} = 0$ untuk seluruh alternatif pada kriteria tersebut | `200 OK`, bebas `NaN` | `TC-SAW-06` | `[RENCANA]` |
| **EC-04** | Salah satu alternatif memiliki nilai *Benefit* `0` | Nilai pembilang `0` ($0 / \max$) | Menghasilkan $r_{ij} = 0$ secara valid (ketika $\max > 0$) | `200 OK`, $r_{ij} = 0$ | `TC-SAW-04` | `[RENCANA]` |
| **EC-05** | Nilai *Cost* bernilai `0` (mis. `price = 0` jika ada) | Pembagi $x_{ij} = 0$ berisiko `Infinity` | Guard mencegah pembagian nol (`[RENCANA]` penetapan nilai `1.0` untuk harga gratis atau tolak jika atribut wajib `> 0`) | `200 OK` bebas `Infinity` / `500` jika data korup | `TC-SAW-06`, `TC-SAW-14` | `[RENCANA]` |
| **EC-06** | Semua nilai *Cost* antar kandidat sama (`min == x_ij > 0`) | Tidak ada perbedaan biaya antar e-book | $\min / x_{ij} = 1.0$ untuk semua kandidat; pembeda ditentukan kriteria lain atau tie-breaker | `200 OK`, $r_{ij} = 1.0$ | `TC-SAW-05B` | `[RENCANA]` |
| **EC-07** | Nilai atribut opsional `null` atau `undefined` (`pageCount`, `publishedYear`) | Error tipe aritmetika / `NaN` | Konversi aman sesuai kebijakan kriteria opsional (`0` atau filter kandidat lengkap, `[RENCANA]`) | Bebas `NaN` / `422` jika kriteria wajib belum lengkap | `TC-SAW-11` | `[RENCANA]` |
| **EC-08** | Terdapat nilai negatif (`< 0`) pada data input kriteria | Merusak asumsi rasio SAW | Tolak data negatif dan catat error integritas data di log server | `500 INTERNAL_SERVER_ERROR` (pesan aman) | `TC-SAW-13`, `TC-SAW-14` | `[RENCANA]` |
| **EC-09** | E-book berstatus tidak aktif (`isActive = false`) | E-book arsip berisiko direkomendasikan | Query kandidat wajib memfilter `where: { isActive: true }` sebelum matriks dibangun | Tidak muncul di hasil rekomendasi | `TC-SAW-01` | `[RENCANA]` |
| **EC-10** | E-book belum memiliki rating (`ratingAvg = 0`) | Bisa menggeser ranking atau memicu ketidakjelasan | Tangani aman (`0` pada normalisasi) dan tandai status `"Belum ada rating"`; kebijakan final menunggu Keputusan #7 | `200 OK` *(kebijakan final `[RENCANA]`)* | `TC-SAW-12` | `[RENCANA]` |
| **EC-11** | E-book memiliki jumlah penjualan nol (`salesCount = 0`) | Buku baru belum terjual | $r_{ij} = 0$ jika ada buku lain terjual, atau $0$ untuk semua jika semua `0` | `200 OK`, $r_{ij} = 0$ | `TC-SAW-06` | `[RENCANA]` |
| **EC-12** | Total bobot kriteria tidak berjumlah `1.0` (`\|Σw - 1.0\| > 1e-6`) | Skor $V_i$ keluar dari rentang $[0, 1]$ | Tolak saat Admin menyimpan bobot (`400`) dan hentikan kalkulasi jika konfigurasi server rusak (`500`) | `400` / `500` `SAW_CONFIGURATION_INVALID` | `TC-SAW-02` | `[RENCANA]` |
| **EC-13** | Terdapat bobot bernilai negatif (`w_j < 0`) | Membalikkan arah preferensi secara ilegal | Tolak oleh schema Zod dan validator bobot | `400` `VALIDATION_ERROR` / `SAW_CONFIGURATION_INVALID` | `TC-SAW-03` | `[RENCANA]` |
| **EC-14** | Daftar bobot/kriteria aktif kosong (`[]`) | Tidak ada kriteria untuk dihitung | Hentikan kalkulasi dan kembalikan error konfigurasi | `500` `SAW_CONFIGURATION_INVALID` | `TC-SAW-11` | `[RENCANA]` |
| **EC-15** | ID/kode kriteria pada konfigurasi tidak ditemukan | Ketidakcocokan mapping field `Ebook` | Tolak konfigurasi saat validasi dan jangan proses kalkulasi parsial | `400` / `500` `SAW_CONFIGURATION_INVALID` | `TC-SAW-11` | `[RENCANA]` |
| **EC-16** | Kriteria tidak memiliki sumber data valid di database | Atribut `undefined` saat runtime | Validasi daftar kriteria hanya terhadap field `Ebook` yang diizinkan (whitelist) | `500` `SAW_CONFIGURATION_INVALID` | `TC-SAW-11` | `[RENCANA]` |
| **EC-17** | Dua atau lebih alternatif memiliki skor $V_i$ identik | Urutan peringkat berpotensi acak/non-deterministik | Terapkan *tie-breaker* deterministik: urutkan berdasarkan `title` alfabetis menaik (`A–Z`) | `200 OK`, urutan konsisten | `TC-SAW-09` | `[RENCANA]` |
| **EC-18** | Katalog berubah (`update price`/`isActive`) saat permintaan berjalan | Inkonsistensi antara harga saat hitung vs setelahnya | Ambil kandidat dalam satu query read konsisten per eksekusi | `200 OK`, hasil konsisten per eksekusi | `TC-SAW-16` | `[RENCANA]` |
| **EC-19** | Kegagalan query database PostgreSQL | Backend tidak dapat mengambil kandidat/bobot | Tangkap error di `error.middleware.ts`, log internal, kirim pesan generik tanpa detail DB | `500 INTERNAL_SERVER_ERROR` | — | `[RENCANA]` |
| **EC-20** | Kegagalan penyimpanan snapshot SAW *(bila Keputusan #11 disetujui)* | Perhitungan selesai tetapi log snapshot gagal disimpan | Catat kegagalan di log; kebijakan apakah mengembalikan hasil atau gagal atomik ditetapkan pada Keputusan #11 | `[RENCANA]` (lihat Keputusan #11) | — | `[RENCANA]` |
