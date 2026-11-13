# Sequence Diagram

**Status:** `[RENCANA]` — Seluruh alur interaksi antarkomponen di bawah ini adalah rancangan target implementasi. Klien dilarang keras menghitung skor SAW maupun menerbitkan *signed URL* secara mandiri.

Dokumen ini menyajikan **5 diagram urutan** (*Sequence Diagram*) terperinci menggunakan Mermaid.

> **Keterangan Singkatan:** **JWT** = *JSON Web Token*; **API** = *Application Programming Interface*; **SAW** = *Simple Additive Weighting*; **PDF** = *Portable Document Format*; **URL** = *Uniform Resource Locator*; **TTL** = *Time-to-Live*.

---

## 1. Login Melalui Supabase Auth dan Verifikasi JWT oleh Backend `[RENCANA]`

**Deskripsi:** Menunjukkan pemisahan tanggung jawab antara **Supabase Auth** (penerbit sesi/JWT) dan **Backend Express** (verifikator JWT, pemeriksa status aktif, dan penyinkron profil di PostgreSQL Supabase).

```mermaid
sequenceDiagram
    actor U as Pelanggan / Admin
    participant C as Mobile / Pengunjung Web / Admin Web
    participant SA as Supabase Auth
    participant API as Backend Express
    participant DB as PostgreSQL Supabase

    U->>C: Masukkan email dan password
    C->>SA: signInWithPassword(email, password)
    alt Kredensial tidak valid
        SA-->>C: Error autentikasi
        C-->>U: Tampilkan pesan error generik
    else Kredensial valid
        SA-->>C: Access Token (JWT) + Refresh Token
        C->>API: GET /api/v1/users/me (Authorization: Bearer JWT)
        API->>SA: Verifikasi JWT (getUser / JWKS)
        alt JWT tidak valid / kedaluwarsa
            SA-->>API: Invalid token
            API-->>C: 401 Unauthorized
            C-->>U: Arahkan ke halaman login
        else JWT valid
            SA-->>API: Supabase User Claims (sub, email)
            API->>DB: Cari / upsert User berdasarkan supabaseUserId
            DB-->>API: Data User (id, role, isActive)
            alt Akun nonaktif (isActive == false)
                API-->>C: 403 Forbidden
            else Akun aktif
                API-->>C: 200 OK (profil & role)
                C-->>U: Masuk ke beranda / dashboard sesuai role
            end
        end
    end
```

---

## 2. Checkout Hingga Pembayaran Terverifikasi dan Akses E-Book Dibuat `[RENCANA]`

**Deskripsi:** Alur *end-to-end* mulai dari pembuatan `Order` (dengan *snapshot* harga database), inisiasi pembayaran ke **Payment Gateway**, penyelesaian pembayaran oleh Pelanggan, hingga penerimaan status terverifikasi.

```mermaid
sequenceDiagram
    actor P as Pelanggan
    participant C as Mobile / Pengunjung Web
    participant API as Backend Express
    participant DB as PostgreSQL Supabase
    participant PG as Payment Gateway

    P->>C: Pilih e-book dan klik Checkout
    C->>API: POST /api/v1/orders { ebookIds } + Bearer JWT
    API->>API: Verifikasi JWT & role CUSTOMER + validasi Zod
    API->>DB: Cek Ebook aktif & cek belum ada EbookAccess aktif
    alt Ebook tidak aktif / sudah dimiliki
        API-->>C: 400 / 409 Conflict
    else Valid
        API->>DB: Transaksi: buat Order (PENDING) + OrderItem (unitPrice snapshot)
        DB-->>API: Order (id, orderNumber, totalAmount)
        API-->>C: 201 Created (Detail Order)
    end

    P->>C: Pilih metode pembayaran & bayar
    C->>API: POST /api/v1/payments { orderId, paymentMethod } + Bearer JWT
    API->>DB: Validasi Order milik user & masih PENDING
    API->>PG: Buat transaksi pembayaran (orderNumber, amount)
    PG-->>API: Payment token / redirect URL + externalRef
    API->>DB: Simpan Payment (status PENDING, externalRef)
    API-->>C: 201 Created (instruksi / URL pembayaran)
    C-->>P: Tampilkan halaman / instruksi Payment Gateway
    P->>PG: Selesaikan pembayaran
```

---

## 3. Webhook Payment Gateway dengan Verifikasi Signature dan Idempotensi `[RENCANA]`

**Deskripsi:** Menjelaskan bagaimana Backend Express menerima callback asinkron dari Payment Gateway, memverifikasi *signature*, mencegah duplikasi (*idempotensi*), dan mengeksekusi pembaruan status secara atomik.

```mermaid
sequenceDiagram
    participant PG as Payment Gateway
    participant API as Backend Express
    participant DB as PostgreSQL Supabase

    PG->>API: POST /api/v1/payments/webhook (payload + signature header)
    API->>API: Verifikasi signature webhook (secret gateway)
    alt Signature tidak valid
        API-->>PG: 401 / 403 Invalid Signature
    else Signature valid
        API->>DB: Cari Payment by externalRef / orderId
        alt Payment tidak ditemukan atau nominal tidak cocok
            API-->>PG: 404 / 400 Mismatch (log anomali)
        else Payment ditemukan & nominal valid
            alt Payment.status sudah VERIFIED / FAILED / EXPIRED (Idempoten)
                API-->>PG: 200 OK (Sudah diproses sebelumnya)
            else Payment.status == PENDING dan gateway == SETTLEMENT/PAID
                API->>DB: BEGIN prisma.$transaction
                API->>DB: Update Payment -> VERIFIED, paidAt = now()
                API->>DB: Update Order -> PAID
                API->>DB: Insert Transaction (transactionCode, amount)
                API->>DB: Upsert EbookAccess (isRevoked = false) + increment salesCount
                API->>DB: COMMIT
                DB-->>API: Sukses
                API-->>PG: 200 OK (Processed)
            else Gateway == FAILED / EXPIRED
                API->>DB: Update Payment & Order -> FAILED / EXPIRED
                API-->>PG: 200 OK (Updated)
            end
        end
    end
```

---

## 4. Permintaan Signed URL PDF oleh Pelanggan yang Memiliki `EbookAccess` `[RENCANA]`

**Deskripsi:** Menjamin file PDF di **Supabase Storage privat** tidak pernah diakses langsung tanpa verifikasi hak akses di backend dan tidak tersedia untuk unduhan publik bebas (Keputusan #4 `[ADA]`).

```mermaid
sequenceDiagram
    actor P as Pelanggan
    participant C as Mobile / Pengunjung Web (In-App Reader)
    participant API as Backend Express
    participant DB as PostgreSQL Supabase
    participant ST as Supabase Storage (Bucket Privat)

    P->>C: Buka pustaka & klik Baca E-Book
    C->>API: GET /api/v1/ebooks/:id/access + Bearer JWT
    API->>API: Verifikasi JWT (dapat userId)
    API->>DB: Query EbookAccess (userId, ebookId) + Ebook.storagePath
    alt Tidak ada EbookAccess atau isRevoked == true
        DB-->>API: Tidak ditemukan / dicabut
        API-->>C: 403 Forbidden (Akses ditolak)
        C-->>P: Tampilkan pesan akses tidak tersedia
    else EbookAccess aktif (!isRevoked)
        DB-->>API: storagePath privat
        API->>ST: createSignedUrl(storagePath, expiresInSeconds) [Service Role]
        ST-->>API: Signed URL sementara (TTL singkat)
        API-->>C: 200 OK { signedUrl, expiresInSeconds }
        C->>ST: Ambil stream PDF via signedUrl
        ST-->>C: Stream bytes PDF
        C-->>P: Render PDF di dalam In-App PDF Reader
    end
```

> **Catatan Penamaan Endpoint (`[RENCANA]`):** Dokumen `api-endpoints.md` mengusulkan `/api/v1/ebooks/:id/access`, sedangkan `requirements.md` mencatat `/api/v1/ebooks/:id/access-url`. Penyelarasan final dicatat pada [`design-assumptions-and-gaps.md`](./design-assumptions-and-gaps.md).

---

## 5. Permintaan Rekomendasi SAW dari Klien Sampai Hasil Dikembalikan Backend `[RENCANA]`

**Deskripsi:** Menegaskan prinsip [ADR-0002](../adr/0002-backend-only-saw.md) bahwa perhitungan SAW hanya berjalan di backend. Klien hanya mengirim parameter filter (opsional) dan menerima daftar peringkat yang sudah dihitung.

```mermaid
sequenceDiagram
    actor P as Pelanggan
    participant C as Mobile / Pengunjung Web
    participant API as Backend Express (SAW Service)
    participant DB as PostgreSQL Supabase

    P->>C: Buka menu Rekomendasi E-Book
    C->>API: GET /api/v1/ebooks/recommendations?categoryId=...
    Note over C,API: Klien tidak mengirim bobot mentah; bobot klien ditolak/diabaikan
    API->>API: Validasi query parameter (Zod)
    API->>DB: Ambil konfigurasi bobot kriteria aktif
    API->>DB: Ambil daftar Ebook aktif (isActive = true)
    DB-->>API: Bobot kriteria + matriks nilai kandidat e-book
    API->>API: Validasi Sum(bobot) == 1.0
    API->>API: Normalisasi Benefit/Cost (aman pembagi nol)
    API->>API: Hitung skor preferensi V_i = Sum(w_j * r_ij)
    API->>API: Urutkan V_i menurun + tie-breaker judul alfabetis A-Z
    opt Simpan Snapshot Audit [RENCANA - Keputusan #11]
        API->>DB: Simpan snapshot hasil perhitungan SAW
    end
    API-->>C: 200 OK [{ ebookId, title, sawScore, rank, ... }]
    C-->>P: Tampilkan daftar rekomendasi e-book berperingkat
```
