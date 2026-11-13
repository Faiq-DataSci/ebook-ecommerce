---
name: api-endpoint
description: Gunakan saat menambah, mengubah, atau menguji endpoint REST API di backend Express + TypeScript.
---

# Skill: Pembuatan & Pengujian Endpoint API

## Urutan Kerja Wajib
1. `*.schema.ts` — Definisikan validasi input/params/query menggunakan **Zod**.
2. `*.repository.ts` — Query database melalui Prisma.
3. `*.service.ts` — Logika bisnis murni/orkestrasi (termasuk aturan otorisasi kepemilikan data).
4. `*.controller.ts` — Tangkap request tervalidasi, panggil service, kirim response konsisten.
5. `*.routes.ts` — Daftarkan route dengan middleware `authenticate` dan `authorize(role)`.
6. `tests/` — Tulis unit/integration test.
7. `docs/02-api/api-spec.yaml` — Perbarui spesifikasi OpenAPI sesuai endpoint aktual.

## Aturan Keamanan & Konvensi
- Semua endpoint menggunakan prefix `/api/v1`.
- Import relatif di file `.ts` wajib menggunakan ekstensi `.js` (ESM).
- Pastikan endpoint terproteksi memeriksa `authenticate` (token valid) dan `authorize` (role `ADMIN` atau `CUSTOMER`).
- Cegah akses lintas pengguna (IDOR): pelanggan hanya boleh mengakses order, library, dan signed URL PDF miliknya sendiri.

## Verifikasi Wajib
- Jangan nyatakan endpoint tersedia atau selesai sebelum diuji secara nyata (misalnya menggunakan `Invoke-RestMethod` di PowerShell) dan hasil respons aktualnya dilaporkan.
