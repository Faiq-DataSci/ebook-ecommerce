import 'package:dio/dio.dart';
import '../models/ebook_access_model.dart';
import '../models/signed_url_model.dart';

abstract class LibraryRemoteDataSource {
  Future<List<EbookAccessModel>> getMyLibrary();
  Future<SignedUrlModel> getSignedAccessUrl(String ebookId);
  Future<bool> checkOwnership(String ebookId);
}

class LibraryRemoteDataSourceImpl implements LibraryRemoteDataSource {
  final Dio dio;

  LibraryRemoteDataSourceImpl({required this.dio});

  @override
  Future<List<EbookAccessModel>> getMyLibrary() async {
    try {
      // Catatan: Endpoint koleksi pengguna '/ebooks/my-library'
      final response = await dio.get('/ebooks/my-library');
      final data = response.data;
      if (data != null && data['data'] is List) {
        return (data['data'] as List)
            .map(
              (item) => EbookAccessModel.fromJson(item as Map<String, dynamic>),
            )
            .toList();
      }
      return <EbookAccessModel>[];
    } on DioException catch (e) {
      if (e.response?.statusCode == 401) {
        throw UnauthenticatedException(
          'Sesi Anda telah berakhir. Silakan masuk kembali.',
        );
      }
      if (e.response?.statusCode == 404) {
        return <EbookAccessModel>[];
      }
      throw Exception(
        e.response?.data?['message']?.toString() ??
            'Gagal memuat perpustakaan digital',
      );
    }
  }

  @override
  Future<SignedUrlModel> getSignedAccessUrl(String ebookId) async {
    try {
      final response = await dio.get('/ebooks/$ebookId/access-url');
      final data = response.data;
      if (data != null && data['data'] is Map<String, dynamic>) {
        return SignedUrlModel.fromJson(data['data'] as Map<String, dynamic>);
      }
      throw Exception('Format respons signed URL tidak valid');
    } on DioException catch (e) {
      final statusCode = e.response?.statusCode;
      final serverMessage = e.response?.data?['message']?.toString();

      if (statusCode == 401) {
        throw UnauthenticatedException(
          serverMessage ?? 'Sesi Anda telah berakhir. Silakan masuk kembali.',
        );
      }
      if (statusCode == 403) {
        throw EbookAccessDeniedException(
          serverMessage ??
              'Anda tidak memiliki akses aktif untuk e-book ini atau hak akses telah dicabut.',
        );
      }
      if (statusCode == 500) {
        throw SignedUrlGenerationFailedException(
          serverMessage ?? 'Gagal menyiapkan akses baca e-book sementara.',
        );
      }
      throw Exception(
        serverMessage ?? 'Gagal mendapatkan tautan akses baca e-book',
      );
    }
  }

  @override
  Future<bool> checkOwnership(String ebookId) async {
    try {
      final library = await getMyLibrary();
      return library.any((item) => item.ebookId == ebookId && item.isActive);
    } catch (_) {
      return false;
    }
  }
}

class UnauthenticatedException implements Exception {
  final String message;
  UnauthenticatedException(this.message);

  @override
  String toString() => message;
}

class EbookAccessDeniedException implements Exception {
  final String message;
  EbookAccessDeniedException(this.message);

  @override
  String toString() => message;
}

class SignedUrlGenerationFailedException implements Exception {
  final String message;
  SignedUrlGenerationFailedException(this.message);

  @override
  String toString() => message;
}
