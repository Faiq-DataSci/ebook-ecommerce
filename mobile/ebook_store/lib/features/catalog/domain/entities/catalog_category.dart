/// Active category returned by `GET /api/v1/categories`.
class CatalogCategory {
  final String id;
  final String name;
  final String slug;

  const CatalogCategory({
    required this.id,
    required this.name,
    this.slug = '',
  });
}
