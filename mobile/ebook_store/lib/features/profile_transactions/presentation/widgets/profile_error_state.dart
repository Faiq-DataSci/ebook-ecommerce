import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import 'pt_controls.dart';

class ProfileErrorState extends StatelessWidget {
  final String message;
  final VoidCallback onRetry;

  const ProfileErrorState({
    super.key,
    required this.message,
    required this.onRetry,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: AppTheme.brutalBox(
        color: AppColors.nbPink,
        borderColor: AppColors.nbBlack,
        borderWidth: AppTheme.borderDefault,
        shadowOffset: 3,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Row(
            children: <Widget>[
              const Icon(
                Icons.error_outline,
                size: 20,
                color: AppColors.nbBlack,
              ),
              const SizedBox(width: 8),
              const Expanded(
                child: Text(
                  'Terjadi Kesalahan',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 14,
                    fontWeight: FontWeight.w900,
                    color: AppColors.nbBlack,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            message,
            style: const TextStyle(
              fontFamily: 'Inter',
              fontSize: 13,
              color: AppColors.nbBlack,
              height: 1.3,
            ),
          ),
          const SizedBox(height: 12),
          PtButton(
            key: const Key('profile_retry_button'),
            label: 'Coba Lagi',
            icon: Icons.refresh,
            color: AppColors.nbWhite,
            expand: false,
            onTap: onRetry,
          ),
        ],
      ),
    );
  }
}
