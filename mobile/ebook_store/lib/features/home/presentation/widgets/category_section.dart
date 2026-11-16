import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../domain/models/category.dart';
import 'category_card.dart';
import 'section_header.dart';

/// Horizontal scrollable category section (`Kategori Pilihan` - `6 Bidang`).
class CategorySection extends StatelessWidget {
  final List<Category> categories;
  final String selectedCategoryId;
  final NbPalette palette;
  final ValueChanged<String> onSelectCategory;

  const CategorySection({
    super.key,
    required this.categories,
    required this.selectedCategoryId,
    required this.palette,
    required this.onSelectCategory,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        SectionHeader(
          title: 'KATEGORI PILIHAN',
          palette: palette,
          isSmallUppercase: true,
          rightMonoText: '${categories.length} Bidang',
        ),
        const SizedBox(height: 10),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          clipBehavior: Clip.none,
          padding: const EdgeInsets.only(bottom: 4),
          child: Row(
            children: <Widget>[
              for (int i = 0; i < categories.length; i++) ...<Widget>[
                if (i > 0) const SizedBox(width: 8),
                CategoryCard(
                  category: categories[i],
                  isSelected: categories[i].id == selectedCategoryId,
                  palette: palette,
                  onTap: () => onSelectCategory(categories[i].id),
                ),
              ],
            ],
          ),
        ),
      ],
    );
  }
}
