import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../../home/data/models/saw_recommendation_model.dart';

class SawCriteriaInfoCard extends StatelessWidget {
  final List<SawCriterionModel> activeCriteria;

  const SawCriteriaInfoCard({super.key, required this.activeCriteria});

  @override
  Widget build(BuildContext context) {
    final criteriaList = activeCriteria.isNotEmpty
        ? activeCriteria
        : SawCriterionModel.defaultCriteria;
    final weightFormula = criteriaList
        .asMap()
        .entries
        .map((e) => 'w${e.key + 1}=${e.value.weight.toStringAsFixed(2)}')
        .join(', ');

    const badgePalette = <Color>[
      AppColors.nbPink,
      AppColors.nbLavender,
      AppColors.nbGreen,
      AppColors.nbWhite,
      AppColors.nbOrange,
    ];

    return Container(
      key: const Key('saw_criteria_info_card'),
      width: double.infinity,
      padding: const EdgeInsets.all(14),
      decoration: AppTheme.brutalBox(
        color: AppColors.nbYellow,
        borderColor: AppColors.nbBlack,
        borderWidth: AppTheme.borderDefault,
        shadowOffset: 4,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(
                Icons.analytics_outlined,
                size: 20,
                color: AppColors.nbBlack,
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  'Konfigurasi Kriteria & Bobot Aktif',
                  style: AppTheme.labelMd(AppColors.nbBlack),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          const Text(
            'Rekomendasi dihitung di backend menggunakan metode SAW dengan rumus preferensi:',
            style: TextStyle(
              fontSize: 12,
              fontFamily: 'Inter',
              color: AppColors.nbBlack,
            ),
          ),
          const SizedBox(height: 6),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: AppColors.nbWhite,
              border: Border.all(
                color: AppColors.nbBlack,
                width: AppTheme.borderThin,
              ),
            ),
            child: Text(
              'V_i = Σ (w_j * r_ij)  [$weightFormula]',
              style: const TextStyle(
                fontFamily: 'SpaceMono',
                fontSize: 11,
                fontWeight: FontWeight.bold,
                color: AppColors.nbBlack,
              ),
            ),
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 6,
            children: criteriaList.asMap().entries.map((entry) {
              final crit = entry.value;
              final pct = (crit.weight * 100).round();
              final badgeColor = crit.type == 'COST'
                  ? AppColors.nbPink
                  : badgePalette[entry.key % badgePalette.length];
              return _SawCriteriaBadge(
                label: '${crit.id}: ${crit.name}',
                meta: '${crit.type} $pct%',
                color: badgeColor,
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}

class _SawCriteriaBadge extends StatelessWidget {
  final String label;
  final String meta;
  final Color color;

  const _SawCriteriaBadge({
    required this.label,
    required this.meta,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color,
        border: Border.all(
          color: AppColors.nbBlack,
          width: AppTheme.borderThin,
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: AppColors.nbBlack,
            ),
          ),
          const SizedBox(width: 4),
          Text(
            '($meta)',
            style: const TextStyle(
              fontSize: 10,
              fontFamily: 'SpaceMono',
              color: AppColors.nbBlack,
            ),
          ),
        ],
      ),
    );
  }
}
