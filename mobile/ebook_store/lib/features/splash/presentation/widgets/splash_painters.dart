import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';

/// Custom painter for the signature Stitch Neubrutalism background grid.
/// Draws 1px black grid lines with 32x32px cell spacing over the yellow background.
class BrutalistGridPainter extends CustomPainter {
  final double cellSize;
  final Color lineColor;
  final double strokeWidth;

  const BrutalistGridPainter({
    this.cellSize = 32.0,
    this.lineColor = AppColors.nbBlack,
    this.strokeWidth = 1.0,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = lineColor
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke;

    for (double x = 0; x <= size.width; x += cellSize) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = 0; y <= size.height; y += cellSize) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(covariant BrutalistGridPainter oldDelegate) {
    return oldDelegate.cellSize != cellSize ||
        oldDelegate.lineColor != lineColor ||
        oldDelegate.strokeWidth != strokeWidth;
  }
}

/// Custom painter for the inner card dotted/polka-dot pattern.
class BrutalistDotMatrixPainter extends CustomPainter {
  final double spacing;
  final double dotRadius;
  final Color dotColor;

  const BrutalistDotMatrixPainter({
    this.spacing = 14.0,
    this.dotRadius = 0.8,
    this.dotColor = AppColors.nbBlack,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = dotColor
      ..style = PaintingStyle.fill;

    for (double x = spacing / 2; x < size.width; x += spacing) {
      for (double y = spacing / 2; y < size.height; y += spacing) {
        canvas.drawCircle(Offset(x, y), dotRadius, paint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant BrutalistDotMatrixPainter oldDelegate) {
    return oldDelegate.spacing != spacing ||
        oldDelegate.dotRadius != dotRadius ||
        oldDelegate.dotColor != dotColor;
  }
}

/// Custom painter for animated or static diagonal barber-pole stripes.
class DiagonalStripesPainter extends CustomPainter {
  final Color stripeColor;
  final double stripeWidth;
  final double gap;
  final double animationOffset;

  const DiagonalStripesPainter({
    this.stripeColor = AppColors.nbBlack,
    this.stripeWidth = 3.0,
    this.gap = 6.0,
    this.animationOffset = 0.0,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = stripeColor
      ..strokeWidth = stripeWidth
      ..style = PaintingStyle.stroke;

    canvas.save();
    canvas.clipRect(Rect.fromLTWH(0, 0, size.width, size.height));

    final totalStep = stripeWidth + gap;
    final totalLength = size.width + size.height + totalStep * 2;
    final shift = (animationOffset * totalStep) % totalStep;

    for (double i = -size.height - totalStep + shift; i < totalLength; i += totalStep) {
      canvas.drawLine(
        Offset(i, 0),
        Offset(i + size.height, size.height),
        paint,
      );
    }

    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant DiagonalStripesPainter oldDelegate) {
    return oldDelegate.stripeColor != stripeColor ||
        oldDelegate.stripeWidth != stripeWidth ||
        oldDelegate.gap != gap ||
        oldDelegate.animationOffset != animationOffset;
  }
}

/// High-energy, pixel-perfect vector implementation of Google Stitch's
/// "BACA BUKU Digital E-Book Icon" (viewBox 0 0 64 64).
/// Completely free of restrictive DRM locks; replaced with a golden digital star seal.
class StitchEbookIconPainter extends CustomPainter {
  const StitchEbookIconPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final scaleX = size.width / 64.0;
    final scaleY = size.height / 64.0;

    canvas.save();
    canvas.scale(scaleX, scaleY);

    final linePaint = Paint()
      ..color = AppColors.nbBlack
      ..strokeWidth = 2.5
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.square
      ..strokeJoin = StrokeJoin.miter;

    // 1. Top radiating illumination rays (sunburst above book spine)
    canvas.drawLine(const Offset(32, 4), const Offset(32, 11), linePaint);
    canvas.drawLine(const Offset(21, 7), const Offset(25, 12.5), linePaint);
    canvas.drawLine(const Offset(43, 7), const Offset(39, 12.5), linePaint);

    // 2. Yellow outer book cover (hardcover rim)
    final coverPath = Path()
      ..moveTo(6, 21)
      ..lineTo(32, 25)
      ..lineTo(58, 21)
      ..lineTo(58, 52)
      ..lineTo(32, 57)
      ..lineTo(6, 52)
      ..close();

    final coverFill = Paint()
      ..color = AppColors.nbYellow
      ..style = PaintingStyle.fill;
    canvas.drawPath(coverPath, coverFill);
    canvas.drawPath(coverPath, linePaint);

    // 3. Left page
    final leftPagePath = Path()
      ..moveTo(9, 16)
      ..lineTo(32, 20.5)
      ..lineTo(32, 50.5)
      ..lineTo(9, 46.5)
      ..close();

    final pageFill = Paint()
      ..color = AppColors.nbPaper
      ..style = PaintingStyle.fill;
    canvas.drawPath(leftPagePath, pageFill);
    canvas.drawPath(leftPagePath, linePaint);

    // 4. Right page
    final rightPagePath = Path()
      ..moveTo(55, 16)
      ..lineTo(32, 20.5)
      ..lineTo(32, 50.5)
      ..lineTo(55, 46.5)
      ..close();

    canvas.drawPath(rightPagePath, pageFill);
    canvas.drawPath(rightPagePath, linePaint);

    // 5. Center spine dividing line
    canvas.drawLine(const Offset(32, 20.5), const Offset(32, 57), linePaint);

    // 6. Left page crisp horizontal reading lines
    canvas.drawLine(const Offset(14, 25), const Offset(27, 26.8), linePaint);
    canvas.drawLine(const Offset(14, 31), const Offset(27, 32.8), linePaint);
    canvas.drawLine(const Offset(14, 37), const Offset(27, 38.8), linePaint);
    canvas.drawLine(const Offset(14, 43), const Offset(24, 44.2), linePaint);

    // 7. Right page coral notched bookmark ribbon
    final ribbonPath = Path()
      ..moveTo(41, 18.5)
      ..lineTo(48.5, 17.2)
      ..lineTo(48.5, 35)
      ..lineTo(44.8, 31.5)
      ..lineTo(41, 35)
      ..close();

    final ribbonFill = Paint()
      ..color = AppColors.nbPink
      ..style = PaintingStyle.fill;
    canvas.drawPath(ribbonPath, ribbonFill);
    canvas.drawPath(ribbonPath, linePaint);

    // 8. Right page reading lines
    canvas.drawLine(const Offset(36, 39), const Offset(50, 36.5), linePaint);
    canvas.drawLine(const Offset(36, 44), const Offset(47, 42), linePaint);

    // 9. Digital Reader Quality Gold Star Seal (replaces restrictive DRM padlock)
    final sealPaint = Paint()
      ..color = AppColors.nbYellow
      ..style = PaintingStyle.fill;
    final sealBorder = Paint()
      ..color = AppColors.nbBlack
      ..strokeWidth = 1.8
      ..style = PaintingStyle.stroke;

    canvas.drawCircle(const Offset(46.0, 46.5), 4.5, sealPaint);
    canvas.drawCircle(const Offset(46.0, 46.5), 4.5, sealBorder);

    // Mini star center point
    final starPaint = Paint()
      ..color = AppColors.nbBlack
      ..style = PaintingStyle.fill;
    canvas.drawCircle(const Offset(46.0, 46.5), 1.6, starPaint);

    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

/// Standalone widget for the Stitch E-Book Icon.
class StitchEbookIcon extends StatelessWidget {
  final double size;

  const StitchEbookIcon({super.key, this.size = 84.0});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: const CustomPaint(
        painter: StitchEbookIconPainter(),
      ),
    );
  }
}

/// Vector painter for the Digital Commerce Shopping Bag badge (viewBox 0 0 24 24).
class CommerceBagPainter extends CustomPainter {
  final Color strokeColor;
  final Color fillColor;
  final double strokeWidth;

  const CommerceBagPainter({
    this.strokeColor = AppColors.nbBlack,
    this.fillColor = AppColors.nbPaper,
    this.strokeWidth = 2.5,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final scaleX = size.width / 24.0;
    final scaleY = size.height / 24.0;

    canvas.save();
    canvas.scale(scaleX, scaleY);

    final linePaint = Paint()
      ..color = strokeColor
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.square
      ..strokeJoin = StrokeJoin.miter;

    final bagPath = Path()
      ..moveTo(5, 8)
      ..lineTo(19, 8)
      ..lineTo(20, 20)
      ..lineTo(4, 20)
      ..close();

    final bagFill = Paint()
      ..color = fillColor
      ..style = PaintingStyle.fill;
    canvas.drawPath(bagPath, bagFill);
    canvas.drawPath(bagPath, linePaint);

    final handlePath = Path()
      ..moveTo(9, 8)
      ..lineTo(9, 6)
      ..arcTo(const Rect.fromLTWH(9, 3, 6, 6), math.pi, math.pi, false)
      ..lineTo(15, 8);
    canvas.drawPath(handlePath, linePaint);

    canvas.drawLine(const Offset(9, 13), const Offset(15, 13), linePaint);
    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant CommerceBagPainter oldDelegate) {
    return oldDelegate.strokeColor != strokeColor ||
        oldDelegate.fillColor != fillColor ||
        oldDelegate.strokeWidth != strokeWidth;
  }
}

/// Vector painter for the Open Book icon used in the action button and status badge.
class OpenBookIconPainter extends CustomPainter {
  final Color strokeColor;
  final double strokeWidth;

  const OpenBookIconPainter({
    this.strokeColor = AppColors.nbYellow,
    this.strokeWidth = 2.0,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final scaleX = size.width / 24.0;
    final scaleY = size.height / 24.0;

    canvas.save();
    canvas.scale(scaleX, scaleY);

    final linePaint = Paint()
      ..color = strokeColor
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.square
      ..strokeJoin = StrokeJoin.miter;

    final bookPath = Path()
      ..moveTo(2, 5)
      ..lineTo(2, 18)
      ..cubicTo(5, 18, 8, 19.2, 12, 21)
      ..cubicTo(16, 19.2, 19, 18, 22, 18)
      ..lineTo(22, 5)
      ..cubicTo(19, 5, 16, 6.2, 12, 8)
      ..cubicTo(8, 6.2, 5, 5, 2, 5)
      ..close();

    canvas.drawPath(bookPath, linePaint);
    canvas.drawLine(const Offset(12, 8), const Offset(12, 21), linePaint);
    canvas.restore();
  }

  @override
  bool shouldRepaint(covariant OpenBookIconPainter oldDelegate) {
    return oldDelegate.strokeColor != strokeColor ||
        oldDelegate.strokeWidth != strokeWidth;
  }
}
