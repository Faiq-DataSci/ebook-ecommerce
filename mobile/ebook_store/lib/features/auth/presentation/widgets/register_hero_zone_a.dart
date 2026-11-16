import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// ZONA A: Hero Banner Ekspresif Neubrutalist for Registration
/// Stitch Reference: "Registrasi Mobile (Zona A/C)"
/// Rotated blue box (-1 deg) with yellow badge, Syne 36px title, and pink corner tag.
class RegisterHeroZoneA extends StatelessWidget {
  const RegisterHeroZoneA({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 8.0, bottom: 18.0),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          // Main Rotated Hero Banner (-1 degree)
          Transform.rotate(
            angle: -1.0 * (math.pi / 180.0), // -1 deg
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16.0),
              decoration: BoxDecoration(
                color: AppColors.nbBlue,
                border: Border.all(color: AppColors.nbBlack, width: 3.0),
                boxShadow: const [
                  BoxShadow(
                    color: AppColors.nbBlack,
                    offset: Offset(5.0, 5.0),
                    blurRadius: 0.0,
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Badge Tagline Eksplanatori
                  Container(
                    margin: const EdgeInsets.only(bottom: 8.0),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8.0,
                      vertical: 3.0,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.nbYellow,
                      border: Border.all(color: AppColors.nbBlack, width: 2.0),
                      boxShadow: const [
                        BoxShadow(
                          color: AppColors.nbBlack,
                          offset: Offset(2.0, 2.0),
                          blurRadius: 0.0,
                        ),
                      ],
                    ),
                    child: const FittedBox(
                      fit: BoxFit.scaleDown,
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.verified,
                            size: 15.0,
                            color: AppColors.nbBlack,
                          ),
                          SizedBox(width: 5.0),
                          Text(
                            'BUAT LISENSI PEMBACA',
                            style: TextStyle(
                              fontFamily: AppTheme.fontHeadline,
                              fontSize: 11.0,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 0.8,
                              color: AppColors.nbBlack,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  // Display Title "DAFTAR AKUN"
                  const Text(
                    'DAFTAR AKUN',
                    style: TextStyle(
                      fontFamily: AppTheme.fontDisplay,
                      fontSize: 34.0,
                      fontWeight: FontWeight.w800,
                      color: AppColors.nbBlack,
                      letterSpacing: -0.8,
                      height: 1.05,
                    ),
                  ),

                  const SizedBox(height: 6.0),

                  // Subtitle
                  const Text(
                    'Dapatkan akses penuh e-book interaktif dengan katalog e-book terlengkap & rekomendasi buku digital terbaik.',
                    style: TextStyle(
                      fontFamily: AppTheme.fontBody,
                      fontSize: 12.5,
                      fontWeight: FontWeight.w500,
                      color: AppColors.nbBlack,
                      height: 1.35,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Decorative Mini Tag Corner (+2 degrees)
          Positioned(
            bottom: -10.0,
            right: 10.0,
            child: Transform.rotate(
              angle: 2.0 * (math.pi / 180.0), // +2 deg
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 8.0,
                  vertical: 3.0,
                ),
                decoration: BoxDecoration(
                  color: AppColors.nbPink,
                  border: Border.all(color: AppColors.nbBlack, width: 2.0),
                  boxShadow: const [
                    BoxShadow(
                      color: AppColors.nbBlack,
                      offset: Offset(3.0, 3.0),
                      blurRadius: 0.0,
                    ),
                  ],
                ),
                child: const Text(
                  'SYS.REG_v2.4',
                  style: TextStyle(
                    fontFamily: AppTheme.fontMono,
                    fontSize: 10.5,
                    fontWeight: FontWeight.w700,
                    color: AppColors.nbBlack,
                    letterSpacing: 0.5,
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
