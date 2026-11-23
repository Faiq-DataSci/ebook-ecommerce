import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ebook_store/features/auth/domain/entities/user_entity.dart';
import 'package:ebook_store/features/auth/domain/repositories/auth_repository.dart';
import 'package:ebook_store/features/auth/presentation/providers/auth_provider.dart';
import 'package:ebook_store/features/splash/presentation/pages/splash_screen.dart';

class FakeAuthRepositoryForSplash implements AuthRepository {
  final UserEntity? cachedUser;

  FakeAuthRepositoryForSplash({this.cachedUser});

  @override
  Future<UserEntity?> getCurrentUser() async => cachedUser;

  @override
  Future<UserEntity> login({
    required String email,
    required String password,
    bool rememberMe = false,
  }) async {
    throw UnimplementedError();
  }

  @override
  Future<void> logout() async {}

  @override
  Future<UserEntity> register({
    required String fullName,
    required String email,
    required String password,
  }) async {
    throw UnimplementedError();
  }
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  final mockSavedUser = UserEntity(
    id: 'supa-user-saved-001',
    email: 'reader@example.com',
    fullName: 'Raden Saleh',
    role: UserRole.customer,
    isActive: true,
  );

  group('P1.2 Auto-Login / Session Restore di SplashScreen', () {
    testWidgets(
      'SplashScreen memicu checkSession dan memulihkan status authenticated saat boot',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        final fakeRepo = FakeAuthRepositoryForSplash(cachedUser: mockSavedUser);

        late WidgetRef capturedRef;

        await tester.pumpWidget(
          ProviderScope(
            overrides: [authRepositoryProvider.overrideWithValue(fakeRepo)],
            child: Consumer(
              builder: (context, ref, child) {
                capturedRef = ref;
                return MaterialApp(
                  home: SplashScreen(
                    totalDuration: const Duration(milliseconds: 200),
                    autoNavigate: false,
                  ),
                );
              },
            ),
          ),
        );

        // Awalnya unauthenticated sebelum post-frame callback
        await tester.pump();
        await tester.pump(const Duration(milliseconds: 100));

        // State autentikasi berhasil dipulihkan secara otomatis
        final authState = capturedRef.read(authNotifierProvider);
        expect(authState.isAuthenticated, isTrue);
        expect(authState.user?.fullName, 'Raden Saleh');
        expect(authState.user?.email, 'reader@example.com');
      },
    );

    testWidgets(
      'SplashScreen tetap unauthenticated jika tidak ada sesi tersimpan',
      (WidgetTester tester) async {
        await tester.binding.setSurfaceSize(const Size(390, 884));

        final fakeRepo = FakeAuthRepositoryForSplash(cachedUser: null);

        late WidgetRef capturedRef;

        await tester.pumpWidget(
          ProviderScope(
            overrides: [authRepositoryProvider.overrideWithValue(fakeRepo)],
            child: Consumer(
              builder: (context, ref, child) {
                capturedRef = ref;
                return MaterialApp(
                  home: SplashScreen(
                    totalDuration: const Duration(milliseconds: 200),
                    autoNavigate: false,
                  ),
                );
              },
            ),
          ),
        );

        await tester.pump();
        await tester.pump(const Duration(milliseconds: 100));

        final authState = capturedRef.read(authNotifierProvider);
        expect(authState.isAuthenticated, isFalse);
        expect(authState.user, isNull);
      },
    );
  });
}
