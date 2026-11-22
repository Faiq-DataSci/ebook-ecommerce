import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../providers/checkout_state.dart';

class CheckoutStepper extends StatelessWidget {
  final CheckoutStep currentStep;

  const CheckoutStepper({super.key, required this.currentStep});

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const Key('checkout_stepper'),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: const BoxDecoration(
        color: AppColors.nbPaper,
        border: Border(
          bottom: BorderSide(
            color: AppColors.nbBlack,
            width: AppTheme.borderDefault,
          ),
        ),
      ),
      child: Row(
        children: <Widget>[
          _buildStepItem(
            stepNumber: 1,
            title: 'Tinjau',
            isActive: currentStep == CheckoutStep.review,
            isCompleted:
                currentStep == CheckoutStep.payment ||
                currentStep == CheckoutStep.completed,
          ),
          _buildDivider(),
          _buildStepItem(
            stepNumber: 2,
            title: 'Bayar',
            isActive: currentStep == CheckoutStep.payment,
            isCompleted: currentStep == CheckoutStep.completed,
          ),
          _buildDivider(),
          _buildStepItem(
            stepNumber: 3,
            title: 'Selesai',
            isActive: currentStep == CheckoutStep.completed,
            isCompleted: false,
          ),
        ],
      ),
    );
  }

  Widget _buildDivider() {
    return Expanded(
      child: Container(
        height: 2,
        margin: const EdgeInsets.symmetric(horizontal: 8),
        color: AppColors.nbBlack,
      ),
    );
  }

  Widget _buildStepItem({
    required int stepNumber,
    required String title,
    required bool isActive,
    required bool isCompleted,
  }) {
    Color bg;
    Widget iconOrNum;

    if (isCompleted) {
      bg = AppColors.nbGreen;
      iconOrNum = const Icon(Icons.check, size: 14, color: AppColors.nbBlack);
    } else if (isActive) {
      bg = AppColors.nbYellow;
      iconOrNum = Text(
        '$stepNumber',
        style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 13),
      );
    } else {
      bg = AppColors.nbMuted;
      iconOrNum = Text(
        '$stepNumber',
        style: AppTheme.dataMono(AppColors.nbDisabledText, fontSize: 13),
      );
    }

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        Container(
          width: 28,
          height: 28,
          alignment: Alignment.center,
          decoration: AppTheme.brutalBox(
            color: bg,
            borderColor: AppColors.nbBlack,
            borderWidth: AppTheme.borderDefault,
            shadowOffset: isActive ? 2 : 0,
          ),
          child: iconOrNum,
        ),
        const SizedBox(height: 4),
        Text(
          title,
          style: AppTheme.labelSm(
            isActive ? AppColors.nbBlack : AppColors.nbTextMuted,
            fontSize: 11,
          ),
        ),
      ],
    );
  }
}
