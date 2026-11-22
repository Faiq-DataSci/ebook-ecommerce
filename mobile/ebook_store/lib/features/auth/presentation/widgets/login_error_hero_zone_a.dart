import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// Zone A: Error Banner (Expressive Neubrutalist) from Google Stitch:
/// Layer: "Login Mobile Error State (Zona A/C)"
/// Features:
/// - Coral Pink container (`#FF6B6B`), 3px solid black border, 5px hard shadow.
/// - Top Error Ribbon: [✕] icon box + "GAGAL MASUK" title + Orange badge "PERINGATAN KEAMANAN".
/// - Error description text explaining failure clearly.
/// - Failure Indicator Box with 5-segment brutalist progress bar and security note.
class LoginErrorHeroZoneA extends StatelessWidget {
  final String title;
  final String message;
  final String ribbon;
  final int failedAttempts;
  final VoidCallback? onDismiss;

  const LoginErrorHeroZoneA({
    super.key,
    this.title = 'GAGAL MASUK',
    required this.message,
    this.ribbon = 'PERINGATAN KEAMANAN',
    this.failedAttempts = 1,
    this.onDismiss,
  });

  @override
  Widget build(BuildContext context) {
    final clampedAttempts = failedAttempts.clamp(1, 5);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: AppColors.nbPink,
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
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          // 1. Top Error Ribbon
          Padding(
            padding: const EdgeInsets.only(bottom: 8.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Flexible(
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 24.0,
                        height: 24.0,
                        color: AppColors.nbBlack,
                        alignment: Alignment.center,
                        child: const Text(
                          '✕',
                          style: TextStyle(
                            fontFamily: AppTheme.fontHeadline,
                            fontSize: 14.0,
                            fontWeight: FontWeight.w900,
                            color: AppColors.nbWhite,
                            height: 1.0,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8.0),
                      Flexible(
                        child: Text(
                          title.toUpperCase(),
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontFamily: AppTheme.fontHeadline,
                            fontSize: 16.0,
                            fontWeight: FontWeight.w800,
                            color: AppColors.nbBlack,
                            letterSpacing: -0.3,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8.0),
                FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8.0,
                      vertical: 3.0,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.nbOrange,
                      border: Border.all(color: AppColors.nbBlack, width: 2.0),
                    ),
                    child: Text(
                      ribbon.toUpperCase(),
                      style: const TextStyle(
                        fontFamily: AppTheme.fontMono,
                        fontSize: 9.5,
                        fontWeight: FontWeight.w700,
                        color: AppColors.nbBlack,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          const Divider(height: 1.0, thickness: 2.0, color: AppColors.nbBlack),

          const SizedBox(height: 8.0),

          // 2. Error Description
          Text(
            message,
            style: const TextStyle(
              fontFamily: AppTheme.fontBody,
              fontSize: 12.5,
              fontWeight: FontWeight.w500,
              color: AppColors.nbBlack,
              height: 1.35,
            ),
          ),

          const SizedBox(height: 10.0),

          // 3. Failure Indicator Box (Security Attempt Tracker)
          Container(
            padding: const EdgeInsets.all(8.0),
            decoration: BoxDecoration(
              color: AppColors.nbPaper,
              border: Border.all(color: AppColors.nbBlack, width: 2.0),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Flexible(
                      child: Text(
                        'PERCOBAAN KEAMANAN:',
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontFamily: AppTheme.fontHeadline,
                          fontSize: 11.0,
                          fontWeight: FontWeight.w700,
                          color: AppColors.nbBlack,
                        ),
                      ),
                    ),
                    const SizedBox(width: 6.0),
                    Text(
                      '$clampedAttempts / 5 GAGAL',
                      style: const TextStyle(
                        fontFamily: AppTheme.fontMono,
                        fontSize: 11.0,
                        fontWeight: FontWeight.w800,
                        color: AppColors.nbPink,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6.0),

                // 5-segment brutalist progress bar
                Container(
                  height: 14.0,
                  padding: const EdgeInsets.all(1.5),
                  decoration: BoxDecoration(
                    color: AppColors.nbWhite,
                    border: Border.all(color: AppColors.nbBlack, width: 2.0),
                  ),
                  child: Row(
                    children: List.generate(5, (index) {
                      final isFilled = index < clampedAttempts;
                      return Expanded(
                        child: Container(
                          margin: EdgeInsets.only(right: index < 4 ? 2.0 : 0.0),
                          decoration: BoxDecoration(
                            color: isFilled
                                ? AppColors.nbPink
                                : AppColors.surfaceContainer,
                            border: isFilled
                                ? Border.all(
                                    color: AppColors.nbBlack,
                                    width: 1.0,
                                  )
                                : null,
                          ),
                        ),
                      );
                    }),
                  ),
                ),

                const SizedBox(height: 4.0),

                const Text(
                  'Akun akan diamankan otomatis selama 15 menit jika mencapai 5 kali kegagalan berturut-turut.',
                  style: TextStyle(
                    fontFamily: AppTheme.fontBody,
                    fontSize: 10.5,
                    color: AppColors.nbTextMuted,
                    height: 1.25,
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
