# Entity Relationship Diagram (ERD)

**Status:** `[PROPOSED]` — Rancangan konseptual awal; belum ada implementasi database aktual di repository.

---

## 1. Diagram ERD (`[PROPOSED]`)

```mermaid
erDiagram
    CUSTOMERS ||--o{ ORDERS : "membuat"
    CUSTOMERS ||--o{ TRANSACTIONS : "memiliki"
    CUSTOMERS ||--o{ EBOOK_ACCESSES : "memperoleh"
    CATEGORIES ||--o{ EBOOKS : "mengelompokkan"
    ORDERS ||--|{ ORDER_DETAILS : "berisi"
    EBOOKS ||--o{ ORDER_DETAILS : "dipesan pada"
    ORDERS ||--o{ PAYMENTS : "dibayar melalui"
    ORDERS ||--o| TRANSACTIONS : "menghasilkan"
    PAYMENTS ||--o| TRANSACTIONS : "memvalidasi"
    ORDERS ||--o{ EBOOK_ACCESSES : "mengaktifkan"
    EBOOKS ||--o{ EBOOK_ACCESSES : "diakses melalui"

    CUSTOMERS {
        uuid id PK
        varchar full_name
        varchar email UK
        text password_hash
        boolean is_active
    }

    ADMINS {
        uuid id PK
        varchar full_name
        varchar email UK
        text password_hash
        boolean is_active
    }

    CATEGORIES {
        uuid id PK
        varchar name UK
        varchar slug UK
    }

    EBOOKS {
        uuid id PK
        uuid category_id FK
        varchar title
        varchar author
        decimal price
        text storage_path
        boolean is_active
    }

    ORDERS {
        uuid id PK
        uuid customer_id FK
        varchar order_number UK
        decimal total_amount
        varchar status
        timestamptz expires_at
    }

    ORDER_DETAILS {
        uuid id PK
        uuid order_id FK
        uuid ebook_id FK
        decimal unit_price
    }

    PAYMENTS {
        uuid id PK
        uuid order_id FK
        varchar payment_method
        decimal amount
        varchar status
        varchar external_ref
    }

    TRANSACTIONS {
        uuid id PK
        uuid order_id FK, UK
        uuid payment_id FK, UK
        uuid customer_id FK
        varchar transaction_code UK
        decimal amount
    }

    EBOOK_ACCESSES {
        uuid id PK
        uuid customer_id FK
        uuid ebook_id FK
        uuid order_id FK
        boolean is_revoked
    }
```

---

## 2. Ringkasan Kardinalitas & Integritas Referensial

- `CATEGORIES (1) -> (0..N) EBOOKS`: Satu kategori dapat memiliki banyak e-book; penghapusan kategori yang masih memiliki e-book harus ditolak (`ON DELETE RESTRICT`).
- `CUSTOMERS (1) -> (0..N) ORDERS`: Satu pelanggan dapat membuat banyak pesanan.
- `ORDERS (1) -> (1..N) ORDER_DETAILS` dan `EBOOKS (1) -> (0..N) ORDER_DETAILS`: Merepresentasikan relasi *many-to-many* antara pesanan dan e-book dengan *snapshot* harga (`unit_price`).
- `ORDERS (1) -> (0..N) PAYMENTS`: Satu pesanan dapat memiliki lebih dari satu percobaan pembayaran jika pembayaran sebelumnya gagal/kedaluwarsa, namun hanya satu pembayaran valid yang menghasilkan `TRANSACTIONS` (`1-to-1`).
- `CUSTOMERS (1) -> (0..N) EBOOK_ACCESSES <- (0..N) EBOOKS`: Diikat oleh `UNIQUE (customer_id, ebook_id)` agar satu pelanggan tidak memiliki duplikasi izin untuk judul yang sama.
