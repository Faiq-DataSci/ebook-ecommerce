import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/constants/app_assets.dart';
import '../../../../core/utils/rupiah_formatter.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../../cart/presentation/providers/cart_provider.dart';
import '../../../home/presentation/providers/home_provider.dart';
import '../../../library/presentation/pages/library_screen.dart';
import '../../../library/presentation/providers/library_provider.dart';
import '../../domain/entities/catalog_ebook.dart';
import '../providers/catalog_provider.dart';

/// Halaman Detail E-Book (Google Stitch Zona B + design.md §8.5 & FR-C05).
/// Memuat data e-book secara aman berbasis ID dari repository/API,
/// serta menyediakan bottom action bar untuk memasukkan ke keranjang belanja.
class EbookDetailScreen extends ConsumerWidget {
  final String ebookId;

  const EbookDetailScreen({super.key, required this.ebookId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final detailAsync = ref.watch(ebookDetailProvider(ebookId));
    final ownershipAsync = ref.watch(userOwnershipProvider(ebookId));
    final isAlreadyOwned = ownershipAsync.value ?? false;

    return Scaffold(
      backgroundColor: AppColors.nbPaper,
      body: SafeArea(
        child: Column(
          children: <Widget>[
            // App Bar (design.md §5.5: tinggi 56, border bawah, tombol kembali)
            Container(
              height: 56,
              padding: const EdgeInsets.symmetric(
                horizontal: AppTheme.marginMobile,
              ),
              decoration: const BoxDecoration(
                color: AppColors.nbPaper,
                border: Border(
                  bottom: BorderSide(
                    color: AppColors.nbBlack,
                    width: AppTheme.borderDefault,
                  ),
                ),
              ),
              child: Row(
                children: <Widget>[
                  Semantics(
                    button: true,
                    label: 'Kembali',
                    child: InkWell(
                      key: const Key('detail_back_button'),
                      onTap: () => Navigator.of(context).maybePop(),
                      child: Container(
                        width: 38,
                        height: 38,
                        alignment: Alignment.center,
                        decoration: AppTheme.brutalBox(
                          color: AppColors.nbWhite,
                          borderColor: AppColors.nbBlack,
                          borderWidth: AppTheme.borderDefault,
                          shadowOffset: 2,
                        ),
                        child: const Icon(
                          Icons.arrow_back,
                          size: 20,
                          color: AppColors.nbBlack,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Text(
                    'Detail E-Book',
                    style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                  ),
                ],
              ),
            ),

            // Content Area
            Expanded(
              child: detailAsync.when(
                loading: () => const Center(
                  child: CircularProgressIndicator(
                    strokeWidth: 3,
                    color: AppColors.nbBlack,
                  ),
                ),
                error: (error, _) => Center(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: AppTheme.brutalBox(
                        color: AppColors.nbWhite,
                        borderColor: AppColors.nbBlack,
                        borderWidth: AppTheme.borderDefault,
                        shadowOffset: 4,
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: <Widget>[
                          const Icon(
                            Icons.error_outline,
                            size: 44,
                            color: AppColors.nbPink,
                          ),
                          const SizedBox(height: 12),
                          Text(
                            'Gagal Memuat Detail E-Book',
                            style: AppTheme.labelMd(AppColors.nbBlack),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            '$error',
                            textAlign: TextAlign.center,
                            style: AppTheme.bodySm(AppColors.nbTextMuted),
                          ),
                          const SizedBox(height: 14),
                          InkWell(
                            onTap: () =>
                                ref.refresh(ebookDetailProvider(ebookId)),
                            child: Container(
                              height: 40,
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16,
                              ),
                              alignment: Alignment.center,
                              decoration: AppTheme.brutalBox(
                                color: AppColors.nbYellow,
                                borderColor: AppColors.nbBlack,
                                borderWidth: AppTheme.borderDefault,
                                shadowOffset: 2,
                              ),
                              child: Text(
                                'COBA LAGI',
                                style: AppTheme.labelSm(AppColors.nbBlack),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                data: (book) => _buildDetailContent(context, book),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: detailAsync.valueOrNull != null
          ? _buildBottomActionBar(
              context,
              ref,
              detailAsync.valueOrNull!,
              isAlreadyOwned: isAlreadyOwned,
            )
          : null,
    );
  }

  Widget _buildBottomActionBar(
    BuildContext context,
    WidgetRef ref,
    CatalogEbook book, {
    bool isAlreadyOwned = false,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppTheme.marginMobile,
        vertical: 12,
      ),
      decoration: const BoxDecoration(
        color: AppColors.nbWhite,
        border: Border(
          top: BorderSide(
            color: AppColors.nbBlack,
            width: AppTheme.borderDefault,
          ),
        ),
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: <Widget>[
            // Price Tag
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                Text(
                  'HARGA TOTAL',
                  style: AppTheme.labelSm(AppColors.nbTextMuted, fontSize: 10),
                ),
                Text(
                  book.formattedPrice,
                  style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 15),
                ),
              ],
            ),
            const SizedBox(width: 16),
            // Tombol Aksi: DuplicateOwnershipGuard (design.md §5 & §8.5)
            Expanded(
              child: isAlreadyOwned
                  ? Semantics(
                      button: true,
                      label: 'Buka di perpustakaan',
                      child: InkWell(
                        key: const Key('detail_open_in_library_button'),
                        onTap: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (_) => const LibraryScreen(),
                            ),
                          );
                        },
                        child: Container(
                          height: 44,
                          alignment: Alignment.center,
                          decoration: AppTheme.brutalBox(
                            color: AppColors.nbGreen,
                            borderColor: AppColors.nbBlack,
                            borderWidth: AppTheme.borderDefault,
                            shadowOffset: 2,
                          ),
                          child: FittedBox(
                            fit: BoxFit.scaleDown,
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: <Widget>[
                                const Icon(
                                  Icons.local_library_outlined,
                                  size: 18,
                                  color: AppColors.nbBlack,
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  'BUKA DI PERPUSTAKAAN',
                                  style: AppTheme.labelSm(
                                    AppColors.nbBlack,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    )
                  : Semantics(
                      button: true,
                      label: 'Tambah ${book.title} ke keranjang belanja',
                      child: InkWell(
                        key: const Key('detail_add_to_cart_button'),
                        onTap: () {
                          ref.read(catalogProvider.notifier).addToCart(book);
                          ref.read(cartProvider.notifier).addCatalogEbook(book);
                          ref.read(homeProvider.notifier).addToCart();
                          final messenger = ScaffoldMessenger.maybeOf(context);
                          if (messenger != null) {
                            messenger.hideCurrentSnackBar();
                            messenger.showSnackBar(
                              SnackBar(
                                backgroundColor: Colors.transparent,
                                elevation: 0,
                                behavior: SnackBarBehavior.floating,
                                content: Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 12,
                                    vertical: 10,
                                  ),
                                  decoration: AppTheme.brutalBox(
                                    color: AppColors.nbGreen,
                                    borderColor: AppColors.nbBlack,
                                    borderWidth: AppTheme.borderDefault,
                                    shadowOffset: 3,
                                  ),
                                  child: Row(
                                    children: <Widget>[
                                      const Icon(
                                        Icons.check_circle,
                                        size: 18,
                                        color: AppColors.nbBlack,
                                      ),
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: Text(
                                          '"${book.title}" berhasil dimasukkan ke keranjang!',
                                          style: AppTheme.labelSm(
                                            AppColors.nbBlack,
                                            fontSize: 11,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            );
                          }
                        },
                        child: Container(
                          height: 44,
                          alignment: Alignment.center,
                          decoration: AppTheme.brutalBox(
                            color: AppColors.nbYellow,
                            borderColor: AppColors.nbBlack,
                            borderWidth: AppTheme.borderDefault,
                            shadowOffset: 2,
                          ),
                          child: FittedBox(
                            fit: BoxFit.scaleDown,
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: <Widget>[
                                const Icon(
                                  Icons.add_shopping_cart,
                                  size: 18,
                                  color: AppColors.nbBlack,
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  '+ KERANJANG',
                                  style: AppTheme.labelSm(
                                    AppColors.nbBlack,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailContent(BuildContext context, CatalogEbook book) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(AppTheme.marginMobile),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          // Cover besar berbingkai (2:3)
          Center(
            child: Container(
              width: 170,
              decoration: AppTheme.brutalBox(
                color: AppColors.nbMuted,
                borderColor: AppColors.nbBlack,
                borderWidth: AppTheme.borderDefault,
                shadowOffset: 4,
              ),
              child: AspectRatio(
                aspectRatio: 2 / 3,
                child: _buildCover(book.coverUrl, book.title),
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Kategori Chip
          if ((book.categoryName ?? '').isNotEmpty) ...<Widget>[
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: AppTheme.brutalBox(
                color: AppColors.nbLavender,
                borderColor: AppColors.nbBlack,
                borderWidth: AppTheme.borderThin,
                shadowOffset: 2,
              ),
              child: Text(
                book.categoryName!.toUpperCase(),
                style: AppTheme.labelSm(AppColors.nbBlack, fontSize: 10),
              ),
            ),
            const SizedBox(height: 8),
          ],

          // Judul E-Book
          Text(book.title, style: AppTheme.headlineLgMobile(AppColors.nbBlack)),
          const SizedBox(height: 6),

          // Penulis
          Text(
            'Penulis: ${book.author}',
            style: AppTheme.bodyMd(AppColors.nbTextMuted),
          ),
          const SizedBox(height: 12),

          // Rating & Harga Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              // Price Tag (Space Mono)
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 5,
                ),
                decoration: AppTheme.brutalBox(
                  color: AppColors.nbYellow,
                  borderColor: AppColors.nbBlack,
                  borderWidth: AppTheme.borderDefault,
                  shadowOffset: 2,
                ),
                child: Text(
                  book.formattedPrice,
                  style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 16),
                ),
              ),
              // Rating box
              if (book.hasRating)
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: AppTheme.brutalBox(
                    color: AppColors.nbWhite,
                    borderColor: AppColors.nbBlack,
                    borderWidth: AppTheme.borderDefault,
                    shadowOffset: 2,
                  ),
                  child: Row(
                    children: <Widget>[
                      const Text(
                        '★',
                        style: TextStyle(
                          color: AppColors.nbYellow,
                          fontSize: 16,
                          height: 1,
                        ),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        formatRating(book.ratingAvg),
                        style: AppTheme.dataMono(
                          AppColors.nbBlack,
                          fontSize: 13,
                        ),
                      ),
                      if (book.salesCount > 0) ...<Widget>[
                        const SizedBox(width: 4),
                        Text(
                          '(${book.salesCount})',
                          style: AppTheme.dataMono(
                            AppColors.nbTextMuted,
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ],
                  ),
                )
              else
                Text(
                  'Belum ada rating',
                  style: AppTheme.bodySm(
                    AppColors.nbDisabledText,
                    fontSize: 12,
                  ),
                ),
            ],
          ),
          const SizedBox(height: 20),

          // Metadata Grid (halaman, tahun terbit, penjualan - jika ada data)
          _buildMetadataRow(book),
          const SizedBox(height: 20),

          // Deskripsi / Sinopsis
          Text(
            'Sinopsis E-Book',
            style: AppTheme.headlineSmMobile(AppColors.nbBlack),
          ),
          const SizedBox(height: 8),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(14),
            decoration: AppTheme.brutalBox(
              color: AppColors.nbWhite,
              borderColor: AppColors.nbBlack,
              borderWidth: AppTheme.borderDefault,
              shadowOffset: 2,
            ),
            child: Text(
              (book.description ?? '').trim().isNotEmpty
                  ? book.description!
                  : 'Belum ada deskripsi yang ditambahkan untuk e-book ini.',
              style: AppTheme.bodySm(AppColors.nbBlack, fontSize: 14),
            ),
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  Widget _buildMetadataRow(CatalogEbook book) {
    final items = <Widget>[];

    if (book.pageCount != null && book.pageCount! > 0) {
      items.add(
        _buildMetaItem(label: 'Halaman', value: '${book.pageCount} Hal'),
      );
    }

    if (book.publishedYear != null && book.publishedYear! > 0) {
      items.add(
        _buildMetaItem(label: 'Tahun Terbit', value: '${book.publishedYear}'),
      );
    }

    if (book.salesCount > 0) {
      items.add(_buildMetaItem(label: 'Terjual', value: '${book.salesCount}x'));
    }

    if (items.isEmpty) {
      return const SizedBox.shrink();
    }

    return Row(
      children: [
        for (int i = 0; i < items.length; i++) ...[
          if (i > 0) const SizedBox(width: 8),
          Expanded(child: items[i]),
        ],
      ],
    );
  }

  Widget _buildMetaItem({required String label, required String value}) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: AppTheme.brutalBox(
        color: AppColors.surfaceContainer,
        borderColor: AppColors.nbBlack,
        borderWidth: AppTheme.borderThin,
        shadowOffset: 1,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Text(
            label,
            style: AppTheme.labelSm(AppColors.nbTextMuted, fontSize: 10),
          ),
          const SizedBox(height: 2),
          Text(
            value,
            style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 12),
          ),
        ],
      ),
    );
  }

  Widget _buildCover(String? coverUrl, String title) {
    if (coverUrl != null && coverUrl.isNotEmpty) {
      if (AppAssets.getEmbeddedBytes(coverUrl) != null) {
        return StitchBookCover(
          assetPath: coverUrl,
          semanticLabel: 'Sampul $title',
        );
      }
      if (coverUrl.startsWith('http://') || coverUrl.startsWith('https://')) {
        return Image.network(
          coverUrl,
          fit: BoxFit.cover,
          errorBuilder: (context, error, stackTrace) => _buildFallback(title),
        );
      }
    }
    return _buildFallback(title);
  }

  Widget _buildFallback(String title) {
    final initial = title.trim().isNotEmpty
        ? title.trim()[0].toUpperCase()
        : 'B';
    return Container(
      color: AppColors.nbMuted,
      alignment: Alignment.center,
      child: Text(initial, style: AppTheme.headlineLgMobile(AppColors.nbBlack)),
    );
  }
}
