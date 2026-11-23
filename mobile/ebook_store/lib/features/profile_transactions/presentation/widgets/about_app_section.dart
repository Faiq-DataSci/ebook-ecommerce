import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

class AboutAppSection extends StatelessWidget {
  final bool isSimulated;

  const AboutAppSection({super.key, this.isSimulated = false});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: AppTheme.brutalBox(
        color: AppColors.nbPaper,
        borderColor: AppColors.nbBlack,
        borderWidth: AppTheme.borderDefault,
        shadowOffset: 3,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              const Text(
                'TENTANG APLIKASI',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 11,
                  fontWeight: FontWeight.w900,
                  color: AppColors.nbBlack,
                  letterSpacing: 0.5,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: AppTheme.brutalBox(
                  color: AppColors.nbYellow,
                  borderColor: AppColors.nbBlack,
                  borderWidth: 1.5,
                  shadowOffset: 0,
                ),
                child: const Text(
                  'v1.0.0+1',
                  style: TextStyle(
                    fontFamily: 'SpaceMono',
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: AppColors.nbBlack,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          const Text(
            'BukuKita — Platform Toko E-Book & Sistem Rekomendasi SAW (Simple Additive Weighting).',
            style: TextStyle(
              fontFamily: 'Inter',
              fontSize: 12,
              color: AppColors.nbBlack,
              height: 1.35,
            ),
          ),
          if (isSimulated) ...<Widget>[
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(8),
              decoration: AppTheme.brutalBox(
                color: AppColors.nbOrange,
                borderColor: AppColors.nbBlack,
                borderWidth: 1.5,
                shadowOffset: 0,
              ),
              child: const Row(
                children: <Widget>[
                  Icon(Icons.info_outline, size: 16, color: AppColors.nbBlack),
                  SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      'DATA SIMULASI: Backend belum tersambung atau dalam mode demonstrasi.',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: AppColors.nbBlack,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}
