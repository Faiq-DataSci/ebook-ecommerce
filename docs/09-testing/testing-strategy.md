# Strategi Pengujian (`Testing Strategy`)

**Status:** `[RENCANA]` (rencana pengujian) | `[RENCANA]` (suite pengujian fitur bisnis)

---

## 1. Piramida & Lapisan Pengujian (`[RENCANA]`)

| Lapisan | Target Komponen | Alat / Framework | Status |
|---|---|---|---|
| **Unit Test** | Logika perhitungan SAW, validasi Zod, kalkulasi total pesanan, helper backend | Vitest (`backend/package.json` mencantumkan `vitest run`) | `[RENCANA]` |
| **Integration / API Test** | Endpoint REST API (`/api/v1/*`), otorisasi role, transaksi DB & hak akses | Vitest + Supertest (`[RENCANA]`) | `[RENCANA]` |
| **Widget / UI Test** | Komponen UI Flutter (`mobile/ebook_store`) dan Admin Web | `flutter_test` (`[ADA]` template default `widget_test.dart`) | `[ADA]` (template) |
| **Security & Static Check** | Linting (`eslint`, `flutter analyze`), typecheck (`tsc --noEmit`), audit secret `.gitignore` | ESLint, TypeScript, Flutter Analyzer, Git/Gitleaks | `[ADA]` (konfigurasi lint) |

---

## 2. Prinsip Pengujian Wajib (`[ADA]` pada `AGENTS.md`)

1. Tidak ada klaim fitur selesai tanpa implementasi **dan** pengujian yang benar-benar dijalankan.
2. Seluruh skenario kritis (otorisasi admin vs pelanggan, snapshot harga, idempotensi verifikasi pembayaran, penolakan akses PDF tanpa pembelian, dan perhitungan SAW backend-only) wajib memiliki kasus uji otomatis sebelum rilis.
