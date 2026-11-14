# Template Architecture Decision Record (`ADR Template`)

**Status:** `[ADA]` (template standar penulisan ADR di `docs/adr/`).

Template ini digunakan setiap kali tim membuat ADR baru untuk keputusan arsitektur yang telah difinalisasi. Salin struktur di bawah ini ke file `docs/adr/XXXX-nama-keputusan.md`.

---

## Format Baku ADR

```markdown
# ADR-XXXX: [Judul Keputusan]

## Status
[Diterima / Diajukan / Ditolak / Digantikan / Usang]

- **Status Keputusan:** Diterima
- **Status Implementasi:** `[ADA]` / `[RENCANA]`
- **Tanggal Keputusan:** [YYYY-MM-DD]
- **Tanggal Pembaruan:** [YYYY-MM-DD]
- **Pemutus:** [Peran/Tim]
- **Pengganti:** [ADR-YYYY atau "Tidak ada"]

## Konteks
[Deskripsi masalah, latar belakang, dan kekuatan pendorong (driving forces) yang memengaruhi keputusan.]

### Faktor yang Mempengaruhi
- [Faktor 1]
- [Faktor 2]

### Stakeholder
- [Stakeholder 1]: [kepentingan]
- [Stakeholder 2]: [kepentingan]

## Alternatif yang Dipertimbangkan

### Alternatif 1: [Nama]
- **Deskripsi:** [penjelasan]
- **Kelebihan:** [daftar]
- **Kekurangan:** [daftar]
- **Status:** [Dipilih / Ditolak]

### Alternatif 2: [Nama]
- **Deskripsi:** [penjelasan]
- **Kelebihan:** [daftar]
- **Kekurangan:** [daftar]
- **Status:** [Dipilih / Ditolak]

## Keputusan
[Keputusan yang diambil, disertai justifikasi.]

### Alasan
1. [alasan 1]
2. [alasan 2]

## Konsekuensi

### Positif
- [konsekuensi positif 1]
- [konsekuensi positif 2]

### Negatif
- [konsekuensi negatif 1]
- [konsekuensi negatif 2]

### Netral
- [konsekuensi netral 1]

## Dampak Teknis

### Arsitektur
- [dampak pada arsitektur]

### Database
- [dampak pada schema/database]

### API
- [dampak pada endpoint/API]

### Keamanan
- [dampak pada keamanan]

### Pengujian
- [dampak pada testing]

### Deployment
- [dampak pada deployment]

## Referensi Silang
- **Kebutuhan:** [FR-XX / NFR-XX dari `requirements.md`]
- **Dokumen Arsitektur:** [`architecture-decisions-summary.md` / `technology-stack.md` / dll.]
- **Dokumen Desain:** [`use-cases.md` / `sequence-diagram.md` / dll.]
- **Dokumen Modul:** [`authentication.md` / `payment-management.md` / dll.]
- **Keputusan Terbuka:** [`keputusan-terbuka.md` #X]
- **ADR Terkait:** [ADR-YYYY]
- **Bukti Teknis:** [`backend/src/...` / `backend/prisma/schema.prisma` / dll.]

## Catatan
[Catatan tambahan, pertimbangan masa depan, atau amandemen.]
```

---

## Aturan Penggunaan Template

1. **Penomoran Berurutan:** Gunakan nomor 4 digit berurutan (`0001`, `0002`, `0008`, dst.).
2. **Pemisahan Dua Status:** Selalu bedakan **Status Keputusan** (`Diterima`/`Diajukan`/`Ditolak`/`Digantikan`/`Usang`) dan **Status Implementasi** (`[ADA]`/`[RENCANA]`) berdasarkan bukti nyata di repository.
3. **Kelengkapan Bagian:** Seluruh bagian pada template wajib diisi. Jika suatu subbagian dampak teknis tidak terdampak langsung, tuliskan `"Tidak ada dampak signifikan."` beserta alasan singkatnya.
4. **Larangan Secret:** Dilarang menyertakan nilai kredensial, token, atau connection string nyata; gunakan placeholder atau label `"DATA SIMULASI"` jika membutuhkan contoh.
