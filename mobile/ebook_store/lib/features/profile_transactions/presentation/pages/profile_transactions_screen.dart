import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../../auth/presentation/pages/login_screen.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../../../catalog/presentation/pages/catalog_screen.dart';
import '../../../checkout/presentation/pages/checkout_screen.dart';
import '../../../library/presentation/pages/library_screen.dart';
import '../providers/profile_transactions_providers.dart';
import '../widgets/about_app_section.dart';
import '../widgets/logout_confirm_dialog.dart';
import '../widgets/order_card.dart';
import '../widgets/order_filter_chips.dart';
import '../widgets/orders_empty_state.dart';
import '../widgets/profile_app_bar.dart';
import '../widgets/profile_error_state.dart';
import '../widgets/profile_header_card.dart';
import '../widgets/pt_controls.dart';
import 'edit_profile_screen.dart';
import 'order_detail_screen.dart';

class ProfileTransactionsScreen extends ConsumerWidget {
  /// Bila `true`, layar disematkan langsung pada navigasi tab (misalnya di [HomeScreen])
  /// sehingga tidak memerlukan [Scaffold] atau [AppBar] ganda.
  final bool isEmbedded;

  const ProfileTransactionsScreen({super.key, this.isEmbedded = false});

  Future<void> _handleRefresh(WidgetRef ref) async {
    await Future.wait([
      ref.read(profileProvider.notifier).load(),
      ref.read(ordersProvider.notifier).load(),
    ]);
  }

  Future<void> _handleLogout(BuildContext context, WidgetRef ref) async {
    final confirmed = await LogoutConfirmDialog.show(context);
    if (confirmed == true && context.mounted) {
      await ref.read(authNotifierProvider.notifier).logout();
      if (!context.mounted) return;
      showPtSnackBar(
        context,
        'Berhasil keluar dari akun.',
        color: AppColors.nbGreen,
        icon: Icons.check_circle_outline,
      );
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (_) => const LoginScreen()),
        (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profileState = ref.watch(profileProvider);
    final ordersState = ref.watch(ordersProvider);
    final isSimulated = ref.watch(profileIsSimulatedProvider);

    final content = RefreshIndicator(
      color: AppColors.nbBlack,
      backgroundColor: AppColors.nbYellow,
      onRefresh: () => _handleRefresh(ref),
      child: SingleChildScrollView(
        key: const Key('profile_scroll_view'),
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(
          AppTheme.marginMobile,
          16,
          AppTheme.marginMobile,
          32,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            // 1. Profil Pengguna Header
            if (profileState.isLoading)
              _buildProfileSkeleton()
            else if (profileState.hasError)
              ProfileErrorState(
                message: profileState.errorMessage ?? 'Gagal memuat profil.',
                onRetry: () => ref.read(profileProvider.notifier).load(),
              )
            else if (profileState.profile != null)
              ProfileHeaderCard(
                profile: profileState.profile!,
                isSimulated: isSimulated,
                onEditTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => EditProfileScreen(
                        initialProfile: profileState.profile!,
                      ),
                    ),
                  );
                },
                onLogoutTap: () => _handleLogout(context, ref),
              ),

            const SizedBox(height: 16),

            // 2. Tentang Aplikasi & Status Simulasi
            AboutAppSection(isSimulated: isSimulated),

            const SizedBox(height: 24),

            // 3. Header Riwayat Pesanan
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                const Text(
                  'RIWAYAT PESANAN',
                  style: TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 13,
                    fontWeight: FontWeight.w900,
                    color: AppColors.nbBlack,
                    letterSpacing: 0.5,
                  ),
                ),
                Text(
                  '${ordersState.visible.length} Pesanan',
                  style: const TextStyle(
                    fontFamily: 'SpaceMono',
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: AppColors.nbDisabledText,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),

            // 4. Filter Status Pesanan
            OrderFilterChips(
              selectedStatus: ordersState.filter,
              onSelected: ref.read(ordersProvider.notifier).setFilter,
            ),
            const SizedBox(height: 14),

            // 5. Daftar Riwayat Pesanan
            if (ordersState.isLoading)
              _buildOrdersSkeleton()
            else if (ordersState.hasError)
              ProfileErrorState(
                message:
                    ordersState.errorMessage ?? 'Gagal memuat riwayat pesanan.',
                onRetry: () => ref.read(ordersProvider.notifier).load(),
              )
            else if (ordersState.visible.isEmpty)
              OrdersEmptyState(
                onExploreCatalog: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(builder: (_) => const CatalogScreen()),
                  );
                },
              )
            else
              ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: ordersState.visible.length,
                separatorBuilder: (_, _) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final order = ordersState.visible[index];
                  return OrderCard(
                    order: order,
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => OrderDetailScreen(
                            orderId: order.id,
                            initialOrder: order,
                          ),
                        ),
                      );
                    },
                    onResumePayment: order.isPending
                        ? () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (_) => CheckoutScreen(
                                  resumeOrder: order,
                                  checkoutItems: const [],
                                ),
                              ),
                            );
                          }
                        : null,
                    onOpenLibrary: order.isPaid
                        ? () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (_) => const LibraryScreen(),
                              ),
                            );
                          }
                        : null,
                  );
                },
              ),
          ],
        ),
      ),
    );

    if (isEmbedded) {
      return Material(color: AppColors.nbPaper, child: content);
    }

    return Scaffold(
      backgroundColor: AppColors.nbPaper,
      appBar: const ProfileAppBar(title: 'Profil & Pesanan'),
      body: content,
    );
  }

  Widget _buildProfileSkeleton() {
    return Container(
      width: double.infinity,
      height: 140,
      decoration: AppTheme.brutalBox(
        color: AppColors.nbWhite,
        borderColor: AppColors.nbBlack,
        borderWidth: AppTheme.borderDefault,
        shadowOffset: 4,
      ),
      child: const Center(
        child: CircularProgressIndicator(
          color: AppColors.nbBlack,
          strokeWidth: 3,
        ),
      ),
    );
  }

  Widget _buildOrdersSkeleton() {
    return Container(
      width: double.infinity,
      height: 180,
      decoration: AppTheme.brutalBox(
        color: AppColors.nbWhite,
        borderColor: AppColors.nbBlack,
        borderWidth: AppTheme.borderDefault,
        shadowOffset: 4,
      ),
      child: const Center(
        child: CircularProgressIndicator(
          color: AppColors.nbBlack,
          strokeWidth: 3,
        ),
      ),
    );
  }
}
