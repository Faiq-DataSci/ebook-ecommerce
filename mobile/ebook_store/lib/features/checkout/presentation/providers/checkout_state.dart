import '../../../cart/domain/entities/cart_item.dart';
import '../../domain/entities/order_entity.dart';

enum CheckoutStep {
  review, // Step 1: Tinjau
  payment, // Step 2: Bayar
  completed, // Step 3: Selesai
}

enum CheckoutStatus {
  initial,
  loading,
  orderCreated,
  processing,
  completed,
  error,
}

class CheckoutState {
  final CheckoutStep currentStep;
  final CheckoutStatus status;
  final List<CartItem> items;
  final OrderEntity? currentOrder;
  final String selectedPaymentMethod;
  final bool isSubmitting;
  final String? errorMessage;
  final bool isMock;

  const CheckoutState({
    this.currentStep = CheckoutStep.review,
    this.status = CheckoutStatus.initial,
    this.items = const <CartItem>[],
    this.currentOrder,
    this.selectedPaymentMethod = 'BCA Virtual Account',
    this.isSubmitting = false,
    this.errorMessage,
    this.isMock = true,
  });

  int get totalItemsCount => items.length;

  int get calculatedSubtotal =>
      items.fold<int>(0, (sum, item) => sum + item.price);

  int get orderTotalPayable => currentOrder?.totalAmount ?? calculatedSubtotal;

  bool get canProceedToPay => items.isNotEmpty && !isSubmitting;

  CheckoutState copyWith({
    CheckoutStep? currentStep,
    CheckoutStatus? status,
    List<CartItem>? items,
    OrderEntity? currentOrder,
    bool clearCurrentOrder = false,
    String? selectedPaymentMethod,
    bool? isSubmitting,
    String? errorMessage,
    bool clearErrorMessage = false,
    bool? isMock,
  }) {
    return CheckoutState(
      currentStep: currentStep ?? this.currentStep,
      status: status ?? this.status,
      items: items ?? this.items,
      currentOrder: clearCurrentOrder
          ? null
          : (currentOrder ?? this.currentOrder),
      selectedPaymentMethod:
          selectedPaymentMethod ?? this.selectedPaymentMethod,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      errorMessage: clearErrorMessage
          ? null
          : (errorMessage ?? this.errorMessage),
      isMock: isMock ?? this.isMock,
    );
  }
}
