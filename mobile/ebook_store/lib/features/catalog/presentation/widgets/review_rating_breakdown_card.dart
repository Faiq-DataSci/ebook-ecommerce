import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../domain/entities/book_review.dart';
import 'rating_stars.dart';

/// Kartu ringkasan skor & distribusi bintang interaktif (Zona B — Neubrutalism).
class ReviewRatingBreakdownCard extends StatelessWidget {
  final List<BookReview> reviews;
  final double averageRating;
  final int? selectedStarFilter;
  final ValueChanged<int> onStarTap;

  const ReviewRatingBreakdownCard({
    super.key,
    required this.reviews,
    required this.averageRating,
    required this.selectedStarFilter,
    required this.onStarTap,
  });

  @override
  Widget build(BuildContext context) {
    final totalCount = reviews.length;

    return Container(
      key: const Key('reviews_rating_summary_card'),
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: AppColors.nbWhite,
        border: Border.all(
          color: AppColors.nbBlack,
          width: AppTheme.borderDefault,
        ),
        boxShadow: const [
          BoxShadow(
            color: AppColors.nbBlack,
            offset: Offset(3.5, 3.5),
            blurRadius: 0.0,
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: 14.0,
              vertical: 12.0,
            ),
            decoration: BoxDecoration(
              color: AppColors.nbYellow,
              border: Border.all(
                color: AppColors.nbBlack,
                width: AppTheme.borderDefault,
              ),
              boxShadow: const [
                BoxShadow(
                  color: AppColors.nbBlack,
                  offset: Offset(2.5, 2.5),
                  blurRadius: 0.0,
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  averageRating.toStringAsFixed(1),
                  style: const TextStyle(
                    fontFamily: AppTheme.fontMono,
                    fontSize: 32.0,
                    fontWeight: FontWeight.w900,
                    color: AppColors.nbBlack,
                    height: 1.0,
                  ),
                ),
                const SizedBox(height: 6.0),
                RatingStars(
                  rating: averageRating,
                  starSize: 12.0,
                  spacing: 2.0,
                  showScoreText: false,
                ),
                const SizedBox(height: 6.0),
                Text(
                  '$totalCount Ulasan',
                  style: const TextStyle(
                    fontFamily: AppTheme.fontMono,
                    fontSize: 10.0,
                    fontWeight: FontWeight.w800,
                    color: AppColors.nbBlack,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 14.0),
          Expanded(
            child: Column(
              children: [
                for (int star = 5; star >= 1; star--) ...[
                  _buildDistributionBar(star, totalCount),
                  if (star > 1) const SizedBox(height: 4.0),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDistributionBar(int star, int totalCount) {
    final count = reviews.where((r) => r.rating == star).length;
    final ratio = totalCount > 0 ? count / totalCount : 0.0;
    final isMatchingFilter = selectedStarFilter == star;

    return InkWell(
      onTap: () => onStarTap(star),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 2.0, horizontal: 2.0),
        decoration: BoxDecoration(
          color: isMatchingFilter
              ? AppColors.nbYellow.withValues(alpha: 0.25)
              : Colors.transparent,
        ),
        child: Row(
          children: [
            SizedBox(
              width: 22.0,
              child: Text(
                '$star★',
                style: TextStyle(
                  fontFamily: AppTheme.fontMono,
                  fontSize: 10.5,
                  fontWeight: isMatchingFilter
                      ? FontWeight.w900
                      : FontWeight.w700,
                  color: AppColors.nbBlack,
                ),
              ),
            ),
            const SizedBox(width: 4.0),
            Expanded(
              child: Container(
                height: 11.0,
                decoration: BoxDecoration(
                  color: AppColors.nbPaper,
                  border: Border.all(color: AppColors.nbBlack, width: 1.2),
                ),
                child: FractionallySizedBox(
                  alignment: Alignment.centerLeft,
                  widthFactor: ratio,
                  child: Container(
                    color: star >= 4 ? AppColors.nbYellow : AppColors.nbOrange,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8.0),
            SizedBox(
              width: 18.0,
              child: Text(
                '$count',
                textAlign: TextAlign.end,
                style: TextStyle(
                  fontFamily: AppTheme.fontMono,
                  fontSize: 10.0,
                  fontWeight: FontWeight.w800,
                  color: isMatchingFilter
                      ? AppColors.nbBlack
                      : AppColors.nbTextMuted,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
