import '../entities/ebook_access_entity.dart';
import '../repositories/library_repository.dart';

class GetMyLibraryUseCase {
  final LibraryRepository repository;

  GetMyLibraryUseCase(this.repository);

  Future<List<EbookAccessEntity>> call() async {
    return repository.getMyLibrary();
  }
}
