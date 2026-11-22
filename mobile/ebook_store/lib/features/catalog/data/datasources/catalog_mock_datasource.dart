import '../../domain/entities/catalog_category.dart';
import '../../domain/entities/catalog_ebook.dart';
import '../../domain/entities/catalog_failure.dart';
import '../../domain/entities/catalog_filter.dart';
import '../../domain/entities/catalog_page.dart';
import '../../../../core/constants/app_assets.dart';
import '../models/catalog_category_model.dart';
import '../models/catalog_ebook_model.dart';

abstract class CatalogMockDataSource {
  Future<List<CatalogCategory>> getCategories();
  Future<CatalogPage> getEbooks({
    required CatalogFilter filter,
    int page = 1,
    int limit = 6,
  });
  Future<CatalogEbook> getEbookById(String id);
}

/// Implementasi sumber data simulasi ("DATA SIMULASI") sesuai aturan AGENTS.md.
/// Seluruh data diberi penanda simulasi saat API backend belum aktif.
class CatalogMockDataSourceImpl implements CatalogMockDataSource {
  static const String simulationBadge = 'DATA SIMULASI';

  static final List<CatalogCategoryModel> _categories = [
    const CatalogCategoryModel(
      id: 'cat-tek',
      name: 'Teknologi & AI',
      slug: 'teknologi-ai',
    ),
    const CatalogCategoryModel(
      id: 'cat-bis',
      name: 'Bisnis & Finansial',
      slug: 'bisnis-finansial',
    ),
    const CatalogCategoryModel(
      id: 'cat-des',
      name: 'Desain UI/UX',
      slug: 'desain-uiux',
    ),
    const CatalogCategoryModel(
      id: 'cat-sains',
      name: 'Sains Data',
      slug: 'sains-data',
    ),
    const CatalogCategoryModel(
      id: 'cat-pend',
      name: 'Pendidikan',
      slug: 'pendidikan',
    ),
    const CatalogCategoryModel(
      id: 'cat-nov',
      name: 'Novel & Sastra',
      slug: 'novel-sastra',
    ),
    const CatalogCategoryModel(
      id: 'cat-diri',
      name: 'Pengembangan Diri',
      slug: 'pengembangan-diri',
    ),
  ];

  static final List<CatalogEbookModel> _ebooks = [
    CatalogEbookModel(
      id: 'eb-001',
      title: 'Arsitektur Cloud & DevOps',
      author: 'Hendra Wijaya',
      price: 65000,
      categoryId: 'cat-tek',
      categoryName: 'Teknologi & AI',
      coverUrl: AppAssets.coverDesainSistemModern,
      description:
          'Panduan komprehensif merancang arsitektur sistem cloud berskala besar, orkestrasi kontainer, CI/CD pipeline, dan keandalan sistem modern.',
      ratingAvg: 4.9,
      salesCount: 42,
      pageCount: 320,
      publishedYear: 2024,
      createdAt: DateTime(2024, 8, 15),
    ),
    CatalogEbookModel(
      id: 'eb-002',
      title: 'Mastering Machine Learning',
      author: 'Dr. Dian Pratama',
      price: 72000,
      categoryId: 'cat-sains',
      categoryName: 'Sains Data',
      coverUrl: AppAssets.coverAlgoritmaStrukturData,
      description:
          'Kupas tuntas algoritma supervised dan unsupervised learning, implementasi model prediktif, evaluasi metrik, dan teknik feature engineering.',
      ratingAvg: 4.8,
      salesCount: 89,
      pageCount: 410,
      publishedYear: 2024,
      createdAt: DateTime(2024, 7, 20),
    ),
    CatalogEbookModel(
      id: 'eb-003',
      title: 'Prinsip Desain Interaksi',
      author: 'Maya Salsabila',
      price: 58000,
      categoryId: 'cat-des',
      categoryName: 'Desain UI/UX',
      coverUrl: AppAssets.coverPsikologiProdukDigital,
      description:
          'Fondasi perancangan antarmuka digital yang intuitif, ergonomi pengguna, micro-interactions, serta riset pengalaman pengguna (UX research).',
      ratingAvg: 4.7,
      salesCount: 35,
      pageCount: 260,
      publishedYear: 2023,
      createdAt: DateTime(2023, 11, 5),
    ),
    CatalogEbookModel(
      id: 'eb-004',
      title: 'Finansial Bebas Hutang',
      author: 'Rian Adriansyah',
      price: 45000,
      categoryId: 'cat-bis',
      categoryName: 'Bisnis & Finansial',
      description:
          'Strategi praktis mengelola arus kas pribadi dan usaha kecil, pelunasan utang terencana, serta alokasi investasi berisiko terukur.',
      ratingAvg: 4.6,
      salesCount: 120,
      pageCount: 215,
      publishedYear: 2024,
      createdAt: DateTime(2024, 4, 12),
    ),
    CatalogEbookModel(
      id: 'eb-005',
      title: 'Deep Learning dengan PyTorch',
      author: 'Arif Wicaksono',
      price: 85000,
      categoryId: 'cat-tek',
      categoryName: 'Teknologi & AI',
      coverUrl: AppAssets.coverDesainSistemModern,
      description:
          'Membangun neural networks, CNN untuk computer vision, dan transformer model untuk NLP secara praktis menggunakan framework PyTorch.',
      ratingAvg: 4.9,
      salesCount: 67,
      pageCount: 380,
      publishedYear: 2024,
      createdAt: DateTime(2024, 9, 1),
    ),
    CatalogEbookModel(
      id: 'eb-006',
      title: 'Psikologi Negosiasi',
      author: 'Cindy Lestari',
      price: 49000,
      categoryId: 'cat-bis',
      categoryName: 'Bisnis & Finansial',
      description:
          'Membaca bahasa tubuh, taktik win-win solution, dan memahami motif lawan bicara dalam kesepakatan bisnis profesional.',
      ratingAvg: 4.5,
      salesCount: 28,
      pageCount: 240,
      publishedYear: 2023,
      createdAt: DateTime(2023, 10, 18),
    ),
    CatalogEbookModel(
      id: 'eb-007',
      title: 'Desain Sistem Modern & Distribusi Layanan',
      author: 'Ahmad Fauzi',
      price: 68000,
      categoryId: 'cat-tek',
      categoryName: 'Teknologi & AI',
      coverUrl: AppAssets.coverDesainSistemModern,
      description:
          'Pola perancangan microservices, event-driven architecture, caching terdistribusi, dan mitigasi bottleneck database skala besar.',
      ratingAvg: 4.8,
      salesCount: 52,
      pageCount: 350,
      publishedYear: 2024,
      createdAt: DateTime(2024, 6, 10),
    ),
    CatalogEbookModel(
      id: 'eb-008',
      title: 'Algoritma & Struktur Data Praktis',
      author: 'Budi Santoso',
      price: 55000,
      categoryId: 'cat-tek',
      categoryName: 'Teknologi & AI',
      coverUrl: AppAssets.coverAlgoritmaStrukturData,
      description:
          'Implementasi struktur data fundamental, analisis kompleksitas Big-O, sorting, graph traversal, dan dynamic programming.',
      ratingAvg: 4.6,
      salesCount: 38,
      pageCount: 290,
      publishedYear: 2023,
      createdAt: DateTime(2023, 8, 22),
    ),
    CatalogEbookModel(
      id: 'eb-009',
      title: 'Psikologi Produk Digital',
      author: 'Sarah Utami',
      price: 49000,
      categoryId: 'cat-des',
      categoryName: 'Desain UI/UX',
      coverUrl: AppAssets.coverPsikologiProdukDigital,
      description:
          'Mengapa pengguna menyukai aplikasi tertentu? Eksplorasi cognitive bias, habit loops, mental models, dan etika desain produk digital.',
      ratingAvg: 4.9,
      salesCount: 64,
      pageCount: 230,
      publishedYear: 2024,
      createdAt: DateTime(2024, 5, 30),
    ),
    CatalogEbookModel(
      id: 'eb-010',
      title: 'Metodologi Penelitian Pendidikan Modern',
      author: 'Prof. Bambang Hermanto',
      price: 62000,
      categoryId: 'cat-pend',
      categoryName: 'Pendidikan',
      description:
          'Rancangan penelitian tindakan kelas, analisis data kuantitatif & kualitatif, serta pedoman penulisan karya ilmiah bereputasi.',
      ratingAvg: 4.4,
      salesCount: 40,
      pageCount: 310,
      publishedYear: 2023,
      createdAt: DateTime(2023, 3, 14),
    ),
    CatalogEbookModel(
      id: 'eb-011',
      title: 'Langkah Awal Python & Data Science',
      author: 'Nadia Putri',
      price: 52000,
      categoryId: 'cat-sains',
      categoryName: 'Sains Data',
      description:
          'Panduan pemula menguasai Python dasar, Pandas, NumPy, visualisasi Matplotlib & Seaborn untuk analisis data nyata.',
      ratingAvg: 4.7,
      salesCount: 75,
      pageCount: 275,
      publishedYear: 2024,
      createdAt: DateTime(2024, 7, 2),
    ),
    CatalogEbookModel(
      id: 'eb-012',
      title: 'Kumpulan Cerita Kota & Senja',
      author: 'Larasati Dewi',
      price: 42000,
      categoryId: 'cat-nov',
      categoryName: 'Novel & Sastra',
      description:
          'Kumpulan cerita pendek reflektif tentang ritme kehidupan urban, mimpi, perpisahan, dan menemukan kedamaian di tengah riuh kota.',
      ratingAvg: 0.0, // Uji kasus "Belum ada rating" per design.md §5.9
      salesCount: 12,
      pageCount: 180,
      publishedYear: 2024,
      createdAt: DateTime(2024, 9, 20),
    ),
  ];

  @override
  Future<List<CatalogCategory>> getCategories() async {
    await Future.delayed(const Duration(milliseconds: 150));
    return List.unmodifiable(_categories);
  }

  @override
  Future<CatalogPage> getEbooks({
    required CatalogFilter filter,
    int page = 1,
    int limit = 6,
  }) async {
    await Future.delayed(const Duration(milliseconds: 250));

    // Validasi rentang harga
    if (!filter.isValidPriceRange) {
      throw const CatalogFailure.invalidRequest();
    }

    final filtered = filter.apply(_ebooks);
    final total = filtered.length;
    final totalPages = (total / limit).ceil().clamp(1, 9999);

    final safePage = page.clamp(1, totalPages);
    final startIndex = (safePage - 1) * limit;

    List<CatalogEbook> pagedItems = const [];
    if (startIndex < total) {
      final endIndex = (startIndex + limit).clamp(0, total);
      pagedItems = filtered.sublist(startIndex, endIndex);
    }

    return CatalogPage(
      items: pagedItems,
      page: safePage,
      limit: limit,
      total: total,
      totalPages: totalPages,
    );
  }

  @override
  Future<CatalogEbook> getEbookById(String id) async {
    await Future.delayed(const Duration(milliseconds: 150));
    final match =
        _ebooks.where((b) => b.id == id).firstOrNull ??
        _ebooks.where((b) {
          if (id == 'ebook-saw-1' || id == 'eb-007') return b.id == 'eb-007';
          if (id == 'ebook-new-1' || id == 'eb-008') return b.id == 'eb-008';
          if (id == 'ebook-new-2' || id == 'eb-009') return b.id == 'eb-009';
          return false;
        }).firstOrNull;

    if (match != null) {
      return match;
    }
    throw const CatalogFailure.notFound();
  }
}
