import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// Dismissible Coral Pink Error Notification Banner matching Stitch design:
/// - `#FF6B6B` container, 2px solid black border, 3px hard shadow.
/// - Error icon and bold uppercase title.
/// - Dismiss button '✕'.
class LoginErrorBanner extends StatelessWidget {
  final String title;
  final String message;
  final VoidCallback onDismiss;

  const LoginErrorBanner({
    super.key,
    required this.title,
    required this.message,
    required this.onDismiss,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(top: 8.0, bottom: 4.0),
      padding: const EdgeInsets.all(10.0),
      decoration: BoxDecoration(
        color: AppColors.nbPink,
        border: Border.all(color: AppColors.nbBlack, width: 2.0),
        boxShadow: const [
          BoxShadow(
            color: AppColors.nbBlack,
            offset: Offset(3, 3),
            blurRadius: 0,
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.error, color: AppColors.nbBlack, size: 18.0),
          const SizedBox(width: 8.0),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title.toUpperCase(),
                  style: const TextStyle(
                    fontFamily: AppTheme.fontHeadline,
                    fontSize: 12.0,
                    fontWeight: FontWeight.w700,
                    color: AppColors.nbBlack,
                    height: 1.1,
                  ),
                ),
                const SizedBox(height: 2.0),
                Text(
                  message,
                  style: const TextStyle(
                    fontFamily: AppTheme.fontBody,
                    fontSize: 11.0,
                    fontWeight: FontWeight.w400,
                    color: AppColors.nbBlack,
                    height: 1.25,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 6.0),
          Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: onDismiss,
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 5.0,
                  vertical: 1.0,
                ),
                decoration: BoxDecoration(
                  border: Border.all(color: AppColors.nbBlack, width: 1.0),
                ),
                child: const Text(
                  '✕',
                  style: TextStyle(
                    fontFamily: AppTheme.fontMono,
                    fontSize: 11.0,
                    fontWeight: FontWeight.w700,
                    color: AppColors.nbBlack,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
