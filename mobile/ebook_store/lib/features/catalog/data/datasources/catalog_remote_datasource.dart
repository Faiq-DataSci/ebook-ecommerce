import 'package:dio/dio.dart';
import '../../domain/entities/catalog_failure.dart';
import '../../domain/entities/catalog_filter.dart';
import '../../domain/entities/catalog_page.dart';
import '../models/catalog_category_model.dart';
import '../models/catalog_ebook_model.dart';

abstract class CatalogRemoteDataSource {
  Future<List<CatalogCategoryModel>> getCategories();
  Future<CatalogPage> getEbooks({
    required CatalogFilter filter,
    int page = 1,
    int limit = 20,
  });
  Future<CatalogEbookModel> getEbookById(String id);
}

class CatalogRemoteDataSourceImpl implements CatalogRemoteDataSource {
  final Dio dio;

  CatalogRemoteDataSourceImpl({required this.dio});

  @override
  Future<List<CatalogCategoryModel>> getCategories() async {
    try {
      final response = await dio.get('/categories');
      if (response.statusCode == 200 && response.data != null) {
        final dynamic rawData = response.data['data'];
        if (rawData is List) {
          return rawData
              .map(
                (item) =>
                    CatalogCategoryModel.fromJson(item as Map<String, dynamic>),
              )
              .toList();
        }
      }
      return const [];
    } on DioException catch (e) {
      throw _handleDioError(e);
    } catch (_) {
      throw const CatalogFailure.unknown();
    }
  }

  @override
  Future<CatalogPage> getEbooks({
    required CatalogFilter filter,
    int page = 1,
    int limit = 20,
  }) async {
    try {
      final queryParams = <String, dynamic>{'page': page, 'limit': limit};

      if (filter.searchQuery.trim().isNotEmpty) {
        queryParams['search'] = filter.searchQuery.trim();
      }
      if (filter.categoryId != null &&
          filter.categoryId!.isNotEmpty &&
          filter.categoryId != 'semua') {
        queryParams['categoryId'] = filter.categoryId;
      }
      if ((filter.author ?? '').trim().isNotEmpty) {
        queryParams['author'] = filter.author!.trim();
      }
      if (filter.minPrice != null) {
        queryParams['minPrice'] = filter.minPrice;
      }
      if (filter.maxPrice != null) {
        queryParams['maxPrice'] = filter.maxPrice;
      }
      if (filter.minRating != null && filter.minRating! > 0) {
        queryParams['minRating'] = filter.minRating;
      }
      queryParams['sort'] = filter.sort.apiValue;

      final response = await dio.get('/ebooks', queryParameters: queryParams);

      if (response.statusCode == 200 && response.data != null) {
        final dynamic rawList = response.data['data'];
        final dynamic rawMeta = response.data['meta'];

        final items = <CatalogEbookModel>[];
        if (rawList is List) {
          for (final item in rawList) {
            if (item is Map<String, dynamic>) {
              items.add(CatalogEbookModel.fromJson(item));
            }
          }
        }

        final metaPage = (rawMeta is Map<String, dynamic>)
            ? (rawMeta['page'] as num?)?.toInt() ?? page
            : page;
        final metaLimit = (rawMeta is Map<String, dynamic>)
            ? (rawMeta['limit'] as num?)?.toInt() ?? limit
            : limit;
        final metaTotal = (rawMeta is Map<String, dynamic>)
            ? (rawMeta['total'] as num?)?.toInt() ?? items.length
            : items.length;
        final metaTotalPages = (rawMeta is Map<String, dynamic>)
            ? (rawMeta['totalPages'] as num?)?.toInt() ??
                  (metaTotal / metaLimit).ceil().clamp(1, 9999)
            : 1;

        return CatalogPage(
          items: items,
          page: metaPage,
          limit: metaLimit,
          total: metaTotal,
          totalPages: metaTotalPages,
        );
      }

      return CatalogPage(
        items: const [],
        page: page,
        limit: limit,
        total: 0,
        totalPages: 1,
      );
    } on DioException catch (e) {
      throw _handleDioError(e);
    } catch (_) {
      throw const CatalogFailure.unknown();
    }
  }

  @override
  Future<CatalogEbookModel> getEbookById(String id) async {
    try {
      final response = await dio.get('/ebooks/$id');
      if (response.statusCode == 200 && response.data != null) {
        final dynamic rawData = response.data['data'];
        if (rawData is Map<String, dynamic>) {
          return CatalogEbookModel.fromJson(rawData);
        }
      }
      throw const CatalogFailure.notFound();
    } on DioException catch (e) {
      throw _handleDioError(e);
    } catch (e) {
      if (e is CatalogFailure) rethrow;
      throw const CatalogFailure.unknown();
    }
  }

  CatalogFailure _handleDioError(DioException error) {
    if (error.type == DioExceptionType.connectionTimeout ||
        error.type == DioExceptionType.receiveTimeout ||
        error.type == DioExceptionType.sendTimeout ||
        error.type == DioExceptionType.connectionError) {
      return const CatalogFailure.network();
    }

    final statusCode = error.response?.statusCode;
    if (statusCode == 404) {
      return const CatalogFailure.notFound();
    } else if (statusCode == 400) {
      return const CatalogFailure.invalidRequest();
    } else if (statusCode != null && statusCode >= 500) {
      return const CatalogFailure.server();
    }
    return const CatalogFailure.network();
  }
}
