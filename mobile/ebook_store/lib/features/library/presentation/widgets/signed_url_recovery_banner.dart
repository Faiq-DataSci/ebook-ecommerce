import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// Banner pemulihan ketika signed URL berumur pendek (300 detik) kedaluwarsa.
/// Sesuai Google Stitch & `design.md §5 & §8.9`:
/// - Muncul inline di dalam in-app PDF reader ketika signed URL habis masa berlakunya.
/// - Memiliki tombol aksi utama "Muat ulang tautan baca" untuk meminta signed URL baru dari backend.
/// - Neubrutalism Zona C: border 2.5px, hard shadow 3px, warna peringatan nb-orange & tombol nb-yellow.
class SignedUrlRecoveryBanner extends StatelessWidget {
  final VoidCallback onRefresh;
  final bool isRefreshing;
  final String? customMessage;

  const SignedUrlRecoveryBanner({
    super.key,
    required this.onRefresh,
    this.isRefreshing = false,
    this.customMessage,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const Key('signed_url_recovery_banner'),
      margin: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
      padding: const EdgeInsets.all(14.0),
      decoration: BoxDecoration(
        color: AppColors.nbOrange,
        border: Border.all(color: AppColors.nbBlack, width: 2.5),
        boxShadow: const [
          BoxShadow(
            color: AppColors.nbBlack,
            offset: Offset(3.0, 3.0),
            blurRadius: 0.0,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: [
          // Header Peringatan
          Row(
            children: [
              Container(
                width: 28.0,
                height: 28.0,
                decoration: BoxDecoration(
                  color: AppColors.nbWhite,
                  border: Border.all(color: AppColors.nbBlack, width: 2.0),
                ),
                child: const Center(
                  child: Icon(
                    Icons.lock_clock,
                    size: 18.0,
                    color: AppColors.nbBlack,
                  ),
                ),
              ),
              const SizedBox(width: 8.0),
              const Expanded(
                child: Text(
                  'TAUTAN BACA KEDALUWARSA',
                  style: TextStyle(
                    fontFamily: AppTheme.fontHeadline,
                    fontSize: 13.0,
                    fontWeight: FontWeight.w800,
                    color: AppColors.nbBlack,
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
                  color: AppColors.nbWhite,
                  border: Border.all(color: AppColors.nbBlack, width: 1.5),
                ),
                child: const Text(
                  'TTL 300s',
                  style: TextStyle(
                    fontFamily: AppTheme.fontMono,
                    fontSize: 10.0,
                    fontWeight: FontWeight.w700,
                    color: AppColors.nbBlack,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 8.0),

          // Deskripsi penyebab & alasan keamanan file privat
          Text(
            customMessage ??
                'Tautan baca sementara telah kedaluwarsa. Demi keamanan hak cipta dan perlindungan file privat, tautan akses diperbarui secara berkala.',
            style: const TextStyle(
              fontFamily: AppTheme.fontBody,
              fontSize: 12.0,
              fontWeight: FontWeight.w500,
              color: AppColors.nbBlack,
              height: 1.35,
            ),
          ),

          const SizedBox(height: 12.0),

          // Tombol Aksi Utama: "Muat ulang tautan baca"
          Semantics(
            button: true,
            label: 'Muat ulang tautan baca',
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                key: const Key('reader_refresh_signed_url_button'),
                onTap: isRefreshing ? null : onRefresh,
                child: Container(
                  height: 44.0,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: isRefreshing
                        ? AppColors.nbMuted
                        : AppColors.nbYellow,
                    border: Border.all(color: AppColors.nbBlack, width: 2.5),
                    boxShadow: isRefreshing
                        ? const []
                        : const [
                            BoxShadow(
                              color: AppColors.nbBlack,
                              offset: Offset(2.5, 2.5),
                              blurRadius: 0.0,
                            ),
                          ],
                  ),
                  child: isRefreshing
                      ? const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            SizedBox(
                              width: 16.0,
                              height: 16.0,
                              child: CircularProgressIndicator(
                                strokeWidth: 2.0,
                                valueColor: AlwaysStoppedAnimation<Color>(
                                  AppColors.nbBlack,
                                ),
                              ),
                            ),
                            SizedBox(width: 8.0),
                            Text(
                              'MEMPERBARUI TAUTAN...',
                              style: TextStyle(
                                fontFamily: AppTheme.fontHeadline,
                                fontSize: 12.0,
                                fontWeight: FontWeight.w800,
                                color: AppColors.nbBlack,
                                letterSpacing: 0.4,
                              ),
                            ),
                          ],
                        )
                      : const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(
                              Icons.refresh,
                              size: 18.0,
                              color: AppColors.nbBlack,
                            ),
                            SizedBox(width: 6.0),
                            Text(
                              'Muat ulang tautan baca',
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
          ),
        ],
      ),
    );
  }
}
