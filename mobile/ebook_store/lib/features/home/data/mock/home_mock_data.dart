import '../../../../core/constants/app_assets.dart';
import '../../domain/models/category.dart';
import '../../domain/models/ebook.dart';
import '../models/saw_recommendation_model.dart';

/// Temporary simulation data (`DATA SIMULASI`) matching the exact Google Stitch
/// `Beranda Mobile (Neubrutalism)` reference layer before backend API integration.
class HomeMockData {
  HomeMockData._();

  static const String simulationLabel = 'DATA SIMULASI';
  static const String userName = 'Raditya';
  static const String greetingName = userName;
  static const String greetingSubtitle = 'Mau baca apa hari ini?';
  static const String categoryCountLabel = '6 Bidang';
  static const String flashSaleRemainingTime = '04:18:22';

  static const List<Category> categories = <Category>[
    Category(id: 'semua', label: 'Semua'),
    Category(id: 'teknologi_ai', label: 'Teknologi & AI'),
    Category(id: 'bisnis_finansial', label: 'Bisnis & Finansial'),
    Category(id: 'desain_uiux', label: 'Desain & UI/UX'),
    Category(id: 'sains_riset', label: 'Sains & Riset'),
    Category(id: 'sastra_fiksi', label: 'Sastra & Fiksi'),
  ];

  static const Ebook featuredSawBook = Ebook(
    id: 'eb-007',
    title: 'Desain Sistem Modern',
    author: 'Ahmad Fauzi',
    category: 'Teknologi & AI',
    badgeLabel: 'Rekayasa Perangkat Lunak',
    coverAsset: AppAssets.coverDesainSistemModern,
    price: 68000,
    rating: 4.8,
    reviewCount: 52,
    isbn: '978-623-001-101-4',
    sawBreakdown: SawCriteriaBreakdown(
      c1PriceWeight: 0.25,
      c2RatingWeight: 0.32,
      c3PopularityWeight: 0.23,
      c4CategoryWeight: 0.20,
      totalPreferenceScore: 0.942,
      rank: 1,
    ),
  );

  static const List<Ebook> latestReleases = <Ebook>[
    Ebook(
      id: 'eb-008',
      title: 'Algoritma & Struktur Data Praktis',
      author: 'Budi Santoso',
      category: 'Teknologi & AI',
      badgeLabel: 'TEKNOLOGI',
      coverAsset: AppAssets.coverAlgoritmaStrukturData,
      price: 55000,
      rating: 4.6,
      reviewCount: 38,
      isbn: '978-623-001-204-2',
    ),
    Ebook(
      id: 'eb-009',
      title: 'Psikologi Produk Digital',
      author: 'Sarah Utami',
      category: 'Desain & UI/UX',
      badgeLabel: 'DESAIN',
      coverAsset: AppAssets.coverPsikologiProdukDigital,
      price: 49000,
      rating: 4.9,
      reviewCount: 64,
      isbn: '978-623-001-309-4',
    ),
  ];

  static const List<EbookBundle> bundles = <EbookBundle>[
    EbookBundle(
      id: 'bundle-1',
      trackLabel: 'TRACK BACKEND & CLOUD',
      discountLabel: 'HEMAT 35%',
      isLavenderTrack: false,
      isPinkDiscount: true,
      title: 'Bundel Arsitektur Skala Besar (3 E-Book)',
      includedTitles: <String>[
        'Desain Sistem Modern & Distribusi Layanan',
        'Pola Mikroservis & Event-Driven Architecture',
        'Optimasi Kinerja Database Skala Terabyte',
      ],
      originalPrice: 245000,
      discountedPrice: 159000,
    ),
    EbookBundle(
      id: 'bundle-2',
      trackLabel: 'TRACK AI & ANALYTICS',
      discountLabel: 'HEMAT 30%',
      isLavenderTrack: true,
      isPinkDiscount: false,
      title: 'AI & Data Engineering Pack (2 E-Book)',
      includedTitles: <String>[
        'Algoritma Machine Learning Tingkat Lanjut',
        'Pipeline Data Real-time dengan Streaming',
      ],
      originalPrice: 180000,
      discountedPrice: 126000,
    ),
  ];

  static List<Ebook> get allBooks => <Ebook>[
    featuredSawBook,
    ...latestReleases,
  ];

  /// Data simulasi peringkat lengkap SPK SAW (DATA SIMULASI)
  /// memuat nilai matriks keputusan mentah (rawValues) dan normalisasi (normalizedValues)
  /// sesuai perhitungan manual pada docs/03-saw/perhitungan-manual.md.
  static const List<SawRecommendationModel> simulationSawRankingList = [
    SawRecommendationModel(
      rank: 1,
      ebookId: 'eb-007',
      title: 'Desain Sistem Modern',
      author: 'Ahmad Fauzi',
      price: '68000',
      coverUrl: AppAssets.coverDesainSistemModern,
      categoryName: 'Teknologi & AI',
      sawScore: 0.942,
      displayScore: '0.942',
      rawValues: {'C1': 68000, 'C2': 4.8, 'C3': 1450},
      normalizedValues: {'C1': 0.809, 'C2': 0.980, 'C3': 1.000},
    ),
    SawRecommendationModel(
      rank: 2,
      ebookId: 'eb-008',
      title: 'Algoritma & Struktur Data Praktis',
      author: 'Budi Santoso',
      price: '55000',
      coverUrl: AppAssets.coverAlgoritmaStrukturData,
      categoryName: 'Teknologi & AI',
      sawScore: 0.895,
      displayScore: '0.895',
      rawValues: {'C1': 55000, 'C2': 4.6, 'C3': 1200},
      normalizedValues: {'C1': 1.000, 'C2': 0.939, 'C3': 0.828},
    ),
    SawRecommendationModel(
      rank: 3,
      ebookId: 'eb-009',
      title: 'Psikologi Produk Digital',
      author: 'Sarah Utami',
      price: '49000',
      coverUrl: AppAssets.coverPsikologiProdukDigital,
      categoryName: 'Desain & UI/UX',
      sawScore: 0.864,
      displayScore: '0.864',
      rawValues: {'C1': 49000, 'C2': 4.9, 'C3': 980},
      normalizedValues: {'C1': 1.000, 'C2': 1.000, 'C3': 0.676},
    ),
    SawRecommendationModel(
      rank: 4,
      ebookId: 'eb-010',
      title: 'Manajemen Keuangan Syariah',
      author: 'Dian Pratama',
      price: '72000',
      coverUrl: '',
      categoryName: 'Bisnis & Finansial',
      sawScore: 0.831,
      displayScore: '0.831',
      rawValues: {'C1': 72000, 'C2': 4.5, 'C3': 850},
      normalizedValues: {'C1': 0.764, 'C2': 0.918, 'C3': 0.586},
    ),
    SawRecommendationModel(
      rank: 5,
      ebookId: 'eb-011',
      title: 'Sains Data & Python Dasar',
      author: 'Eko Prasetyo',
      price: '85000',
      coverUrl: '',
      categoryName: 'Sains & Riset',
      sawScore: 0.798,
      displayScore: '0.798',
      rawValues: {'C1': 85000, 'C2': 4.7, 'C3': 650},
      normalizedValues: {'C1': 0.647, 'C2': 0.959, 'C3': 0.448},
    ),
  ];
}
