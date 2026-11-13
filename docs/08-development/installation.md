# Panduan Instalasi (`Installation Guide`)

**Status:** `[ADA]` (instalasi untuk template web & mobile) | `[RENCANA]` (instalasi dependensi `backend/` dan migrasi database)

---

## 1. Prasyarat Lingkungan (`[RENCANA]` / `[RENCANA]`)

- **Shell:** Windows PowerShell (`[ADA]` pada `AGENTS.md`)
- **Node.js & npm:** Untuk menjalankan `backend/`, `web/admin-web/`, dan `web/pengunjung-web/`
- **Flutter SDK & Dart (`^3.12.0`):** Untuk menjalankan `mobile/ebook_store/`
- **Git:** Untuk kontrol versi

---

## 2. Langkah Instalasi per Komponen

### A. Backend (`backend/`) — `[RENCANA]`
Saat ini `backend/package.json` baru berisi skrip dasar tanpa `dependencies`. Setelah dependensi (`express`, `zod`, `prisma`, dll.) ditambahkan:
```powershell
cd backend
npm install
# Setelah schema.prisma tersedia:
# npx prisma generate
# npx prisma migrate dev
```

### B. Admin Web (`web/admin-web/`) — `[ADA]` (template)
```powershell
cd web/admin-web
npm install
npm run dev
```

### C. Pengunjung Web (`web/pengunjung-web/`) — `[ADA]` (template, peran `[RENCANA]`)
```powershell
cd web/pengunjung-web
npm install
npm run dev
```

### D. Mobile App (`mobile/ebook_store/`) — `[ADA]` (template)
```powershell
cd mobile/ebook_store
flutter pub get
flutter run
```
