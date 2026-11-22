import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// Komponen representasi status data asinkron (design.md §5.8 & Prompt §10):
/// - Loading skeleton
/// - Empty state
/// - No Result (Filter/Pencarian Kosong)
/// - Error state + Coba lagi
/// - Infinite scroll footer
class CatalogStateViews {
  CatalogStateViews._();

  /// Loading Skeleton (blok nb-muted berborder 2px, tanpa shimmer lembut per design.md §5.8)
  static Widget buildLoadingSkeleton() {
    return Column(
      key: const Key('catalog_loading_skeleton'),
      children: <Widget>[
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Expanded(child: _buildSkeletonCard()),
            const SizedBox(width: 12),
            Expanded(child: _buildSkeletonCard()),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Expanded(child: _buildSkeletonCard()),
            const SizedBox(width: 12),
            Expanded(child: _buildSkeletonCard()),
          ],
        ),
      ],
    );
  }

  static Widget _buildSkeletonCard() {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: AppTheme.brutalBox(
        color: AppColors.nbWhite,
        borderColor: AppColors.nbBlack,
        borderWidth: AppTheme.borderDefault,
        shadowOffset: 4,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          AspectRatio(
            aspectRatio: 2 / 3,
            child: Container(color: AppColors.nbMuted),
          ),
          const SizedBox(height: 10),
          Container(
            height: 16,
            width: double.infinity,
            color: AppColors.nbMuted,
          ),
          const SizedBox(height: 6),
          Container(height: 14, width: 90, color: AppColors.nbMuted),
          const SizedBox(height: 12),
          Container(height: 24, width: 80, color: AppColors.nbMuted),
        ],
      ),
    );
  }

  /// Empty State saat katalog di server belum memiliki data sama sekali (design.md §5.8)
  static Widget buildEmptyCatalog() {
    return Container(
      key: const Key('catalog_empty_state'),
      width: double.infinity,
      padding: const EdgeInsets.all(20),
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
              color: AppColors.nbLavender,
              borderColor: AppColors.nbBlack,
              borderWidth: AppTheme.borderThin,
              shadowOffset: 1,
            ),
            child: Text(
              'KATALOG KOSONG',
              style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 11),
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Belum Ada E-Book',
            style: AppTheme.headlineSmMobile(AppColors.nbBlack),
          ),
          const SizedBox(height: 4),
          Text(
            'Katalog e-book saat ini masih dalam proses penambahan oleh pengelola sistem.',
            style: AppTheme.bodySm(AppColors.nbTextMuted, fontSize: 13),
          ),
        ],
      ),
    );
  }

  /// State saat pencarian atau filter tidak menghasilkan e-book yang cocok (design.md §8.4)
  static Widget buildNoResult({required VoidCallback onResetFilter}) {
    return Container(
      key: const Key('catalog_no_result_state'),
      width: double.infinity,
      padding: const EdgeInsets.all(18),
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
              borderWidth: AppTheme.borderThin,
              shadowOffset: 1,
            ),
            child: Text(
              'TIDAK DITEMUKAN',
              style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 11),
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Tidak ada e-book yang cocok.',
            style: AppTheme.headlineSmMobile(AppColors.nbBlack),
          ),
          const SizedBox(height: 6),
          Text(
            'Ubah kata kunci pencarian atau bersihkan filter kriteria yang sedang aktif.',
            style: AppTheme.bodySm(AppColors.nbTextMuted, fontSize: 13),
          ),
          const SizedBox(height: 16),
          InkWell(
            key: const Key('no_result_reset_button'),
            onTap: onResetFilter,
            child: Container(
              height: 42,
              padding: const EdgeInsets.symmetric(horizontal: 14),
              alignment: Alignment.center,
              decoration: AppTheme.brutalBox(
                color: AppColors.nbYellow,
                borderColor: AppColors.nbBlack,
                borderWidth: AppTheme.borderDefault,
                shadowOffset: 2,
              ),
              child: Text(
                'HAPUS FILTER & PENCARIAN',
                style: AppTheme.labelSm(AppColors.nbBlack, fontSize: 12),
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// Error state yang jelas: apa yang salah + cara memperbaiki + tombol Coba Lagi
  /// (design.md §5.8)
  static Widget buildError({
    required String message,
    required VoidCallback onRetry,
  }) {
    return Container(
      key: const Key('catalog_error_state'),
      width: double.infinity,
      padding: const EdgeInsets.all(18),
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
              borderWidth: AppTheme.borderThin,
              shadowOffset: 1,
            ),
            child: Text(
              'GANGGUAN KONEKSI',
              style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 11),
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Gagal Memuat Katalog',
            style: AppTheme.headlineSmMobile(AppColors.nbBlack),
          ),
          const SizedBox(height: 6),
          Text(
            message,
            style: AppTheme.bodySm(AppColors.nbTextMuted, fontSize: 13),
          ),
          const SizedBox(height: 16),
          InkWell(
            key: const Key('catalog_error_retry_button'),
            onTap: onRetry,
            child: Container(
              height: 42,
              padding: const EdgeInsets.symmetric(horizontal: 14),
              alignment: Alignment.center,
              decoration: AppTheme.brutalBox(
                color: AppColors.nbYellow,
                borderColor: AppColors.nbBlack,
                borderWidth: AppTheme.borderDefault,
                shadowOffset: 2,
              ),
              child: Text(
                'COBA LAGI',
                style: AppTheme.labelSm(AppColors.nbBlack, fontSize: 12),
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// Footer untuk infinite scroll pagination (design.md §8.4)
  static Widget buildInfiniteScrollFooter({
    required bool isLoadingMore,
    required bool hasMore,
    required String? loadMoreError,
    required VoidCallback onRetryLoadMore,
  }) {
    if (isLoadingMore) {
      return Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        alignment: Alignment.center,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          decoration: AppTheme.brutalBox(
            color: AppColors.nbWhite,
            borderColor: AppColors.nbBlack,
            borderWidth: AppTheme.borderDefault,
            shadowOffset: 2,
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              const SizedBox(
                width: 14,
                height: 14,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: AppColors.nbBlack,
                ),
              ),
              const SizedBox(width: 8),
              Text(
                'Memuat e-book berikutnya...',
                style: AppTheme.labelSm(AppColors.nbBlack, fontSize: 11),
              ),
            ],
          ),
        ),
      );
    }

    if (loadMoreError != null) {
      return Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        alignment: Alignment.center,
        child: InkWell(
          onTap: onRetryLoadMore,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: AppTheme.brutalBox(
              color: AppColors.nbPink,
              borderColor: AppColors.nbBlack,
              borderWidth: AppTheme.borderDefault,
              shadowOffset: 2,
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                const Icon(Icons.refresh, size: 16, color: AppColors.nbBlack),
                const SizedBox(width: 6),
                Text(
                  'Muat ulang halaman berikutnya',
                  style: AppTheme.labelSm(AppColors.nbBlack, fontSize: 11),
                ),
              ],
            ),
          ),
        ),
      );
    }

    if (!hasMore) {
      return Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        alignment: Alignment.center,
        child: Text(
          'Semua e-book sudah tampil.',
          style: AppTheme.bodySm(AppColors.nbDisabledText, fontSize: 12),
        ),
      );
    }

    return const SizedBox.shrink();
  }
}
