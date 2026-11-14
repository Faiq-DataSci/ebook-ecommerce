# Entity Relationship Diagram (ERD)

> **Status Dokumen:** `[ADA]` (Diselaraskan penuh dengan [`backend/prisma/schema.prisma`](../../backend/prisma/schema.prisma))
> **Catatan:** Diagram di bawah hanya menampilkan **8 model aktif** yang benar-benar ada di `schema.prisma`. Entitas rencana (`Review`, konfigurasi bobot SAW, snapshot SAW) dipisahkan sebagai `[RENCANA]`.

---

## 1. Diagram ERD (`schema.prisma`)

```mermaid
erDiagram
    USER ||--o{ ORDER : membuat
    USER ||--o{ TRANSACTION : memiliki
    USER ||--o{ EBOOK_ACCESS : menerima

    CATEGORY ||--o{ EBOOK : mengelompokkan

    ORDER ||--|{ ORDER_ITEM : memiliki
    ORDER ||--o{ PAYMENT : memiliki
    ORDER ||--o| TRANSACTION : menghasilkan
    ORDER ||--o{ EBOOK_ACCESS : menerbitkan

    EBOOK ||--o{ ORDER_ITEM : dipesan_dalam
    EBOOK ||--o{ EBOOK_ACCESS : dapat_diakses

    PAYMENT ||--o| TRANSACTION : dikonfirmasi_melalui

    USER {
        uuid id PK
        string supabase_user_id UK
        varchar full_name
        varchar email UK
        varchar phone
        enum role
        boolean is_active
    }

    CATEGORY {
        uuid id PK
        varchar name UK
        varchar slug UK
        boolean is_active
    }

    EBOOK {
        uuid id PK
        uuid category_id FK
        varchar title
        varchar author
        decimal price
        text storage_path
        int page_count
        int published_year
        decimal rating_avg
        int sales_count
        boolean is_active
    }

    ORDER {
        uuid id PK
        uuid user_id FK
        varchar order_number UK
        decimal total_amount
        enum status
        timestamptz expires_at
    }

    ORDER_ITEM {
        uuid id PK
        uuid order_id FK
        uuid ebook_id FK
        decimal unit_price
    }

    PAYMENT {
        uuid id PK
        uuid order_id FK
        varchar payment_method
        decimal amount
        enum status
        varchar external_ref
        timestamptz paid_at
    }

    TRANSACTION {
        uuid id PK
        uuid order_id FK, UK
        uuid payment_id FK, UK
        uuid user_id FK
        varchar transaction_code UK
        decimal amount
        timestamptz recorded_at
    }

    EBOOK_ACCESS {
        uuid id PK
        uuid user_id FK
        uuid ebook_id FK
        uuid order_id FK
        boolean is_revoked
        timestamptz granted_at
    }
```

> **Catatan Storage Privat:** Kolom `EBOOK.storage_path` hanya menyimpan referensi path objek PDF di Supabase Storage **bucket privat**, bukan isi biner/BLOB file PDF.

---

## 2. Ringkasan Primary Key, Foreign Key, Unique Constraint & Indeks (`[ADA]` di `schema.prisma`)

- **Primary Key (`@id @default(uuid())`):** Seluruh 8 model menggunakan `UUID` (`@db.Uuid`).
- **Unique Constraint:**
  - `User`: `supabaseUserId`, `email`
  - `Category`: `name`, `slug`
  - `Order`: `orderNumber`
  - `OrderItem`: `@@unique([orderId, ebookId])`
  - `Transaction`: `orderId`, `paymentId`, `transactionCode`
  - `EbookAccess`: `@@unique([userId, ebookId])`
- **Indeks Eksplisit (`@@index`):** `Ebook(categoryId, isActive)`, `Order(userId, status)`, `OrderItem(ebookId)`, `Payment(orderId)`, `Transaction(userId)`, `EbookAccess(ebookId)`.

---

## 3. Entitas Rencana yang Terpisah (`[RENCANA]`)

Entitas berikut belum ada di `schema.prisma` dan tidak dimasukkan ke diagram aktif di atas:
- `SawCriterionConfig` & `SawCalculationSnapshot` (`[RENCANA]` — Keputusan #5, #9, #11).
- `Review` (`[RENCANA]` — Keputusan #6 & #7).
