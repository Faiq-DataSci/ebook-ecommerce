import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import 'pt_controls.dart';

class LogoutConfirmDialog extends StatelessWidget {
  const LogoutConfirmDialog({super.key});

  static Future<bool?> show(BuildContext context) {
    return showDialog<bool>(
      context: context,
      barrierDismissible: true,
      builder: (_) => const LogoutConfirmDialog(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      elevation: 0,
      insetPadding: const EdgeInsets.symmetric(horizontal: 24),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(20),
        decoration: AppTheme.brutalBox(
          color: AppColors.nbWhite,
          borderColor: AppColors.nbBlack,
          borderWidth: AppTheme.borderDefault,
          shadowOffset: 4,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Row(
              children: <Widget>[
                Container(
                  width: 36,
                  height: 36,
                  alignment: Alignment.center,
                  decoration: AppTheme.brutalBox(
                    color: AppColors.nbPink,
                    borderColor: AppColors.nbBlack,
                    borderWidth: AppTheme.borderDefault,
                    shadowOffset: 2,
                  ),
                  child: const Icon(
                    Icons.logout,
                    size: 18,
                    color: AppColors.nbBlack,
                  ),
                ),
                const SizedBox(width: 10),
                const Expanded(
                  child: Text(
                    'Keluar dari Akun?',
                    style: TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 16,
                      fontWeight: FontWeight.w900,
                      color: AppColors.nbBlack,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            const Text(
              'Anda harus masuk kembali untuk mengakses perpustakaan digital dan riwayat pesanan Anda.',
              style: TextStyle(
                fontFamily: 'Inter',
                fontSize: 13,
                color: AppColors.nbBlack,
                height: 1.4,
              ),
            ),
            const SizedBox(height: 20),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: <Widget>[
                PtButton(
                  key: const Key('dialog_cancel_logout_button'),
                  label: 'Batal',
                  color: AppColors.nbWhite,
                  expand: false,
                  onTap: () => Navigator.of(context).pop(false),
                ),
                const SizedBox(width: 8),
                PtButton(
                  key: const Key('dialog_confirm_logout_button'),
                  label: 'Ya, Keluar',
                  color: AppColors.nbPink,
                  icon: Icons.logout,
                  expand: false,
                  onTap: () => Navigator.of(context).pop(true),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
