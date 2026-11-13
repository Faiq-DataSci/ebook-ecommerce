---
name: admin-ui-neobrutalism
description: Gunakan saat membangun atau mengubah antarmuka pengguna Admin Web (React + TypeScript + Vite) dengan gaya neo-brutalism.
---

# Skill: Desain Admin UI Neo-Brutalism

## Prinsip Visual (3 Zona Intensitas)
1. **Zona 1 — Aksen Tegas (Hero / Primary CTA / Status Penting):** Warna kontras tinggi, border hitam tebal, dan *hard shadow* tanpa blur.
2. **Zona 2 — Navigasi & Kartu Ringkasan:** Border jelas, latar netral hangat/terang, *hard shadow* sedang.
3. **Zona 3 — Layar Padat Data (Tabel, Daftar Transaksi, Form Panjang):** Dibuat **lebih tenang** (border tipis/sedang, shadow minimal atau tanpa shadow, ruang bernapas cukup) agar nyaman dibaca dan tidak melelahkan mata.

## Konsistensi & Fungsionalitas
- Gunakan token warna, ketebalan border, dan *hard shadow* yang terpusat di `src/styles/`.
- Setiap tombol, filter, paginasi, dan aksi form harus terhubung ke fungsi nyata; dilarang membuat tombol tanpa aksi.
- Data contoh/placeholder sebelum integrasi API selesai wajib menampilkan label `"DATA SIMULASI"`.
- Tangani state `loading`, `empty`, dan `error` dengan jelas serta pertahankan guard `401`/`403`.
