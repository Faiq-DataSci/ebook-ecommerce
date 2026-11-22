import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// Top header bar matching Google Stitch `Beranda Mobile (Neubrutalism)`:
/// - Height: `56px` (`h-14`), background `bg-nb-paper` (`#FFFDF5`), no bottom border
/// - Left: `BUKUKITA` (`Syne` ExtraBold 800, `20px`, uppercase)
/// - Right: Light mode indicator button (`44x44`), Cart button (`44x44`) with
///   yellow badge counter (`2`), and circular user profile button (`32x32` `#745C00`).
class HomeHeader extends StatelessWidget {
  final NbPalette palette;
  final bool isDarkMode;
  final int cartCount;
  final VoidCallback onToggleTheme;
  final VoidCallback onCartTap;
  final VoidCallback onProfileTap;

  const HomeHeader({
    super.key,
    required this.palette,
    required this.isDarkMode,
    required this.cartCount,
    required this.onToggleTheme,
    required this.onCartTap,
    required this.onProfileTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 56,
      padding: const EdgeInsets.symmetric(horizontal: AppTheme.marginMobile),
      color: AppColors.nbPaper,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: <Widget>[
          Flexible(
            child: Text(
              'BUKUKITA',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: AppTheme.brandTitle(AppColors.nbBlack),
            ),
          ),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              // Light Mode Button (44x44) matching Stitch `light_mode` icon
              Semantics(
                button: true,
                label: 'Tema Terang Neubrutalism',
                child: InkWell(
                  key: const Key('theme_toggle_button'),
                  onTap: onToggleTheme,
                  child: Container(
                    width: 44,
                    height: 44,
                    alignment: Alignment.center,
                    decoration: AppTheme.brutalBox(
                      color: AppColors.nbWhite,
                      borderColor: AppColors.nbBlack,
                      borderWidth: AppTheme.borderDefault,
                      shadowOffset: 2,
                    ),
                    child: const Icon(
                      Icons.wb_sunny_outlined,
                      size: 20,
                      color: AppColors.nbBlack,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              // Shopping Cart Button (44x44) with yellow counter badge
              Semantics(
                button: true,
                label: 'Keranjang belanja ($cartCount item)',
                child: InkWell(
                  key: const Key('cart_button'),
                  onTap: onCartTap,
                  child: Stack(
                    clipBehavior: Clip.none,
                    children: <Widget>[
                      Container(
                        width: 44,
                        height: 44,
                        alignment: Alignment.center,
                        decoration: AppTheme.brutalBox(
                          color: AppColors.nbWhite,
                          borderColor: AppColors.nbBlack,
                          borderWidth: AppTheme.borderDefault,
                          shadowOffset: 2,
                        ),
                        child: const Icon(
                          Icons.shopping_cart_outlined,
                          size: 20,
                          color: AppColors.nbBlack,
                        ),
                      ),
                      Positioned(
                        top: -6,
                        right: -6,
                        child: Container(
                          constraints: const BoxConstraints(
                            minWidth: 18,
                            minHeight: 18,
                          ),
                          padding: const EdgeInsets.symmetric(horizontal: 4),
                          alignment: Alignment.center,
                          decoration: AppTheme.brutalBox(
                            color: AppColors.nbYellow,
                            borderColor: AppColors.nbBlack,
                            borderWidth: AppTheme.borderThin,
                            shadowOffset: 1,
                          ),
                          child: Text(
                            '$cartCount',
                            key: const Key('cart_badge_text'),
                            style: AppTheme.dataMono(
                              AppColors.nbBlack,
                              fontSize: 10,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 8),
              // User Profile Avatar (32x32 circle `#745C00`)
              Semantics(
                button: true,
                label: 'Profil pengguna Raditya',
                child: InkWell(
                  key: const Key('profile_avatar_button'),
                  onTap: onProfileTap,
                  child: Container(
                    width: 32,
                    height: 32,
                    alignment: Alignment.center,
                    decoration: const BoxDecoration(
                      color: AppColors.primary,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.person_outline,
                      size: 18,
                      color: AppColors.onPrimary,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
