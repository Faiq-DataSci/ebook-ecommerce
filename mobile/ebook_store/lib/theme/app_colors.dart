import 'package:flutter/material.dart';

/// Neubrutalism color tokens extracted from Google Stitch
/// (`Sistem Informasi Ecomerce E-book` - `Beranda Mobile (Neubrutalism)`).
/// Strictly locked to the Stitch Light Mode Neubrutalist Newsprint palette.
class AppColors {
  AppColors._();

  // Stitch Neubrutalist Newsprint Palette (Light Mode)
  static const Color nbPaper = Color(0xFFFFFDF5);
  static const Color nbWhite = Color(0xFFFFFFFF);
  static const Color nbBlack = Color(0xFF000000);
  static const Color nbYellow = Color(0xFFFFD23F);
  static const Color nbLavender = Color(0xFFB8A9FA);
  static const Color nbPink = Color(0xFFFF6B6B);
  static const Color nbBlue = Color(0xFF74B9FF);
  static const Color nbGreen = Color(0xFF88D498);
  static const Color nbOrange = Color(0xFFFFA552);
  static const Color nbMuted = Color(0xFFE8E4D8);
  static const Color nbTextMuted = Color(0xFF3D3D3D);
  static const Color nbDisabledText = Color(0xFF5A5A5A);
  static const Color nbFocus = Color(0xFF1D4ED8);

  // Additional Stitch surface & brand tokens
  static const Color primary = Color(0xFF745C00);
  static const Color onPrimary = Color(0xFFFFFFFF);
  static const Color onSurface = Color(0xFF1B1C17);
  static const Color surfaceContainer = Color(0xFFF0EEE6);
}

/// Resolved palette for `Beranda Mobile (Neubrutalism)`.
/// Locked to the original Stitch Light Mode Newsprint palette (`#FFFDF5`).
class NbPalette {
  final bool isDark;

  const NbPalette({this.isDark = false});

  Color get background => AppColors.nbPaper;
  Color get surface => AppColors.nbWhite;
  Color get secondarySurface => AppColors.nbPaper;
  Color get mutedSurface => AppColors.nbMuted;
  Color get coverPlaceholder => AppColors.surfaceContainer;

  Color get ink => AppColors.nbBlack;
  Color get textPrimary => AppColors.nbBlack;
  Color get textMuted => AppColors.nbTextMuted;
  Color get textDisabled => AppColors.nbDisabledText;
  Color get onAccent => AppColors.nbBlack;

  Color get yellow => AppColors.nbYellow;
  Color get lavender => AppColors.nbLavender;
  Color get pink => AppColors.nbPink;
  Color get blue => AppColors.nbBlue;
  Color get green => AppColors.nbGreen;
  Color get orange => AppColors.nbOrange;
  Color get focus => AppColors.nbFocus;
}
