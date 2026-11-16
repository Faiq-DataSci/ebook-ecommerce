import 'catalog_ebook.dart';

/// One page of `GET /api/v1/ebooks` results plus its `meta` block.
class CatalogPage {
  final List<CatalogEbook> items;
  final int page;
  final int limit;
  final int total;
  final int totalPages;

  const CatalogPage({
    required this.items,
    required this.page,
    required this.limit,
    required this.total,
    required this.totalPages,
  });

  bool get hasMore => page < totalPages;
}
