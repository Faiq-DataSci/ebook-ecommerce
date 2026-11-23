import '../../../../core/constants/app_assets.dart';
import '../../domain/models/ebook.dart';

/// Data Transfer Object untuk respons endpoint SAW backend (`GET /api/v1/recommendations/saw`).
class SawRecommendationModel {
  final int rank;
  final String ebookId;
  final String title;
  final double sawScore;
  final String displayScore;
  final String? author;
  final String? price;
  final String? coverUrl;
  final String? categoryName;
  final Map<String, dynamic> rawValues;
  final Map<String, dynamic> normalizedValues;

  const SawRecommendationModel({
    required this.rank,
    required this.ebookId,
    required this.title,
    required this.sawScore,
    required this.displayScore,
    this.author,
    this.price,
    this.coverUrl,
    this.categoryName,
    this.rawValues = const <String, dynamic>{},
    this.normalizedValues = const <String, dynamic>{},
  });

  factory SawRecommendationModel.fromJson(Map<String, dynamic> json) {
    final rankVal = json['rank'];
    final parsedRank = rankVal is int
        ? rankVal
        : int.tryParse(rankVal?.toString() ?? '1') ?? 1;

    final scoreVal = json['sawScore'];
    final parsedScore = (scoreVal is num)
        ? scoreVal.toDouble()
        : double.tryParse(scoreVal?.toString() ?? '0') ?? 0.0;

    String? catName;
    if (json['category'] is Map) {
      catName = (json['category'] as Map<String, dynamic>)['name'] as String?;
    }

    return SawRecommendationModel(
      rank: parsedRank,
      ebookId: json['ebookId']?.toString() ?? '',
      title: json['title']?.toString() ?? '',
      sawScore: parsedScore,
      displayScore:
          json['displayScore']?.toString() ?? parsedScore.toStringAsFixed(3),
      author: json['author'] as String?,
      price: json['price']?.toString(),
      coverUrl: json['coverUrl'] as String?,
      categoryName: catName,
      rawValues: json['rawValues'] is Map
          ? Map<String, dynamic>.from(json['rawValues'] as Map)
          : const <String, dynamic>{},
      normalizedValues: json['normalizedValues'] is Map
          ? Map<String, dynamic>.from(json['normalizedValues'] as Map)
          : const <String, dynamic>{},
    );
  }

  /// Mengonversi DTO rekomendasi SAW backend menjadi model domain `Ebook`
  /// yang kompatibel dengan tampilan antarmuka `Beranda Mobile (Neubrutalism)`.
  Ebook toEbook() {
    final cleanPrice = price?.replaceAll(RegExp(r'[^0-9]'), '') ?? '';
    final parsedPrice = int.tryParse(cleanPrice) ?? 68000;

    final ratingVal = rawValues['C2'] ?? rawValues['ratingAvg'];
    final rating = (ratingVal is num) ? ratingVal.toDouble() : 4.8;

    final salesVal = rawValues['C3'] ?? rawValues['salesCount'];
    final reviewCount = (salesVal is num) ? salesVal.toInt() : 52;

    // Nilai terukur kriteria hasil normalisasi dari backend
    final c1Norm = (normalizedValues['C1'] is num)
        ? (normalizedValues['C1'] as num).toDouble()
        : 0.25;
    final c2Norm = (normalizedValues['C2'] is num)
        ? (normalizedValues['C2'] as num).toDouble()
        : 0.32;
    final c3Norm = (normalizedValues['C3'] is num)
        ? (normalizedValues['C3'] as num).toDouble()
        : 0.23;

    return Ebook(
      id: ebookId.isNotEmpty ? ebookId : 'eb-saw-$rank',
      title: title,
      author: author ?? 'Penulis E-Book',
      category: categoryName ?? 'Teknologi & AI',
      badgeLabel: categoryName ?? 'PILIHAN UTAMA',
      coverAsset: (coverUrl != null && coverUrl!.isNotEmpty)
          ? coverUrl!
          : AppAssets.coverDesainSistemModern,
      price: parsedPrice,
      rating: rating,
      reviewCount: reviewCount,
      isbn: '978-623-001-101-4',
      isRemoteSource: true,
      sawBreakdown: SawCriteriaBreakdown(
        c1PriceWeight: c1Norm,
        c2RatingWeight: c2Norm,
        c3PopularityWeight: c3Norm,
        c4CategoryWeight: 0.20,
        totalPreferenceScore: sawScore,
        rank: rank,
      ),
    );
  }
}
