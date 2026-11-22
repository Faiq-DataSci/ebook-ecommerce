import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../home/presentation/pages/home_screen.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../domain/entities/user_entity.dart';
import '../providers/auth_provider.dart';
import '../providers/auth_state.dart';
import '../widgets/login_compliance_panel.dart';
import '../widgets/login_error_banner.dart';
import '../widgets/login_error_hero_zone_a.dart';
import '../widgets/login_footer.dart';
import '../widgets/login_form_zone_c.dart';
import '../widgets/login_hero_zone_a.dart';
import '../widgets/login_nav_bar.dart';
import '../widgets/login_painters.dart';
import '../widgets/login_register_card.dart';
import 'register_screen.dart';

/// Pixel-perfect Flutter implementation of Google Stitch's design:
/// Layer: "Login Mobile (Zona A/C) - Neubrutalism Eksklusif"
/// Project: "Stitch – Sistem Informasi E-Commerce E-Book"
/// Resolution: 390 × 884 px reference mobile viewport.
class LoginScreen extends ConsumerStatefulWidget {
  final VoidCallback? onClose;
  final VoidCallback? onNavigateToRegister;
  final ValueChanged<UserEntity>? onLoginSuccess;

  const LoginScreen({
    super.key,
    this.onClose,
    this.onNavigateToRegister,
    this.onLoginSuccess,
  });

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  void _handleAuthenticationSuccess(UserEntity user) {
    if (widget.onLoginSuccess != null) {
      widget.onLoginSuccess!(user);
      return;
    }

    if (user.role == UserRole.admin) {
      // Role-based routing: Admin notification dialog
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (ctx) => AlertDialog(
          backgroundColor: AppColors.nbPaper,
          shape: const RoundedRectangleBorder(
            side: BorderSide(color: AppColors.nbBlack, width: 3.0),
          ),
          title: Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 6.0,
                  vertical: 2.0,
                ),
                color: AppColors.nbBlack,
                child: const Text(
                  'ROLE: ADMIN',
                  style: TextStyle(
                    fontFamily: AppTheme.fontMono,
                    fontSize: 10.0,
                    fontWeight: FontWeight.w700,
                    color: AppColors.nbWhite,
                  ),
                ),
              ),
              const SizedBox(width: 8.0),
              const Expanded(
                child: Text(
                  'AKSES ADMIN DIKONFIRMASI',
                  style: TextStyle(
                    fontFamily: AppTheme.fontHeadline,
                    fontSize: 14.0,
                    fontWeight: FontWeight.w800,
                    color: AppColors.nbBlack,
                  ),
                ),
              ),
            ],
          ),
          content: Text(
            'Selamat datang, ${user.fullName}. Sesuai otorisasi sistem, akun Anda memiliki hak akses Administrator.',
            style: const TextStyle(
              fontFamily: AppTheme.fontBody,
              fontSize: 13.0,
              color: AppColors.nbBlack,
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(ctx).pop();
                Navigator.of(context).pushReplacement(
                  MaterialPageRoute(builder: (_) => const HomeScreen()),
                );
              },
              child: const Text(
                'LANJUTKAN KE KATALOG',
                style: TextStyle(
                  fontFamily: AppTheme.fontHeadline,
                  fontWeight: FontWeight.w700,
                  color: AppColors.nbBlack,
                ),
              ),
            ),
          ],
        ),
      );
    } else {
      // Role-based routing: Customer navigates to HomeScreen
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: AppColors.nbGreen,
          behavior: SnackBarBehavior.floating,
          shape: Border.all(color: AppColors.nbBlack, width: 2.0),
          content: Row(
            children: [
              const Icon(
                Icons.check_circle,
                color: AppColors.nbBlack,
                size: 20.0,
              ),
              const SizedBox(width: 8.0),
              Expanded(
                child: Text(
                  'Selamat datang kembali, ${user.fullName}!',
                  style: const TextStyle(
                    fontFamily: AppTheme.fontHeadline,
                    fontWeight: FontWeight.w700,
                    color: AppColors.nbBlack,
                    fontSize: 12.0,
                  ),
                ),
              ),
            ],
          ),
        ),
      );

      Navigator.of(context).pushReplacement(
        PageRouteBuilder(
          pageBuilder: (context, animation, secondaryAnimation) =>
              const HomeScreen(),
          transitionsBuilder: (context, animation, secondaryAnimation, child) {
            return FadeTransition(opacity: animation, child: child);
          },
          transitionDuration: const Duration(milliseconds: 250),
        ),
      );
    }
  }

  void _showRegisterDialog() {
    if (widget.onNavigateToRegister != null) {
      widget.onNavigateToRegister!();
      return;
    }

    Navigator.of(
      context,
    ).push(MaterialPageRoute(builder: (_) => const RegisterScreen()));
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authNotifierProvider);

    // Listen to auth state transitions
    ref.listen<AuthState>(authNotifierProvider, (previous, next) {
      if (next.isAuthenticated && next.user != null) {
        _handleAuthenticationSuccess(next.user!);
      }
    });

    return Scaffold(
      backgroundColor: AppColors.nbPaper,
      body: Stack(
        fit: StackFit.expand,
        children: [
          // 1. Neubrutalist subtle grid background (Stitch .nb-grid-bg 24x24px)
          const Positioned.fill(
            child: CustomPaint(
              painter: LoginGridPainter(
                cellSize: 24.0,
                lineColor: Color(0x0F000000), // rgba(0, 0, 0, 0.06)
                strokeWidth: 1.0,
              ),
            ),
          ),

          // 2. Main content container clamped to 390px reference width
          SafeArea(
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 420.0),
                child: SingleChildScrollView(
                  physics: const ClampingScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // 1. Navigation Status Bar (Switches to Error Mode when auth fails)
                      LoginNavBar(
                        onClose: widget.onClose,
                        isErrorState: authState.hasError,
                        errorCode: authState.failure?.code,
                      ),

                      // 2. Zona A: Expressive Hero Block / Neubrutalist Error Hero
                      if (authState.hasError && authState.failure != null) ...[
                        LoginErrorHeroZoneA(
                          title: 'GAGAL MASUK',
                          message: authState.failure!.message,
                          ribbon:
                              authState.failure!.ribbon ??
                              'PERINGATAN KEAMANAN',
                          failedAttempts: authState.failedAttempts,
                          onDismiss: () {
                            ref
                                .read(authNotifierProvider.notifier)
                                .clearError();
                          },
                        ),
                        const SizedBox(height: 8.0),
                        // Retain dismissible notification banner
                        LoginErrorBanner(
                          title: authState.failure!.title,
                          message: authState.failure!.message,
                          onDismiss: () {
                            ref
                                .read(authNotifierProvider.notifier)
                                .clearError();
                          },
                        ),
                      ] else
                        const LoginHeroZoneA(),

                      const SizedBox(height: 8.0),

                      // 3. Zona C: Formulir Login Container (Supports Error State)
                      LoginFormZoneC(
                        key: const ValueKey('login_form_zone_c'),
                        isLoading: authState.isLoading,
                        isErrorState: authState.hasError,
                        externalError: authState.failure?.message,
                        externalErrorField: authState.failure?.field,
                        onClearError: () {
                          ref.read(authNotifierProvider.notifier).clearError();
                        },
                        onSubmit:
                            ({
                              required String email,
                              required String password,
                              required bool rememberMe,
                            }) {
                              ref
                                  .read(authNotifierProvider.notifier)
                                  .login(
                                    email: email,
                                    password: password,
                                    rememberMe: rememberMe,
                                  );
                            },
                      ),

                      // DRM & Security Compliance Note in Error State
                      if (authState.hasError) const LoginCompliancePanel(),

                      // 4. Kartu Ajakan Daftar Akun Baru
                      LoginRegisterCard(onRegister: _showRegisterDialog),

                      // 5. Footer: Audit Diagnostics in Error State / Security Note in Normal State
                      if (authState.hasError)
                        LoginAuditFooter(
                          traceId:
                              '#${authState.failure?.code ?? '401'}-AUTH-09941',
                        )
                      else
                        const LoginFooter(),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
