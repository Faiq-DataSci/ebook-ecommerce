import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ebook_store/features/auth/data/datasources/auth_local_datasource.dart';
import 'package:ebook_store/features/auth/data/datasources/auth_remote_datasource.dart';
import 'package:ebook_store/features/auth/domain/entities/user_entity.dart';
import 'package:ebook_store/features/auth/presentation/pages/login_screen.dart';
import 'package:ebook_store/features/auth/presentation/providers/auth_provider.dart';
import 'package:ebook_store/features/auth/presentation/widgets/login_error_banner.dart';
import 'package:ebook_store/features/auth/presentation/widgets/login_footer.dart';
import 'package:ebook_store/features/auth/presentation/widgets/login_form_zone_c.dart';
import 'package:ebook_store/features/auth/presentation/widgets/login_hero_zone_a.dart';
import 'package:ebook_store/features/auth/presentation/widgets/login_nav_bar.dart';
import 'package:ebook_store/features/auth/presentation/widgets/login_register_card.dart';
import 'package:ebook_store/screens/home/home_screen.dart';

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

  group('Login Mobile (Zona A/C) - Google Stitch Neubrutalism Fidelity Tests', () {
    testWidgets('Renders all Stitch visual elements accurately at 390x884',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(390, 884));

      await tester.pumpWidget(_buildTestableLoginScreen());
      await tester.pumpAndSettle();

      // 1. Navigation status bar elements
      expect(find.byType(LoginNavBar), findsOneWidget);
      expect(find.text('✕'), findsOneWidget);
      expect(find.text('BACA BUKU'), findsOneWidget);
      expect(find.text('SECURE LOGIN'), findsOneWidget);

      // 2. Zona A: Expressive Hero Block
      expect(find.byType(LoginHeroZoneA), findsOneWidget);
      expect(find.text('PORTAL RESMI'), findsNothing);
      expect(find.text('★ E-BOOK'), findsNothing);
      expect(find.text('MASUK KE AKUN'), findsOneWidget);
      expect(
        find.text('Akses seluruh koleksi e-book & pustaka digital Anda.'),
        findsOneWidget,
      );

      // 3. Zona C: Formulir Login Container
      expect(find.byType(LoginFormZoneC), findsOneWidget);
      expect(find.text('ALAMAT EMAIL *'), findsOneWidget);
      expect(find.text('Kredensial'), findsOneWidget);
      expect(find.text('KATA SANDI *'), findsOneWidget);
      expect(find.text('MIN. 8 KARAKTER'), findsOneWidget);
      expect(find.text('nama@email.com'), findsOneWidget);
      expect(find.text('••••••••'), findsOneWidget);
      expect(find.text('LIHAT'), findsOneWidget);
      expect(find.text('Ingat Saya'), findsOneWidget);
      expect(find.text('Lupa Kata Sandi?'), findsOneWidget);
      expect(find.text('MASUK SEKARANG'), findsOneWidget);

      // 4. Kartu Ajakan Daftar Akun Baru
      expect(find.byType(LoginRegisterCard), findsOneWidget);
      expect(find.text('Belum memiliki akun?'), findsOneWidget);
      expect(find.text('KOLEKSI BUKU MENANTI ANDA'), findsOneWidget);
      expect(find.text('DAFTAR SEKARANG'), findsOneWidget);

      // 5. Footer Watermark Removed per User Request
      expect(find.byType(LoginFooter), findsOneWidget);
      expect(
        find.text('PRIVASI TERJAGA // E-COMMERCE E-BOOK // V2.4'),
        findsNothing,
      );

      // Ensure NO unauthorized third-party login buttons exist per instructions
      expect(find.text('Lanjutkan dengan Google'), findsNothing);
      expect(find.text('Login Facebook'), findsNothing);
      expect(find.text('Login Apple'), findsNothing);
    });

    testWidgets('Validates required and invalid inputs on submit',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(390, 884));
      await tester.pumpWidget(_buildTestableLoginScreen());
      await tester.pumpAndSettle();

      // Submit with empty fields
      await tester.tap(find.text('MASUK SEKARANG'));
      await tester.pump();

      // Should show error for email and password
      expect(find.text('Alamat email wajib diisi.'), findsOneWidget);
      expect(find.text('Kata sandi tidak boleh kosong.'), findsOneWidget);

      // Enter invalid email format
      final emailInput = find.widgetWithText(TextField, 'nama@email.com');
      await tester.enterText(emailInput, 'bukan-email');
      await tester.tap(find.text('MASUK SEKARANG'));
      await tester.pump();

      expect(
        find.text('Format surel tidak valid (misal: nama@email.com).'),
        findsOneWidget,
      );

      // Enter short password (< 8 chars)
      final passwordInput = find.widgetWithText(TextField, '••••••••');
      await tester.enterText(passwordInput, '123');
      await tester.tap(find.text('MASUK SEKARANG'));
      await tester.pump();

      expect(find.text('Kata sandi minimal 8 karakter.'), findsOneWidget);
    });

    testWidgets('Toggles password visibility with LIHAT / SEMBUNYI button',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(390, 884));
      await tester.pumpWidget(_buildTestableLoginScreen());
      await tester.pumpAndSettle();

      final passwordFieldFinder = find.widgetWithText(TextField, '••••••••');
      TextField passwordField = tester.widget<TextField>(passwordFieldFinder);
      expect(passwordField.obscureText, isTrue);
      expect(find.text('LIHAT'), findsOneWidget);

      // Tap LIHAT
      await tester.tap(find.text('LIHAT'));
      await tester.pump();

      passwordField = tester.widget<TextField>(passwordFieldFinder);
      expect(passwordField.obscureText, isFalse);
      expect(find.text('SEMBUNYI'), findsOneWidget);

      // Tap SEMBUNYI
      await tester.tap(find.text('SEMBUNYI'));
      await tester.pump();

      passwordField = tester.widget<TextField>(passwordFieldFinder);
      expect(passwordField.obscureText, isTrue);
      expect(find.text('LIHAT'), findsOneWidget);
    });

    testWidgets('Toggles Ingat Saya checkbox', (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(390, 884));
      await tester.pumpWidget(_buildTestableLoginScreen());
      await tester.pumpAndSettle();

      expect(find.text('✓'), findsNothing);

      await tester.tap(find.text('Ingat Saya'));
      await tester.pump();

      expect(find.text('✓'), findsOneWidget);

      await tester.tap(find.text('Ingat Saya'));
      await tester.pump();

      expect(find.text('✓'), findsNothing);
    });

    testWidgets('Autofills demo credentials and validates authentication flow',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(390, 884));

      UserEntity? authenticatedUser;
      await tester.pumpWidget(_buildTestableLoginScreen(
        onLoginSuccess: (user) => authenticatedUser = user,
      ));
      await tester.pumpAndSettle();

      // Tap Demo Pelanggan button
      await tester.tap(find.text('Demo Pelanggan'));
      await tester.pump();

      expect(find.text('pelanggan@ebookstore.com'), findsOneWidget);

      // Tap MASUK SEKARANG
      await tester.tap(find.text('MASUK SEKARANG'));
      await tester.pump(const Duration(milliseconds: 50));

      // In transit loading state
      expect(find.text('MEMVERIFIKASI...'), findsOneWidget);

      // Settle simulated network delay
      await tester.pump(const Duration(milliseconds: 400));
      await tester.pump(const Duration(milliseconds: 200));

      expect(authenticatedUser, isNotNull);
      expect(authenticatedUser?.email, 'pelanggan@ebookstore.com');
      expect(authenticatedUser?.role, UserRole.customer);
    });

    testWidgets('Displays dismissible error banner on invalid credentials',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(390, 884));
      await tester.pumpWidget(_buildTestableLoginScreen());
      await tester.pumpAndSettle();

      // Enter unknown email & password
      final emailInput = find.widgetWithText(TextField, 'nama@email.com');
      final passwordInput = find.widgetWithText(TextField, '••••••••');
      await tester.enterText(emailInput, 'salah@email.com');
      await tester.enterText(passwordInput, 'katasandi123');

      await tester.tap(find.text('MASUK SEKARANG'));
      await tester.pump(const Duration(milliseconds: 400));
      await tester.pumpAndSettle();

      // Expect error banner
      expect(find.byType(LoginErrorBanner), findsOneWidget);
      expect(find.text('KREDENSIAL BELUM TERDAFTAR'), findsOneWidget);

      // Tap close on error banner
      final dismissButton = find.descendant(
        of: find.byType(LoginErrorBanner),
        matching: find.text('✕'),
      );
      await tester.tap(dismissButton);
      await tester.pumpAndSettle();

      expect(find.byType(LoginErrorBanner), findsNothing);
    });

    testWidgets('Customer login navigates to HomeScreen',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(390, 884));
      await tester.pumpWidget(_buildTestableLoginScreen());
      await tester.pumpAndSettle();

      // Autofill customer
      await tester.tap(find.text('Demo Pelanggan'));
      await tester.pump();

      await tester.tap(find.text('MASUK SEKARANG'));
      await tester.pump(const Duration(milliseconds: 50));
      await tester.pump(const Duration(milliseconds: 400));
      await tester.pump(const Duration(milliseconds: 400));

      // Verifies navigation to HomeScreen
      expect(find.byType(HomeScreen), findsOneWidget);
    });

    testWidgets('Admin login opens administrator confirmation modal',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(390, 884));
      await tester.pumpWidget(_buildTestableLoginScreen());
      await tester.pumpAndSettle();

      // Autofill admin
      await tester.tap(find.text('Demo Admin'));
      await tester.pump();

      await tester.tap(find.text('MASUK SEKARANG'));
      await tester.pump(const Duration(milliseconds: 50));
      await tester.pump(const Duration(milliseconds: 400));
      await tester.pump(const Duration(milliseconds: 400));

      // Verifies Admin Dialog
      expect(find.text('ROLE: ADMIN'), findsOneWidget);
      expect(find.text('AKSES ADMIN DIKONFIRMASI'), findsOneWidget);
      expect(find.text('LANJUTKAN KE KATALOG'), findsOneWidget);

      await tester.tap(find.text('LANJUTKAN KE KATALOG'));
      await tester.pump(const Duration(milliseconds: 400));
      await tester.pump(const Duration(milliseconds: 400));

      expect(find.byType(HomeScreen), findsOneWidget);
    });
  });

  group('Login Mobile - Responsive Viewport Tests (Zero Overflows)', () {
    const viewports = [
      Size(360, 800), // Android compact
      Size(390, 884), // Stitch reference
      Size(412, 915), // Android large
    ];

    for (final size in viewports) {
      testWidgets('Renders without overflow on ${size.width}x${size.height}',
          (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(size);
        await tester.pumpWidget(_buildTestableLoginScreen(screenSize: size));
        await tester.pumpAndSettle();

        expect(find.byType(LoginScreen), findsOneWidget);
        expect(tester.takeException(), isNull);
      });
    }
  });
}
