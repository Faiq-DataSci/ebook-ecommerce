---
description: Menjalankan lint, typecheck, dan pengujian yang tersedia di monorepo
---

# Workflow: Verifikasi Proyek

1. Periksa ketersediaan script/perintah di `backend/`, `admin-web/`, dan `mobile/`.
2. Untuk `backend/` (jika sudah ada dependensi & script):
   - Jalankan typecheck (`npx tsc --noEmit` atau script terkait), lint, dan test.
3. Untuk `admin-web/` (jika sudah ada `package.json` & dependensi):
   - Jalankan typecheck, lint, dan build/test.
4. Untuk `mobile/` (jika proyek Flutter dan `flutter` tersedia):
   - Jalankan `flutter analyze` dan `flutter test`.
5. Laporkan hasil **apa adanya** (lulus, gagal, atau tidak dapat dijalankan karena dependensi/tool belum tersedia). Jangan pernah mengarang hasil tes.
