import '../../domain/entities/order_entity.dart';
import '../../domain/repositories/checkout_repository.dart';
import '../datasources/checkout_mock_datasource.dart';
import '../datasources/checkout_remote_datasource.dart';

class CheckoutRepositoryImpl implements CheckoutRepository {
  final CheckoutRemoteDataSource remoteDataSource;
  final CheckoutMockDataSource mockDataSource;
  final bool useRemote;

  const CheckoutRepositoryImpl({
    required this.remoteDataSource,
    required this.mockDataSource,
    this.useRemote = false,
  });

  @override
  Future<OrderEntity> createOrder(List<String> ebookIds) {
    if (useRemote) {
      return remoteDataSource.createOrder(ebookIds);
    }
    return mockDataSource.createOrder(ebookIds);
  }

  @override
  Future<OrderEntity> getOrderById(String orderId) {
    if (useRemote) {
      return remoteDataSource.getOrderById(orderId);
    }
    return mockDataSource.getOrderById(orderId);
  }

  @override
  Future<List<OrderEntity>> getMyOrders({int page = 1, int limit = 10}) {
    if (useRemote) {
      return remoteDataSource.getMyOrders(page: page, limit: limit);
    }
    return mockDataSource.getMyOrders(page: page, limit: limit);
  }

  @override
  Future<OrderEntity> simulatePaymentSuccess(String orderId) {
    return mockDataSource.markOrderPaid(orderId);
  }
}
