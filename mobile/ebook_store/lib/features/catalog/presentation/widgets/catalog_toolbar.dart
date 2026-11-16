import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../domain/entities/catalog_filter.dart';
import '../providers/catalog_provider.dart';

/// Bilah kedua katalog: Tombol Urutkan + Toggle Tampilan Grid / Baris (design.md §6 & §8.4).
class CatalogToolbar extends StatelessWidget {
  final CatalogSortOption currentSort;
  final ValueChanged<CatalogSortOption> onSortChanged;
  final CatalogViewMode currentViewMode;
  final ValueChanged<CatalogViewMode> onViewModeChanged;

  const CatalogToolbar({
    super.key,
    required this.currentSort,
    required this.onSortChanged,
    required this.currentViewMode,
    required this.onViewModeChanged,
  });

  void _showSortSheet(BuildContext context) {
    showModalBottomSheet<void>(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (sheetContext) {
        return Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.nbPaper,
            border: Border(
              top: BorderSide(
                color: AppColors.nbBlack,
                width: AppTheme.borderMedium,
              ),
            ),
          ),
          child: SafeArea(
            top: false,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                // Handle bar
                Center(
                  child: Container(
                    width: 40,
                    height: 6,
                    decoration: BoxDecoration(
                      color: AppColors.nbBlack,
                      borderRadius: BorderRadius.circular(3),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    Text(
                      'URUTKAN KATALOG',
                      style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: AppColors.nbBlack),
                      onPressed: () => Navigator.of(sheetContext).pop(),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                for (final option in CatalogSortOption.values) ...<Widget>[
                  InkWell(
                    key: Key('sort_option_${option.name}'),
                    onTap: () {
                      onSortChanged(option);
                      Navigator.of(sheetContext).pop();
                    },
                    child: Container(
                      width: double.infinity,
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 12,
                      ),
                      decoration: AppTheme.brutalBox(
                        color: option == currentSort
                            ? AppColors.nbYellow
                            : AppColors.nbWhite,
                        borderColor: AppColors.nbBlack,
                        borderWidth: AppTheme.borderDefault,
                        shadowOffset: option == currentSort ? 3 : 1,
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: <Widget>[
                          Text(
                            option.label,
                            style: AppTheme.labelMd(AppColors.nbBlack),
                          ),
                          if (option == currentSort)
                            const Icon(
                              Icons.check,
                              size: 18,
                              color: AppColors.nbBlack,
                            ),
                        ],
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      children: <Widget>[
        // Selector Urutkan
        Expanded(
          child: Semantics(
            button: true,
            label: 'Ubah urutan katalog: ${currentSort.label}',
            child: InkWell(
              key: const Key('catalog_sort_dropdown_button'),
              onTap: () => _showSortSheet(context),
              child: Container(
                height: 36,
                padding: const EdgeInsets.symmetric(horizontal: 10),
                decoration: AppTheme.brutalBox(
                  color: AppColors.nbWhite,
                  borderColor: AppColors.nbBlack,
                  borderWidth: AppTheme.borderDefault,
                  shadowOffset: 2,
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    Flexible(
                      child: Text.rich(
                        TextSpan(
                          text: 'Urutkan: ',
                          style: AppTheme.labelSm(
                            AppColors.nbBlack,
                            fontSize: 12,
                          ),
                          children: <InlineSpan>[
                            TextSpan(
                              text: currentSort.label,
                              style: const TextStyle(
                                decoration: TextDecoration.underline,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const Icon(
                      Icons.expand_more,
                      size: 18,
                      color: AppColors.nbBlack,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
        const SizedBox(width: 8),
        // Toggle Grid vs List (design.md §6)
        Row(
          children: <Widget>[
            Semantics(
              button: true,
              selected: currentViewMode == CatalogViewMode.grid,
              label: 'Tampilan Grid (2 kolom)',
              child: InkWell(
                key: const Key('catalog_view_mode_grid'),
                onTap: () => onViewModeChanged(CatalogViewMode.grid),
                child: Container(
                  width: 36,
                  height: 36,
                  alignment: Alignment.center,
                  decoration: AppTheme.brutalBox(
                    color: currentViewMode == CatalogViewMode.grid
                        ? AppColors.nbYellow
                        : AppColors.nbWhite,
                    borderColor: AppColors.nbBlack,
                    borderWidth: AppTheme.borderDefault,
                    shadowOffset: 2,
                  ),
                  child: const Icon(
                    Icons.grid_view,
                    size: 18,
                    color: AppColors.nbBlack,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 4),
            Semantics(
              button: true,
              selected: currentViewMode == CatalogViewMode.list,
              label: 'Tampilan Baris (Daftar)',
              child: InkWell(
                key: const Key('catalog_view_mode_list'),
                onTap: () => onViewModeChanged(CatalogViewMode.list),
                child: Container(
                  width: 36,
                  height: 36,
                  alignment: Alignment.center,
                  decoration: AppTheme.brutalBox(
                    color: currentViewMode == CatalogViewMode.list
                        ? AppColors.nbYellow
                        : AppColors.nbWhite,
                    borderColor: AppColors.nbBlack,
                    borderWidth: AppTheme.borderDefault,
                    shadowOffset: 2,
                  ),
                  child: const Icon(
                    Icons.view_agenda,
                    size: 18,
                    color: AppColors.nbBlack,
                  ),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
