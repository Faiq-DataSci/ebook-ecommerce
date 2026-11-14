# Model Data Request & Response API (`API Data Models`)

> **Status Dokumen:** `[ADA]` (Dokumentasi skema payload)
> **Sumber:** [`api-spec.yaml`](../02-api/api-spec.yaml) & [`schema.prisma`](../../backend/prisma/schema.prisma)

---

## 1. Model Request Body (`[RENCANA]`)

### 1.1 `AuthSyncRequest` (Request Body)
| Field | Tipe | Required | Deskripsi | Sumber (Prisma Field) |
| :--- | :--- | :--- | :--- | :--- |
| `fullName` | `string` | Opsional | Nama lengkap pengguna | `User.fullName` |
| `phone` | `string` | Opsional | Nomor telepon | `User.phone` |

### 1.2 `UserProfileUpdateRequest` (Request Body)
| Field | Tipe | Required | Deskripsi | Sumber (Prisma Field) |
| :--- | :--- | :--- | :--- | :--- |
| `fullName` | `string` | Opsional | Pembaruan nama lengkap | `User.fullName` |
| `phone` | `string` | Opsional | Pembaruan nomor telepon | `User.phone` |
*(Dilarang menerima `role` atau `isActive`.)*

### 1.3 `CategoryCreateRequest` (Request Body)
| Field | Tipe | Required | Deskripsi | Sumber (Prisma Field) |
| :--- | :--- | :--- | :--- | :--- |
| `name` | `string` | Wajib | Nama kategori unik | `Category.name` |
| `slug` | `string` | Wajib | Slug URL unik | `Category.slug` |
| `description` | `string` | Opsional | Deskripsi kategori | `Category.description` |

### 1.4 `EbookCreateRequest` (Request Body — `multipart/form-data`)
| Field | Tipe | Required | Deskripsi | Sumber (Prisma Field) |
| :--- | :--- | :--- | :--- | :--- |
| `categoryId` | `uuid` | Wajib | ID kategori valid | `Ebook.categoryId` |
| `title` | `string` | Wajib | Judul e-book | `Ebook.title` |
| `author` | `string` | Wajib | Nama penulis | `Ebook.author` |
| `description` | `string` | Wajib | Deskripsi e-book | `Ebook.description` |
| `price` | `string/number` | Wajib | Harga (`>= 0`) | `Ebook.price` (`Decimal(12,2)`) |
| `pdfFile` | `binary` | Wajib | File PDF ke bucket privat | `Ebook.storagePath` |
| `coverImage` | `binary` | Opsional | Gambar sampul | `Ebook.coverUrl` |

### 1.5 `EbookUpdateRequest` (Request Body)
| Field | Tipe | Required | Deskripsi | Sumber (Prisma Field) |
| :--- | :--- | :--- | :--- | :--- |
| `categoryId` | `uuid` | Opsional | ID kategori baru | `Ebook.categoryId` |
| `title` | `string` | Opsional | Judul e-book | `Ebook.title` |
| `author` | `string` | Opsional | Nama penulis | `Ebook.author` |
| `description` | `string` | Opsional | Deskripsi | `Ebook.description` |
| `price` | `string/number` | Opsional | Harga (`>= 0`) | `Ebook.price` |
| `isActive` | `boolean` | Opsional | Status aktif/arsip | `Ebook.isActive` |

### 1.6 `OrderCreateRequest` (Request Body)
| Field | Tipe | Required | Deskripsi | Sumber (Prisma Field) |
| :--- | :--- | :--- | :--- | :--- |
| `ebookIds` | `uuid[]` | Wajib (`minItems: 1`) | Daftar ID e-book (harga tidak dari klien) | `OrderItem.ebookId` |

### 1.7 `PaymentCreateRequest` (Request Body)
| Field | Tipe | Required | Deskripsi | Sumber (Prisma Field) |
| :--- | :--- | :--- | :--- | :--- |
| `orderId` | `uuid` | Wajib | ID pesanan `PENDING` milik user | `Payment.orderId` |
| `paymentMethod` | `string` | Wajib | Metode pembayaran | `Payment.paymentMethod` |

### 1.8 `WebhookPayload` (Request Body)
| Field | Tipe | Required | Deskripsi | Sumber (Prisma Field) |
| :--- | :--- | :--- | :--- | :--- |
| `externalRef` | `string` | Wajib | Referensi unik gateway | `Payment.externalRef` |
| `status` | `string` | Wajib | Status pembayaran gateway | `Payment.status` |
| `amount` | `string` | Wajib | Nominal (`Decimal(12,2)`) | `Payment.amount` |
| `orderNumber` | `string` | Opsional | Nomor pesanan terkait | `Order.orderNumber` |
| `paidAt` | `string` | Opsional | Waktu bayar ISO 8601 | `Payment.paidAt` |

### 1.9 `SawWeightsUpdateRequest` (Request Body — `[RENCANA]`)
| Field | Tipe | Required | Deskripsi | Sumber (Prisma Field) |
| :--- | :--- | :--- | :--- | :--- |
| `weights` | `Array<{ criterion, weight }>` | Wajib | Daftar bobot (`Σ = 1.0`, `> 0`) | `[RENCANA]` (`SawCriterionConfig`) |

### 1.10 `EbookAccessUpdateRequest` (Request Body)
| Field | Tipe | Required | Deskripsi | Sumber (Prisma Field) |
| :--- | :--- | :--- | :--- | :--- |
| `isRevoked` | `boolean` | Wajib | Cabut (`true`) / pulihkan (`false`) | `EbookAccess.isRevoked` |

---

## 2. Model Response Data (`[RENCANA]`)

| Nama Model | Field Utama | Sumber Prisma & Catatan Keamanan |
| :--- | :--- | :--- |
| **`UserProfile`** | `id`, `fullName`, `email`, `role`, `isActive` | `User` *(tanpa `supabaseUserId` & tanpa `password_hash`)* |
| **`EbookSummary`** | `id`, `categoryId`, `title`, `author`, `price`, `ratingAvg`, `salesCount`, `isActive` | `Ebook` *(tanpa `storagePath`; `isActive` hanya untuk Admin)* |
| **`EbookDetail`** | `id`, `categoryId`, `title`, `author`, `description`, `price`, `coverUrl`, `pageCount`, `publishedYear`, `ratingAvg`, `salesCount` | `Ebook` *(wajib tanpa `storagePath`)* |
| **`OrderSummary`** | `id`, `orderNumber`, `totalAmount`, `status`, `expiresAt`, `createdAt` | `Order` |
| **`OrderDetail`** | `id`, `orderNumber`, `totalAmount`, `status`, `expiresAt`, `createdAt`, `items: [OrderItem]` | `Order`, `OrderItem` |
| **`OrderItem`** | `id`, `ebookId`, `unitPrice`, `createdAt`, `ebook: EbookSummary` | `OrderItem`, `Ebook` |
| **`PaymentSummary`** | `id`, `paymentMethod`, `amount`, `status`, `externalRef`, `paidAt`, `createdAt` | `Payment` |
| **`TransactionSummary`** | `id`, `transactionCode`, `amount`, `recordedAt` | `Transaction` |
| **`EbookAccessResponse`** | `signedUrl`, `expiresInSeconds` | Dihasilkan dari `Ebook.storagePath` setelah cek `EbookAccess` |
| **`SawRecommendation`** | `ebookId`, `title`, `sawScore`, `rank` | Hasil komputasi backend `[RENCANA]` |
| **`PaginationMeta`** | `page`, `limit`, `total`, `totalPages` | Metadata paginasi standar |
| **`DashboardSummary`** | `totalRevenue`, `totalOrders`, `activeEbooks`, `activeCustomers`, `topEbooks` | Agregasi DB nyata untuk Admin |
| **`SalesReport`** | `totalRevenue`, `totalOrders`, `topEbooks`, `groupBy` | Agregasi `Transaction`/`Order` `PAID` |

**Ringkasan Keamanan Model:**
- **Tidak pernah terekspos ke publik:** `storagePath`, `supabaseUserId`, `password_hash`.
- **Tidak pernah diterima dari klien publik:** `role`, `isActive`, `totalAmount`, `unitPrice`, `status`, `ratingAvg`, `salesCount`, dan bobot SAW mentah.
