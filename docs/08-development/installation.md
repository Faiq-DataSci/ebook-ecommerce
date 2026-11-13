# Panduan Instalasi (`Installation Guide`)

**Status:** `[IMPLEMENTED]` (instalasi untuk template web & mobile) | `[NOT AVAILABLE]` (instalasi dependensi `backend/` dan migrasi database)

---

## 1. Prasyarat Lingkungan (`[CONFIRMED]` / `[PROPOSED]`)

- **Shell:** Windows PowerShell (`[CONFIRMED]` pada `AGENTS.md`)
- **Node.js & npm:** Untuk menjalankan `backend/`, `web/admin-web/`, dan `web/pengunjung-web/`
- **Flutter SDK & Dart (`^3.12.0`):** Untuk menjalankan `mobile/ebook_store/`
- **Git:** Untuk kontrol versi

---

## 2. Langkah Instalasi per Komponen

### A. Backend (`backend/`) — `[NOT AVAILABLE]`
Saat ini `backend/package.json` baru berisi skrip dasar tanpa `dependencies`. Setelah dependensi (`express`, `zod`, `prisma`, dll.) ditambahkan:
```powershell
cd backend
npm install
# Setelah schema.prisma tersedia:
# npx prisma generate
# npx prisma migrate dev
```

### B. Admin Web (`web/admin-web/`) — `[IMPLEMENTED]` (template)
```powershell
cd web/admin-web
npm install
npm run dev
```

### C. Pengunjung Web (`web/pengunjung-web/`) — `[IMPLEMENTED]` (template, peran `[ASSUMPTION]`)
```powershell
cd web/pengunjung-web
npm install
npm run dev
```

### D. Mobile App (`mobile/ebook_store/`) — `[IMPLEMENTED]` (template)
```powershell
cd mobile/ebook_store
flutter pub get
flutter run
```
