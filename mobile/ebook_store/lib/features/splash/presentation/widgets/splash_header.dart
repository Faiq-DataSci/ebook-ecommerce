import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// Top header of the Splash Screen featuring two punchy Neubrutalist status badges:
/// 1. `[ OPEN BOOK ]` with a vibrant pulsating pink live indicator.
/// 2. `EDISI 2025` edition identifier badge in lavender.
class SplashHeader extends StatefulWidget {
  const SplashHeader({super.key});

  @override
  State<SplashHeader> createState() => _SplashHeaderState();
}

class _SplashHeaderState extends State<SplashHeader>
    with SingleTickerProviderStateMixin {
  late final AnimationController _pulseController;
  late final Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..repeat(reverse: true);

    _pulseAnimation = Tween<double>(begin: 0.35, end: 1.0).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        // Left badge: [ OPEN BOOK ] with pulsing indicator
        Flexible(
          child: Container(
            padding: const EdgeInsets.symmetric(
              horizontal: 10.0,
              vertical: 4.5,
            ),
            decoration: BoxDecoration(
              color: AppColors.nbPaper,
              border: Border.all(color: AppColors.nbBlack, width: 2.2),
              boxShadow: const [
                BoxShadow(
                  color: AppColors.nbBlack,
                  offset: Offset(3, 3),
                  blurRadius: 0,
                ),
              ],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                AnimatedBuilder(
                  animation: _pulseAnimation,
                  builder: (context, child) {
                    return Opacity(
                      opacity: _pulseAnimation.value,
                      child: child,
                    );
                  },
                  child: Container(
                    width: 10.0,
                    height: 10.0,
                    decoration: BoxDecoration(
                      color: AppColors.nbPink,
                      border: Border.all(color: AppColors.nbBlack, width: 1.5),
                    ),
                  ),
                ),
                const SizedBox(width: 6.0),
                Flexible(
                  child: Text(
                    '[ OPEN BOOK ]',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: AppTheme.dataMono(
                      AppColors.nbBlack,
                      fontSize: 11.5,
                    ).copyWith(letterSpacing: 0.8, fontWeight: FontWeight.w700),
                  ),
                ),
              ],
            ),
          ),
        ),

        const SizedBox(width: 8.0),

        // Right badge: EDISI 2025 // v2.4
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 4.5),
          decoration: BoxDecoration(
            color: AppColors.nbLavender,
            border: Border.all(color: AppColors.nbBlack, width: 2.2),
            boxShadow: const [
              BoxShadow(
                color: AppColors.nbBlack,
                offset: Offset(3, 3),
                blurRadius: 0,
              ),
            ],
          ),
          child: Text(
            'System-01',
            style: AppTheme.dataMono(
              AppColors.nbBlack,
              fontSize: 11.5,
            ).copyWith(fontWeight: FontWeight.w700),
          ),
        ),
      ],
    );
  }
}
