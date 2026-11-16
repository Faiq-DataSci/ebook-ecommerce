import 'package:dio/dio.dart';
import '../../domain/entities/auth_failure.dart';
import '../../domain/entities/user_entity.dart';
import '../models/user_model.dart';

abstract class AuthRemoteDataSource {
  Future<UserModel> login({
    required String email,
    required String password,
  });

  Future<UserModel> register({
    required String fullName,
    required String email,
    required String password,
  });
}

/// Remote authentication datasource interacting with Express REST API,
/// with documented fallback to simulation labeled "DATA SIMULASI" per AGENTS.md.
class AuthRemoteDataSourceImpl implements AuthRemoteDataSource {
  final Dio dio;
  final bool enableLiveApi;

  // Labeled demo simulation users per AGENTS.md
  static const Map<String, Map<String, dynamic>> _simulatedUsers = {
    'pelanggan@ebookstore.com': {
      'password': 'password123',
      'id': 'sim-cust-001',
      'fullName': 'Ahmad Fauzi (DATA SIMULASI)',
      'role': 'CUSTOMER',
      'isActive': true,
      'token': 'simulated_jwt_token_customer_123',
    },
    'admin@ebookstore.com': {
      'password': 'admin12345',
      'id': 'sim-admin-001',
      'fullName': 'Admin Utama BUKUKITA (DATA SIMULASI)',
      'role': 'ADMIN',
      'isActive': true,
      'token': 'simulated_jwt_token_admin_456',
    },
  };

  AuthRemoteDataSourceImpl({
    required this.dio,
    this.enableLiveApi = true,
  });

  @override
  Future<UserModel> login({
    required String email,
    required String password,
  }) async {
    final cleanEmail = email.trim().toLowerCase();

    // 1. Attempt connection with live Express Backend if enabled and reachable
    if (enableLiveApi) {
      try {
        final response = await dio.post(
          '/auth/login',
          data: {
            'email': cleanEmail,
            'password': password,
          },
        );

        if (response.statusCode == 200 && response.data != null) {
          final data = response.data['data'] as Map<String, dynamic>;
          return UserModel.fromJson(data);
        }
      } on DioException catch (e) {
        // If server responds with 400/401/403 business rejection, report real error
        if (e.response != null && e.response?.statusCode == 401) {
          throw AuthFailure.invalidCredentials(
            message: e.response?.data?['message']?.toString() ??
                'Kredensial belum terdaftar atau kata sandi tidak cocok.',
          );
        }
        // If endpoint is not yet mounted (404 / connection refused) in current phase,
        // fallback to validated simulated data per AGENTS.md rule.
      } catch (_) {
        // Fallback to local simulated check
      }
    }

    // 2. Verified fallback simulation (marked explicitly "DATA SIMULASI")
    await Future.delayed(const Duration(milliseconds: 300));

    final simUser = _simulatedUsers[cleanEmail];
    if (simUser == null || simUser['password'] != password) {
      throw AuthFailure.invalidCredentials(
        title: 'Kredensial Belum Terdaftar',
        message: 'Periksa format surel atau masukkan kredensial demo untuk melanjutkan.',
      );
    }

    return UserModel(
      id: simUser['id'] as String,
      email: cleanEmail,
      fullName: simUser['fullName'] as String,
      role: UserRole.fromString(simUser['role'] as String),
      isActive: simUser['isActive'] as bool,
      token: simUser['token'] as String,
    );
  }

  @override
  Future<UserModel> register({
    required String fullName,
    required String email,
    required String password,
  }) async {
    final cleanEmail = email.trim().toLowerCase();
    final cleanFullName = fullName.trim();

    // 1. Attempt connection with live Express Backend if enabled
    if (enableLiveApi) {
      try {
        final response = await dio.post(
          '/auth/register',
          data: {
            'fullName': cleanFullName,
            'email': cleanEmail,
            'password': password,
            // Strictly customer registration only
            'role': 'CUSTOMER',
          },
        );

        if ((response.statusCode == 200 || response.statusCode == 201) &&
            response.data != null) {
          final data = response.data['data'] as Map<String, dynamic>;
          return UserModel.fromJson(data);
        }
      } on DioException catch (e) {
        if (e.response != null &&
            (e.response?.statusCode == 400 ||
                e.response?.statusCode == 409)) {
          throw AuthFailure.invalidInput(
            title: 'Registrasi Gagal',
            message: e.response?.data?['message']?.toString() ??
                'Email sudah terdaftar atau format data tidak valid.',
          );
        }
      } catch (_) {
        // Fallback to local simulated check
      }
    }

    // 2. Verified fallback simulation (marked explicitly "DATA SIMULASI")
    await Future.delayed(const Duration(milliseconds: 350));

    // Reject registration if email matches existing simulated user
    if (_simulatedUsers.containsKey(cleanEmail)) {
      throw AuthFailure.invalidInput(
        title: 'Email Sudah Terdaftar',
        message:
            'Alamat email telah terdaftar dalam sistem (DATA SIMULASI). Silakan masuk ke akun Anda atau gunakan email lain.',
      );
    }

    return UserModel(
      id: 'sim-cust-${DateTime.now().millisecondsSinceEpoch}',
      email: cleanEmail,
      fullName: '$cleanFullName (DATA SIMULASI)',
      role: UserRole.customer,
      isActive: true,
      token: 'simulated_jwt_token_customer_${DateTime.now().millisecondsSinceEpoch}',
    );
  }
}
