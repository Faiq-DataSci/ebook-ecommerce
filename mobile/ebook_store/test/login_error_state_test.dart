import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ebook_store/features/auth/data/datasources/auth_local_datasource.dart';
import 'package:ebook_store/features/auth/data/datasources/auth_remote_datasource.dart';
import 'package:ebook_store/features/auth/domain/entities/user_entity.dart';
import 'package:ebook_store/features/auth/presentation/pages/login_screen.dart';
import 'package:ebook_store/features/auth/presentation/providers/auth_provider.dart';
import 'package:ebook_store/features/auth/presentation/widgets/login_compliance_panel.dart';
import 'package:ebook_store/features/auth/presentation/widgets/login_error_hero_zone_a.dart';
import 'package:ebook_store/features/auth/presentation/widgets/login_form_zone_c.dart';
import 'package:ebook_store/features/auth/presentation/widgets/login_nav_bar.dart';
import 'package:ebook_store/features/home/presentation/pages/home_screen.dart';

Widget _buildTestableLoginScreen({
  VoidCallback? onClose,
  VoidCallback? onNavigateToRegister,
  ValueChanged<UserEntity>? onLoginSuccess,
  Size screenSize = const Size(390, 884),
}) {
  return ProviderScope(
    overrides: [
      authRemoteDataSourceProvider.overrideWithValue(
        AuthRemoteDataSourceImpl(dio: Dio(), enableLiveApi: false),
      ),
      authLocalDataSourceProvider.overrideWithValue(
        InMemoryAuthLocalDataSource(),
      ),
    ],
    child: MaterialApp(
      home: MediaQuery(
        data: MediaQueryData(
          size: screenSize,
          padding: const EdgeInsets.only(top: 44, bottom: 34),
        ),
        child: LoginScreen(
          onClose: onClose,
          onNavigateToRegister: onNavigateToRegister,
          onLoginSuccess: onLoginSuccess,
        ),
      ),
    ),
  );
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Login Mobile Error State (Zona A/C) - Google Stitch Neubrutalism Tests', () {
    testWidgets('Renders all Stitch Error State visual elements at 390x884',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(390, 884));
      await tester.pumpWidget(_buildTestableLoginScreen());
      await tester.pumpAndSettle();

      // Trigger Invalid Credentials Error
      final emailInput = find.widgetWithText(TextField, 'nama@email.com');
      final passwordInput = find.widgetWithText(TextField, '••••••••');
      await tester.enterText(emailInput, 'budi.santoso@email.com');
      await tester.enterText(passwordInput, 'SalahSandi123');

      final submitBtn = find.text('MASUK SEKARANG');
      await tester.ensureVisible(submitBtn);
      await tester.tap(submitBtn);
      await tester.pump(const Duration(milliseconds: 400));
      await tester.pumpAndSettle();

      // 1. Top Navigation & Audit Header in Error State
      expect(find.byType(LoginNavBar), findsOneWidget);
      expect(find.text('KEMBALI KE BERANDA'), findsOneWidget);
      expect(find.text('KODE #ERR-401'), findsOneWidget);

      // 2. Zona A: Error Banner (Expressive Neubrutalist)
      expect(find.byType(LoginErrorHeroZoneA), findsOneWidget);
      expect(find.text('GAGAL MASUK'), findsOneWidget);
      expect(find.text('PERINGATAN KEAMANAN'), findsOneWidget);
      expect(
        find.descendant(
          of: find.byType(LoginErrorHeroZoneA),
          matching: find.text(
              'Email atau kata sandi tidak cocok. Silakan periksa kembali kredensial Anda atau gunakan opsi pemulihan kata sandi.'),
        ),
        findsOneWidget,
      );

      // Failure Indicator Box
      expect(find.text('PERCOBAAN KEAMANAN:'), findsOneWidget);
      expect(find.text('1 / 5 GAGAL'), findsOneWidget);
      expect(
        find.text(
            'Akun akan diamankan otomatis selama 15 menit jika mencapai 5 kali kegagalan berturut-turut.'),
        findsOneWidget,
      );

      // 3. Zona C: Form Section with Preserved Email & Error Highlights
      expect(find.byType(LoginFormZoneC), findsOneWidget);
      expect(find.text('AUTENTIKASI PENGGUNA'), findsOneWidget);
      expect(find.text('ZONA-C'), findsOneWidget);

      // Preserved Email Field has FORMAT VALID badge
      expect(find.text('FORMAT VALID'), findsOneWidget);
      expect(find.text('budi.santoso@email.com'), findsOneWidget);

      // Password Header has LUPA KATA SANDI? quick button
      expect(find.text('LUPA KATA SANDI?'), findsOneWidget);

      // Direct Field-Level Error Alert
      expect(find.text('Kombinasi kata sandi tidak cocok untuk akun ini.'),
          findsOneWidget);

      // Dynamic Action Button: COBA MASUK LAGI
      expect(find.text('COBA MASUK LAGI'), findsOneWidget);

      // Secondary Action: PULIHKAN KATA SANDI
      expect(find.text('PULIHKAN KATA SANDI'), findsOneWidget);

      // 4. DRM & Security Compliance Panel
      expect(find.byType(LoginCompliancePanel), findsOneWidget);
      expect(
        find.text(
            'Demi melindungi integritas data akun dan keamanan sistem, kami membatasi percobaan masuk yang tidak sah.'),
        findsOneWidget,
      );

      // 5. Footer System Diagnostics / Audit Label
      expect(find.byType(LoginAuditFooter), findsOneWidget);
      expect(
        find.text(
            'AUTH ENGINE V2.4 // STATUS: FAILED_ATTEMPT_LOGGED\nTRACE_ID: #ERR-401-AUTH-09941 // IP: 182.1.24.90'),
        findsOneWidget,
      );
    });

    testWidgets('Increments failed attempts counter on consecutive failures',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(390, 884));
      await tester.pumpWidget(_buildTestableLoginScreen());
      await tester.pumpAndSettle();

      final emailInput = find.widgetWithText(TextField, 'nama@email.com');
      final passwordInput = find.widgetWithText(TextField, '••••••••');
      await tester.enterText(emailInput, 'budi.santoso@email.com');
      await tester.enterText(passwordInput, 'Salah1234');

      // Attempt 1
      final submitBtn = find.text('MASUK SEKARANG');
      await tester.ensureVisible(submitBtn);
      await tester.tap(submitBtn);
      await tester.pump(const Duration(milliseconds: 400));
      await tester.pumpAndSettle();
      expect(find.text('1 / 5 GAGAL'), findsOneWidget);

      // Attempt 2 (tap COBA MASUK LAGI)
      final retryBtn = find.text('COBA MASUK LAGI');
      await tester.ensureVisible(retryBtn);
      await tester.pumpAndSettle();
      await tester.tap(retryBtn);
      await tester.pump(const Duration(milliseconds: 400));
      await tester.pumpAndSettle();
      expect(find.text('2 / 5 GAGAL'), findsOneWidget);
    });

    testWidgets('Local Validation: Empty email does not send network request',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(390, 884));
      await tester.pumpWidget(_buildTestableLoginScreen());
      await tester.pumpAndSettle();

      final submitBtn = find.text('MASUK SEKARANG');
      await tester.ensureVisible(submitBtn);
      await tester.tap(submitBtn);
      await tester.pump();

      expect(find.text('Alamat email wajib diisi.'), findsOneWidget);
      expect(find.text('Kata sandi tidak boleh kosong.'), findsOneWidget);
    });

    testWidgets('Local Validation: Invalid email format preserved and highlighted',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(390, 884));
      await tester.pumpWidget(_buildTestableLoginScreen());
      await tester.pumpAndSettle();

      final emailInput = find.widgetWithText(TextField, 'nama@email.com');
      await tester.enterText(emailInput, 'budi-bukan-email');

      final submitBtn = find.text('MASUK SEKARANG');
      await tester.ensureVisible(submitBtn);
      await tester.tap(submitBtn);
      await tester.pump();

      expect(
        find.text('Format surel tidak valid (misal: nama@email.com).'),
        findsOneWidget,
      );
      // Preserved input
      expect(find.text('budi-bukan-email'), findsOneWidget);
    });

    testWidgets('Handles Network Error state (ERR-NET)',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(390, 884));
      await tester.pumpWidget(_buildTestableLoginScreen());
      await tester.pumpAndSettle();

      final emailInput = find.widgetWithText(TextField, 'nama@email.com');
      final passwordInput = find.widgetWithText(TextField, '••••••••');
      await tester.enterText(emailInput, 'network-error@test.com');
      await tester.enterText(passwordInput, 'password123');

      final submitBtn = find.text('MASUK SEKARANG');
      await tester.ensureVisible(submitBtn);
      await tester.tap(submitBtn);
      await tester.pump(const Duration(milliseconds: 400));
      await tester.pumpAndSettle();

      expect(find.text('KODE #ERR-NET'), findsOneWidget);
      expect(find.text('GANGGUAN JARINGAN'), findsOneWidget);
      expect(
        find.text(
            'Koneksi bermasalah. Periksa jaringan internet Anda dan coba kembali.'),
        findsWidgets,
      );
    });

    testWidgets('Handles Server Error state (ERR-500)',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(390, 884));
      await tester.pumpWidget(_buildTestableLoginScreen());
      await tester.pumpAndSettle();

      final emailInput = find.widgetWithText(TextField, 'nama@email.com');
      final passwordInput = find.widgetWithText(TextField, '••••••••');
      await tester.enterText(emailInput, 'server-error@test.com');
      await tester.enterText(passwordInput, 'password123');

      final submitBtn = find.text('MASUK SEKARANG');
      await tester.ensureVisible(submitBtn);
      await tester.tap(submitBtn);
      await tester.pump(const Duration(milliseconds: 400));
      await tester.pumpAndSettle();

      expect(find.text('KODE #ERR-500'), findsOneWidget);
      expect(find.text('KESALAHAN SERVER'), findsWidgets);
      expect(
        find.text(
            'Layanan sedang mengalami gangguan. Silakan coba kembali beberapa saat lagi.'),
        findsWidgets,
      );
    });

    testWidgets('User editing input clears field errors',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(390, 884));
      await tester.pumpWidget(_buildTestableLoginScreen());
      await tester.pumpAndSettle();

      final submitBtn = find.text('MASUK SEKARANG');
      await tester.ensureVisible(submitBtn);
      await tester.tap(submitBtn);
      await tester.pump();

      expect(find.text('Alamat email wajib diisi.'), findsOneWidget);

      final emailInput = find.widgetWithText(TextField, 'nama@email.com');
      await tester.enterText(emailInput, 'b');
      await tester.pump();

      expect(find.text('Alamat email wajib diisi.'), findsNothing);
    });

    testWidgets('Successful login after error state navigates to HomeScreen',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(390, 884));
      await tester.pumpWidget(_buildTestableLoginScreen());
      await tester.pumpAndSettle();

      // Trigger error first
      final emailInput = find.widgetWithText(TextField, 'nama@email.com');
      final passwordInput = find.widgetWithText(TextField, '••••••••');
      await tester.enterText(emailInput, 'salah@email.com');
      await tester.enterText(passwordInput, 'salahsandi123');

      final submitBtn = find.text('MASUK SEKARANG');
      await tester.ensureVisible(submitBtn);
      await tester.tap(submitBtn);
      await tester.pump(const Duration(milliseconds: 400));
      await tester.pumpAndSettle();
      expect(find.text('COBA MASUK LAGI'), findsOneWidget);

      // Now autofill valid demo customer credentials
      final demoBtn = find.text('Demo Pelanggan');
      await tester.ensureVisible(demoBtn);
      await tester.pumpAndSettle();
      await tester.tap(demoBtn);
      await tester.pumpAndSettle();

      final retryBtn = find.text('COBA MASUK LAGI');
      await tester.ensureVisible(retryBtn);
      await tester.pumpAndSettle();
      await tester.tap(retryBtn);
      await tester.pump(const Duration(milliseconds: 400));
      await tester.pumpAndSettle();

      expect(find.byType(HomeScreen), findsOneWidget);
    });
  });

  group('Login Mobile Error State - Responsive Viewport Tests (Zero Overflows)', () {
    const viewports = [
      Size(360, 800), // Android compact
      Size(390, 884), // Stitch reference
      Size(412, 915), // Android large
    ];

    for (final size in viewports) {
      testWidgets('Renders error state without overflow on ${size.width}x${size.height}',
          (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(size);
        await tester.pumpWidget(_buildTestableLoginScreen(screenSize: size));
        await tester.pumpAndSettle();

        // Trigger error
        final emailInput = find.widgetWithText(TextField, 'nama@email.com');
        final passwordInput = find.widgetWithText(TextField, '••••••••');
        await tester.enterText(emailInput, 'budi.santoso@email.com');
        await tester.enterText(passwordInput, 'SalahSandi123');

        final submitBtn = find.text('MASUK SEKARANG');
        await tester.ensureVisible(submitBtn);
        await tester.tap(submitBtn);
        await tester.pump(const Duration(milliseconds: 400));
        await tester.pumpAndSettle();

        expect(find.byType(LoginScreen), findsOneWidget);
        expect(tester.takeException(), isNull);
      });
    }
  });
}
