import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../../auth/presentation/pages/login_screen.dart';
import '../../domain/entities/user_profile_entity.dart';
import '../providers/profile_transactions_providers.dart';
import '../widgets/profile_app_bar.dart';
import '../widgets/pt_controls.dart';

class EditProfileScreen extends ConsumerStatefulWidget {
  final UserProfileEntity initialProfile;

  const EditProfileScreen({super.key, required this.initialProfile});

  @override
  ConsumerState<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends ConsumerState<EditProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameController;
  late final TextEditingController _phoneController;

  String? _fieldErrorName;
  String? _fieldErrorPhone;

  @override
  void initState() {
    super.initState();
    _nameController = TextEditingController(
      text: widget.initialProfile.fullName,
    );
    _phoneController = TextEditingController(
      text: widget.initialProfile.phone ?? '',
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    super.dispose();
  }

  Future<void> _handleSave() async {
    setState(() {
      _fieldErrorName = null;
      _fieldErrorPhone = null;
    });

    if (!_formKey.currentState!.validate()) {
      return;
    }

    final cleanName = _nameController.text.trim();
    final cleanPhone = _phoneController.text.trim();

    final failure = await ref
        .read(profileProvider.notifier)
        .save(
          fullName: cleanName.isNotEmpty ? cleanName : null,
          phone: cleanPhone.isNotEmpty ? cleanPhone : null,
        );

    if (!mounted) return;

    if (failure == null) {
      showPtSnackBar(
        context,
        'Profil berhasil diperbarui.',
        color: AppColors.nbGreen,
        icon: Icons.check_circle_outline,
      );
      Navigator.of(context).pop();
      return;
    }

    if (failure.isUnauthenticated) {
      showPtSnackBar(
        context,
        'Sesi telah berakhir. Silakan login kembali.',
        color: AppColors.nbPink,
        icon: Icons.lock_outline,
      );
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (_) => const LoginScreen()),
        (route) => false,
      );
      return;
    }

    // Tangani validasi per field jika ada
    if (failure.fieldErrors.isNotEmpty) {
      setState(() {
        _fieldErrorName = failure.fieldErrors['fullName'];
        _fieldErrorPhone = failure.fieldErrors['phone'];
      });
    }

    showPtSnackBar(
      context,
      failure.message,
      color: AppColors.nbPink,
      icon: Icons.error_outline,
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(profileProvider);

    return Scaffold(
      backgroundColor: AppColors.nbPaper,
      appBar: const ProfileAppBar(title: 'Ubah Profil'),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppTheme.marginMobile),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              // Kartu Form Neubrutalism
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: AppTheme.brutalBox(
                  color: AppColors.nbWhite,
                  borderColor: AppColors.nbBlack,
                  borderWidth: AppTheme.borderDefault,
                  shadowOffset: 4,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    const Text(
                      'INFORMASI PENGGUNA',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 12,
                        fontWeight: FontWeight.w900,
                        color: AppColors.nbBlack,
                        letterSpacing: 0.5,
                      ),
                    ),
                    const SizedBox(height: 16),
                    // Field Nama Lengkap
                    const Text(
                      'Nama Lengkap *',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: AppColors.nbBlack,
                      ),
                    ),
                    const SizedBox(height: 6),
                    TextFormField(
                      key: const Key('edit_profile_name_field'),
                      controller: _nameController,
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: AppColors.nbPaper,
                        hintText: 'Masukkan nama lengkap',
                        errorText: _fieldErrorName,
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 14,
                        ),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.zero,
                          borderSide: const BorderSide(
                            color: AppColors.nbBlack,
                            width: AppTheme.borderDefault,
                          ),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.zero,
                          borderSide: const BorderSide(
                            color: AppColors.nbBlack,
                            width: AppTheme.borderDefault,
                          ),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.zero,
                          borderSide: const BorderSide(
                            color: AppColors.nbBlack,
                            width: 2.5,
                          ),
                        ),
                      ),
                      validator: (value) {
                        final trimmed = value?.trim() ?? '';
                        if (trimmed.isEmpty) {
                          return 'Nama lengkap tidak boleh kosong.';
                        }
                        if (trimmed.length < 2) {
                          return 'Nama minimal 2 karakter.';
                        }
                        if (trimmed.length > 120) {
                          return 'Nama maksimal 120 karakter.';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 16),
                    // Field Nomor Telepon
                    const Text(
                      'Nomor Telepon (Opsional)',
                      style: TextStyle(
                        fontFamily: 'Inter',
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: AppColors.nbBlack,
                      ),
                    ),
                    const SizedBox(height: 6),
                    TextFormField(
                      key: const Key('edit_profile_phone_field'),
                      controller: _phoneController,
                      keyboardType: TextInputType.phone,
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: AppColors.nbPaper,
                        hintText: 'Contoh: 08123456789',
                        errorText: _fieldErrorPhone,
                        contentPadding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 14,
                        ),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.zero,
                          borderSide: const BorderSide(
                            color: AppColors.nbBlack,
                            width: AppTheme.borderDefault,
                          ),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.zero,
                          borderSide: const BorderSide(
                            color: AppColors.nbBlack,
                            width: AppTheme.borderDefault,
                          ),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.zero,
                          borderSide: const BorderSide(
                            color: AppColors.nbBlack,
                            width: 2.5,
                          ),
                        ),
                      ),
                      validator: (value) {
                        final trimmed = value?.trim() ?? '';
                        if (trimmed.isNotEmpty && trimmed.length > 25) {
                          return 'Nomor telepon maksimal 25 karakter.';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 20),
                    // Read-only email notice
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: AppTheme.brutalBox(
                        color: AppColors.nbPaper,
                        borderColor: AppColors.nbBlack,
                        borderWidth: 1.5,
                        shadowOffset: 0,
                      ),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          const Icon(
                            Icons.lock_outline,
                            size: 16,
                            color: AppColors.nbBlack,
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: <Widget>[
                                const Text(
                                  'Email Terdaftar',
                                  style: TextStyle(
                                    fontFamily: 'Inter',
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.nbBlack,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  widget.initialProfile.email,
                                  style: const TextStyle(
                                    fontFamily: 'SpaceMono',
                                    fontSize: 12,
                                    color: AppColors.nbDisabledText,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                const Text(
                                  'Alamat email dan peran akun dilindungi dan tidak dapat diubah dari aplikasi mobile.',
                                  style: TextStyle(
                                    fontFamily: 'Inter',
                                    fontSize: 10,
                                    color: AppColors.nbDisabledText,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              // Tombol Simpan
              PtButton(
                key: const Key('edit_profile_save_button'),
                label: 'Simpan Perubahan',
                icon: Icons.check,
                color: AppColors.nbYellow,
                isLoading: state.isSaving,
                onTap: _handleSave,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
