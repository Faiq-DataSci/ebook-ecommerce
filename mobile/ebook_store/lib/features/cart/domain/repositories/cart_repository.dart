import '../entities/cart_item.dart';
import '../entities/cart_promo.dart';

abstract class CartRepository {
  Future<List<CartItem>> getCartItems();
  Future<List<CartItem>> getRecommendedSawItems();
  Future<CartPromo> validatePromoCode(String code);
}
