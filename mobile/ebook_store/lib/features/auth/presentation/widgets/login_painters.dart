import 'package:flutter/material.dart';

/// Neubrutalism background painter drawing a 24x24px geometric grid
/// matching Stitch CSS `.nb-grid-bg`.
class LoginGridPainter extends CustomPainter {
  final double cellSize;
  final Color lineColor;
  final double strokeWidth;

  const LoginGridPainter({
    this.cellSize = 24.0,
    this.lineColor = const Color(0x0E000000), // rgba(0, 0, 0, 0.055)
    this.strokeWidth = 1.0,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = lineColor
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke;

    // Draw vertical lines
    for (double x = 0; x <= size.width; x += cellSize) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }

    // Draw horizontal lines
    for (double y = 0; y <= size.height; y += cellSize) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(covariant LoginGridPainter oldDelegate) {
    return oldDelegate.cellSize != cellSize ||
        oldDelegate.lineColor != lineColor ||
        oldDelegate.strokeWidth != strokeWidth;
  }
}
