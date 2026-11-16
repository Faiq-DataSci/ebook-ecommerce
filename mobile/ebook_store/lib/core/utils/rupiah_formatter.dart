/// Formats an amount as Indonesian Rupiah with dot thousand separators,
/// e.g. `65000` -> `Rp 65.000` (design.md §5.9 PriceTag).
String formatRupiah(num amount) {
  final value = amount.round();
  final digits = value.abs().toString();
  final buffer = StringBuffer();
  for (var i = 0; i < digits.length; i++) {
    final remaining = digits.length - i;
    buffer.write(digits[i]);
    if (remaining > 1 && remaining % 3 == 1) {
      buffer.write('.');
    }
  }
  return '${value < 0 ? '-' : ''}Rp $buffer';
}

/// Formats a rating with an Indonesian decimal comma, e.g. `4.6` -> `4,6`.
String formatRating(double rating) =>
    rating.toStringAsFixed(1).replaceAll('.', ',');
