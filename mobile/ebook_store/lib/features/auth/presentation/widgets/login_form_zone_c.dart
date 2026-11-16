import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// Zona C: Formulir Login Container strictly following Google Stitch Neubrutalism:
/// - White container (`#FFFFFF`), 3px solid black border, 6px hard shadow.
/// - Field 1: Email Address with `Kredensial` badge and mail icon.
/// - Field 2: Password with `MIN. 8 KARAKTER` badge and show/hide toggle.
/// - Options: "Ingat Saya" brutalist checkbox & "Lupa Kata Sandi?" action.
/// - Main submit button: Yellow (`#FFD23F`), 3px border, 4px shadow, loading state.
/// - Data simulation banner labeled "DATA SIMULASI" per AGENTS.md.
class LoginFormZoneC extends StatefulWidget {
  final bool isLoading;
  final Function({
    required String email,
    required String password,
    required bool rememberMe,
  }) onSubmit;
  final VoidCallback? onForgotPassword;

  const LoginFormZoneC({
    super.key,
    required this.isLoading,
    required this.onSubmit,
    this.onForgotPassword,
  });

  @override
  State<LoginFormZoneC> createState() => _LoginFormZoneCState();
}

class _LoginFormZoneCState extends State<LoginFormZoneC> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  bool _obscurePassword = true;
  bool _rememberMe = false;

  String? _emailError;
  String? _passwordError;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _validateAndSubmit() {
    setState(() {
      _emailError = null;
      _passwordError = null;
    });

    final email = _emailController.text.trim();
    final password = _passwordController.text;

    bool isValid = true;

    if (email.isEmpty) {
      _emailError = 'Alamat email wajib diisi.';
      isValid = false;
    } else {
      final emailRegex = RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$');
      if (!emailRegex.hasMatch(email)) {
        _emailError = 'Format surel tidak valid (misal: nama@email.com).';
        isValid = false;
      }
    }

    if (password.isEmpty) {
      _passwordError = 'Kata sandi tidak boleh kosong.';
      isValid = false;
    } else if (password.length < 8) {
      _passwordError = 'Kata sandi minimal 8 karakter.';
      isValid = false;
    }

    setState(() {});

    if (isValid && !widget.isLoading) {
      widget.onSubmit(
        email: email,
        password: password,
        rememberMe: _rememberMe,
      );
    }
  }

  void _fillDemoCredentials(String email, String password) {
    setState(() {
      _emailController.text = email;
      _passwordController.text = password;
      _emailError = null;
      _passwordError = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 18.0),
      decoration: BoxDecoration(
        color: AppColors.nbWhite,
        border: Border.all(
          color: AppColors.nbBlack,
          width: 3.0,
        ),
        boxShadow: const [
          BoxShadow(
            color: AppColors.nbBlack,
            offset: Offset(6, 6),
            blurRadius: 0,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // ================= FIELD 1: ALAMAT EMAIL =================
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Flexible(
                child: Text(
                  'ALAMAT EMAIL *',
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontFamily: AppTheme.fontHeadline,
                    fontSize: 13.0,
                    fontWeight: FontWeight.w700,
                    color: AppColors.nbBlack,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
              const SizedBox(width: 8.0),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6.0, vertical: 2.0),
                decoration: BoxDecoration(
                  color: AppColors.surfaceContainer,
                  border: Border.all(
                    color: AppColors.nbBlack,
                    width: 1.0,
                  ),
                ),
                child: const Text(
                  'Kredensial',
                  style: TextStyle(
                    fontFamily: AppTheme.fontMono,
                    fontSize: 10.0,
                    fontWeight: FontWeight.w700,
                    color: AppColors.nbTextMuted,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 6.0),

          // Email Input Box
          Container(
            height: 48.0,
            decoration: BoxDecoration(
              color: AppColors.nbWhite,
              border: Border.all(
                color: _emailError != null ? AppColors.nbPink : AppColors.nbBlack,
                width: 2.0,
              ),
              boxShadow: const [
                BoxShadow(
                  color: AppColors.nbBlack,
                  offset: Offset(3, 3),
                  blurRadius: 0,
                ),
              ],
            ),
            child: Row(
              children: [
                const SizedBox(width: 12.0),
                const Icon(
                  Icons.mail_outline,
                  size: 19.0,
                  color: AppColors.nbBlack,
                ),
                const SizedBox(width: 8.0),
                Expanded(
                  child: TextField(
                    controller: _emailController,
                    keyboardType: TextInputType.emailAddress,
                    textInputAction: TextInputAction.next,
                    style: const TextStyle(
                      fontFamily: AppTheme.fontBody,
                      fontSize: 14.0,
                      fontWeight: FontWeight.w500,
                      color: AppColors.nbBlack,
                    ),
                    decoration: const InputDecoration(
                      hintText: 'nama@email.com',
                      hintStyle: TextStyle(
                        fontFamily: AppTheme.fontBody,
                        fontSize: 14.0,
                        color: AppColors.nbDisabledText,
                      ),
                      border: InputBorder.none,
                      isDense: true,
                      contentPadding: EdgeInsets.zero,
                    ),
                    onChanged: (val) {
                      if (_emailError != null) {
                        setState(() => _emailError = null);
                      }
                    },
                  ),
                ),
                const SizedBox(width: 12.0),
              ],
            ),
          ),

          if (_emailError != null) ...[
            const SizedBox(height: 4.0),
            Text(
              _emailError!,
              style: const TextStyle(
                fontFamily: AppTheme.fontBody,
                fontSize: 11.0,
                fontWeight: FontWeight.w600,
                color: AppColors.nbPink,
              ),
            ),
          ],

          const SizedBox(height: 16.0),

          // ================= FIELD 2: KATA SANDI =================
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Flexible(
                child: Text(
                  'KATA SANDI *',
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontFamily: AppTheme.fontHeadline,
                    fontSize: 13.0,
                    fontWeight: FontWeight.w700,
                    color: AppColors.nbBlack,
                    letterSpacing: 0.5,
                  ),
                ),
              ),
              const SizedBox(width: 8.0),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6.0, vertical: 2.0),
                decoration: BoxDecoration(
                  color: AppColors.surfaceContainer,
                  border: Border.all(
                    color: AppColors.nbBlack,
                    width: 1.0,
                  ),
                ),
                child: const Text(
                  'MIN. 8 KARAKTER',
                  style: TextStyle(
                    fontFamily: AppTheme.fontMono,
                    fontSize: 10.0,
                    fontWeight: FontWeight.w700,
                    color: AppColors.nbTextMuted,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 6.0),

          // Password Input Box with Show/Hide Toggle
          Container(
            height: 48.0,
            decoration: BoxDecoration(
              color: AppColors.nbWhite,
              border: Border.all(
                color: _passwordError != null ? AppColors.nbPink : AppColors.nbBlack,
                width: 2.0,
              ),
              boxShadow: const [
                BoxShadow(
                  color: AppColors.nbBlack,
                  offset: Offset(3, 3),
                  blurRadius: 0,
                ),
              ],
            ),
            child: Row(
              children: [
                const SizedBox(width: 12.0),
                const Icon(
                  Icons.lock_outline,
                  size: 19.0,
                  color: AppColors.nbBlack,
                ),
                const SizedBox(width: 8.0),
                Expanded(
                  child: TextField(
                    controller: _passwordController,
                    obscureText: _obscurePassword,
                    textInputAction: TextInputAction.done,
                    onSubmitted: (_) => _validateAndSubmit(),
                    style: const TextStyle(
                      fontFamily: AppTheme.fontBody,
                      fontSize: 14.0,
                      fontWeight: FontWeight.w500,
                      color: AppColors.nbBlack,
                    ),
                    decoration: const InputDecoration(
                      hintText: '••••••••',
                      hintStyle: TextStyle(
                        fontFamily: AppTheme.fontBody,
                        fontSize: 14.0,
                        color: AppColors.nbDisabledText,
                      ),
                      border: InputBorder.none,
                      isDense: true,
                      contentPadding: EdgeInsets.zero,
                    ),
                    onChanged: (val) {
                      if (_passwordError != null) {
                        setState(() => _passwordError = null);
                      }
                    },
                  ),
                ),
                // Toggle Show/Hide Button
                Padding(
                  padding: const EdgeInsets.only(right: 6.0),
                  child: Material(
                    color: Colors.transparent,
                    child: InkWell(
                      onTap: () {
                        setState(() {
                          _obscurePassword = !_obscurePassword;
                        });
                      },
                      child: Container(
                        height: 34.0,
                        padding: const EdgeInsets.symmetric(horizontal: 8.0),
                        decoration: BoxDecoration(
                          color: AppColors.nbMuted,
                          border: Border.all(
                            color: AppColors.nbBlack,
                            width: 2.0,
                          ),
                          boxShadow: const [
                            BoxShadow(
                              color: AppColors.nbBlack,
                              offset: Offset(2, 2),
                              blurRadius: 0,
                            ),
                          ],
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              _obscurePassword ? Icons.visibility : Icons.visibility_off,
                              size: 15.0,
                              color: AppColors.nbBlack,
                            ),
                            const SizedBox(width: 4.0),
                            Text(
                              _obscurePassword ? 'LIHAT' : 'SEMBUNYI',
                              style: const TextStyle(
                                fontFamily: AppTheme.fontHeadline,
                                fontSize: 11.0,
                                fontWeight: FontWeight.w700,
                                color: AppColors.nbBlack,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          if (_passwordError != null) ...[
            const SizedBox(height: 4.0),
            Text(
              _passwordError!,
              style: const TextStyle(
                fontFamily: AppTheme.fontBody,
                fontSize: 11.0,
                fontWeight: FontWeight.w600,
                color: AppColors.nbPink,
              ),
            ),
          ],

          const SizedBox(height: 12.0),

          // ================= OPSI: INGAT SAYA & LUPA KATA SANDI =================
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // Checkbox Ingat Saya
              Flexible(
                child: InkWell(
                  onTap: () {
                    setState(() {
                      _rememberMe = !_rememberMe;
                    });
                  },
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        width: 20.0,
                        height: 20.0,
                        decoration: BoxDecoration(
                          color: _rememberMe ? AppColors.nbYellow : AppColors.nbWhite,
                          border: Border.all(
                            color: AppColors.nbBlack,
                            width: 2.0,
                          ),
                          boxShadow: const [
                            BoxShadow(
                              color: AppColors.nbBlack,
                              offset: Offset(2, 2),
                              blurRadius: 0,
                            ),
                          ],
                        ),
                        alignment: Alignment.center,
                        child: _rememberMe
                            ? const Text(
                                '✓',
                                style: TextStyle(
                                  fontSize: 13.0,
                                  fontWeight: FontWeight.w900,
                                  color: AppColors.nbBlack,
                                  height: 1.0,
                                ),
                              )
                            : null,
                      ),
                      const SizedBox(width: 8.0),
                      const Flexible(
                        child: Text(
                          'Ingat Saya',
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontFamily: AppTheme.fontHeadline,
                            fontSize: 12.0,
                            fontWeight: FontWeight.w700,
                            color: AppColors.nbBlack,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(width: 8.0),

              // Lupa Kata Sandi Link
              InkWell(
                onTap: widget.onForgotPassword ??
                    () {
                      showDialog(
                        context: context,
                        builder: (ctx) => AlertDialog(
                          backgroundColor: AppColors.nbPaper,
                          shape: const RoundedRectangleBorder(
                            side: BorderSide(color: AppColors.nbBlack, width: 3.0),
                          ),
                          title: const Text(
                            'LUPA KATA SANDI',
                            style: TextStyle(
                              fontFamily: AppTheme.fontHeadline,
                              fontWeight: FontWeight.w800,
                              color: AppColors.nbBlack,
                            ),
                          ),
                          content: const Text(
                            'Untuk mereset kredensial akun, silakan hubungi administrator sistem atau periksa tautan pemulihan surel terdaftar Anda.',
                            style: TextStyle(
                              fontFamily: AppTheme.fontBody,
                              fontSize: 13.0,
                              color: AppColors.nbBlack,
                            ),
                          ),
                          actions: [
                            TextButton(
                              onPressed: () => Navigator.of(ctx).pop(),
                              child: const Text(
                                'MENGERTI',
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
                    },
                child: const Text(
                  'Lupa Kata Sandi?',
                  style: TextStyle(
                    fontFamily: AppTheme.fontHeadline,
                    fontSize: 12.0,
                    fontWeight: FontWeight.w700,
                    color: AppColors.nbBlack,
                    decoration: TextDecoration.underline,
                    decorationThickness: 2.0,
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 16.0),

          // ================= TOMBOL SUBMIT UTAMA: MASUK SEKARANG =================
          Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: widget.isLoading ? null : _validateAndSubmit,
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 150),
                height: 48.0,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: widget.isLoading ? AppColors.nbMuted : AppColors.nbYellow,
                  border: Border.all(
                    color: AppColors.nbBlack,
                    width: 3.0,
                  ),
                  boxShadow: widget.isLoading
                      ? const []
                      : const [
                          BoxShadow(
                            color: AppColors.nbBlack,
                            offset: Offset(4, 4),
                            blurRadius: 0,
                          ),
                        ],
                ),
                alignment: Alignment.center,
                child: widget.isLoading
                    ? const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          SizedBox(
                            width: 18.0,
                            height: 18.0,
                            child: CircularProgressIndicator(
                              strokeWidth: 2.5,
                              color: AppColors.nbBlack,
                            ),
                          ),
                          SizedBox(width: 10.0),
                          Text(
                            'MEMVERIFIKASI...',
                            style: TextStyle(
                              fontFamily: AppTheme.fontHeadline,
                              fontSize: 13.0,
                              fontWeight: FontWeight.w700,
                              color: AppColors.nbBlack,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ],
                      )
                    : const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'MASUK SEKARANG',
                            style: TextStyle(
                              fontFamily: AppTheme.fontHeadline,
                              fontSize: 14.0,
                              fontWeight: FontWeight.w700,
                              color: AppColors.nbBlack,
                              letterSpacing: 0.8,
                            ),
                          ),
                          SizedBox(width: 8.0),
                          Text(
                            '➔',
                            style: TextStyle(
                              fontSize: 16.0,
                              fontWeight: FontWeight.w900,
                              color: AppColors.nbBlack,
                            ),
                          ),
                        ],
                      ),
              ),
            ),
          ),

          const SizedBox(height: 14.0),

          // ================= BADGE SIMULASI (AGENTS.md REQUIREMENT) =================
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 8.0),
            decoration: BoxDecoration(
              color: AppColors.nbPaper,
              border: Border.all(
                color: AppColors.nbBlack.withValues(alpha: 0.4),
                width: 1.0,
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.info_outline, size: 13.0, color: AppColors.nbTextMuted),
                    SizedBox(width: 4.0),
                    Text(
                      'DATA SIMULASI KREDENSIAL:',
                      style: TextStyle(
                        fontFamily: AppTheme.fontMono,
                        fontSize: 9.5,
                        fontWeight: FontWeight.w700,
                        color: AppColors.nbBlack,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 4.0),
                Row(
                  children: [
                    Expanded(
                      child: InkWell(
                        onTap: () => _fillDemoCredentials(
                          'pelanggan@ebookstore.com',
                          'password123',
                        ),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 4.0),
                          alignment: Alignment.center,
                          decoration: BoxDecoration(
                            color: AppColors.nbYellow.withValues(alpha: 0.35),
                            border: Border.all(color: AppColors.nbBlack, width: 1.0),
                          ),
                          child: const Text(
                            'Demo Pelanggan',
                            style: TextStyle(
                              fontFamily: AppTheme.fontHeadline,
                              fontSize: 10.0,
                              fontWeight: FontWeight.w700,
                              color: AppColors.nbBlack,
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 6.0),
                    Expanded(
                      child: InkWell(
                        onTap: () => _fillDemoCredentials(
                          'admin@ebookstore.com',
                          'admin12345',
                        ),
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 4.0),
                          alignment: Alignment.center,
                          decoration: BoxDecoration(
                            color: AppColors.nbLavender.withValues(alpha: 0.35),
                            border: Border.all(color: AppColors.nbBlack, width: 1.0),
                          ),
                          child: const Text(
                            'Demo Admin',
                            style: TextStyle(
                              fontFamily: AppTheme.fontHeadline,
                              fontSize: 10.0,
                              fontWeight: FontWeight.w700,
                              color: AppColors.nbBlack,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
