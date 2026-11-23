import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// App bar 56dp: latar `nb-paper`, border bawah 2px, tombol kembali persegi.
class ProfileAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;

  const ProfileAppBar({super.key, required this.title});

  @override
  Size get preferredSize => const Size.fromHeight(56);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 56 + MediaQuery.paddingOf(context).top,
      decoration: const BoxDecoration(
        color: AppColors.nbPaper,
        border: Border(
          bottom: BorderSide(
            color: AppColors.nbBlack,
            width: AppTheme.borderDefault,
          ),
        ),
      ),
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Row(
            children: <Widget>[
              Semantics(
                button: true,
                label: 'Kembali',
                child: InkWell(
                  key: const Key('pt_back_button'),
                  onTap: () => Navigator.of(context).maybePop(),
                  child: Container(
                    width: 48,
                    height: 48,
                    alignment: Alignment.center,
                    child: Container(
                      width: 36,
                      height: 36,
                      alignment: Alignment.center,
                      decoration: AppTheme.brutalBox(
                        color: AppColors.nbWhite,
                        borderColor: AppColors.nbBlack,
                        borderWidth: AppTheme.borderDefault,
                        shadowOffset: 2,
                      ),
                      child: const Icon(
                        Icons.arrow_back,
                        size: 18,
                        color: AppColors.nbBlack,
                      ),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
