/// Multi-attribute SAW score contribution received from backend (read-only display).
class SawCriteriaBreakdown {
  final double c1PriceWeight;
  final double c2RatingWeight;
  final double c3PopularityWeight;
  final double c4CategoryWeight;
  final double totalPreferenceScore;
  final int rank;

  const SawCriteriaBreakdown({
    required this.c1PriceWeight,
    required this.c2RatingWeight,
    required this.c3PopularityWeight,
    required this.c4CategoryWeight,
    required this.totalPreferenceScore,
    required this.rank,
  });

  double get c1Score => c1PriceWeight;
  double get c2Score => c2RatingWeight;
  double get c3Score => c3PopularityWeight;
  double get c4Score => c4CategoryWeight;
  double get totalPreference => totalPreferenceScore;
}

/// E-book model adapted to the Google Stitch `Beranda Mobile (Neubrutalism)` design.
class Ebook {
  final String id;
  final String title;
  final String author;
  final String category;
  final String badgeLabel;
  final String coverAsset;
  final int price;
  final double rating;
  final int reviewCount;
  final String isbn;
  final SawCriteriaBreakdown? sawBreakdown;

  const Ebook({
    required this.id,
    required this.title,
    required this.author,
    required this.category,
    required this.badgeLabel,
    required this.coverAsset,
    required this.price,
    required this.rating,
    this.reviewCount = 0,
    required this.isbn,
    this.sawBreakdown,
  });

  String get coverAssetKey => coverAsset;

  String get badgeColorKey {
    final upper = badgeLabel.toUpperCase();
    if (upper.contains('DESAIN')) {
      return 'green';
    }
    return 'blue';
  }

  String get formattedPrice {
    final digits = price.toString();
    final buffer = StringBuffer();
    for (int i = 0; i < digits.length; i++) {
      final reverseIndex = digits.length - i;
      buffer.write(digits[i]);
      if (reverseIndex > 1 && reverseIndex % 3 == 1) {
        buffer.write('.');
      }
    }
    return 'Rp ${buffer.toString()}';
  }
}

/// Thematic bundle item shown in the Stitch `FLASH SALE & BUNDEL HEMAT` section.
class EbookBundle {
  final String id;
  final String trackLabel;
  final String discountLabel;
  final bool isLavenderTrack;
  final bool isPinkDiscount;
  final String title;
  final List<String> includedTitles;
  final int originalPrice;
  final int discountedPrice;

  const EbookBundle({
    required this.id,
    required this.trackLabel,
    required this.discountLabel,
    required this.isLavenderTrack,
    required this.isPinkDiscount,
    required this.title,
    required this.includedTitles,
    required this.originalPrice,
    required this.discountedPrice,
  });

  String get trackColorKey => isLavenderTrack ? 'lavender' : 'blue';
  String get discountColorKey => isPinkDiscount ? 'pink' : 'yellow';
  String get ctaColorKey => isLavenderTrack ? 'yellow' : 'lavender';
  List<String> get includedBooks => includedTitles;

  static String formatRupiah(int amount) {
    final digits = amount.toString();
    final buffer = StringBuffer();
    for (int i = 0; i < digits.length; i++) {
      final reverseIndex = digits.length - i;
      buffer.write(digits[i]);
      if (reverseIndex > 1 && reverseIndex % 3 == 1) {
        buffer.write('.');
      }
    }
    return 'Rp ${buffer.toString()}';
  }

  String get formattedOriginalPrice => formatRupiah(originalPrice);
  String get formattedDiscountedPrice => formatRupiah(discountedPrice);
}
