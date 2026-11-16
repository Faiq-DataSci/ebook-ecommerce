import '../../domain/entities/auth_failure.dart';
import '../../domain/entities/user_entity.dart';

enum AuthStatus {
  initial,
  loading,
  authenticated,
  unauthenticated,
  error,
}

/// State representation for authentication workflows.
class AuthState {
  final AuthStatus status;
  final UserEntity? user;
  final AuthFailure? failure;

  const AuthState({
    required this.status,
    this.user,
    this.failure,
  });

  const AuthState.initial()
      : status = AuthStatus.initial,
        user = null,
        failure = null;

  const AuthState.loading()
      : status = AuthStatus.loading,
        user = null,
        failure = null;

  const AuthState.authenticated(this.user)
      : status = AuthStatus.authenticated,
        failure = null;

  const AuthState.unauthenticated()
      : status = AuthStatus.unauthenticated,
        user = null,
        failure = null;

  const AuthState.error(this.failure)
      : status = AuthStatus.error,
        user = null;

  bool get isLoading => status == AuthStatus.loading;
  bool get isAuthenticated => status == AuthStatus.authenticated && user != null;
  bool get hasError => status == AuthStatus.error && failure != null;

  AuthState copyWith({
    AuthStatus? status,
    UserEntity? user,
    AuthFailure? failure,
  }) {
    return AuthState(
      status: status ?? this.status,
      user: user ?? this.user,
      failure: failure ?? this.failure,
    );
  }
}
