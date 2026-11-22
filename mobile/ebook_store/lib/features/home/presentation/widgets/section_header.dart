import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// Reusable Neubrutalist section header for `Beranda Mobile (Neubrutalism)`.
/// Supports:
/// - Uppercase label header with mono right counter (`KATEGORI PILIHAN` / `6 Bidang`)
/// - Section headline with bordered right badge (`Top Rekomendasi SAW` / `C1-C4 SCORING`)
/// - Section headline with underlined action link (`Rilisan Terbaru` / `Lihat Semua ->`)
class SectionHeader extends StatelessWidget {
  final String title;
  final NbPalette palette;
  final bool isSmallUppercase;
  final String? rightMonoText;
  final String? rightBadgeText;
  final Color? rightBadgeColor;
  final String? actionLabel;
  final VoidCallback? onActionTap;

  const SectionHeader({
    super.key,
    required this.title,
    required this.palette,
    this.isSmallUppercase = false,
    this.rightMonoText,
    this.rightBadgeText,
    this.rightBadgeColor,
    this.actionLabel,
    this.onActionTap,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        Flexible(
          child: Text(
            title,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: isSmallUppercase
                ? AppTheme.labelMd(
                    palette.textPrimary,
                  ).copyWith(letterSpacing: 0.7)
                : AppTheme.headlineSmMobile(palette.textPrimary),
          ),
        ),
        if (rightMonoText != null) ...<Widget>[
          const SizedBox(width: 8),
          Text(
            rightMonoText!,
            style: AppTheme.dataMono(palette.textMuted, fontSize: 11),
          ),
        ],
        if (rightBadgeText != null) ...<Widget>[
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
            decoration: AppTheme.brutalBox(
              color: rightBadgeColor ?? palette.lavender,
              borderColor: palette.ink,
              borderWidth: AppTheme.borderDefault,
              shadowOffset: 2,
            ),
            child: Text(
              rightBadgeText!,
              style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 11),
            ),
          ),
        ],
        if (actionLabel != null) ...<Widget>[
          const SizedBox(width: 8),
          Semantics(
            button: true,
            label: actionLabel,
            child: InkWell(
              onTap: onActionTap,
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 2),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget>[
                    Container(
                      padding: const EdgeInsets.only(bottom: 1),
                      decoration: BoxDecoration(
                        border: Border(
                          bottom: BorderSide(
                            color: palette.ink,
                            width: AppTheme.borderDefault,
                          ),
                        ),
                      ),
                      child: Text(
                        actionLabel!,
                        style: AppTheme.labelSm(
                          palette.textPrimary,
                          fontSize: 12,
                        ),
                      ),
                    ),
                    const SizedBox(width: 4),
                    Icon(
                      Icons.arrow_forward,
                      size: 16,
                      color: palette.textPrimary,
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ],
    );
  }
}
