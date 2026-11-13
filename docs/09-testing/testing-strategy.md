# Strategi Pengujian (`Testing Strategy`)

**Status:** `[PROPOSED]` (rencana pengujian) | `[NOT AVAILABLE]` (suite pengujian fitur bisnis)

---

## 1. Piramida & Lapisan Pengujian (`[PROPOSED]`)

| Lapisan | Target Komponen | Alat / Framework | Status |
|---|---|---|---|
| **Unit Test** | Logika perhitungan SAW, validasi Zod, kalkulasi total pesanan, helper backend | Vitest (`backend/package.json` mencantumkan `vitest run`) | `[NOT AVAILABLE]` |
| **Integration / API Test** | Endpoint REST API (`/api/v1/*`), otorisasi role, transaksi DB & hak akses | Vitest + Supertest (`[PROPOSED]`) | `[NOT AVAILABLE]` |
| **Widget / UI Test** | Komponen UI Flutter (`mobile/ebook_store`) dan Admin Web | `flutter_test` (`[IMPLEMENTED]` template default `widget_test.dart`) | `[IMPLEMENTED]` (template) |
| **Security & Static Check** | Linting (`eslint`, `flutter analyze`), typecheck (`tsc --noEmit`), audit secret `.gitignore` | ESLint, TypeScript, Flutter Analyzer, Git/Gitleaks | `[IMPLEMENTED]` (konfigurasi lint) |

---

## 2. Prinsip Pengujian Wajib (`[CONFIRMED]` pada `AGENTS.md`)

1. Tidak ada klaim fitur selesai tanpa implementasi **dan** pengujian yang benar-benar dijalankan.
2. Seluruh skenario kritis (otorisasi admin vs pelanggan, snapshot harga, idempotensi verifikasi pembayaran, penolakan akses PDF tanpa pembelian, dan perhitungan SAW backend-only) wajib memiliki kasus uji otomatis sebelum rilis.
