import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ebook_store/features/auth/data/datasources/auth_local_datasource.dart';
import 'package:ebook_store/features/auth/data/datasources/auth_remote_datasource.dart';
import 'package:ebook_store/features/auth/domain/entities/user_entity.dart';
import 'package:ebook_store/features/auth/presentation/pages/register_screen.dart';
import 'package:ebook_store/features/auth/presentation/providers/auth_provider.dart';
import 'package:ebook_store/features/auth/presentation/widgets/login_error_banner.dart';
import 'package:ebook_store/features/auth/presentation/widgets/register_form_zone_c.dart';
import 'package:ebook_store/features/auth/presentation/widgets/register_hero_zone_a.dart';
import 'package:ebook_store/features/auth/presentation/widgets/register_nav_bar.dart';
import 'package:ebook_store/features/auth/presentation/widgets/register_success_dialog.dart';
import 'package:ebook_store/features/home/presentation/pages/home_screen.dart';

Widget _buildTestableRegisterScreen({
  VoidCallback? onBack,
  VoidCallback? onNavigateToLogin,
  ValueChanged<UserEntity>? onRegisterSuccess,
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
        child: RegisterScreen(
          onBack: onBack,
          onNavigateToLogin: onNavigateToLogin,
          onRegisterSuccess: onRegisterSuccess,
        ),
      ),
    ),
  );
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Registrasi Mobile (Zona A/C) - Google Stitch Neubrutalism Tests', () {
    testWidgets('Renders all Stitch visual elements accurately at 390x884', (
      WidgetTester tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(390, 884));
      await tester.pumpWidget(_buildTestableRegisterScreen());
      await tester.pumpAndSettle();

      // 1. Navigation Status Bar
      expect(find.byType(RegisterNavBar), findsOneWidget);
      expect(find.byIcon(Icons.arrow_back), findsOneWidget);
      expect(find.text('AKUN PELANGGAN'), findsOneWidget);

      // 2. Zona A: Hero Banner Neubrutalist
      expect(find.byType(RegisterHeroZoneA), findsOneWidget);
      expect(find.text('BUAT LISENSI PEMBACA'), findsOneWidget);
      expect(find.text('DAFTAR AKUN'), findsOneWidget);
      expect(find.text('SYS.REG_v2.4'), findsOneWidget);

      // 3. Zona C: Form Registrasi Presisi
      expect(find.byType(RegisterFormZoneC), findsOneWidget);
      expect(find.text('DATA IDENTITAS PENGGUNA'), findsOneWidget);

      // 4 Input fields & Mono Tags
      expect(find.text('ID.NAME'), findsOneWidget);
      expect(find.text('AUTH.EMAIL'), findsOneWidget);
      expect(find.text('AUTH.KEY'), findsOneWidget);
      expect(find.text('VERIFIKASI'), findsOneWidget);

      // Placeholders
      expect(find.text('Contoh: Raden Saleh'), findsOneWidget);
      expect(find.text('budi.santoso@email.com'), findsOneWidget);

      // Password strength meter
      expect(find.text('TINGKAT KEKUATAN:'), findsOneWidget);
      expect(find.text('KOSONG'), findsOneWidget);
      expect(
        find.text('Minimal 8 karakter, kombinasi huruf & angka'),
        findsOneWidget,
      );

      // Neubrutalist Agreement Checkbox
      expect(
        find.text(
          'Saya menyetujui Syarat Lisensi E-Book & Kebijakan Privasi',
          findRichText: true,
        ),
        findsOneWidget,
      );

      // Primary Button
      expect(find.text('BUAT AKUN SEKARANG'), findsOneWidget);

      // Footer Navigation
      expect(find.text('Sudah punya akun? '), findsOneWidget);
      expect(find.text('Masuk di sini'), findsOneWidget);
    });

    testWidgets('Header back button triggers onBack callback', (
      WidgetTester tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(390, 884));
      bool backTapped = false;

      await tester.pumpWidget(
        _buildTestableRegisterScreen(onBack: () => backTapped = true),
      );
      await tester.pumpAndSettle();

      await tester.tap(find.byIcon(Icons.arrow_back));
      expect(backTapped, isTrue);
    });

    testWidgets('Toggles password & confirm password visibility', (
      WidgetTester tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(390, 884));
      await tester.pumpWidget(_buildTestableRegisterScreen());
      await tester.pumpAndSettle();

      final visibilityButtons = find.byIcon(Icons.visibility);
      expect(visibilityButtons, findsNWidgets(2));

      // Scroll to first visibility button and tap
      await tester.ensureVisible(visibilityButtons.first);
      await tester.tap(visibilityButtons.first);
      await tester.pump();
      expect(find.byIcon(Icons.visibility_off), findsOneWidget);

      // Scroll to second visibility button and tap
      final secondVisBtn = find.byIcon(Icons.visibility);
      await tester.ensureVisible(secondVisBtn);
      await tester.tap(secondVisBtn);
      await tester.pump();
      expect(find.byIcon(Icons.visibility_off), findsNWidgets(2));
    });

    testWidgets('Dynamically updates password strength meter', (
      WidgetTester tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(390, 884));
      await tester.pumpWidget(_buildTestableRegisterScreen());
      await tester.pumpAndSettle();

      final passwordFields = find.byType(TextField);
      // Index 2 is password input
      final passwordInput = passwordFields.at(2);

      // Initial state
      expect(find.text('KOSONG'), findsOneWidget);

      // Weak
      await tester.enterText(passwordInput, '123456');
      await tester.pump();
      expect(find.text('LEMAH'), findsOneWidget);

      // Medium
      await tester.enterText(passwordInput, 'abcdef12');
      await tester.pump();
      expect(find.text('SEDANG'), findsOneWidget);

      // Strong
      await tester.enterText(passwordInput, 'Abcdef12');
      await tester.pump();
      expect(find.text('KUAT'), findsOneWidget);

      // Very Strong
      await tester.enterText(passwordInput, 'Abcdef12!@#');
      await tester.pump();
      expect(find.text('SANGAT KUAT'), findsOneWidget);
    });

    testWidgets('Displays mismatch warning when confirm password differs', (
      WidgetTester tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(390, 884));
      await tester.pumpWidget(_buildTestableRegisterScreen());
      await tester.pumpAndSettle();

      final passwordFields = find.byType(TextField);
      final passwordInput = passwordFields.at(2);
      final confirmPasswordInput = passwordFields.at(3);

      await tester.enterText(passwordInput, 'password123');
      await tester.enterText(confirmPasswordInput, 'password999');
      await tester.pump();

      // Expect mismatch warning
      expect(find.text('Kata sandi belum sama persis.'), findsOneWidget);
      expect(find.byIcon(Icons.close), findsOneWidget);

      // Fix confirm password to match
      await tester.enterText(confirmPasswordInput, 'password123');
      await tester.pump();

      expect(find.text('Kata sandi belum sama persis.'), findsNothing);
      expect(find.byIcon(Icons.check), findsOneWidget);
    });

    testWidgets('Shows error banner when submitting with empty fields', (
      WidgetTester tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(390, 884));
      await tester.pumpWidget(_buildTestableRegisterScreen());
      await tester.pumpAndSettle();

      final submitBtn = find.text('BUAT AKUN SEKARANG');
      await tester.ensureVisible(submitBtn);
      await tester.tap(submitBtn);
      await tester.pumpAndSettle();

      expect(find.byType(LoginErrorBanner), findsOneWidget);
      expect(find.text('Nama lengkap wajib diisi.'), findsOneWidget);
    });

    testWidgets('Shows error banner when submitting with invalid email', (
      WidgetTester tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(390, 884));
      await tester.pumpWidget(_buildTestableRegisterScreen());
      await tester.pumpAndSettle();

      final textFields = find.byType(TextField);
      await tester.enterText(textFields.at(0), 'Ahmad Customer');
      await tester.enterText(textFields.at(1), 'notanemail');
      await tester.enterText(textFields.at(2), 'password123');
      await tester.enterText(textFields.at(3), 'password123');

      final submitBtn = find.text('BUAT AKUN SEKARANG');
      await tester.ensureVisible(submitBtn);
      await tester.tap(submitBtn);
      await tester.pumpAndSettle();

      expect(find.byType(LoginErrorBanner), findsOneWidget);
      expect(find.text('Format alamat email tidak valid.'), findsOneWidget);
    });

    testWidgets('Shows error banner when agreement checkbox is not checked', (
      WidgetTester tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(390, 884));
      await tester.pumpWidget(_buildTestableRegisterScreen());
      await tester.pumpAndSettle();

      final textFields = find.byType(TextField);
      await tester.enterText(textFields.at(0), 'Ahmad Customer');
      await tester.enterText(textFields.at(1), 'ahmad@example.com');
      await tester.enterText(textFields.at(2), 'password123');
      await tester.enterText(textFields.at(3), 'password123');

      // Do NOT check agreement checkbox
      final submitBtn = find.text('BUAT AKUN SEKARANG');
      await tester.ensureVisible(submitBtn);
      await tester.tap(submitBtn);
      await tester.pumpAndSettle();

      expect(find.byType(LoginErrorBanner), findsOneWidget);
      expect(
        find.text(
          'Harap setujui Syarat Lisensi E-Book & Kebijakan Privasi untuk melanjutkan.',
        ),
        findsOneWidget,
      );
    });

    testWidgets('Shows error banner when email is already registered', (
      WidgetTester tester,
    ) async {
      await tester.binding.setSurfaceSize(const Size(390, 884));
      await tester.pumpWidget(_buildTestableRegisterScreen());
      await tester.pumpAndSettle();

      final textFields = find.byType(TextField);
      await tester.enterText(textFields.at(0), 'Customer Lama');
      // Using known registered email in simulation
      await tester.enterText(textFields.at(1), 'pelanggan@ebookstore.com');
      await tester.enterText(textFields.at(2), 'password123');
      await tester.enterText(textFields.at(3), 'password123');

      // Check agreement
      final agreeText = find.text(
        'Saya menyetujui Syarat Lisensi E-Book & Kebijakan Privasi',
        findRichText: true,
      );
      await tester.ensureVisible(agreeText);
      await tester.tap(agreeText);
      await tester.pump();

      final submitBtn = find.text('BUAT AKUN SEKARANG');
      await tester.ensureVisible(submitBtn);
      await tester.tap(submitBtn);
      await tester.pump(const Duration(milliseconds: 400));
      await tester.pumpAndSettle();

      expect(find.byType(LoginErrorBanner), findsOneWidget);
      expect(find.text('EMAIL SUDAH TERDAFTAR'), findsOneWidget);
    });

    testWidgets(
      'Successful registration shows Success Dialog and navigates to HomeScreen',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));
        await tester.pumpWidget(_buildTestableRegisterScreen());
        await tester.pumpAndSettle();

        final textFields = find.byType(TextField);
        await tester.enterText(textFields.at(0), 'Dewi Sartika');
        await tester.enterText(textFields.at(1), 'dewi.sartika@example.com');
        await tester.enterText(textFields.at(2), 'password123');
        await tester.enterText(textFields.at(3), 'password123');

        // Check agreement
        final agreeText = find.text(
          'Saya menyetujui Syarat Lisensi E-Book & Kebijakan Privasi',
          findRichText: true,
        );
        await tester.ensureVisible(agreeText);
        await tester.tap(agreeText);
        await tester.pump();

        // Submit
        final submitBtn = find.text('BUAT AKUN SEKARANG');
        await tester.ensureVisible(submitBtn);
        await tester.tap(submitBtn);
        await tester.pump(const Duration(milliseconds: 50));
        await tester.pump(const Duration(milliseconds: 400));
        await tester.pumpAndSettle();

        // Success Dialog appears
        expect(find.byType(RegisterSuccessDialog), findsOneWidget);
        expect(find.text('REGISTRASI BERHASIL'), findsOneWidget);
        expect(find.text('LISENSI AKTIF!'), findsOneWidget);
        expect(find.text('LANJUTKAN KE KATALOG'), findsOneWidget);

        // Tap LANJUTKAN KE KATALOG
        await tester.tap(find.text('LANJUTKAN KE KATALOG'));
        await tester.pump(const Duration(milliseconds: 400));
        await tester.pumpAndSettle();

        // Navigated to HomeScreen
        expect(find.byType(HomeScreen), findsOneWidget);
      },
    );
  });

  group('Registrasi Mobile - Responsive Viewport Tests (Zero Overflows)', () {
    const viewports = [
      Size(360, 800), // Android compact
      Size(390, 884), // Stitch reference
      Size(412, 915), // Android large
    ];

    for (final size in viewports) {
      testWidgets('Renders without overflow on ${size.width}x${size.height}', (
        WidgetTester tester,
      ) async {
        await tester.binding.setSurfaceSize(size);
        await tester.pumpWidget(_buildTestableRegisterScreen(screenSize: size));
        await tester.pumpAndSettle();

        expect(find.byType(RegisterScreen), findsOneWidget);
        expect(tester.takeException(), isNull);
      });
    }
  });
}
