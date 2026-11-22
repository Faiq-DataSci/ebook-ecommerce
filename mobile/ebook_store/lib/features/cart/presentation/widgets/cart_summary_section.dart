import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../data/datasources/cart_mock_datasource.dart';
import '../../domain/entities/cart_promo.dart';

class CartSummarySection extends StatelessWidget {
  final int selectedCount;
  final String formattedSubtotal;
  final CartPromo? activePromo;
  final int appliedDiscount;
  final String formattedDiscount;
  final String formattedCloudFee;
  final String formattedTotalPayable;
  final VoidCallback onCloudFeeHelpTap;

  const CartSummarySection({
    super.key,
    required this.selectedCount,
    required this.formattedSubtotal,
    required this.activePromo,
    required this.appliedDiscount,
    required this.formattedDiscount,
    required this.formattedCloudFee,
    required this.formattedTotalPayable,
    required this.onCloudFeeHelpTap,
  });

  static const Color _stitchErrorColor = Color(0xFFBA1A1A);
  static const Color _stitchTotalHighlight = Color(0xFFFFF6D6);

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const Key('cart_summary_section'),
      width: double.infinity,
      padding: const EdgeInsets.all(12),
      decoration: AppTheme.brutalBox(
        color: AppColors.nbWhite,
        borderColor: AppColors.nbBlack,
        borderWidth: AppTheme.borderDefault,
        shadowOffset: 4,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          // Header: Ringkasan Transaksi & SAW-C2-PAY
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Expanded(
                child: Text(
                  'RINGKASAN TRANSAKSI',
                  style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                CartMockDataSourceImpl.transactionMatrixCode,
                style: AppTheme.dataMono(
                  AppColors.nbTextMuted,
                  fontSize: 12,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Row 1: Total Harga (N E-book)
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Expanded(
                child: Text(
                  'Total Harga ($selectedCount E-book)',
                  style: AppTheme.bodySm(AppColors.nbBlack, fontSize: 14),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                formattedSubtotal,
                key: const Key('cart_summary_subtotal'),
                style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 14),
              ),
            ],
          ),
          const SizedBox(height: 8),

          // Row 2: Diskon Kupon Promo
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Expanded(
                child: Wrap(
                  spacing: 6,
                  runSpacing: 4,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: <Widget>[
                    Text(
                      'Diskon Kupon Promo',
                      style: AppTheme.bodySm(AppColors.nbBlack, fontSize: 14),
                    ),
                    if (activePromo != null)
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 5,
                          vertical: 1,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.nbPaper,
                          border: Border.all(
                            color: AppColors.nbBlack,
                            width: AppTheme.borderThin,
                          ),
                        ),
                        child: Text(
                          activePromo!.code,
                          style: AppTheme.dataMono(
                            AppColors.nbBlack,
                            fontSize: 10,
                          ),
                        ),
                      ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Text(
                appliedDiscount > 0 ? '-$formattedDiscount' : 'Rp 0',
                key: const Key('cart_summary_discount'),
                style: AppTheme.dataMono(
                  appliedDiscount > 0 ? _stitchErrorColor : AppColors.nbBlack,
                  fontSize: 14,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),

          // Row 3: Biaya Sinkronisasi Cloud
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Expanded(
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget>[
                    Flexible(
                      child: Text(
                        'Biaya Sinkronisasi Cloud',
                        style: AppTheme.bodySm(AppColors.nbBlack, fontSize: 14),
                      ),
                    ),
                    const SizedBox(width: 4),
                    Semantics(
                      button: true,
                      label: 'Informasi Biaya Sinkronisasi Cloud',
                      child: InkWell(
                        key: const Key('cart_cloud_fee_help_button'),
                        onTap: onCloudFeeHelpTap,
                        child: const Padding(
                          padding: EdgeInsets.all(4),
                          child: Icon(
                            Icons.help_outline,
                            size: 16,
                            color: AppColors.nbTextMuted,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Text(
                formattedCloudFee,
                key: const Key('cart_summary_cloud_fee'),
                style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 14),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Dashed Divider
          SizedBox(
            width: double.infinity,
            height: 2,
            child: CustomPaint(
              painter: _DashedLinePainter(color: AppColors.nbBlack),
            ),
          ),
          const SizedBox(height: 12),

          // Total Tagihan Highlight Box
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
            decoration: BoxDecoration(
              color: _stitchTotalHighlight,
              border: Border.all(
                color: AppColors.nbBlack,
                width: AppTheme.borderDefault,
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Expanded(
                  child: Text(
                    'TOTAL TAGIHAN',
                    style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  formattedTotalPayable,
                  key: const Key('cart_summary_total_payable'),
                  style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 18),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _DashedLinePainter extends CustomPainter {
  final Color color;

  const _DashedLinePainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    if (!size.width.isFinite || size.width <= 0) return;
    final paint = Paint()
      ..color = color
      ..strokeWidth = 2
      ..style = PaintingStyle.stroke;

    const dashWidth = 6.0;
    const dashSpace = 4.0;
    double startX = 0;
    final y = size.height / 2;

    while (startX < size.width) {
      final endX = (startX + dashWidth).clamp(0.0, size.width);
      canvas.drawLine(Offset(startX, y), Offset(endX, y), paint);
      startX += dashWidth + dashSpace;
    }
  }

  @override
  bool shouldRepaint(covariant _DashedLinePainter oldDelegate) {
    return oldDelegate.color != color;
  }
}
