import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../domain/entities/book_review.dart';
import 'rating_stars.dart';

/// Kartu ulasan pembaca individual (Neubrutalism Zona B dengan strip aksen kiri).
class ReviewItemCard extends StatelessWidget {
  final BookReview review;
  final int index;
  final bool isVoted;
  final VoidCallback onToggleHelpful;

  const ReviewItemCard({
    super.key,
    required this.review,
    required this.index,
    required this.isVoted,
    required this.onToggleHelpful,
  });

  static Color _getReviewerAccent(int index) {
    const accents = [
      AppColors.nbYellow,
      AppColors.nbLavender,
      AppColors.nbBlue,
      AppColors.nbGreen,
      AppColors.nbOrange,
    ];
    return accents[index % accents.length];
  }

  static String _formatDate(DateTime dt) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'Mei',
      'Jun',
      'Jul',
      'Agu',
      'Sep',
      'Okt',
      'Nov',
      'Des',
    ];
    return '${dt.day.toString().padLeft(2, '0')} ${months[dt.month - 1]} ${dt.year}';
  }

  @override
  Widget build(BuildContext context) {
    final accent = _getReviewerAccent(index);
    final currentHelpful = review.helpfulCount + (isVoted ? 1 : 0);
    final initial = review.reviewerName.isNotEmpty
        ? review.reviewerName.trim().substring(0, 1).toUpperCase()
        : 'U';

    return Container(
      key: Key('book_review_card_${review.id}'),
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
      child: Stack(
        children: [
          Positioned(
            left: 0,
            top: 0,
            bottom: 0,
            child: Container(width: 4.5, color: accent),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(16.0, 14.0, 14.0, 14.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Container(
                      width: 38.0,
                      height: 38.0,
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: accent,
                        border: Border.all(
                          color: AppColors.nbBlack,
                          width: 1.5,
                        ),
                        boxShadow: const [
                          BoxShadow(
                            color: AppColors.nbBlack,
                            offset: Offset(1.5, 1.5),
                            blurRadius: 0.0,
                          ),
                        ],
                      ),
                      child: Text(
                        initial,
                        style: const TextStyle(
                          fontFamily: AppTheme.fontDisplay,
                          fontSize: 16.0,
                          fontWeight: FontWeight.w900,
                          color: AppColors.nbBlack,
                        ),
                      ),
                    ),
                    const SizedBox(width: 10.0),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            review.reviewerName,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontFamily: AppTheme.fontHeadline,
                              fontSize: 13.5,
                              fontWeight: FontWeight.w800,
                              color: AppColors.nbBlack,
                            ),
                          ),
                          if (review.reviewerRole != null)
                            Text(
                              review.reviewerRole!,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontFamily: AppTheme.fontBody,
                                fontSize: 11.0,
                                fontWeight: FontWeight.w500,
                                color: AppColors.nbTextMuted,
                              ),
                            ),
                        ],
                      ),
                    ),
                    if (review.isVerifiedPurchase)
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 7.0,
                          vertical: 3.5,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.nbGreen,
                          border: Border.all(
                            color: AppColors.nbBlack,
                            width: 1.2,
                          ),
                          boxShadow: const [
                            BoxShadow(
                              color: AppColors.nbBlack,
                              offset: Offset(1.0, 1.0),
                              blurRadius: 0.0,
                            ),
                          ],
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              Icons.verified,
                              size: 11.0,
                              color: AppColors.nbBlack,
                            ),
                            SizedBox(width: 3.0),
                            Text(
                              'TERVERIFIKASI',
                              style: TextStyle(
                                fontFamily: AppTheme.fontMono,
                                fontSize: 9.0,
                                fontWeight: FontWeight.w900,
                                color: AppColors.nbBlack,
                                letterSpacing: 0.5,
                              ),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 10.0),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8.0,
                        vertical: 3.0,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.nbPaper,
                        border: Border.all(
                          color: AppColors.nbBlack,
                          width: 1.2,
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          RatingStars(
                            rating: review.rating.toDouble(),
                            starSize: 12.0,
                            spacing: 1.5,
                            showScoreText: false,
                          ),
                          const SizedBox(width: 6.0),
                          Text(
                            '${review.rating}/5',
                            style: const TextStyle(
                              fontFamily: AppTheme.fontMono,
                              fontSize: 10.5,
                              fontWeight: FontWeight.w800,
                              color: AppColors.nbBlack,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Row(
                      children: [
                        const Icon(
                          Icons.calendar_today_outlined,
                          size: 11.0,
                          color: AppColors.nbTextMuted,
                        ),
                        const SizedBox(width: 4.0),
                        Text(
                          _formatDate(review.createdAt),
                          style: const TextStyle(
                            fontFamily: AppTheme.fontMono,
                            fontSize: 10.0,
                            fontWeight: FontWeight.w700,
                            color: AppColors.nbTextMuted,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 10.0),
                Text(
                  review.title,
                  style: const TextStyle(
                    fontFamily: AppTheme.fontHeadline,
                    fontSize: 13.5,
                    fontWeight: FontWeight.w800,
                    color: AppColors.nbBlack,
                    height: 1.3,
                  ),
                ),
                const SizedBox(height: 6.0),
                Text(
                  review.comment,
                  style: const TextStyle(
                    fontFamily: AppTheme.fontBody,
                    fontSize: 12.0,
                    color: AppColors.nbBlack,
                    height: 1.45,
                  ),
                ),
                const SizedBox(height: 12.0),
                InkWell(
                  key: Key('review_helpful_button_${review.id}'),
                  onTap: onToggleHelpful,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10.0,
                      vertical: 5.0,
                    ),
                    decoration: BoxDecoration(
                      color: isVoted ? AppColors.nbYellow : AppColors.nbPaper,
                      border: Border.all(color: AppColors.nbBlack, width: 1.5),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.nbBlack,
                          offset: isVoted
                              ? const Offset(1.0, 1.0)
                              : const Offset(1.5, 1.5),
                          blurRadius: 0.0,
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Text(
                          '▲',
                          style: TextStyle(
                            fontSize: 10.0,
                            fontWeight: FontWeight.w900,
                            color: AppColors.nbBlack,
                          ),
                        ),
                        const SizedBox(width: 5.0),
                        Text(
                          'Bermanfaat ($currentHelpful)',
                          style: TextStyle(
                            fontFamily: AppTheme.fontMono,
                            fontSize: 10.0,
                            fontWeight: isVoted
                                ? FontWeight.w800
                                : FontWeight.w700,
                            color: AppColors.nbBlack,
                          ),
                        ),
                      ],
                    ),
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
