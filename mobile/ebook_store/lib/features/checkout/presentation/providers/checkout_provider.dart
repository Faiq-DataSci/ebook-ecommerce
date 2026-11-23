import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/config/api_config.dart';
import '../../../../core/network/dio_client.dart';
import '../../../cart/domain/entities/cart_item.dart';
import '../../data/datasources/checkout_mock_datasource.dart';
import '../../data/datasources/checkout_remote_datasource.dart';
import '../../data/repositories/checkout_repository_impl.dart';
import '../../domain/entities/checkout_failure.dart';
import '../../domain/entities/order_entity.dart';
import '../../domain/repositories/checkout_repository.dart';
import 'checkout_state.dart';

final checkoutRemoteDataSourceProvider = Provider<CheckoutRemoteDataSource>((
  ref,
) {
  final dio = ref.watch(dioClientProvider);
  return CheckoutRemoteDataSourceImpl(dio: dio);
});

final checkoutMockDataSourceProvider = Provider<CheckoutMockDataSource>((ref) {
  return CheckoutMockDataSourceImpl();
});

final checkoutRepositoryProvider = Provider<CheckoutRepository>((ref) {
  final remote = ref.watch(checkoutRemoteDataSourceProvider);
  final mock = ref.watch(checkoutMockDataSourceProvider);
  return CheckoutRepositoryImpl(
    remoteDataSource: remote,
    mockDataSource: mock,
    useRemote: ApiConfig.useRemoteCatalog,
  );
});

class CheckoutNotifier extends StateNotifier<CheckoutState> {
  final CheckoutRepository repository;
  Timer? _statusPollingTimer;

  CheckoutNotifier({required this.repository, bool isMock = true})
    : super(CheckoutState(isMock: isMock));

  @override
  void dispose() {
    _statusPollingTimer?.cancel();
    super.dispose();
  }

  /// Memulai polling berkala status pesanan (default interval 3 detik)
  void startPollingOrderStatus({
    Duration interval = const Duration(seconds: 3),
  }) {
    _statusPollingTimer?.cancel();
    _statusPollingTimer = Timer.periodic(interval, (_) async {
      final order = state.currentOrder;
      if (order == null ||
          order.isPaid ||
          order.status == OrderStatusEnum.cancelled ||
          order.status == OrderStatusEnum.expired) {
        stopPollingOrderStatus();
        return;
      }
      try {
        final updated = await repository.getOrderById(order.id);
        if (updated.isPaid) {
          stopPollingOrderStatus();
          state = state.copyWith(
            currentOrder: updated,
            currentStep: CheckoutStep.completed,
            status: CheckoutStatus.completed,
            isSubmitting: false,
          );
        } else {
          state = state.copyWith(currentOrder: updated);
        }
      } catch (_) {
        // Retry polling silently
      }
    });
  }

  /// Menghentikan polling status pesanan
  void stopPollingOrderStatus() {
    _statusPollingTimer?.cancel();
    _statusPollingTimer = null;
  }

  void initialize(List<CartItem> items) {
    stopPollingOrderStatus();
    state = state.copyWith(
      items: items,
      currentStep: CheckoutStep.review,
      status: CheckoutStatus.initial,
      clearErrorMessage: true,
      clearCurrentOrder: true,
    );
  }

  void resumeOrder(OrderEntity order) {
    state = state.copyWith(
      items: const <CartItem>[],
      currentOrder: order,
      currentStep: CheckoutStep.payment,
      status: CheckoutStatus.orderCreated,
      isSubmitting: false,
      clearErrorMessage: true,
    );
    if (order.isPending) {
      startPollingOrderStatus();
    }
  }

  void selectPaymentMethod(String method) {
    state = state.copyWith(selectedPaymentMethod: method);
  }

  void goToStep(CheckoutStep step) {
    if (step != CheckoutStep.payment) {
      stopPollingOrderStatus();
    }
    state = state.copyWith(currentStep: step, clearErrorMessage: true);
  }

  Future<void> proceedToPaymentStep() async {
    if (state.items.isEmpty) {
      state = state.copyWith(
        errorMessage: 'Tidak ada e-book yang dipilih untuk di-checkout.',
      );
      return;
    }

    state = state.copyWith(
      isSubmitting: true,
      status: CheckoutStatus.loading,
      clearErrorMessage: true,
    );

    try {
      final ebookIds = state.items.map((e) => e.id).toList();
      final order = await repository.createOrder(ebookIds);

      state = state.copyWith(
        currentOrder: order,
        currentStep: CheckoutStep.payment,
        status: CheckoutStatus.orderCreated,
        isSubmitting: false,
        clearErrorMessage: true,
      );
      if (order.isPending) {
        startPollingOrderStatus();
      }
    } on CheckoutFailure catch (f) {
      state = state.copyWith(
        status: CheckoutStatus.error,
        errorMessage: f.message,
        isSubmitting: false,
      );
    } catch (e) {
      state = state.copyWith(
        status: CheckoutStatus.error,
        errorMessage: 'Gagal membuat pesanan: $e',
        isSubmitting: false,
      );
    }
  }

  Future<void> confirmPayment() async {
    if (state.isSubmitting) return;

    final order = state.currentOrder;
    if (order == null) {
      state = state.copyWith(errorMessage: 'Data pesanan belum tersedia.');
      return;
    }

    state = state.copyWith(
      isSubmitting: true,
      status: CheckoutStatus.processing,
      clearErrorMessage: true,
    );

    try {
      // In simulation mode, immediately simulate payment or move to Step 3
      if (state.isMock) {
        final paidOrder = await repository.simulatePaymentSuccess(order.id);
        stopPollingOrderStatus();
        state = state.copyWith(
          currentOrder: paidOrder,
          currentStep: CheckoutStep.completed,
          status: CheckoutStatus.completed,
          isSubmitting: false,
        );
        return;
      }

      // In live remote mode, payment is pending gateway webhook confirmation
      final latestOrder = await repository.getOrderById(order.id);
      if (latestOrder.isPaid) {
        stopPollingOrderStatus();
        state = state.copyWith(
          currentOrder: latestOrder,
          currentStep: CheckoutStep.completed,
          status: CheckoutStatus.completed,
          isSubmitting: false,
        );
      } else {
        state = state.copyWith(currentOrder: latestOrder, isSubmitting: false);
        startPollingOrderStatus();
      }
    } on CheckoutFailure catch (f) {
      state = state.copyWith(
        status: CheckoutStatus.error,
        errorMessage: f.message,
        isSubmitting: false,
      );
    } catch (e) {
      state = state.copyWith(
        status: CheckoutStatus.error,
        errorMessage: 'Gagal memproses pembayaran: $e',
        isSubmitting: false,
      );
    }
  }

  Future<void> refreshOrderStatus() async {
    final order = state.currentOrder;
    if (order == null) return;

    state = state.copyWith(isSubmitting: true, clearErrorMessage: true);

    try {
      final updated = await repository.getOrderById(order.id);
      if (updated.isPaid) {
        stopPollingOrderStatus();
        state = state.copyWith(
          currentOrder: updated,
          currentStep: CheckoutStep.completed,
          status: CheckoutStatus.completed,
          isSubmitting: false,
        );
      } else {
        state = state.copyWith(currentOrder: updated, isSubmitting: false);
      }
    } on CheckoutFailure catch (f) {
      state = state.copyWith(errorMessage: f.message, isSubmitting: false);
    } catch (e) {
      state = state.copyWith(
        errorMessage: 'Gagal memeriksa status pesanan: $e',
        isSubmitting: false,
      );
    }
  }

  Future<void> simulatePaymentVerification() async {
    final order = state.currentOrder;
    if (order == null) return;

    state = state.copyWith(isSubmitting: true);
    try {
      final paid = await repository.simulatePaymentSuccess(order.id);
      stopPollingOrderStatus();
      state = state.copyWith(
        currentOrder: paid,
        currentStep: CheckoutStep.completed,
        status: CheckoutStatus.completed,
        isSubmitting: false,
      );
    } catch (e) {
      state = state.copyWith(
        errorMessage: 'Gagal simulasi verifikasi: $e',
        isSubmitting: false,
      );
    }
  }
}

final checkoutProvider = StateNotifierProvider<CheckoutNotifier, CheckoutState>(
  (ref) {
    final repository = ref.watch(checkoutRepositoryProvider);
    return CheckoutNotifier(
      repository: repository,
      isMock: !ApiConfig.useRemoteCatalog,
    );
  },
);
