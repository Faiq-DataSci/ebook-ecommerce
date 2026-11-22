import '../../domain/entities/catalog_category.dart';

class CatalogCategoryModel extends CatalogCategory {
  const CatalogCategoryModel({
    required super.id,
    required super.name,
    super.slug = '',
  });

  factory CatalogCategoryModel.fromJson(Map<String, dynamic> json) {
    return CatalogCategoryModel(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      slug: json['slug']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toJson() => {'id': id, 'name': name, 'slug': slug};
}
