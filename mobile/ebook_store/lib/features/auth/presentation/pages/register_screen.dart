import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../home/presentation/pages/home_screen.dart';
import '../../../../theme/app_colors.dart';
import '../../domain/entities/user_entity.dart';
import '../providers/auth_provider.dart';
import '../providers/auth_state.dart';
import '../widgets/login_error_banner.dart';
import '../widgets/login_footer.dart';
import '../widgets/login_painters.dart';
import '../widgets/register_form_zone_c.dart';
import '../widgets/register_hero_zone_a.dart';
import '../widgets/register_nav_bar.dart';
import '../widgets/register_success_dialog.dart';
import 'login_screen.dart';

/// Pixel-perfect Flutter implementation of Google Stitch design:
/// Layer: "Registrasi Mobile (Zona A/C) - Neubrutalism"
/// Target Platform: Mobile Application (390 × 884 px)
/// Public registration is strictly for customers (CUSTOMER).
class RegisterScreen extends ConsumerStatefulWidget {
  final VoidCallback? onBack;
  final VoidCallback? onNavigateToLogin;
  final ValueChanged<UserEntity>? onRegisterSuccess;

  const RegisterScreen({
    super.key,
    this.onBack,
    this.onNavigateToLogin,
    this.onRegisterSuccess,
  });

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  bool _dialogShown = false;

  void _handleRegistrationSuccess(UserEntity user) {
    if (_dialogShown) return;
    _dialogShown = true;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => RegisterSuccessDialog(
        onContinue: () {
          Navigator.of(ctx).pop();
          if (widget.onRegisterSuccess != null) {
            widget.onRegisterSuccess!(user);
            return;
          }

          // Navigate to HomeScreen as newly registered customer
          Navigator.of(context).pushAndRemoveUntil(
            MaterialPageRoute(builder: (_) => const HomeScreen()),
            (route) => false,
          );
        },
      ),
    );
  }

  void _handleNavigateToLogin() {
    if (widget.onNavigateToLogin != null) {
      widget.onNavigateToLogin!();
      return;
    }

    // Default: replace with LoginScreen
    Navigator.of(
      context,
    ).pushReplacement(MaterialPageRoute(builder: (_) => const LoginScreen()));
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authNotifierProvider);

    // Listen for authentication / registration success
    ref.listen<AuthState>(authNotifierProvider, (previous, next) {
      if (next.isAuthenticated && next.user != null) {
        _handleRegistrationSuccess(next.user!);
      }
    });

    return Scaffold(
      backgroundColor: AppColors.nbPaper,
      body: Stack(
        fit: StackFit.expand,
        children: [
          // 1. Neubrutalist subtle grid background (24x24px)
          const Positioned.fill(
            child: CustomPaint(
              painter: LoginGridPainter(
                cellSize: 24.0,
                lineColor: Color(0x0F000000),
                strokeWidth: 1.0,
              ),
            ),
          ),

          // 2. Responsive clamped viewport (390px reference)
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
                      // Header Navigation Bar
                      RegisterNavBar(onBack: widget.onBack),

                      // Zona A: Hero Banner Neubrutalist
                      const RegisterHeroZoneA(),

                      // Error Notification Banner
                      if (authState.hasError && authState.failure != null)
                        LoginErrorBanner(
                          title: authState.failure!.title,
                          message: authState.failure!.message,
                          onDismiss: () {
                            ref
                                .read(authNotifierProvider.notifier)
                                .clearError();
                          },
                        ),

                      const SizedBox(height: 8.0),

                      // Zona C: Form Registrasi Presisi
                      RegisterFormZoneC(
                        isLoading: authState.isLoading,
                        onNavigateToLogin: _handleNavigateToLogin,
                        onSubmit:
                            ({
                              required String fullName,
                              required String email,
                              required String password,
                              required String confirmPassword,
                              required bool agreeTerms,
                            }) {
                              ref
                                  .read(authNotifierProvider.notifier)
                                  .register(
                                    fullName: fullName,
                                    email: email,
                                    password: password,
                                    confirmPassword: confirmPassword,
                                    agreeTerms: agreeTerms,
                                  );
                            },
                      ),

                      const SizedBox(height: 12.0),

                      // Security & Privacy Footer Note
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
