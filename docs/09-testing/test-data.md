# Strategi Data Uji & Fixture (`Test Data & Fixtures`)

**Status:** `[RENCANA]` (0 fixture & 0 seed di repository saat ini)  
**Referensi Utama:** [`perhitungan-manual.md`](../03-saw/perhitungan-manual.md), [`webhook-contract.md`](../02-api/webhook-contract.md), [`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma).

---

## 1. Prinsip Wajib Data Uji

1. Seluruh data uji dan fixture **wajib** memakai label **`"DATA SIMULASI"`**.
2. Dilarang memakai akun, email, token JWT, secret gateway, atau data pengguna produksi nyata.
3. Data uji harus bersifat idempoten (dapat dibuat ulang dan dibersihkan setelah test selesai).

---

## 2. Kategori Data Uji (`"DATA SIMULASI"` — `[RENCANA]`)

| Kategori | Contoh Data | Sumber Referensi | Status |
|---|---|---|---|
| **Category** | `"DATA SIMULASI - Teknologi"`, `"DATA SIMULASI - Bisnis"` | `schema.prisma` | `[RENCANA]` |
| **Ebook** | `"DATA SIMULASI - Panduan Praktis Flutter"` + `storagePath` dummy | `schema.prisma`, `perhitungan-manual.md` | `[RENCANA]` |
| **User** | `"DATA SIMULASI - Budi Santoso"` (`supabaseUserId` dummy) | `schema.prisma`, `api-spec.yaml` | `[RENCANA]` |
| **Order** | `"ORD-DATA-SIMULASI-001"` (`Decimal(12,2)`) | `webhook-contract.md` | `[RENCANA]` |
| **Payment & Webhook** | `"DATA-SIMULASI-GW-20261114-001"` | `webhook-contract.md` bagian 5 | `[RENCANA]` |
| **SAW Dataset** | 3 alternatif `A1`, `A2`, `A3`; bobot `[0.40, 0.35, 0.25]` | `perhitungan-manual.md` | `[RENCANA]` |

---

## 3. Dataset SAW Simulasi Lengkap (`perhitungan-manual.md` — `"DATA SIMULASI"`)

- **Bobot:** `C1` Harga (`Cost`, `0.40`), `C2` Rating (`Benefit`, `0.35`), `C3` Terjual (`Benefit`, `0.25`).
- **Alternatif & Matriks:**
  - `A1` (`"DATA SIMULASI - Arsitektur Backend Modern"`): `50000`, `4.5`, `120` -> $V_1 = 0.848125$ (Peringkat 2).
  - `A2` (`"DATA SIMULASI - Dasar Basis Data Relasional"`): `75000`, `4.0`, `80` -> $V_2 = 0.638333\dots$ (Peringkat 3).
  - `A3` (`"DATA SIMULASI - Panduan Praktis Flutter"`): `40000`, `4.8`, `150` -> $V_3 = 1.000000$ (Peringkat 1).

---

## 4. Contoh Webhook Payload Simulasi (`webhook-contract.md` — `"DATA SIMULASI"`)

```json
{
  "externalRef": "DATA-SIMULASI-GW-20261114-001",
  "orderNumber": "ORD-DATA-SIMULASI-001",
  "status": "VERIFIED",
  "amount": "75000.00",
  "paidAt": "2026-11-14T04:30:00.000Z"
}
```

---

## 5. Urutan Pembuatan Data Uji (Foreign Key) & Strategi Fixture/Mock (`[RENCANA]`)

1. `Category` -> 2. `Ebook` -> 3. `User` -> 4. `Order` -> 5. `OrderItem` -> 6. `Payment` -> 7. `Transaction` -> 8. `EbookAccess`.

- **Fixture (`backend/tests/fixtures/` `[RENCANA]`):** Factory function dengan nilai default `"DATA SIMULASI"`, mendukung override per test case dan cleanup otomatis.
- **Mock Strategy:** Mock Prisma Client (unit test), mock `supabase.auth.getUser()` (auth middleware), mock `createPrivatePdfSignedUrl()` (akses PDF), dan mock HTTP adapter Payment Gateway (webhook).
