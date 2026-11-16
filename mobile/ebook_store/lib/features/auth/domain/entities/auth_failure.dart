/// Typed authentication failures providing clear error messages for Neubrutalism UI.
class AuthFailure implements Exception {
  final String title;
  final String message;
  final String? code;

  const AuthFailure({
    required this.title,
    required this.message,
    this.code,
  });

  factory AuthFailure.invalidCredentials({
    String title = 'Kredensial Belum Terdaftar',
    String message = 'Periksa format surel atau masukkan kredensial demo untuk melanjutkan.',
  }) {
    return AuthFailure(title: title, message: message, code: 'INVALID_CREDENTIALS');
  }

  factory AuthFailure.invalidInput({
    String title = 'Format Input Tidak Valid',
    required String message,
  }) {
    return AuthFailure(title: title, message: message, code: 'VALIDATION_ERROR');
  }

  factory AuthFailure.networkError({
    String title = 'Koneksi Gagal',
    String message = 'Tidak dapat menghubungi server. Periksa koneksi internet Anda.',
  }) {
    return AuthFailure(title: title, message: message, code: 'NETWORK_ERROR');
  }

  factory AuthFailure.serverError({
    String title = 'Kesalahan Server',
    String message = 'Terjadi gangguan pada layanan autentikasi. Silakan coba beberapa saat lagi.',
  }) {
    return AuthFailure(title: title, message: message, code: 'SERVER_ERROR');
  }

  @override
  String toString() => '$title: $message';
}
