import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../../home/data/models/saw_recommendation_model.dart';

class SawMatrixTable extends StatelessWidget {
  final SawRecommendationModel item;
  final List<SawCriterionModel> activeCriteria;

  const SawMatrixTable({
    super.key,
    required this.item,
    required this.activeCriteria,
  });

  @override
  Widget build(BuildContext context) {
    final raw = item.rawValues;
    final norm = item.normalizedValues;
    final criteriaList = activeCriteria.isNotEmpty
        ? activeCriteria
        : SawCriterionModel.defaultCriteria;

    return Container(
      key: Key('matrix_table_${item.rank}'),
      margin: const EdgeInsets.all(10),
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        color: AppColors.nbPaper,
        border: Border.all(
          color: AppColors.nbBlack,
          width: AppTheme.borderDefault,
        ),
      ),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: SizedBox(
          width: 370,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'DEKONSTRUKSI MATRIKS KEPUTUSAN & NORMALISASI:',
                style: TextStyle(
                  fontFamily: 'SpaceMono',
                  fontSize: 10,
                  fontWeight: FontWeight.w900,
                  color: AppColors.nbBlack,
                ),
              ),
              const SizedBox(height: 8),
              _buildMatrixRow(
                'Kriteria',
                'Mentah (x_ij)',
                'Norm (r_ij)',
                'Bobot',
                'Sub-Skor',
                isHeader: true,
              ),
              const Divider(color: AppColors.nbBlack, thickness: 1),
              ...criteriaList.map((crit) {
                final rawVal = raw[crit.id] ?? raw[crit.field];
                final normVal = norm[crit.id];
                final normDouble = normVal is num ? normVal.toDouble() : null;
                final subScore = normDouble != null
                    ? (normDouble * crit.weight).toStringAsFixed(3)
                    : '-';

                return _buildMatrixRow(
                  '${crit.id}: ${crit.name}',
                  rawVal != null ? '$rawVal' : '-',
                  normDouble != null ? normDouble.toStringAsFixed(3) : '-',
                  crit.weight.toStringAsFixed(2),
                  subScore,
                );
              }),
              const Divider(color: AppColors.nbBlack, thickness: 1),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Flexible(
                    child: Text(
                      'Total Nilai Preferensi (V_i):',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w900,
                        fontFamily: 'SpaceGrotesk',
                        color: AppColors.nbBlack,
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    item.displayScore,
                    style: const TextStyle(
                      fontSize: 12,
                      fontFamily: 'SpaceMono',
                      fontWeight: FontWeight.w900,
                      color: AppColors.nbBlack,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMatrixRow(
    String col1,
    String col2,
    String col3,
    String col4,
    String col5, {
    bool isHeader = false,
  }) {
    final style = TextStyle(
      fontSize: 10,
      fontFamily: isHeader ? 'SpaceGrotesk' : 'SpaceMono',
      fontWeight: isHeader ? FontWeight.w900 : FontWeight.w500,
      color: AppColors.nbBlack,
    );

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 2),
      child: Row(
        children: [
          Expanded(
            flex: 3,
            child: Text(
              col1,
              style: style,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          Expanded(
            flex: 3,
            child: Text(
              col2,
              style: style,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          Expanded(
            flex: 2,
            child: Text(
              col3,
              style: style,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          Expanded(
            flex: 2,
            child: Text(
              col4,
              style: style,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          Expanded(
            flex: 2,
            child: Text(
              col5,
              textAlign: TextAlign.right,
              style: style.copyWith(fontWeight: FontWeight.w900),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}
