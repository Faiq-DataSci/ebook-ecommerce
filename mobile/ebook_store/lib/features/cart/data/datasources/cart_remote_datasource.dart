import 'package:dio/dio.dart';
import '../../domain/entities/cart_failure.dart';
import '../../domain/entities/cart_item.dart';
import '../../domain/entities/cart_promo.dart';
import '../models/cart_item_model.dart';

abstract class CartRemoteDataSource {
  Future<List<CartItem>> getCartItems();
  Future<List<CartItem>> getRecommendedSawItems();
  Future<CartPromo> validatePromoCode(String code);
}

class CartRemoteDataSourceImpl implements CartRemoteDataSource {
  final Dio dio;

  const CartRemoteDataSourceImpl({required this.dio});

  @override
  Future<List<CartItem>> getCartItems() async {
    try {
      final response = await dio.get<Map<String, dynamic>>('/cart');
      final data = response.data?['data'];
      if (data is List) {
        return data
            .whereType<Map<String, dynamic>>()
            .map(CartItemModel.fromJson)
            .toList();
      }
      return const <CartItem>[];
    } on DioException catch (e) {
      throw CartFailure.network(
        e.message ?? 'Gagal memuat keranjang belanja dari server.',
      );
    }
  }

  @override
  Future<List<CartItem>> getRecommendedSawItems() async {
    try {
      final response =
          await dio.get<Map<String, dynamic>>('/recommendations/saw');
      final data = response.data?['data'];
      if (data is List) {
        return data
            .whereType<Map<String, dynamic>>()
            .map(CartItemModel.fromJson)
            .toList();
      }
      return const <CartItem>[];
    } on DioException catch (e) {
      throw CartFailure.network(
        e.message ?? 'Gagal memuat rekomendasi SAW dari server.',
      );
    }
  }

  @override
  Future<CartPromo> validatePromoCode(String code) async {
    try {
      final response = await dio.post<Map<String, dynamic>>(
        '/cart/promo/validate',
        data: <String, dynamic>{'code': code.trim().toUpperCase()},
      );
      final data = response.data?['data'];
      if (data is Map<String, dynamic>) {
        return CartPromo(
          code: (data['code'] ?? code).toString().toUpperCase(),
          badgeLabel: (data['badgeLabel'] ?? 'PROMO AKTIF').toString(),
          discountAmount: (data['discountAmount'] as num?)?.toInt() ?? 0,
        );
      }
      throw const CartFailure.invalidPromo();
    } on DioException {
      throw const CartFailure.invalidPromo();
    }
  }
}
