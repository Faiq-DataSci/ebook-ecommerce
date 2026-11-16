/// Typed authentication failures providing clear error messages for Neubrutalism UI.
class AuthFailure implements Exception {
  final String title;
  final String message;
  final String? code;
  final String? ribbon;
  final String? field;

  const AuthFailure({
    required this.title,
    required this.message,
    this.code,
    this.ribbon,
    this.field,
  });

  factory AuthFailure.invalidCredentials({
    String title = 'Kredensial Belum Terdaftar',
    String message =
        'Email atau kata sandi tidak cocok. Silakan periksa kembali kredensial Anda atau gunakan opsi pemulihan kata sandi.',
    String code = 'ERR-401',
    String ribbon = 'PERINGATAN KEAMANAN',
  }) {
    return AuthFailure(
      title: title,
      message: message,
      code: code,
      ribbon: ribbon,
      field: 'password',
    );
  }

  factory AuthFailure.invalidInput({
    String title = 'Format Input Tidak Valid',
    required String message,
    String code = 'ERR-VAL',
    String ribbon = 'VALIDASI INPUT',
    String? field,
  }) {
    return AuthFailure(
      title: title,
      message: message,
      code: code,
      ribbon: ribbon,
      field: field,
    );
  }

  factory AuthFailure.networkError({
    String title = 'Koneksi Bermasalah',
    String message =
        'Koneksi bermasalah. Periksa jaringan internet Anda dan coba kembali.',
    String code = 'ERR-NET',
    String ribbon = 'GANGGUAN JARINGAN',
  }) {
    return AuthFailure(
      title: title,
      message: message,
      code: code,
      ribbon: ribbon,
    );
  }

  factory AuthFailure.serverError({
    String title = 'Kesalahan Server',
    String message =
        'Layanan sedang mengalami gangguan. Silakan coba kembali beberapa saat lagi.',
    String code = 'ERR-500',
    String ribbon = 'KESALAHAN SERVER',
  }) {
    return AuthFailure(
      title: title,
      message: message,
      code: code,
      ribbon: ribbon,
    );
  }

  factory AuthFailure.requestError({
    String title = 'Kegagalan Autentikasi',
    String message = 'Login belum dapat diproses. Silakan coba kembali.',
    String code = 'ERR-REQ',
    String ribbon = 'KEGAGALAN SISTEM',
  }) {
    return AuthFailure(
      title: title,
      message: message,
      code: code,
      ribbon: ribbon,
    );
  }

  @override
  String toString() => '$title: $message';
}
