---
description: Menjalankan audit keamanan sebelum push ke repositori GitHub
---

# Workflow: Pre-Push Audit

1. Aktifkan dan ikuti prosedur pada skill `security-audit` (`.agents/skills/security-audit/SKILL.md`).
2. Periksa potensi kebocoran kredensial di working tree, file ter-track Git, riwayat commit, dan variabel lingkungan klien (`VITE_*` serta kode Flutter).
3. Laporkan temuan berdasarkan tingkat risiko (`Kritis`, `Tinggi`, `Sedang`, `Rendah`).
4. Ingatkan pengguna untuk memverifikasi secara manual di pengaturan GitHub:
   - Status repositori **Private**
   - **Secret scanning** aktif
   - **Push protection** aktif
