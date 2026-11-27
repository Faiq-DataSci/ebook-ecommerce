import 'package:dio/dio.dart';
import '../../domain/models/ebook.dart';
import '../models/saw_recommendation_model.dart';

abstract class RecommendationRemoteDataSource {
  Future<Ebook> getTopSawRecommendation({String? categoryId});
  Future<List<SawRecommendationModel>> getSawRankingList({
    String? categoryId,
    int limit = 10,
  });
  Future<SawRankingResponse> getSawRankingWithCriteria({
    String? categoryId,
    int limit = 10,
  });
}

class RecommendationRemoteDataSourceImpl
    implements RecommendationRemoteDataSource {
  final Dio dio;

  RecommendationRemoteDataSourceImpl({required this.dio});

  @override
  Future<Ebook> getTopSawRecommendation({String? categoryId}) async {
    try {
      final queryParams = <String, dynamic>{'limit': 1};
      if (categoryId != null &&
          categoryId.isNotEmpty &&
          categoryId != 'semua') {
        queryParams['categoryId'] = categoryId;
      }

      final response = await dio.get(
        '/recommendations/saw',
        queryParameters: queryParams,
      );

      if (response.statusCode == 200 && response.data != null) {
        final dynamic rawData = response.data['data'];
        if (rawData is List && rawData.isNotEmpty) {
          final firstItem = rawData.first as Map<String, dynamic>;
          return SawRecommendationModel.fromJson(firstItem).toEbook();
        }
      }
      throw Exception('Data rekomendasi kosong dari server');
    } on DioException {
      rethrow;
    } catch (e) {
      throw Exception('Gagal mengurai respons rekomendasi SAW: $e');
    }
  }

  @override
  Future<List<SawRecommendationModel>> getSawRankingList({
    String? categoryId,
    int limit = 10,
  }) async {
    final result = await getSawRankingWithCriteria(
      categoryId: categoryId,
      limit: limit,
    );
    return result.items;
  }

  @override
  Future<SawRankingResponse> getSawRankingWithCriteria({
    String? categoryId,
    int limit = 10,
  }) async {
    try {
      final queryParams = <String, dynamic>{'limit': limit};
      if (categoryId != null &&
          categoryId.isNotEmpty &&
          categoryId != 'semua') {
        queryParams['categoryId'] = categoryId;
      }

      final response = await dio.get(
        '/recommendations/saw',
        queryParameters: queryParams,
      );

      if (response.statusCode == 200 && response.data != null) {
        final dynamic rawData = response.data['data'];
        final dynamic rawMeta = response.data['meta'];

        List<SawCriterionModel> parsedCriteria =
            SawCriterionModel.defaultCriteria;
        if (rawMeta is Map && rawMeta['activeCriteria'] is List) {
          final metaList = rawMeta['activeCriteria'] as List;
          if (metaList.isNotEmpty) {
            parsedCriteria = metaList
                .map(
                  (c) => SawCriterionModel.fromJson(c as Map<String, dynamic>),
                )
                .toList();
          }
        }

        if (rawData is List) {
          final items = rawData
              .map(
                (e) =>
                    SawRecommendationModel.fromJson(e as Map<String, dynamic>),
              )
              .toList();
          return SawRankingResponse(
            items: items,
            activeCriteria: parsedCriteria,
            isRemote: true,
          );
        }
      }
      return const SawRankingResponse(
        items: <SawRecommendationModel>[],
        isRemote: true,
      );
    } on DioException {
      rethrow;
    } catch (e) {
      throw Exception('Gagal mengurai respons ranking SAW: $e');
    }
  }
}
