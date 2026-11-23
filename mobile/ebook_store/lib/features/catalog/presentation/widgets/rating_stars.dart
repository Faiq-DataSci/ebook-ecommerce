import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// Komponen `RatingStars` resmi sesuai spesifikasi `design.md §5.9`:
/// "lima kotak persegi; terisi = nb-yellow, kosong = putih; selalu disertai angka ('4,6').
/// Jika e-book belum punya rating tampil 'Belum ada rating', bukan nol bintang."
class RatingStars extends StatelessWidget {
  final double rating;
  final double starSize;
  final double spacing;
  final bool showScoreText;
  final TextStyle? scoreTextStyle;
  final int totalCount;
  final bool showTotalCount;

  const RatingStars({
    super.key,
    required this.rating,
    this.starSize = 14.0,
    this.spacing = 3.0,
    this.showScoreText = true,
    this.scoreTextStyle,
    this.totalCount = 0,
    this.showTotalCount = false,
  });

  @override
  Widget build(BuildContext context) {
    if (rating <= 0.0) {
      return Text(
        'Belum ada rating',
        style: AppTheme.bodySm(AppColors.nbDisabledText, fontSize: 12),
      );
    }

    final roundedScore = (rating * 10).round() / 10;
    final formattedScore = roundedScore.toStringAsFixed(1);

    return Row(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        // 5 Kotak Persegi Neubrutalism
        for (int i = 1; i <= 5; i++) ...[
          _buildSquareStar(i, rating),
          if (i < 5) SizedBox(width: spacing),
        ],

        if (showScoreText) ...[
          const SizedBox(width: 6.0),
          Text(
            formattedScore,
            style:
                scoreTextStyle ??
                const TextStyle(
                  fontFamily: AppTheme.fontMono,
                  fontSize: 12.0,
                  fontWeight: FontWeight.w800,
                  color: AppColors.nbBlack,
                ),
          ),
        ],

        if (showTotalCount && totalCount > 0) ...[
          const SizedBox(width: 4.0),
          Text(
            '($totalCount)',
            style: const TextStyle(
              fontFamily: AppTheme.fontMono,
              fontSize: 10.5,
              fontWeight: FontWeight.w700,
              color: AppColors.nbTextMuted,
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildSquareStar(int index, double currentRating) {
    final isFull = currentRating >= index;
    final isPartial = !isFull && currentRating > (index - 1);

    final boxColor = isFull
        ? AppColors.nbYellow
        : (isPartial ? AppColors.nbYellow : AppColors.nbWhite);

    return Container(
      width: starSize,
      height: starSize,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: boxColor,
        borderRadius: BorderRadius.zero,
        border: Border.all(color: AppColors.nbBlack, width: 1.2),
      ),
      child: isFull || isPartial
          ? Icon(Icons.star, size: starSize * 0.75, color: AppColors.nbBlack)
          : null,
    );
  }
}
