import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../providers/reader_provider.dart';
import '../widgets/access_denied_card.dart';
import '../widgets/in_app_pdf_reader_toolbar.dart';
import '../widgets/reader_page_view.dart';
import '../widgets/signed_url_recovery_banner.dart';

/// Halaman Pembaca PDF In-App Resmi (Zona C — design.md §8.9).
/// Proteksi Akses & Alur Kedaluwarsa:
/// 1. Tautan akses PDF diminta dari backend via signed URL berumur pendek (300 detik).
/// 2. Jika signed URL kedaluwarsa, menampilkan `SignedUrlRecoveryBanner` dengan tombol "Muat ulang tautan baca".
/// 3. Jika hak akses dicabut (`isRevoked = true`), menampilkan `AccessDeniedCard` tanpa membuka file.
/// 4. DILARANG ada opsi unduh atau ekspor file bebas ke penyimpanan lokal perangkat (ADR-0006).
class InAppPdfReaderScreen extends ConsumerWidget {
  final String ebookId;
  final String title;
  final int totalPages;

  const InAppPdfReaderScreen({
    super.key,
    required this.ebookId,
    this.title = 'E-Book Digital',
    this.totalPages = 48,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final params = ReaderParams(
      ebookId: ebookId,
      title: title,
      totalPages: totalPages,
    );
    final readerState = ref.watch(readerNotifierProvider(params));
    final readerNotifier = ref.read(readerNotifierProvider(params).notifier);

    return Scaffold(
      backgroundColor: AppColors.nbPaper,
      body: SafeArea(
        child: Column(
          children: [
            // Bilah Kontrol Reader (InAppPdfReaderToolbar)
            InAppPdfReaderToolbar(
              title: readerState.title,
              currentPage: readerState.currentPage,
              totalPages: readerState.totalPages,
              zoomLevel: readerState.zoomLevel,
              onPreviousPage: readerNotifier.previousPage,
              onNextPage: readerNotifier.nextPage,
              onZoomIn: readerNotifier.zoomIn,
              onZoomOut: readerNotifier.zoomOut,
              onClose: () => Navigator.of(context).maybePop(),
            ),

            // Banner Pemulihan Signed URL Kedaluwarsa (design.md §5 & §8.9)
            if (readerState.isExpired)
              SignedUrlRecoveryBanner(
                isRefreshing: readerState.isRefreshing,
                onRefresh: readerNotifier.refreshSignedUrl,
              ),

            // Area Konten Pembaca
            Expanded(
              child: _buildReaderBody(
                context: context,
                state: readerState,
                notifier: readerNotifier,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildReaderBody({
    required BuildContext context,
    required ReaderState state,
    required ReaderNotifier notifier,
  }) {
    // 1. Loading State
    if (state.isLoading) {
      return const Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CircularProgressIndicator(
              strokeWidth: 3.0,
              color: AppColors.nbBlack,
            ),
            SizedBox(height: 14.0),
            Text(
              'MEMVALIDASI LISENSI E-BOOK...',
              style: TextStyle(
                fontFamily: AppTheme.fontHeadline,
                fontSize: 12.0,
                fontWeight: FontWeight.w700,
                color: AppColors.nbBlack,
                letterSpacing: 0.5,
              ),
            ),
          ],
        ),
      );
    }

    // 2. Akses Dicabut (isRevoked = true atau 403 EBOOK_ACCESS_DENIED)
    if (state.isRevoked) {
      return AccessDeniedCard(
        title: state.title,
        message:
            state.errorMessage ??
            'Hak akses e-book Anda telah dicabut oleh Administrator sistem.',
        onBack: () => Navigator.of(context).maybePop(),
      );
    }

    // 3. Error Koneksi / Gagal Memuat
    if (state.errorMessage != null && !state.isExpired) {
      return Center(
        child: Container(
          margin: const EdgeInsets.all(24.0),
          padding: const EdgeInsets.all(16.0),
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
              const Icon(
                Icons.error_outline,
                size: 36.0,
                color: AppColors.nbPink,
              ),
              const SizedBox(height: 10.0),
              Text(
                'Gagal Menyiapkan Akses Baca',
                style: const TextStyle(
                  fontFamily: AppTheme.fontHeadline,
                  fontSize: 14.0,
                  fontWeight: FontWeight.w800,
                  color: AppColors.nbBlack,
                ),
              ),
              const SizedBox(height: 6.0),
              Text(
                state.errorMessage!,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontFamily: AppTheme.fontBody,
                  fontSize: 12.0,
                  color: AppColors.nbTextMuted,
                ),
              ),
              const SizedBox(height: 16.0),
              InkWell(
                onTap: notifier.loadAccessUrl,
                child: Container(
                  height: 40.0,
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: AppColors.nbYellow,
                    border: Border.all(color: AppColors.nbBlack, width: 2.0),
                  ),
                  child: const Text(
                    'COBA LAGI',
                    style: TextStyle(
                      fontFamily: AppTheme.fontHeadline,
                      fontSize: 12.0,
                      fontWeight: FontWeight.w800,
                      color: AppColors.nbBlack,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      );
    }

    // 4. Normal Page Reading View
    return SingleChildScrollView(
      physics: const ClampingScrollPhysics(),
      child: ReaderPageView(
        title: state.title,
        currentPage: state.currentPage,
        totalPages: state.totalPages,
        zoomLevel: state.zoomLevel,
        watermarkText: 'HAK AKSES RESMI // BUCKET PRIVAT SUPABASE',
      ),
    );
  }
}
