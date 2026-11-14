# Indeks Architecture Decision Records (`docs/adr/`)

**Status:** `[ADA]` (3 ADR awal tersedia dan diperluas + konvensi/template) | `[RENCANA]` (implementasi fitur bisnis pada seluruh ADR, serta 7 keputusan terbuka yang belum memiliki ADR)  
**Referensi Utama:** [`docs/00-project/keputusan-terbuka.md`](../00-project/keputusan-terbuka.md), [`docs/02-architecture/architecture-decisions-summary.md`](../02-architecture/architecture-decisions-summary.md), [`AGENTS.md`](../../AGENTS.md).

---

## 1. Apa Itu ADR & Mengapa Proyek Ini Menggunakannya?

*Architecture Decision Record* (**ADR**) adalah catatan terstruktur yang mendokumentasikan keputusan arsitektur signifikan beserta konteks, alternatif yang dipertimbangkan, alasan pemilihan, konsekuensi, dan dampak teknisnya. Proyek **Sistem Informasi E-Commerce E-Book dengan SPK Metode SAW** menggunakan ADR agar:
1. Keputusan arsitektur penting (model bisnis, lokasi perhitungan SAW, urutan pengembangan, autentikasi, pembayaran, penyimpanan PDF privat, dan portal web) memiliki dasar rasional yang jelas bagi tim 3 orang dan penilai akademik.
2. Pengembang baru maupun agen AI dapat menelusuri batasan terkunci tanpa mengulang perdebatan arsitektur yang sudah diputuskan.
3. Terdapat pemisahan jujur antara **Status Keputusan** (`Diterima` / final) dan **Status Implementasi** (`[ADA]` vs `[RENCANA]`).

---

## 2. Daftar ADR Proyek

| Nomor | Judul | Status Keputusan | Status Implementasi | Tanggal | Dampak | Dokumen Terkait |
|---|---|---|---|---|---|---|
| [**ADR-0001**](./0001-single-seller-b2c.md) | Model Bisnis Single-Seller (B2C) | **Diterima** | `[RENCANA]` implementasi (`[ADA]` enum `UserRole`) | 2026-11-14 | Skema DB, RBAC 2 aktor, ruang lingkup | [`system-scope.md`](../01-project-overview/system-scope.md) |
| [**ADR-0002**](./0002-backend-only-saw.md) | Perhitungan SAW Hanya di Backend | **Diterima** | `[RENCANA]` implementasi | 2026-11-14 | Keamanan bobot, `SawService`, unit test | [`saw-method.md`](../03-saw/saw-method.md) |
| [**ADR-0003**](./0003-admin-web-sebelum-mobile.md) | Urutan Pengembangan Backend -> Admin Web -> Mobile | **Diterima** | `[ADA]` urutan / `[RENCANA]` completion | 2026-11-14 | Tahapan proyek M1–M6, gate keluar | [`project-plan.md`](../00-project/project-plan.md) |
| [**ADR-0004**](./0004-supabase-auth.md) | Autentikasi Menggunakan Supabase Auth | **Diterima** | `[ADA]` middleware / `[RENCANA]` sync DB | 2026-11-14 | IdP, verifikasi JWT backend, `users` | [`authentication.md`](../06-modules/authentication.md) |
| [**ADR-0005**](./0005-payment-gateway-nyata.md) | Integrasi Payment Gateway Nyata | **Diterima** | `[RENCANA]` implementasi (`[ADA]` model DB) | 2026-11-14 | Webhook signature, idempotensi, atomik | [`payment-management.md`](../06-modules/payment-management.md) |
| [**ADR-0006**](./0006-pdf-storage-privat-signed-url.md) | Penyimpanan PDF Bucket Privat & Signed URL | **Diterima** | `[ADA]` helper / `[RENCANA]` endpoint | 2026-11-14 | Proteksi PDF, `EbookAccess`, in-app reader | [`ebook-access.md`](../06-modules/ebook-access.md) |
| [**ADR-0007**](./0007-pengunjung-web-dipertahankan.md) | Portal Pengunjung Web Dipertahankan | **Diterima** | `[ADA]` template / `[RENCANA]` bisnis | 2026-11-14 | Multi-klien REST API (`mobile` + `web`) | [`application-architecture.md`](../02-architecture/application-architecture.md) |

---

## 3. Legenda Status Keputusan ADR

- **Diterima:** Keputusan arsitektur final dan mengikat; tidak diubah tanpa ADR pengganti yang disetujui.
- **Diajukan:** Diusulkan dan masih menunggu persetujuan *(belum ada pada daftar saat ini)*.
- **Ditolak:** Alternatif atau usulan yang ditolak setelah evaluasi *(belum ada pada daftar saat ini)*.
- **Digantikan:** Keputusan lama yang telah digantikan oleh ADR baru *(belum ada pada daftar saat ini)*.
- **Usang:** Keputusan yang tidak lagi relevan dengan arsitektur berjalan *(belum ada pada daftar saat ini)*.

---

## 4. Dokumen Pendukung ADR & Keputusan Terbuka

- [**Template ADR (`adr-template.md`)**](./adr-template.md) — Format standar penulisan ADR baru (`[ADA]`).
- [**Konvensi ADR (`adr-conventions.md`)**](./adr-conventions.md) — Aturan penomoran, kapan membuat ADR, dan keterkaitan dengan `AGENTS.md` (`[ADA]`).
- [**Matriks Keterlacakan (`adr-traceability.md`)**](./adr-traceability.md) — Pemetaan `ADR-0001`–`0007` ke kebutuhan, dokumen, dan bukti teknis.
- [**Register Gap ADR (`adr-gap-register.md`)**](./adr-gap-register.md) — Daftar gap implementasi dan keputusan terbuka yang masih membutuhkan ADR.
- [**Daftar Keputusan Terbuka (`keputusan-terbuka.md`)**](../00-project/keputusan-terbuka.md) — Referensi keputusan `#5` s.d. `#11` yang berstatus `[RENCANA]` dan **belum boleh** ditetapkan sebagai ADR "Diterima" sebelum difinalisasi.
