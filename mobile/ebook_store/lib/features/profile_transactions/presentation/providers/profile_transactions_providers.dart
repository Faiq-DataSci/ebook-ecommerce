import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/config/api_config.dart';
import '../../../../core/network/dio_client.dart';
import '../../../checkout/domain/entities/checkout_failure.dart';
import '../../../checkout/domain/entities/order_entity.dart';
import '../../../checkout/presentation/providers/checkout_provider.dart';
import '../../data/datasources/profile_mock_datasource.dart';
import '../../data/datasources/profile_remote_datasource.dart';
import '../../data/repositories/profile_repository_impl.dart';
import '../../domain/entities/profile_failure.dart';
import '../../domain/entities/user_profile_entity.dart';
import '../../domain/repositories/profile_repository.dart';
import '../../domain/usecases/profile_usecases.dart';

/// `true` bila data berasal dari sumber simulasi (wajib berlabel DATA SIMULASI).
final profileIsSimulatedProvider = Provider<bool>(
  (ref) => !ApiConfig.useRemoteCatalog,
);

final profileRemoteDataSourceProvider = Provider<ProfileRemoteDataSource>((
  ref,
) {
  return ProfileRemoteDataSourceImpl(dio: ref.watch(dioClientProvider));
});

final profileMockDataSourceProvider = Provider<ProfileMockDataSource>((ref) {
  return ProfileMockDataSource();
});

final profileRepositoryProvider = Provider<ProfileRepository>((ref) {
  return ProfileRepositoryImpl(
    remoteDataSource: ref.watch(profileRemoteDataSourceProvider),
    mockDataSource: ref.watch(profileMockDataSourceProvider),
    useRemote: !ref.watch(profileIsSimulatedProvider),
  );
});

final getProfileUseCaseProvider = Provider<GetProfileUseCase>(
  (ref) => GetProfileUseCase(ref.watch(profileRepositoryProvider)),
);

final updateProfileUseCaseProvider = Provider<UpdateProfileUseCase>(
  (ref) => UpdateProfileUseCase(ref.watch(profileRepositoryProvider)),
);

final getMyOrdersUseCaseProvider = Provider<GetMyOrdersUseCase>(
  (ref) => GetMyOrdersUseCase(ref.watch(checkoutRepositoryProvider)),
);

final getOrderDetailUseCaseProvider = Provider<GetOrderDetailUseCase>(
  (ref) => GetOrderDetailUseCase(ref.watch(checkoutRepositoryProvider)),
);

/// Pesan error aman (tanpa stack trace / detail internal) dari exception apa pun.
({String message, bool unauthenticated}) describeFailure(Object error) {
  if (error is ProfileFailure) {
    return (message: error.message, unauthenticated: error.isUnauthenticated);
  }
  if (error is CheckoutFailure) {
    return (message: error.message, unauthenticated: error.statusCode == 401);
  }
  return (
    message: 'Terjadi kesalahan tak terduga. Coba lagi.',
    unauthenticated: false,
  );
}

// ---------------------------------------------------------------------------
// Profil
// ---------------------------------------------------------------------------

enum ProfileStatus { loading, loaded, error }

class ProfileState {
  final ProfileStatus status;
  final UserProfileEntity? profile;
  final String? errorMessage;
  final bool isUnauthenticated;
  final bool isSaving;

  const ProfileState({
    this.status = ProfileStatus.loading,
    this.profile,
    this.errorMessage,
    this.isUnauthenticated = false,
    this.isSaving = false,
  });

  bool get isLoading => status == ProfileStatus.loading;
  bool get hasError => status == ProfileStatus.error;

  ProfileState copyWith({
    ProfileStatus? status,
    UserProfileEntity? profile,
    String? errorMessage,
    bool clearError = false,
    bool? isUnauthenticated,
    bool? isSaving,
  }) {
    return ProfileState(
      status: status ?? this.status,
      profile: profile ?? this.profile,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
      isUnauthenticated: isUnauthenticated ?? this.isUnauthenticated,
      isSaving: isSaving ?? this.isSaving,
    );
  }
}

class ProfileNotifier extends StateNotifier<ProfileState> {
  final GetProfileUseCase _getProfile;
  final UpdateProfileUseCase _updateProfile;

  ProfileNotifier(this._getProfile, this._updateProfile, {bool autoLoad = true})
    : super(const ProfileState()) {
    if (autoLoad) load();
  }

  Future<void> load() async {
    state = state.copyWith(
      status: ProfileStatus.loading,
      clearError: true,
      isUnauthenticated: false,
    );
    try {
      final profile = await _getProfile();
      if (!mounted) return;
      state = state.copyWith(status: ProfileStatus.loaded, profile: profile);
    } catch (e) {
      if (!mounted) return;
      final info = describeFailure(e);
      state = state.copyWith(
        status: ProfileStatus.error,
        errorMessage: info.message,
        isUnauthenticated: info.unauthenticated,
      );
    }
  }

  /// Mengirim `PATCH /users/me`. Mengembalikan `null` bila sukses, atau
  /// kegagalan untuk ditampilkan pada form.
  Future<ProfileFailure?> save({String? fullName, String? phone}) async {
    if (state.isSaving) return null;
    state = state.copyWith(isSaving: true);
    try {
      final updated = await _updateProfile(fullName: fullName, phone: phone);
      if (!mounted) return null;
      state = state.copyWith(
        status: ProfileStatus.loaded,
        profile: updated,
        isSaving: false,
        clearError: true,
      );
      return null;
    } on ProfileFailure catch (f) {
      if (mounted) {
        state = state.copyWith(
          isSaving: false,
          isUnauthenticated: f.isUnauthenticated,
        );
      }
      return f;
    } catch (_) {
      if (mounted) state = state.copyWith(isSaving: false);
      return ProfileFailure.network();
    }
  }
}

final profileProvider = StateNotifierProvider<ProfileNotifier, ProfileState>((
  ref,
) {
  return ProfileNotifier(
    ref.watch(getProfileUseCaseProvider),
    ref.watch(updateProfileUseCaseProvider),
  );
});

// ---------------------------------------------------------------------------
// Riwayat pesanan
// ---------------------------------------------------------------------------

enum OrdersStatus { loading, loaded, error }

class OrdersState {
  final OrdersStatus status;
  final List<OrderEntity> orders;
  final OrderStatusEnum? filter;
  final String? errorMessage;
  final bool isUnauthenticated;

  const OrdersState({
    this.status = OrdersStatus.loading,
    this.orders = const <OrderEntity>[],
    this.filter,
    this.errorMessage,
    this.isUnauthenticated = false,
  });

  bool get isLoading => status == OrdersStatus.loading;
  bool get hasError => status == OrdersStatus.error;

  /// Pesanan setelah filter status. Backend `orders/me` mendukung `status`,
  /// tetapi [CheckoutRepository] belum meneruskannya, sehingga filter dilakukan
  /// di klien atas halaman pertama (maks 50 pesanan).
  List<OrderEntity> get visible => filter == null
      ? orders
      : orders.where((o) => o.status == filter).toList();

  OrdersState copyWith({
    OrdersStatus? status,
    List<OrderEntity>? orders,
    OrderStatusEnum? filter,
    bool clearFilter = false,
    String? errorMessage,
    bool clearError = false,
    bool? isUnauthenticated,
  }) {
    return OrdersState(
      status: status ?? this.status,
      orders: orders ?? this.orders,
      filter: clearFilter ? null : (filter ?? this.filter),
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
      isUnauthenticated: isUnauthenticated ?? this.isUnauthenticated,
    );
  }
}

class OrdersNotifier extends StateNotifier<OrdersState> {
  final GetMyOrdersUseCase _getMyOrders;

  OrdersNotifier(this._getMyOrders, {bool autoLoad = true})
    : super(const OrdersState()) {
    if (autoLoad) load();
  }

  Future<void> load() async {
    state = state.copyWith(
      status: OrdersStatus.loading,
      clearError: true,
      isUnauthenticated: false,
    );
    try {
      final orders = await _getMyOrders();
      if (!mounted) return;
      state = state.copyWith(status: OrdersStatus.loaded, orders: orders);
    } catch (e) {
      if (!mounted) return;
      final info = describeFailure(e);
      state = state.copyWith(
        status: OrdersStatus.error,
        errorMessage: info.message,
        isUnauthenticated: info.unauthenticated,
      );
    }
  }

  void setFilter(OrderStatusEnum? status) {
    state = status == null
        ? state.copyWith(clearFilter: true)
        : state.copyWith(filter: status);
  }
}

final ordersProvider = StateNotifierProvider<OrdersNotifier, OrdersState>((
  ref,
) {
  return OrdersNotifier(ref.watch(getMyOrdersUseCaseProvider));
});

/// Detail pesanan (`GET /orders/:id`) berdasarkan ID, selalu diambil segar.
final orderDetailProvider = FutureProvider.autoDispose
    .family<OrderEntity, String>((ref, orderId) {
      return ref.watch(getOrderDetailUseCaseProvider)(orderId);
    });
