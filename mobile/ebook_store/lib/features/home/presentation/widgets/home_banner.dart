import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// Hero Promotional Banner (Zona A - Ekspresif Tinggi) adapted for customer UX:
/// - Container: `bg-nb-yellow` (`#FFD23F`), `2px` black border, `5px` hard shadow
/// - Top badge: `ASISTEN BACAAN` (`bg-nb-white`, `1px` border, `1px` shadow)
/// - Headline: `Bingung Pilih Buku?` (`Space Grotesk` 700, `28px`, `pr-20` wrap)
/// - Supporting copy: customer-friendly benefit copy powered by backend SAW
/// - CTA Button: Full-width `bg-nb-lavender` (`#B8A9FA`), `2px` border, `3px`
///   hard shadow, `bolt` icon + `CARI REKOMENDASI BUKU`
class HomeBanner extends StatelessWidget {
  final NbPalette palette;
  final VoidCallback onCalculateSawTap;

  const HomeBanner({
    super.key,
    required this.palette,
    required this.onCalculateSawTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: AppTheme.brutalBox(
        color: AppColors.nbYellow,
        borderColor: AppColors.nbBlack,
        borderWidth: AppTheme.borderDefault,
        shadowOffset: 5,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.only(right: 64),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 2,
                  ),
                  decoration: AppTheme.brutalBox(
                    color: AppColors.nbWhite,
                    borderColor: AppColors.nbBlack,
                    borderWidth: AppTheme.borderThin,
                    shadowOffset: 1,
                  ),
                  child: Text(
                    'ASISTEN BACAAN',
                    style: AppTheme.labelSm(AppColors.nbBlack, fontSize: 12),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Bingung Pilih Buku?',
                  style: AppTheme.headlineLgMobile(AppColors.nbBlack),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Temukan e-book paling pas sesuai anggaran, rating pembaca, dan topik favoritmu.',
            style: AppTheme.bodySm(AppColors.nbBlack, fontSize: 14),
          ),
          const SizedBox(height: 12),
          Semantics(
            button: true,
            label: 'Cari Rekomendasi Buku',
            child: InkWell(
              key: const Key('saw_cta_button'),
              onTap: onCalculateSawTap,
              child: Container(
                width: double.infinity,
                constraints: const BoxConstraints(minHeight: 42),
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 10,
                ),
                decoration: AppTheme.brutalBox(
                  color: AppColors.nbLavender,
                  borderColor: AppColors.nbBlack,
                  borderWidth: AppTheme.borderDefault,
                  shadowOffset: 3,
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    const Icon(Icons.bolt, size: 18, color: AppColors.nbBlack),
                    const SizedBox(width: 6),
                    Flexible(
                      child: Text(
                        'CARI REKOMENDASI BUKU',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: AppTheme.labelMd(
                          AppColors.nbBlack,
                        ).copyWith(letterSpacing: 0.4),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
