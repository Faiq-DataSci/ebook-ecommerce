import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../domain/entities/user_profile_entity.dart';
import 'pt_controls.dart';

class ProfileHeaderCard extends StatelessWidget {
  final UserProfileEntity profile;
  final VoidCallback onEditTap;
  final VoidCallback onLogoutTap;
  final bool isSimulated;

  const ProfileHeaderCard({
    super.key,
    required this.profile,
    required this.onEditTap,
    required this.onLogoutTap,
    this.isSimulated = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
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
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              // Avatar kotak Neubrutalism dengan inisial
              Container(
                width: 56,
                height: 56,
                alignment: Alignment.center,
                decoration: AppTheme.brutalBox(
                  color: AppColors.nbYellow,
                  borderColor: AppColors.nbBlack,
                  borderWidth: AppTheme.borderDefault,
                  shadowOffset: 2,
                ),
                child: Text(
                  profile.initials,
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    color: AppColors.nbBlack,
                  ),
                ),
              ),
              const SizedBox(width: 14),
              // Nama, email, dan status
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      profile.fullName,
                      key: const Key('profile_fullname_text'),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      profile.email,
                      key: const Key('profile_email_text'),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: AppTheme.bodySm(AppColors.nbDisabledText),
                    ),
                    if (profile.phone != null &&
                        profile.phone!.isNotEmpty) ...<Widget>[
                      const SizedBox(height: 2),
                      Row(
                        children: <Widget>[
                          const Icon(
                            Icons.phone_outlined,
                            size: 13,
                            color: AppColors.nbBlack,
                          ),
                          const SizedBox(width: 4),
                          Expanded(
                            child: Text(
                              profile.phone!,
                              key: const Key('profile_phone_text'),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: AppTheme.bodySm(
                                AppColors.nbBlack,
                                fontSize: 12,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                    const SizedBox(height: 6),
                    // Status Akun Aktif badge
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 2,
                      ),
                      decoration: AppTheme.brutalBox(
                        color: AppColors.nbGreen,
                        borderColor: AppColors.nbBlack,
                        borderWidth: 1.5,
                        shadowOffset: 0,
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: <Widget>[
                          Container(
                            width: 6,
                            height: 6,
                            decoration: const BoxDecoration(
                              color: AppColors.nbBlack,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 4),
                          const Text(
                            'AKUN AKTIF',
                            style: TextStyle(
                              fontFamily: 'Inter',
                              fontSize: 10,
                              fontWeight: FontWeight.w900,
                              color: AppColors.nbBlack,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              // Tombol Logout
              Semantics(
                button: true,
                label: 'Keluar dari akun',
                child: InkWell(
                  key: const Key('profile_logout_icon_button'),
                  onTap: onLogoutTap,
                  child: Container(
                    width: 40,
                    height: 40,
                    alignment: Alignment.center,
                    decoration: AppTheme.brutalBox(
                      color: AppColors.nbPink,
                      borderColor: AppColors.nbBlack,
                      borderWidth: AppTheme.borderDefault,
                      shadowOffset: 2,
                    ),
                    child: const Icon(
                      Icons.logout,
                      size: 18,
                      color: AppColors.nbBlack,
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          // Tombol Ubah Profil
          PtButton(
            key: const Key('profile_edit_button'),
            label: 'Ubah Profil',
            icon: Icons.edit_outlined,
            color: AppColors.nbYellow,
            onTap: onEditTap,
          ),
        ],
      ),
    );
  }
}
