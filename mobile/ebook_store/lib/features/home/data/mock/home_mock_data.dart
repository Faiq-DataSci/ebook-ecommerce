import '../../../../core/constants/app_assets.dart';
import '../../domain/models/category.dart';
import '../../domain/models/ebook.dart';

/// Temporary simulation data (`DATA SIMULASI`) matching the exact Google Stitch
/// `Beranda Mobile (Neubrutalism)` reference layer before backend API integration.
class HomeMockData {
  HomeMockData._();

  static const String simulationLabel = 'DATA SIMULASI';
  static const String userName = 'Raditya';
  static const String greetingName = userName;
  static const String greetingSubtitle = 'Mau baca apa hari ini?';
  static const String sawStatusText = 'KURASI PINTAR';
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
    id: 'ebook-saw-1',
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
      id: 'ebook-new-1',
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
      id: 'ebook-new-2',
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
}
