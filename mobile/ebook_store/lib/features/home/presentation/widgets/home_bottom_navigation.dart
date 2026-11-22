import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// Fixed Bottom Navigation Bar matching Google Stitch `Beranda Mobile (Neubrutalism)`:
/// - Height: `64px` (`h-16`) + bottom `SafeArea` padding
/// - Background: `bg-nb-white` (`#FFFFFF`)
/// - 4 equal columns (`grid-cols-4 gap-1.5`):
///   1. `Beranda` (`home_outlined`)
///   2. `Katalog` (`menu_book_outlined`)
///   3. `Pustaka` (`local_library_outlined`)
///   4. `Profil` (`person_outline`)
/// - Selected item has `bg-nb-yellow`, `2px` border, `2px` hard shadow (`nb-shadow-sm`)
class HomeBottomNavigation extends StatelessWidget {
  final int currentIndex;
  final NbPalette palette;
  final ValueChanged<int> onTap;

  const HomeBottomNavigation({
    super.key,
    required this.currentIndex,
    required this.palette,
    required this.onTap,
  });

  static const List<_NavItemSpec> _items = <_NavItemSpec>[
    _NavItemSpec(id: 'beranda', label: 'Beranda', icon: Icons.home_outlined),
    _NavItemSpec(
      id: 'katalog',
      label: 'Katalog',
      icon: Icons.menu_book_outlined,
    ),
    _NavItemSpec(
      id: 'pustaka',
      label: 'Pustaka',
      icon: Icons.local_library_outlined,
    ),
    _NavItemSpec(id: 'profil', label: 'Profil', icon: Icons.person_outline),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      color: AppColors.nbWhite,
      child: SafeArea(
        top: false,
        child: Container(
          height: 64,
          padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 6),
          child: Row(
            children: <Widget>[
              for (int i = 0; i < _items.length; i++) ...<Widget>[
                if (i > 0) const SizedBox(width: 6),
                Expanded(
                  child: _buildItem(index: i, spec: _items[i]),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildItem({required int index, required _NavItemSpec spec}) {
    final isSelected = index == currentIndex;

    return Semantics(
      button: true,
      selected: isSelected,
      label: 'Navigasi ${spec.label}',
      child: InkWell(
        key: Key('bottom_nav_${spec.id}'),
        onTap: () => onTap(index),
        child: Container(
          constraints: const BoxConstraints(minHeight: 44),
          padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 4),
          decoration: isSelected
              ? AppTheme.brutalBox(
                  color: AppColors.nbYellow,
                  borderColor: AppColors.nbBlack,
                  borderWidth: AppTheme.borderDefault,
                  shadowOffset: 2,
                )
              : const BoxDecoration(color: Colors.transparent),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              Icon(spec.icon, size: 20, color: AppColors.nbBlack),
              const SizedBox(height: 2),
              Text(
                spec.label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: AppTheme.labelSm(AppColors.nbBlack, fontSize: 12),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _NavItemSpec {
  final String id;
  final String label;
  final IconData icon;

  const _NavItemSpec({
    required this.id,
    required this.label,
    required this.icon,
  });
}
