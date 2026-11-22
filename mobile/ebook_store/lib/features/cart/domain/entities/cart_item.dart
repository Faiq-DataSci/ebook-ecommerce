import '../../../../core/utils/rupiah_formatter.dart';

class CartItem {
  final String id;
  final String title;
  final String author;
  final int pageCount;
  final String category;
  final String sawRankLabel;
  final bool isTopSawRank;
  final String formatLabel;
  final String licenseLabel;
  final String? coverUrl;
  final int price;
  final int? originalPrice;
  final double ratingAvg;
  final bool isSelected;

  const CartItem({
    required this.id,
    required this.title,
    required this.author,
    required this.pageCount,
    required this.category,
    required this.sawRankLabel,
    this.isTopSawRank = false,
    this.formatLabel = 'PDF',
    this.licenseLabel = '1 Lisensi Digital',
    this.coverUrl,
    required this.price,
    this.originalPrice,
    this.ratingAvg = 4.8,
    this.isSelected = true,
  });

  String get formattedPrice => formatRupiah(price);

  String? get formattedOriginalPrice =>
      originalPrice != null ? formatRupiah(originalPrice!) : null;

  bool get hasDiscount => originalPrice != null && originalPrice! > price;

  String get authorAndPagesLabel => '$author \u2022 $pageCount Hal';

  CartItem copyWith({
    String? id,
    String? title,
    String? author,
    int? pageCount,
    String? category,
    String? sawRankLabel,
    bool? isTopSawRank,
    String? formatLabel,
    String? licenseLabel,
    String? coverUrl,
    int? price,
    int? originalPrice,
    double? ratingAvg,
    bool? isSelected,
  }) {
    return CartItem(
      id: id ?? this.id,
      title: title ?? this.title,
      author: author ?? this.author,
      pageCount: pageCount ?? this.pageCount,
      category: category ?? this.category,
      sawRankLabel: sawRankLabel ?? this.sawRankLabel,
      isTopSawRank: isTopSawRank ?? this.isTopSawRank,
      formatLabel: formatLabel ?? this.formatLabel,
      licenseLabel: licenseLabel ?? this.licenseLabel,
      coverUrl: coverUrl ?? this.coverUrl,
      price: price ?? this.price,
      originalPrice: originalPrice ?? this.originalPrice,
      ratingAvg: ratingAvg ?? this.ratingAvg,
      isSelected: isSelected ?? this.isSelected,
    );
  }
}
