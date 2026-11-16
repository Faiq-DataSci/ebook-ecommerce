import '../entities/catalog_category.dart';
import '../entities/catalog_ebook.dart';
import '../entities/catalog_filter.dart';
import '../entities/catalog_page.dart';

/// Kontrak repository modul katalog e-book (FR-C03–C05, design.md §8.4).
abstract class CatalogRepository {
  /// Mengambil daftar kategori aktif (`GET /api/v1/categories`).
  Future<List<CatalogCategory>> getCategories();

  /// Mengambil daftar e-book aktif dengan filter, pencarian, dan paginasi
  /// (`GET /api/v1/ebooks`).
  Future<CatalogPage> getEbooks({
    required CatalogFilter filter,
    int page = 1,
    int limit = 20,
  });

  /// Mengambil detail satu e-book aktif berdasarkan ID (`GET /api/v1/ebooks/:id`).
  Future<CatalogEbook> getEbookById(String id);
}
