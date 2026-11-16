import '../../domain/entities/catalog_ebook.dart';

class CatalogEbookModel extends CatalogEbook {
  const CatalogEbookModel({
    required super.id,
    required super.title,
    required super.author,
    required super.price,
    super.categoryId,
    super.categoryName,
    super.coverUrl,
    super.description,
    super.ratingAvg = 0,
    super.salesCount = 0,
    super.pageCount,
    super.publishedYear,
    super.createdAt,
  });

  factory CatalogEbookModel.fromJson(Map<String, dynamic> json) {
    // 1. Parsing price: bisa berupa Decimal string ("40000.00"), double, atau int
    int parsedPrice = 0;
    final rawPrice = json['price'];
    if (rawPrice is num) {
      parsedPrice = rawPrice.round();
    } else if (rawPrice is String) {
      final doubleVal = double.tryParse(rawPrice) ?? 0.0;
      parsedPrice = doubleVal.round();
    }

    // 2. Parsing ratingAvg: bisa berupa Decimal string ("4.80") atau num
    double parsedRating = 0.0;
    final rawRating = json['ratingAvg'] ?? json['rating_avg'];
    if (rawRating is num) {
      parsedRating = rawRating.toDouble();
    } else if (rawRating is String) {
      parsedRating = double.tryParse(rawRating) ?? 0.0;
    }

    // 3. Parsing salesCount
    int parsedSales = 0;
    final rawSales = json['salesCount'] ?? json['sales_count'];
    if (rawSales is num) {
      parsedSales = rawSales.toInt();
    } else if (rawSales is String) {
      parsedSales = int.tryParse(rawSales) ?? 0;
    }

    // 4. Parsing Category (bisa flat categoryId/categoryName atau nested object category)
    String? categoryId =
        json['categoryId']?.toString() ?? json['category_id']?.toString();
    String? categoryName = json['categoryName']?.toString();
    final nestedCategory = json['category'];
    if (nestedCategory is Map<String, dynamic>) {
      categoryId ??= nestedCategory['id']?.toString();
      categoryName ??= nestedCategory['name']?.toString();
    }

    // 5. Parsing tanggal createdAt
    DateTime? parsedCreatedAt;
    final rawCreatedAt = json['createdAt'] ?? json['created_at'];
    if (rawCreatedAt is String && rawCreatedAt.isNotEmpty) {
      parsedCreatedAt = DateTime.tryParse(rawCreatedAt);
    }

    return CatalogEbookModel(
      id: json['id']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      author: json['author']?.toString() ?? '',
      price: parsedPrice,
      categoryId: categoryId,
      categoryName: categoryName,
      coverUrl: json['coverUrl']?.toString() ?? json['cover_url']?.toString(),
      description: json['description']?.toString(),
      ratingAvg: parsedRating,
      salesCount: parsedSales,
      pageCount: json['pageCount'] is num
          ? (json['pageCount'] as num).toInt()
          : int.tryParse(json['pageCount']?.toString() ?? ''),
      publishedYear: json['publishedYear'] is num
          ? (json['publishedYear'] as num).toInt()
          : int.tryParse(json['publishedYear']?.toString() ?? ''),
      createdAt: parsedCreatedAt,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'author': author,
        'price': price,
        'categoryId': categoryId,
        'categoryName': categoryName,
        'coverUrl': coverUrl,
        'description': description,
        'ratingAvg': ratingAvg,
        'salesCount': salesCount,
        'pageCount': pageCount,
        'publishedYear': publishedYear,
        'createdAt': createdAt?.toIso8601String(),
      };
}
