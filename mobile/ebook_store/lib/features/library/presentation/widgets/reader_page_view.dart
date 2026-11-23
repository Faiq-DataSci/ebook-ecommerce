import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// Lembar pembaca halaman e-book digital dengan watermark hak cipta privat.
class ReaderPageView extends StatelessWidget {
  final String title;
  final int currentPage;
  final int totalPages;
  final double zoomLevel;
  final String? watermarkText;

  const ReaderPageView({
    super.key,
    required this.title,
    required this.currentPage,
    required this.totalPages,
    required this.zoomLevel,
    this.watermarkText,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Transform.scale(
        scale: zoomLevel,
        child: Container(
          key: const Key('reader_page_view'),
          margin: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
          padding: const EdgeInsets.all(20.0),
          constraints: const BoxConstraints(maxWidth: 420.0, minHeight: 520.0),
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
          child: Stack(
            children: [
              // Konten Halaman Teks Digital
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header Bab / Halaman
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Text(
                          title.toUpperCase(),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontFamily: AppTheme.fontMono,
                            fontSize: 10.0,
                            fontWeight: FontWeight.w700,
                            color: AppColors.nbTextMuted,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 6.0,
                          vertical: 2.0,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.nbPaper,
                          border: Border.all(
                            color: AppColors.nbBlack,
                            width: 1.0,
                          ),
                        ),
                        child: Text(
                          'PAGE $currentPage / $totalPages',
                          style: const TextStyle(
                            fontFamily: AppTheme.fontMono,
                            fontSize: 9.5,
                            fontWeight: FontWeight.w700,
                            color: AppColors.nbBlack,
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 8.0),
                  const Divider(color: AppColors.nbBlack, thickness: 1.5),
                  const SizedBox(height: 14.0),

                  // Judul Bab
                  Text(
                    'Bab $currentPage: Prinsip & Implementasi Teknis',
                    style: const TextStyle(
                      fontFamily: AppTheme.fontHeadline,
                      fontSize: 16.0,
                      fontWeight: FontWeight.w800,
                      color: AppColors.nbBlack,
                    ),
                  ),

                  const SizedBox(height: 12.0),

                  // Isi Paragraf Bacaan (DATA SIMULASI)
                  Text(
                    'Ini adalah tampilan pembacaan e-book in-app resmi yang aman. Seluruh file PDF e-book disimpan secara privat dan hanya dapat dibuka di dalam aplikasi melalui signed URL sementara berdurasi pendek.\n\n'
                    'Keamanan akses e-book diproteksi menggunakan token verifikasi kepemilikan EbookAccess aktif. Ketika token kedaluwarsa, pembaca dapat meminta pembaruan tautan seketika tanpa kehilangan status bacaan.\n\n'
                    'Paragraf halaman ke-$currentPage ini memberikan materi terstruktur untuk pembaca dengan tipografi yang nyaman, kontras tinggi, dan perlindungan hak cipta digital terintegrasi.',
                    style: const TextStyle(
                      fontFamily: AppTheme.fontBody,
                      fontSize: 13.5,
                      fontWeight: FontWeight.w400,
                      color: AppColors.nbBlack,
                      height: 1.6,
                    ),
                  ),

                  const SizedBox(height: 24.0),

                  // Footer Halaman
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Expanded(
                        child: Text(
                          'DATA SIMULASI // DILINDUNGI HAK CIPTA',
                          style: TextStyle(
                            fontFamily: AppTheme.fontMono,
                            fontSize: 9.0,
                            fontWeight: FontWeight.w700,
                            color: AppColors.nbTextMuted,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                      const SizedBox(width: 8.0),
                      Text(
                        '$currentPage',
                        style: const TextStyle(
                          fontFamily: AppTheme.fontMono,
                          fontSize: 12.0,
                          fontWeight: FontWeight.w800,
                          color: AppColors.nbBlack,
                        ),
                      ),
                    ],
                  ),
                ],
              ),

              // Diagonal Watermark Keamanan
              Positioned.fill(
                child: IgnorePointer(
                  child: Center(
                    child: Transform.rotate(
                      angle: -0.4,
                      child: Text(
                        watermarkText ??
                            'LISENSI RESMI PEMBACA // IN-APP READER',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontFamily: AppTheme.fontMono,
                          fontSize: 12.0,
                          fontWeight: FontWeight.w900,
                          color: AppColors.nbBlack.withValues(alpha: 0.08),
                          letterSpacing: 2.0,
                        ),
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
