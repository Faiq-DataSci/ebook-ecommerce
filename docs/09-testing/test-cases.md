# Kasus Uji (`Test Cases`)

**Status:** `[PROPOSED]` — Daftar skenario uji target untuk implementasi mendatang; belum ada yang dieksekusi karena modul bisnis belum tersedia.

---

## 1. Kasus Uji Fungsional & Keamanan (`[PROPOSED]`)

| ID | Modul | Skenario Uji | Hasil yang Diharapkan | Status |
|---|---|---|---|---|
| **TC-AUTH-01** | Authentication | Pelanggan registrasi dengan email valid & password kuat | Status `201 Created`, `password_hash` tidak dikembalikan | `[NOT AVAILABLE]` |
| **TC-AUTH-02** | Authentication | Registrasi dengan email yang sudah terdaftar | Status `409 Conflict` | `[NOT AVAILABLE]` |
| **TC-AUTH-03** | Authorization | Pelanggan mengakses endpoint admin (`/api/v1/admin/*`) | Status `403 Forbidden` | `[NOT AVAILABLE]` |
| **TC-CAT-01** | E-Book Catalog | Pengunjung melihat daftar & detail e-book aktif | Status `200 OK`, `storage_path` privat tidak terekspos | `[NOT AVAILABLE]` |
| **TC-SAW-01** | SPK SAW | Klien meminta rekomendasi e-book | Backend menghitung skor SAW dan mengembalikan urutan peringkat | `[NOT AVAILABLE]` |
| **TC-ORD-01** | Order | Pelanggan membuat pesanan; harga dihitung dari DB | Status `201 Created`, `totalAmount` sesuai harga DB | `[NOT AVAILABLE]` |
| **TC-PAY-01** | Payment | Verifikasi pembayaran valid (`VERIFIED`) | `Order -> PAID`, `Transaction` tercatat, `Ebook Access` aktif | `[NOT AVAILABLE]` |
| **TC-PAY-02** | Payment | Callback verifikasi dikirim dua kali (duplikat) | Idempoten; tidak ada duplikasi `Transaction` atau `Ebook Access` | `[NOT AVAILABLE]` |
| **TC-ACC-01** | E-Book Access | Pelanggan meminta akses e-book yang **belum** dibeli | Status `403 Forbidden`, tanpa *signed URL* | `[NOT AVAILABLE]` |
| **TC-ACC-02** | E-Book Access | Pelanggan meminta akses e-book yang **sudah** dibeli & `PAID` | Status `200 OK`, mengembalikan *signed URL* sementara | `[NOT AVAILABLE]` |
