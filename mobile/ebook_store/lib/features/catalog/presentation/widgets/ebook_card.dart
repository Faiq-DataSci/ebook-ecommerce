import 'package:flutter/material.dart';
import '../../../../core/constants/app_assets.dart';
import '../../../../core/utils/rupiah_formatter.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../domain/entities/catalog_ebook.dart';
import '../providers/catalog_provider.dart';

/// Kartu E-Book Neubrutalism (Google Stitch + design.md §5.9 & Prompt §8).
/// Mendukung mode tampilan Grid (2 kolom) dan List (1 kolom/baris).
/// Seluruh kartu dapat diklik untuk navigasi menuju detail e-book.
class EbookCard extends StatelessWidget {
  final CatalogEbook book;
  final CatalogViewMode mode;
  final VoidCallback onTap;
  final VoidCallback? onAddToCartTap;

  const EbookCard({
    super.key,
    required this.book,
    this.mode = CatalogViewMode.grid,
    required this.onTap,
    this.onAddToCartTap,
  });

  Color _resolveBadgeColor(String? categoryName) {
    final cat = (categoryName ?? '').toUpperCase();
    if (cat.contains('TEKNO') || cat.contains('AI')) {
      return AppColors.nbYellow;
    } else if (cat.contains('SAINS') || cat.contains('DATA')) {
      return AppColors.nbBlue;
    } else if (cat.contains('DESAIN') || cat.contains('UI')) {
      return AppColors.nbPink;
    } else if (cat.contains('BISNIS') || cat.contains('FINAN')) {
      return AppColors.nbGreen;
    } else if (cat.contains('PENDIDIKAN')) {
      return AppColors.nbLavender;
    }
    return AppColors.nbOrange;
  }

  @override
  Widget build(BuildContext context) {
    if (mode == CatalogViewMode.list) {
      return _buildListCard();
    }
    return _buildGridCard();
  }

  Widget _buildGridCard() {
    final badgeColor = _resolveBadgeColor(book.categoryName);

    return Semantics(
      button: true,
      label:
          'E-book: ${book.title}, penulis ${book.author}, harga ${book.formattedPrice}',
      child: InkWell(
        key: Key('ebook_card_${book.id}'),
        onTap: onTap,
        child: Container(
          decoration: AppTheme.brutalBox(
            color: AppColors.nbWhite,
            borderColor: AppColors.nbBlack,
            borderWidth: AppTheme.borderDefault,
            shadowOffset: 4,
          ),
          padding: const EdgeInsets.all(10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  // 1. Cover 2:3 dengan Badge Kategori
                  AspectRatio(
                    aspectRatio: 2 / 3,
                    child: Container(
                      decoration: AppTheme.brutalBox(
                        color: AppColors.nbMuted,
                        borderColor: AppColors.nbBlack,
                        borderWidth: AppTheme.borderDefault,
                        shadowOffset: 2,
                      ),
                      child: Stack(
                        fit: StackFit.expand,
                        children: <Widget>[
                          _buildCoverImage(book.coverUrl, book.title),
                          if ((book.categoryName ?? '').isNotEmpty)
                            Positioned(
                              top: 6,
                              left: 6,
                              child: Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 6,
                                  vertical: 2,
                                ),
                                decoration: BoxDecoration(
                                  color: badgeColor,
                                  border: Border.all(
                                    color: AppColors.nbBlack,
                                    width: AppTheme.borderThin,
                                  ),
                                  boxShadow: const <BoxShadow>[
                                    BoxShadow(
                                      color: AppColors.nbBlack,
                                      offset: Offset(1, 1),
                                      blurRadius: 0,
                                    ),
                                  ],
                                ),
                                child: Text(
                                  book.categoryName!.toUpperCase(),
                                  style: AppTheme.labelSm(
                                    AppColors.nbBlack,
                                    fontSize: 9,
                                  ),
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),

                  // 2. Judul E-Book (maksimal 2 baris)
                  SizedBox(
                    height: 38,
                    child: Text(
                      book.title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: AppTheme.labelMd(
                        AppColors.nbBlack,
                      ).copyWith(height: 1.25),
                    ),
                  ),
                  const SizedBox(height: 2),

                  // 3. Nama Penulis (truncate 1 baris)
                  Text(
                    book.author,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: AppTheme.bodySm(AppColors.nbTextMuted, fontSize: 11),
                  ),
                  const SizedBox(height: 6),

                  // 4. Rating (atau "Belum ada rating" per design.md §5.9)
                  if (book.hasRating)
                    Row(
                      children: <Widget>[
                        const Text(
                          '★',
                          style: TextStyle(
                            color: AppColors.nbYellow,
                            fontSize: 14,
                            height: 1,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          formatRating(book.ratingAvg),
                          style: AppTheme.dataMono(
                            AppColors.nbBlack,
                            fontSize: 11,
                          ),
                        ),
                        if (book.salesCount > 0) ...<Widget>[
                          const SizedBox(width: 4),
                          Text(
                            '(${book.salesCount})',
                            style: AppTheme.dataMono(
                              AppColors.nbTextMuted,
                              fontSize: 10,
                            ),
                          ),
                        ],
                      ],
                    )
                  else
                    Text(
                      'Belum ada rating',
                      style: AppTheme.bodySm(
                        AppColors.nbDisabledText,
                        fontSize: 10,
                      ),
                    ),
                ],
              ),

              // 5. Price Tag & Tombol + Keranjang
              Container(
                margin: const EdgeInsets.only(top: 8),
                padding: const EdgeInsets.only(top: 8),
                decoration: const BoxDecoration(
                  border: Border(
                    top: BorderSide(
                      color: AppColors.nbBlack,
                      width: AppTheme.borderDefault,
                    ),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: <Widget>[
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: AppTheme.brutalBox(
                        color: AppColors.nbYellow,
                        borderColor: AppColors.nbBlack,
                        borderWidth: AppTheme.borderThin,
                        shadowOffset: 1,
                      ),
                      child: Text(
                        book.formattedPrice,
                        style: AppTheme.dataMono(
                          AppColors.nbBlack,
                          fontSize: 12,
                        ),
                      ),
                    ),
                    if (onAddToCartTap != null) ...<Widget>[
                      const SizedBox(height: 8),
                      Semantics(
                        button: true,
                        label: 'Tambah ${book.title} ke keranjang',
                        child: InkWell(
                          key: Key('ebook_card_add_${book.id}'),
                          onTap: onAddToCartTap,
                          child: Container(
                            width: double.infinity,
                            constraints: const BoxConstraints(minHeight: 34),
                            alignment: Alignment.center,
                            padding: const EdgeInsets.symmetric(
                              vertical: 6,
                              horizontal: 6,
                            ),
                            decoration: AppTheme.brutalBox(
                              color: AppColors.nbWhite,
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
                                    size: 14,
                                    color: AppColors.nbBlack,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    '+ Keranjang',
                                    style: AppTheme.labelSm(
                                      AppColors.nbBlack,
                                      fontSize: 11,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildListCard() {
    final badgeColor = _resolveBadgeColor(book.categoryName);

    return Semantics(
      button: true,
      label:
          'E-book: ${book.title}, penulis ${book.author}, harga ${book.formattedPrice}',
      child: InkWell(
        key: Key('ebook_card_list_${book.id}'),
        onTap: onTap,
        child: Container(
          decoration: AppTheme.brutalBox(
            color: AppColors.nbWhite,
            borderColor: AppColors.nbBlack,
            borderWidth: AppTheme.borderDefault,
            shadowOffset: 3,
          ),
          padding: const EdgeInsets.all(10),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              // Cover
              SizedBox(
                width: 80,
                child: AspectRatio(
                  aspectRatio: 2 / 3,
                  child: Container(
                    decoration: AppTheme.brutalBox(
                      color: AppColors.nbMuted,
                      borderColor: AppColors.nbBlack,
                      borderWidth: AppTheme.borderDefault,
                      shadowOffset: 2,
                    ),
                    child: _buildCoverImage(book.coverUrl, book.title),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              // Metadata
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    if ((book.categoryName ?? '').isNotEmpty)
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 6,
                          vertical: 2,
                        ),
                        margin: const EdgeInsets.only(bottom: 4),
                        decoration: BoxDecoration(
                          color: badgeColor,
                          border: Border.all(
                            color: AppColors.nbBlack,
                            width: AppTheme.borderThin,
                          ),
                        ),
                        child: Text(
                          book.categoryName!.toUpperCase(),
                          style: AppTheme.labelSm(
                            AppColors.nbBlack,
                            fontSize: 9,
                          ),
                        ),
                      ),
                    Text(
                      book.title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: AppTheme.labelMd(AppColors.nbBlack),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      book.author,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: AppTheme.bodySm(
                        AppColors.nbTextMuted,
                        fontSize: 12,
                      ),
                    ),
                    const SizedBox(height: 6),
                    if (book.hasRating)
                      Row(
                        children: <Widget>[
                          const Text(
                            '★',
                            style: TextStyle(
                              color: AppColors.nbYellow,
                              fontSize: 14,
                              height: 1,
                            ),
                          ),
                          const SizedBox(width: 4),
                          Text(
                            formatRating(book.ratingAvg),
                            style: AppTheme.dataMono(
                              AppColors.nbBlack,
                              fontSize: 11,
                            ),
                          ),
                          if (book.salesCount > 0) ...<Widget>[
                            const SizedBox(width: 4),
                            Text(
                              '(${book.salesCount} terjual)',
                              style: AppTheme.dataMono(
                                AppColors.nbTextMuted,
                                fontSize: 10,
                              ),
                            ),
                          ],
                        ],
                      )
                    else
                      Text(
                        'Belum ada rating',
                        style: AppTheme.bodySm(
                          AppColors.nbDisabledText,
                          fontSize: 11,
                        ),
                      ),
                    const SizedBox(height: 8),
                    Wrap(
                      alignment: WrapAlignment.spaceBetween,
                      crossAxisAlignment: WrapCrossAlignment.center,
                      spacing: 8,
                      runSpacing: 8,
                      children: <Widget>[
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 3,
                          ),
                          decoration: AppTheme.brutalBox(
                            color: AppColors.nbYellow,
                            borderColor: AppColors.nbBlack,
                            borderWidth: AppTheme.borderThin,
                            shadowOffset: 1,
                          ),
                          child: Text(
                            book.formattedPrice,
                            style: AppTheme.dataMono(
                              AppColors.nbBlack,
                              fontSize: 13,
                            ),
                          ),
                        ),
                        if (onAddToCartTap != null)
                          Semantics(
                            button: true,
                            label: 'Tambah ${book.title} ke keranjang',
                            child: InkWell(
                              key: Key('ebook_card_list_add_${book.id}'),
                              onTap: onAddToCartTap,
                              child: Container(
                                constraints: const BoxConstraints(
                                  minHeight: 34,
                                ),
                                alignment: Alignment.center,
                                padding: const EdgeInsets.symmetric(
                                  vertical: 6,
                                  horizontal: 10,
                                ),
                                decoration: AppTheme.brutalBox(
                                  color: AppColors.nbWhite,
                                  borderColor: AppColors.nbBlack,
                                  borderWidth: AppTheme.borderDefault,
                                  shadowOffset: 2,
                                ),
                                child: FittedBox(
                                  fit: BoxFit.scaleDown,
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: <Widget>[
                                      const Icon(
                                        Icons.add_shopping_cart,
                                        size: 14,
                                        color: AppColors.nbBlack,
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        '+ Keranjang',
                                        style: AppTheme.labelSm(
                                          AppColors.nbBlack,
                                          fontSize: 11,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCoverImage(String? coverUrl, String title) {
    if (coverUrl != null && coverUrl.isNotEmpty) {
      // Periksa apakah berupa asset internal
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
      padding: const EdgeInsets.all(6),
      alignment: Alignment.center,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Text(initial, style: AppTheme.headlineMdMobile(AppColors.nbBlack)),
          const SizedBox(height: 2),
          Text(
            'Cover belum diunggah',
            textAlign: TextAlign.center,
            style: AppTheme.labelSm(AppColors.nbDisabledText, fontSize: 8),
          ),
        ],
      ),
    );
  }
}
