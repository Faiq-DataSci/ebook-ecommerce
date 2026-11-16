import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// Search bar + Filter action button matching Stitch Section 2:
/// - Left: `44px` height search box (`bg-nb-white`, `2px` border, `2px` shadow,
///   search icon + text field with placeholder `Cari judul, penulis, ISBN...`)
/// - Right: `44x44` filter button (`bg-nb-white`, `2px` border, `2px` shadow,
///   `tune` icon)
class HomeSearchBar extends StatelessWidget {
  final NbPalette palette;
  final TextEditingController controller;
  final ValueChanged<String> onChanged;
  final VoidCallback onClear;
  final VoidCallback onFilterTap;

  const HomeSearchBar({
    super.key,
    required this.palette,
    required this.controller,
    required this.onChanged,
    required this.onClear,
    required this.onFilterTap,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: <Widget>[
        Expanded(
          child: Container(
            height: 44,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            decoration: AppTheme.brutalBox(
              color: palette.surface,
              borderColor: palette.ink,
              borderWidth: AppTheme.borderDefault,
              shadowOffset: 2,
            ),
            child: Row(
              children: <Widget>[
                Icon(
                  Icons.search,
                  size: 20,
                  color: palette.textPrimary,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: TextField(
                    key: const Key('home_search_input'),
                    controller: controller,
                    onChanged: onChanged,
                    style: AppTheme.bodySm(palette.textPrimary, fontSize: 14),
                    cursorColor: palette.ink,
                    decoration: InputDecoration(
                      isDense: true,
                      contentPadding: EdgeInsets.zero,
                      border: InputBorder.none,
                      hintText: 'Cari judul, penulis, ISBN...',
                      hintStyle: AppTheme.bodySm(
                        palette.textDisabled,
                        fontSize: 14,
                      ),
                    ),
                  ),
                ),
                if (controller.text.isNotEmpty)
                  InkWell(
                    key: const Key('clear_search_button'),
                    onTap: onClear,
                    child: Padding(
                      padding: const EdgeInsets.all(4),
                      child: Icon(
                        Icons.close,
                        size: 16,
                        color: palette.textPrimary,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
        const SizedBox(width: 8),
        Semantics(
          button: true,
          label: 'Filter dan simulasi state katalog',
          child: Tooltip(
            message: 'Filter & State Katalog',
            child: InkWell(
              key: const Key('filter_button'),
              onTap: onFilterTap,
              child: Container(
                width: 44,
                height: 44,
                alignment: Alignment.center,
                decoration: AppTheme.brutalBox(
                  color: palette.surface,
                  borderColor: palette.ink,
                  borderWidth: AppTheme.borderDefault,
                  shadowOffset: 2,
                ),
                child: Icon(
                  Icons.tune,
                  size: 22,
                  color: palette.textPrimary,
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }
}
