import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/config/api_config.dart';
import '../../../home/data/models/saw_recommendation_model.dart';
import '../../../home/domain/repositories/recommendation_repository.dart';
import '../../../home/presentation/providers/home_provider.dart';

enum SawRankingStatus { loading, loaded, empty, error }

class SawRankingState {
  final SawRankingStatus status;
  final List<SawRecommendationModel> rankings;
  final List<SawCriterionModel> activeCriteria;
  final String selectedCategory;
  final String? errorMessage;
  final bool isRemote;
  final Set<String> expandedEbookIds;

  const SawRankingState({
    this.status = SawRankingStatus.loaded,
    this.rankings = const <SawRecommendationModel>[],
    this.activeCriteria = SawCriterionModel.defaultCriteria,
    this.selectedCategory = 'semua',
    this.errorMessage,
    this.isRemote = false,
    this.expandedEbookIds = const <String>{},
  });

  SawRankingState copyWith({
    SawRankingStatus? status,
    List<SawRecommendationModel>? rankings,
    List<SawCriterionModel>? activeCriteria,
    String? selectedCategory,
    String? errorMessage,
    bool clearError = false,
    bool? isRemote,
    Set<String>? expandedEbookIds,
  }) {
    return SawRankingState(
      status: status ?? this.status,
      rankings: rankings ?? this.rankings,
      activeCriteria: activeCriteria ?? this.activeCriteria,
      selectedCategory: selectedCategory ?? this.selectedCategory,
      errorMessage: clearError ? null : (errorMessage ?? this.errorMessage),
      isRemote: isRemote ?? this.isRemote,
      expandedEbookIds: expandedEbookIds ?? this.expandedEbookIds,
    );
  }
}

class SawRankingNotifier extends StateNotifier<SawRankingState> {
  final RecommendationRepository repository;
  final bool isRemoteConfig;

  SawRankingNotifier({
    required this.repository,
    bool isRemote = false,
    bool autoFetch = true,
  }) : isRemoteConfig = isRemote,
       super(SawRankingState(isRemote: isRemote)) {
    if (autoFetch) {
      fetchRankings();
    }
  }

  Future<void> fetchRankings({String? categoryId}) async {
    final cat = categoryId ?? state.selectedCategory;
    state = state.copyWith(status: SawRankingStatus.loading, clearError: true);

    try {
      final response = await repository.getSawRankingWithCriteria(
        categoryId: cat == 'semua' ? null : cat,
        limit: 10,
      );

      state = state.copyWith(
        status: response.items.isEmpty
            ? SawRankingStatus.empty
            : SawRankingStatus.loaded,
        rankings: response.items,
        activeCriteria: response.activeCriteria.isNotEmpty
            ? response.activeCriteria
            : SawCriterionModel.defaultCriteria,
        selectedCategory: cat,
        isRemote: isRemoteConfig || response.isRemote,
        clearError: true,
      );
    } catch (e) {
      state = state.copyWith(
        status: SawRankingStatus.error,
        errorMessage: 'Gagal memuat peringkat SAW: $e',
      );
    }
  }

  void filterCategory(String categoryId) {
    if (state.selectedCategory == categoryId) return;
    fetchRankings(categoryId: categoryId);
  }

  void toggleExpandMatrix(String ebookId) {
    final newSet = Set<String>.from(state.expandedEbookIds);
    if (newSet.contains(ebookId)) {
      newSet.remove(ebookId);
    } else {
      newSet.add(ebookId);
    }
    state = state.copyWith(expandedEbookIds: newSet);
  }
}

final sawRankingProvider =
    StateNotifierProvider<SawRankingNotifier, SawRankingState>((ref) {
      final repo = ref.watch(recommendationRepositoryProvider);
      return SawRankingNotifier(
        repository: repo,
        isRemote: ApiConfig.useRemoteRecommendation,
      );
    });
