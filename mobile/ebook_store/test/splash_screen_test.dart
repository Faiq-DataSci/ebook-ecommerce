import 'package:ebook_store/features/splash/presentation/pages/splash_screen.dart';
import 'package:ebook_store/features/splash/presentation/widgets/splash_footer.dart';
import 'package:ebook_store/features/splash/presentation/widgets/splash_header.dart';
import 'package:ebook_store/features/splash/presentation/widgets/splash_hero_card.dart';
import 'package:ebook_store/features/splash/presentation/widgets/splash_painters.dart';
import 'package:ebook_store/main.dart';
import 'package:ebook_store/screens/home/home_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Splash Screen Mobile 390x884 - Google Stitch Fidelity Tests', () {
    testWidgets(
      'Renders all Google Stitch elements accurately at 390x884 resolution',
      (WidgetTester tester) async {
        tester.view.physicalSize = const Size(390, 884);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() {
          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        });

        await tester.pumpWidget(const MyApp(initialScreen: SplashScreen()));
        await tester.pump(); // Initial frame

        // 1. Header Verification
        expect(find.byType(SplashHeader), findsOneWidget);
        expect(find.text('[ OPEN BOOK ]'), findsOneWidget);
        expect(find.text('System-01'), findsOneWidget);

        // 2. Hero Card Verification
        expect(find.byType(SplashHeroCard), findsOneWidget);
        expect(find.text('SYS::LIBRARY'), findsOneWidget);
        expect(find.text('PLATFORM LITERASI DIGITAL'), findsOneWidget);
        expect(find.text('BACA BUKU'), findsOneWidget);
        expect(
          find.text('PUSTAKA DIGITAL & PEMBACA E-BOOK INTERAKTIF'),
          findsOneWidget,
        );
        expect(find.text('E-Commerce Ebook'), findsOneWidget);
        expect(find.text('KATALOG READY'), findsOneWidget);

        // Stitch Vector icon & Custom Painters
        expect(find.byType(StitchEbookIcon), findsOneWidget);

        // 3. Footer Verification
        expect(find.byType(SplashFooter), findsOneWidget);
        expect(
          find.text('Memuat koleksi buku digital & pustaka...'),
          findsOneWidget,
        );
        expect(find.text('88%'), findsOneWidget);

        // 4 Customer-Centric Feature Pills (SPK SAW and DRM SAFE removed!)
        expect(find.text('EPUB · PDF'), findsOneWidget);
        expect(find.text('BACA OFFLINE'), findsOneWidget);
        expect(find.text('MARKA BUKU'), findsOneWidget);
        expect(find.text('SYNC OTOMATIS'), findsOneWidget);

        // Explicit verification: SPK SAW and DRM SAFE are completely removed
        expect(find.text('SPK SAW'), findsNothing);
        expect(find.text('DRM SAFE'), findsNothing);

        // CTA Button (Book icon, [ENTER], and version subline are removed!)
        expect(find.text('MULAI MEMBACA'), findsOneWidget);
        expect(find.text('[ENTER]'), findsNothing);
        expect(find.textContaining('BACA BUKU MOBILE // v2.4'), findsNothing);

        // Background Glyphs
        expect(find.text('✱'), findsAtLeastNWidgets(1));
        expect(find.text('✦'), findsAtLeastNWidgets(1));
        expect(find.text('★'), findsAtLeastNWidgets(1));
      },
    );

    testWidgets(
      'Responsive test: Renders without any render overflow on common mobile resolutions',
      (WidgetTester tester) async {
        final viewports = [
          const Size(390, 884), // Reference Stitch Viewport (iPhone 14/15)
          const Size(360, 800), // Standard Android Compact Viewport
          const Size(412, 915), // Large Android Viewport (Pixel 7/8)
        ];

        for (final size in viewports) {
          tester.view.physicalSize = size;
          tester.view.devicePixelRatio = 1.0;

          await tester.pumpWidget(const MyApp(initialScreen: SplashScreen()));
          await tester.pump();

          expect(tester.takeException(), isNull);
        }

        tester.view.resetPhysicalSize();
        tester.view.resetDevicePixelRatio();
      },
    );

    testWidgets(
      'Tapping MULAI MEMBACA button accelerates progress and triggers navigation to HomeScreen',
      (WidgetTester tester) async {
        tester.view.physicalSize = const Size(390, 884);
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() {
          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        });

        await tester.pumpWidget(const MyApp(initialScreen: SplashScreen()));
        await tester.pump();

        // Tap the accelerate button repeatedly to reach 100%
        final buttonFinder = find.text('MULAI MEMBACA');
        expect(buttonFinder, findsOneWidget);

        for (int i = 0; i < 3; i++) {
          await tester.tap(buttonFinder);
          await tester.pump();
        }

        // Verify progress is 100% SIAP and button updates state
        expect(find.text('100% SIAP'), findsOneWidget);
        expect(find.text('MEMBUKA KATALOG PUSTAKA...'), findsOneWidget);

        // Fast forward timers to complete transition
        await tester.pump(const Duration(milliseconds: 400));
        await tester.pump(const Duration(milliseconds: 400));

        // Verifies smooth navigation to HomeScreen
        expect(find.byType(HomeScreen), findsOneWidget);
        expect(find.text('BUKUKITA'), findsOneWidget);
      },
    );
  });
}
