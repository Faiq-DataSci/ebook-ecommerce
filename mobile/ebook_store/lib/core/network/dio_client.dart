import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../features/auth/presentation/providers/auth_provider.dart';
import '../config/api_config.dart';

/// Centralized Dio HTTP client provider required by `mobile/AGENTS.md`.
final dioClientProvider = Provider<Dio>((ref) {
  final authLocalDataSource = ref.watch(authLocalDataSourceProvider);

  final dio = Dio(
    BaseOptions(
      baseUrl: ApiConfig.baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: const <String, String>{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    ),
  );

  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) async {
        // Jangan kirim token aplikasi ke host eksternal (mis. signed URL
        // Supabase Storage) yang sudah memiliki otorisasi sendiri.
        if (options.extra['skipAuth'] == true) {
          return handler.next(options);
        }
        try {
          final token = await authLocalDataSource.getToken();
          if (token != null &&
              token.isNotEmpty &&
              !options.headers.containsKey('Authorization')) {
            options.headers['Authorization'] = 'Bearer $token';
          }
        } catch (_) {
          // Fallback if local storage unavailable in tests
        }
        return handler.next(options);
      },
    ),
  );

  return dio;
});
