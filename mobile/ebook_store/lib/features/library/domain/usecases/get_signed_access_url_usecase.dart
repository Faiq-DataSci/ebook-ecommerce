import '../entities/signed_url_entity.dart';
import '../repositories/library_repository.dart';

class GetSignedAccessUrlUseCase {
  final LibraryRepository repository;

  GetSignedAccessUrlUseCase(this.repository);

  Future<SignedUrlEntity> call(String ebookId) async {
    return repository.getSignedAccessUrl(ebookId);
  }
}
