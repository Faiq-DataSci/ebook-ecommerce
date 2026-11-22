import '../entities/order_entity.dart';

abstract class CheckoutRepository {
  Future<OrderEntity> createOrder(List<String> ebookIds);
  Future<OrderEntity> getOrderById(String orderId);
  Future<List<OrderEntity>> getMyOrders({int page = 1, int limit = 10});
  Future<OrderEntity> simulatePaymentSuccess(String orderId);
}
