# Arsitektur Aplikasi (`Application Architecture`)

**Status:** `[IMPLEMENTED]` (struktur folder & template awal) | `[CONFIRMED]` (target arsitektur per aplikasi) | `[NOT AVAILABLE]` (modul bisnis)

---

## 1. Struktur Monorepo Aktual

```text
ebook-ecommerce/
├── backend/              # Rencana layanan REST API (baru berisi package.json)
├── mobile/ebook_store/   # Aplikasi mobile pelanggan (Flutter template default)
├── web/admin-web/        # Aplikasi web admin (React + Vite template default)
├── web/pengunjung-web/   # Aplikasi web pengunjung (React + Vite template default) [ASSUMPTION]
├── docs/                 # Dokumentasi proyek
├── .agents/              # Panduan & skill agen pengembangan
└── .github/              # CI placeholder & PR template
```

---

## 2. Rincian Arsitektur Tiap Aplikasi

### A. Mobile Application (`mobile/ebook_store`)
- **Kondisi Aktual `[IMPLEMENTED]`:**
  - Entry point: `mobile/ebook_store/lib/main.dart` berisi kelas `MyApp` dan `MyHomePage` (template counter bawaan Flutter).
  - Pengujian bawaan: `mobile/ebook_store/test/widget_test.dart`.
  - Belum terdapat folder `features/`, `core/`, `services/`, `models/`, maupun konfigurasi state management/routing.
- **Target Arsitektur `[CONFIRMED]` / `[PROPOSED]`:**
  - State management: **Riverpod** (`[CONFIRMED]`).
  - HTTP client: **Dio** (`[CONFIRMED]`).
  - Lapisan yang direncanakan (`[PROPOSED]`): `core/` (konfigurasi API, interceptor token, tema), `features/` (auth, catalog, recommendation, order, payment, library/reader).

### B. Admin Web Application (`web/admin-web`)
- **Kondisi Aktual `[IMPLEMENTED]`:**
  - Entry point: `web/admin-web/src/main.jsx` dan `web/admin-web/src/App.jsx` (template counter bawaan Vite + React).
  - Masih menggunakan JavaScript (`.jsx`), belum terdapat `tsconfig.json`, router, maupun komponen admin.
- **Target Arsitektur `[CONFIRMED]` / `[PROPOSED]`:**
  - Bahasa: TypeScript (`[CONFIRMED]` pada `AGENTS.md`).
  - Gaya UI: Neo-brutalism (`[CONFIRMED]` pada `AGENTS.md`).
  - Lapisan yang direncanakan (`[PROPOSED]`): halaman login admin, dashboard ringkasan, manajemen e-book & kategori, manajemen pelanggan, pemantauan pesanan & pembayaran, laporan penjualan, serta konfigurasi bobot SAW.

### C. Pengunjung Web Application (`web/pengunjung-web`)
- **Kondisi Aktual `[IMPLEMENTED]`:**
  - Entry point: `web/pengunjung-web/src/main.jsx` dan `web/pengunjung-web/src/App.jsx` (template counter bawaan Vite + React).
- **Status Arsitektur `[ASSUMPTION]`:**
  - Belum tercantum pada `README.md` maupun `AGENTS.md`. Diperkirakan sebagai antarmuka web untuk aktor Pelanggan/Pengunjung, menunggu konfirmasi pemilik proyek.

### D. Backend Service (`backend/`)
- **Kondisi Aktual `[NOT AVAILABLE]`:**
  - Hanya terdapat `backend/package.json` dengan `"type": "module"` dan skrip `dev`, `build`, `start`, `typecheck`, `test`, `prisma:validate`.
  - Folder `src/`, `prisma/`, dan file `.env.example` belum ada.
- **Target Arsitektur `[CONFIRMED]` / `[PROPOSED]`:**
  - Pola modular berlapis (`[PROPOSED]`): `routes/` -> `middlewares/` (auth, role, validasi Zod) -> `controllers/` -> `services/` (termasuk `saw.service`) -> `repositories/` (Prisma Client).
  - Konvensi ESM: seluruh import relatif di file `.ts` wajib menggunakan ekstensi `.js` (`[CONFIRMED]` pada `AGENTS.md`).
