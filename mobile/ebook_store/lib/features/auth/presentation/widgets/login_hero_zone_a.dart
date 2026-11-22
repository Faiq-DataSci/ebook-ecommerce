import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// Zona A: Expressive Hero Block strictly matching Stitch's Neubrutalism design:
/// - Yellow card (`#FFD23F`), 3px black border, 5px offset hard shadow.
/// - Display headline: `MASUK KE AKUN` in Syne 800.
/// - Body subtitle: `Akses seluruh koleksi e-book & pustaka digital Anda.`
class LoginHeroZoneA extends StatelessWidget {
  const LoginHeroZoneA({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 18.0),
      decoration: BoxDecoration(
        color: AppColors.nbYellow,
        border: Border.all(color: AppColors.nbBlack, width: 3.0),
        boxShadow: const [
          BoxShadow(
            color: AppColors.nbBlack,
            offset: Offset(5, 5),
            blurRadius: 0,
          ),
        ],
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Main Headline: MASUK KE AKUN
          Text(
            'MASUK KE AKUN',
            style: TextStyle(
              fontFamily: AppTheme.fontDisplay,
              fontSize: 26.0,
              fontWeight: FontWeight.w800,
              height: 1.2,
              letterSpacing: -0.5,
              color: AppColors.nbBlack,
            ),
          ),

          SizedBox(height: 6.0),

          // Subtitle
          Text(
            'Akses seluruh koleksi e-book & pustaka digital Anda.',
            style: TextStyle(
              fontFamily: AppTheme.fontBody,
              fontSize: 13.0,
              fontWeight: FontWeight.w500,
              height: 1.35,
              color: AppColors.nbBlack,
            ),
          ),
        ],
      ),
    );
  }
}
