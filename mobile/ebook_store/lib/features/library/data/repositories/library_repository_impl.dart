import '../../domain/entities/ebook_access_entity.dart';
import '../../domain/entities/signed_url_entity.dart';
import '../../domain/repositories/library_repository.dart';
import '../datasources/library_remote_datasource.dart';

class LibraryRepositoryImpl implements LibraryRepository {
  final LibraryRemoteDataSource remoteDataSource;

  LibraryRepositoryImpl({required this.remoteDataSource});

  @override
  Future<List<EbookAccessEntity>> getMyLibrary() async {
    return remoteDataSource.getMyLibrary();
  }

  @override
  Future<SignedUrlEntity> getSignedAccessUrl(String ebookId) async {
    return remoteDataSource.getSignedAccessUrl(ebookId);
  }

  @override
  Future<bool> checkOwnership(String ebookId) async {
    return remoteDataSource.checkOwnership(ebookId);
  }
}
