import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// Bar ringkasan hasil katalog e-book dan label integritas data
/// (Google Stitch + design.md §5.4 & §17.3).
class CatalogResultBar extends StatelessWidget {
  final int totalCount;
  final bool isMock;

  const CatalogResultBar({
    super.key,
    required this.totalCount,
    this.isMock = true,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: AppTheme.brutalBox(
        color: AppColors.surfaceContainer,
        borderColor: AppColors.nbBlack,
        borderWidth: AppTheme.borderDefault,
        shadowOffset: 2,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <Widget>[
          // Indikator Hijau + Jumlah Hasil
          Expanded(
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                Container(
                  width: 10,
                  height: 10,
                  decoration: BoxDecoration(
                    color: AppColors.nbGreen,
                    border: Border.all(
                      color: AppColors.nbBlack,
                      width: AppTheme.borderThin,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Flexible(
                  child: Text.rich(
                    TextSpan(
                      text: 'HASIL: ',
                      style: AppTheme.labelSm(AppColors.nbBlack, fontSize: 12),
                      children: <InlineSpan>[
                        TextSpan(
                          text: '$totalCount E-BOOK',
                          style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 12),
                        ),
                      ],
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          // Badge Integritas Data (DATA SIMULASI per design.md §17.3)
          if (isMock)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: AppColors.nbOrange,
                border: Border.all(
                  color: AppColors.nbBlack,
                  width: AppTheme.borderThin,
                ),
              ),
              child: Text(
                'DATA SIMULASI',
                style: AppTheme.dataMono(
                  AppColors.nbBlack,
                  fontSize: 10,
                ).copyWith(fontWeight: FontWeight.w700),
              ),
            )
          else
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
              decoration: BoxDecoration(
                color: AppColors.nbWhite,
                border: Border.all(
                  color: AppColors.nbBlack,
                  width: AppTheme.borderThin,
                ),
              ),
              child: Text(
                'LIVE API',
                style: AppTheme.dataMono(
                  AppColors.nbBlack,
                  fontSize: 10,
                ),
              ),
            ),
        ],
      ),
    );
  }
}
