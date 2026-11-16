import 'package:flutter_test/flutter_test.dart';
import 'package:ebook_store/features/catalog/domain/entities/catalog_ebook.dart';
import 'package:ebook_store/features/catalog/domain/entities/catalog_filter.dart';

void main() {
  final sampleBooks = [
    CatalogEbook(
      id: '1',
      title: 'Arsitektur Cloud & DevOps',
      author: 'Hendra Wijaya',
      price: 65000,
      categoryId: 'cat-tek',
      categoryName: 'Teknologi & AI',
      ratingAvg: 4.9,
      createdAt: DateTime(2024, 8, 1),
    ),
    CatalogEbook(
      id: '2',
      title: 'Mastering Machine Learning',
      author: 'Dr. Dian Pratama',
      price: 72000,
      categoryId: 'cat-sains',
      categoryName: 'Sains Data',
      ratingAvg: 4.8,
      createdAt: DateTime(2024, 7, 1),
    ),
    CatalogEbook(
      id: '3',
      title: 'Finansial Bebas Hutang',
      author: 'Rian Adriansyah',
      price: 45000,
      categoryId: 'cat-bis',
      categoryName: 'Bisnis & Finansial',
      ratingAvg: 4.6,
      createdAt: DateTime(2024, 4, 1),
    ),
    CatalogEbook(
      id: '4',
      title: 'Kumpulan Cerita Senja',
      author: 'Larasati Dewi',
      price: 40000,
      categoryId: 'cat-nov',
      categoryName: 'Novel & Sastra',
      ratingAvg: 0.0,
      createdAt: DateTime(2024, 9, 1),
    ),
  ];

  group('CatalogFilter - Pencarian E-Book (FR-C04)', () {
    test('Mencari berdasarkan judul e-book', () {
      const filter = CatalogFilter(searchQuery: 'Cloud');
      final result = filter.apply(sampleBooks);
      expect(result.length, 1);
      expect(result.first.title, contains('Cloud'));
    });

    test('Mencari berdasarkan nama penulis', () {
      const filter = CatalogFilter(searchQuery: 'Dian');
      final result = filter.apply(sampleBooks);
      expect(result.length, 1);
      expect(result.first.author, contains('Dian'));
    });

    test('Pencarian tidak peka huruf besar-kecil (case-insensitive)', () {
      const filter = CatalogFilter(searchQuery: 'hendra');
      final result = filter.apply(sampleBooks);
      expect(result.length, 1);
      expect(result.first.id, '1');
    });

    test('Pencarian yang tidak cocok menghasilkan list kosong', () {
      const filter = CatalogFilter(searchQuery: 'Termodinamika Quantum');
      final result = filter.apply(sampleBooks);
      expect(result, isEmpty);
    });
  });

  group('CatalogFilter - Filter Kategori & Harga & Rating (FR-C03, design.md §8.4)', () {
    test('Filter berdasarkan categoryId', () {
      const filter = CatalogFilter(categoryId: 'cat-bis');
      final result = filter.apply(sampleBooks);
      expect(result.length, 1);
      expect(result.first.id, '3');
    });

    test('Filter rentang harga min-max', () {
      const filter = CatalogFilter(minPrice: 50000, maxPrice: 70000);
      final result = filter.apply(sampleBooks);
      expect(result.length, 1);
      expect(result.first.id, '1');
      expect(result.first.price, 65000);
    });

    test('Validasi rentang harga min <= max', () {
      const validFilter = CatalogFilter(minPrice: 40000, maxPrice: 80000);
      expect(validFilter.isValidPriceRange, isTrue);

      const invalidFilter = CatalogFilter(minPrice: 80000, maxPrice: 40000);
      expect(invalidFilter.isValidPriceRange, isFalse);
    });

    test('Filter rating minimum', () {
      const filter = CatalogFilter(minRating: 4.8);
      final result = filter.apply(sampleBooks);
      expect(result.length, 2);
      expect(result.every((b) => b.ratingAvg >= 4.8), isTrue);
    });

    test('Kombinasi pencarian, kategori, dan rentang harga sekaligus', () {
      const filter = CatalogFilter(
        searchQuery: 'DevOps',
        categoryId: 'cat-tek',
        minPrice: 60000,
        maxPrice: 70000,
      );
      final result = filter.apply(sampleBooks);
      expect(result.length, 1);
      expect(result.first.id, '1');
    });
  });

  group('CatalogFilter - Reset & Pengurutan', () {
    test('resetFiltersOnly mempertahankan searchQuery (ketentuan §7D)', () {
      const original = CatalogFilter(
        searchQuery: 'Machine Learning',
        categoryId: 'cat-sains',
        minPrice: 50000,
        minRating: 4.5,
      );
      final reset = original.resetFiltersOnly();
      expect(reset.searchQuery, 'Machine Learning');
      expect(reset.categoryId, isNull);
      expect(reset.minPrice, isNull);
      expect(reset.minRating, isNull);
      expect(reset.hasActiveFilters, isFalse);
    });

    test('activeFilterCount menghitung filter kriteria secara akurat', () {
      const f1 = CatalogFilter(searchQuery: 'test');
      expect(f1.activeFilterCount, 0);

      const f2 = CatalogFilter(
        categoryId: 'cat-tek',
        maxPrice: 100000,
        minRating: 4.0,
      );
      expect(f2.activeFilterCount, 3);
    });

    test('Urutkan Harga Terendah (hargaAsc)', () {
      const filter = CatalogFilter(sort: CatalogSortOption.hargaAsc);
      final result = filter.apply(sampleBooks);
      expect(result.first.price, 40000);
      expect(result.last.price, 72000);
    });

    test('Urutkan Harga Tertinggi (hargaDesc)', () {
      const filter = CatalogFilter(sort: CatalogSortOption.hargaDesc);
      final result = filter.apply(sampleBooks);
      expect(result.first.price, 72000);
      expect(result.last.price, 40000);
    });

    test('Urutkan Judul A ke Z (judulAsc)', () {
      const filter = CatalogFilter(sort: CatalogSortOption.judulAsc);
      final result = filter.apply(sampleBooks);
      expect(result.first.title, 'Arsitektur Cloud & DevOps');
      expect(result.last.title, 'Mastering Machine Learning');
    });
  });
}
