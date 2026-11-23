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
          padding: const EdgeInsets.all(24.0),
          decoration: BoxDecoration(
            color: AppColors.nbWhite,
            border: Border.all(color: AppColors.nbBlack, width: 3.0),
            boxShadow: const [
              BoxShadow(
                color: AppColors.nbBlack,
                offset: Offset(5.0, 5.0),
                blurRadius: 0.0,
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 56.0,
                height: 56.0,
                decoration: BoxDecoration(
                  color: AppColors.nbYellow,
                  border: Border.all(color: AppColors.nbBlack, width: 2.5),
                  boxShadow: const [
                    BoxShadow(
                      color: AppColors.nbBlack,
                      offset: Offset(3.0, 3.0),
                      blurRadius: 0.0,
                    ),
                  ],
                ),
                child: const Center(
                  child: Icon(
                    Icons.local_library_outlined,
                    size: 32.0,
                    color: AppColors.nbBlack,
                  ),
                ),
              ),
              const SizedBox(height: 16.0),
              const Text(
                'Perpustakaanmu masih kosong. Jelajahi katalog untuk menemukan buku pertamamu.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontFamily: AppTheme.fontHeadline,
                  fontSize: 15.0,
                  fontWeight: FontWeight.w800,
                  color: AppColors.nbBlack,
                  height: 1.35,
                ),
              ),
              const SizedBox(height: 20.0),
              Semantics(
                button: true,
                label: 'Jelajahi katalog',
                child: InkWell(
                  key: const Key('library_explore_catalog_button'),
                  onTap: onExploreCatalog,
                  child: Container(
                    height: 44.0,
                    padding: const EdgeInsets.symmetric(horizontal: 20.0),
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: AppColors.nbYellow,
                      border: Border.all(color: AppColors.nbBlack, width: 2.5),
                      boxShadow: const [
                        BoxShadow(
                          color: AppColors.nbBlack,
                          offset: Offset(3.0, 3.0),
                          blurRadius: 0.0,
                        ),
                      ],
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          Icons.search,
                          size: 18.0,
                          color: AppColors.nbBlack,
                        ),
                        SizedBox(width: 8.0),
                        Text(
                          'Jelajahi katalog',
                          style: TextStyle(
                            fontFamily: AppTheme.fontHeadline,
                            fontSize: 13.0,
                            fontWeight: FontWeight.w800,
                            color: AppColors.nbBlack,
                            letterSpacing: 0.3,
                          ),
                        ),
                      ],
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
