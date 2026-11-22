import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../domain/entities/order_entity.dart';
import 'order_status_badge.dart';

class PaymentGatewayPendingCard extends StatelessWidget {
  final OrderEntity order;
  final bool isCheckingStatus;
  final VoidCallback onCheckStatus;
  final VoidCallback? onSimulatePay;
  final bool isMock;

  const PaymentGatewayPendingCard({
    super.key,
    required this.order,
    required this.isCheckingStatus,
    required this.onCheckStatus,
    this.onSimulatePay,
    this.isMock = true,
  });

  @override
  Widget build(BuildContext context) {
    final payment = order.latestPayment;
    final paymentMethod = payment?.paymentMethod ?? 'BCA Virtual Account';
    final externalRef = payment?.externalRef ?? 'PAY-${order.orderNumber}';
    final vaNumber =
        '88012${order.orderNumber.replaceAll(RegExp(r'[^0-9]'), '')}'.padRight(
          16,
          '0',
        );

    return Container(
      key: const Key('payment_gateway_pending_card'),
      padding: const EdgeInsets.all(16),
      decoration: AppTheme.brutalBox(
        color: AppColors.nbWhite,
        borderColor: AppColors.nbBlack,
        borderWidth: AppTheme.borderDefault,
        shadowOffset: 4,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              const Flexible(
                child: OrderStatusBadge(orderStatus: OrderStatusEnum.pending),
              ),
              if (isMock) ...[
                const SizedBox(width: 6),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 6,
                    vertical: 2,
                  ),
                  decoration: AppTheme.brutalBox(
                    color: AppColors.nbOrange,
                    borderColor: AppColors.nbBlack,
                    borderWidth: AppTheme.borderThin,
                    shadowOffset: 1,
                  ),
                  child: Text(
                    'DATA SIMULASI',
                    style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 10),
                  ),
                ),
              ],
            ],
          ),
          const SizedBox(height: 12),
          Text(
            'Menunggu Verifikasi Pembayaran',
            style: AppTheme.headlineSmMobile(AppColors.nbBlack),
          ),
          const SizedBox(height: 4),
          Text(
            'Selesaikan pembayaran sebelum batas waktu berakhir. Sistem backend akan memverifikasi otomatis melalui webhook payment gateway.',
            style: AppTheme.bodySm(AppColors.nbTextMuted, fontSize: 12),
          ),
          const SizedBox(height: 12),

          // Box Informasi VA / Tagihan
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.nbPaper,
              border: Border.all(
                color: AppColors.nbBlack,
                width: AppTheme.borderThin,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(
                  'KANAL: $paymentMethod',
                  style: AppTheme.dataMono(AppColors.nbTextMuted, fontSize: 11),
                ),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Text(
                            'NOMOR VIRTUAL ACCOUNT',
                            style: AppTheme.labelSm(
                              AppColors.nbTextMuted,
                              fontSize: 10,
                            ),
                          ),
                          const SizedBox(height: 2),
                          SelectableText(
                            vaNumber,
                            key: const Key('pending_va_number_text'),
                            style: AppTheme.dataMono(
                              AppColors.nbBlack,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    InkWell(
                      key: const Key('copy_va_number_button'),
                      onTap: () {
                        Clipboard.setData(ClipboardData(text: vaNumber));
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            backgroundColor: AppColors.nbYellow,
                            content: Text(
                              'Nomor Virtual Account disalin!',
                              style: AppTheme.labelSm(AppColors.nbBlack),
                            ),
                          ),
                        );
                      },
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: AppTheme.brutalBox(
                          color: AppColors.nbWhite,
                          borderColor: AppColors.nbBlack,
                          borderWidth: AppTheme.borderThin,
                          shadowOffset: 1,
                        ),
                        child: Row(
                          children: <Widget>[
                            const Icon(
                              Icons.copy,
                              size: 12,
                              color: AppColors.nbBlack,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              'SALIN',
                              style: AppTheme.dataMono(
                                AppColors.nbBlack,
                                fontSize: 11,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                const Divider(color: AppColors.nbBlack, thickness: 1),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    Text(
                      'TOTAL TAGIHAN:',
                      style: AppTheme.labelSm(AppColors.nbBlack, fontSize: 11),
                    ),
                    Text(
                      order.formattedTotalAmount,
                      key: const Key('pending_total_amount_text'),
                      style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 14),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    Text(
                      'REF PEMBAYARAN:',
                      style: AppTheme.bodySm(
                        AppColors.nbTextMuted,
                        fontSize: 10,
                      ),
                    ),
                    Text(
                      externalRef,
                      style: AppTheme.dataMono(
                        AppColors.nbTextMuted,
                        fontSize: 10,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Tombol Cek Status Pembayaran
          InkWell(
            key: const Key('check_payment_status_button'),
            onTap: isCheckingStatus ? null : onCheckStatus,
            child: Container(
              height: 48,
              alignment: Alignment.center,
              decoration: AppTheme.brutalBox(
                color: isCheckingStatus
                    ? AppColors.nbMuted
                    : AppColors.nbYellow,
                borderColor: AppColors.nbBlack,
                borderWidth: AppTheme.borderDefault,
                shadowOffset: isCheckingStatus ? 0 : 3,
              ),
              child: isCheckingStatus
                  ? Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        const SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: AppColors.nbBlack,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'MEMERIKSA STATUS KE SERVER...',
                          style: AppTheme.labelSm(AppColors.nbBlack),
                        ),
                      ],
                    )
                  : Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        const Icon(
                          Icons.refresh,
                          size: 16,
                          color: AppColors.nbBlack,
                        ),
                        const SizedBox(width: 6),
                        Text(
                          'CEK STATUS PEMBAYARAN',
                          style: AppTheme.labelMd(AppColors.nbBlack),
                        ),
                      ],
                    ),
            ),
          ),

          // Mode simulasi bayar langsung
          if (isMock && onSimulatePay != null) ...[
            const SizedBox(height: 10),
            InkWell(
              key: const Key('simulate_pay_button'),
              onTap: onSimulatePay,
              child: Container(
                height: 44,
                alignment: Alignment.center,
                decoration: AppTheme.brutalBox(
                  color: AppColors.nbGreen,
                  borderColor: AppColors.nbBlack,
                  borderWidth: AppTheme.borderDefault,
                  shadowOffset: 2,
                ),
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      const Icon(
                        Icons.check_circle_outline,
                        size: 16,
                        color: AppColors.nbBlack,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        'BAYAR SEKARANG (SIMULASI)',
                        style: AppTheme.labelMd(AppColors.nbBlack),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
