import '../../../../core/utils/rupiah_formatter.dart';

class CartPromo {
  final String code;
  final String badgeLabel;
  final int discountAmount;

  const CartPromo({
    required this.code,
    required this.badgeLabel,
    required this.discountAmount,
  });

  String get formattedDiscount => formatRupiah(discountAmount);
}
