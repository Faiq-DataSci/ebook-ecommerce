import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/config/api_config.dart';
import '../../../../core/network/dio_client.dart';
import '../../../../core/utils/rupiah_formatter.dart';
import '../../../catalog/domain/entities/catalog_ebook.dart';
import '../../data/datasources/cart_mock_datasource.dart';
import '../../data/datasources/cart_remote_datasource.dart';
import '../../data/repositories/cart_repository_impl.dart';
import '../../domain/entities/cart_failure.dart';
import '../../domain/entities/cart_item.dart';
import '../../domain/entities/cart_promo.dart';
import '../../domain/repositories/cart_repository.dart';

enum CartStatus { loading, loaded, empty, error }

class CartState {
  final CartStatus status;
  final List<CartItem> items;
  final List<CartItem> recommendedItems;
  final String promoInput;
  final CartPromo? activePromo;
  final String? promoError;
  final int cloudSyncFee;
  final String? errorMessage;
  final bool isMock;

  const CartState({
    this.status = CartStatus.loaded,
    this.items = CartMockDataSourceImpl.initialCartItems,
    this.recommendedItems = CartMockDataSourceImpl.emptyStateSawRecommendations,
    this.promoInput = 'BUKUBARU',
    this.activePromo = CartMockDataSourceImpl.defaultPromo,
    this.promoError,
    this.cloudSyncFee = CartMockDataSourceImpl.defaultCloudSyncFee,
    this.errorMessage,
    this.isMock = true,
  });

  int get totalItemsCount => items.length;

  List<CartItem> get selectedItems =>
      items.where((item) => item.isSelected).toList();

  int get selectedCount => selectedItems.length;

  bool get isAllSelected =>
      items.isNotEmpty && items.every((item) => item.isSelected);

  int get subtotalPrice =>
      selectedItems.fold<int>(0, (sum, item) => sum + item.price);

  int get appliedDiscount {
    if (selectedCount == 0 || activePromo == null) {
      return 0;
    }
    return activePromo!.discountAmount.clamp(0, subtotalPrice);
  }

  int get appliedCloudFee => selectedCount > 0 ? cloudSyncFee : 0;

  int get totalPayable =>
      (subtotalPrice - appliedDiscount + appliedCloudFee).clamp(0, 999999999);

  String get formattedSubtotal => formatRupiah(subtotalPrice);

  String get formattedDiscount => formatRupiah(appliedDiscount);

  String get formattedCloudFee => formatRupiah(appliedCloudFee);

  String get formattedTotalPayable => formatRupiah(totalPayable);

  CartState copyWith({
    CartStatus? status,
    List<CartItem>? items,
    List<CartItem>? recommendedItems,
    String? promoInput,
    CartPromo? activePromo,
    bool clearActivePromo = false,
    String? promoError,
    bool clearPromoError = false,
    int? cloudSyncFee,
    String? errorMessage,
    bool clearErrorMessage = false,
    bool? isMock,
  }) {
    return CartState(
      status: status ?? this.status,
      items: items ?? this.items,
      recommendedItems: recommendedItems ?? this.recommendedItems,
      promoInput: promoInput ?? this.promoInput,
      activePromo: clearActivePromo ? null : (activePromo ?? this.activePromo),
      promoError: clearPromoError ? null : (promoError ?? this.promoError),
      cloudSyncFee: cloudSyncFee ?? this.cloudSyncFee,
      errorMessage: clearErrorMessage
          ? null
          : (errorMessage ?? this.errorMessage),
      isMock: isMock ?? this.isMock,
    );
  }
}

final cartRemoteDataSourceProvider = Provider<CartRemoteDataSource>((ref) {
  final dio = ref.watch(dioClientProvider);
  return CartRemoteDataSourceImpl(dio: dio);
});

final cartMockDataSourceProvider = Provider<CartMockDataSource>((ref) {
  return CartMockDataSourceImpl();
});

final cartRepositoryProvider = Provider<CartRepository>((ref) {
  final remote = ref.watch(cartRemoteDataSourceProvider);
  final mock = ref.watch(cartMockDataSourceProvider);
  return CartRepositoryImpl(
    remoteDataSource: remote,
    mockDataSource: mock,
    useRemote: ApiConfig.useRemoteCatalog,
  );
});

class CartNotifier extends StateNotifier<CartState> {
  final CartRepository repository;

  CartNotifier({required this.repository, bool isMock = true})
    : super(CartState(isMock: isMock));

  Future<void> loadCart() async {
    state = state.copyWith(status: CartStatus.loading, clearErrorMessage: true);

    try {
      final items = await repository.getCartItems();
      final recommendations = await repository.getRecommendedSawItems();

      state = state.copyWith(
        status: items.isEmpty ? CartStatus.empty : CartStatus.loaded,
        items: items,
        recommendedItems: recommendations,
        clearErrorMessage: true,
      );
    } on CartFailure catch (e) {
      state = state.copyWith(status: CartStatus.error, errorMessage: e.message);
    } catch (_) {
      state = state.copyWith(
        status: CartStatus.error,
        errorMessage:
            'Gagal memuat keranjang belanja dari server. Periksa koneksi dan coba lagi.',
      );
    }
  }

  void toggleSelectAll() {
    if (state.items.isEmpty) return;
    final targetSelected = !state.isAllSelected;
    final updated = state.items
        .map((item) => item.copyWith(isSelected: targetSelected))
        .toList();
    state = state.copyWith(items: updated);
  }

  void toggleItemSelection(String itemId) {
    final updated = state.items.map((item) {
      if (item.id == itemId) {
        return item.copyWith(isSelected: !item.isSelected);
      }
      return item;
    }).toList();
    state = state.copyWith(items: updated);
  }

  void removeItem(String itemId) {
    final updated = state.items.where((item) => item.id != itemId).toList();
    state = state.copyWith(
      items: updated,
      status: updated.isEmpty ? CartStatus.empty : CartStatus.loaded,
    );
  }

  void removeSelectedItems() {
    final updated = state.items.where((item) => !item.isSelected).toList();
    state = state.copyWith(
      items: updated,
      status: updated.isEmpty ? CartStatus.empty : CartStatus.loaded,
    );
  }

  void clearCart() {
    state = state.copyWith(items: const <CartItem>[], status: CartStatus.empty);
  }

  void addItem(CartItem item) {
    final existingIndex = state.items.indexWhere((i) => i.id == item.id);
    if (existingIndex >= 0) {
      final updated = List<CartItem>.from(state.items);
      updated[existingIndex] = updated[existingIndex].copyWith(
        isSelected: true,
      );
      state = state.copyWith(items: updated, status: CartStatus.loaded);
      return;
    }

    final updated = List<CartItem>.from(state.items)..add(item);
    state = state.copyWith(items: updated, status: CartStatus.loaded);
  }

  void addCatalogEbook(CatalogEbook ebook) {
    addItem(
      CartItem(
        id: ebook.id,
        title: ebook.title,
        author: ebook.author,
        pageCount: ebook.pageCount ?? 320,
        category: ebook.categoryName ?? 'Teknologi',
        sawRankLabel: 'Rank #1 SAW (V: 0.942)',
        isTopSawRank: ebook.id == 'eb-007',
        formatLabel: 'PDF',
        licenseLabel: '1 Lisensi Digital',
        coverUrl: ebook.coverUrl,
        price: ebook.price,
        ratingAvg: ebook.ratingAvg,
        isSelected: true,
      ),
    );
  }

  void updatePromoInput(String value) {
    state = state.copyWith(
      promoInput: value.toUpperCase(),
      clearPromoError: true,
    );
  }

  Future<bool> applyPromoCode([String? customCode]) async {
    final codeToValidate = (customCode ?? state.promoInput)
        .trim()
        .toUpperCase();
    if (codeToValidate.isEmpty) {
      state = state.copyWith(
        promoError: 'Masukkan kode promo terlebih dahulu.',
      );
      return false;
    }

    try {
      final promo = await repository.validatePromoCode(codeToValidate);
      state = state.copyWith(
        promoInput: promo.code,
        activePromo: promo,
        clearPromoError: true,
      );
      return true;
    } on CartFailure catch (e) {
      state = state.copyWith(promoError: e.message);
      return false;
    } catch (_) {
      state = state.copyWith(
        promoError: 'Kode promo tidak dapat diverifikasi saat ini.',
      );
      return false;
    }
  }

  void removeActivePromo() {
    state = state.copyWith(clearActivePromo: true, clearPromoError: true);
  }

  void setLoadStatus(CartStatus status) {
    if (status == CartStatus.empty) {
      state = state.copyWith(
        status: CartStatus.empty,
        items: const <CartItem>[],
        clearErrorMessage: true,
      );
      return;
    }
    if (status == CartStatus.error) {
      state = state.copyWith(
        status: CartStatus.error,
        errorMessage:
            'Gagal memuat keranjang belanja dari server. Menampilkan mode simulasi.',
      );
      return;
    }
    if (status == CartStatus.loaded && state.items.isEmpty) {
      state = state.copyWith(
        status: CartStatus.loaded,
        items: CartMockDataSourceImpl.initialCartItems,
        clearErrorMessage: true,
      );
      return;
    }
    state = state.copyWith(status: status, clearErrorMessage: true);
  }

  Future<void> retryLoad() async {
    state = state.copyWith(
      status: CartStatus.loaded,
      items: CartMockDataSourceImpl.initialCartItems,
      recommendedItems: CartMockDataSourceImpl.emptyStateSawRecommendations,
      promoInput: 'BUKUBARU',
      activePromo: CartMockDataSourceImpl.defaultPromo,
      clearPromoError: true,
      clearErrorMessage: true,
    );
  }
}

final cartProvider = StateNotifierProvider<CartNotifier, CartState>((ref) {
  final repository = ref.watch(cartRepositoryProvider);
  return CartNotifier(
    repository: repository,
    isMock: !ApiConfig.useRemoteCatalog,
  );
});
