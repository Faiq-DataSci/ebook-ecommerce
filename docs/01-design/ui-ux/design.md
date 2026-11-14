# design.md — Panduan UI/UX Neubrutalism

> **Status Dokumen:** `[ADA]` (Spesifikasi desain UI/UX) | **Implementasi UI & Komponen:** `[RENCANA]`
> **Proyek:** Sistem Informasi E-Commerce E-Book dan SPK Berbasis Mobile (Metode SAW)
> **Cakupan:** Aplikasi pelanggan (Flutter, Android — `mobile/ebook_store`), Dashboard Admin (React + TypeScript + Vite — `web/admin-web`), dan Portal Pengunjung Web (React + TypeScript + Vite — `web/pengunjung-web`)
> **Versi:** 2.0 — menggantikan versi sebelumnya yang berbasis Material Design 3
> **Bahasa antarmuka:** Indonesia
> **Referensi gaya:** [neubrutalism.com](https://neubrutalism.com/) (repo: [neubrutalism/neubrutalism.com](https://github.com/neubrutalism/neubrutalism.com)), Nielsen Norman Group "Neobrutalism: Definition and Best Practices", WCAG 2.2
> **Sumber Kebenaran Utama:** [`docs-proyek-ebook-ecommerce.md`](../../docs-proyek-ebook-ecommerce.md)

> Dokumen ini adalah spesifikasi desain (`[RENCANA]` implementasi), bukan bukti bahwa UI sudah diimplementasikan. Semua angka, judul buku, skor, dan nama pengguna pada wireframe adalah **contoh ilustratif**. Di aplikasi, data harus berasal dari backend; data simulasi wajib berlabel **DATA SIMULASI** (lihat bagian 16).

---

## 1. Ringkasan dan arah desain

Neubrutalism adalah gaya antarmuka dengan **garis tepi tebal, bayangan keras tanpa blur, sudut siku, warna datar, dan tipografi tegas**. Tiga properti inti dari referensi:

```css
border: 3px solid #000;
box-shadow: 5px 5px 0 0 #000;
border-radius: 0;
```

Karakter yang dituju untuk produk ini: **toko buku independen yang lantang tapi mudah dipakai** — seperti sampul buku cetak sablon, bukan seperti aplikasi korporat. Gaya ini dipakai sebagai *lapisan tema di atas pola interaksi konvensional* (navigasi standar, arsitektur informasi yang dapat ditebak, umpan balik status yang jelas), sesuai "One Rule" dari referensi.

### 1.1 Tiga zona intensitas

Referensi memperingatkan bahwa gaya ini paling kuat di permukaan ekspresif dan perlu diredam pada e-commerce transaksional dan dashboard padat data. Karena produk ini keduanya, intensitas gaya diatur per zona.

| Zona | Layar | Intensitas | Aturan |
|---|---|---|---|
| **A — Ekspresif** | Splash, onboarding, hero beranda (mobile & web pengunjung), empty state, halaman login | Penuh | Judul display besar, blok warna penuh, kartu miring ≤ 2°, bayangan 8px |
| **B — Operasional** | Katalog, detail e-book, perpustakaan, rekomendasi SAW, profil | Sedang | Border 3px (2px di mobile), bayangan 4–5px, satu warna aksen per kartu, tanpa rotasi |
| **C — Transaksional dan data padat** | Keranjang, checkout, in-app PDF reader, form, tabel admin, laporan, pengaturan kriteria | Tenang | Latar `paper`/putih, border 2px, bayangan hanya pada kartu, dialog, dan tombol aksi utama; baris tabel tanpa bayangan; tanpa rotasi |

Setiap layar di bagian 8, 9, dan 10 (termasuk portal pengunjung web) diberi label zonanya.

### 1.2 Prinsip

1. **Border adalah semantik.** Border menandai: wadah, elemen interaktif, fokus, terpilih, atau error. Border yang tidak menyampaikan salah satunya dihapus.
2. **Satu sistem bayangan.** Hanya tiga tingkat offset utama; arah selalu kanan-bawah; blur selalu 0.
3. **Warna mengelompokkan, bukan menghias.** Basis netral (hitam + `paper`) dengan 1–3 aksen jenuh per layar. Tanpa gradien.
4. **Teks selalu hitam di atas fill.** Warna aksen tidak pernah dipakai sebagai warna teks di atas latar terang.
5. **Kacau di makro, presisi di mikro.** Hero dan tumpukan kartu boleh bergeser; label, field, tombol, dan pesan error sejajar mekanis.
6. **Keras pada pemandu, tenang pada isi.** Judul besar dan tegas; paragraf deskripsi biasa dan nyaman dibaca.
7. **Status tidak pernah hanya warna.** Selalu ikon + teks.
8. **Transparansi SPK.** Skor SAW tidak disajikan sebagai kotak hitam; setiap angka dapat ditelusuri (bagian 11).
9. **Jujur.** Tidak ada tombol tanpa aksi, tidak ada statistik statis, tidak ada data simulasi tanpa label.

---

## 2. Design tokens

Token ditulis sekali dan dipakai di Flutter, React/Tailwind (`admin-web` & `pengunjung-web`), dan Figma dengan nama yang sama (`nb-*`).

### 2.1 Warna

| Token | Hex | Peran |
|---|---|---|
| `nb-black` | `#000000` | Teks, border, bayangan, ikon |
| `nb-paper` | `#FFFDF5` | Latar halaman |
| `nb-white` | `#FFFFFF` | Permukaan kartu, input, tabel |
| `nb-yellow` | `#FFD23F` | **Primer**: aksi utama, item terpilih, brand |
| `nb-pink` | `#FF6B6B` | Destruktif, error, status gagal/dicabut |
| `nb-blue` | `#74B9FF` | Info, status diproses, chip kategori |
| `nb-green` | `#88D498` | Sukses, status lunas/aktif |
| `nb-orange` | `#FFA552` | Peringatan, status tertunda, badge simulasi |
| `nb-lavender` | `#B8A9FA` | **Khusus fitur rekomendasi SAW** |
| `nb-muted` | `#E8E4D8` | Permukaan nonaktif, skeleton, baris selang-seling |
| `nb-text-muted` | `#3D3D3D` | Teks sekunder |
| `nb-disabled-text` | `#5A5A5A` | Teks nonaktif |
| `nb-focus` | `#1D4ED8` | Cincin fokus |

Catatan penting:

- **Cincin fokus memakai `nb-focus`, bukan `nb-blue`.** Referensi memakai `#74B9FF` untuk outline fokus, tetapi biru muda itu kurang dari 3:1 terhadap `paper` (kriteria 1.4.11 Non-text Contrast). `#1D4ED8` memberi kontras jauh lebih tinggi.
- Hitam di atas semua aksen pada tabel berkontras tinggi menurut perhitungan perkiraan kami (sekitar 7:1 atau lebih). **Ini wajib diverifikasi ulang dengan alat kontras sebelum rilis**, terutama pada kombinasi baru.
- Tidak boleh: teks aksen di atas `paper`/putih (kuning di atas putih gagal), teks putih di atas aksen, aksen di atas aksen tanpa pemisah border hitam.
- **Mode gelap tidak termasuk versi 1** (lihat keputusan terbuka, bagian 19).

Pemetaan semantik status (dipakai di mobile dan web):

| Status | Fill | Ikon | Label |
|---|---|---|---|
| Sukses / Lunas / Aktif | `nb-green` | centang | "Lunas", "Aktif" |
| Tertunda / Menunggu | `nb-orange` | jam | "Menunggu pembayaran" |
| Diproses / Info | `nb-blue` | info | "Diproses" |
| Gagal / Error / Kedaluwarsa / Dicabut | `nb-pink` | silang | "Gagal", "Kedaluwarsa", "Dicabut" |
| Draf / Nonaktif | `nb-muted` | strip | "Draf", "Nonaktif" |
| Rekomendasi SAW | `nb-lavender` | bintang/urutan | "Peringkat 1" |

### 2.2 Garis, bayangan, sudut

| Token | Web | Mobile | Pemakaian |
|---|---|---|---|
| `border-thin` | 2px | 2dp | Tabel, divider, input di zona C |
| `border` | 3px | 2dp | Kartu, tombol, input (zona A/B web) |
| `border-thick` | 4px | 3dp | Pemisah seksi hero, dialog |
| `shadow-sm` | 3px 3px 0 0 #000 | 2dp 2dp | Badge, chip, input |
| `shadow` | 5px 5px 0 0 #000 | 4dp 4dp | Kartu, tombol |
| `shadow-lg` | 8px 8px 0 0 #000 | 6dp 6dp | Hover, bottom sheet, dialog, hero |
| `shadow-xl` | 12px 12px 0 0 #000 | 8dp 8dp | Hero zona A saja |
| `radius` | 0 | 0 | **Semua komponen** |

Pengecualian radius yang diizinkan: avatar bulat dan titik status (indikator, bukan komponen UI). Tidak ada kapsul/pill.

Mobile memakai garis dan bayangan sedikit lebih tipis dari web karena layar kecil; rasionya tetap konsisten.

### 2.3 Spasi dan ukuran

- Skala spasi (basis 4): `4, 8, 12, 16, 24, 32, 48, 64`.
- Padding kartu: 16 (mobile), 20–24 (web).
- Jarak antar kartu: minimal **16** agar bayangan tidak menempel ke elemen sebelahnya (bayangan 5px + napas visual).
- Target sentuh: **minimal 48×48dp** di mobile, **minimal 44×44px** di web (WCAG 2.5.8 mensyaratkan 24×24px; proyek ini lebih ketat). Ukuran visual border tidak dihitung sebagai area tekan.

### 2.4 Breakpoint web (`admin-web` & `pengunjung-web`)

| Nama | Lebar | Layout |
|---|---|---|
| `sm` | < 768px | Drawer tersembunyi, satu kolom, tabel menjadi kartu |
| `md` | 768–1023px | Sidebar ikon (admin) / 2–3 kolom katalog (pengunjung) |
| `lg` | 1024–1439px | Sidebar penuh 264px (admin) / 4 kolom katalog (pengunjung), konten maks 1200px |
| `xl` | ≥ 1440px | Sama; konten maks 1360px, terpusat |

---

## 3. Tipografi

Mengikuti pairing yang direkomendasikan referensi (tersedia di Google Fonts), dengan pemisahan peran: display lantang, isi tenang.

| Peran | Font | Bobot | Pemakaian |
|---|---|---|---|
| Display | **Syne** | 800 | Hero, splash, judul seksi zona A saja |
| Heading | **Space Grotesk** | 700 | Judul halaman, judul kartu, tombol, tab, navigasi |
| Body | **Inter** | 400 / 500 / 600 | Paragraf, deskripsi, isi tabel, input |
| Mono | **Space Mono** | 400 / 700 | Angka skor SAW, bobot, harga di tabel, kode pesanan, token |

Alasan peran angka: Space Mono memberi lebar angka seragam sehingga kolom skor, bobot, dan harga rata dan mudah dibandingkan; ini sekaligus mendukung kesan "struktur terbuka".

Skala tipografi (sentence case, bukan huruf kapital semua):

| Gaya | Mobile (sp) | Web (px) | Font / bobot | Line-height | Tracking |
|---|---|---|---|---|---|
| `display` | 36 | 64 | Syne 800 | 1.0 | −2% |
| `h1` | 28 | 40 | Space Grotesk 700 | 1.1 | −1% |
| `h2` | 22 | 28 | Space Grotesk 700 | 1.2 | 0 |
| `h3` | 18 | 20 | Space Grotesk 700 | 1.25 | 0 |
| `body-lg` | 17 | 18 | Inter 400 | 1.55 | 0 |
| `body` | 15 | 16 | Inter 400 | 1.55 | 0 |
| `body-sm` | 13 | 14 | Inter 400 | 1.5 | 0 |
| `label` | 13 | 14 | Space Grotesk 700 | 1.2 | 0 |
| `data` | 14 | 14 | Space Mono 400/700 | 1.4 | 0 |

Aturan:

- Panjang baris isi maksimal sekitar 70 karakter.
- Display dan h1 tidak dipakai di zona C.
- Tidak memakai gaya "satu kata di judul diberi warna berbeda" atau label kapital berjarak lebar di atas setiap judul; hierarki dibentuk oleh ukuran dan bobot.
- Ukuran teks menghormati pengaturan skala font sistem Android (uji hingga 200%); layout tidak boleh memotong teks.
- Fallback web: `'Inter', system-ui, sans-serif`; `'Space Grotesk', 'Inter', system-ui, sans-serif`; `'Space Mono', ui-monospace, monospace`. Muat font dengan `font-display: swap`.

---

## 4. Ikon, gambar, dan ilustrasi

- **Ikon:** garis tebal seragam (stroke 2px, ujung siku/`butt`), ukuran 20/24px. Disarankan Lucide (sudah umum di ekosistem React; di Flutter gunakan paket ikon setara atau SVG yang diekspor). Ikon selalu hitam; di atas fill gelap tidak ada karena palet tidak memiliki fill gelap selain hitam.
- **Cover e-book:** tampil apa adanya dari storage, dibingkai border + bayangan seperti sampul fisik. Rasio 2:3. Jika cover belum diunggah, tampilkan blok `nb-muted` dengan inisial judul dan teks "Cover belum diunggah" (ini keadaan nyata, bukan data palsu).
- **Ilustrasi:** bentuk geometris datar (kotak, lingkaran, garis) bergaya Memphis dengan border hitam; tanpa gradien, tanpa bayangan lembut. Dipakai pada splash, onboarding, dan empty state.
- **Pola latar (opsional, zona A):** grid garis hitam 1px opasitas penuh pada `paper` dengan sel 32px, atau titik halftone. Satu pola per halaman, tidak di belakang teks isi.

---

## 5. Komponen

Semua komponen: sudut 0, border sesuai zona, fill datar, bayangan sesuai tingkat. Status interaktif mengikuti pola fisik berikut.

**Pola tekan (berlaku untuk tombol, kartu yang dapat diklik, chip yang dapat dipilih):**

| State | Transformasi | Bayangan |
|---|---|---|
| Normal | — | `shadow` |
| Hover (web) | translate(−2px, −2px) | membesar 2px |
| Pressed | translate(+3px, +3px) | **hilang** |
| Focus-visible | — | cincin 3px `nb-focus`, offset 3px (tidak tertutup bayangan) |
| Disabled | — | tanpa bayangan, fill `nb-muted`, teks `nb-disabled-text`, border tetap |

Di mobile tidak ada hover; pressed saja. Durasi transisi 100ms, kurva linear/ease-out.

### 5.1 Tombol

| Varian | Fill | Pemakaian |
|---|---|---|
| Primer | `nb-yellow` | Satu aksi utama per layar ("Bayar", "Tambah ke keranjang", "Simpan") |
| Sekunder | `nb-white` | Aksi pendamping |
| Destruktif | `nb-pink` | Hapus, batalkan pesanan, cabut akses; selalu lewat dialog konfirmasi |
| Info/rekomendasi | `nb-lavender` | Hanya aksi terkait SAW ("Lihat perhitungan") |
| Ghost | transparan, tanpa border dan bayangan, teks bergaris bawah 2px | Aksi tersier; dipakai hemat |

Ukuran: tinggi 48 (mobile), 44 / 52 (web md / lg); padding horizontal 24; teks `label`. Tombol penuh lebar di mobile pada aksi utama bawah layar. Tombol dengan proses berjalan menampilkan indikator dan **tidak dapat ditekan ulang** (mencegah pesanan ganda).

### 5.2 Input dan form

- Tinggi 48; border `border-thin`/`border`; fill putih; bayangan `shadow-sm`.
- Label **di atas** field, `label`, tidak hanya placeholder.
- Fokus: cincin `nb-focus` + bayangan naik ke `shadow`.
- Error: border tetap hitam, fill `nb-pink` muda tidak dipakai; sebagai gantinya tampilkan pesan di bawah field dalam blok `nb-pink` berborder dengan ikon silang dan teks hitam. Contoh: "Kata sandi minimal 8 karakter."
- Bantuan (hint) berada di bawah field dalam `body-sm`.
- Checkbox/radio: kotak 24×24 (radio juga siku, ditandai isi persegi kecil, bukan lingkaran — pengecualian diperbolehkan hanya jika uji keterbacaan menunjukkan perlu), border 2–3px, terpilih = fill `nb-yellow` + ikon centang hitam.
- Switch: trek persegi panjang berborder, thumb persegi hitam; aktif = trek `nb-green` + teks "Aktif"/"Mati" di sebelahnya (tidak hanya warna).
- Select: border dan bayangan seperti input; daftar opsi tampil sebagai panel berborder dengan bayangan `shadow-lg`.
- Validasi dijalankan saat blur dan saat submit; kesalahan dari server (kode 400/409) dipetakan ke field terkait.

### 5.3 Kartu

- Standar: putih, border, `shadow`. Kartu yang dapat diklik mengikuti pola tekan; kartu statis tidak bergerak.
- Kartu berwarna: fill aksen untuk menonjolkan satu item (misal e-book pilihan), border dan bayangan tetap hitam.
- Maksimal satu kartu berfill aksen per layar zona B; di zona C kartu berfill hanya untuk peringatan/status.

### 5.4 Chip, badge, dan tag

- Chip: tinggi 32, border 2px, `shadow-sm`, teks `label`. Terpilih = fill `nb-yellow` + ikon centang; tidak terpilih = putih.
- Badge status: persegi panjang berborder, fill sesuai pemetaan status, **ikon + teks**.
- **Badge DATA SIMULASI**: fill `nb-orange`, border `border`, teks "DATA SIMULASI" (pengecualian: huruf kapital diizinkan karena ini label peringatan integritas), selalu terlihat tanpa interaksi (bagian 17).

### 5.5 Navigasi

**Mobile — bottom navigation:** 4 tujuan: Beranda, Katalog, Perpustakaan, Profil. Rekomendasi SAW dan Keranjang diakses dari Beranda dan app bar (ikon keranjang dengan badge jumlah). Tinggi 64; border atas `border-thick`; item aktif = blok `nb-yellow` berborder dengan ikon dan label; item tidak aktif = ikon + label tanpa fill. Label selalu tampil.

**Mobile — app bar:** tinggi 56, `nb-paper`, border bawah `border`; judul `h3`; tombol kembali berupa ikon persegi berborder.

**Web pengunjung (`pengunjung-web`) — navbar:** tinggi 64, `nb-paper`, border bawah `border-thick`; logo kerja di kiri, pencarian + tautan Katalog & Rekomendasi SAW di tengah, tombol primer `nb-yellow` "Masuk / Daftar" di kanan.

**Web admin (`admin-web`) — sidebar:** lebar 264px, fill putih, border kanan `border-thick`. Grup: Dashboard · Katalog (E-book, Kategori) · Transaksi (Pesanan, Pembayaran, Transaksi) · Rekomendasi SAW (Kriteria dan bobot, Audit hasil SAW) · Pengguna & Akses (Pelanggan, Hak Akses E-Book) · Laporan. Item aktif = blok `nb-yellow` berborder dengan bayangan `shadow-sm`; judul grup `label` tanpa kapital berjarak.

**Web admin — top bar:** tinggi 64, breadcrumb di kiri, menu akun di kanan. Breadcrumb: teks `body-sm`, pemisah garis miring, halaman saat ini tebal.

**Tab dalam halaman:** tombol persegi berderet; aktif = fill `nb-yellow`, border bawah menyatu dengan panel konten; konten panel berborder.

### 5.6 Tabel (web, zona C)

- Border luar `border-thin`, **tanpa bayangan pada baris**; bayangan hanya pada kontainer tabel jika berdiri sendiri.
- Header: fill `nb-yellow`, teks `label`, border bawah `border`.
- Baris: putih, selang-seling `nb-muted`; garis pemisah 2px; baris yang di-hover diberi garis bawah tebal 3px (tanpa tambahan warna).
- Angka (harga, skor, bobot) rata kanan, Space Mono.
- Kolom aksi: ikon berlabel tooltip; aksi destruktif selalu dengan dialog konfirmasi.
- Paginasi: tombol persegi bernomor, halaman aktif `nb-yellow`; selalu tampilkan total data.
- Di bawah `md`, baris menjadi kartu bertumpuk dengan pasangan label-nilai.
- Seluruh tabel mendukung: pencarian, filter, pengurutan kolom (ikon + `aria-sort`), loading skeleton, empty state, error state dengan tombol "Coba lagi".

### 5.7 Dialog, bottom sheet, toast

- **Dialog (web):** panel putih, `border-thick`, `shadow-xl`, scrim hitam 60% (satu-satunya elemen berpersentase transparansi; ini scrim, bukan bayangan lembut). Fokus terkunci di dalam dialog, `Esc` menutup, fokus kembali ke pemicu.
- **Dialog konfirmasi tindakan berisiko:** judul menyebut objeknya ("Arsipkan e-book 'Judul'?" / "Cabut akses e-book?"), isi menyebut dampak ("Pesanan lama tetap tersimpan"), dua tombol: "Batal" (sekunder) dan tombol destruktif dengan kata kerja yang sama ("Arsipkan e-book" / "Cabut akses").
- **Bottom sheet (mobile):** border atas `border-thick`, pegangan berupa batang hitam 40×6. Dapat ditutup dengan geser ke bawah dan tombol "Tutup".
- **Toast/Snackbar:** blok berfill status, border, `shadow`, ikon + teks, muncul di bawah (mobile, di atas bottom nav) atau kanan atas (web); hilang otomatis setelah 5 detik; toast error tetap sampai ditutup. Dibacakan screen reader (`role="status"` / `liveRegion`).
- **Banner peringatan inline:** blok berfill status di atas konten (misal mode simulasi, koneksi terputus, atau tautan baca kedaluwarsa).

### 5.8 Umpan balik status

- **Loading:** skeleton berupa blok `nb-muted` berborder 2px (tanpa shimmer lembut; boleh berkedip sederhana 1s). Tombol memuat menampilkan indikator persegi berputar.
- **Progress:** batang persegi berborder dengan isi `nb-yellow`; teks persentase atau langkah ("Langkah 2 dari 3").
- **Empty state:** ilustrasi geometris kecil + satu kalimat penjelas + satu tombol tindakan (bagian 7).
- **Error state:** apa yang salah + cara memperbaiki + tombol "Coba lagi". Tanpa permintaan maaf, tanpa jargon teknis, tanpa stack trace.

### 5.9 Komponen domain & penguat aktor

#### Komponen Umum Domain
- **EbookCard:** cover berbingkai di kiri (list) atau atas (grid), judul `h3` maksimal 2 baris, penulis `body-sm`, harga Space Mono tebal, rating bintang persegi + angka, chip kategori. Seluruh kartu dapat diklik.
- **RatingStars:** lima kotak persegi; terisi = `nb-yellow`, kosong = putih; selalu disertai angka ("4,6"). Jika e-book belum punya rating tampil "Belum ada rating", bukan nol bintang.
- **PriceTag:** blok persegi berfill `nb-yellow` berisi harga "Rp 45.000"; format rupiah dengan pemisah titik.
- **OrderStatusBadge** dan **PaymentStatusBadge:** badge status (bagian 2.1).
- **RankBadge:** blok persegi `nb-lavender` bernomor peringkat besar (Space Mono 700).
- **ScoreBar:** batang bersegmen per kriteria (bagian 11).
- **SimulationBadge / SimulationModeBanner:** bagian 5.4 & 17.
- **Stepper checkout:** tiga kotak bernomor berhubung garis tebal; langkah aktif `nb-yellow`, selesai `nb-green` dengan centang, berikutnya putih.

#### Komponen Penguat Aktor Pengunjung Publik (`pengunjung-web`)
- **PublicNavbar:** navigasi atas responsif dengan pencarian cepat, tautan Katalog, Rekomendasi SAW, dan CTA `nb-yellow` "Masuk / Daftar".
- **AuthGateDialog:** dialog berborder `border-thick` saat pengunjung mengklik "Beli" atau "Baca", mengarahkan ke halaman masuk/daftar atau aplikasi mobile dengan penjelasan jelas.
- **SawPublicShowcase:** panel berfill `nb-lavender`/putih pada beranda web pengunjung yang menampilkan peringkat SAW default dari backend lengkap dengan `ScoreBar` dan drawer **"Cara skor dihitung"**.
- **ResponsiveCatalogGrid:** grid katalog 1–4 kolom adaptif dengan jarak antar kartu minimal `16px`.

#### Komponen Penguat Aktor Pelanggan (`mobile/ebook_store`)
- **InAppPdfReaderToolbar:** bilah kontrol pembaca PDF di dalam aplikasi (Zona C: latar `nb-paper`/`nb-white`, `border-thin`, nomor halaman `Space Mono`, navigasi halaman, zoom) **tanpa** opsi unduh/ekspor bebas ke penyimpanan perangkat.
- **SignedUrlRecoveryBanner:** banner/aksi inline di dalam reader atau perpustakaan ketika *signed URL* berumur pendek (300 detik) kedaluwarsa, berisi tombol **"Muat Ulang Tautan Baca"** untuk meminta *signed URL* baru dari backend.
- **DuplicateOwnershipGuard:** pengaman di layar Detail E-Book; apabila backend menyatakan Pelanggan sudah memiliki `EbookAccess` aktif, CTA primer berubah dari "Tambah ke keranjang" menjadi **"Buka di perpustakaan"**.
- **PaymentGatewayPendingCard:** kartu status pembayaran setelah kembali dari payment gateway, menampilkan `PaymentStatusBadge` dan tombol **"Periksa status pembayaran"** ke backend (klien tidak pernah mengubah status menjadi lunas secara lokal).
- **ActiveFilterChipRow:** baris chip filter aktif yang dapat dihapus satu per satu dengan area tekan minimal `48×48dp`.

#### Komponen Penguat Aktor Admin (`web/admin-web`)
- **PrivateAssetUploader:** pemisahan tegas antara unggah **Sampul (Publik)** dan **File PDF E-Book (Bucket Privat)**; dilengkapi badge gembok + label **"Bucket Privat — Akses via Signed URL"**, validasi tipe/ukuran file, progress bar `nb-yellow`, tanpa tautan unduh publik PDF.
- **EbookAccessControlPanel:** panel kelola `EbookAccess` pada detail Pelanggan/Pesanan dengan `AccessStatusBadge` ("Aktif" `nb-green` / "Dicabut" `nb-pink`) dan tombol **"Cabut akses"** / **"Pulihkan akses"** melalui `ConfirmDangerDialog`.
- **SawLiveMatrixAuditor:** tabel audit SAW dari backend yang menampilkan nilai asli ($x_{ij}$), $\max/\min$, normalisasi ($r_{ij}$), kontribusi berbobot, serta penanda *edge case* (mis. e-book tanpa rating) dalam `Space Mono` rata kanan.
- **OrderWebhookTimeline:** garis waktu kronologis berborder siku pada detail pesanan untuk memantau transisi `OrderStatus`, `PaymentStatus`, dan referensi webhook payment gateway.

---

## 6. Layout dan komposisi

- **Struktur disruptif terkendali:** pada hero dan tumpukan kartu zona A boleh ada offset 8–16px, rotasi hingga 2°, dan tumpang tindih sebagian; alur baca dan urutan fokus keyboard tetap mengikuti urutan DOM/semantik.
- **Mobile:** satu kolom, margin 16, grid 4 kolom; katalog 2 kolom pada lebar ≥ 360dp (kartu grid) dengan opsi ganti ke daftar.
- **Web (`admin-web` & `pengunjung-web`):** grid 12 kolom, gutter 24; kartu ringkasan dashboard admin 4 per baris di `lg`.
- Rata kiri untuk teks isi; pusat hanya untuk splash, empty state, dan hero tertentu.
- Beri ruang minimal 24 antar seksi di zona C agar kepadatan data tetap terbaca.

---

## 7. Konten dan gaya bahasa

- Sentence case; kata kerja aktif; bahasa Indonesia baku yang santai, bukan kaku.
- Nama aksi konsisten sepanjang alur: tombol "Simpan e-book" menghasilkan toast "E-book disimpan".
- Gunakan istilah pengguna, bukan istilah sistem: "Pesanan", bukan "Order record"; "Perpustakaanmu", bukan "Entitas akses".
- Error menyebut penyebab dan solusi: "Email sudah terdaftar. Masuk atau gunakan email lain."
- Empty state mengajak bertindak: "Perpustakaanmu masih kosong. Jelajahi katalog untuk menemukan buku pertamamu."
- Tidak memakai tanda panah "→" otomatis di setiap tautan, tidak memakai pemisah titik tengah berlebihan, tidak menambahkan label kecil di atas setiap judul.
- Teks rekomendasi harus jujur: "Peringkat ini hasil perhitungan SAW dari kriteria dan bobot yang ditetapkan admin", bukan "Pilihan terbaik untukmu".

---

## 8. Spesifikasi layar aplikasi mobile (Flutter — `ebook_store`)

Rute mengikuti folder `features/` pada dokumentasi proyek. Setiap layar memiliki state: loading, empty, error, dan data.

### 8.1 Splash dan onboarding — Zona A
- Splash: latar `nb-yellow`, nama aplikasi (Syne 800) dalam blok putih berbayangan `shadow-xl`, indikator pemuatan persegi. Nama dan logo final menunggu keputusan tim (bagian 19); gunakan teks nama kerja.
- Onboarding (maks 3 layar, dapat dilewati): satu pesan per layar — telusuri katalog, bayar dan baca di aplikasi, rekomendasi transparan. Tombol "Lewati" dan "Lanjut".

### 8.2 Login dan registrasi — Zona A (judul) + C (form)
```text
┌──────────────────────────┐
│ [blok kuning, miring 1°] │
│  Masuk                   │  ← display kecil
├──────────────────────────┤
│ Email                    │
│ [__________________]     │
│ Kata sandi         [👁]  │
│ [__________________]     │
│ [   Masuk (primer)   ]   │
│ Belum punya akun? Daftar │
└──────────────────────────┘
```
- Tombol tampil/sembunyikan kata sandi dengan label aksesibilitas.
- Pesan gagal login generik ("Email atau kata sandi salah") tanpa membocorkan akun mana yang ada.
- Registrasi: nama, email, kata sandi (indikator kekuatan: batang bersegmen + teks).

### 8.3 Beranda — Zona A/B
```text
┌──────────────────────────┐
│ Halo, [nama]     [🛒 2]  │
│ ┌──────────────────────┐ │
│ │ Cari judul, penulis… │ │
│ └──────────────────────┘ │
│ ┌ hero kuning ─────────┐ │
│ │ Bingung pilih buku?  │ │
│ │ [Lihat rekomendasi]  │ │ ← lavender
│ └──────────────────────┘ │
│ Kategori  [Chip][Chip]…  │ ← geser horizontal
│ Terbaru                  │
│ [kartu][kartu]           │
│ Terlaris                 │
│ [kartu][kartu]           │
├──────────────────────────┤
│ Beranda Katalog Pustaka Profil │
└──────────────────────────┘
```
- Seksi "Terbaru" dan "Terlaris" hanya tampil jika backend menyediakan datanya; tidak ada seksi bawaan berisi data palsu.
- Hero adalah satu-satunya elemen ekspresif utama.

### 8.4 Katalog dan pencarian — Zona B
- Kolom pencarian tetap di atas; tombol "Filter" membuka bottom sheet (kategori, penulis, rentang harga, rating minimum) dan "Urutkan" (terbaru, harga, rating).
- Filter aktif tampil sebagai `ActiveFilterChipRow` yang dapat dihapus di bawah pencarian.
- Pagination: gulir tak terbatas dengan indikator "Memuat…" dan penutup "Semua e-book sudah tampil"; kesalahan pada halaman berikutnya menampilkan tombol "Muat ulang".
- Empty hasil: "Tidak ada e-book yang cocok. Ubah kata kunci atau hapus filter." + tombol "Hapus filter".

### 8.5 Detail e-book — Zona B
```text
┌──────────────────────────┐
│ ← Detail                 │
│  [cover besar berbingkai]│
│  Judul (h1)              │
│  Penulis · Kategori      │
│  ★★★★☆ 4,2  (n ulasan)   │ ← hanya jika fitur ulasan berlaku
│  [Rp 45.000]             │
│  Deskripsi (body)        │
│  Informasi: halaman, tahun terbit │
├──────────────────────────┤
│ [Tambah ke keranjang]    │ ← bar bawah lengket, primer
└──────────────────────────┘
```
- Menggunakan `DuplicateOwnershipGuard`: jika sudah memiliki `EbookAccess` aktif, tombol berubah menjadi "Buka di perpustakaan".
- Informasi yang tampil hanya yang ada di basis data; bidang kosong disembunyikan.

### 8.6 Keranjang — Zona C
- Daftar item (cover kecil, judul, harga, tombol hapus). Produk digital: tanpa penghitung jumlah kecuali ada kebutuhan bisnis.
- Ringkasan di bawah: subtotal, total (dihitung server; klien hanya menampilkan). Tombol primer "Lanjut ke checkout".
- Item yang berubah harga atau tidak lagi tersedia diberi banner "Harga berubah. Periksa kembali sebelum membayar."

### 8.7 Checkout & Pembayaran — Zona C
- Stepper: Tinjau → Bayar → Selesai.
- **Mode gateway nyata:** ringkasan pesanan (dihitung backend), inisiasi pembayaran ke payment gateway resmi, serta `PaymentGatewayPendingCard` untuk memantau status verifikasi webhook dari backend.
- **Mode simulasi (bila diaktifkan untuk pengujian):** banner `nb-orange` tetap di atas: "MODE SIMULASI — tidak ada uang yang dipindahkan." Tombol bayar: "Bayar (simulasi)".
- Tombol bayar dinonaktifkan selama proses; status akhir ditentukan oleh respons backend, bukan klien.

### 8.8 Riwayat pesanan — Zona C
- Kartu pesanan: nomor pesanan (Space Mono), tanggal, total, `OrderStatusBadge`/`PaymentStatusBadge`.
- Detail pesanan: daftar item dengan harga saat transaksi (snapshot), status, tombol "Buka di perpustakaan" hanya jika `EbookAccess` aktif sudah diberikan server.
- Pesanan tertunda: tampilkan batas waktu bila ada dan tombol "Lanjutkan pembayaran".

### 8.9 Perpustakaan digital & Reader — Zona B (rak) / Zona C (reader)
- Grid cover; kartu menampilkan status akses ("Aktif" / "Dicabut"). Tombol utama: **"Baca"** (in-app PDF reader, sesuai keputusan proyek).
- Tautan akses sementara (*signed URL* berumur pendek) diminta dari backend saat tombol ditekan.
- Di dalam reader (`InAppPdfReaderToolbar`), jika *signed URL* kedaluwarsa, tampilkan `SignedUrlRecoveryBanner` dengan tombol **"Muat ulang tautan baca"**. Jika akses dicabut (`isRevoked = true`), tampilkan pesan penolakan akses dari backend tanpa membuka file.
- Empty: "Perpustakaanmu masih kosong" + tombol "Jelajahi katalog".

### 8.10 Rekomendasi SAW — Zona B, aksen lavender
Lihat bagian 11 untuk detail transparansi.
- Layar daftar: filter kategori + preferensi sesuai kontrak API; tombol "Hitung rekomendasi".
- Hasil: kartu berperingkat dengan `RankBadge`, skor (Space Mono, 3 desimal), `ScoreBar`.
- Ketuk kartu → bottom sheet/layar "Cara skor dihitung".
- Jika data tidak lengkap untuk kriteria aktif: tampilkan penjelasan, bukan peringkat menyesatkan.

### 8.11 Profil — Zona B/C
- Nama, email, tombol "Ubah profil", "Keluar". Aksi "Keluar" memakai dialog konfirmasi ringan.
- Bagian "Tentang aplikasi" menyatakan versi dan, bila relevan, mode data simulasi.

### 8.12 State global mobile
- Tanpa koneksi: banner `nb-orange` "Tidak ada koneksi internet" + tombol "Coba lagi".
- Sesi berakhir: dialog "Sesimu berakhir. Masuk lagi untuk melanjutkan."
- Akses ditolak (403): layar "Kamu tidak punya akses ke halaman ini."

---

## 9. Spesifikasi halaman portal pengunjung web (`web/pengunjung-web`)

Portal web publik untuk aktor **Pengunjung Publik** dan **Pelanggan** (read-only katalog, detail, dan showcase rekomendasi SAW; transaksi dan baca penuh diarahkan sesuai otorisasi backend).

### 9.1 Beranda & Hero Pengunjung — Zona A/B
- Menggunakan `PublicNavbar` di bagian atas.
- Hero Zona A dengan judul `display`, ringkasan nilai toko buku digital, dan `SawPublicShowcase` beraksen `nb-lavender`.
- Seksi kategori (`Chip` horizontal) dan `ResponsiveCatalogGrid` untuk daftar e-book aktif (`isActive = true`).

### 9.2 Katalog, Pencarian & Detail E-Book Web — Zona B
- Filter kategori, pencarian judul/penulis, dan paginasi terstruktur.
- Halaman detail e-book menampilkan cover, metadata, harga (`PriceTag`), dan tombol aksi yang memicu `AuthGateDialog` jika pengguna belum login.

### 9.3 Halaman Rekomendasi SAW Web — Zona B, aksen lavender
- Menampilkan peringkat e-book hasil perhitungan backend dengan `RankBadge`, `ScoreBar`, dan drawer/modal **"Cara skor dihitung"**.
- Jika data berasal dari seed pengujian, `SimulationModeBanner` wajib tampil di bagian atas.

---

## 10. Spesifikasi halaman dashboard admin (`web/admin-web`)

Prasyarat keamanan UI: menyembunyikan menu bukan otorisasi; backend wajib memeriksa token dan peran (`ADMIN`). UI hanya menampilkan kontrol yang benar-benar berfungsi.

### 10.1 Kerangka halaman
```text
┌────────┬─────────────────────────────────────────┐
│ Logo   │ Katalog / E-book            [Akun ▾]    │ ← top bar
│ ────── ├─────────────────────────────────────────┤
│ Dash…  │ Judul halaman (h1)        [+ Tambah e-book] │
│ Katalog│ [Cari…] [Kategori ▾] [Status ▾]         │
│  E-book│ ┌─────────────────────────────────────┐ │
│  Kateg.│ │ tabel                                │ │
│ Transaksi│└────────────────────────────────────┘ │
│  Pesan.│  Menampilkan 1–10 dari 120  [‹ 1 2 3 ›] │
└────────┴─────────────────────────────────────────┘
```

### 10.2 Login admin — Zona A/C
Hanya untuk akun berperan `ADMIN`; registrasi publik tidak membuat admin. Pesan error generik. Setelah login sukses, arahkan ke Dashboard.

### 10.3 Dashboard — Zona B/C
- Kartu ringkasan: jumlah e-book, pelanggan, pesanan, pendapatan periode — **semua angka dari endpoint nyata**; saat memuat tampil skeleton, saat gagal tampil "Data belum bisa dimuat" + "Coba lagi". Tidak ada angka bawaan.
- Filter periode (7 hari, 30 hari, kustom).
- Tabel "Pesanan terbaru" dan ringkasan status pembayaran.
- Satu kartu `nb-lavender` untuk ringkasan proses SAW terakhir bila tersedia.

### 10.4 E-book (daftar dan formulir) — Zona C
- Daftar: kolom cover kecil, judul, penulis, kategori, harga, status (Aktif/Arsip), aksi (ubah, arsipkan).
- Formulir (halaman penuh): metadata (judul, deskripsi, harga, kategori, penulis, status aktif), serta `PrivateAssetUploader` yang memisahkan unggah **Sampul (Publik)** dan **PDF E-Book (Bucket Privat)**.
- Simpan: tombol primer di bar bawah lengket; "Batal" sekunder; peringatan jika meninggalkan halaman dengan perubahan belum disimpan.
- Hapus: diganti "Arsipkan" (`isActive = false`) bila e-book sudah memiliki riwayat pesanan agar `EbookAccess` pemilik lama tetap terjaga.

### 10.5 Kategori — Zona C
Tabel + dialog tambah/ubah (form pendek). Hapus dengan konfirmasi; jika masih dipakai e-book, tampilkan pesan "Kategori masih dipakai oleh n e-book" (respons 409 dari backend).

### 10.6 Pesanan, pembayaran, dan transaksi — Zona C
- Daftar dengan filter status, periode, pencarian nomor pesanan.
- Detail: header pesanan, item (harga snapshot), `OrderWebhookTimeline`, data pembayaran (penyedia, referensi webhook, status).
- Tidak ada tombol ubah status lunas manual jika aturan backend hanya mengizinkan pelunasan melalui webhook terverifikasi.

### 10.7 Pelanggan dan Kelola `EbookAccess` — Zona C
- Tabel pelanggan (nama, email, peran, tanggal daftar) tanpa menampilkan hash/kata sandi.
- Detail pelanggan memuat `EbookAccessControlPanel` untuk melihat daftar e-book yang dimiliki serta mencabut/memulihkan `isRevoked` melalui `ConfirmDangerDialog`.

### 10.8 Kriteria, bobot, dan audit SAW — Zona C, aksen lavender
- Tabel kriteria: kode, nama, jenis (Benefit/Cost, badge dengan ikon panah naik/turun), bobot, status aktif.
- **Penjumlah bobot langsung:** panel `nb-white` berborder: "Total bobot: 1,00" dengan ikon centang hijau bila valid, atau "Total bobot: 0,95 — harus 1,00" dengan blok `nb-pink` bila tidak. Tombol "Simpan" nonaktif saat tidak valid; validasi tetap diulang di backend.
- **Audit SAW (`SawLiveMatrixAuditor`):** menampilkan nilai asli, $\max/\min$, normalisasi, kontribusi berbobot, skor, dan peringkat langsung dari backend.
- Bobot awal mengacu pada konfigurasi backend; UI tidak menanam bobot secara statis.

### 10.9 Laporan — Zona C
Filter periode dan status, tabel + ringkasan penjualan. Tombol ekspor hanya muncul jika endpoint ekspor sudah diimplementasikan.

### 10.10 State global web
Sesi berakhir → dialog masuk ulang; 403 → halaman "Akses ditolak"; 404 → halaman "Halaman tidak ditemukan" dengan tombol ke Dashboard; jaringan putus → banner.

---

## 11. UX transparansi SAW

Tujuan: pengguna memahami **mengapa** sebuah e-book berperingkat tertentu.

### 11.1 Daftar hasil (mobile & web pengunjung)
```text
┌──────────────────────────────┐
│ [ 1 ] Judul E-book           │
│       Rp 45.000   Skor 0,925 │
│ ┌────────┬─────┬────┬──┐     │
│ │ C1     │ C2  │ C3 │C4│     │ ← ScoreBar bersegmen
│ └────────┴─────┴────┴──┘     │
│ [Lihat perhitungan]          │
└──────────────────────────────┘
```
- `ScoreBar`: panjang total = skor (skala 0–1); tiap segmen = kontribusi berbobot satu kriteria; segmen dipisahkan border 2px, diberi pola arsir berbeda per kriteria **dan** kode (C1–C4/C5), supaya tidak hanya bergantung warna; semua segmen berfill lavender/putih dengan arsir.

### 11.2 Layar "Cara skor dihitung"
Tabel per e-book (data dari respons backend):

| Kriteria | Jenis | Bobot | Nilai asli | Nilai normalisasi | Kontribusi |
|---|---|---|---|---|---|
| C1 … | Benefit | … | … | … | … |
| **Skor akhir** | | | | | **…** |

- Di bawah tabel, rumus ringkas dengan bahasa awam: "Benefit: nilai ÷ nilai tertinggi. Cost: nilai terendah ÷ nilai. Skor = jumlah (bobot × nilai normalisasi)."
- Metadata: waktu perhitungan, identitas/versi konfigurasi, jumlah e-book dibandingkan.
- Catatan jujur: "Rekomendasi adalah hasil model dari kriteria dan bobot yang ditetapkan, bukan jaminan buku ini terbaik untuk semua orang."
- Mobile: tabel dapat digulir horizontal di dalam kontainernya; tiap baris juga bisa dibuka sebagai kartu.

### 11.3 Aturan
- Klien **tidak menghitung** skor; hanya menampilkan angka dari backend.
- Preferensi pengguna bekerja sebagai filter alternatif; apakah pelanggan dapat mengubah bobot adalah keputusan terbuka (bagian 19) — UI tidak menyediakan penggeser bobot untuk pelanggan sebelum ada keputusan final.
- E-book tanpa rating mengikuti kebijakan backend dan ditandai "Belum ada rating" serta penjelasan perlakuannya, bukan nilai nol diam-diam.
- Jika data tidak memadai, tampilkan alasan dan tindakan ("Belum semua e-book memiliki nilai kriteria. Hubungi admin.").
- Jika respons backend menandai data sebagai simulasi, tampilkan **SimulationBadge** di atas hasil.

---

## 12. Aksesibilitas

Standar: **WCAG 2.2 AA**.

| Kriteria | Penerapan |
|---|---|
| 1.4.3 Kontras teks | Teks hitam pada fill terang; verifikasi setiap kombinasi baru dengan alat kontras (≥ 4,5:1; ≥ 3:1 untuk teks besar) |
| 1.4.11 Kontras non-teks | Border hitam 2–3px; cincin fokus `nb-focus` ≥ 3:1 terhadap latar |
| 1.4.1 Penggunaan warna | Status selalu ikon + teks; `ScoreBar` memakai arsir + kode |
| 2.4.7 / 2.4.11 Fokus terlihat dan tidak tertutup | Cincin fokus dengan offset 3px; bayangan dekoratif tidak boleh menutupinya; elemen lengket tidak menutupi elemen terfokus |
| 2.5.8 Ukuran target | ≥ 44px web, ≥ 48dp mobile; area tekan mencakup border |
| 1.4.4 Ubah ukuran teks | Uji hingga 200% (web) dan skala font terbesar Android |
| 2.1.1 Keyboard | Seluruh fungsi web dapat dioperasikan keyboard; urutan tab = urutan visual logis meski ada offset dekoratif |
| 4.1.2 Nama, peran, nilai | Label aksesibilitas pada ikon-tombol; `aria-*` pada tab, dialog, tabel yang dapat diurutkan; `Semantics` di Flutter |
| 1.4.12 Spasi teks | Layout tidak rusak saat spasi baris/huruf diperbesar |
| Motion | Hormati `prefers-reduced-motion` (web) dan `MediaQuery.disableAnimations` (Flutter) |

Tambahan: rotasi dekoratif tidak boleh dipakai pada teks isi atau kontrol; bayangan keras tidak menggantikan indikator status; uji dengan TalkBack di Android.

---

## 13. Motion

Prinsip: gerak menjawab tindakan pengguna; gerak otomatis hemat.

- Tekan/lepas tombol dan kartu: 100–150ms, translate + bayangan (bagian 5).
- Buka dialog/sheet: muncul dengan translate 8px + fade 150ms; tutup lebih cepat.
- Toast: masuk dari tepi, 150ms.
- Satu momen terorkestrasi pada splash/hero (kartu "jatuh" dan mengunci ke posisi, maks 500ms), sekali per sesi.
- Tidak ada animasi masuk berulang di setiap seksi, tidak ada paralaks, tidak ada animasi pada tabel.
- Reduced motion: ganti semua transformasi dengan perubahan instan.

---

## 14. Implementasi Flutter

Paket yang disarankan: `google_fonts` (Syne, Space Grotesk, Inter, Space Mono), Riverpod untuk state, Dio untuk jaringan sesuai dokumentasi proyek. Letakkan token di `lib/core/theme/` dan komponen di `lib/core/widgets/` (komponen lintas fitur) atau `lib/shared/widgets/`.

```dart
// lib/core/theme/nb_tokens.dart
import 'package:flutter/material.dart';

class NbColors {
  static const black = Color(0xFF000000);
  static const paper = Color(0xFFFFFDF5);
  static const white = Color(0xFFFFFFFF);
  static const yellow = Color(0xFFFFD23F);
  static const pink = Color(0xFFFF6B6B);
  static const blue = Color(0xFF74B9FF);
  static const green = Color(0xFF88D498);
  static const orange = Color(0xFFFFA552);
  static const lavender = Color(0xFFB8A9FA);
  static const muted = Color(0xFFE8E4D8);
  static const textMuted = Color(0xFF3D3D3D);
  static const disabledText = Color(0xFF5A5A5A);
  static const focus = Color(0xFF1D4ED8);
}

class NbShape {
  static const borderWidth = 2.0;      // mobile
  static const borderThick = 3.0;
  static const shadowSm = Offset(2, 2);
  static const shadow = Offset(4, 4);
  static const shadowLg = Offset(6, 6);
}
```

```dart
// lib/core/widgets/nb_pressable.dart
import 'package:flutter/material.dart';
import '../theme/nb_tokens.dart';

/// Kotak neubrutalism yang bisa ditekan: border + bayangan keras (blur 0),
/// bergeser ke arah bayangan saat ditekan.
class NbPressable extends StatefulWidget {
  const NbPressable({
    super.key,
    required this.child,
    required this.onPressed, // null = nonaktif
    this.color = NbColors.white,
    this.semanticLabel,
    this.padding = const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
  });

  final Widget child;
  final VoidCallback? onPressed;
  final Color color;
  final String? semanticLabel;
  final EdgeInsets padding;

  @override
  State<NbPressable> createState() => _NbPressableState();
}

class _NbPressableState extends State<NbPressable> {
  bool _down = false;

  @override
  Widget build(BuildContext context) {
    final enabled = widget.onPressed != null;
    final reduce = MediaQuery.of(context).disableAnimations;
    final offset = NbShape.shadow;
    final move = _down && enabled ? offset : Offset.zero;

    return Semantics(
      button: true,
      enabled: enabled,
      label: widget.semanticLabel,
      child: GestureDetector(
        onTapDown: enabled ? (_) => setState(() => _down = true) : null,
        onTapCancel: () => setState(() => _down = false),
        onTapUp: (_) => setState(() => _down = false),
        onTap: widget.onPressed,
        child: AnimatedContainer(
          duration: reduce ? Duration.zero : const Duration(milliseconds: 100),
          constraints: const BoxConstraints(minHeight: 48, minWidth: 48),
          transform: Matrix4.translationValues(move.dx, move.dy, 0),
          padding: widget.padding,
          decoration: BoxDecoration(
            color: enabled ? widget.color : NbColors.muted,
            border: Border.all(
                color: NbColors.black, width: NbShape.borderWidth),
            // Sudut siku (tanpa borderRadius) dan blur 0.
            boxShadow: _down || !enabled
                ? const []
                : const [
                    BoxShadow(
                        color: NbColors.black,
                        offset: NbShape.shadow,
                        blurRadius: 0),
                  ],
          ),
          child: DefaultTextStyle.merge(
            style: TextStyle(
              color: enabled ? NbColors.black : NbColors.disabledText,
              fontWeight: FontWeight.w700,
            ),
            child: Center(child: widget.child),
          ),
        ),
      ),
    );
  }
}
```

Pedoman Flutter:
- `ThemeData(useMaterial3: true)` boleh dipertahankan sebagai fondasi perilaku, tetapi **semua** `shape` komponen Material diganti `RoundedRectangleBorder()` tanpa radius, elevation 0, dan warna dari `NbColors`; hindari `Card`/`ElevatedButton` bawaan tanpa penyesuaian.
- `ColorScheme` dipetakan: `primary = yellow`, `onPrimary = black`, `error = pink`, `surface = paper`, `onSurface = black`.
- Fokus untuk pengguna keyboard/TalkBack: gunakan `FocusableActionDetector` atau `Focus` + dekorasi cincin `NbColors.focus` pada `NbPressable` jika perangkat memakai navigasi fokus.
- Uji widget (golden test) untuk: tombol normal/pressed/disabled, kartu e-book, badge status, `ScoreBar`.

---

## 15. Implementasi React + Tailwind (`admin-web` & `pengunjung-web`)

Opsi komponen: bangun komponen sendiri di `src/components/ui/` mengikuti token ini, atau jadikan pustaka shadcn/ui bergaya neubrutalism (seperti yang dirujuk neubrutalism.com, yaitu neobrutalism.dev) sebagai titik awal. Jika memakai pustaka pihak ketiga, **periksa lisensi, versi, dan kecocokan dengan token proyek** sebelum menambahkannya sebagai dependensi.

```css
/* src/styles/tokens.css */
:root {
  --nb-black: #000;
  --nb-paper: #FFFDF5;
  --nb-white: #FFF;
  --nb-yellow: #FFD23F;
  --nb-pink: #FF6B6B;
  --nb-blue: #74B9FF;
  --nb-green: #88D498;
  --nb-orange: #FFA552;
  --nb-lavender: #B8A9FA;
  --nb-muted: #E8E4D8;
  --nb-focus: #1D4ED8;

  --nb-border: 3px solid var(--nb-black);
  --nb-border-thin: 2px solid var(--nb-black);
  --nb-border-thick: 4px solid var(--nb-black);

  --nb-shadow-sm: 3px 3px 0 0 #000;
  --nb-shadow: 5px 5px 0 0 #000;
  --nb-shadow-lg: 8px 8px 0 0 #000;
  --nb-shadow-xl: 12px 12px 0 0 #000;
  --nb-radius: 0;
}

body { background: var(--nb-paper); color: var(--nb-black); font-family: 'Inter', system-ui, sans-serif; }
```

```ts
// tailwind.config.ts (potongan)
export default {
  theme: {
    extend: {
      colors: {
        nb: {
          black: '#000', paper: '#FFFDF5', white: '#FFF',
          yellow: '#FFD23F', pink: '#FF6B6B', blue: '#74B9FF',
          green: '#88D498', orange: '#FFA552', lavender: '#B8A9FA',
          muted: '#E8E4D8', focus: '#1D4ED8',
        },
      },
      borderWidth: { nb: '3px', 'nb-thin': '2px', 'nb-thick': '4px' },
      boxShadow: {
        'nb-sm': '3px 3px 0 0 #000', nb: '5px 5px 0 0 #000',
        'nb-lg': '8px 8px 0 0 #000', 'nb-xl': '12px 12px 0 0 #000',
      },
      borderRadius: { DEFAULT: '0', none: '0' },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        heading: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
}
```

```tsx
// src/components/ui/Button.tsx (inti pola tekan)
const base =
  'inline-flex items-center justify-center min-h-[44px] px-6 font-heading font-bold ' +
  'border-nb border-black rounded-none shadow-nb transition-[transform,box-shadow] duration-100 ' +
  'hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#000] ' +
  'active:translate-x-[3px] active:translate-y-[3px] active:shadow-none ' +
  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-nb-focus ' +
  'disabled:bg-nb-muted disabled:text-[#5A5A5A] disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0 ' +
  'motion-reduce:transition-none motion-reduce:transform-none';
```

Pedoman React:
- Semua komponen dibungkus di `src/components/ui/`; fitur memakai komponen itu, tidak menulis ulang gaya.
- Elemen interaktif memakai elemen semantik (`button`, `a`, `label`) bukan `div` berklik.
- Tabel: `<table>` semantik dengan `scope`, `aria-sort`, `caption` tersembunyi secara visual.
- Uji: validasi form, tabel (pencarian, paginasi), dialog konfirmasi (fokus terkunci), dan state akses ditolak.
- Variabel `VITE_*` hanya untuk konfigurasi publik; tidak ada secret.

---

## 16. Pemetaan ke Figma

File Figma proyek: `aa6O8Lp1ElIPkOsflZby58`.

- **Variable collections:** `Color`, `Shape` (border, shadow offset, radius = 0), `Typography`, `Spacing`. Nama variabel mengikuti token `nb-*`.
- **Batasan paket Starter:** satu mode per koleksi variabel, sehingga mode gelap tidak dapat dimodelkan sebagai mode; versi 1 memang hanya mode terang. Bayangan keras dibuat sebagai efek drop shadow dengan blur 0 dan offset sesuai token (atau sebagai persegi hitam di belakang elemen bila efek tidak cukup).
- **Komponen:** Button (varian × state), Input, Select, Checkbox/Radio/Switch, Chip, Badge, Card, EbookCard, AppBar, BottomNav, PublicNavbar, Sidebar, TopBar, Table (header/baris), Pagination, Dialog, Sheet, Toast, Banner, Skeleton, EmptyState, Stepper, RatingStars, RankBadge, ScoreBar, SimulationBadge.
- **Urutan kerja:** (1) variabel dan gaya teks, (2) komponen dasar, (3) komponen domain & penguat aktor, (4) layar kritis (Rekomendasi SAW, Checkout, Tabel e-book admin, Kriteria SAW, Portal Pengunjung), (5) layar lain.

---

## 17. Aturan integritas desain

Selaras dengan aturan proyek:

1. **Tidak ada tombol, menu, atau tautan tanpa aksi.** Fitur yang belum tersedia tidak ditampilkan (atau tampil dengan status jelas "Belum tersedia" bila perlu untuk komunikasi, bukan sebagai tombol aktif palsu).
2. **Tidak ada data dummy yang tampil sebagai data nyata.** Angka dashboard, daftar e-book, dan hasil rekomendasi berasal dari backend.
3. **Data simulasi** (seed, mode pembayaran simulasi, data uji SAW) wajib diberi **SimulationBadge "DATA SIMULASI"** yang tidak dapat ditutup; backend menyediakan penanda sumber data pada respons yang relevan agar UI tidak menebak.
4. **Perhitungan SAW final hanya di backend.** UI hanya menampilkan.
5. **Status pembayaran dan akses ditentukan server.** UI tidak mengklaim "lunas" atau membuka akses berdasarkan klik tombol.
6. **Kontrol akses di backend.** Menu yang disembunyikan hanyalah kenyamanan tampilan.
7. Kata "selesai/berhasil" pada UI hanya setelah respons sukses dari backend.
8. Wireframe dalam dokumen ini bukan bukti implementasi; status pengerjaan layar dicatat terpisah (`[ADA]` / `[RENCANA]`).

---

## 18. Checklist QA desain

**Visual**
- [ ] Semua komponen: sudut 0, blur bayangan 0, border sesuai zona.
- [ ] Tidak ada gradien dan tidak ada bayangan lembut.
- [ ] Maksimal 1–3 aksen jenuh per layar; zona C tenang.
- [ ] Tidak ada teks aksen di atas latar terang atau teks putih di atas aksen.
- [ ] Jarak antar kartu ≥ 16.

**Interaksi**
- [ ] Pola hover/tekan/fokus/nonaktif konsisten di semua tombol dan kartu klik.
- [ ] Tombol aksi yang memproses nonaktif selama proses (cegah submit ganda).
- [ ] Tindakan berisiko memakai dialog konfirmasi berisi dampak.
- [ ] Setiap layar memiliki state loading, empty, error, dan data.

**Aksesibilitas**
- [ ] Kontras semua kombinasi teks/latar dan kontras komponen terverifikasi dengan alat.
- [ ] Cincin fokus terlihat dan tidak tertutup bayangan atau elemen lengket.
- [ ] Target tekan ≥ 44px / 48dp.
- [ ] Status tidak hanya warna.
- [ ] Uji keyboard (web), TalkBack (Android), skala font 200%, reduced motion.

**Integritas**
- [ ] Tidak ada tombol tanpa aksi, endpoint palsu, atau angka statis.
- [ ] Semua data simulasi berlabel.
- [ ] Layar SAW menampilkan bobot, jenis, nilai asli, normalisasi, kontribusi, skor, versi konfigurasi, dan waktu hitung.

**Performa**
- [ ] Font dimuat dengan `swap` dan di-subset bila memungkinkan.
- [ ] Gambar cover memakai ukuran responsif dan lazy-load.

---

## 19. Keputusan & Keselarasan Proyek (`[ADA]` vs `[RENCANA]`)

Diselaraskan dengan [`keputusan-terbuka.md`](../../00-project/keputusan-terbuka.md):

**Sudah Ditetapkan (`[ADA]` dalam kesepakatan desain):**
- **Portal Web Pengunjung (`web/pengunjung-web`)** masuk cakupan UI resmi sebagai katalog read-only & showcase SAW publik.
- **Autentikasi Supabase Auth** dipakai untuk Pelanggan dan Admin, dengan verifikasi token & peran di backend.
- **Payment gateway nyata** digunakan untuk alur transaksi (mode simulasi hanya jika explicitly ditandai `"DATA SIMULASI"`).
- **Pembacaan PDF di dalam aplikasi (In-App Reader)** melalui *signed URL* berumur pendek dari bucket privat; tidak ada unduh bebas ke penyimpanan publik.

**Masih Terbuka (`[RENCANA]`):**
1. **Preferensi bobot rekomendasi oleh pelanggan** (Keputusan #5): dokumentasi saat ini menetapkan bobot hanya dikelola admin; UI belum menyediakan penggeser bobot pelanggan.
2. **Ulasan & perlakuan e-book tanpa rating** (Keputusan #6 & #7): memengaruhi tampilan `RatingStars` pada detail e-book dan nilai C1 di SAW.
3. **Nama aplikasi dan logo final** (Keputusan #8): splash, app bar, dan navbar web memakai nama kerja sementara.
4. **Rekonsiliasi jumlah & bobot kriteria SAW** (Keputusan #9): penetapan final 4 kriteria vs 5 kriteria. UI tidak menanam bobot.
5. **Snapshot riwayat hasil SAW** (Keputusan #11): apakah hasil perhitungan SAW disimpan di database atau dihitung *real-time*.
6. **Implikasi Google Play Billing** bila aplikasi mobile dipublikasikan secara komersial.
7. **Mode gelap:** tidak masuk versi 1.
8. **Radio bulat atau siku:** default dokumen siku (radius 0); dapat dikecualikan jika uji kegunaan menunjukkan kebingungan dengan checkbox.

---

## 20. Referensi

- Neubrutalism — The Definitive Guide: https://neubrutalism.com/
- Repositori sumber situs: https://github.com/neubrutalism/neubrutalism.com
- Nielsen Norman Group, "Neobrutalism: Definition and Best Practices": https://www.nngroup.com/articles/neubrutalism/
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- neobrutalism.dev (pustaka komponen shadcn/ui bergaya neubrutalism): https://www.neubrutalism.dev/
- Dokumentasi proyek: [`docs-proyek-ebook-ecommerce.md`](../../docs-proyek-ebook-ecommerce.md) & [`keputusan-terbuka.md`](../../00-project/keputusan-terbuka.md)
