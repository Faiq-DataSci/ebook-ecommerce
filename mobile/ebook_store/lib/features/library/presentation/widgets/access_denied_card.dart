import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// Kartu penolakan akses e-book ketika hak akses dicabut oleh Administrator (`isRevoked = true`).
/// Sesuai `design.md §8.9 & §17`:
/// "Jika akses dicabut (isRevoked = true), tampilkan pesan penolakan akses dari backend tanpa membuka file."
class AccessDeniedCard extends StatelessWidget {
  final String title;
  final String message;
  final VoidCallback onBack;

  const AccessDeniedCard({
    super.key,
    required this.title,
    required this.message,
    required this.onBack,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        key: const Key('reader_access_denied_card'),
        margin: const EdgeInsets.all(24.0),
        padding: const EdgeInsets.all(20.0),
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
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header Penolakan (nb-pink)
            Container(
              padding: const EdgeInsets.symmetric(
                horizontal: 10.0,
                vertical: 6.0,
              ),
              decoration: BoxDecoration(
                color: AppColors.nbPink,
                border: Border.all(color: AppColors.nbBlack, width: 2.0),
              ),
              child: const Row(
                children: [
                  Icon(Icons.gpp_bad, color: AppColors.nbBlack, size: 20.0),
                  SizedBox(width: 8.0),
                  Expanded(
                    child: Text(
                      'AKSES E-BOOK DICABUT',
                      style: TextStyle(
                        fontFamily: AppTheme.fontHeadline,
                        fontSize: 12.0,
                        fontWeight: FontWeight.w800,
                        color: AppColors.nbBlack,
                        letterSpacing: 0.5,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16.0),

            // Judul E-book
            Text(
              title,
              style: const TextStyle(
                fontFamily: AppTheme.fontHeadline,
                fontSize: 15.0,
                fontWeight: FontWeight.w800,
                color: AppColors.nbBlack,
              ),
            ),

            const SizedBox(height: 8.0),

            // Pesan dari Backend
            Text(
              message,
              style: const TextStyle(
                fontFamily: AppTheme.fontBody,
                fontSize: 13.0,
                color: AppColors.nbBlack,
                height: 1.4,
              ),
            ),

            const SizedBox(height: 12.0),

            Container(
              padding: const EdgeInsets.all(8.0),
              decoration: BoxDecoration(
                color: AppColors.nbPaper,
                border: Border.all(color: AppColors.nbBlack, width: 1.5),
              ),
              child: const Text(
                'Demi integritas lisensi, konten file privat tidak dapat dibuka. Silakan hubungi admin bila terjadi kekeliruan administrasi.',
                style: TextStyle(
                  fontFamily: AppTheme.fontBody,
                  fontSize: 11.0,
                  color: AppColors.nbTextMuted,
                  height: 1.35,
                ),
              ),
            ),

            const SizedBox(height: 20.0),

            // Tombol Kembali
            InkWell(
              key: const Key('reader_access_denied_back_button'),
              onTap: onBack,
              child: Container(
                height: 44.0,
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
                child: const Text(
                  'KEMBALI KE PERPUSTAKAAN',
                  style: TextStyle(
                    fontFamily: AppTheme.fontHeadline,
                    fontSize: 12.5,
                    fontWeight: FontWeight.w800,
                    color: AppColors.nbBlack,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
