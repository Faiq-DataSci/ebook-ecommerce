import 'package:flutter_test/flutter_test.dart';
import 'package:ebook_store/features/catalog/data/models/catalog_category_model.dart';
import 'package:ebook_store/features/catalog/data/models/catalog_ebook_model.dart';

void main() {
  group('CatalogCategoryModel JSON Parsing', () {
    test('Mengurai response kategori dari format backend', () {
      final json = {
        'id': 'uuid-001',
        'name': 'Teknologi & AI',
        'slug': 'teknologi-ai',
      };
      final model = CatalogCategoryModel.fromJson(json);
      expect(model.id, 'uuid-001');
      expect(model.name, 'Teknologi & AI');
      expect(model.slug, 'teknologi-ai');
    });
  });

  group('CatalogEbookModel JSON Parsing', () {
    test('Mengurai harga string Decimal Prisma ("40000.00") menjadi int', () {
      final json = {
        'id': 'uuid-101',
        'title': 'Panduan Praktis Flutter',
        'author': 'Tim Engineer',
        'price': '40000.00',
        'ratingAvg': '4.80',
        'salesCount': 150,
        'coverUrl': 'https://example.com/cover.png',
        'category': {
          'id': 'cat-1',
          'name': 'Teknologi',
        },
      };

      final model = CatalogEbookModel.fromJson(json);
      expect(model.id, 'uuid-101');
      expect(model.price, 40000);
      expect(model.ratingAvg, 4.8);
      expect(model.salesCount, 150);
      expect(model.categoryId, 'cat-1');
      expect(model.categoryName, 'Teknologi');
      expect(model.hasRating, isTrue);
    });

    test('Menangani coverUrl null dan rating 0 secara aman', () {
      final json = {
        'id': 'uuid-102',
        'title': 'Buku Baru Belum Ada Rating',
        'author': 'Penulis Baru',
        'price': 35000,
        'rating_avg': 0,
        'sales_count': 0,
        'cover_url': null,
      };

      final model = CatalogEbookModel.fromJson(json);
      expect(model.coverUrl, isNull);
      expect(model.ratingAvg, 0.0);
      expect(model.hasRating, isFalse);
    });
  });
}
