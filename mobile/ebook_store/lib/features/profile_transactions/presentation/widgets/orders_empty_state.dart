import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import 'pt_controls.dart';

class OrdersEmptyState extends StatelessWidget {
  final VoidCallback onExploreCatalog;

  const OrdersEmptyState({super.key, required this.onExploreCatalog});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 32),
      decoration: AppTheme.brutalBox(
        color: AppColors.nbWhite,
        borderColor: AppColors.nbBlack,
        borderWidth: AppTheme.borderDefault,
        shadowOffset: 4,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Container(
            width: 64,
            height: 64,
            alignment: Alignment.center,
            decoration: AppTheme.brutalBox(
              color: AppColors.nbPaper,
              borderColor: AppColors.nbBlack,
              borderWidth: AppTheme.borderDefault,
              shadowOffset: 2,
            ),
            child: const Icon(
              Icons.receipt_long_outlined,
              size: 32,
              color: AppColors.nbBlack,
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'Belum Ada Pesanan',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontFamily: 'Inter',
              fontSize: 16,
              fontWeight: FontWeight.w900,
              color: AppColors.nbBlack,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Riwayat transaksi dan pembelian e-book Anda akan tercatat di sini setelah melakukan pemesanan.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontFamily: 'Inter',
              fontSize: 13,
              fontWeight: FontWeight.w400,
              color: AppColors.nbDisabledText,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 20),
          PtButton(
            key: const Key('orders_empty_explore_button'),
            label: 'Jelajahi Katalog',
            icon: Icons.menu_book,
            color: AppColors.nbYellow,
            expand: false,
            onTap: onExploreCatalog,
          ),
        ],
      ),
    );
  }
}
