import 'package:dio/dio.dart';
import '../../domain/entities/checkout_failure.dart';
import '../models/order_model.dart';

abstract class CheckoutRemoteDataSource {
  Future<OrderModel> createOrder(List<String> ebookIds);
  Future<OrderModel> getOrderById(String orderId);
  Future<List<OrderModel>> getMyOrders({int page = 1, int limit = 10});
}

class CheckoutRemoteDataSourceImpl implements CheckoutRemoteDataSource {
  final Dio dio;

  const CheckoutRemoteDataSourceImpl({required this.dio});

  @override
  Future<OrderModel> createOrder(List<String> ebookIds) async {
    try {
      final response = await dio.post<Map<String, dynamic>>(
        '/orders',
        data: <String, dynamic>{'ebookIds': ebookIds},
      );

      final body = response.data;
      final data = body?['data'];

      // Backend returns { order: ..., payment: ... } or direct order
      if (data is Map<String, dynamic>) {
        final orderMap = data['order'] is Map<String, dynamic>
            ? data['order'] as Map<String, dynamic>
            : data;
        return OrderModel.fromJson(orderMap);
      }

      throw const CheckoutFailure(
        message: 'Format data respons pembuatan pesanan tidak dikenali.',
      );
    } on DioException catch (e) {
      _handleDioError(e);
    } catch (e) {
      if (e is CheckoutFailure) rethrow;
      throw CheckoutFailure(message: 'Gagal membuat pesanan: $e');
    }
  }

  @override
  Future<OrderModel> getOrderById(String orderId) async {
    try {
      final response = await dio.get<Map<String, dynamic>>('/orders/$orderId');
      final data = response.data?['data'];
      if (data is Map<String, dynamic>) {
        return OrderModel.fromJson(data);
      }
      throw const CheckoutFailure(
        message: 'Data rincian pesanan tidak ditemukan di server.',
        code: 'NOT_FOUND',
        statusCode: 404,
      );
    } on DioException catch (e) {
      _handleDioError(e);
    } catch (e) {
      if (e is CheckoutFailure) rethrow;
      throw CheckoutFailure(message: 'Gagal mengambil status pesanan: $e');
    }
  }

  @override
  Future<List<OrderModel>> getMyOrders({int page = 1, int limit = 10}) async {
    try {
      final response = await dio.get<Map<String, dynamic>>(
        '/orders/me',
        queryParameters: <String, dynamic>{'page': page, 'limit': limit},
      );
      final data = response.data?['data'];
      if (data is List) {
        return data
            .whereType<Map<String, dynamic>>()
            .map(OrderModel.fromJson)
            .toList();
      }
      return const <OrderModel>[];
    } on DioException catch (e) {
      _handleDioError(e);
    } catch (e) {
      if (e is CheckoutFailure) rethrow;
      throw CheckoutFailure(message: 'Gagal memuat riwayat pesanan: $e');
    }
  }

  Never _handleDioError(DioException e) {
    final statusCode = e.response?.statusCode;
    final responseData = e.response?.data;
    String? serverMsg;
    if (responseData is Map<String, dynamic>) {
      serverMsg = responseData['message']?.toString();
    }

    if (statusCode == 401) {
      throw CheckoutFailure.unauthenticated(
        serverMsg ?? 'Sesi Anda telah berakhir. Silakan masuk kembali.',
      );
    }
    if (statusCode == 409) {
      throw CheckoutFailure.conflict(
        serverMsg ?? 'Anda sudah memiliki salah satu e-book yang dipilih.',
      );
    }
    if (statusCode == 400) {
      throw CheckoutFailure.validation(
        serverMsg ?? 'Permintaan pesanan tidak valid.',
      );
    }
    if (statusCode != null && statusCode >= 500) {
      throw CheckoutFailure.server(
        serverMsg ?? 'Terjadi kesalahan sistem di server pusat.',
      );
    }

    throw CheckoutFailure.network(
      e.message ?? 'Gagal menghubungi server. Periksa koneksi internet Anda.',
    );
  }
}
