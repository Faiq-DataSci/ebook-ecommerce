import '../../data/mock/home_mock_data.dart';
import '../../data/models/saw_recommendation_model.dart';
import '../../domain/models/ebook.dart';
import '../../domain/repositories/recommendation_repository.dart';
import '../datasources/recommendation_remote_datasource.dart';

class RecommendationRepositoryImpl implements RecommendationRepository {
  final RecommendationRemoteDataSource remoteDataSource;
  final bool useRemote;

  RecommendationRepositoryImpl({
    required this.remoteDataSource,
    this.useRemote = false,
  });

  @override
  Future<Ebook> getFeaturedSawBook({String? categoryId}) async {
    if (useRemote) {
      try {
        return await remoteDataSource.getTopSawRecommendation(
          categoryId: categoryId,
        );
      } catch (_) {
        // Fallback aman ke data simulasi berlabel "DATA SIMULASI" jika jaringan gagal (mobile/AGENTS.md)
        return HomeMockData.featuredSawBook;
      }
    }
    return HomeMockData.featuredSawBook;
  }

  @override
  Future<List<SawRecommendationModel>> getSawRankingList({
    String? categoryId,
    int limit = 10,
  }) async {
    if (useRemote) {
      try {
        final results = await remoteDataSource.getSawRankingList(
          categoryId: categoryId,
          limit: limit,
        );
        if (results.isNotEmpty) return results;
      } catch (_) {
        // Fallback aman ke data simulasi saat offline
      }
    }
    if (categoryId != null && categoryId.isNotEmpty && categoryId != 'semua') {
      return HomeMockData.simulationSawRankingList
          .where(
            (item) =>
                item.categoryName?.toLowerCase().contains(
                  categoryId.toLowerCase(),
                ) ??
                false,
          )
          .toList();
    }
    return HomeMockData.simulationSawRankingList;
  }
}
