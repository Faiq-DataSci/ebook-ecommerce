import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../domain/entities/catalog_category.dart';

/// Baris geser horizontal pil kategori e-book (Google Stitch + design.md §8.4).
class CategoryPillsBar extends StatelessWidget {
  final List<CatalogCategory> categories;
  final String? selectedCategoryId;
  final ValueChanged<CatalogCategory?> onSelectCategory;

  const CategoryPillsBar({
    super.key,
    required this.categories,
    required this.selectedCategoryId,
    required this.onSelectCategory,
  });

  @override
  Widget build(BuildContext context) {
    final isAllSelected =
        selectedCategoryId == null ||
        selectedCategoryId!.isEmpty ||
        selectedCategoryId == 'semua';

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      physics: const BouncingScrollPhysics(),
      child: Row(
        children: <Widget>[
          // Pil "Semua"
          _buildPill(
            key: const Key('category_pill_all'),
            label: 'Semua',
            isSelected: isAllSelected,
            onTap: () => onSelectCategory(null),
          ),
          const SizedBox(width: 8),
          for (final cat in categories) ...<Widget>[
            _buildPill(
              key: Key('category_pill_${cat.id}'),
              label: cat.name,
              isSelected: selectedCategoryId == cat.id,
              onTap: () => onSelectCategory(cat),
            ),
            const SizedBox(width: 8),
          ],
        ],
      ),
    );
  }

  Widget _buildPill({
    required Key key,
    required String label,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return Semantics(
      button: true,
      selected: isSelected,
      label: 'Kategori $label',
      child: InkWell(
        key: key,
        onTap: onTap,
        child: Container(
          height: 36,
          padding: const EdgeInsets.symmetric(horizontal: 14),
          alignment: Alignment.center,
          decoration: AppTheme.brutalBox(
            color: isSelected ? AppColors.nbYellow : AppColors.nbWhite,
            borderColor: AppColors.nbBlack,
            borderWidth: AppTheme.borderDefault,
            shadowOffset: isSelected ? 3 : 2,
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              if (isSelected) ...<Widget>[
                const Icon(Icons.check, size: 16, color: AppColors.nbBlack),
                const SizedBox(width: 6),
              ],
              Text(
                label,
                style: AppTheme.labelSm(AppColors.nbBlack, fontSize: 12),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
