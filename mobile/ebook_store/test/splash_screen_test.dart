import 'package:ebook_store/features/splash/presentation/pages/splash_screen.dart';
import 'package:ebook_store/features/splash/presentation/widgets/splash_footer.dart';
import 'package:ebook_store/features/splash/presentation/widgets/splash_header.dart';
import 'package:ebook_store/features/splash/presentation/widgets/splash_hero_card.dart';
import 'package:ebook_store/main.dart';
import 'package:ebook_store/features/home/presentation/pages/home_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  group(
    'Splash Screen Mobile 390x884 - Google Stitch Fidelity & Auto-Boot Tests',
    () {
      testWidgets(
        'Renders all Google Stitch elements accurately at 390x884 resolution',
        (WidgetTester tester) async {
          tester.view.physicalSize = const Size(390, 884);
          tester.view.devicePixelRatio = 1.0;
          addTearDown(() {
            tester.view.resetPhysicalSize();
            tester.view.resetDevicePixelRatio();
          });

          await tester.pumpWidget(
            const MyApp(initialScreen: SplashScreen(autoNavigate: false)),
          );
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

          // App logo image inside hero card stage
          expect(find.byType(Image), findsOneWidget);

          // 3. Footer Verification
          expect(find.byType(SplashFooter), findsOneWidget);

          // 4 Customer-Centric Feature Pills (SPK SAW and DRM SAFE removed!)
          expect(find.text('PDF'), findsOneWidget);
          expect(find.text('BACA OFFLINE'), findsOneWidget);
          expect(find.text('MARKA BUKU'), findsOneWidget);
          expect(find.text('SYNC OTOMATIS'), findsOneWidget);

          // Explicit verification: SPK SAW and DRM SAFE are completely removed
          expect(find.text('SPK SAW'), findsNothing);
          expect(find.text('DRM SAFE'), findsNothing);

          // Manual button removed per user request (automated loading replaces it)
          expect(find.text('MULAI MEMBACA'), findsNothing);
          expect(find.text('MEMUAT APLIKASI...'), findsOneWidget);
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

            await tester.pumpWidget(
              const MyApp(initialScreen: SplashScreen(autoNavigate: false)),
            );
            await tester.pump();

            expect(tester.takeException(), isNull);
          }

          tester.view.resetPhysicalSize();
          tester.view.resetDevicePixelRatio();
        },
      );

      testWidgets(
        'Automatically boots application, steps progress, and navigates to HomeScreen without requiring clicks',
        (WidgetTester tester) async {
          tester.view.physicalSize = const Size(390, 884);
          tester.view.devicePixelRatio = 1.0;
          addTearDown(() {
            tester.view.resetPhysicalSize();
            tester.view.resetDevicePixelRatio();
          });

          await tester.pumpWidget(
            const MyApp(
              initialScreen: SplashScreen(
                totalDuration: Duration(milliseconds: 300),
              ),
            ),
          );
          await tester.pump();

          // Initial loading status
          expect(find.text('MEMUAT APLIKASI...'), findsOneWidget);
          expect(find.text('MULAI MEMBACA'), findsNothing);

          // Advance timers to complete automated loading sequence
          await tester.pump(const Duration(milliseconds: 350));
          await tester.pump(const Duration(milliseconds: 350));
          await tester.pump(const Duration(milliseconds: 350));

          // Verifies smooth automated navigation to HomeScreen
          expect(find.byType(HomeScreen), findsOneWidget);
          expect(find.text('BUKUKITA'), findsOneWidget);
        },
      );
    },
  );
}
