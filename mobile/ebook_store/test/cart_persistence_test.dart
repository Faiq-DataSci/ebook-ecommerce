import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ebook_store/features/cart/data/datasources/cart_local_datasource.dart';
import 'package:ebook_store/features/cart/data/datasources/cart_mock_datasource.dart';
import 'package:ebook_store/features/cart/data/datasources/cart_remote_datasource.dart';
import 'package:ebook_store/features/cart/data/repositories/cart_repository_impl.dart';
import 'package:ebook_store/features/cart/domain/entities/cart_item.dart';
import 'package:ebook_store/features/cart/presentation/providers/cart_provider.dart';

class FakeCartLocalDataSource implements CartLocalDataSource {
  List<CartItem>? storedItems;

  @override
  Future<void> clearCart() async {
    storedItems = <CartItem>[];
  }

  @override
  Future<List<CartItem>?> getCartItems() async => storedItems;

  @override
  Future<void> saveCartItems(List<CartItem> items) async {
    storedItems = List<CartItem>.from(items);
  }
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  const sampleItem1 = CartItem(
    id: 'eb-cart-persist-001',
    title: 'Clean Architecture with Flutter',
    author: 'Uncle Bob',
    pageCount: 380,
    category: 'Teknologi',
    sawRankLabel: 'Rank #1 SAW',
    price: 135000,
    isSelected: true,
  );

  const sampleItem2 = CartItem(
    id: 'eb-cart-persist-002',
    title: 'Microservices & Distributed Systems',
    author: 'Martin Fowler',
    pageCount: 450,
    category: 'Teknologi',
    sawRankLabel: 'Rank #2 SAW',
    price: 175000,
    isSelected: false,
  );

  group('P2.2 Persistensi Keranjang Belanja Tests', () {
    test('1. Serialisasi dan deserialisasi CartItem JSON akurat', () {
      final json = sampleItem1.toJson();
      expect(json['id'], 'eb-cart-persist-001');
      expect(json['title'], 'Clean Architecture with Flutter');
      expect(json['price'], 135000);
      expect(json['isSelected'], isTrue);

      final deserialized = CartItem.fromJson(json);
      expect(deserialized.id, sampleItem1.id);
      expect(deserialized.title, sampleItem1.title);
      expect(deserialized.author, sampleItem1.author);
      expect(deserialized.price, sampleItem1.price);
      expect(deserialized.isSelected, sampleItem1.isSelected);
    });

    test(
      '2. CartNotifier memulihkan item tersimpan dari local storage saat inisialisasi',
      () async {
        final fakeLocal = FakeCartLocalDataSource();
        fakeLocal.storedItems = [sampleItem1, sampleItem2];

        final mockDs = CartMockDataSourceImpl();
        final repo = CartRepositoryImpl(
          remoteDataSource: CartRemoteDataSourceImpl(dio: Dio()),
          mockDataSource: mockDs,
          useRemote: false,
        );

        final notifier = CartNotifier(
          repository: repo,
          localDataSource: fakeLocal,
          isMock: true,
        );

        await notifier.loadCart();

        expect(notifier.state.items.length, 2);
        expect(notifier.state.items.first.id, 'eb-cart-persist-001');
        expect(notifier.state.items.last.id, 'eb-cart-persist-002');
        expect(notifier.state.status, CartStatus.loaded);
      },
    );

    test(
      '3. Mutasi cart (addItem, toggleSelection, removeItem, clearCart) otomatis tersinkron ke local storage',
      () async {
        final fakeLocal = FakeCartLocalDataSource();
        final mockDs = CartMockDataSourceImpl();
        final repo = CartRepositoryImpl(
          remoteDataSource: CartRemoteDataSourceImpl(dio: Dio()),
          mockDataSource: mockDs,
          useRemote: false,
        );

        final notifier = CartNotifier(
          repository: repo,
          localDataSource: fakeLocal,
          isMock: true,
        );

        // Mulai dengan keranjang kosong
        notifier.clearCart();
        expect(fakeLocal.storedItems, isEmpty);

        // Tambah item 1
        notifier.addItem(sampleItem1);
        expect(notifier.state.items.length, 1);
        expect(fakeLocal.storedItems?.length, 1);
        expect(fakeLocal.storedItems?.first.id, 'eb-cart-persist-001');

        // Tambah item 2
        notifier.addItem(sampleItem2);
        expect(notifier.state.items.length, 2);
        expect(fakeLocal.storedItems?.length, 2);

        // Toggle selection item 1
        notifier.toggleItemSelection('eb-cart-persist-001');
        expect(notifier.state.items.first.isSelected, isFalse);
        expect(fakeLocal.storedItems?.first.isSelected, isFalse);

        // Hapus item 2
        notifier.removeItem('eb-cart-persist-002');
        expect(notifier.state.items.length, 1);
        expect(fakeLocal.storedItems?.length, 1);

        // Bersihkan keranjang
        notifier.clearCart();
        expect(notifier.state.items, isEmpty);
        expect(fakeLocal.storedItems, isEmpty);
      },
    );
  });
}
