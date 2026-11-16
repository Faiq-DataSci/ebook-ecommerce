import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../domain/models/category.dart';

/// Individual category filter chip matching Stitch Section 4 (`Kategori Pilihan`).
class CategoryCard extends StatelessWidget {
  final Category category;
  final bool isSelected;
  final NbPalette palette;
  final VoidCallback onTap;

  const CategoryCard({
    super.key,
    required this.category,
    required this.isSelected,
    required this.palette,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final backgroundColor = isSelected ? palette.yellow : palette.surface;
    final textColor = isSelected ? AppColors.nbBlack : palette.textPrimary;

    return Semantics(
      button: true,
      selected: isSelected,
      label: 'Kategori ${category.label}',
      child: InkWell(
        key: Key('category_chip_${category.id}'),
        onTap: onTap,
        child: ConstrainedBox(
          constraints: const BoxConstraints(minHeight: 40),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
            decoration: AppTheme.brutalBox(
              color: backgroundColor,
              borderColor: palette.ink,
              borderWidth: AppTheme.borderDefault,
              shadowOffset: 2,
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                if (isSelected) ...<Widget>[
                  Icon(
                    Icons.check,
                    size: 16,
                    color: textColor,
                  ),
                  const SizedBox(width: 6),
                ],
                Text(
                  category.label,
                  style: AppTheme.labelSm(textColor, fontSize: 12),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
