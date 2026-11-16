import '../entities/user_entity.dart';

/// Contract for authentication operations in the mobile client.
abstract class AuthRepository {
  /// Authenticates a user with email and password.
  /// If [rememberMe] is true, session credentials/token are persisted securely.
  Future<UserEntity> login({
    required String email,
    required String password,
    bool rememberMe = false,
  });

  /// Logs out the user and clears all cached secure credentials.
  Future<void> logout();

  /// Retrieves the currently cached/authenticated user, if any.
  Future<UserEntity?> getCurrentUser();
}
