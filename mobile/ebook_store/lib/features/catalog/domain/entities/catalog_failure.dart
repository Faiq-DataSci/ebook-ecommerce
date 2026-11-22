enum CatalogFailureType { network, notFound, invalidRequest, server, unknown }

/// Catalog error with a user-facing message: what went wrong and how to fix
/// it, without technical jargon (design.md §5.8).
class CatalogFailure implements Exception {
  final CatalogFailureType type;
  final String message;

  const CatalogFailure(this.type, this.message);

  const CatalogFailure.network()
    : type = CatalogFailureType.network,
      message =
          'Tidak dapat terhubung ke server katalog. Periksa koneksi internet, lalu coba lagi.';

  const CatalogFailure.notFound()
    : type = CatalogFailureType.notFound,
      message = 'E-book tidak ditemukan atau sudah tidak tersedia.';

  const CatalogFailure.invalidRequest()
    : type = CatalogFailureType.invalidRequest,
      message = 'Permintaan katalog tidak valid. Ubah filter, lalu coba lagi.';

  const CatalogFailure.server()
    : type = CatalogFailureType.server,
      message =
          'Server katalog sedang bermasalah. Coba lagi beberapa saat lagi.';

  const CatalogFailure.unknown()
    : type = CatalogFailureType.unknown,
      message = 'Katalog gagal dimuat. Coba lagi.';

  @override
  String toString() => 'CatalogFailure($type): $message';
}
