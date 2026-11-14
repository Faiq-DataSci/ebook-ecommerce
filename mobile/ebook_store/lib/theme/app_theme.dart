import 'package:flutter/material.dart';
import 'app_colors.dart';

/// Neubrutalism design system tokens: typography, borders, hard-offset shadows,
/// and spacing derived from Google Stitch (`Beranda Mobile (Neubrutalism)`).
class AppTheme {
  AppTheme._();

  // Bundled Google Stitch Font Families (registered in pubspec.yaml)
  static const String fontDisplay = 'Syne';
  static const String fontHeadline = 'Space Grotesk';
  static const String fontBody = 'Inter';
  static const String fontMono = 'Space Mono';

  static const List<String> _sansFallback = <String>[
    'Space Grotesk',
    'Inter',
    'Roboto',
    'Segoe UI',
    'sans-serif',
  ];

  static const List<String> _monoFallback = <String>[
    'Space Mono',
    'Consolas',
    'Courier New',
    'monospace',
  ];

  // Spacing tokens (4px modular grid rhythm)
  static const double spaceXs = 4.0;
  static const double spaceSm = 8.0;
  static const double spaceMd = 16.0;
  static const double spaceLg = 24.0;
  static const double spaceXl = 32.0;
  static const double marginMobile = 16.0;

  // Border thickness tokens
  static const double borderThin = 1.0;
  static const double borderDefault = 2.0;
  static const double borderMedium = 3.0;
  static const double borderThick = 4.0;

  // Hard-offset shadow builders (zero blur, +X/+Y directional offset)
  static List<BoxShadow> shadowXs(Color ink) => <BoxShadow>[
    BoxShadow(color: ink, offset: const Offset(1, 1), blurRadius: 0),
  ];

  static List<BoxShadow> shadowSm(Color ink) => <BoxShadow>[
    BoxShadow(color: ink, offset: const Offset(2, 2), blurRadius: 0),
  ];

  static List<BoxShadow> shadowMd(Color ink) => <BoxShadow>[
    BoxShadow(color: ink, offset: const Offset(3, 3), blurRadius: 0),
  ];

  static List<BoxShadow> shadowCard(Color ink) => <BoxShadow>[
    BoxShadow(color: ink, offset: const Offset(4, 4), blurRadius: 0),
  ];

  static List<BoxShadow> shadowHero(Color ink) => <BoxShadow>[
    BoxShadow(color: ink, offset: const Offset(5, 5), blurRadius: 0),
  ];

  static BoxDecoration brutalBox({
    required Color color,
    required Color borderColor,
    double borderWidth = borderDefault,
    double shadowOffset = 2.0,
  }) {
    return BoxDecoration(
      color: color,
      borderRadius: BorderRadius.zero,
      border: Border.all(color: borderColor, width: borderWidth),
      boxShadow: shadowOffset > 0
          ? <BoxShadow>[
              BoxShadow(
                color: borderColor,
                offset: Offset(shadowOffset, shadowOffset),
                blurRadius: 0,
              ),
            ]
          : const <BoxShadow>[],
    );
  }

  /// `font-display text-headline-sm tracking-tight text-nb-black uppercase`
  /// (`Syne` ExtraBold 800, 20px, lineHeight 25px)
  static TextStyle brandTitle(Color color) => TextStyle(
    fontFamily: fontDisplay,
    fontFamilyFallback: _sansFallback,
    fontSize: 20,
    fontWeight: FontWeight.w800,
    fontVariations: const <FontVariation>[FontVariation('wght', 800)],
    height: 25 / 20,
    letterSpacing: -0.5,
    color: color,
  );

  /// `font-headline-lg-mobile` (`Space Grotesk` Bold 700, 28px, lineHeight 32px)
  static TextStyle headlineLgMobile(Color color) => TextStyle(
    fontFamily: fontHeadline,
    fontFamilyFallback: _sansFallback,
    fontSize: 28,
    fontWeight: FontWeight.w700,
    fontVariations: const <FontVariation>[FontVariation('wght', 700)],
    height: 30 / 28,
    letterSpacing: -0.5,
    color: color,
  );

  /// `font-headline-md-mobile` (`Space Grotesk` Bold 700, 22px, lineHeight 26px)
  static TextStyle headlineMdMobile(Color color) => TextStyle(
    fontFamily: fontHeadline,
    fontFamilyFallback: _sansFallback,
    fontSize: 22,
    fontWeight: FontWeight.w700,
    fontVariations: const <FontVariation>[FontVariation('wght', 700)],
    height: 26 / 22,
    letterSpacing: -0.4,
    color: color,
  );

  /// `font-headline-sm-mobile` (`Space Grotesk` Bold 700, 18px, lineHeight 22px)
  static TextStyle headlineSmMobile(Color color) => TextStyle(
    fontFamily: fontHeadline,
    fontFamilyFallback: _sansFallback,
    fontSize: 18,
    fontWeight: FontWeight.w700,
    fontVariations: const <FontVariation>[FontVariation('wght', 700)],
    height: 22 / 18,
    color: color,
  );

  /// `font-label-md` (`Space Grotesk` Bold 700, 14px, lineHeight 17px)
  static TextStyle labelMd(Color color) => TextStyle(
    fontFamily: fontHeadline,
    fontFamilyFallback: _sansFallback,
    fontSize: 14,
    fontWeight: FontWeight.w700,
    fontVariations: const <FontVariation>[FontVariation('wght', 700)],
    height: 17 / 14,
    color: color,
  );

  /// `font-label-sm` (`Space Grotesk` Bold 700, 12px default, lineHeight 14px)
  static TextStyle labelSm(Color color, {double fontSize = 12}) => TextStyle(
    fontFamily: fontHeadline,
    fontFamilyFallback: _sansFallback,
    fontSize: fontSize,
    fontWeight: FontWeight.w700,
    fontVariations: const <FontVariation>[FontVariation('wght', 700)],
    height: 1.2,
    color: color,
  );

  /// `font-body-md` (`Inter` Regular 400, 16px, lineHeight 25px)
  static TextStyle bodyMd(Color color) => TextStyle(
    fontFamily: fontBody,
    fontFamilyFallback: _sansFallback,
    fontSize: 16,
    fontWeight: FontWeight.w400,
    fontVariations: const <FontVariation>[FontVariation('wght', 400)],
    height: 25 / 16,
    color: color,
  );

  /// `font-body-sm` (`Inter` Regular 400, 14px default, lineHeight 20px)
  static TextStyle bodySm(Color color, {double fontSize = 14}) => TextStyle(
    fontFamily: fontBody,
    fontFamilyFallback: _sansFallback,
    fontSize: fontSize,
    fontWeight: FontWeight.w400,
    fontVariations: const <FontVariation>[FontVariation('wght', 400)],
    height: 1.38,
    color: color,
  );

  /// `font-data-mono` (`Space Mono` Bold 700, 14px default)
  static TextStyle dataMono(Color color, {double fontSize = 14}) => TextStyle(
    fontFamily: fontMono,
    fontFamilyFallback: _monoFallback,
    fontSize: fontSize,
    fontWeight: FontWeight.w700,
    height: 1.25,
    color: color,
  );

  static ThemeData buildTheme({bool isDark = false}) {
    const palette = NbPalette(isDark: false);
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: palette.background,
      fontFamily: fontBody,
      colorScheme: const ColorScheme.light(
        primary: AppColors.nbYellow,
        onPrimary: AppColors.nbBlack,
        secondary: AppColors.nbLavender,
        onSecondary: AppColors.nbBlack,
        error: AppColors.nbPink,
        onError: AppColors.nbBlack,
        surface: AppColors.nbWhite,
        onSurface: AppColors.nbBlack,
      ),
    );
  }
}
