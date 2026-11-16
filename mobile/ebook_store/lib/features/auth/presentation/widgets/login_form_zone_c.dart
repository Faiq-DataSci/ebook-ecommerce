import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// Zona C: Formulir Login Container strictly following Google Stitch Neubrutalism:
/// Layer: "Login Mobile (Zona A/C)" & "Login Mobile Error State (Zona A/C)"
/// Features:
/// - White container (`#FFFFFF`), 3px solid black border, 6px hard shadow.
/// - In Error State: shows "AUTENTIKASI PENGGUNA" header with "ZONA-C" badge.
/// - Email validation badge ("FORMAT VALID" green check or "Kredensial").
/// - Preserves entered email address across error states.
/// - Password input with show/hide toggle and direct field-level error alert.
/// - Dynamic submit button: "MASUK SEKARANG" (normal) / "COBA MASUK LAGI" (error).
/// - Secondary "PULIHKAN KATA SANDI" action button.
/// - Brutalist "Ingat Saya" checkbox & demo credentials autofill chips.
class LoginFormZoneC extends StatefulWidget {
  final bool isLoading;
  final bool isErrorState;
  final String? externalError;
  final String? externalErrorField;
  final VoidCallback? onClearError;
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
    this.isErrorState = false,
    this.externalError,
    this.externalErrorField,
    this.onClearError,
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

  bool get _isEmailFormatValid {
    final email = _emailController.text.trim();
    if (email.isEmpty) return false;
    return RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$').hasMatch(email);
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _onInputChanged() {
    if (_emailError != null || _passwordError != null) {
      setState(() {
        _emailError = null;
        _passwordError = null;
      });
    } else {
      setState(() {});
    }
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

  void _handleForgotPasswordDefault() {
    if (widget.onForgotPassword != null) {
      widget.onForgotPassword!();
      return;
    }

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
  }

  @override
  Widget build(BuildContext context) {
    final showPasswordError = _passwordError != null ||
        (widget.isErrorState &&
            (widget.externalErrorField == 'password' ||
                widget.externalErrorField == null));

    final showEmailError = _emailError != null ||
        (widget.isErrorState && widget.externalErrorField == 'email');

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
          // Section Header from Stitch: AUTENTIKASI PENGGUNA (ZONA-C)
          if (widget.isErrorState) ...[
            Padding(
              padding: const EdgeInsets.only(bottom: 12.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Flexible(
                    child: Text(
                      'AUTENTIKASI PENGGUNA',
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontFamily: AppTheme.fontHeadline,
                        fontSize: 14.0,
                        fontWeight: FontWeight.w800,
                        color: AppColors.nbBlack,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 6.0, vertical: 2.0),
                    decoration: BoxDecoration(
                      color: AppColors.nbYellow,
                      border: Border.all(color: AppColors.nbBlack, width: 1.0),
                    ),
                    child: const Text(
                      'ZONA-C',
                      style: TextStyle(
                        fontFamily: AppTheme.fontMono,
                        fontSize: 10.0,
                        fontWeight: FontWeight.w700,
                        color: AppColors.nbBlack,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const Divider(
              height: 1.0,
              thickness: 2.0,
              color: AppColors.nbBlack,
            ),
            const SizedBox(height: 14.0),
          ],

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
              if (widget.isErrorState && _isEmailFormatValid)
                Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 6.0, vertical: 2.0),
                  decoration: BoxDecoration(
                    color: AppColors.nbGreen.withValues(alpha: 0.2),
                    border: Border.all(color: AppColors.nbGreen, width: 1.5),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.check_circle,
                        size: 13.0,
                        color: AppColors.nbGreen,
                      ),
                      SizedBox(width: 4.0),
                      Text(
                        'FORMAT VALID',
                        style: TextStyle(
                          fontFamily: AppTheme.fontMono,
                          fontSize: 9.5,
                          fontWeight: FontWeight.w800,
                          color: AppColors.nbGreen,
                        ),
                      ),
                    ],
                  ),
                )
              else
                Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 6.0, vertical: 2.0),
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
                color: showEmailError ? AppColors.nbPink : AppColors.nbBlack,
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
                    onChanged: (val) => _onInputChanged(),
                  ),
                ),
                // Green checkmark icon if format valid
                if (_isEmailFormatValid)
                  Container(
                    width: 24.0,
                    height: 24.0,
                    margin: const EdgeInsets.only(right: 8.0),
                    decoration: BoxDecoration(
                      color: AppColors.nbGreen,
                      border: Border.all(color: AppColors.nbBlack, width: 1.5),
                    ),
                    alignment: Alignment.center,
                    child: const Icon(
                      Icons.check,
                      size: 16.0,
                      color: AppColors.nbBlack,
                    ),
                  )
                else
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
              if (widget.isErrorState)
                InkWell(
                  onTap: _handleForgotPasswordDefault,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 8.0, vertical: 2.0),
                    decoration: BoxDecoration(
                      color: AppColors.nbYellow,
                      border: Border.all(color: AppColors.nbBlack, width: 1.5),
                      boxShadow: const [
                        BoxShadow(
                          color: AppColors.nbBlack,
                          offset: Offset(2.0, 2.0),
                          blurRadius: 0.0,
                        ),
                      ],
                    ),
                    child: const Text(
                      'LUPA KATA SANDI?',
                      style: TextStyle(
                        fontFamily: AppTheme.fontHeadline,
                        fontSize: 10.5,
                        fontWeight: FontWeight.w800,
                        color: AppColors.nbBlack,
                      ),
                    ),
                  ),
                )
              else
                Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 6.0, vertical: 2.0),
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
                color: showPasswordError ? AppColors.nbPink : AppColors.nbBlack,
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
                    onChanged: (val) => _onInputChanged(),
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
                              _obscurePassword
                                  ? Icons.visibility
                                  : Icons.visibility_off,
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

          // Direct Field-Level Error Alert (Stitch Neubrutalism)
          if (showPasswordError) ...[
            const SizedBox(height: 6.0),
            Container(
              padding: const EdgeInsets.all(8.0),
              decoration: BoxDecoration(
                color: AppColors.nbPink,
                border: Border.all(color: AppColors.nbBlack, width: 2.0),
                boxShadow: const [
                  BoxShadow(
                    color: AppColors.nbBlack,
                    offset: Offset(3.0, 3.0),
                    blurRadius: 0.0,
                  ),
                ],
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 16.0,
                    height: 16.0,
                    color: AppColors.nbBlack,
                    alignment: Alignment.center,
                    child: const Text(
                      '✕',
                      style: TextStyle(
                        fontFamily: AppTheme.fontHeadline,
                        fontSize: 10.0,
                        fontWeight: FontWeight.w900,
                        color: AppColors.nbWhite,
                        height: 1.0,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8.0),
                  Expanded(
                    child: Text(
                      _passwordError ??
                          (widget.isErrorState
                              ? 'Kombinasi kata sandi tidak cocok untuk akun ini.'
                              : (widget.externalError ??
                                  'Kombinasi kata sandi tidak cocok untuk akun ini.')),
                      style: const TextStyle(
                        fontFamily: AppTheme.fontBody,
                        fontSize: 12.0,
                        fontWeight: FontWeight.w600,
                        color: AppColors.nbBlack,
                        height: 1.3,
                      ),
                    ),
                  ),
                ],
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
                          color: _rememberMe
                              ? AppColors.nbYellow
                              : AppColors.nbWhite,
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
                onTap: _handleForgotPasswordDefault,
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

          // ================= TOMBOL SUBMIT UTAMA: MASUK SEKARANG / COBA MASUK LAGI =================
          Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: widget.isLoading ? null : _validateAndSubmit,
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 150),
                height: 48.0,
                width: double.infinity,
                decoration: BoxDecoration(
                  color:
                      widget.isLoading ? AppColors.nbMuted : AppColors.nbYellow,
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
                    : Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            widget.isErrorState
                                ? 'COBA MASUK LAGI'
                                : 'MASUK SEKARANG',
                            style: const TextStyle(
                              fontFamily: AppTheme.fontHeadline,
                              fontSize: 14.0,
                              fontWeight: FontWeight.w700,
                              color: AppColors.nbBlack,
                              letterSpacing: 0.8,
                            ),
                          ),
                          const SizedBox(width: 8.0),
                          const Text(
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

          // Secondary Action: PULIHKAN KATA SANDI (Stitch Error State)
          if (widget.isErrorState) ...[
            const SizedBox(height: 10.0),
            Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: _handleForgotPasswordDefault,
                child: Container(
                  height: 44.0,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: AppColors.nbPaper,
                    border: Border.all(color: AppColors.nbBlack, width: 2.0),
                    boxShadow: const [
                      BoxShadow(
                        color: AppColors.nbBlack,
                        offset: Offset(3.0, 3.0),
                        blurRadius: 0.0,
                      ),
                    ],
                  ),
                  alignment: Alignment.center,
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        Icons.lock_reset,
                        size: 18.0,
                        color: AppColors.nbBlack,
                      ),
                      SizedBox(width: 6.0),
                      Text(
                        'PULIHKAN KATA SANDI',
                        style: TextStyle(
                          fontFamily: AppTheme.fontHeadline,
                          fontSize: 12.0,
                          fontWeight: FontWeight.w700,
                          color: AppColors.nbBlack,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],

          const SizedBox(height: 14.0),

          // ================= BADGE SIMULASI (AGENTS.md REQUIREMENT) =================
          Container(
            width: double.infinity,
            padding:
                const EdgeInsets.symmetric(horizontal: 10.0, vertical: 8.0),
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
                    Icon(Icons.info_outline,
                        size: 13.0, color: AppColors.nbTextMuted),
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
                            border: Border.all(
                                color: AppColors.nbBlack, width: 1.0),
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
                            border: Border.all(
                                color: AppColors.nbBlack, width: 1.0),
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
