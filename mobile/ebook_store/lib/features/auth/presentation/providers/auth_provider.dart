import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/dio_client.dart';
import '../../data/datasources/auth_local_datasource.dart';
import '../../data/datasources/auth_remote_datasource.dart';
import '../../data/repositories/auth_repository_impl.dart';
import '../../domain/entities/auth_failure.dart';
import '../../domain/repositories/auth_repository.dart';
import 'auth_state.dart';

final authLocalDataSourceProvider = Provider<AuthLocalDataSource>((ref) {
  return AuthLocalDataSourceImpl();
});

final authRemoteDataSourceProvider = Provider<AuthRemoteDataSource>((ref) {
  final dio = ref.watch(dioClientProvider);
  return AuthRemoteDataSourceImpl(dio: dio);
});

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final remote = ref.watch(authRemoteDataSourceProvider);
  final local = ref.watch(authLocalDataSourceProvider);
  return AuthRepositoryImpl(remoteDataSource: remote, localDataSource: local);
});

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepository _repository;

  AuthNotifier(this._repository) : super(const AuthState.initial());

  Future<void> login({
    required String email,
    required String password,
    bool rememberMe = false,
  }) async {
    // 1. Basic validation
    final trimmedEmail = email.trim();
    if (trimmedEmail.isEmpty) {
      state = AuthState.error(
        AuthFailure.invalidInput(message: 'Alamat email wajib diisi.'),
      );
      return;
    }

    final emailRegex = RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$');
    if (!emailRegex.hasMatch(trimmedEmail)) {
      state = AuthState.error(
        AuthFailure.invalidInput(message: 'Format alamat email tidak valid.'),
      );
      return;
    }

    if (password.isEmpty) {
      state = AuthState.error(
        AuthFailure.invalidInput(message: 'Kata sandi tidak boleh kosong.'),
      );
      return;
    }

    if (password.length < 8) {
      state = AuthState.error(
        AuthFailure.invalidInput(message: 'Kata sandi minimal 8 karakter.'),
      );
      return;
    }

    // 2. Set loading state
    state = const AuthState.loading();

    // 3. Perform authentication
    try {
      final user = await _repository.login(
        email: trimmedEmail,
        password: password,
        rememberMe: rememberMe,
      );
      state = AuthState.authenticated(user);
    } on AuthFailure catch (f) {
      state = AuthState.error(f);
    } catch (e) {
      state = AuthState.error(
        AuthFailure.serverError(message: 'Gagal memproses autentikasi: $e'),
      );
    }
  }

  Future<bool> register({
    required String fullName,
    required String email,
    required String password,
    required String confirmPassword,
    required bool agreeTerms,
  }) async {
    final cleanFullName = fullName.trim();
    if (cleanFullName.isEmpty) {
      state = AuthState.error(
        AuthFailure.invalidInput(
          title: 'Validasi Nama',
          message: 'Nama lengkap wajib diisi.',
        ),
      );
      return false;
    }

    final trimmedEmail = email.trim();
    if (trimmedEmail.isEmpty) {
      state = AuthState.error(
        AuthFailure.invalidInput(
          title: 'Validasi Email',
          message: 'Alamat email wajib diisi.',
        ),
      );
      return false;
    }

    final emailRegex = RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$');
    if (!emailRegex.hasMatch(trimmedEmail)) {
      state = AuthState.error(
        AuthFailure.invalidInput(
          title: 'Format Email Salah',
          message: 'Format alamat email tidak valid.',
        ),
      );
      return false;
    }

    if (password.isEmpty) {
      state = AuthState.error(
        AuthFailure.invalidInput(
          title: 'Validasi Kata Sandi',
          message: 'Kata sandi tidak boleh kosong.',
        ),
      );
      return false;
    }

    if (password.length < 8) {
      state = AuthState.error(
        AuthFailure.invalidInput(
          title: 'Kata Sandi Terlalu Pendek',
          message: 'Kata sandi minimal 8 karakter.',
        ),
      );
      return false;
    }

    if (password != confirmPassword) {
      state = AuthState.error(
        AuthFailure.invalidInput(
          title: 'Kata Sandi Berbeda',
          message: 'Konfirmasi kata sandi belum sama persis.',
        ),
      );
      return false;
    }

    if (!agreeTerms) {
      state = AuthState.error(
        AuthFailure.invalidInput(
          title: 'Persetujuan Diperlukan',
          message:
              'Harap setujui Syarat Lisensi E-Book & Kebijakan Privasi untuk melanjutkan.',
        ),
      );
      return false;
    }

    state = const AuthState.loading();

    try {
      final user = await _repository.register(
        fullName: cleanFullName,
        email: trimmedEmail,
        password: password,
      );
      state = AuthState.authenticated(user);
      return true;
    } on AuthFailure catch (f) {
      state = AuthState.error(f);
      return false;
    } catch (e) {
      state = AuthState.error(
        AuthFailure.serverError(message: 'Gagal memproses pendaftaran: $e'),
      );
      return false;
    }
  }

  void clearError() {
    if (state.hasError) {
      state = const AuthState.unauthenticated();
    }
  }

  Future<void> logout() async {
    state = const AuthState.loading();
    await _repository.logout();
    state = const AuthState.unauthenticated();
  }

  Future<void> checkSession() async {
    final cached = await _repository.getCurrentUser();
    if (cached != null) {
      state = AuthState.authenticated(cached);
    } else {
      state = const AuthState.unauthenticated();
    }
  }
}

final authNotifierProvider =
    StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final repository = ref.watch(authRepositoryProvider);
  return AuthNotifier(repository);
});
