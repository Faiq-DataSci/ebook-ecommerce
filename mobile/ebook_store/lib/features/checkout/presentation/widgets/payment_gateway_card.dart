import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

class PaymentGatewayCard extends StatelessWidget {
  final String selectedMethod;
  final ValueChanged<String> onSelectMethod;

  const PaymentGatewayCard({
    super.key,
    required this.selectedMethod,
    required this.onSelectMethod,
  });

  static const List<Map<String, String>> _methods = <Map<String, String>>[
    {
      'name': 'BCA Virtual Account',
      'desc': 'Verifikasi otomatis 24 jam via Midtrans',
      'icon': '🏦',
    },
    {
      'name': 'Mandiri Virtual Account',
      'desc': 'Verifikasi otomatis via Midtrans',
      'icon': '🏦',
    },
    {
      'name': 'BNI Virtual Account',
      'desc': 'Verifikasi otomatis via Midtrans',
      'icon': '🏦',
    },
    {
      'name': 'QRIS (Gopay / ShopeePay / Dana)',
      'desc': 'Scan QR Code langsung dari smartphone',
      'icon': '📱',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const Key('payment_gateway_card'),
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
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: <Widget>[
              Expanded(
                child: Text(
                  'METODE PEMBAYARAN',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: AppTheme.brutalBox(
                  color: AppColors.nbBlue,
                  borderColor: AppColors.nbBlack,
                  borderWidth: AppTheme.borderThin,
                  shadowOffset: 1,
                ),
                child: Text(
                  'MIDTRANS GATEWAY',
                  style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 10),
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            'Pilih kanal pembayaran resmi yang tersedia:',
            style: AppTheme.bodySm(AppColors.nbTextMuted, fontSize: 12),
          ),
          const SizedBox(height: 12),
          for (final method in _methods) ...[
            _buildMethodTile(
              name: method['name']!,
              desc: method['desc']!,
              iconText: method['icon']!,
              isSelected: selectedMethod == method['name'],
              onTap: () => onSelectMethod(method['name']!),
            ),
            const SizedBox(height: 8),
          ],
        ],
      ),
    );
  }

  Widget _buildMethodTile({
    required String name,
    required String desc,
    required String iconText,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return InkWell(
      key: Key('payment_method_$name'),
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: AppTheme.brutalBox(
          color: isSelected ? AppColors.nbYellow : AppColors.nbPaper,
          borderColor: AppColors.nbBlack,
          borderWidth: isSelected
              ? AppTheme.borderDefault
              : AppTheme.borderThin,
          shadowOffset: isSelected ? 3 : 1,
        ),
        child: Row(
          children: <Widget>[
            Text(iconText, style: const TextStyle(fontSize: 18)),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Text(
                    name,
                    style: AppTheme.labelSm(AppColors.nbBlack, fontSize: 13),
                  ),
                  Text(
                    desc,
                    style: AppTheme.bodySm(AppColors.nbTextMuted, fontSize: 11),
                  ),
                ],
              ),
            ),
            Container(
              width: 18,
              height: 18,
              decoration: BoxDecoration(
                color: isSelected ? AppColors.nbBlack : AppColors.nbWhite,
                border: Border.all(color: AppColors.nbBlack, width: 2),
              ),
              child: isSelected
                  ? const Icon(Icons.check, size: 14, color: AppColors.nbWhite)
                  : null,
            ),
          ],
        ),
      ),
    );
  }
}
