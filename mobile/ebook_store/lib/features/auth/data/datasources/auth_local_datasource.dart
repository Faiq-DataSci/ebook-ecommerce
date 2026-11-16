import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/user_model.dart';

abstract class AuthLocalDataSource {
  Future<void> saveToken(String token);
  Future<String?> getToken();
  Future<void> saveUser(UserModel user);
  Future<UserModel?> getUser();
  Future<void> clearAuth();
}

/// Secure storage implementation persisting auth tokens and session data.
class AuthLocalDataSourceImpl implements AuthLocalDataSource {
  final FlutterSecureStorage _secureStorage;
  static const String _keyToken = 'auth_jwt_token';
  static const String _keyUser = 'auth_cached_user';

  // In-memory cache fallback for testing or platform without native keystore
  final Map<String, String> _memoryCache = <String, String>{};

  AuthLocalDataSourceImpl({FlutterSecureStorage? secureStorage})
      : _secureStorage = secureStorage ?? const FlutterSecureStorage();

  @override
  Future<void> saveToken(String token) async {
    _memoryCache[_keyToken] = token;
    try {
      await _secureStorage.write(key: _keyToken, value: token);
    } catch (_) {
      // Memory fallback in headless test environments
    }
  }

  @override
  Future<String?> getToken() async {
    try {
      final token = await _secureStorage.read(key: _keyToken);
      if (token != null) return token;
    } catch (_) {
      // Memory fallback
    }
    return _memoryCache[_keyToken];
  }

  @override
  Future<void> saveUser(UserModel user) async {
    final userJson = jsonEncode(user.toJson());
    _memoryCache[_keyUser] = userJson;
    try {
      await _secureStorage.write(key: _keyUser, value: userJson);
    } catch (_) {
      // Memory fallback
    }
  }

  @override
  Future<UserModel?> getUser() async {
    try {
      final raw = await _secureStorage.read(key: _keyUser);
      if (raw != null) {
        return UserModel.fromJson(jsonDecode(raw) as Map<String, dynamic>);
      }
    } catch (_) {
      // Memory fallback
    }

    final memRaw = _memoryCache[_keyUser];
    if (memRaw != null) {
      return UserModel.fromJson(jsonDecode(memRaw) as Map<String, dynamic>);
    }
    return null;
  }

  @override
  Future<void> clearAuth() async {
    _memoryCache.clear();
    try {
      await _secureStorage.delete(key: _keyToken);
      await _secureStorage.delete(key: _keyUser);
    } catch (_) {
      // Ignored
    }
  }
}

/// In-memory mock implementation of AuthLocalDataSource for fast testing.
class InMemoryAuthLocalDataSource implements AuthLocalDataSource {
  String? _token;
  UserModel? _user;

  @override
  Future<void> saveToken(String token) async => _token = token;

  @override
  Future<String?> getToken() async => _token;

  @override
  Future<void> saveUser(UserModel user) async => _user = user;

  @override
  Future<UserModel?> getUser() async => _user;

  @override
  Future<void> clearAuth() async {
    _token = null;
    _user = null;
  }
}
