import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../data/mock/home_mock_data.dart';
import '../../domain/models/ebook.dart';

/// Section 7 from Google Stitch (`Beranda Mobile (Neubrutalism)`):
/// - Yellow header banner: `FLASH SALE & BUNDEL HEMAT` + pink countdown badge
///   `SISA WAKTU: 04:18:22` (with `schedule` icon) + subtitle
/// - 2 Curated Bundle Spotlight cards (`Bundel Arsitektur Skala Besar (3 E-Book)`
///   and `AI & Data Engineering Pack (2 E-Book)`) with green `✓` checklist items,
///   strikethrough original price, plain bold `Space Mono` discounted price, and
///   yellow `+ KLAIM BUNDEL` CTA button (with `shopping_bag_outlined` icon)
/// - Explicit `DATA SIMULASI` badge (`#FFA552`) per `AGENTS.md` Rule 3
class FlashSaleSection extends StatelessWidget {
  final List<EbookBundle> bundles;
  final NbPalette palette;
  final ValueChanged<EbookBundle> onClaimBundle;

  const FlashSaleSection({
    super.key,
    required this.bundles,
    required this.palette,
    required this.onClaimBundle,
  });

  Color _resolveBadgeColor(String key) {
    switch (key) {
      case 'lavender':
        return AppColors.nbLavender;
      case 'pink':
        return AppColors.nbPink;
      case 'yellow':
        return AppColors.nbYellow;
      case 'green':
        return AppColors.nbGreen;
      case 'blue':
      default:
        return AppColors.nbBlue;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        // Flash Sale Header Banner (`bg-nb-yellow border-2 border-nb-black shadow-[4px_4px_0_0_#000000] p-3 mb-3`)
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(12),
          decoration: AppTheme.brutalBox(
            color: AppColors.nbYellow,
            borderColor: AppColors.nbBlack,
            borderWidth: AppTheme.borderDefault,
            shadowOffset: 4,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Wrap(
                spacing: 8,
                runSpacing: 6,
                alignment: WrapAlignment.spaceBetween,
                crossAxisAlignment: WrapCrossAlignment.center,
                children: <Widget>[
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      const Icon(
                        Icons.bolt,
                        size: 22,
                        color: AppColors.nbBlack,
                      ),
                      const SizedBox(width: 4),
                      Flexible(
                        child: Text(
                          'FLASH SALE & BUNDEL HEMAT',
                          style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                        ),
                      ),
                    ],
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 3,
                    ),
                    decoration: AppTheme.brutalBox(
                      color: AppColors.nbPink,
                      borderColor: AppColors.nbBlack,
                      borderWidth: AppTheme.borderDefault,
                      shadowOffset: 2,
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: <Widget>[
                        const Icon(
                          Icons.schedule,
                          size: 14,
                          color: AppColors.nbBlack,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          'SISA WAKTU: ${HomeMockData.flashSaleRemainingTime}',
                          style: AppTheme.dataMono(
                            AppColors.nbBlack,
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'Koleksi kurasi tematik diskon hingga 40%. Akses permanen PDF & EPUB.',
                style: AppTheme.bodySm(AppColors.nbBlack, fontSize: 14),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        // Bundle Spotlight Cards
        for (int i = 0; i < bundles.length; i++) ...<Widget>[
          if (i > 0) const SizedBox(height: 12),
          _buildBundleCard(bundles[i]),
        ],
        const SizedBox(height: 16),
        // Mandatory DATA SIMULASI Badge (AGENTS.md Rule 3 & DESIGN.md)
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          decoration: AppTheme.brutalBox(
            color: AppColors.nbPaper,
            borderColor: AppColors.nbBlack,
            borderWidth: AppTheme.borderDefault,
            shadowOffset: 2,
          ),
          child: Row(
            children: <Widget>[
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: AppTheme.brutalBox(
                  color: AppColors.nbOrange,
                  borderColor: AppColors.nbBlack,
                  borderWidth: AppTheme.borderDefault,
                  shadowOffset: 1,
                ),
                child: Text(
                  HomeMockData.simulationLabel,
                  style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 10),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  'Rekomendasi & katalog di atas merupakan data pratinjau antarmuka.',
                  style: AppTheme.bodySm(AppColors.nbTextMuted, fontSize: 11),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildBundleCard(EbookBundle bundle) {
    return Container(
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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Flexible(
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 2,
                  ),
                  decoration: BoxDecoration(
                    color: _resolveBadgeColor(bundle.trackColorKey),
                    border: Border.all(
                      color: AppColors.nbBlack,
                      width: AppTheme.borderThin,
                    ),
                  ),
                  child: Text(
                    bundle.trackLabel,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: AppTheme.labelSm(AppColors.nbBlack, fontSize: 10),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: AppTheme.brutalBox(
                  color: _resolveBadgeColor(bundle.discountColorKey),
                  borderColor: AppColors.nbBlack,
                  borderWidth: AppTheme.borderThin,
                  shadowOffset: 1,
                ),
                child: Text(
                  bundle.discountLabel,
                  style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 12),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            bundle.title,
            style: AppTheme.headlineSmMobile(AppColors.nbBlack),
          ),
          const SizedBox(height: 8),
          // Included Books Checklist Box (`bg-nb-paper p-2.5 border-2 border-nb-black mb-3`)
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.nbPaper,
              border: Border.all(
                color: AppColors.nbBlack,
                width: AppTheme.borderDefault,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                for (int i = 0; i < bundle.includedBooks.length; i++) ...<Widget>[
                  if (i > 0) const SizedBox(height: 6),
                  Row(
                    children: <Widget>[
                      Container(
                        width: 14,
                        height: 14,
                        alignment: Alignment.center,
                        decoration: BoxDecoration(
                          color: AppColors.nbGreen,
                          border: Border.all(
                            color: AppColors.nbBlack,
                            width: AppTheme.borderThin,
                          ),
                        ),
                        child: Text(
                          '\u2713',
                          style: AppTheme.dataMono(
                            AppColors.nbBlack,
                            fontSize: 9,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          bundle.includedBooks[i],
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: AppTheme.bodySm(
                            AppColors.nbBlack,
                            fontSize: 14,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ],
            ),
          ),
          const SizedBox(height: 12),
          // Price & Claim CTA Footer (`pt-2 border-t-2 border-nb-black`)
          Container(
            padding: const EdgeInsets.only(top: 8),
            decoration: const BoxDecoration(
              border: Border(
                top: BorderSide(
                  color: AppColors.nbBlack,
                  width: AppTheme.borderDefault,
                ),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: <Widget>[
                Flexible(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Text(
                        bundle.formattedOriginalPrice,
                        style: AppTheme.dataMono(
                          AppColors.nbTextMuted,
                          fontSize: 11,
                        ).copyWith(
                          decoration: TextDecoration.lineThrough,
                          decorationThickness: 2,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        bundle.formattedDiscountedPrice,
                        style: AppTheme.dataMono(
                          AppColors.nbBlack,
                          fontSize: 18,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                Semantics(
                  button: true,
                  label: 'Klaim ${bundle.title}',
                  child: InkWell(
                    key: Key('claim_bundle_${bundle.id}'),
                    onTap: () => onClaimBundle(bundle),
                    child: Container(
                      constraints: const BoxConstraints(minHeight: 38),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 8,
                      ),
                      alignment: Alignment.center,
                      decoration: AppTheme.brutalBox(
                        color: AppColors.nbYellow,
                        borderColor: AppColors.nbBlack,
                        borderWidth: AppTheme.borderDefault,
                        shadowOffset: 3,
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: <Widget>[
                          const Icon(
                            Icons.shopping_bag_outlined,
                            size: 16,
                            color: AppColors.nbBlack,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            '+ KLAIM BUNDEL',
                            style: AppTheme.labelMd(AppColors.nbBlack),
                          ),
                        ],
                      ),
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
