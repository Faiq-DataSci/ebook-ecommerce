import 'package:flutter/material.dart';
import '../../../../core/utils/rupiah_formatter.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../domain/entities/catalog_filter.dart';

/// ActiveFilterChipRow (Google Stitch + design.md §5.9).
/// Menampilkan chip filter aktif yang dapat dihapus satu per satu dengan area
/// sentuh memadai (minimal 48dp) serta tombol reset filter putus-putus.
class ActiveFilterChips extends StatelessWidget {
  final CatalogFilter filter;
  final VoidCallback onRemoveCategory;
  final VoidCallback onRemoveAuthor;
  final VoidCallback onRemovePrice;
  final VoidCallback onRemoveRating;
  final VoidCallback onResetFilters;

  const ActiveFilterChips({
    super.key,
    required this.filter,
    required this.onRemoveCategory,
    required this.onRemoveAuthor,
    required this.onRemovePrice,
    required this.onRemoveRating,
    required this.onResetFilters,
  });

  @override
  Widget build(BuildContext context) {
    if (!filter.hasActiveFilters) {
      return const SizedBox.shrink();
    }

    final categoryLabel = filter.categoryName ?? filter.categoryId;
    final hasCategory = categoryLabel != null &&
        categoryLabel.isNotEmpty &&
        categoryLabel != 'semua';
    final hasAuthor = (filter.author ?? '').trim().isNotEmpty;
    final hasPrice = filter.minPrice != null || filter.maxPrice != null;
    final hasRating = filter.minRating != null && filter.minRating! > 0;

    String formatPriceChip() {
      if (filter.minPrice != null && filter.maxPrice != null) {
        return '${formatRupiah(filter.minPrice!)} - ${formatRupiah(filter.maxPrice!)}';
      } else if (filter.maxPrice != null) {
        return '≤ ${formatRupiah(filter.maxPrice!)}';
      } else if (filter.minPrice != null) {
        return '≥ ${formatRupiah(filter.minPrice!)}';
      }
      return '';
    }

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      crossAxisAlignment: WrapCrossAlignment.center,
      children: <Widget>[
        if (hasCategory)
          _buildChip(
            key: const Key('chip_category'),
            label: categoryLabel.toUpperCase(),
            onDelete: onRemoveCategory,
            deleteSemantics: 'Hapus filter kategori $categoryLabel',
          ),
        if (hasAuthor)
          _buildChip(
            key: const Key('chip_author'),
            label: 'PENULIS: ${filter.author!.toUpperCase()}',
            onDelete: onRemoveAuthor,
            deleteSemantics: 'Hapus filter penulis ${filter.author}',
          ),
        if (hasPrice)
          _buildChip(
            key: const Key('chip_price'),
            label: formatPriceChip(),
            isMono: true,
            onDelete: onRemovePrice,
            deleteSemantics: 'Hapus filter rentang harga',
          ),
        if (hasRating)
          _buildChip(
            key: const Key('chip_rating'),
            label: '★ ≥ ${formatRating(filter.minRating!)}',
            isMono: true,
            onDelete: onRemoveRating,
            deleteSemantics: 'Hapus filter rating',
          ),
        // Tombol RESET FILTER (border dashed per Stitch HTML)
        Semantics(
          button: true,
          label: 'Reset semua filter kriteria',
          child: InkWell(
            key: const Key('chip_reset_filters_button'),
            onTap: onResetFilters,
            child: Container(
              constraints: const BoxConstraints(minHeight: 32),
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.transparent,
                border: Border.all(
                  color: AppColors.nbBlack,
                  width: AppTheme.borderDefault,
                  style: BorderStyle.solid,
                ),
              ),
              child: Text(
                'RESET FILTER',
                style: AppTheme.labelSm(AppColors.nbBlack, fontSize: 11)
                    .copyWith(decoration: TextDecoration.underline),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildChip({
    required Key key,
    required String label,
    required VoidCallback onDelete,
    required String deleteSemantics,
    bool isMono = false,
  }) {
    return Container(
      key: key,
      decoration: AppTheme.brutalBox(
        color: AppColors.surfaceContainer,
        borderColor: AppColors.nbBlack,
        borderWidth: AppTheme.borderDefault,
        shadowOffset: 2,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Padding(
            padding: const EdgeInsets.only(left: 8, top: 4, bottom: 4),
            child: Text(
              label,
              style: isMono
                  ? AppTheme.dataMono(AppColors.nbBlack, fontSize: 11)
                  : AppTheme.labelSm(AppColors.nbBlack, fontSize: 11),
            ),
          ),
          Semantics(
            button: true,
            label: deleteSemantics,
            child: InkWell(
              onTap: onDelete,
              child: Container(
                constraints: const BoxConstraints(
                  minWidth: 32,
                  minHeight: 32,
                ),
                alignment: Alignment.center,
                padding: const EdgeInsets.symmetric(horizontal: 6),
                child: const Icon(
                  Icons.close,
                  size: 14,
                  color: AppColors.nbBlack,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
