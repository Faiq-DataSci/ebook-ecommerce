import '../../../../core/utils/rupiah_formatter.dart';

/// Public e-book data shown to customers (FR-C03–C05).
///
/// Mirrors the public `Ebook` DTO; `storagePath` is never part of the public
/// contract, so the client has no way to reach the private PDF from here.
class CatalogEbook {
  final String id;
  final String title;
  final String author;
  final int price;
  final String? categoryId;
  final String? categoryName;
  final String? coverUrl;
  final String? description;
  final double ratingAvg;
  final int salesCount;
  final int? pageCount;
  final int? publishedYear;
  final DateTime? createdAt;

  const CatalogEbook({
    required this.id,
    required this.title,
    required this.author,
    required this.price,
    this.categoryId,
    this.categoryName,
    this.coverUrl,
    this.description,
    this.ratingAvg = 0,
    this.salesCount = 0,
    this.pageCount,
    this.publishedYear,
    this.createdAt,
  });

  /// `ratingAvg = 0` is the schema default for books nobody has rated yet.
  bool get hasRating => ratingAvg > 0;

  String get formattedPrice => formatRupiah(price);

  CatalogEbook copyWith({String? categoryName}) {
    return CatalogEbook(
      id: id,
      title: title,
      author: author,
      price: price,
      categoryId: categoryId,
      categoryName: categoryName ?? this.categoryName,
      coverUrl: coverUrl,
      description: description,
      ratingAvg: ratingAvg,
      salesCount: salesCount,
      pageCount: pageCount,
      publishedYear: publishedYear,
      createdAt: createdAt,
    );
  }
}
