import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/utils/rupiah_formatter.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../../cart/domain/entities/cart_item.dart';
import '../../../cart/presentation/providers/cart_provider.dart';
import '../../../catalog/presentation/pages/ebook_detail_screen.dart';
import '../../../home/data/models/saw_recommendation_model.dart';
import 'saw_matrix_table.dart';

class SawRankCard extends ConsumerWidget {
  final SawRecommendationModel item;
  final bool isExpanded;
  final List<SawCriterionModel> activeCriteria;
  final VoidCallback onToggleMatrix;

  const SawRankCard({
    super.key,
    required this.item,
    required this.isExpanded,
    required this.activeCriteria,
    required this.onToggleMatrix,
  });

  Color _resolveRankColor(int rank) {
    if (rank == 1) return AppColors.nbYellow;
    if (rank == 2) return AppColors.nbLavender;
    if (rank == 3) return AppColors.nbGreen;
    return AppColors.nbPaper;
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final rankColor = _resolveRankColor(item.rank);
    final priceInt = int.tryParse(item.price ?? '0') ?? 0;
    final formattedPrice = formatRupiah(priceInt);

    return Container(
      key: Key('saw_rank_card_${item.rank}'),
      decoration: AppTheme.brutalBox(
        color: AppColors.nbWhite,
        borderColor: AppColors.nbBlack,
        borderWidth: AppTheme.borderDefault,
        shadowOffset: 4,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 44,
                  height: 44,
                  alignment: Alignment.center,
                  decoration: AppTheme.brutalBox(
                    color: rankColor,
                    borderColor: AppColors.nbBlack,
                    borderWidth: AppTheme.borderDefault,
                    shadowOffset: 2,
                  ),
                  child: Text(
                    '#${item.rank}',
                    style: const TextStyle(
                      fontFamily: 'SpaceMono',
                      fontSize: 16,
                      fontWeight: FontWeight.w900,
                      color: AppColors.nbBlack,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (item.categoryName != null) ...[
                        Text(
                          item.categoryName!.toUpperCase(),
                          style: AppTheme.dataMono(
                            AppColors.nbTextMuted,
                            fontSize: 10,
                          ),
                        ),
                        const SizedBox(height: 2),
                      ],
                      Text(
                        item.title,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w900,
                          fontFamily: 'SpaceGrotesk',
                          color: AppColors.nbBlack,
                        ),
                      ),
                      if (item.author != null)
                        Text(
                          item.author!,
                          style: const TextStyle(
                            fontSize: 12,
                            color: AppColors.nbTextMuted,
                          ),
                        ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.nbBlack,
                    border: Border.all(
                      color: AppColors.nbBlack,
                      width: AppTheme.borderThin,
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      const Text(
                        'SKOR V',
                        style: TextStyle(
                          fontFamily: 'SpaceMono',
                          fontSize: 8,
                          color: AppColors.nbYellow,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        item.displayScore,
                        style: const TextStyle(
                          fontFamily: 'SpaceMono',
                          fontSize: 13,
                          fontWeight: FontWeight.w900,
                          color: AppColors.nbWhite,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: const BoxDecoration(
              color: AppColors.nbPaper,
              border: Border(
                top: BorderSide(
                  color: AppColors.nbBlack,
                  width: AppTheme.borderThin,
                ),
                bottom: BorderSide(
                  color: AppColors.nbBlack,
                  width: AppTheme.borderThin,
                ),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  formattedPrice,
                  style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 13),
                ),
                const SizedBox(width: 8),
                Flexible(
                  child: InkWell(
                    key: Key('toggle_matrix_button_${item.rank}'),
                    onTap: onToggleMatrix,
                    child: Text(
                      isExpanded
                          ? 'Sembunyikan Matriks ▲'
                          : 'Lihat Matriks Normalisasi ▼',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      textAlign: TextAlign.right,
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w900,
                        color: AppColors.nbBlack,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          if (isExpanded)
            SawMatrixTable(item: item, activeCriteria: activeCriteria),
          Padding(
            padding: const EdgeInsets.all(10),
            child: Row(
              children: [
                Expanded(
                  child: InkWell(
                    key: Key('saw_detail_btn_${item.rank}'),
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) =>
                              EbookDetailScreen(ebookId: item.ebookId),
                        ),
                      );
                    },
                    child: Container(
                      height: 36,
                      alignment: Alignment.center,
                      decoration: AppTheme.brutalBox(
                        color: AppColors.nbWhite,
                        borderColor: AppColors.nbBlack,
                        borderWidth: AppTheme.borderDefault,
                        shadowOffset: 2,
                      ),
                      child: const Text(
                        'DETAIL BUKU',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w900,
                          color: AppColors.nbBlack,
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                InkWell(
                  key: Key('saw_add_cart_btn_${item.rank}'),
                  onTap: () {
                    final cartItem = CartItem(
                      id: item.ebookId,
                      title: item.title,
                      author: item.author ?? 'Penulis E-Book',
                      pageCount: 320,
                      category: item.categoryName ?? 'Teknologi',
                      sawRankLabel: 'Rank #${item.rank} SAW',
                      price: priceInt,
                      ratingAvg: 4.8,
                      isSelected: true,
                    );
                    ref.read(cartProvider.notifier).addItem(cartItem);

                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        backgroundColor: AppColors.nbGreen,
                        content: Text(
                          '${item.title} ditambahkan ke keranjang!',
                          style: const TextStyle(
                            color: AppColors.nbBlack,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    );
                  },
                  child: Container(
                    height: 36,
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    alignment: Alignment.center,
                    decoration: AppTheme.brutalBox(
                      color: AppColors.nbYellow,
                      borderColor: AppColors.nbBlack,
                      borderWidth: AppTheme.borderDefault,
                      shadowOffset: 2,
                    ),
                    child: const Row(
                      children: [
                        Icon(
                          Icons.add_shopping_cart,
                          size: 16,
                          color: AppColors.nbBlack,
                        ),
                        SizedBox(width: 4),
                        Text(
                          '+ BELI',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w900,
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
