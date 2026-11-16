import '../../domain/entities/catalog_category.dart';
import '../../domain/entities/catalog_ebook.dart';
import '../../domain/entities/catalog_filter.dart';
import '../../domain/entities/catalog_page.dart';
import '../../domain/repositories/catalog_repository.dart';
import '../datasources/catalog_mock_datasource.dart';
import '../datasources/catalog_remote_datasource.dart';

class CatalogRepositoryImpl implements CatalogRepository {
  final CatalogRemoteDataSource remoteDataSource;
  final CatalogMockDataSource mockDataSource;
  final bool useRemote;

  CatalogRepositoryImpl({
    required this.remoteDataSource,
    required this.mockDataSource,
    this.useRemote = false,
  });

  @override
  Future<List<CatalogCategory>> getCategories() async {
    if (useRemote) {
      return await remoteDataSource.getCategories();
    }
    return await mockDataSource.getCategories();
  }

  @override
  Future<CatalogPage> getEbooks({
    required CatalogFilter filter,
    int page = 1,
    int limit = 20,
  }) async {
    if (useRemote) {
      return await remoteDataSource.getEbooks(
        filter: filter,
        page: page,
        limit: limit,
      );
    }
    return await mockDataSource.getEbooks(
      filter: filter,
      page: page,
      limit: limit,
    );
  }

  @override
  Future<CatalogEbook> getEbookById(String id) async {
    if (useRemote) {
      return await remoteDataSource.getEbookById(id);
    }
    return await mockDataSource.getEbookById(id);
  }
}
