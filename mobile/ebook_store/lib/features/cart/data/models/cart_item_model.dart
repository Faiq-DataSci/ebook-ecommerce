import '../../domain/entities/cart_item.dart';

class CartItemModel extends CartItem {
  const CartItemModel({
    required super.id,
    required super.title,
    required super.author,
    required super.pageCount,
    required super.category,
    required super.sawRankLabel,
    super.isTopSawRank = false,
    super.formatLabel = 'PDF',
    super.licenseLabel = '1 Lisensi Digital',
    super.coverUrl,
    required super.price,
    super.originalPrice,
    super.ratingAvg = 4.8,
    super.isSelected = true,
  });

  factory CartItemModel.fromJson(Map<String, dynamic> json) {
    return CartItemModel(
      id: (json['id'] ?? '').toString(),
      title: (json['title'] ?? '').toString(),
      author: (json['author'] ?? '').toString(),
      pageCount: (json['pageCount'] as num?)?.toInt() ?? 300,
      category: (json['category'] ?? 'Teknologi').toString(),
      sawRankLabel: (json['sawRankLabel'] ?? 'Rank #1 SAW (V: 0.942)')
          .toString(),
      isTopSawRank: json['isTopSawRank'] == true,
      formatLabel: (json['formatLabel'] ?? 'PDF').toString(),
      licenseLabel: (json['licenseLabel'] ?? '1 Lisensi Digital').toString(),
      coverUrl: json['coverUrl']?.toString(),
      price: (json['price'] as num?)?.toInt() ?? 0,
      originalPrice: (json['originalPrice'] as num?)?.toInt(),
      ratingAvg: (json['ratingAvg'] as num?)?.toDouble() ?? 4.8,
      isSelected: json['isSelected'] != false,
    );
  }

  @override
  Map<String, dynamic> toJson() {
    return <String, dynamic>{
      'id': id,
      'title': title,
      'author': author,
      'pageCount': pageCount,
      'category': category,
      'sawRankLabel': sawRankLabel,
      'isTopSawRank': isTopSawRank,
      'formatLabel': formatLabel,
      'licenseLabel': licenseLabel,
      'coverUrl': coverUrl,
      'price': price,
      'originalPrice': originalPrice,
      'ratingAvg': ratingAvg,
      'isSelected': isSelected,
    };
  }
}
