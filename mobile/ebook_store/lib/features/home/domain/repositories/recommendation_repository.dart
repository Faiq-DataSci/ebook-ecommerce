import '../../data/models/saw_recommendation_model.dart';
import '../../domain/models/ebook.dart';

abstract class RecommendationRepository {
  Future<Ebook> getFeaturedSawBook({String? categoryId});
  Future<List<SawRecommendationModel>> getSawRankingList({
    String? categoryId,
    int limit = 10,
  });
  Future<SawRankingResponse> getSawRankingWithCriteria({
    String? categoryId,
    int limit = 10,
  });
}
