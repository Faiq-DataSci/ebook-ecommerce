import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../domain/entities/cart_item.dart';

class CartStateViews {
  CartStateViews._();

  static Widget buildLoadingSkeleton() {
    return Container(
      key: const Key('cart_loading_state'),
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: AppTheme.brutalBox(
        color: AppColors.nbWhite,
        borderColor: AppColors.nbBlack,
        borderWidth: AppTheme.borderDefault,
        shadowOffset: 4,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: AppTheme.brutalBox(
              color: AppColors.nbYellow,
              borderColor: AppColors.nbBlack,
              borderWidth: AppTheme.borderDefault,
              shadowOffset: 2,
            ),
            child: Text(
              'MEMUAT KERANJANG BELANJA...',
              style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 11),
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Menyiapkan daftar e-book digital, kupon promo, dan kalkulasi transaksi Zona C.',
            style: AppTheme.bodySm(AppColors.nbTextMuted, fontSize: 13),
          ),
          const SizedBox(height: 14),
          for (int i = 0; i < 2; i++) ...<Widget>[
            if (i > 0) const SizedBox(height: 12),
            Container(
              height: 110,
              width: double.infinity,
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.nbMuted,
                border: Border.all(
                  color: AppColors.nbBlack,
                  width: AppTheme.borderDefault,
                ),
              ),
              child: Row(
                children: <Widget>[
                  Container(
                    width: 60,
                    height: 88,
                    decoration: BoxDecoration(
                      color: AppColors.nbPaper,
                      border: Border.all(color: AppColors.nbBlack),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        Container(
                          height: 14,
                          width: 140,
                          color: AppColors.nbPaper,
                        ),
                        const SizedBox(height: 8),
                        Container(
                          height: 12,
                          width: 100,
                          color: AppColors.nbPaper,
                        ),
                        const SizedBox(height: 12),
                        Container(
                          height: 16,
                          width: 85,
                          color: AppColors.nbPaper,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  static Widget buildErrorState({
    required String message,
    required VoidCallback onRetry,
  }) {
    return Container(
      key: const Key('cart_error_state'),
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: AppTheme.brutalBox(
        color: AppColors.nbWhite,
        borderColor: AppColors.nbBlack,
        borderWidth: AppTheme.borderDefault,
        shadowOffset: 4,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: AppTheme.brutalBox(
              color: AppColors.nbPink,
              borderColor: AppColors.nbBlack,
              borderWidth: AppTheme.borderDefault,
              shadowOffset: 2,
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                const Icon(
                  Icons.error_outline,
                  size: 14,
                  color: AppColors.nbBlack,
                ),
                const SizedBox(width: 4),
                Text(
                  'GAGAL MEMUAT KERANJANG',
                  style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 11),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),
          Text(
            message,
            style: AppTheme.bodySm(AppColors.nbBlack, fontSize: 13),
          ),
          const SizedBox(height: 14),
          Semantics(
            button: true,
            label: 'Coba Lagi Memuat Keranjang',
            child: InkWell(
              key: const Key('cart_error_retry_button'),
              onTap: onRetry,
              child: Container(
                height: 44,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                alignment: Alignment.center,
                decoration: AppTheme.brutalBox(
                  color: AppColors.nbYellow,
                  borderColor: AppColors.nbBlack,
                  borderWidth: AppTheme.borderDefault,
                  shadowOffset: 2,
                ),
                child: Text(
                  'COBA LAGI',
                  style: AppTheme.labelMd(AppColors.nbBlack),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  static Widget buildEmptyState({
    required List<CartItem> recommendedItems,
    required VoidCallback onExploreCatalogTap,
    required VoidCallback onViewSawRecommendationsTap,
    required ValueChanged<CartItem> onQuickAddRecommendation,
  }) {
    return Column(
      key: const Key('cart_empty_state'),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        // System Status Banner (Zone C Style)
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(8),
          decoration: AppTheme.brutalBox(
            color: AppColors.nbPaper,
            borderColor: AppColors.nbBlack,
            borderWidth: AppTheme.borderDefault,
            shadowOffset: 2,
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Expanded(
                child: Row(
                  children: <Widget>[
                    Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: AppColors.nbPink,
                        border: Border.all(color: AppColors.nbBlack),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        'STATUS: CART_EMPTY // SUBTOTAL: RP 0',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: AppTheme.dataMono(
                          AppColors.nbBlack,
                          fontSize: 11.5,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: AppColors.nbMuted,
                  border: Border.all(color: AppColors.nbBlack),
                ),
                child: Text(
                  '0 ITEM',
                  style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 10.5),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 14),

        // Main Empty State Hero Card
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: AppTheme.brutalBox(
            color: AppColors.nbWhite,
            borderColor: AppColors.nbBlack,
            borderWidth: AppTheme.borderMedium,
            shadowOffset: 5,
          ),
          child: Column(
            children: <Widget>[
              // Top Functional Badges
              Container(
                padding: const EdgeInsets.only(bottom: 10),
                decoration: const BoxDecoration(
                  border: Border(
                    bottom: BorderSide(
                      color: AppColors.nbBlack,
                      width: AppTheme.borderDefault,
                    ),
                  ),
                ),
                child: Wrap(
                  spacing: 8,
                  runSpacing: 6,
                  alignment: WrapAlignment.spaceBetween,
                  children: <Widget>[
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 3,
                      ),
                      decoration: AppTheme.brutalBox(
                        color: AppColors.nbYellow,
                        borderColor: AppColors.nbBlack,
                        borderWidth: AppTheme.borderDefault,
                        shadowOffset: 2,
                      ),
                      child: Text(
                        'STORAGE: 0/UNLIMITED E-BOOK',
                        style: AppTheme.dataMono(
                          AppColors.nbBlack,
                          fontSize: 10.5,
                        ),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 3,
                      ),
                      decoration: AppTheme.brutalBox(
                        color: AppColors.nbLavender,
                        borderColor: AppColors.nbBlack,
                        borderWidth: AppTheme.borderDefault,
                        shadowOffset: 2,
                      ),
                      child: Text(
                        'ZONE A \u00B7 SPK READY',
                        style: AppTheme.dataMono(
                          AppColors.nbBlack,
                          fontSize: 10.5,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),

              // Geometric Mechanical Cart Illustration
              Container(
                width: double.infinity,
                height: 148,
                decoration: BoxDecoration(
                  color: AppColors.nbPaper,
                  border: Border.all(
                    color: AppColors.nbBlack,
                    width: AppTheme.borderDefault,
                  ),
                ),
                child: CustomPaint(painter: _EmptyCartIllustrationPainter()),
              ),
              const SizedBox(height: 14),

              Text(
                'KERANJANG ANDA MASIH KOSONG',
                textAlign: TextAlign.center,
                style: AppTheme.headlineMdMobile(AppColors.nbBlack),
              ),
              const SizedBox(height: 8),
              Text(
                'Belum ada e-book yang ditambahkan. Temukan buku terbaik pilihanmu atau jelajahi hasil rekomendasi berbobot dari sistem SPK SAW.',
                textAlign: TextAlign.center,
                style: AppTheme.bodySm(AppColors.nbTextMuted, fontSize: 13),
              ),
              const SizedBox(height: 16),

              // Primary Action: Jelajahi Katalog E-Book
              Semantics(
                button: true,
                label: 'Jelajahi Katalog E-Book',
                child: InkWell(
                  key: const Key('cart_empty_explore_catalog_button'),
                  onTap: onExploreCatalogTap,
                  child: Container(
                    width: double.infinity,
                    height: 48,
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    alignment: Alignment.center,
                    decoration: AppTheme.brutalBox(
                      color: AppColors.nbYellow,
                      borderColor: AppColors.nbBlack,
                      borderWidth: AppTheme.borderMedium,
                      shadowOffset: 4,
                    ),
                    child: FittedBox(
                      fit: BoxFit.scaleDown,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          Text(
                            'JELAJAHI KATALOG E-BOOK',
                            style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                          ),
                          const SizedBox(width: 8),
                          const Icon(
                            Icons.arrow_forward,
                            size: 20,
                            color: AppColors.nbBlack,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 12),

              // Secondary Action: Lihat Top Rekomendasi SPK SAW
              Semantics(
                button: true,
                label: 'Lihat Top Rekomendasi SPK SAW',
                child: InkWell(
                  key: const Key('cart_empty_saw_recommendations_button'),
                  onTap: onViewSawRecommendationsTap,
                  child: Container(
                    width: double.infinity,
                    height: 48,
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    alignment: Alignment.center,
                    decoration: AppTheme.brutalBox(
                      color: AppColors.nbLavender,
                      borderColor: AppColors.nbBlack,
                      borderWidth: AppTheme.borderMedium,
                      shadowOffset: 4,
                    ),
                    child: FittedBox(
                      fit: BoxFit.scaleDown,
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          const Icon(
                            Icons.star,
                            size: 20,
                            color: AppColors.nbBlack,
                          ),
                          const SizedBox(width: 6),
                          Text(
                            'LIHAT TOP REKOMENDASI SPK SAW',
                            style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // Section: Rekomendasi Teratas SAW (Quick Add to Cart)
        if (recommendedItems.isNotEmpty) ...<Widget>[
          Container(
            padding: const EdgeInsets.only(bottom: 8),
            decoration: const BoxDecoration(
              border: Border(
                bottom: BorderSide(
                  color: AppColors.nbBlack,
                  width: AppTheme.borderMedium,
                ),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Expanded(
                  child: Row(
                    children: <Widget>[
                      const Icon(
                        Icons.verified_outlined,
                        size: 20,
                        color: AppColors.nbBlack,
                      ),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          'REKOMENDASI TERATAS SAW',
                          style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 3,
                  ),
                  decoration: AppTheme.brutalBox(
                    color: AppColors.nbLavender,
                    borderColor: AppColors.nbBlack,
                    borderWidth: AppTheme.borderDefault,
                    shadowOffset: 2,
                  ),
                  child: Text(
                    'RANK #1 & #2',
                    style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 11),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12),
          for (int i = 0; i < recommendedItems.length; i++) ...<Widget>[
            if (i > 0) const SizedBox(height: 12),
            _buildRecommendedBookCard(
              item: recommendedItems[i],
              rankNumber: i + 1,
              onQuickAdd: () => onQuickAddRecommendation(recommendedItems[i]),
            ),
          ],
          const SizedBox(height: 20),
        ],

        // Disabled Zero State Order Summary Footer (Zone C)
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(14),
          decoration: AppTheme.brutalBox(
            color: AppColors.nbWhite,
            borderColor: AppColors.nbBlack,
            borderWidth: AppTheme.borderMedium,
            shadowOffset: 5,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Container(
                padding: const EdgeInsets.only(bottom: 8),
                decoration: const BoxDecoration(
                  border: Border(
                    bottom: BorderSide(
                      color: AppColors.nbBlack,
                      width: AppTheme.borderDefault,
                    ),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    Expanded(
                      child: Text(
                        'RINGKASAN TRANSAKSI',
                        style: AppTheme.labelMd(AppColors.nbBlack),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.nbPaper,
                        border: Border.all(color: AppColors.nbBlack),
                      ),
                      child: Text(
                        'EMPTY_BUFFER',
                        style: AppTheme.dataMono(
                          AppColors.nbDisabledText,
                          fontSize: 10.5,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 10),
              _buildZeroSummaryRow('Subtotal Item (0 buku)', 'Rp 0'),
              const SizedBox(height: 6),
              _buildZeroSummaryRow('Potongan Promo Voucher', '- Rp 0'),
              const SizedBox(height: 6),
              _buildZeroSummaryRow('Biaya Layanan Cloud', 'Rp 0'),
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.only(top: 8),
                decoration: const BoxDecoration(
                  border: Border(
                    top: BorderSide(
                      color: AppColors.nbBlack,
                      width: AppTheme.borderDefault,
                    ),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    Expanded(
                      child: Text(
                        'TOTAL PEMBAYARAN',
                        style: AppTheme.labelMd(AppColors.nbBlack),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.nbPaper,
                        border: Border.all(color: AppColors.nbBlack),
                      ),
                      child: Text(
                        'Rp 0',
                        style: AppTheme.dataMono(
                          AppColors.nbBlack,
                          fontSize: 16,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              Container(
                width: double.infinity,
                height: 48,
                padding: const EdgeInsets.symmetric(horizontal: 10),
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: AppColors.nbMuted,
                  border: Border.all(
                    color: AppColors.nbDisabledText,
                    width: AppTheme.borderDefault,
                  ),
                ),
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: <Widget>[
                      const Icon(
                        Icons.lock_outline,
                        size: 18,
                        color: AppColors.nbDisabledText,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        'CHECKOUT (0 BUKU)',
                        style: AppTheme.headlineSmMobile(
                          AppColors.nbDisabledText,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'TAMBAHKAN MINIMAL 1 BUKU UNTUK MEMULAI PROSES CHECKOUT',
                textAlign: TextAlign.center,
                style: AppTheme.dataMono(
                  AppColors.nbDisabledText,
                  fontSize: 10,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  static Widget _buildZeroSummaryRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: <Widget>[
        Expanded(
          child: Text(
            label,
            style: AppTheme.dataMono(AppColors.nbTextMuted, fontSize: 12.5),
          ),
        ),
        const SizedBox(width: 8),
        Text(
          value,
          style: AppTheme.dataMono(AppColors.nbTextMuted, fontSize: 12.5),
        ),
      ],
    );
  }

  static Widget _buildRecommendedBookCard({
    required CartItem item,
    required int rankNumber,
    required VoidCallback onQuickAdd,
  }) {
    final coverBg = rankNumber == 1 ? AppColors.nbBlue : AppColors.nbOrange;

    return Container(
      key: Key('cart_recommended_card_${item.id}'),
      width: double.infinity,
      padding: const EdgeInsets.all(12),
      decoration: AppTheme.brutalBox(
        color: AppColors.nbWhite,
        borderColor: AppColors.nbBlack,
        borderWidth: AppTheme.borderMedium,
        shadowOffset: 5,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Container(
            width: 72,
            height: 104,
            padding: const EdgeInsets.all(6),
            decoration: AppTheme.brutalBox(
              color: coverBg,
              borderColor: AppColors.nbBlack,
              borderWidth: AppTheme.borderDefault,
              shadowOffset: 3,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                SizedBox(
                  width: double.infinity,
                  child: FittedBox(
                    fit: BoxFit.scaleDown,
                    alignment: Alignment.centerLeft,
                    child: Row(
                      children: <Widget>[
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 3,
                            vertical: 1,
                          ),
                          decoration: BoxDecoration(
                            color: AppColors.nbWhite,
                            border: Border.all(color: AppColors.nbBlack),
                          ),
                          child: Text(
                            item.category,
                            style: AppTheme.dataMono(
                              AppColors.nbBlack,
                              fontSize: 8.5,
                            ),
                          ),
                        ),
                        const SizedBox(width: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 3,
                            vertical: 1,
                          ),
                          decoration: BoxDecoration(
                            color: rankNumber == 1
                                ? AppColors.nbYellow
                                : AppColors.nbWhite,
                            border: Border.all(color: AppColors.nbBlack),
                          ),
                          child: Text(
                            '#$rankNumber',
                            style: AppTheme.dataMono(
                              AppColors.nbBlack,
                              fontSize: 8.5,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                Text(
                  item.title.toUpperCase(),
                  maxLines: 3,
                  overflow: TextOverflow.ellipsis,
                  style: AppTheme.labelSm(AppColors.nbBlack, fontSize: 10),
                ),
                Text(
                  item.formatLabel,
                  style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 8),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Wrap(
                  spacing: 6,
                  runSpacing: 4,
                  children: <Widget>[
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.nbGreen,
                        border: Border.all(color: AppColors.nbBlack),
                      ),
                      child: Text(
                        '\u2605 ${item.ratingAvg.toStringAsFixed(1)}',
                        style: AppTheme.dataMono(
                          AppColors.nbBlack,
                          fontSize: 11,
                        ),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.nbLavender,
                        border: Border.all(color: AppColors.nbBlack),
                      ),
                      child: Text(
                        item.sawRankLabel,
                        style: AppTheme.dataMono(
                          AppColors.nbBlack,
                          fontSize: 11,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  item.title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                ),
                Text(
                  item.author,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppTheme.bodySm(AppColors.nbTextMuted, fontSize: 13),
                ),
                const SizedBox(height: 10),
                Container(
                  padding: const EdgeInsets.only(top: 8),
                  decoration: const BoxDecoration(
                    border: Border(
                      top: BorderSide(
                        color: AppColors.nbBlack,
                        width: AppTheme.borderDefault,
                      ),
                    ),
                  ),
                  child: Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    alignment: WrapAlignment.spaceBetween,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: <Widget>[
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 3,
                        ),
                        decoration: AppTheme.brutalBox(
                          color: AppColors.nbYellow,
                          borderColor: AppColors.nbBlack,
                          borderWidth: AppTheme.borderDefault,
                          shadowOffset: 2,
                        ),
                        child: Text(
                          item.formattedPrice,
                          style: AppTheme.dataMono(
                            AppColors.nbBlack,
                            fontSize: 13,
                          ),
                        ),
                      ),
                      Semantics(
                        button: true,
                        label: 'Tambah ${item.title} ke keranjang',
                        child: InkWell(
                          key: Key('cart_quick_add_${item.id}'),
                          onTap: onQuickAdd,
                          child: Container(
                            constraints: const BoxConstraints(minHeight: 44),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 8,
                            ),
                            decoration: AppTheme.brutalBox(
                              color: rankNumber == 1
                                  ? AppColors.nbYellow
                                  : AppColors.nbWhite,
                              borderColor: AppColors.nbBlack,
                              borderWidth: AppTheme.borderDefault,
                              shadowOffset: 2,
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: <Widget>[
                                const Icon(
                                  Icons.add_shopping_cart,
                                  size: 16,
                                  color: AppColors.nbBlack,
                                ),
                                const SizedBox(width: 4),
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
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _EmptyCartIllustrationPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final cx = size.width / 2;
    final cy = size.height / 2;

    final borderPaint = Paint()
      ..color = AppColors.nbBlack
      ..strokeWidth = 2.5
      ..style = PaintingStyle.stroke;

    // Floating geometric accent blocks
    final yellowFill = Paint()..color = AppColors.nbYellow;
    final lavenderFill = Paint()..color = AppColors.nbLavender;
    final paperFill = Paint()..color = AppColors.nbPaper;
    final pinkFill = Paint()..color = AppColors.nbPink;
    final blackFill = Paint()..color = AppColors.nbBlack;
    final whiteFill = Paint()..color = AppColors.nbWhite;

    // Top-left stamp
    final topStamp = Rect.fromLTWH(16, 12, 14, 14);
    canvas.drawRect(topStamp, yellowFill);
    canvas.drawRect(topStamp, borderPaint);

    // Bottom-right stamp
    final bottomStamp = Rect.fromLTWH(
      size.width - 34,
      size.height - 28,
      18,
      18,
    );
    canvas.drawRect(bottomStamp, lavenderFill);
    canvas.drawRect(bottomStamp, borderPaint);

    // Floating Book 1 (Lavender)
    canvas.save();
    canvas.translate(cx - 24, cy - 46);
    canvas.rotate(-0.2);
    final book1 = const Rect.fromLTWH(0, 0, 28, 34);
    canvas.drawRect(book1, lavenderFill);
    canvas.drawRect(book1, borderPaint);
    canvas.restore();

    // Floating Book 2 (White)
    canvas.save();
    canvas.translate(cx + 8, cy - 48);
    canvas.rotate(0.22);
    final book2 = const Rect.fromLTWH(0, 0, 26, 32);
    canvas.drawRect(book2, whiteFill);
    canvas.drawRect(book2, borderPaint);
    canvas.restore();

    // Cart Basket Trapezoid
    final basketPath = Path()
      ..moveTo(cx - 48, cy - 16)
      ..lineTo(cx + 46, cy - 16)
      ..lineTo(cx + 34, cy + 24)
      ..lineTo(cx - 32, cy + 24)
      ..close();
    canvas.drawPath(basketPath, paperFill);
    canvas.drawPath(basketPath, borderPaint);

    // Basket Vertical ribs
    canvas.drawLine(
      Offset(cx - 22, cy - 16),
      Offset(cx - 12, cy + 24),
      borderPaint,
    );
    canvas.drawLine(
      Offset(cx + 2, cy - 16),
      Offset(cx + 4, cy + 24),
      borderPaint,
    );
    canvas.drawLine(
      Offset(cx + 24, cy - 16),
      Offset(cx + 18, cy + 24),
      borderPaint,
    );

    // Cart Handle
    final handlePath = Path()
      ..moveTo(cx - 62, cy - 28)
      ..lineTo(cx - 48, cy - 28)
      ..lineTo(cx - 48, cy - 16);
    canvas.drawPath(handlePath, borderPaint);
    final gripRect = Rect.fromLTWH(cx - 66, cy - 33, 14, 9);
    canvas.drawRect(gripRect, pinkFill);
    canvas.drawRect(gripRect, borderPaint);

    // Base rail
    canvas.drawLine(
      Offset(cx - 32, cy + 24),
      Offset(cx - 36, cy + 36),
      borderPaint,
    );
    canvas.drawLine(
      Offset(cx - 36, cy + 36),
      Offset(cx + 36, cy + 36),
      borderPaint,
    );

    // Left Circular Wheel
    canvas.drawCircle(Offset(cx - 24, cy + 44), 9, blackFill);
    canvas.drawCircle(Offset(cx - 24, cy + 44), 3, whiteFill);

    // Right Square Brutalist Wheel
    final rightWheel = Rect.fromLTWH(cx + 16, cy + 35, 18, 18);
    canvas.drawRect(rightWheel, yellowFill);
    canvas.drawRect(rightWheel, borderPaint);
    canvas.drawCircle(Offset(cx + 25, cy + 44), 3, blackFill);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
