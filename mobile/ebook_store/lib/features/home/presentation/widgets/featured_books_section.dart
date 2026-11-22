import 'package:flutter/material.dart';
import '../../../../core/constants/app_assets.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../domain/models/ebook.dart';
import 'section_header.dart';

/// Customer-facing Featured Recommendation Section (Zona B - Semantik Terukur).
/// Powered by backend SAW scoring (`totalPreferenceScore = 0.942` -> `94% COCOK`),
/// presented using reader-friendly match indicators instead of admin-only SAW jargon.
class FeaturedBooksSection extends StatelessWidget {
  final Ebook book;
  final NbPalette palette;
  final VoidCallback onDetailTap;
  final VoidCallback onAddToCartTap;

  const FeaturedBooksSection({
    super.key,
    required this.book,
    required this.palette,
    required this.onDetailTap,
    required this.onAddToCartTap,
  });

  @override
  Widget build(BuildContext context) {
    final saw = book.sawBreakdown;
    final matchPercentage = saw != null
        ? (saw.totalPreference * 100).round()
        : 94;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        SectionHeader(
          title: 'Rekomendasi Terbaik Untukmu',
          palette: palette,
          rightBadgeText: 'PILIHAN UTAMA',
          rightBadgeColor: AppColors.nbLavender,
        ),
        const SizedBox(height: 12),
        Stack(
          clipBehavior: Clip.none,
          children: <Widget>[
            // Main Featured Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(14),
              decoration: AppTheme.brutalBox(
                color: AppColors.nbWhite,
                borderColor: AppColors.nbBlack,
                borderWidth: AppTheme.borderDefault,
                shadowOffset: 4,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  const SizedBox(height: 6),
                  // Cover + Primary Metadata Row
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      // 2:3 Book Cover (`w-24` = 96x144, `2px` border, `3px` shadow)
                      InkWell(
                        onTap: onDetailTap,
                        child: Container(
                          width: 96,
                          height: 144,
                          decoration: AppTheme.brutalBox(
                            color: AppColors.surfaceContainer,
                            borderColor: AppColors.nbBlack,
                            borderWidth: AppTheme.borderDefault,
                            shadowOffset: 3,
                          ),
                          child: StitchBookCover(
                            assetKey: book.coverAssetKey,
                            title: book.title,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      // Right Column Details
                      Expanded(
                        child: ConstrainedBox(
                          constraints: const BoxConstraints(minHeight: 144),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: <Widget>[
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: <Widget>[
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 6,
                                      vertical: 2,
                                    ),
                                    decoration: BoxDecoration(
                                      color: AppColors.nbBlue,
                                      border: Border.all(
                                        color: AppColors.nbBlack,
                                        width: AppTheme.borderThin,
                                      ),
                                    ),
                                    child: Text(
                                      book.badgeLabel,
                                      style: AppTheme.labelSm(
                                        AppColors.nbBlack,
                                        fontSize: 10,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  InkWell(
                                    onTap: onDetailTap,
                                    child: Text(
                                      book.title,
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: AppTheme.headlineSmMobile(
                                        AppColors.nbBlack,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    book.author,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: AppTheme.bodySm(
                                      AppColors.nbTextMuted,
                                      fontSize: 14,
                                    ),
                                  ),
                                  const SizedBox(height: 6),
                                  Wrap(
                                    spacing: 6,
                                    runSpacing: 4,
                                    crossAxisAlignment:
                                        WrapCrossAlignment.center,
                                    children: <Widget>[
                                      Container(
                                        padding: const EdgeInsets.symmetric(
                                          horizontal: 6,
                                          vertical: 2,
                                        ),
                                        decoration: BoxDecoration(
                                          color: AppColors.nbPaper,
                                          border: Border.all(
                                            color: AppColors.nbBlack,
                                            width: AppTheme.borderThin,
                                          ),
                                        ),
                                        child: Row(
                                          mainAxisSize: MainAxisSize.min,
                                          children: <Widget>[
                                            const Icon(
                                              Icons.star,
                                              size: 14,
                                              color: AppColors.nbBlack,
                                            ),
                                            const SizedBox(width: 2),
                                            Text(
                                              book.rating.toStringAsFixed(1),
                                              style: AppTheme.dataMono(
                                                AppColors.nbBlack,
                                                fontSize: 11,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      Text(
                                        '(${book.reviewCount} ulasan)',
                                        style: AppTheme.bodySm(
                                          AppColors.nbTextMuted,
                                          fontSize: 11,
                                        ),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                              // PriceTag
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                  vertical: 2,
                                ),
                                decoration: AppTheme.brutalBox(
                                  color: AppColors.nbYellow,
                                  borderColor: AppColors.nbBlack,
                                  borderWidth: AppTheme.borderDefault,
                                  shadowOffset: 2,
                                ),
                                child: Text(
                                  book.formattedPrice,
                                  style: AppTheme.dataMono(
                                    AppColors.nbBlack,
                                    fontSize: 14,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                  if (saw != null) ...<Widget>[
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.only(top: 10),
                      decoration: const BoxDecoration(
                        border: Border(
                          top: BorderSide(
                            color: AppColors.nbBlack,
                            width: AppTheme.borderDefault,
                          ),
                        ),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: <Widget>[
                              Flexible(
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: <Widget>[
                                    Container(
                                      width: 8,
                                      height: 8,
                                      decoration: BoxDecoration(
                                        color: AppColors.nbLavender,
                                        border: Border.all(
                                          color: AppColors.nbBlack,
                                          width: AppTheme.borderThin,
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 4),
                                    Flexible(
                                      child: Text(
                                        'TINGKAT KECOCOKAN',
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: AppTheme.dataMono(
                                          AppColors.nbBlack,
                                          fontSize: 11,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 6,
                                  vertical: 1,
                                ),
                                decoration: BoxDecoration(
                                  color: AppColors.nbPaper,
                                  border: Border.all(
                                    color: AppColors.nbBlack,
                                    width: AppTheme.borderThin,
                                  ),
                                ),
                                child: Text(
                                  '$matchPercentage% COCOK',
                                  style: AppTheme.dataMono(
                                    AppColors.nbBlack,
                                    fontSize: 11,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          // Segmented Horizontal Match Bar (weighted by backend SAW criteria)
                          Container(
                            height: 16,
                            decoration: AppTheme.brutalBox(
                              color: AppColors.nbMuted,
                              borderColor: AppColors.nbBlack,
                              borderWidth: AppTheme.borderDefault,
                              shadowOffset: 2,
                            ),
                            child: Row(
                              children: <Widget>[
                                _buildSegment(
                                  flex: (saw.c1Score * 100).round(),
                                  color: AppColors.nbYellow,
                                  hasRightBorder: true,
                                ),
                                _buildSegment(
                                  flex: (saw.c2Score * 100).round(),
                                  color: AppColors.nbGreen,
                                  hasRightBorder: true,
                                ),
                                _buildSegment(
                                  flex: (saw.c3Score * 100).round(),
                                  color: AppColors.nbBlue,
                                  hasRightBorder: true,
                                ),
                                _buildSegment(
                                  flex: (saw.c4Score * 100).round(),
                                  color: AppColors.nbLavender,
                                  hasRightBorder: false,
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 4),
                          // Customer-friendly reason labels mapped from C1..C4
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: <Widget>[
                              Flexible(
                                child: Text(
                                  'Harga Hemat',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: AppTheme.labelSm(
                                    AppColors.nbTextMuted,
                                    fontSize: 9,
                                  ),
                                ),
                              ),
                              Flexible(
                                child: Text(
                                  'Rating ${book.rating.toStringAsFixed(1)}',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: AppTheme.labelSm(
                                    AppColors.nbTextMuted,
                                    fontSize: 9,
                                  ),
                                ),
                              ),
                              Flexible(
                                child: Text(
                                  'Populer',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: AppTheme.labelSm(
                                    AppColors.nbTextMuted,
                                    fontSize: 9,
                                  ),
                                ),
                              ),
                              Flexible(
                                child: Text(
                                  'Relevan',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: AppTheme.labelSm(
                                    AppColors.nbTextMuted,
                                    fontSize: 9,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                  const SizedBox(height: 12),
                  // Card Action Row (`Lihat Detail Buku` + `add_shopping_cart`)
                  Row(
                    children: <Widget>[
                      Expanded(
                        child: Semantics(
                          button: true,
                          label: 'Lihat Detail Buku ${book.title}',
                          child: InkWell(
                            key: const Key('featured_saw_detail_button'),
                            onTap: onDetailTap,
                            child: Container(
                              height: 38,
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                              ),
                              decoration: AppTheme.brutalBox(
                                color: AppColors.nbWhite,
                                borderColor: AppColors.nbBlack,
                                borderWidth: AppTheme.borderDefault,
                                shadowOffset: 2,
                              ),
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: <Widget>[
                                  const Icon(
                                    Icons.menu_book_outlined,
                                    size: 16,
                                    color: AppColors.nbBlack,
                                  ),
                                  const SizedBox(width: 6),
                                  Flexible(
                                    child: Text(
                                      'Lihat Detail Buku',
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: AppTheme.labelSm(
                                        AppColors.nbBlack,
                                        fontSize: 12,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Semantics(
                        button: true,
                        label: 'Tambah ${book.title} ke keranjang',
                        child: InkWell(
                          key: const Key('featured_add_cart_button'),
                          onTap: onAddToCartTap,
                          child: Container(
                            width: 40,
                            height: 38,
                            alignment: Alignment.center,
                            decoration: AppTheme.brutalBox(
                              color: AppColors.nbYellow,
                              borderColor: AppColors.nbBlack,
                              borderWidth: AppTheme.borderDefault,
                              shadowOffset: 2,
                            ),
                            child: const Icon(
                              Icons.add_shopping_cart,
                              size: 18,
                              color: AppColors.nbBlack,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            // Floating Top-Left #1 PILIHAN TERBAIK Badge
            Positioned(
              top: -12,
              left: -4,
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 2,
                ),
                decoration: AppTheme.brutalBox(
                  color: AppColors.nbLavender,
                  borderColor: AppColors.nbBlack,
                  borderWidth: AppTheme.borderDefault,
                  shadowOffset: 2,
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget>[
                    const Icon(
                      Icons.military_tech,
                      size: 14,
                      color: AppColors.nbBlack,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      '#${saw?.rank ?? 1} PILIHAN TERBAIK',
                      style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 12),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildSegment({
    required int flex,
    required Color color,
    required bool hasRightBorder,
  }) {
    return Expanded(
      flex: flex,
      child: Container(
        decoration: BoxDecoration(
          color: color,
          border: hasRightBorder
              ? const Border(
                  right: BorderSide(
                    color: AppColors.nbBlack,
                    width: AppTheme.borderDefault,
                  ),
                )
              : null,
        ),
      ),
    );
  }
}
