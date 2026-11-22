class CheckoutFailure implements Exception {
  final String message;
  final String code;
  final int? statusCode;

  const CheckoutFailure({
    required this.message,
    this.code = 'CHECKOUT_ERROR',
    this.statusCode,
  });

  factory CheckoutFailure.network([String? message]) => CheckoutFailure(
    message:
        message ??
        'Koneksi internet bermasalah. Periksa jaringan Anda dan coba lagi.',
    code: 'NETWORK_ERROR',
  );

  factory CheckoutFailure.unauthenticated([String? message]) => CheckoutFailure(
    message:
        message ??
        'Silakan masuk ke akun Anda terlebih dahulu untuk melanjutkan checkout.',
    code: 'UNAUTHENTICATED',
    statusCode: 401,
  );

  factory CheckoutFailure.conflict(String message) =>
      CheckoutFailure(message: message, code: 'CONFLICT', statusCode: 409);

  factory CheckoutFailure.validation(String message) => CheckoutFailure(
    message: message,
    code: 'VALIDATION_ERROR',
    statusCode: 400,
  );

  factory CheckoutFailure.server([String? message]) => CheckoutFailure(
    message: message ?? 'Terjadi kendala pada server saat memproses transaksi.',
    code: 'SERVER_ERROR',
    statusCode: 500,
  );

  @override
  String toString() => 'CheckoutFailure($code): $message';
}
