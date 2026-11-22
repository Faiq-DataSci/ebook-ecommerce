import 'dart:async';
import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import 'splash_painters.dart';

/// Automated App Loading Footer for Splash Screen.
/// Automatically steps loading smoothly to 100% to boot the app without requiring manual click,
/// displaying animated marching diagonal stripes, dynamic system loading status messages,
/// 4 capability pills (PDF, BACA OFFLINE, MARKA BUKU, SYNC OTOMATIS),
/// and an automated Neubrutalist loading status indicator in Coral Pink / Mint Green.
class SplashFooter extends StatefulWidget {
  final VoidCallback? onFinishedLoading;
  final Duration totalDuration;

  const SplashFooter({
    super.key,
    this.onFinishedLoading,
    this.totalDuration = const Duration(milliseconds: 1400),
  });

  @override
  State<SplashFooter> createState() => _SplashFooterState();
}

class _SplashFooterState extends State<SplashFooter>
    with SingleTickerProviderStateMixin {
  int _progress = 10;
  double _boxAngle = 0;
  Timer? _rotationTimer;
  Timer? _progressTimer;
  bool _isTransitioning = false;
  late final AnimationController _stripeController;

  @override
  void initState() {
    super.initState();

    // Repeating controller for the animated marching diagonal stripes
    _stripeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat();

    // Rotate square indicator 90 degrees every 350ms
    _rotationTimer = Timer.periodic(const Duration(milliseconds: 350), (_) {
      if (mounted) {
        setState(() {
          _boxAngle = (_boxAngle + 90) % 360;
        });
      }
    });

    // Auto-progress evenly dividing totalDuration into 20 steps
    const totalSteps = 20;
    final stepInterval = (widget.totalDuration.inMilliseconds / totalSteps)
        .round()
        .clamp(10, 100);
    const stepAmount = (100 / totalSteps);

    _progressTimer = Timer.periodic(Duration(milliseconds: stepInterval), (
      timer,
    ) {
      if (!mounted) {
        timer.cancel();
        return;
      }

      if (_progress < 100) {
        setState(() {
          _progress = (_progress + stepAmount.toInt()).clamp(0, 100);
        });
      }

      if (_progress >= 100) {
        timer.cancel();
        if (!_isTransitioning) {
          _isTransitioning = true;
          Future.delayed(const Duration(milliseconds: 150), () {
            if (mounted) {
              widget.onFinishedLoading?.call();
            }
          });
        }
      }
    });
  }

  @override
  void dispose() {
    _stripeController.dispose();
    _rotationTimer?.cancel();
    _progressTimer?.cancel();
    super.dispose();
  }

  String _getStatusText() {
    if (_progress < 35) {
      return 'Memeriksa status sistem & sesi...';
    } else if (_progress < 75) {
      return 'Memuat koleksi buku digital & pustaka...';
    } else if (_progress < 100) {
      return 'Menyiapkan antarmuka aplikasi...';
    } else {
      return 'Katalog e-book siap dibuka!';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        // System monitor & loading status card
        _buildStatusCard(),

        const SizedBox(height: 12.0),

        // Automated Neubrutalist Loading Status Indicator (no manual click needed)
        _buildLoadingIndicator(),
      ],
    );
  }

  /// System Status card displaying progress percentage, striped bar, and feature pills.
  Widget _buildStatusCard() {
    final isReady = _progress >= 100;
    final progressLabel = isReady ? '100% SIAP' : '$_progress%';

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(12.0),
      decoration: BoxDecoration(
        color: AppColors.nbWhite,
        border: Border.all(
          color: AppColors.nbBlack,
          width: AppTheme.borderMedium, // 3px
        ),
        boxShadow: const [
          BoxShadow(
            color: AppColors.nbBlack,
            offset: Offset(6, 6), // 6px hard offset shadow
            blurRadius: 0,
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header row with rotating square, label, and progress percentage
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  children: [
                    // Rotating square indicator with crisp mechanical ticks
                    AnimatedRotation(
                      turns: _boxAngle / 360.0,
                      duration: const Duration(milliseconds: 200),
                      child: Container(
                        width: 14.0,
                        height: 14.0,
                        decoration: BoxDecoration(
                          color: isReady ? AppColors.nbGreen : AppColors.nbPink,
                          border: Border.all(
                            color: AppColors.nbBlack,
                            width: 2.0,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 8.0),
                    Expanded(
                      child: Text(
                        _getStatusText(),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style:
                            AppTheme.labelSm(
                              AppColors.nbBlack,
                              fontSize: 12.0,
                            ).copyWith(
                              fontWeight: FontWeight.w700,
                              letterSpacing: -0.2,
                            ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8.0),
              Text(
                progressLabel,
                style: AppTheme.dataMono(
                  AppColors.nbBlack,
                  fontSize: 12.0,
                ).copyWith(fontWeight: FontWeight.w700),
              ),
            ],
          ),

          const SizedBox(height: 8.0),

          // Striped Neubrutalist Progress Bar with animated marching stripes
          Container(
            height: 20.0,
            width: double.infinity,
            padding: const EdgeInsets.all(2.0),
            decoration: BoxDecoration(
              color: AppColors.nbMuted,
              border: Border.all(
                color: AppColors.nbBlack,
                width: AppTheme.borderDefault, // 2px
              ),
            ),
            child: LayoutBuilder(
              builder: (context, constraints) {
                final fillWidth = constraints.maxWidth * (_progress / 100.0);
                return Align(
                  alignment: Alignment.centerLeft,
                  child: Container(
                    width: fillWidth,
                    height: double.infinity,
                    decoration: const BoxDecoration(
                      color: AppColors.nbGreen,
                      border: Border(
                        right: BorderSide(color: AppColors.nbBlack, width: 2.0),
                      ),
                    ),
                    child: ClipRect(
                      child: AnimatedBuilder(
                        animation: _stripeController,
                        builder: (context, child) {
                          return CustomPaint(
                            painter: DiagonalStripesPainter(
                              stripeColor: AppColors.nbBlack,
                              stripeWidth: 3.0,
                              gap: 6.0,
                              animationOffset: _stripeController.value,
                            ),
                          );
                        },
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          const SizedBox(height: 10.0),

          // 4-Column Feature Pills: Customer-friendly, removed SPK SAW and DRM SAFE!
          Container(
            padding: const EdgeInsets.only(top: 8.0),
            decoration: const BoxDecoration(
              border: Border(
                top: BorderSide(color: AppColors.nbBlack, width: 1.5),
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: _buildFeaturePill(
                    label: 'PDF',
                    color: AppColors.nbYellow,
                  ),
                ),
                const SizedBox(width: 6.0),
                Expanded(
                  child: _buildFeaturePill(
                    label: 'BACA OFFLINE',
                    color: AppColors.nbBlue,
                  ),
                ),
                const SizedBox(width: 6.0),
                Expanded(
                  child: _buildFeaturePill(
                    label: 'MARKA BUKU',
                    color: AppColors.nbLavender,
                  ),
                ),
                const SizedBox(width: 6.0),
                Expanded(
                  child: _buildFeaturePill(
                    label: 'SYNC OTOMATIS',
                    color: AppColors.nbGreen,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// Single feature pill widget with hard border and auto-scaling label.
  Widget _buildFeaturePill({required String label, required Color color}) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 4.5, horizontal: 2.0),
      decoration: BoxDecoration(
        color: color,
        border: Border.all(color: AppColors.nbBlack, width: 1.5),
      ),
      alignment: Alignment.center,
      child: FittedBox(
        fit: BoxFit.scaleDown,
        child: Text(
          label,
          maxLines: 1,
          style: AppTheme.dataMono(
            AppColors.nbBlack,
            fontSize: 10.5,
          ).copyWith(fontWeight: FontWeight.w700),
        ),
      ),
    );
  }

  /// Automated App Loading Status Indicator.
  /// Replaces the manual "MULAI MEMBACA" button with continuous, non-blocking feedback.
  Widget _buildLoadingIndicator() {
    final isReady = _progress >= 100;
    final bgColor = isReady ? AppColors.nbGreen : AppColors.nbPink;

    return Container(
      height: 50.0,
      padding: const EdgeInsets.symmetric(horizontal: 14.0),
      decoration: BoxDecoration(
        color: bgColor,
        border: Border.all(
          color: AppColors.nbBlack,
          width: 3.2, // Bold 3.2px outline
        ),
        boxShadow: const [
          BoxShadow(
            color: AppColors.nbBlack,
            offset: Offset(5, 5), // 5px hard offset shadow
            blurRadius: 0,
          ),
        ],
      ),
      child: Center(
        child: FittedBox(
          fit: BoxFit.scaleDown,
          child: Row(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (!isReady) ...[
                const SizedBox(
                  width: 16.0,
                  height: 16.0,
                  child: CircularProgressIndicator(
                    strokeWidth: 2.5,
                    color: AppColors.nbBlack,
                  ),
                ),
                const SizedBox(width: 10.0),
                Text(
                  'MEMUAT APLIKASI...',
                  style: AppTheme.labelMd(AppColors.nbBlack).copyWith(
                    fontSize: 14.0,
                    letterSpacing: 1.0,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ] else ...[
                const Text(
                  '✓',
                  style: TextStyle(
                    fontSize: 16.0,
                    fontWeight: FontWeight.w900,
                    color: AppColors.nbBlack,
                  ),
                ),
                const SizedBox(width: 8.0),
                Text(
                  'APLIKASI SIAP — MEMBUKA KATALOG...',
                  style: AppTheme.labelMd(AppColors.nbBlack).copyWith(
                    fontSize: 13.0,
                    letterSpacing: 0.8,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
