import '../../domain/entities/cart_item.dart';
import '../../domain/entities/cart_promo.dart';
import '../../domain/repositories/cart_repository.dart';
import '../datasources/cart_mock_datasource.dart';
import '../datasources/cart_remote_datasource.dart';

class CartRepositoryImpl implements CartRepository {
  final CartRemoteDataSource remoteDataSource;
  final CartMockDataSource mockDataSource;
  final bool useRemote;

  const CartRepositoryImpl({
    required this.remoteDataSource,
    required this.mockDataSource,
    this.useRemote = false,
  });

  @override
  Future<List<CartItem>> getCartItems() {
    if (useRemote) {
      return remoteDataSource.getCartItems();
    }
    return mockDataSource.getCartItems();
  }

  @override
  Future<List<CartItem>> getRecommendedSawItems() {
    if (useRemote) {
      return remoteDataSource.getRecommendedSawItems();
    }
    return mockDataSource.getRecommendedSawItems();
  }

  @override
  Future<CartPromo> validatePromoCode(String code) {
    if (useRemote) {
      return remoteDataSource.validatePromoCode(code);
    }
    return mockDataSource.validatePromoCode(code);
  }
}
