import 'package:dio/dio.dart';
import '../../domain/entities/profile_failure.dart';
import '../models/user_profile_model.dart';

abstract class ProfileRemoteDataSource {
  Future<UserProfileModel> getProfile();
  Future<UserProfileModel> updateProfile({String? fullName, String? phone});
}

/// Memanggil `GET/PATCH /api/v1/users/me` lewat Dio terpusat (Bearer token
/// ditambahkan oleh interceptor di `dio_client.dart`).
class ProfileRemoteDataSourceImpl implements ProfileRemoteDataSource {
  final Dio dio;

  const ProfileRemoteDataSourceImpl({required this.dio});

  @override
  Future<UserProfileModel> getProfile() async {
    try {
      final response = await dio.get<Map<String, dynamic>>('/users/me');
      return _parse(response.data);
    } on DioException catch (e) {
      throw _mapError(e);
    }
  }

  @override
  Future<UserProfileModel> updateProfile({
    String? fullName,
    String? phone,
  }) async {
    final body = <String, dynamic>{};
    if (fullName != null) body['fullName'] = fullName;
    if (phone != null) body['phone'] = phone.isEmpty ? null : phone;

    try {
      final response = await dio.patch<Map<String, dynamic>>(
        '/users/me',
        data: body,
      );
      return _parse(response.data);
    } on DioException catch (e) {
      throw _mapError(e);
    }
  }

  UserProfileModel _parse(Map<String, dynamic>? body) {
    final data = body?['data'];
    if (data is Map<String, dynamic>) {
      return UserProfileModel.fromJson(data);
    }
    throw const ProfileFailure(
      message: 'Format respons profil dari server tidak dikenali.',
      code: 'INVALID_RESPONSE',
    );
  }

  /// Backend membungkus error sebagai
  /// `{ success:false, error:{ code, message, details:[{path,message}] } }`.
  ProfileFailure _mapError(DioException e) {
    final statusCode = e.response?.statusCode;
    final body = e.response?.data;
    final error = body is Map<String, dynamic> ? body['error'] : null;
    final serverMessage = error is Map<String, dynamic>
        ? error['message']?.toString()
        : null;

    if (statusCode == 401) return ProfileFailure.unauthenticated();
    if (statusCode == 403) return ProfileFailure.forbidden(serverMessage);
    if (statusCode == 404) return ProfileFailure.notFound(serverMessage);
    if (statusCode == 400) {
      final fieldErrors = <String, String>{};
      final details = error is Map<String, dynamic> ? error['details'] : null;
      if (details is List) {
        for (final item in details.whereType<Map<String, dynamic>>()) {
          final path = item['path']?.toString() ?? '';
          final message = item['message']?.toString();
          if (path.isNotEmpty && message != null) fieldErrors[path] = message;
        }
      }
      return ProfileFailure.validation(
        fieldErrors.isNotEmpty
            ? fieldErrors.values.join('\n')
            : (serverMessage ?? 'Data profil tidak valid.'),
        fieldErrors: fieldErrors,
      );
    }
    if (statusCode != null && statusCode >= 500) {
      return ProfileFailure.server();
    }
    return ProfileFailure.network();
  }
}
