import '../entities/ebook_access_entity.dart';
import '../entities/signed_url_entity.dart';

/// Kontrak repositori untuk modul Perpustakaan Digital & In-App Reader.
abstract class LibraryRepository {
  /// Mengambil daftar e-book yang dimiliki pelanggan saat ini.
  Future<List<EbookAccessEntity>> getMyLibrary();

  /// Meminta signed URL sementara berdurasi pendek untuk membaca file PDF privat.
  Future<SignedUrlEntity> getSignedAccessUrl(String ebookId);

  /// Memeriksa apakah pelanggan sudah memiliki hak akses aktif untuk e-book tertentu.
  Future<bool> checkOwnership(String ebookId);
}
