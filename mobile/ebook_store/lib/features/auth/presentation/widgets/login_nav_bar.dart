import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// Minimal Nav Status Bar matching Stitch design:
/// 1. Close/back button with hard-offset shadow.
/// 2. "BACA BUKU" yellow badge.
/// 3. "SECURE LOGIN" green badge with status indicator dot.
class LoginNavBar extends StatelessWidget {
  final VoidCallback? onClose;
  final bool isErrorState;
  final String? errorCode;

  const LoginNavBar({
    super.key,
    this.onClose,
    this.isErrorState = false,
    this.errorCode,
  });

  @override
  Widget build(BuildContext context) {
    if (isErrorState) {
      return Padding(
        padding: const EdgeInsets.only(top: 8.0, bottom: 12.0),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            // Left: KEMBALI KE BERANDA button
            Flexible(
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: onClose ?? () => Navigator.of(context).maybePop(),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8.0,
                      vertical: 6.0,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.nbWhite,
                      border: Border.all(color: AppColors.nbBlack, width: 2.0),
                      boxShadow: const [
                        BoxShadow(
                          color: AppColors.nbBlack,
                          offset: Offset(3.0, 3.0),
                          blurRadius: 0.0,
                        ),
                      ],
                    ),
                    child: const FittedBox(
                      fit: BoxFit.scaleDown,
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.arrow_back,
                            size: 16.0,
                            color: AppColors.nbBlack,
                          ),
                          SizedBox(width: 5.0),
                          Text(
                            'KEMBALI KE BERANDA',
                            style: TextStyle(
                              fontFamily: AppTheme.fontHeadline,
                              fontSize: 11.0,
                              fontWeight: FontWeight.w700,
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
            ),

            const SizedBox(width: 8.0),

            // Right: KODE #ERR-401
            FittedBox(
              fit: BoxFit.scaleDown,
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 8.0,
                  vertical: 4.0,
                ),
                decoration: BoxDecoration(
                  color: AppColors.nbMuted,
                  border: Border.all(color: AppColors.nbBlack, width: 2.0),
                ),
                child: Text(
                  'KODE #${errorCode ?? 'ERR-401'}',
                  style: const TextStyle(
                    fontFamily: AppTheme.fontMono,
                    fontSize: 10.5,
                    fontWeight: FontWeight.w700,
                    color: AppColors.nbTextMuted,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
            ),
          ],
        ),
      );
    }

    return Padding(
      padding: const EdgeInsets.only(top: 8.0, bottom: 12.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Close button: 36x36px white box, 2px border, 2px shadow
          Semantics(
            label: 'Tutup Halaman Login',
            button: true,
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: onClose ?? () => Navigator.of(context).maybePop(),
                child: Container(
                  width: 36.0,
                  height: 36.0,
                  decoration: BoxDecoration(
                    color: AppColors.nbWhite,
                    border: Border.all(color: AppColors.nbBlack, width: 2.0),
                    boxShadow: const [
                      BoxShadow(
                        color: AppColors.nbBlack,
                        offset: Offset(2, 2),
                        blurRadius: 0,
                      ),
                    ],
                  ),
                  alignment: Alignment.center,
                  child: const Text(
                    '✕',
                    style: TextStyle(
                      fontFamily: AppTheme.fontMono,
                      fontSize: 14.0,
                      fontWeight: FontWeight.w700,
                      color: AppColors.nbBlack,
                    ),
                  ),
                ),
              ),
            ),
          ),

          // Right-aligned status badges
          Flexible(
            child: FittedBox(
              fit: BoxFit.scaleDown,
              alignment: Alignment.centerRight,
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Badge "BACA BUKU"
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8.0,
                      vertical: 3.0,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.nbYellow,
                      border: Border.all(color: AppColors.nbBlack, width: 2.0),
                      boxShadow: const [
                        BoxShadow(
                          color: AppColors.nbBlack,
                          offset: Offset(2, 2),
                          blurRadius: 0,
                        ),
                      ],
                    ),
                    child: const Text(
                      'BACA BUKU',
                      style: TextStyle(
                        fontFamily: AppTheme.fontMono,
                        fontSize: 11.0,
                        fontWeight: FontWeight.w700,
                        color: AppColors.nbBlack,
                        letterSpacing: 0.8,
                      ),
                    ),
                  ),

                  const SizedBox(width: 8.0),

                  // Badge "SECURE LOGIN" with green indicator dot
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8.0,
                      vertical: 3.0,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.nbGreen,
                      border: Border.all(color: AppColors.nbBlack, width: 2.0),
                      boxShadow: const [
                        BoxShadow(
                          color: AppColors.nbBlack,
                          offset: Offset(2, 2),
                          blurRadius: 0,
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 7.0,
                          height: 7.0,
                          decoration: const BoxDecoration(
                            color: AppColors.nbBlack,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 5.0),
                        const Text(
                          'SECURE LOGIN',
                          style: TextStyle(
                            fontFamily: AppTheme.fontMono,
                            fontSize: 10.0,
                            fontWeight: FontWeight.w700,
                            color: AppColors.nbBlack,
                            letterSpacing: 0.8,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
