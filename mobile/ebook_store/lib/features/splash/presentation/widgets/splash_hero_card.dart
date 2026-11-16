import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import 'splash_painters.dart';

/// Central Hero Card of the Splash Screen representing the core identity of
/// Sistem Informasi E-Commerce E-Book (`BACA BUKU`).
/// Features an explosive 3D architectural backplate rotation (-5° and +5°),
/// -0.75° overall card tilt, crisp 8px solid drop shadow, and bold Neo-Brutalism styling.
class SplashHeroCard extends StatelessWidget {
  const SplashHeroCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Transform.rotate(
      angle: -0.75 * math.pi / 180, // Signature -0.75 deg rotation from Stitch spec
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          // Main card body
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(14.0),
            decoration: BoxDecoration(
              color: AppColors.nbWhite,
              border: Border.all(
                color: AppColors.nbBlack,
                width: 3.2, // Bold 3.2px brutalist outline
              ),
              boxShadow: const [
                BoxShadow(
                  color: AppColors.nbBlack,
                  offset: Offset(8, 8), // 8px high-impact hard offset shadow
                  blurRadius: 0,
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // Inner dotted frame with 3D architectural icon stage
                _buildInnerVisualFrame(),

                const SizedBox(height: 12.0),

                // Platform tag pill + Main Title "BACA BUKU"
                _buildTitleSection(),

                const SizedBox(height: 10.0),

                // Subtitle banner: PUSTAKA DIGITAL & PEMBACA E-BOOK INTERAKTIF
                _buildSubtitleBanner(),

                const SizedBox(height: 10.0),

                // Meta row: E-Commerce Ebook + KATALOG READY
                _buildMetaRow(),
              ],
            ),
          ),

          // Pinned top-left badge: SYS::LIBRARY
          Positioned(
            top: -14.0,
            left: -14.0,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 2.5),
              decoration: BoxDecoration(
                color: AppColors.nbPink,
                border: Border.all(
                  color: AppColors.nbBlack,
                  width: AppTheme.borderMedium, // 3px
                ),
                boxShadow: const [
                  BoxShadow(
                    color: AppColors.nbBlack,
                    offset: Offset(2.5, 2.5),
                    blurRadius: 0,
                  ),
                ],
              ),
              child: Text(
                'SYS::LIBRARY',
                style: AppTheme.dataMono(
                  AppColors.nbBlack,
                  fontSize: 12.0,
                ).copyWith(
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1.2,
                ),
              ),
            ),
          ),

          // Pinned top-right badge: Digital Commerce Shopping Bag
          Positioned(
            top: -12.0,
            right: -12.0,
            child: Container(
              width: 42.0,
              height: 42.0,
              decoration: BoxDecoration(
                color: AppColors.nbYellow,
                border: Border.all(
                  color: AppColors.nbBlack,
                  width: AppTheme.borderMedium, // 3px
                ),
                boxShadow: const [
                  BoxShadow(
                    color: AppColors.nbBlack,
                    offset: Offset(3, 3),
                    blurRadius: 0,
                  ),
                ],
              ),
              child: const Center(
                child: SizedBox(
                  width: 22.0,
                  height: 22.0,
                  child: CustomPaint(
                    painter: CommerceBagPainter(
                      strokeColor: AppColors.nbBlack,
                      fillColor: AppColors.nbPaper,
                      strokeWidth: 2.5,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// Inner dotted container housing the dynamic 3D rotated backplates and E-Book icon.
  Widget _buildInnerVisualFrame() {
    return Container(
      margin: const EdgeInsets.only(top: 8.0),
      padding: const EdgeInsets.symmetric(vertical: 18.0, horizontal: 8.0),
      decoration: BoxDecoration(
        color: AppColors.nbPaper,
        border: Border.all(
          color: AppColors.nbBlack,
          width: AppTheme.borderDefault, // 2px
        ),
      ),
      child: Stack(
        clipBehavior: Clip.none,
        alignment: Alignment.center,
        children: [
          // Background dotted grid pattern
          const Positioned.fill(
            child: CustomPaint(
              painter: BrutalistDotMatrixPainter(
                spacing: 14.0,
                dotRadius: 0.8,
                dotColor: AppColors.nbBlack,
              ),
            ),
          ),

          // Technical corner crosshairs
          const Positioned(
            top: 2.0,
            left: 4.0,
            child: Text(
              '+',
              style: TextStyle(
                fontFamily: 'Space Mono',
                fontSize: 11.0,
                fontWeight: FontWeight.w700,
                color: AppColors.nbBlack,
              ),
            ),
          ),
          const Positioned(
            top: 2.0,
            right: 4.0,
            child: Text(
              '+',
              style: TextStyle(
                fontFamily: 'Space Mono',
                fontSize: 11.0,
                fontWeight: FontWeight.w700,
                color: AppColors.nbBlack,
              ),
            ),
          ),
          const Positioned(
            bottom: 2.0,
            left: 4.0,
            child: Text(
              '+',
              style: TextStyle(
                fontFamily: 'Space Mono',
                fontSize: 11.0,
                fontWeight: FontWeight.w700,
                color: AppColors.nbBlack,
              ),
            ),
          ),
          const Positioned(
            bottom: 2.0,
            right: 4.0,
            child: Text(
              '+',
              style: TextStyle(
                fontFamily: 'Space Mono',
                fontSize: 11.0,
                fontWeight: FontWeight.w700,
                color: AppColors.nbBlack,
              ),
            ),
          ),

          // Sparkle Glyphs
          Positioned(
            top: 4.0,
            left: 16.0,
            child: Text(
              '✦',
              style: AppTheme.headlineSmMobile(AppColors.nbBlack).copyWith(
                fontSize: 20.0,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),

          Positioned(
            bottom: 4.0,
            right: 16.0,
            child: Text(
              '✱',
              style: AppTheme.headlineSmMobile(AppColors.nbPink).copyWith(
                fontSize: 20.0,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),

          // 3-layer Architectural Neo-Brutalism stacked icon stage
          SizedBox(
            width: 120.0,
            height: 120.0,
            child: Stack(
              clipBehavior: Clip.none,
              alignment: Alignment.center,
              children: [
                // Layer 1: Hot Lavender backplate (rotated -5 degrees)
                Transform.rotate(
                  angle: -5.0 * math.pi / 180,
                  child: Container(
                    width: 104.0,
                    height: 104.0,
                    decoration: BoxDecoration(
                      color: AppColors.nbLavender,
                      border: Border.all(
                        color: AppColors.nbBlack,
                        width: AppTheme.borderMedium,
                      ),
                      boxShadow: const [
                        BoxShadow(
                          color: AppColors.nbBlack,
                          offset: Offset(2.5, 2.5),
                          blurRadius: 0,
                        ),
                      ],
                    ),
                  ),
                ),

                // Layer 2: Mint Green backplate (rotated +5 degrees)
                Transform.rotate(
                  angle: 5.0 * math.pi / 180,
                  child: Container(
                    width: 104.0,
                    height: 104.0,
                    decoration: BoxDecoration(
                      color: AppColors.nbGreen,
                      border: Border.all(
                        color: AppColors.nbBlack,
                        width: AppTheme.borderMedium,
                      ),
                      boxShadow: const [
                        BoxShadow(
                          color: AppColors.nbBlack,
                          offset: Offset(3, 3),
                          blurRadius: 0,
                        ),
                      ],
                    ),
                  ),
                ),

                // Layer 3: Sky Blue front tile with 6px solid hard shadow
                Container(
                  width: 104.0,
                  height: 104.0,
                  decoration: BoxDecoration(
                    color: AppColors.nbBlue,
                    border: Border.all(
                      color: AppColors.nbBlack,
                      width: AppTheme.borderMedium,
                    ),
                    boxShadow: const [
                      BoxShadow(
                        color: AppColors.nbBlack,
                        offset: Offset(6, 6),
                        blurRadius: 0,
                      ),
                    ],
                  ),
                  child: const Center(
                    child: StitchEbookIcon(size: 84.0),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// Title section with category pill and display typography.
  Widget _buildTitleSection() {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 9.0, vertical: 2.5),
          decoration: BoxDecoration(
            color: AppColors.nbPaper,
            border: Border.all(
              color: AppColors.nbBlack,
              width: AppTheme.borderDefault,
            ),
          ),
          child: Text(
            'PLATFORM LITERASI DIGITAL',
            style: AppTheme.dataMono(
              AppColors.nbBlack,
              fontSize: 11.0,
            ).copyWith(
              letterSpacing: 1.5,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),

        const SizedBox(height: 5.0),

        // Brand Title "BACA BUKU" (Syne ExtraBold 800, 38px)
        Text(
          'BACA BUKU',
          textAlign: TextAlign.center,
          style: TextStyle(
            fontFamily: AppTheme.fontDisplay,
            fontSize: 38.0,
            fontWeight: FontWeight.w800,
            fontVariations: const <FontVariation>[FontVariation('wght', 800)],
            height: 1.1,
            letterSpacing: -1.0,
            color: AppColors.nbBlack,
          ),
        ),
      ],
    );
  }

  /// Subtitle banner container in signature yellow with hard offset shadow.
  Widget _buildSubtitleBanner() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 6.0),
      decoration: AppTheme.brutalBox(
        color: AppColors.nbYellow,
        borderColor: AppColors.nbBlack,
        borderWidth: AppTheme.borderDefault,
        shadowOffset: 3.0,
      ),
      child: Center(
        child: FittedBox(
          fit: BoxFit.scaleDown,
          child: Text(
            'PUSTAKA DIGITAL & PEMBACA E-BOOK INTERAKTIF',
            textAlign: TextAlign.center,
            style: AppTheme.dataMono(
              AppColors.nbBlack,
              fontSize: 11.5,
            ).copyWith(
              letterSpacing: -0.2,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
      ),
    );
  }

  /// Lower metadata row displaying app category and catalog status.
  Widget _buildMetaRow() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 6.0),
      decoration: BoxDecoration(
        color: AppColors.nbPaper,
        border: Border.all(
          color: AppColors.nbBlack,
          width: AppTheme.borderDefault,
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Left: Mini icon + "E-Commerce Ebook" (flexible with truncate)
          Expanded(
            child: Row(
              children: [
                Container(
                  width: 24.0,
                  height: 24.0,
                  decoration: AppTheme.brutalBox(
                    color: AppColors.nbYellow,
                    borderColor: AppColors.nbBlack,
                    borderWidth: AppTheme.borderDefault,
                    shadowOffset: 2.0,
                  ),
                  child: const Center(
                    child: SizedBox(
                      width: 14.0,
                      height: 14.0,
                      child: CustomPaint(
                        painter: OpenBookIconPainter(
                          strokeColor: AppColors.nbBlack,
                          strokeWidth: 2.2,
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8.0),
                Expanded(
                  child: Text(
                    'E-Commerce Ebook',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: AppTheme.dataMono(
                      AppColors.nbBlack,
                      fontSize: 12.0,
                    ).copyWith(
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8.0),

          // Right: "KATALOG READY" badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 2.0),
            decoration: BoxDecoration(
              color: AppColors.nbGreen,
              border: Border.all(
                color: AppColors.nbBlack,
                width: 1.5,
              ),
            ),
            child: Text(
              'KATALOG READY',
              style: AppTheme.dataMono(
                AppColors.nbBlack,
                fontSize: 11.0,
              ).copyWith(
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
