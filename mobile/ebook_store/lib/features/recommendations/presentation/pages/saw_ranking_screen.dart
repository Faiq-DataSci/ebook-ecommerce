import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/config/api_config.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../../catalog/presentation/providers/catalog_provider.dart';
import '../providers/saw_ranking_provider.dart';
import '../widgets/saw_criteria_info_card.dart';
import '../widgets/saw_rank_card.dart';

/// Halaman Khusus Rekomendasi & Peringkat SPK SAW (Zona B/C — Google Stitch Neubrutalism).
class SawRankingScreen extends ConsumerWidget {
  const SawRankingScreen({super.key});

  static const List<Map<String, String>> _categories = [
    {'id': 'semua', 'label': 'Semua Kategori'},
    {'id': 'teknologi', 'label': 'Teknologi & AI'},
    {'id': 'bisnis', 'label': 'Bisnis & Finansial'},
    {'id': 'desain', 'label': 'Desain & UI/UX'},
    {'id': 'sains', 'label': 'Sains & Riset'},
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(sawRankingProvider);
    final notifier = ref.read(sawRankingProvider.notifier);

    return Scaffold(
      backgroundColor: AppColors.nbPaper,
      body: SafeArea(
        child: Column(
          children: [
            _buildTopHeader(context, state),
            Expanded(
              child: RefreshIndicator(
                onRefresh: () => notifier.fetchRankings(),
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SawCriteriaInfoCard(activeCriteria: state.activeCriteria),
                      const SizedBox(height: 16),
                      _buildCategoryFilterRow(ref, state, notifier),
                      const SizedBox(height: 16),
                      _buildRankingContent(state, notifier),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTopHeader(BuildContext context, SawRankingState state) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.nbWhite,
        border: Border(
          bottom: BorderSide(
            color: AppColors.nbBlack,
            width: AppTheme.borderDefault,
          ),
        ),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          InkWell(
            key: const Key('saw_ranking_back_button'),
            onTap: () => Navigator.of(context).maybePop(),
            child: Container(
              width: 38,
              height: 38,
              alignment: Alignment.center,
              decoration: AppTheme.brutalBox(
                color: AppColors.nbPaper,
                borderColor: AppColors.nbBlack,
                borderWidth: AppTheme.borderDefault,
                shadowOffset: 2,
              ),
              child: const Icon(
                Icons.arrow_back,
                size: 20,
                color: AppColors.nbBlack,
              ),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'SPK REKOMENDASI SAW',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppTheme.labelSm(AppColors.nbBlack, fontSize: 13),
                ),
                Text(
                  'SIMPLE ADDITIVE WEIGHTING // TOP-N',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: AppTheme.dataMono(
                    AppColors.nbTextMuted,
                    fontSize: 9.5,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: AppTheme.brutalBox(
              color: state.isRemote ? AppColors.nbGreen : AppColors.nbOrange,
              borderColor: AppColors.nbBlack,
              borderWidth: AppTheme.borderThin,
              shadowOffset: 2,
            ),
            child: Text(
              state.isRemote ? 'SPK AKTIF' : 'DATA SIMULASI',
              style: const TextStyle(
                fontFamily: 'SpaceMono',
                fontSize: 10,
                fontWeight: FontWeight.w900,
                color: AppColors.nbBlack,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCategoryFilterRow(
    WidgetRef ref,
    SawRankingState state,
    SawRankingNotifier notifier,
  ) {
    final List<Map<String, String>> filterCategories;
    if (ApiConfig.useRemoteCatalog && state.isRemote) {
      final catalogState = ref.watch(catalogProvider);
      filterCategories =
          (!catalogState.isMock && catalogState.categories.isNotEmpty)
          ? <Map<String, String>>[
              {'id': 'semua', 'label': 'Semua Kategori'},
              ...catalogState.categories.map(
                (c) => <String, String>{'id': c.id, 'label': c.name},
              ),
            ]
          : _categories;
    } else {
      filterCategories = _categories;
    }

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: filterCategories.map((cat) {
          final isSelected = state.selectedCategory == cat['id'];
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: InkWell(
              key: Key('filter_category_${cat['id']}'),
              onTap: () => notifier.filterCategory(cat['id']!),
              child: Container(
                height: 38,
                padding: const EdgeInsets.symmetric(horizontal: 14),
                alignment: Alignment.center,
                decoration: AppTheme.brutalBox(
                  color: isSelected ? AppColors.nbBlack : AppColors.nbWhite,
                  borderColor: AppColors.nbBlack,
                  borderWidth: AppTheme.borderDefault,
                  shadowOffset: isSelected ? 0 : 2,
                ),
                child: Text(
                  cat['label']!,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: isSelected ? AppColors.nbWhite : AppColors.nbBlack,
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  Widget _buildRankingContent(
    SawRankingState state,
    SawRankingNotifier notifier,
  ) {
    if (state.status == SawRankingStatus.loading) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.symmetric(vertical: 40),
          child: CircularProgressIndicator(color: AppColors.nbBlack),
        ),
      );
    }

    if (state.status == SawRankingStatus.error) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(16),
        decoration: AppTheme.brutalBox(
          color: AppColors.nbPink,
          borderColor: AppColors.nbBlack,
          borderWidth: AppTheme.borderDefault,
          shadowOffset: 4,
        ),
        child: Column(
          children: [
            const Icon(Icons.error_outline, size: 32, color: AppColors.nbBlack),
            const SizedBox(height: 8),
            Text(
              state.errorMessage ?? 'Gagal memuat daftar peringkat SAW.',
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                color: AppColors.nbBlack,
              ),
            ),
            const SizedBox(height: 12),
            ElevatedButton(
              onPressed: () => notifier.fetchRankings(),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.nbBlack,
                foregroundColor: AppColors.nbWhite,
              ),
              child: const Text('COBA LAGI'),
            ),
          ],
        ),
      );
    }

    if (state.status == SawRankingStatus.empty || state.rankings.isEmpty) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(24),
        decoration: AppTheme.brutalBox(
          color: AppColors.nbWhite,
          borderColor: AppColors.nbBlack,
          borderWidth: AppTheme.borderDefault,
          shadowOffset: 3,
        ),
        child: const Column(
          children: [
            Icon(Icons.inbox_outlined, size: 40, color: AppColors.nbTextMuted),
            SizedBox(height: 8),
            Text(
              'Tidak ada e-book untuk kategori ini',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 14,
                color: AppColors.nbBlack,
              ),
            ),
          ],
        ),
      );
    }

    return ListView.separated(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: state.rankings.length,
      separatorBuilder: (context, index) => const SizedBox(height: 14),
      itemBuilder: (context, index) {
        final item = state.rankings[index];
        final isExpanded = state.expandedEbookIds.contains(item.ebookId);
        return SawRankCard(
          item: item,
          isExpanded: isExpanded,
          activeCriteria: state.activeCriteria,
          onToggleMatrix: () => notifier.toggleExpandMatrix(item.ebookId),
        );
      },
    );
  }
}
