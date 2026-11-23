import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/utils/rupiah_formatter.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../../cart/domain/entities/cart_item.dart';
import '../../../cart/presentation/providers/cart_provider.dart';
import '../../../catalog/presentation/pages/ebook_detail_screen.dart';
import '../../../home/data/models/saw_recommendation_model.dart';
import '../providers/saw_ranking_provider.dart';

/// Halaman Khusus Rekomendasi & Peringkat SPK SAW (Zona B/C — Google Stitch Neubrutalism).
/// Memvisualisasikan metode Simple Additive Weighting secara akademis:
/// 1. Dekonstruksi matriks normalisasi (r_ij) dan nilai preferensi (V_i).
/// 2. Pembuktian algoritma SAW berjalan nyata (backend) atau transparan (DATA SIMULASI).
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
            Container(
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
                          style: AppTheme.labelSm(
                            AppColors.nbBlack,
                            fontSize: 13,
                          ),
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
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: AppTheme.brutalBox(
                      color: state.isRemote
                          ? AppColors.nbGreen
                          : AppColors.nbOrange,
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
            ),
            Expanded(
              child: RefreshIndicator(
                onRefresh: () => notifier.fetchRankings(),
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // 1. Kartu Edukasi Akademis & Bobot Kriteria Aktif
                      _buildCriteriaInfoCard(),
                      const SizedBox(height: 16),

                      // 2. Filter Kategori E-Book
                      _buildCategoryFilterRow(state, notifier),
                      const SizedBox(height: 16),

                      // 3. Status Body (Loading / Empty / Error / Loaded)
                      _buildRankingContent(context, ref, state, notifier),
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

  Widget _buildCriteriaInfoCard() {
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
            child: const Text(
              'V_i = Σ (w_j * r_ij)  [w1=0.40, w2=0.35, w3=0.25]',
              style: TextStyle(
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
            children: [
              _buildCriteriaBadge('C1: Harga', 'COST 40%', AppColors.nbPink),
              _buildCriteriaBadge(
                'C2: Rating',
                'BENEFIT 35%',
                AppColors.nbLavender,
              ),
              _buildCriteriaBadge(
                'C3: Terjual',
                'BENEFIT 25%',
                AppColors.nbGreen,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCriteriaBadge(String label, String meta, Color color) {
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

  Widget _buildCategoryFilterRow(
    SawRankingState state,
    SawRankingNotifier notifier,
  ) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: _categories.map((cat) {
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
    BuildContext context,
    WidgetRef ref,
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
        return _buildRankCard(context, ref, item, isExpanded, notifier);
      },
    );
  }

  Widget _buildRankCard(
    BuildContext context,
    WidgetRef ref,
    SawRecommendationModel item,
    bool isExpanded,
    SawRankingNotifier notifier,
  ) {
    Color rankColor;
    if (item.rank == 1) {
      rankColor = AppColors.nbYellow;
    } else if (item.rank == 2) {
      rankColor = AppColors.nbLavender;
    } else if (item.rank == 3) {
      rankColor = AppColors.nbGreen;
    } else {
      rankColor = AppColors.nbPaper;
    }

    final priceInt = int.tryParse(item.price ?? '0') ?? 0;
    final formattedPrice = formatRupiah(priceInt);

    return Container(
      key: Key('saw_rank_card_${item.rank}'),
      decoration: AppTheme.brutalBox(
        color: AppColors.nbWhite,
        borderColor: AppColors.nbBlack,
        borderWidth: AppTheme.borderDefault,
        shadowOffset: 4,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Top Header Row
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Rank Badge Box
                Container(
                  width: 44,
                  height: 44,
                  alignment: Alignment.center,
                  decoration: AppTheme.brutalBox(
                    color: rankColor,
                    borderColor: AppColors.nbBlack,
                    borderWidth: AppTheme.borderDefault,
                    shadowOffset: 2,
                  ),
                  child: Text(
                    '#${item.rank}',
                    style: const TextStyle(
                      fontFamily: 'SpaceMono',
                      fontSize: 16,
                      fontWeight: FontWeight.w900,
                      color: AppColors.nbBlack,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (item.categoryName != null) ...[
                        Text(
                          item.categoryName!.toUpperCase(),
                          style: AppTheme.dataMono(
                            AppColors.nbTextMuted,
                            fontSize: 10,
                          ),
                        ),
                        const SizedBox(height: 2),
                      ],
                      Text(
                        item.title,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w900,
                          fontFamily: 'SpaceGrotesk',
                          color: AppColors.nbBlack,
                        ),
                      ),
                      if (item.author != null)
                        Text(
                          item.author!,
                          style: const TextStyle(
                            fontSize: 12,
                            color: AppColors.nbTextMuted,
                          ),
                        ),
                    ],
                  ),
                ),
                // Score Box
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.nbBlack,
                    border: Border.all(
                      color: AppColors.nbBlack,
                      width: AppTheme.borderThin,
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      const Text(
                        'SKOR V',
                        style: TextStyle(
                          fontFamily: 'SpaceMono',
                          fontSize: 8,
                          color: AppColors.nbYellow,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Text(
                        item.displayScore,
                        style: const TextStyle(
                          fontFamily: 'SpaceMono',
                          fontSize: 13,
                          fontWeight: FontWeight.w900,
                          color: AppColors.nbWhite,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Price & Category info strip
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: const BoxDecoration(
              color: AppColors.nbPaper,
              border: Border(
                top: BorderSide(
                  color: AppColors.nbBlack,
                  width: AppTheme.borderThin,
                ),
                bottom: BorderSide(
                  color: AppColors.nbBlack,
                  width: AppTheme.borderThin,
                ),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  formattedPrice,
                  style: AppTheme.dataMono(AppColors.nbBlack, fontSize: 13),
                ),
                const SizedBox(width: 8),
                Flexible(
                  child: InkWell(
                    key: Key('toggle_matrix_button_${item.rank}'),
                    onTap: () => notifier.toggleExpandMatrix(item.ebookId),
                    child: Text(
                      isExpanded
                          ? 'Sembunyikan Matriks ▲'
                          : 'Lihat Matriks Normalisasi ▼',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      textAlign: TextAlign.right,
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w900,
                        color: AppColors.nbBlack,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Accordion Matriks Normalisasi & Nilai Mentah
          if (isExpanded) _buildMatrixTable(item),

          // Action Buttons Row (Detail & Tambah Keranjang)
          Padding(
            padding: const EdgeInsets.all(10),
            child: Row(
              children: [
                Expanded(
                  child: InkWell(
                    key: Key('saw_detail_btn_${item.rank}'),
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) =>
                              EbookDetailScreen(ebookId: item.ebookId),
                        ),
                      );
                    },
                    child: Container(
                      height: 36,
                      alignment: Alignment.center,
                      decoration: AppTheme.brutalBox(
                        color: AppColors.nbWhite,
                        borderColor: AppColors.nbBlack,
                        borderWidth: AppTheme.borderDefault,
                        shadowOffset: 2,
                      ),
                      child: const Text(
                        'DETAIL BUKU',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w900,
                          color: AppColors.nbBlack,
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                InkWell(
                  key: Key('saw_add_cart_btn_${item.rank}'),
                  onTap: () {
                    final cartItem = CartItem(
                      id: item.ebookId,
                      title: item.title,
                      author: item.author ?? 'Penulis E-Book',
                      pageCount: 320,
                      category: item.categoryName ?? 'Teknologi',
                      sawRankLabel: 'Rank #${item.rank} SAW',
                      price: priceInt,
                      ratingAvg: 4.8,
                      isSelected: true,
                    );
                    ref.read(cartProvider.notifier).addItem(cartItem);

                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        backgroundColor: AppColors.nbGreen,
                        content: Text(
                          '${item.title} ditambahkan ke keranjang!',
                          style: const TextStyle(
                            color: AppColors.nbBlack,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    );
                  },
                  child: Container(
                    height: 36,
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    alignment: Alignment.center,
                    decoration: AppTheme.brutalBox(
                      color: AppColors.nbYellow,
                      borderColor: AppColors.nbBlack,
                      borderWidth: AppTheme.borderDefault,
                      shadowOffset: 2,
                    ),
                    child: const Row(
                      children: [
                        Icon(
                          Icons.add_shopping_cart,
                          size: 16,
                          color: AppColors.nbBlack,
                        ),
                        SizedBox(width: 4),
                        Text(
                          '+ BELI',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w900,
                            color: AppColors.nbBlack,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMatrixTable(SawRecommendationModel item) {
    final raw = item.rawValues;
    final norm = item.normalizedValues;

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
              _buildMatrixRow(
                'C1: Harga',
                '${raw['C1'] ?? item.price ?? '-'}',
                norm['C1'] != null
                    ? (norm['C1'] as num).toDouble().toStringAsFixed(3)
                    : '-',
                '0.40',
                norm['C1'] != null
                    ? ((norm['C1'] as num) * 0.40).toStringAsFixed(3)
                    : '-',
              ),
              _buildMatrixRow(
                'C2: Rating',
                '${raw['C2'] ?? '4.8'}',
                norm['C2'] != null
                    ? (norm['C2'] as num).toDouble().toStringAsFixed(3)
                    : '-',
                '0.35',
                norm['C2'] != null
                    ? ((norm['C2'] as num) * 0.35).toStringAsFixed(3)
                    : '-',
              ),
              _buildMatrixRow(
                'C3: Terjual',
                '${raw['C3'] ?? '1200'}',
                norm['C3'] != null
                    ? (norm['C3'] as num).toDouble().toStringAsFixed(3)
                    : '-',
                '0.25',
                norm['C3'] != null
                    ? ((norm['C3'] as num) * 0.25).toStringAsFixed(3)
                    : '-',
              ),
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
              style: style,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}
