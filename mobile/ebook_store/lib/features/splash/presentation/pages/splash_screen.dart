import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../../../home/presentation/pages/home_screen.dart';
import '../../../../theme/app_colors.dart';
import '../widgets/splash_footer.dart';
import '../widgets/splash_header.dart';
import '../widgets/splash_hero_card.dart';
import '../widgets/splash_painters.dart';

/// Pixel-perfect Flutter implementation of Google Stitch's design:
/// Layer: "Splash Screen Mobile 390x884 - Icon Update"
/// Project: "Stitch – Sistem Informasi E-Commerce E-Book"
/// Enhanced with automated app loading: boots application smoothly
/// and navigates directly without requiring manual button click.
class SplashScreen extends ConsumerStatefulWidget {
  final Duration totalDuration;
  final bool autoNavigate;
  final VoidCallback? onLoaded;

  const SplashScreen({
    super.key,
    this.totalDuration = const Duration(milliseconds: 1400),
    this.autoNavigate = true,
    this.onLoaded,
  });

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen> {
  @override
  void initState() {
    super.initState();
    // P1.2 Auto-Login / Session Restore: Memvalidasi sesi JWT tersimpan saat aplikasi boot
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(authNotifierProvider.notifier).checkSession();
    });
  }

  void _navigateToHome() {
    if (!mounted) return;
    if (widget.onLoaded != null) {
      widget.onLoaded!();
      return;
    }
    if (!widget.autoNavigate) return;

    Navigator.of(context).pushReplacement(
      PageRouteBuilder(
        pageBuilder: (context, animation, secondaryAnimation) =>
            const HomeScreen(),
        transitionsBuilder: (context, animation, secondaryAnimation, child) {
          return FadeTransition(opacity: animation, child: child);
        },
        transitionDuration: const Duration(milliseconds: 300),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.nbYellow,
      body: Stack(
        fit: StackFit.expand,
        children: [
          // 1. Signature Stitch 32x32px black grid background
          const Positioned.fill(
            child: CustomPaint(
              painter: BrutalistGridPainter(
                cellSize: 32.0,
                lineColor: AppColors.nbBlack,
                strokeWidth: 1.0,
              ),
            ),
          ),

          // 2. Decorative background watermarks (Stitch exact positions and opacity)
          // Top-right glyph: ✱ (84px, opacity 0.20)
          Positioned(
            top: -12.0,
            right: -12.0,
            child: IgnorePointer(
              child: Opacity(
                opacity: 0.20,
                child: Text(
                  '✱',
                  style: TextStyle(
                    fontFamily: 'Space Grotesk',
                    fontSize: 84.0,
                    fontWeight: FontWeight.w700,
                    color: AppColors.nbBlack,
                    height: 1.0,
                  ),
                ),
              ),
            ),
          ),

          // Mid-left glyph: ✦ (64px, opacity 0.15)
          Positioned(
            top: MediaQuery.of(context).size.height * 0.33,
            left: -16.0,
            child: IgnorePointer(
              child: Opacity(
                opacity: 0.15,
                child: Text(
                  '✦',
                  style: TextStyle(
                    fontFamily: 'Space Grotesk',
                    fontSize: 64.0,
                    fontWeight: FontWeight.w700,
                    color: AppColors.nbBlack,
                    height: 1.0,
                  ),
                ),
              ),
            ),
          ),

          // Bottom-right glyph: ★ (96px, opacity 0.20)
          Positioned(
            bottom: 96.0,
            right: -16.0,
            child: IgnorePointer(
              child: Opacity(
                opacity: 0.20,
                child: Text(
                  '★',
                  style: TextStyle(
                    fontFamily: 'Space Grotesk',
                    fontSize: 96.0,
                    fontWeight: FontWeight.w700,
                    color: AppColors.nbBlack,
                    height: 1.0,
                  ),
                ),
              ),
            ),
          ),

          // 3. Foreground content strictly adhering to Safe Area & 390px target resolution
          SafeArea(
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 390.0),
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16.0,
                    vertical: 20.0,
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Header: [ OPEN BOOK ] & System-01
                      const SplashHeader(),

                      // Central Hero Card with -0.75deg rotation & stacked 3D icon
                      const Padding(
                        padding: EdgeInsets.symmetric(vertical: 4.0),
                        child: SplashHeroCard(),
                      ),

                      // Footer: Status monitor, stripes progress bar, and automated loading indicator
                      SplashFooter(
                        totalDuration: widget.totalDuration,
                        onFinishedLoading: _navigateToHome,
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
