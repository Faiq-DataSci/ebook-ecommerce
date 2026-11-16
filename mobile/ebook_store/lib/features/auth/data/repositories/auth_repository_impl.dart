import '../../domain/entities/user_entity.dart';
import '../../domain/repositories/auth_repository.dart';
import '../datasources/auth_local_datasource.dart';
import '../datasources/auth_remote_datasource.dart';

/// Implementation of AuthRepository binding remote datasource and local secure storage.
class AuthRepositoryImpl implements AuthRepository {
  final AuthRemoteDataSource remoteDataSource;
  final AuthLocalDataSource localDataSource;

  AuthRepositoryImpl({
    required this.remoteDataSource,
    required this.localDataSource,
  });

  @override
  Future<UserEntity> login({
    required String email,
    required String password,
    bool rememberMe = false,
  }) async {
    final user = await remoteDataSource.login(
      email: email,
      password: password,
    );

    if (rememberMe && user.token != null) {
      await localDataSource.saveToken(user.token!);
      await localDataSource.saveUser(user);
    } else {
      await localDataSource.clearAuth();
    }

    return user;
  }

  @override
  Future<void> logout() async {
    await localDataSource.clearAuth();
  }

  @override
  Future<UserEntity?> getCurrentUser() async {
    return await localDataSource.getUser();
  }
}
