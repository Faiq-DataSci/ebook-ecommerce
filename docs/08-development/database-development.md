# Panduan Database Development (`Prisma 7 & PostgreSQL Supabase`)

**Status:** `[ADA]` (skema valid `schema.prisma`, `prisma.config.ts`, `src/config/prisma.ts`) | `[RENCANA]` (migrasi `prisma/migrations/`, seed data, koneksi DB live)  
**Referensi Utama:** [`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma), [`backend/prisma.config.ts`](../../backend/prisma.config.ts), [`backend/src/config/prisma.ts`](../../backend/src/config/prisma.ts), [`docs/10-maintenance/troubleshooting.md`](../10-maintenance/troubleshooting.md).

---

## 1. Konfigurasi Prisma 7 (`[ADA]`)

- **Versi:** Prisma `^7.10.0` dengan `@prisma/adapter-pg` (`PrismaPg`) dan `pg` (`Pool`).
- **`backend/prisma.config.ts`:** Mengarahkan `schema` ke `prisma/schema.prisma`, `migrations.path` ke `prisma/migrations`, dan `datasource.url` ke `process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? ''`.
- **`backend/src/config/prisma.ts`:** Membuat `Pool({ connectionString: env.DATABASE_URL })`, menginisialisasi `PrismaClient({ adapter })` (diimpor dari `../generated/prisma/client.js`), serta mengekspor `prisma`, `checkDatabaseConnection()` (`SELECT 1`), dan `disconnectDatabase()` (`$disconnect()` + `pool.end()`).

---

## 2. Pemisahan Koneksi Database (`6543` vs `5432`)

| Variabel | Port | Mode | Kegunaan |
|---|---|---|---|
| `DATABASE_URL` | `6543` | Transaction Pooler (`?pgbouncer=true`) | Runtime aplikasi Express (`src/config/prisma.ts`) |
| `DIRECT_URL` | `5432` | Direct Connection | Perintah Prisma CLI (`migrate`, `db push`) |

> **Penting:** Jangan gunakan pooler port `6543` untuk migrasi Prisma karena perintah DDL dapat menggantung.

---

## 3. Ringkasan Skema (`backend/prisma/schema.prisma` — `[ADA]`)

- **8 Model:** `User`, `Category`, `Ebook`, `Order`, `OrderItem`, `Payment`, `Transaction`, `EbookAccess`.
- **3 Enum:** `UserRole` (`CUSTOMER`, `ADMIN`), `OrderStatus` (`PENDING`, `PAID`, `FAILED`, `EXPIRED`, `CANCELLED`), `PaymentStatus` (`PENDING`, `VERIFIED`, `FAILED`, `EXPIRED`).
- **Output Prisma Client:** `backend/src/generated/prisma/client.js` (wajib import dengan ekstensi `.js` pada ESM).

---

## 4. Daftar Perintah Prisma (PowerShell)

| Perintah | Tujuan | Environment | Status |
|---|---|---|---|
| `npm --prefix backend run prisma:validate` | Validasi sintaks `schema.prisma` | Lokal / CI | `[ADA]` (PASS) |
| `npx --prefix backend prisma generate` | Generate Prisma Client ke `src/generated/prisma/` | Lokal / CI | `[RENCANA]` |
| `npx --prefix backend prisma migrate dev --name init` | Buat & terapkan migrasi awal | Development (`DIRECT_URL`) | `[RENCANA]` |
| `npx --prefix backend prisma migrate deploy` | Terapkan migrasi di staging/prod | Staging / Prod (`DIRECT_URL`) | `[RENCANA]` |
| `npx --prefix backend prisma migrate status` | Periksa status sinkronisasi migrasi | Semua | `[RENCANA]` |
| `npx --prefix backend prisma studio` | Antarmuka visual inspeksi tabel | Development | `[RENCANA]` |
| `npx --prefix backend prisma db seed` | Jalankan skrip seed awal | Development | `[RENCANA]` |

---

## 5. Status Migrasi, Seed (`"DATA SIMULASI"`), & Troubleshooting

- **Migrasi:** Direktori `backend/prisma/migrations/` belum ada (`[RENCANA]`).
- **Seed Data (`[RENCANA]`):** Mengacu [`database-seeding-plan.md`](../04-database/database-seeding-plan.md), seluruh data uji wajib berlabel `"DATA SIMULASI"` dan mengikuti urutan foreign key: `Category` -> `Ebook` -> `User` -> `Order` -> `OrderItem` -> `Payment` -> `Transaction` -> `EbookAccess`.
- **Troubleshooting Umum:**
  - *Migrasi menggantung:* Pastikan `DIRECT_URL` (port `5432`) terisi dan dipakai oleh `prisma.config.ts`.
  - *Versi Prisma RC tidak diinginkan:* Jalankan `npm view prisma dist-tags` sebelum instalasi (`AGENTS.md`).
  - *Error import Prisma Client:* Pastikan import memakai ekstensi `.js` (`../generated/prisma/client.js`).
