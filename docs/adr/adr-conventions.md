# Konvensi Penulisan ADR (`ADR Conventions`)

**Status:** `[ADA]` (konvensi resmi pengelolaan ADR pada `docs/adr/`).  
**Referensi Utama:** [`AGENTS.md`](../../AGENTS.md), [`CONTRIBUTING.md`](../../CONTRIBUTING.md), [`docs/00-project/keputusan-terbuka.md`](../00-project/keputusan-terbuka.md).

---

## 1. Tujuan ADR

ADR bertujuan mendokumentasikan keputusan arsitektur yang signifikan, berdampak jangka panjang, dan tidak mudah diubah tanpa biaya rekayasa ulang, sehingga tim pengembang dan pembimbing akademik memahami alasan di balik desain sistem.

---

## 2. Kapan Membuat vs Tidak Membuat ADR

### Wajib Membuat ADR Jika Keputusan:
- Memengaruhi lebih dari satu komponen sistem (`backend/`, `web/`, `mobile/`, database, atau storage).
- Mengunci pilihan teknologi, arsitektur integrasi, atau stack utama proyek.
- Menetapkan pemisahan tanggung jawab dan batas keamanan antar lapisan (mis. perhitungan SAW hanya di backend, storage PDF privat).
- Mengatur urutan atau strategi pengembangan lintas fase yang mengikat tim.

### Tidak Perlu Membuat ADR Untuk:
- Detail implementasi lokal (penamaan fungsi helper, penataan file internal minor, atau konstanta UI).
- Perbaikan bug (*bug fix*) atau *refactoring* lokal yang tidak mengubah kontrak arsitektur.
- Pembaruan redaksional dokumentasi tanpa perubahan keputusan teknis.

---

## 3. Format Penomoran & Penamaan File

- **Penempatan:** Seluruh berkas ADR disimpan di folder `docs/adr/`.
- **Format Nama File:** `XXXX-nama-keputusan-singkat.md` menggunakan huruf kecil dan tanda hubung (`kebab-case`), contoh: `0004-supabase-auth.md`.
- **Penomoran:** 4 digit berurutan (`0001`, `0002`, `0003`, ...). Nomor yang sudah dipakai tidak pernah digunakan ulang meskipun ADR berstatus `Ditolak` atau `Digantikan`.
- **Bahasa:** Bahasa Indonesia formal, jelas, dan konsisten.

---

## 4. Siklus Hidup & Status ADR

| Status | Arti | Dapat Berubah? |
|---|---|---|
| **Diajukan** | Usulan keputusan arsitektur yang masih menunggu persetujuan tim/pemilik proyek | Ya |
| **Diterima** | Keputusan final yang aktif berlaku dan mengikat implementasi | Tidak (kecuali digantikan oleh ADR baru) |
| **Ditolak** | Usulan atau alternatif yang ditolak setelah evaluasi teknis/bisnis | Tidak |
| **Digantikan** | Keputusan lama yang tidak lagi berlaku karena ada ADR pengganti | Tidak |
| **Usang** | Keputusan yang tidak lagi relevan akibat perubahan ruang lingkup sistem | Tidak |

---

## 5. Hubungan dengan `keputusan-terbuka.md` & `AGENTS.md`

1. **Hubungan dengan `keputusan-terbuka.md`:**
   - Keputusan yang sudah ditetapkan (`[ADA]` pada `#1`–`#4` di [`keputusan-terbuka.md`](../00-project/keputusan-terbuka.md)) **wajib** memiliki ADR berstatus `Diterima` (`ADR-0004` s.d. `ADR-0007`).
   - Keputusan yang masih terbuka (`[RENCANA]` pada `#5`–`#11`) **dilarang** dibuat sebagai ADR berstatus `Diterima` sebelum ada persetujuan final. Selama belum final, catat di [`adr-gap-register.md`](./adr-gap-register.md).
   - Setelah sebuah keputusan terbuka difinalisasi, buat ADR baru, perbarui indeks `docs/adr/README.md`, dan pindahkan statusnya pada `keputusan-terbuka.md`.
2. **Hubungan dengan `AGENTS.md`:**
   - Stack terkunci dan aturan mutlak yang bersifat arsitektural di [`AGENTS.md`](../../AGENTS.md) didukung oleh ADR terkait (seperti `ADR-0002` untuk SAW backend-only dan `ADR-0003` untuk urutan pengembangan).

---

## 6. Struktur Minimum Setiap ADR

Setiap berkas ADR wajib mengikuti [`adr-template.md`](./adr-template.md) dan memuat minimal bagian:
1. **Status** (Status Keputusan & Status Implementasi `[ADA]`/`[RENCANA]`)
2. **Konteks** (termasuk Faktor yang Mempengaruhi & Stakeholder)
3. **Alternatif yang Dipertimbangkan**
4. **Keputusan** (beserta alasan)
5. **Konsekuensi** (Positif, Negatif, Netral)
6. **Dampak Teknis** (Arsitektur, Database, API, Keamanan, Pengujian, Deployment)
7. **Referensi Silang** (Kebutuhan, Dokumen Arsitektur/Desain/Modul, Keputusan Terbuka, Bukti Teknis)
