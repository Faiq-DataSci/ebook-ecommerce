---
name: security-audit
description: Gunakan saat memeriksa potensi kebocoran kredensial, file .env, atau konfigurasi sensitif sebelum melakukan commit atau push ke GitHub.
---

# Skill: Audit Keamanan Pra-Push

## Daftar Pemeriksaan
1. **Working Tree & File Ter-track:**
   - Pastikan `.env` dan `.env.*` (kecuali `.env.example`) ter-ignore oleh `.gitignore` (`git check-ignore -v backend/.env`).
   - Pastikan tidak ada file `*.keystore`, `*.jks`, atau kredensial yang ter-track (`git ls-files`).
2. **Pemindaian Kode Sumber:**
   - Periksa seluruh file di `backend/`, `admin-web/`, dan `mobile/` dari pola secret hardcoded (`SUPABASE_SERVICE_ROLE_KEY`, `JWT_`, password database, API key).
   - Pastikan tidak ada secret di variabel lingkungan frontend `VITE_*`.
3. **Riwayat Git:**
   - Periksa riwayat commit (`git log` / `git diff`) untuk memastikan tidak ada secret yang pernah ter-commit sebelumnya.

## Format Pelaporan Risiko
Kelompokkan temuan berdasarkan tingkat risiko:
- **Kritis:** Secret/kredensial aktif terekspos di kode atau riwayat Git.
- **Tinggi:** `.env` tidak ter-ignore atau key privat berpotensi masuk bundle klien (`VITE_*` / Flutter).
- **Sedang / Rendah:** Konfigurasi kurang ketat atau potensi hardening tambahan.

## Pengingat Manual GitHub
Ingatkan pengguna untuk memverifikasi langsung di pengaturan repositori GitHub:
- Visibilitas repositori disetel **Private**
- **Secret scanning** aktif
- **Push protection** aktif
