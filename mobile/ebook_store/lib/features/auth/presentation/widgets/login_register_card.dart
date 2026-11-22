import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// Kartu Ajakan Daftar Akun Baru strictly matching Stitch's Neubrutalism design:
/// - Lavender container (`#B8A9FA`), 3px black border, 3px offset hard shadow.
/// - Left prompt: "Belum memiliki akun?" & "KOLEKSI BUKU MENANTI ANDA".
/// - Right button: "DAFTAR SEKARANG ➔" (White, 2px border, 3px shadow).
class LoginRegisterCard extends StatelessWidget {
  final VoidCallback onRegister;

  const LoginRegisterCard({super.key, required this.onRegister});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(top: 12.0),
      padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 14.0),
      decoration: BoxDecoration(
        color: AppColors.nbLavender,
        border: Border.all(color: AppColors.nbBlack, width: 3.0),
        boxShadow: const [
          BoxShadow(
            color: AppColors.nbBlack,
            offset: Offset(3, 3),
            blurRadius: 0,
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Left Prompt Text
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Belum memiliki akun?',
                  style: TextStyle(
                    fontFamily: AppTheme.fontBody,
                    fontSize: 12.0,
                    fontWeight: FontWeight.w500,
                    color: AppColors.nbBlack,
                  ),
                ),
                SizedBox(height: 2.0),
                Text(
                  'KOLEKSI BUKU MENANTI ANDA',
                  style: TextStyle(
                    fontFamily: AppTheme.fontHeadline,
                    fontSize: 12.0,
                    fontWeight: FontWeight.w700,
                    color: AppColors.nbBlack,
                    letterSpacing: -0.2,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(width: 8.0),

          // Right Button: DAFTAR SEKARANG
          Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: onRegister,
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12.0,
                  vertical: 8.0,
                ),
                decoration: BoxDecoration(
                  color: AppColors.nbWhite,
                  border: Border.all(color: AppColors.nbBlack, width: 2.0),
                  boxShadow: const [
                    BoxShadow(
                      color: AppColors.nbBlack,
                      offset: Offset(3, 3),
                      blurRadius: 0,
                    ),
                  ],
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'DAFTAR SEKARANG',
                      style: TextStyle(
                        fontFamily: AppTheme.fontHeadline,
                        fontSize: 11.5,
                        fontWeight: FontWeight.w700,
                        color: AppColors.nbBlack,
                        letterSpacing: 0.3,
                      ),
                    ),
                    SizedBox(width: 4.0),
                    Text(
                      '➔',
                      style: TextStyle(
                        fontSize: 13.0,
                        fontWeight: FontWeight.w900,
                        color: AppColors.nbBlack,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
