import '../../../checkout/domain/entities/order_entity.dart';
import '../../../checkout/domain/repositories/checkout_repository.dart';
import '../entities/user_profile_entity.dart';
import '../repositories/profile_repository.dart';

class GetProfileUseCase {
  final ProfileRepository _repository;
  const GetProfileUseCase(this._repository);

  Future<UserProfileEntity> call() => _repository.getProfile();
}

class UpdateProfileUseCase {
  final ProfileRepository _repository;
  const UpdateProfileUseCase(this._repository);

  Future<UserProfileEntity> call({String? fullName, String? phone}) =>
      _repository.updateProfile(fullName: fullName, phone: phone);
}

/// Riwayat pesanan memakai kontrak `GET /api/v1/orders/me` yang sudah dibungkus
/// [CheckoutRepository]. `/transactions/my` tidak dipakai (API-GAP-07).
class GetMyOrdersUseCase {
  final CheckoutRepository _repository;
  const GetMyOrdersUseCase(this._repository);

  Future<List<OrderEntity>> call({int page = 1, int limit = 50}) =>
      _repository.getMyOrders(page: page, limit: limit);
}

class GetOrderDetailUseCase {
  final CheckoutRepository _repository;
  const GetOrderDetailUseCase(this._repository);

  Future<OrderEntity> call(String orderId) => _repository.getOrderById(orderId);
}
