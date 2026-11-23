import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// Tombol neo-brutalism (tinggi 48dp, border 2px, bayangan keras 3px).
/// Nonaktif atau sedang memproses: tanpa bayangan, fill `nb-muted`, tidak dapat
/// ditekan ulang (mencegah submit ganda).
class PtButton extends StatelessWidget {
  final String label;
  final IconData? icon;
  final VoidCallback? onTap;
  final Color color;
  final bool isLoading;
  final bool expand;

  const PtButton({
    super.key,
    required this.label,
    required this.onTap,
    this.icon,
    this.color = AppColors.nbYellow,
    this.isLoading = false,
    this.expand = true,
  });

  bool get _enabled => onTap != null && !isLoading;

  @override
  Widget build(BuildContext context) {
    final foreground = _enabled ? AppColors.nbBlack : AppColors.nbDisabledText;
    return Semantics(
      button: true,
      enabled: _enabled,
      child: InkWell(
        onTap: _enabled ? onTap : null,
        child: Container(
          height: 48,
          width: expand ? double.infinity : null,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: AppTheme.brutalBox(
            color: _enabled ? color : AppColors.nbMuted,
            borderColor: AppColors.nbBlack,
            borderWidth: AppTheme.borderDefault,
            shadowOffset: _enabled ? 3 : 0,
          ),
          child: Row(
            mainAxisSize: expand ? MainAxisSize.max : MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              if (isLoading)
                SizedBox(
                  width: 18,
                  height: 18,
                  child: CircularProgressIndicator(
                    strokeWidth: 2.5,
                    color: foreground,
                  ),
                )
              else if (icon != null)
                Icon(icon, size: 18, color: foreground),
              if (isLoading || icon != null) const SizedBox(width: 8),
              Flexible(
                child: Text(
                  label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppTheme.labelMd(foreground),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Snackbar neo-brutalism berfill status (ikon + teks, bukan hanya warna).
void showPtSnackBar(
  BuildContext context,
  String message, {
  Color color = AppColors.nbGreen,
  IconData icon = Icons.check_circle_outline,
}) {
  final messenger = ScaffoldMessenger.maybeOf(context);
  if (messenger == null) return;
  messenger.hideCurrentSnackBar();
  try {
    messenger.showSnackBar(
      SnackBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        content: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          decoration: AppTheme.brutalBox(
            color: color,
            borderColor: AppColors.nbBlack,
            borderWidth: AppTheme.borderDefault,
            shadowOffset: 3,
          ),
          child: Row(
            children: <Widget>[
              Icon(icon, size: 18, color: AppColors.nbBlack),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  message,
                  style: AppTheme.labelSm(AppColors.nbBlack, fontSize: 12),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  } catch (_) {}
}
