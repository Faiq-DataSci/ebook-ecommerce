import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// Bilah pencarian dan tombol pemicu filter bottom sheet
/// (Google Stitch Zona B + design.md §8.4).
class CatalogSearchBar extends StatelessWidget {
  final TextEditingController controller;
  final ValueChanged<String> onChanged;
  final VoidCallback onClear;
  final VoidCallback onFilterTap;
  final int activeFilterCount;

  const CatalogSearchBar({
    super.key,
    required this.controller,
    required this.onChanged,
    required this.onClear,
    required this.onFilterTap,
    this.activeFilterCount = 0,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: <Widget>[
        // Kolom Input Pencarian
        Expanded(
          child: Container(
            height: 44,
            decoration: AppTheme.brutalBox(
              color: AppColors.nbWhite,
              borderColor: AppColors.nbBlack,
              borderWidth: AppTheme.borderDefault,
              shadowOffset: 3,
            ),
            child: Row(
              children: <Widget>[
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 10),
                  child: Icon(Icons.search, size: 20, color: AppColors.nbBlack),
                ),
                Expanded(
                  child: TextField(
                    key: const Key('catalog_search_input'),
                    controller: controller,
                    onChanged: onChanged,
                    style: AppTheme.bodySm(AppColors.nbBlack, fontSize: 14),
                    cursorColor: AppColors.nbBlack,
                    decoration: InputDecoration(
                      isDense: true,
                      contentPadding: EdgeInsets.zero,
                      border: InputBorder.none,
                      hintText: 'Cari judul atau penulis...',
                      hintStyle: AppTheme.bodySm(
                        AppColors.nbDisabledText,
                        fontSize: 14,
                      ),
                    ),
                  ),
                ),
                if (controller.text.isNotEmpty)
                  Semantics(
                    button: true,
                    label: 'Hapus kata kunci pencarian',
                    child: InkWell(
                      key: const Key('catalog_search_clear_button'),
                      onTap: onClear,
                      child: const Padding(
                        padding: EdgeInsets.all(10),
                        child: Icon(
                          Icons.close,
                          size: 18,
                          color: AppColors.nbBlack,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
        const SizedBox(width: 8),
        // Tombol Pemicu Filter Sheet (Kuning Neubrutalism)
        Semantics(
          button: true,
          label: 'Buka panel filter e-book',
          child: InkWell(
            key: const Key('catalog_filter_button'),
            onTap: onFilterTap,
            child: Container(
              height: 44,
              padding: const EdgeInsets.symmetric(horizontal: 12),
              decoration: AppTheme.brutalBox(
                color: AppColors.nbYellow,
                borderColor: AppColors.nbBlack,
                borderWidth: AppTheme.borderDefault,
                shadowOffset: 3,
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  const Icon(Icons.tune, size: 20, color: AppColors.nbBlack),
                  const SizedBox(width: 6),
                  Text(
                    'FILTER',
                    style: AppTheme.labelSm(
                      AppColors.nbBlack,
                      fontSize: 12,
                    ).copyWith(letterSpacing: 0.5),
                  ),
                  if (activeFilterCount > 0) ...<Widget>[
                    const SizedBox(width: 6),
                    Container(
                      constraints: const BoxConstraints(
                        minWidth: 18,
                        minHeight: 18,
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: AppColors.nbBlack,
                        border: Border.all(
                          color: AppColors.nbBlack,
                          width: AppTheme.borderThin,
                        ),
                      ),
                      child: Text(
                        '$activeFilterCount',
                        style: AppTheme.dataMono(
                          AppColors.nbWhite,
                          fontSize: 10,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
