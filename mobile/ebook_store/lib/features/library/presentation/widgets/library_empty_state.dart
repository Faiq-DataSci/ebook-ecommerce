import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// Tampilan Empty State Perpustakaan Digital sesuai `design.md §8.9`:
/// "Perpustakaanmu masih kosong" + tombol "Jelajahi katalog".
class LibraryEmptyState extends StatelessWidget {
  final VoidCallback onExploreCatalog;

  const LibraryEmptyState({super.key, required this.onExploreCatalog});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Container(
          key: const Key('library_empty_state'),
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 32.0),
          decoration: BoxDecoration(
            color: AppColors.nbWhite,
            border: Border.all(color: AppColors.nbBlack, width: 2.5),
            boxShadow: const [
              BoxShadow(
                color: AppColors.nbBlack,
                offset: Offset(4.0, 4.0),
                blurRadius: 0.0,
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Badge Neubrutalist Typographic Header
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 14.0,
                  vertical: 7.0,
                ),
                decoration: BoxDecoration(
                  color: AppColors.nbYellow,
                  border: Border.all(color: AppColors.nbBlack, width: 2.0),
                  boxShadow: const [
                    BoxShadow(
                      color: AppColors.nbBlack,
                      offset: Offset(2.5, 2.5),
                      blurRadius: 0.0,
                    ),
                  ],
                ),
                child: const Text(
                  '[ RAK BUKU KOSONG ]',
                  style: TextStyle(
                    fontFamily: AppTheme.fontMono,
                    fontSize: 11.5,
                    fontWeight: FontWeight.w800,
                    color: AppColors.nbBlack,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
              const SizedBox(height: 18.0),
              const Text(
                'Perpustakaanmu masih kosong. Jelajahi katalog untuk menemukan buku pertamamu.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontFamily: AppTheme.fontHeadline,
                  fontSize: 15.0,
                  fontWeight: FontWeight.w800,
                  color: AppColors.nbBlack,
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 22.0),
              Semantics(
                button: true,
                label: 'Jelajahi katalog',
                child: InkWell(
                  key: const Key('library_explore_catalog_button'),
                  onTap: onExploreCatalog,
                  child: Container(
                    height: 46.0,
                    padding: const EdgeInsets.symmetric(horizontal: 24.0),
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: AppColors.nbYellow,
                      border: Border.all(color: AppColors.nbBlack, width: 2.0),
                      boxShadow: const [
                        BoxShadow(
                          color: AppColors.nbBlack,
                          offset: Offset(3.0, 3.0),
                          blurRadius: 0.0,
                        ),
                      ],
                    ),
                    child: const Text(
                      'Jelajahi katalog',
                      style: TextStyle(
                        fontFamily: AppTheme.fontHeadline,
                        fontSize: 13.5,
                        fontWeight: FontWeight.w800,
                        color: AppColors.nbBlack,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
