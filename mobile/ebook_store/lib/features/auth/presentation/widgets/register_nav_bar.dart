import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// Minimalist Neubrutalist back navigation bar from Stitch:
/// Layer: "Registrasi Mobile (Zona A/C)"
/// Header with 44x44px hard-shadow back button.
class RegisterNavBar extends StatelessWidget {
  final VoidCallback? onBack;

  const RegisterNavBar({
    super.key,
    this.onBack,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 56.0,
      margin: const EdgeInsets.only(top: 8.0, bottom: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // 44x44px Back Button with 3px border and 3px hard shadow
          Semantics(
            button: true,
            label: 'Kembali',
            child: InkWell(
              onTap: onBack ?? () => Navigator.of(context).maybePop(),
              child: Container(
                width: 44.0,
                height: 44.0,
                decoration: BoxDecoration(
                  color: AppColors.nbWhite,
                  border: Border.all(color: AppColors.nbBlack, width: 3.0),
                  boxShadow: const [
                    BoxShadow(
                      color: AppColors.nbBlack,
                      offset: Offset(3.0, 3.0),
                      blurRadius: 0.0,
                    ),
                  ],
                ),
                child: const Center(
                  child: Icon(
                    Icons.arrow_back,
                    color: AppColors.nbBlack,
                    size: 22.0,
                  ),
                ),
              ),
            ),
          ),

          // Small system badge to balance header
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
            decoration: BoxDecoration(
              color: AppColors.nbPaper,
              border: Border.all(color: AppColors.nbBlack, width: 2.0),
              boxShadow: const [
                BoxShadow(
                  color: AppColors.nbBlack,
                  offset: Offset(2.0, 2.0),
                  blurRadius: 0.0,
                ),
              ],
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  Icons.person_add_alt_1,
                  size: 14.0,
                  color: AppColors.nbBlack,
                ),
                SizedBox(width: 4.0),
                Text(
                  'AKUN PELANGGAN',
                  style: TextStyle(
                    fontFamily: AppTheme.fontMono,
                    fontSize: 10.0,
                    fontWeight: FontWeight.w700,
                    color: AppColors.nbBlack,
                    letterSpacing: 0.5,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
