import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../data/datasources/cart_mock_datasource.dart';

class CartDigitalNotice extends StatelessWidget {
  final bool isMock;

  const CartDigitalNotice({super.key, this.isMock = true});

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const Key('cart_digital_notice'),
      width: double.infinity,
      padding: const EdgeInsets.all(10),
      decoration: AppTheme.brutalBox(
        color: AppColors.nbBlue,
        borderColor: AppColors.nbBlack,
        borderWidth: AppTheme.borderDefault,
        shadowOffset: 4,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          Container(
            width: 28,
            height: 28,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: AppColors.nbWhite,
              border: Border.all(
                color: AppColors.nbBlack,
                width: AppTheme.borderDefault,
              ),
            ),
            child: const Icon(
              Icons.verified_outlined,
              size: 18,
              color: AppColors.nbBlack,
            ),
          ),
          const SizedBox(width: AppTheme.spaceSm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Wrap(
                  spacing: 6,
                  runSpacing: 4,
                  crossAxisAlignment: WrapCrossAlignment.center,
                  children: <Widget>[
                    Text(
                      'INFORMASI PRODUK DIGITAL',
                      style: AppTheme.labelSm(
                        AppColors.nbBlack,
                        fontSize: 12,
                      ).copyWith(letterSpacing: 0.4),
                    ),
                    if (isMock)
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 6,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.nbOrange,
                          border: Border.all(
                            color: AppColors.nbBlack,
                            width: AppTheme.borderThin,
                          ),
                        ),
                        child: Text(
                          CartMockDataSourceImpl.simulationBadge,
                          style: AppTheme.dataMono(
                            AppColors.nbBlack,
                            fontSize: 10,
                          ),
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 3),
                Text(
                  'Akses langsung ditambahkan ke Pustaka setelah pembayaran terverifikasi. Tidak ada biaya kirim fisik.',
                  style: AppTheme.bodySm(
                    AppColors.nbBlack,
                    fontSize: 13,
                  ).copyWith(height: 1.35),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
