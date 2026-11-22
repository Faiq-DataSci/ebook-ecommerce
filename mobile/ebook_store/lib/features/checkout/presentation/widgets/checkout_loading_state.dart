import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

class CheckoutLoadingState extends StatelessWidget {
  final String message;

  const CheckoutLoadingState({
    super.key,
    this.message = 'Memproses permintaan checkout...',
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const Key('checkout_loading_state'),
      padding: const EdgeInsets.all(24),
      decoration: AppTheme.brutalBox(
        color: AppColors.nbWhite,
        borderColor: AppColors.nbBlack,
        borderWidth: AppTheme.borderDefault,
        shadowOffset: 4,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Container(
            width: 44,
            height: 44,
            alignment: Alignment.center,
            decoration: AppTheme.brutalBox(
              color: AppColors.nbYellow,
              borderColor: AppColors.nbBlack,
              borderWidth: AppTheme.borderDefault,
              shadowOffset: 2,
            ),
            child: const CircularProgressIndicator(
              strokeWidth: 3,
              color: AppColors.nbBlack,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'MENGHUBUNGI SERVER',
            style: AppTheme.headlineSmMobile(AppColors.nbBlack),
          ),
          const SizedBox(height: 6),
          Text(
            message,
            textAlign: TextAlign.center,
            style: AppTheme.bodySm(AppColors.nbTextMuted),
          ),
        ],
      ),
    );
  }
}
