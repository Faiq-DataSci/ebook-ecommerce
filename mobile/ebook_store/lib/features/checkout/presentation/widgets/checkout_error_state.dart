import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

class CheckoutErrorState extends StatelessWidget {
  final String errorMessage;
  final VoidCallback onRetry;
  final VoidCallback? onBackToCart;

  const CheckoutErrorState({
    super.key,
    required this.errorMessage,
    required this.onRetry,
    this.onBackToCart,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const Key('checkout_error_state'),
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
            children: <Widget>[
              Container(
                padding: const EdgeInsets.all(6),
                decoration: AppTheme.brutalBox(
                  color: AppColors.nbPink,
                  borderColor: AppColors.nbBlack,
                  borderWidth: AppTheme.borderThin,
                  shadowOffset: 1,
                ),
                child: const Icon(
                  Icons.error_outline,
                  size: 20,
                  color: AppColors.nbBlack,
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  'KENDALA TRANSAKSI',
                  style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            errorMessage,
            key: const Key('checkout_error_message_text'),
            style: AppTheme.bodySm(AppColors.nbBlack, fontSize: 13),
          ),
          const SizedBox(height: 16),
          Row(
            children: <Widget>[
              Expanded(
                child: InkWell(
                  key: const Key('checkout_error_retry_button'),
                  onTap: onRetry,
                  child: Container(
                    height: 44,
                    alignment: Alignment.center,
                    decoration: AppTheme.brutalBox(
                      color: AppColors.nbYellow,
                      borderColor: AppColors.nbBlack,
                      borderWidth: AppTheme.borderDefault,
                      shadowOffset: 2,
                    ),
                    child: Text(
                      'COBA LAGI',
                      style: AppTheme.labelMd(AppColors.nbBlack),
                    ),
                  ),
                ),
              ),
              if (onBackToCart != null) ...[
                const SizedBox(width: 10),
                Expanded(
                  child: InkWell(
                    key: const Key('checkout_error_back_button'),
                    onTap: onBackToCart,
                    child: Container(
                      height: 44,
                      alignment: Alignment.center,
                      decoration: AppTheme.brutalBox(
                        color: AppColors.nbPaper,
                        borderColor: AppColors.nbBlack,
                        borderWidth: AppTheme.borderDefault,
                        shadowOffset: 2,
                      ),
                      child: Text(
                        'KEMBALI',
                        style: AppTheme.labelMd(AppColors.nbBlack),
                      ),
                    ),
                  ),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }
}
