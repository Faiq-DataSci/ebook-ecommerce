import 'catalog_ebook.dart';

/// Pilihan pengurutan katalog e-book berdasarkan design.md §8.4.
enum CatalogSortOption {
  terbaru('Terbaru', 'latest'),
  hargaAsc('Harga Terendah', 'price_asc'),
  hargaDesc('Harga Tertinggi', 'price_desc'),
  ratingDesc('Rating Tertinggi', 'rating_desc'),
  judulAsc('Judul: A ke Z', 'title_asc');

  final String label;
  final String apiValue;

  const CatalogSortOption(this.label, this.apiValue);
}

/// Filter kriteria katalog e-book pelanggan (FR-C03, FR-C04, design.md §8.4).
class CatalogFilter {
  final String searchQuery;
  final String? categoryId;
  final String? categoryName;
  final String? author;
  final int? minPrice;
  final int? maxPrice;
  final double? minRating;
  final CatalogSortOption sort;

  const CatalogFilter({
    this.searchQuery = '',
    this.categoryId,
    this.categoryName,
    this.author,
    this.minPrice,
    this.maxPrice,
    this.minRating,
    this.sort = CatalogSortOption.terbaru,
  });

  /// Validasi rentang harga (nilai minimum tidak boleh lebih besar dari maksimum).
  bool get isValidPriceRange {
    if (minPrice != null && maxPrice != null) {
      return minPrice! <= maxPrice!;
    }
    return true;
  }

  /// Menghitung jumlah filter kriteria yang aktif (tidak termasuk search bar).
  /// Ditampilkan pada badge tombol FILTER (misalnya angka 3 di Stitch).
  int get activeFilterCount {
    var count = 0;
    if (categoryId != null && categoryId!.isNotEmpty && categoryId != 'semua') {
      count++;
    }
    if ((author ?? '').trim().isNotEmpty) {
      count++;
    }
    if (minPrice != null || maxPrice != null) {
      count++;
    }
    if (minRating != null && minRating! > 0) {
      count++;
    }
    return count;
  }

  bool get hasActiveFilters => activeFilterCount > 0;

  bool get hasSearchQuery => searchQuery.trim().isNotEmpty;

  /// Mengembalikan filter baru dengan kriteria di-reset,
  /// tetapi MEMPERTAHANKAN kata kunci pencarian sesuai dokumen & ketentuan §7D.
  CatalogFilter resetFiltersOnly() {
    return CatalogFilter(
      searchQuery: searchQuery,
      sort: CatalogSortOption.terbaru,
    );
  }

  /// Reset total semua filter dan pencarian.
  CatalogFilter resetAll() {
    return const CatalogFilter();
  }

  CatalogFilter copyWith({
    String? searchQuery,
    String? categoryId,
    bool clearCategoryId = false,
    String? categoryName,
    bool clearCategoryName = false,
    String? author,
    bool clearAuthor = false,
    int? minPrice,
    bool clearMinPrice = false,
    int? maxPrice,
    bool clearMaxPrice = false,
    double? minRating,
    bool clearMinRating = false,
    CatalogSortOption? sort,
  }) {
    return CatalogFilter(
      searchQuery: searchQuery ?? this.searchQuery,
      categoryId: clearCategoryId ? null : (categoryId ?? this.categoryId),
      categoryName:
          clearCategoryName ? null : (categoryName ?? this.categoryName),
      author: clearAuthor ? null : (author ?? this.author),
      minPrice: clearMinPrice ? null : (minPrice ?? this.minPrice),
      maxPrice: clearMaxPrice ? null : (maxPrice ?? this.maxPrice),
      minRating: clearMinRating ? null : (minRating ?? this.minRating),
      sort: sort ?? this.sort,
    );
  }

  /// Pure function untuk menyaring dan mengurutkan daftar e-book di sisi klien.
  List<CatalogEbook> apply(List<CatalogEbook> items) {
    var result = items.where((book) {
      // 1. Pencarian (Judul atau Penulis) - FR-C04
      final query = searchQuery.trim().toLowerCase();
      if (query.isNotEmpty) {
        final matchesTitle = book.title.toLowerCase().contains(query);
        final matchesAuthor = book.author.toLowerCase().contains(query);
        if (!matchesTitle && !matchesAuthor) {
          return false;
        }
      }

      // 2. Kategori (FR-C03)
      if (categoryId != null &&
          categoryId!.isNotEmpty &&
          categoryId != 'semua') {
        if (book.categoryId != null) {
          if (book.categoryId != categoryId) return false;
        } else if (categoryName != null && book.categoryName != null) {
          if (book.categoryName!.toLowerCase() !=
              categoryName!.toLowerCase()) {
            return false;
          }
        }
      }

      // 3. Penulis
      final authorQuery = (author ?? '').trim().toLowerCase();
      if (authorQuery.isNotEmpty) {
        if (!book.author.toLowerCase().contains(authorQuery)) {
          return false;
        }
      }

      // 4. Rentang Harga (design.md §8.4)
      if (minPrice != null && book.price < minPrice!) {
        return false;
      }
      if (maxPrice != null && book.price > maxPrice!) {
        return false;
      }

      // 5. Rating Minimum (design.md §8.4)
      if (minRating != null && minRating! > 0) {
        if (book.ratingAvg < minRating!) {
          return false;
        }
      }

      return true;
    }).toList();

    // Pengurutan
    switch (sort) {
      case CatalogSortOption.terbaru:
        result.sort((a, b) {
          final dateA = a.createdAt ?? DateTime.fromMillisecondsSinceEpoch(0);
          final dateB = b.createdAt ?? DateTime.fromMillisecondsSinceEpoch(0);
          return dateB.compareTo(dateA);
        });
        break;
      case CatalogSortOption.hargaAsc:
        result.sort((a, b) => a.price.compareTo(b.price));
        break;
      case CatalogSortOption.hargaDesc:
        result.sort((a, b) => b.price.compareTo(a.price));
        break;
      case CatalogSortOption.ratingDesc:
        result.sort((a, b) => b.ratingAvg.compareTo(a.ratingAvg));
        break;
      case CatalogSortOption.judulAsc:
        result.sort(
            (a, b) => a.title.toLowerCase().compareTo(b.title.toLowerCase()));
        break;
    }

    return result;
  }
}
