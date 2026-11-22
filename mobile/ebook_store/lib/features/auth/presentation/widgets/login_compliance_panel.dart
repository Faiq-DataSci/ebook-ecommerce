import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// Zone C: Security & Compliance Note from Google Stitch:
/// Layer: "Login Mobile Error State (Zona A/C)"
class LoginCompliancePanel extends StatelessWidget {
  const LoginCompliancePanel({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10.0),
      margin: const EdgeInsets.only(top: 10.0, bottom: 8.0),
      decoration: BoxDecoration(
        color: AppColors.nbPaper,
        border: Border.all(color: AppColors.nbBlack, width: 2.0),
      ),
      child: const Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.verified_user, size: 16.0, color: AppColors.nbBlack),
          SizedBox(width: 8.0),
          Expanded(
            child: Text(
              'Demi melindungi integritas data akun dan keamanan sistem, kami membatasi percobaan masuk yang tidak sah.',
              style: TextStyle(
                fontFamily: AppTheme.fontBody,
                fontSize: 11.5,
                color: AppColors.nbTextMuted,
                height: 1.35,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Footer System Diagnostics / Audit Label from Google Stitch:
/// Displays non-sensitive security trace info in error state.
class LoginAuditFooter extends StatelessWidget {
  final String traceId;

  const LoginAuditFooter({super.key, this.traceId = '#401-AUTH-09941'});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 6.0),
        margin: const EdgeInsets.only(top: 6.0, bottom: 16.0),
        decoration: BoxDecoration(
          color: AppColors.nbMuted,
          border: Border.all(color: AppColors.nbBlack, width: 2.0),
        ),
        child: Text(
          'AUTH ENGINE V2.4 // STATUS: FAILED_ATTEMPT_LOGGED\nTRACE_ID: $traceId // IP: 182.1.24.90',
          style: const TextStyle(
            fontFamily: AppTheme.fontMono,
            fontSize: 9.5,
            fontWeight: FontWeight.w700,
            color: AppColors.nbBlack,
            height: 1.3,
          ),
        ),
      ),
    );
  }
}
