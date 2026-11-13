# Gambaran Umum API (`API Overview`)

**Status:** `[NOT AVAILABLE]` (belum ada endpoint yang diimplementasikan di `backend/`) | `[PROPOSED]` (rancangan spesifikasi REST API)

---

## 1. Status Implementasi Aktual

Berdasarkan pemeriksaan terhadap direktori `backend/`, belum terdapat kode server Express, router, controller, maupun middleware. Spesifikasi OpenAPI di [api-spec.yaml](../02-api/api-spec.yaml) juga masih berstatus kerangka awal (`paths: {}`, base URL `/api/v1`).

Seluruh rancangan pada dokumen ini berstatus **`[PROPOSED]`** (*Proposed API Design*).

---

## 2. Konvensi Umum (`[PROPOSED]`)

- **Base Path:** `/api/v1` (sesuai kerangka [api-spec.yaml](../02-api/api-spec.yaml))
- **Format Pertukaran Data:** `application/json` (UTF-8)
- **Skema Autentikasi:** Bearer Token (`Authorization: Bearer <token>`)
- **Validasi Input:** Menggunakan **Zod** (`[CONFIRMED]` pada `AGENTS.md`) di sisi backend sebelum logika bisnis dijalankan.

---

## 3. Format Standar Respons (`[PROPOSED]`)

### Respons Sukses
```json
{
  "success": true,
  "message": "Deskripsi singkat hasil operasi",
  "data": {}
}
```

### Respons Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Ringkasan kesalahan untuk klien",
    "details": []
  }
}
```

---

## 4. Kode Status HTTP Standar (`[PROPOSED]`)

| HTTP Status | Makna | Penggunaan Utama |
|---|---|---|
| `200 OK` | Permintaan berhasil | Pengambilan data, pembaruan, verifikasi |
| `201 Created` | Resource baru berhasil dibuat | Registrasi, tambah e-book, buat pesanan |
| `400 Bad Request` | Input tidak valid / gagal validasi Zod | Payload salah format atau tidak lengkap |
| `401 Unauthorized` | Token tidak ada, tidak valid, atau kedaluwarsa | Akses endpoint terproteksi tanpa token valid |
| `403 Forbidden` | Role atau kepemilikan tidak mencukupi | Pelanggan mengakses endpoint admin atau e-book yang belum dibeli |
| `404 Not Found` | Resource tidak ditemukan | ID e-book, kategori, atau pesanan tidak ada |
| `409 Conflict` | Konflik data bisnis | Email sudah terdaftar, pesanan sudah dibayar |
| `500 Internal Server Error` | Kesalahan tak terduga di server | Error database atau storage (tanpa membocorkan stack trace) |
