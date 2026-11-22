enum CartFailureType {
  network,
  invalidPromo,
  emptySelection,
  server,
}

class CartFailure implements Exception {
  final CartFailureType type;
  final String message;

  const CartFailure(this.type, this.message);

  const CartFailure.network([
    String message =
        'Gagal memuat keranjang belanja dari server. Periksa koneksi internet dan coba lagi.',
  ]) : this(CartFailureType.network, message);

  const CartFailure.invalidPromo([
    String message =
        'Kode promo tidak ditemukan atau sudah kedaluwarsa. Gunakan BUKUBARU atau SAWHEMAT.',
  ]) : this(CartFailureType.invalidPromo, message);

  const CartFailure.emptySelection([
    String message =
        'Pilih minimal 1 e-book di keranjang sebelum melanjutkan ke checkout.',
  ]) : this(CartFailureType.emptySelection, message);

  @override
  String toString() => message;
}
