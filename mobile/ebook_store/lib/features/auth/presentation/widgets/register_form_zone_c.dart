import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// ZONA C: Presisi Formulir Registrasi & Validasi Terbuka
/// Google Stitch Reference: "Registrasi Mobile (Zona A/C)"
/// Contains:
/// 1. Nama Lengkap (ID.NAME)
/// 2. Alamat Email (AUTH.EMAIL)
/// 3. Kata Sandi (AUTH.KEY) + 4-Box Neubrutalist Strength Indicator
/// 4. Konfirmasi Kata Sandi (VERIFIKASI) + Real-time Match Badge & Warning
/// 5. Neubrutalist Agreement Checkbox
/// 6. Tombol Aksi "BUAT AKUN SEKARANG ➔"
/// 7. Footer Navigasi "Sudah punya akun? Masuk di sini"
class RegisterFormZoneC extends StatefulWidget {
  final bool isLoading;
  final void Function({
    required String fullName,
    required String email,
    required String password,
    required String confirmPassword,
    required bool agreeTerms,
  })
  onSubmit;
  final VoidCallback? onNavigateToLogin;

  const RegisterFormZoneC({
    super.key,
    required this.isLoading,
    required this.onSubmit,
    this.onNavigateToLogin,
  });

  @override
  State<RegisterFormZoneC> createState() => _RegisterFormZoneCState();
}

class _RegisterFormZoneCState extends State<RegisterFormZoneC> {
  final TextEditingController _fullNameController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  final TextEditingController _confirmPasswordController =
      TextEditingController();

  final FocusNode _fullNameFocus = FocusNode();
  final FocusNode _emailFocus = FocusNode();
  final FocusNode _passwordFocus = FocusNode();
  final FocusNode _confirmPasswordFocus = FocusNode();

  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  bool _agreeTerms = false;

  int _passwordScore =
      0; // 0: Empty, 1: Weak, 2: Medium, 3: Strong, 4: Very Strong

  @override
  void dispose() {
    _fullNameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _fullNameFocus.dispose();
    _emailFocus.dispose();
    _passwordFocus.dispose();
    _confirmPasswordFocus.dispose();
    super.dispose();
  }

  void _evalPasswordStrength(String password) {
    if (password.isEmpty) {
      setState(() => _passwordScore = 0);
      return;
    }

    int score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8 && RegExp(r'[0-9]').hasMatch(password)) score++;
    if (RegExp(r'[A-Z]').hasMatch(password) &&
        RegExp(r'[a-z]').hasMatch(password)) {
      score++;
    }
    if (RegExp(r'[^A-Za-z0-9]').hasMatch(password) || password.length >= 12) {
      score++;
    }

    setState(() => _passwordScore = score);
  }

  void _handleSubmit() {
    FocusScope.of(context).unfocus();
    widget.onSubmit(
      fullName: _fullNameController.text,
      email: _emailController.text,
      password: _passwordController.text,
      confirmPassword: _confirmPasswordController.text,
      agreeTerms: _agreeTerms,
    );
  }

  @override
  Widget build(BuildContext context) {
    final passwordText = _passwordController.text;
    final confirmText = _confirmPasswordController.text;
    final isConfirmEmpty = confirmText.isEmpty;
    final isMatch = !isConfirmEmpty && passwordText == confirmText;
    final isMismatch = !isConfirmEmpty && passwordText != confirmText;

    return Container(
      decoration: BoxDecoration(
        color: AppColors.nbWhite,
        border: Border.all(color: AppColors.nbBlack, width: 3.0),
        boxShadow: const [
          BoxShadow(
            color: AppColors.nbBlack,
            offset: Offset(5.0, 5.0),
            blurRadius: 0.0,
          ),
        ],
      ),
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Section Header: DATA IDENTITAS PENGGUNA
          Padding(
            padding: const EdgeInsets.only(bottom: 12.0),
            child: Row(
              children: [
                const Icon(
                  Icons.badge_outlined,
                  size: 20.0,
                  color: AppColors.nbBlack,
                ),
                const SizedBox(width: 8.0),
                const Expanded(
                  child: Text(
                    'DATA IDENTITAS PENGGUNA',
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontFamily: AppTheme.fontHeadline,
                      fontSize: 13.5,
                      fontWeight: FontWeight.w700,
                      color: AppColors.nbBlack,
                      letterSpacing: 0.5,
                    ),
                  ),
                ),
              ],
            ),
          ),

          const Divider(height: 1.0, thickness: 2.0, color: AppColors.nbBlack),

          const SizedBox(height: 16.0),

          // -------------------------------------------------------------
          // FIELD 1: NAMA LENGKAP
          // -------------------------------------------------------------
          _buildFieldHeader(
            label: 'NAMA LENGKAP',
            isRequired: true,
            monoTag: 'ID.NAME',
          ),
          const SizedBox(height: 6.0),
          _buildTextInput(
            controller: _fullNameController,
            focusNode: _fullNameFocus,
            hintText: 'Contoh: Raden Saleh',
            keyboardType: TextInputType.name,
            textInputAction: TextInputAction.next,
          ),

          const SizedBox(height: 16.0),

          // -------------------------------------------------------------
          // FIELD 2: ALAMAT EMAIL
          // -------------------------------------------------------------
          _buildFieldHeader(
            label: 'ALAMAT EMAIL',
            isRequired: true,
            monoTag: 'AUTH.EMAIL',
          ),
          const SizedBox(height: 6.0),
          _buildTextInput(
            controller: _emailController,
            focusNode: _emailFocus,
            hintText: 'budi.santoso@email.com',
            keyboardType: TextInputType.emailAddress,
            textInputAction: TextInputAction.next,
          ),

          const SizedBox(height: 16.0),

          // -------------------------------------------------------------
          // FIELD 3: KATA SANDI
          // -------------------------------------------------------------
          _buildFieldHeader(
            label: 'KATA SANDI',
            isRequired: true,
            monoTag: 'AUTH.KEY',
          ),
          const SizedBox(height: 6.0),
          _buildPasswordInput(
            controller: _passwordController,
            focusNode: _passwordFocus,
            hintText: '••••••••',
            obscureText: _obscurePassword,
            textInputAction: TextInputAction.next,
            onToggleVisibility: () {
              setState(() => _obscurePassword = !_obscurePassword);
            },
            onChanged: (val) {
              _evalPasswordStrength(val);
            },
          ),

          const SizedBox(height: 8.0),

          // Indikator Kekuatan Sandi: 4 Kotak Neubrutalist
          _buildPasswordStrengthWidget(),

          const SizedBox(height: 16.0),

          // -------------------------------------------------------------
          // FIELD 4: KONFIRMASI KATA SANDI
          // -------------------------------------------------------------
          _buildFieldHeader(
            label: 'KONFIRMASI KATA SANDI',
            isRequired: true,
            monoTag: 'VERIFIKASI',
          ),
          const SizedBox(height: 6.0),
          _buildConfirmPasswordInput(
            controller: _confirmPasswordController,
            focusNode: _confirmPasswordFocus,
            hintText: '••••••••',
            obscureText: _obscureConfirmPassword,
            isConfirmEmpty: isConfirmEmpty,
            isMatch: isMatch,
            onToggleVisibility: () {
              setState(
                () => _obscureConfirmPassword = !_obscureConfirmPassword,
              );
            },
            onChanged: (_) => setState(() {}),
          ),

          if (isMismatch) ...[
            const SizedBox(height: 4.0),
            const Text(
              'Kata sandi belum sama persis.',
              style: TextStyle(
                fontFamily: AppTheme.fontBody,
                fontSize: 12.0,
                fontWeight: FontWeight.w600,
                color: Color(0xFFBA1A1A),
              ),
            ),
          ],

          const SizedBox(height: 14.0),

          // -------------------------------------------------------------
          // CHECKBOX: PERSETUJUAN SYARAT & KEBIJAKAN
          // -------------------------------------------------------------
          InkWell(
            onTap: () {
              setState(() => _agreeTerms = !_agreeTerms);
            },
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 24x24px Neubrutalist Checkbox
                Container(
                  width: 24.0,
                  height: 24.0,
                  margin: const EdgeInsets.only(top: 2.0, right: 10.0),
                  decoration: BoxDecoration(
                    color: _agreeTerms ? AppColors.nbYellow : AppColors.nbWhite,
                    border: Border.all(color: AppColors.nbBlack, width: 2.5),
                    boxShadow: const [
                      BoxShadow(
                        color: AppColors.nbBlack,
                        offset: Offset(2.0, 2.0),
                        blurRadius: 0.0,
                      ),
                    ],
                  ),
                  child: _agreeTerms
                      ? const Icon(
                          Icons.check,
                          size: 18.0,
                          color: AppColors.nbBlack,
                        )
                      : null,
                ),

                // Label Text
                Expanded(
                  child: RichText(
                    text: const TextSpan(
                      style: TextStyle(
                        fontFamily: AppTheme.fontBody,
                        fontSize: 12.5,
                        color: AppColors.nbBlack,
                        height: 1.35,
                      ),
                      children: [
                        TextSpan(text: 'Saya menyetujui '),
                        TextSpan(
                          text: 'Syarat Lisensi E-Book',
                          style: TextStyle(
                            fontWeight: FontWeight.w700,
                            decoration: TextDecoration.underline,
                            decorationThickness: 2.0,
                          ),
                        ),
                        TextSpan(text: ' & '),
                        TextSpan(
                          text: 'Kebijakan Privasi',
                          style: TextStyle(
                            fontWeight: FontWeight.w700,
                            decoration: TextDecoration.underline,
                            decorationThickness: 2.0,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 18.0),

          // -------------------------------------------------------------
          // TOMBOL AKSI UTAMA: BUAT AKUN SEKARANG
          // -------------------------------------------------------------
          InkWell(
            onTap: widget.isLoading ? null : _handleSubmit,
            child: Container(
              height: 52.0,
              decoration: BoxDecoration(
                color: widget.isLoading
                    ? AppColors.nbMuted
                    : AppColors.nbYellow,
                border: Border.all(color: AppColors.nbBlack, width: 3.0),
                boxShadow: widget.isLoading
                    ? const []
                    : const [
                        BoxShadow(
                          color: AppColors.nbBlack,
                          offset: Offset(4.0, 4.0),
                          blurRadius: 0.0,
                        ),
                      ],
              ),
              child: Center(
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  child: widget.isLoading
                      ? const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            SizedBox(
                              width: 20.0,
                              height: 20.0,
                              child: CircularProgressIndicator(
                                strokeWidth: 2.5,
                                valueColor: AlwaysStoppedAnimation<Color>(
                                  AppColors.nbBlack,
                                ),
                              ),
                            ),
                            SizedBox(width: 10.0),
                            Text(
                              'MEMPROSES PENDAFTARAN...',
                              style: TextStyle(
                                fontFamily: AppTheme.fontHeadline,
                                fontSize: 13.0,
                                fontWeight: FontWeight.w800,
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
                              'BUAT AKUN SEKARANG',
                              style: TextStyle(
                                fontFamily: AppTheme.fontHeadline,
                                fontSize: 15.0,
                                fontWeight: FontWeight.w800,
                                color: AppColors.nbBlack,
                                letterSpacing: 0.5,
                              ),
                            ),
                            SizedBox(width: 8.0),
                            Icon(
                              Icons.arrow_forward,
                              color: AppColors.nbBlack,
                              size: 22.0,
                            ),
                          ],
                        ),
                ),
              ),
            ),
          ),

          const SizedBox(height: 16.0),

          // -------------------------------------------------------------
          // FOOTER NAVIGASI PERALIHAN: SUDAH PUNYA AKUN? MASUK DI SINI
          // -------------------------------------------------------------
          const Divider(height: 1.0, thickness: 2.0, color: AppColors.nbBlack),
          const SizedBox(height: 12.0),

          Center(
            child: Wrap(
              alignment: WrapAlignment.center,
              crossAxisAlignment: WrapCrossAlignment.center,
              children: [
                const Text(
                  'Sudah punya akun? ',
                  style: TextStyle(
                    fontFamily: AppTheme.fontBody,
                    fontSize: 13.0,
                    color: AppColors.nbBlack,
                  ),
                ),
                InkWell(
                  onTap: widget.onNavigateToLogin,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 4.0,
                      vertical: 2.0,
                    ),
                    child: const Text(
                      'Masuk di sini',
                      style: TextStyle(
                        fontFamily: AppTheme.fontHeadline,
                        fontSize: 13.0,
                        fontWeight: FontWeight.w800,
                        color: AppColors.nbBlack,
                        decoration: TextDecoration.underline,
                        decorationThickness: 2.5,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFieldHeader({
    required String label,
    required bool isRequired,
    required String monoTag,
  }) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Flexible(
          child: RichText(
            overflow: TextOverflow.ellipsis,
            text: TextSpan(
              style: const TextStyle(
                fontFamily: AppTheme.fontHeadline,
                fontSize: 12.5,
                fontWeight: FontWeight.w700,
                color: AppColors.nbBlack,
                letterSpacing: 0.3,
              ),
              children: [
                TextSpan(text: label),
                if (isRequired)
                  const TextSpan(
                    text: ' *',
                    style: TextStyle(
                      color: Color(0xFFBA1A1A),
                      fontWeight: FontWeight.w900,
                    ),
                  ),
              ],
            ),
          ),
        ),
        const SizedBox(width: 8.0),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 4.0, vertical: 1.0),
          decoration: BoxDecoration(
            color: AppColors.surfaceContainer,
            border: Border.all(color: AppColors.nbBlack, width: 1.0),
          ),
          child: Text(
            monoTag,
            style: const TextStyle(
              fontFamily: AppTheme.fontMono,
              fontSize: 9.5,
              fontWeight: FontWeight.w700,
              color: AppColors.nbTextMuted,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildTextInput({
    required TextEditingController controller,
    required FocusNode focusNode,
    required String hintText,
    required TextInputType keyboardType,
    required TextInputAction textInputAction,
  }) {
    return Container(
      height: 48.0,
      decoration: BoxDecoration(
        color: AppColors.nbWhite,
        border: Border.all(color: AppColors.nbBlack, width: 2.0),
        boxShadow: const [
          BoxShadow(
            color: AppColors.nbBlack,
            offset: Offset(3.0, 3.0),
            blurRadius: 0.0,
          ),
        ],
      ),
      padding: const EdgeInsets.symmetric(horizontal: 12.0),
      child: Center(
        child: TextField(
          controller: controller,
          focusNode: focusNode,
          keyboardType: keyboardType,
          textInputAction: textInputAction,
          style: const TextStyle(
            fontFamily: AppTheme.fontBody,
            fontSize: 14.0,
            color: AppColors.nbBlack,
            fontWeight: FontWeight.w500,
          ),
          decoration: InputDecoration(
            hintText: hintText,
            hintStyle: const TextStyle(
              fontFamily: AppTheme.fontBody,
              fontSize: 13.5,
              color: Color(0xFF9E9E9E),
            ),
            border: InputBorder.none,
            isDense: true,
            contentPadding: EdgeInsets.zero,
          ),
        ),
      ),
    );
  }

  Widget _buildPasswordInput({
    required TextEditingController controller,
    required FocusNode focusNode,
    required String hintText,
    required bool obscureText,
    required TextInputAction textInputAction,
    required VoidCallback onToggleVisibility,
    required ValueChanged<String> onChanged,
  }) {
    return Container(
      height: 48.0,
      decoration: BoxDecoration(
        color: AppColors.nbWhite,
        border: Border.all(color: AppColors.nbBlack, width: 2.0),
        boxShadow: const [
          BoxShadow(
            color: AppColors.nbBlack,
            offset: Offset(3.0, 3.0),
            blurRadius: 0.0,
          ),
        ],
      ),
      padding: const EdgeInsets.only(left: 12.0, right: 6.0),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: controller,
              focusNode: focusNode,
              obscureText: obscureText,
              textInputAction: textInputAction,
              onChanged: onChanged,
              style: const TextStyle(
                fontFamily: AppTheme.fontBody,
                fontSize: 14.0,
                color: AppColors.nbBlack,
                fontWeight: FontWeight.w600,
              ),
              decoration: InputDecoration(
                hintText: hintText,
                hintStyle: const TextStyle(
                  fontFamily: AppTheme.fontBody,
                  fontSize: 14.0,
                  color: Color(0xFF9E9E9E),
                ),
                border: InputBorder.none,
                isDense: true,
                contentPadding: EdgeInsets.zero,
              ),
            ),
          ),
          Semantics(
            button: true,
            label: obscureText
                ? 'Tampilkan kata sandi'
                : 'Sembunyikan kata sandi',
            child: InkWell(
              onTap: onToggleVisibility,
              child: Container(
                width: 34.0,
                height: 34.0,
                decoration: BoxDecoration(
                  color: AppColors.surfaceContainer,
                  border: Border.all(color: AppColors.nbBlack, width: 2.0),
                ),
                child: Center(
                  child: Icon(
                    obscureText ? Icons.visibility : Icons.visibility_off,
                    size: 18.0,
                    color: AppColors.nbBlack,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildConfirmPasswordInput({
    required TextEditingController controller,
    required FocusNode focusNode,
    required String hintText,
    required bool obscureText,
    required bool isConfirmEmpty,
    required bool isMatch,
    required VoidCallback onToggleVisibility,
    required ValueChanged<String> onChanged,
  }) {
    Color badgeColor = AppColors.surfaceContainer;
    IconData badgeIcon = Icons.remove;
    Color iconColor = AppColors.nbDisabledText;

    if (!isConfirmEmpty) {
      if (isMatch) {
        badgeColor = AppColors.nbGreen;
        badgeIcon = Icons.check;
        iconColor = AppColors.nbBlack;
      } else {
        badgeColor = AppColors.nbPink;
        badgeIcon = Icons.close;
        iconColor = AppColors.nbBlack;
      }
    }

    return Container(
      height: 48.0,
      decoration: BoxDecoration(
        color: AppColors.nbWhite,
        border: Border.all(color: AppColors.nbBlack, width: 2.0),
        boxShadow: const [
          BoxShadow(
            color: AppColors.nbBlack,
            offset: Offset(3.0, 3.0),
            blurRadius: 0.0,
          ),
        ],
      ),
      padding: const EdgeInsets.only(left: 12.0, right: 6.0),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: controller,
              focusNode: focusNode,
              obscureText: obscureText,
              textInputAction: TextInputAction.done,
              onChanged: onChanged,
              onSubmitted: (_) => _handleSubmit(),
              style: const TextStyle(
                fontFamily: AppTheme.fontBody,
                fontSize: 14.0,
                color: AppColors.nbBlack,
                fontWeight: FontWeight.w600,
              ),
              decoration: InputDecoration(
                hintText: hintText,
                hintStyle: const TextStyle(
                  fontFamily: AppTheme.fontBody,
                  fontSize: 14.0,
                  color: Color(0xFF9E9E9E),
                ),
                border: InputBorder.none,
                isDense: true,
                contentPadding: EdgeInsets.zero,
              ),
            ),
          ),
          // Toggle obscure
          InkWell(
            onTap: onToggleVisibility,
            child: Container(
              width: 32.0,
              height: 32.0,
              margin: const EdgeInsets.only(right: 4.0),
              decoration: BoxDecoration(
                color: AppColors.surfaceContainer,
                border: Border.all(color: AppColors.nbBlack, width: 1.5),
              ),
              child: Center(
                child: Icon(
                  obscureText ? Icons.visibility : Icons.visibility_off,
                  size: 16.0,
                  color: AppColors.nbBlack,
                ),
              ),
            ),
          ),
          // Match badge indicator
          Container(
            width: 32.0,
            height: 32.0,
            decoration: BoxDecoration(
              color: badgeColor,
              border: Border.all(color: AppColors.nbBlack, width: 2.0),
            ),
            child: Center(child: Icon(badgeIcon, size: 18.0, color: iconColor)),
          ),
        ],
      ),
    );
  }

  Widget _buildPasswordStrengthWidget() {
    String strengthLabel = 'KOSONG';
    Color strengthColor = AppColors.nbTextMuted;
    final List<Color> segColors = [
      AppColors.surfaceContainer,
      AppColors.surfaceContainer,
      AppColors.surfaceContainer,
      AppColors.surfaceContainer,
    ];

    if (_passwordScore == 1) {
      strengthLabel = 'LEMAH';
      strengthColor = AppColors.nbPink;
      segColors[0] = AppColors.nbPink;
    } else if (_passwordScore == 2) {
      strengthLabel = 'SEDANG';
      strengthColor = AppColors.nbOrange;
      segColors[0] = AppColors.nbOrange;
      segColors[1] = AppColors.nbOrange;
    } else if (_passwordScore == 3) {
      strengthLabel = 'KUAT';
      strengthColor = AppColors.nbYellow;
      segColors[0] = AppColors.nbYellow;
      segColors[1] = AppColors.nbYellow;
      segColors[2] = AppColors.nbYellow;
    } else if (_passwordScore >= 4) {
      strengthLabel = 'SANGAT KUAT';
      strengthColor = AppColors.nbGreen;
      segColors[0] = AppColors.nbGreen;
      segColors[1] = AppColors.nbGreen;
      segColors[2] = AppColors.nbGreen;
      segColors[3] = AppColors.nbGreen;
    }

    return Container(
      padding: const EdgeInsets.all(8.0),
      decoration: BoxDecoration(
        color: const Color(0xFFF5F4EC),
        border: Border.all(color: AppColors.nbBlack, width: 2.0),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Flexible(
                child: Text(
                  'TINGKAT KEKUATAN:',
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontFamily: AppTheme.fontHeadline,
                    fontSize: 10.5,
                    fontWeight: FontWeight.w700,
                    color: AppColors.nbBlack,
                  ),
                ),
              ),
              const SizedBox(width: 6.0),
              Text(
                strengthLabel,
                style: TextStyle(
                  fontFamily: AppTheme.fontMono,
                  fontSize: 10.5,
                  fontWeight: FontWeight.w700,
                  color: strengthColor,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6.0),
          // 4-box segmented meter
          Row(
            children: List.generate(4, (index) {
              return Expanded(
                child: Container(
                  height: 12.0,
                  margin: EdgeInsets.only(right: index < 3 ? 4.0 : 0.0),
                  decoration: BoxDecoration(
                    color: segColors[index],
                    border: Border.all(color: AppColors.nbBlack, width: 2.0),
                  ),
                ),
              );
            }),
          ),
          const SizedBox(height: 4.0),
          const Text(
            'Minimal 8 karakter, kombinasi huruf & angka',
            style: TextStyle(
              fontFamily: AppTheme.fontBody,
              fontSize: 11.0,
              color: AppColors.nbTextMuted,
            ),
          ),
        ],
      ),
    );
  }
}
