/// Kegagalan operasi profil dengan pesan yang aman ditampilkan ke pengguna.
class ProfileFailure implements Exception {
  final String message;
  final String code;
  final int? statusCode;

  /// Pesan per-bidang dari `error.details` backend (kunci: nama bidang).
  final Map<String, String> fieldErrors;

  const ProfileFailure({
    required this.message,
    this.code = 'PROFILE_ERROR',
    this.statusCode,
    this.fieldErrors = const <String, String>{},
  });

  factory ProfileFailure.unauthenticated([String? message]) => ProfileFailure(
    message: message ?? 'Sesimu berakhir. Masuk lagi untuk melanjutkan.',
    code: 'UNAUTHENTICATED',
    statusCode: 401,
  );

  factory ProfileFailure.forbidden([String? message]) => ProfileFailure(
    message: message ?? 'Kamu tidak punya akses untuk tindakan ini.',
    code: 'FORBIDDEN',
    statusCode: 403,
  );

  factory ProfileFailure.notFound([String? message]) => ProfileFailure(
    message: message ?? 'Profil belum ditemukan di server.',
    code: 'NOT_FOUND',
    statusCode: 404,
  );

  factory ProfileFailure.validation(
    String message, {
    Map<String, String> fieldErrors = const <String, String>{},
  }) => ProfileFailure(
    message: message,
    code: 'VALIDATION_ERROR',
    statusCode: 400,
    fieldErrors: fieldErrors,
  );

  factory ProfileFailure.server([String? message]) => ProfileFailure(
    message: message ?? 'Server sedang bermasalah. Coba lagi beberapa saat.',
    code: 'SERVER_ERROR',
    statusCode: 500,
  );

  factory ProfileFailure.network([String? message]) => ProfileFailure(
    message:
        message ??
        'Tidak dapat terhubung ke server. Periksa koneksi internetmu.',
    code: 'NETWORK_ERROR',
  );

  bool get isUnauthenticated => statusCode == 401;

  @override
  String toString() => 'ProfileFailure($code): $message';
}
