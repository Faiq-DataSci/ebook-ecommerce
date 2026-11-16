import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// Modal Konfirmasi Sukses Registrasi dari Google Stitch:
/// Layer: "Registrasi Mobile (Zona A/C)"
/// Dialog with 4px border, 8px hard shadow, green checkmark icon box,
/// and yellow "LANJUTKAN KE KATALOG ➔" action button.
class RegisterSuccessDialog extends StatelessWidget {
  final VoidCallback onContinue;

  const RegisterSuccessDialog({
    super.key,
    required this.onContinue,
  });

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      elevation: 0.0,
      insetPadding: const EdgeInsets.symmetric(horizontal: 24.0),
      child: Container(
        padding: const EdgeInsets.all(24.0),
        decoration: BoxDecoration(
          color: AppColors.nbPaper,
          border: Border.all(color: AppColors.nbBlack, width: 4.0),
          boxShadow: const [
            BoxShadow(
              color: AppColors.nbBlack,
              offset: Offset(8.0, 8.0),
              blurRadius: 0.0,
            ),
          ],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // 56x56px Green Check Icon Box with 3px border & 4px shadow
            Center(
              child: Container(
                width: 56.0,
                height: 56.0,
                decoration: BoxDecoration(
                  color: AppColors.nbGreen,
                  border: Border.all(color: AppColors.nbBlack, width: 3.0),
                  boxShadow: const [
                    BoxShadow(
                      color: AppColors.nbBlack,
                      offset: Offset(4.0, 4.0),
                      blurRadius: 0.0,
                    ),
                  ],
                ),
                child: const Center(
                  child: Icon(
                    Icons.check,
                    color: AppColors.nbBlack,
                    size: 32.0,
                  ),
                ),
              ),
            ),

            const SizedBox(height: 16.0),

            // Tagline: REGISTRASI BERHASIL
            const Center(
              child: Text(
                'REGISTRASI BERHASIL',
                style: TextStyle(
                  fontFamily: AppTheme.fontMono,
                  fontSize: 11.0,
                  fontWeight: FontWeight.w700,
                  color: AppColors.nbTextMuted,
                  letterSpacing: 0.5,
                ),
              ),
            ),

            const SizedBox(height: 4.0),

            // Title: LISENSI AKTIF!
            const Center(
              child: Text(
                'LISENSI AKTIF!',
                style: TextStyle(
                  fontFamily: AppTheme.fontHeadline,
                  fontSize: 22.0,
                  fontWeight: FontWeight.w800,
                  color: AppColors.nbBlack,
                  letterSpacing: -0.5,
                ),
              ),
            ),

            const SizedBox(height: 8.0),

            // Description
            const Center(
              child: Text(
                'Akun pembaca Anda telah berhasil didaftarkan. Nikmati akses e-book interaktif dan rekomendasi terbaik!',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontFamily: AppTheme.fontBody,
                  fontSize: 13.0,
                  color: AppColors.nbTextMuted,
                  height: 1.4,
                ),
              ),
            ),

            const SizedBox(height: 20.0),

            // Action Button: LANJUTKAN KE KATALOG
            InkWell(
              onTap: onContinue,
              child: Container(
                height: 48.0,
                decoration: BoxDecoration(
                  color: AppColors.nbYellow,
                  border: Border.all(color: AppColors.nbBlack, width: 3.0),
                  boxShadow: const [
                    BoxShadow(
                      color: AppColors.nbBlack,
                      offset: Offset(4.0, 4.0),
                      blurRadius: 0.0,
                    ),
                  ],
                ),
                child: const Center(
                  child: FittedBox(
                    fit: BoxFit.scaleDown,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'LANJUTKAN KE KATALOG',
                          style: TextStyle(
                            fontFamily: AppTheme.fontHeadline,
                            fontSize: 13.5,
                            fontWeight: FontWeight.w800,
                            color: AppColors.nbBlack,
                            letterSpacing: 0.5,
                          ),
                        ),
                        SizedBox(width: 6.0),
                        Icon(
                          Icons.arrow_forward,
                          color: AppColors.nbBlack,
                          size: 20.0,
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
    );
  }
}
