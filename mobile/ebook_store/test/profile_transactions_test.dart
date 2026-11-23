import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:ebook_store/features/auth/domain/entities/user_entity.dart';
import 'package:ebook_store/features/auth/domain/repositories/auth_repository.dart';
import 'package:ebook_store/features/auth/presentation/providers/auth_provider.dart';
import 'package:ebook_store/features/checkout/domain/entities/order_entity.dart';
import 'package:ebook_store/features/checkout/domain/repositories/checkout_repository.dart';
import 'package:ebook_store/features/checkout/presentation/providers/checkout_provider.dart';
import 'package:ebook_store/features/home/presentation/pages/home_screen.dart';
import 'package:ebook_store/features/profile_transactions/domain/entities/profile_failure.dart';
import 'package:ebook_store/features/profile_transactions/domain/entities/user_profile_entity.dart';
import 'package:ebook_store/features/profile_transactions/domain/repositories/profile_repository.dart';
import 'package:ebook_store/features/profile_transactions/presentation/pages/edit_profile_screen.dart';
import 'package:ebook_store/features/profile_transactions/presentation/pages/order_detail_screen.dart';
import 'package:ebook_store/features/profile_transactions/presentation/pages/profile_transactions_screen.dart';
import 'package:ebook_store/features/profile_transactions/presentation/providers/profile_transactions_providers.dart';
import 'package:ebook_store/features/profile_transactions/presentation/widgets/about_app_section.dart';
import 'package:ebook_store/features/profile_transactions/presentation/widgets/logout_confirm_dialog.dart';
import 'package:ebook_store/features/profile_transactions/presentation/widgets/orders_empty_state.dart';
import 'package:ebook_store/features/profile_transactions/presentation/widgets/profile_error_state.dart';

// ---------------------------------------------------------------------------
// Test Doubles
// ---------------------------------------------------------------------------

class FakeProfileRepository implements ProfileRepository {
  UserProfileEntity profile;
  bool shouldThrow;
  ProfileFailure? updateFailure;

  FakeProfileRepository({
    UserProfileEntity? profile,
    this.shouldThrow = false,
    this.updateFailure,
  }) : profile =
           profile ??
           const UserProfileEntity(
             id: 'user-001',
             email: 'budi.santoso@example.com',
             fullName: 'Budi Santoso',
             phone: '081234567890',
           );

  @override
  Future<UserProfileEntity> getProfile() async {
    if (shouldThrow) {
      throw ProfileFailure.server('Gagal memuat profil pelanggan');
    }
    return profile;
  }

  @override
  Future<UserProfileEntity> updateProfile({
    String? fullName,
    String? phone,
  }) async {
    if (updateFailure != null) {
      throw updateFailure!;
    }
    profile = profile.copyWith(fullName: fullName, phone: phone);
    return profile;
  }
}

class FakeCheckoutRepository implements CheckoutRepository {
  List<OrderEntity> orders;
  bool shouldThrow;

  FakeCheckoutRepository({List<OrderEntity>? orders, this.shouldThrow = false})
    : orders = orders ?? <OrderEntity>[];

  @override
  Future<OrderEntity> createOrder(List<String> ebookIds) async =>
      throw UnimplementedError();

  @override
  Future<OrderEntity> getOrderById(String orderId) async {
    if (shouldThrow) {
      throw Exception('Gagal memuat detail pesanan');
    }
    return orders.firstWhere(
      (o) => o.id == orderId,
      orElse: () => throw Exception('Pesanan tidak ditemukan'),
    );
  }

  @override
  Future<List<OrderEntity>> getMyOrders({int page = 1, int limit = 10}) async {
    if (shouldThrow) {
      throw Exception('Gagal menghubungi server database pesanan');
    }
    return orders;
  }

  @override
  Future<OrderEntity> simulatePaymentSuccess(String orderId) async =>
      throw UnimplementedError();
}

class FakeAuthRepository implements AuthRepository {
  bool logoutCalled = false;

  @override
  Future<UserEntity?> getCurrentUser() async => null;

  @override
  Future<UserEntity> login({
    required String email,
    required String password,
    bool rememberMe = false,
  }) async => throw UnimplementedError();

  @override
  Future<void> logout() async {
    logoutCalled = true;
  }

  @override
  Future<UserEntity> register({
    required String fullName,
    required String email,
    required String password,
  }) async => throw UnimplementedError();
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

Widget _buildTestableWidget({
  required Widget child,
  FakeProfileRepository? profileRepo,
  FakeCheckoutRepository? checkoutRepo,
  FakeAuthRepository? authRepo,
  bool isSimulated = false,
}) {
  final fakeProfile = profileRepo ?? FakeProfileRepository();
  final fakeCheckout = checkoutRepo ?? FakeCheckoutRepository();
  final fakeAuth = authRepo ?? FakeAuthRepository();

  return ProviderScope(
    overrides: [
      profileRepositoryProvider.overrideWithValue(fakeProfile),
      checkoutRepositoryProvider.overrideWithValue(fakeCheckout),
      authRepositoryProvider.overrideWithValue(fakeAuth),
      profileIsSimulatedProvider.overrideWithValue(isSimulated),
    ],
    child: MaterialApp(
      home: Scaffold(
        body: child,
      ),
    ),
  );
}

final _testOrderPending = OrderEntity(
  id: 'ord-101',
  userId: 'user-001',
  orderNumber: 'ORD-202410-001',
  totalAmount: 150000,
  status: OrderStatusEnum.pending,
  expiresAt: DateTime.now().add(const Duration(hours: 2)),
  createdAt: DateTime(2024, 10, 18, 14, 30),
  items: const [
    OrderItemEntity(
      id: 'item-1',
      ebookId: 'ebk-1',
      unitPrice: 150000,
      title: 'Pemrograman Flutter Modern',
      author: 'Ahmad Dahlan',
    ),
  ],
);

final _testOrderPaid = OrderEntity(
  id: 'ord-102',
  userId: 'user-001',
  orderNumber: 'ORD-202410-002',
  totalAmount: 95000,
  status: OrderStatusEnum.paid,
  expiresAt: DateTime.now().add(const Duration(hours: 2)),
  createdAt: DateTime(2024, 10, 17, 10, 15),
  items: const [
    OrderItemEntity(
      id: 'item-2',
      ebookId: 'ebk-2',
      unitPrice: 95000,
      title: 'Desain Sistem Neubrutalism',
      author: 'Siti Aminah',
    ),
  ],
);

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

void main() {
  group('Profile & Transactions Feature Tests', () {
    testWidgets(
      '1. Menampilkan profil terisi dengan inisial dan badge status aktif',
      (tester) async {
        final repo = FakeProfileRepository();

        await tester.pumpWidget(
          _buildTestableWidget(
            profileRepo: repo,
            child: const ProfileTransactionsScreen(isEmbedded: true),
          ),
        );
        await tester.pumpAndSettle();

        expect(find.text('Budi Santoso'), findsOneWidget);
        expect(find.text('budi.santoso@example.com'), findsOneWidget);
        expect(find.text('081234567890'), findsOneWidget);
        expect(find.text('BS'), findsOneWidget); // Inisial
        expect(find.text('AKUN AKTIF'), findsOneWidget);
        expect(find.text('Ubah Profil'), findsOneWidget);
      },
    );

    testWidgets('2. Menampilkan error state pada profil dan tombol coba lagi', (
      tester,
    ) async {
      final repo = FakeProfileRepository(shouldThrow: true);

      await tester.pumpWidget(
        _buildTestableWidget(
          profileRepo: repo,
          child: const ProfileTransactionsScreen(isEmbedded: true),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.byType(ProfileErrorState), findsWidgets);
      expect(find.text('Gagal memuat profil pelanggan'), findsOneWidget);
      expect(find.text('Coba Lagi'), findsWidgets);

      // Coba lagi setelah error diperbaiki
      repo.shouldThrow = false;
      await tester.tap(find.byKey(const Key('profile_retry_button')).first);
      await tester.pumpAndSettle();

      expect(find.text('Budi Santoso'), findsOneWidget);
    });

    testWidgets(
      '3. Form Ubah Profil memuat data awal, validasi gagal, dan sukses menyimpan',
      (tester) async {
        final repo = FakeProfileRepository();

        await tester.pumpWidget(
          _buildTestableWidget(
            profileRepo: repo,
            child: EditProfileScreen(initialProfile: repo.profile),
          ),
        );
        await tester.pumpAndSettle();

        // Cek field awal
        expect(find.text('Budi Santoso'), findsOneWidget);
        expect(find.text('081234567890'), findsOneWidget);

        // Kosongkan nama untuk menguji validasi
        await tester.enterText(
          find.byKey(const Key('edit_profile_name_field')),
          '',
        );
        await tester.tap(find.byKey(const Key('edit_profile_save_button')));
        await tester.pumpAndSettle();

        expect(find.text('Nama lengkap tidak boleh kosong.'), findsOneWidget);

        // Isi nama baru dan simpan
        await tester.enterText(
          find.byKey(const Key('edit_profile_name_field')),
          'Budi Santoso M.Kom',
        );
        await tester.tap(find.byKey(const Key('edit_profile_save_button')));
        await tester.pumpAndSettle();

        expect(repo.profile.fullName, 'Budi Santoso M.Kom');
      },
    );

    testWidgets(
      '4. Menampilkan empty state ketika riwayat pesanan kosong dengan CTA katalog',
      (tester) async {
        final checkoutRepo = FakeCheckoutRepository(orders: []);

        await tester.pumpWidget(
          _buildTestableWidget(
            checkoutRepo: checkoutRepo,
            child: const ProfileTransactionsScreen(isEmbedded: true),
          ),
        );
        await tester.pumpAndSettle();

        expect(find.byType(OrdersEmptyState), findsOneWidget);
        expect(find.text('Belum Ada Pesanan'), findsOneWidget);
        expect(find.text('Jelajahi Katalog'), findsOneWidget);
      },
    );

    testWidgets(
      '5. Menampilkan daftar pesanan dengan nomor monospace dan status badge',
      (tester) async {
        final checkoutRepo = FakeCheckoutRepository(
          orders: [_testOrderPending, _testOrderPaid],
        );

        await tester.pumpWidget(
          _buildTestableWidget(
            checkoutRepo: checkoutRepo,
            child: const ProfileTransactionsScreen(isEmbedded: true),
          ),
        );
        await tester.pumpAndSettle();

        expect(find.text('#ORD-202410-001'), findsOneWidget);
        expect(find.text('#ORD-202410-002'), findsOneWidget);
        expect(find.text('MENUNGGU PEMBAYARAN'), findsOneWidget);
        expect(find.text('LUNAS'), findsOneWidget);

        // Pesanan pending memiliki tombol 'Bayar Sekarang'
        expect(find.text('Bayar Sekarang'), findsOneWidget);
        // Pesanan paid memiliki tombol 'Buka di Pustaka'
        expect(find.text('Buka di Pustaka'), findsOneWidget);
      },
    );

    testWidgets('6. Filter chip menyaring pesanan sesuai status', (
      tester,
    ) async {
      final checkoutRepo = FakeCheckoutRepository(
        orders: [_testOrderPending, _testOrderPaid],
      );

      await tester.pumpWidget(
        _buildTestableWidget(
          checkoutRepo: checkoutRepo,
          child: const ProfileTransactionsScreen(isEmbedded: true),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('#ORD-202410-001'), findsOneWidget);
      expect(find.text('#ORD-202410-002'), findsOneWidget);

      // Ketuk filter 'Lunas'
      await tester.tap(find.byKey(const Key('filter_chip_paid')));
      await tester.pumpAndSettle();

      expect(find.text('#ORD-202410-001'), findsNothing);
      expect(find.text('#ORD-202410-002'), findsOneWidget);

      // Ketuk filter 'Semua'
      await tester.tap(find.byKey(const Key('filter_chip_all')));
      await tester.pumpAndSettle();

      expect(find.text('#ORD-202410-001'), findsOneWidget);
      expect(find.text('#ORD-202410-002'), findsOneWidget);
    });

    testWidgets(
      '7. Menampilkan dialog konfirmasi logout dan memanggil auth logout',
      (tester) async {
        final authRepo = FakeAuthRepository();

        await tester.pumpWidget(
          _buildTestableWidget(
            authRepo: authRepo,
            child: const ProfileTransactionsScreen(isEmbedded: true),
          ),
        );
        await tester.pumpAndSettle();

        // Ketuk tombol logout di header
        await tester.tap(find.byKey(const Key('profile_logout_icon_button')));
        await tester.pumpAndSettle();

        expect(find.byType(LogoutConfirmDialog), findsOneWidget);
        expect(find.text('Keluar dari Akun?'), findsOneWidget);

        // Ketuk 'Ya, Keluar'
        await tester.tap(find.byKey(const Key('dialog_confirm_logout_button')));
        await tester.pumpAndSettle();

        expect(authRepo.logoutCalled, isTrue);
      },
    );

    testWidgets(
      '8. Menampilkan banner DATA SIMULASI ketika dalam mode simulasi',
      (tester) async {
        await tester.pumpWidget(
          _buildTestableWidget(
            isSimulated: true,
            child: const ProfileTransactionsScreen(isEmbedded: true),
          ),
        );
        await tester.pumpAndSettle();

        expect(find.byType(AboutAppSection), findsOneWidget);
        expect(find.textContaining('DATA SIMULASI:'), findsOneWidget);
      },
    );

    testWidgets('9. Layar Detail Pesanan memuat rincian dan daftar item', (
      tester,
    ) async {
      final checkoutRepo = FakeCheckoutRepository(orders: [_testOrderPending]);

      await tester.pumpWidget(
        _buildTestableWidget(
          checkoutRepo: checkoutRepo,
          child: OrderDetailScreen(
            orderId: _testOrderPending.id,
            initialOrder: _testOrderPending,
          ),
        ),
      );
      await tester.pumpAndSettle();

      expect(find.byKey(const Key('detail_order_number')), findsOneWidget);
      expect(find.text('#ORD-202410-001'), findsOneWidget);
      expect(find.text('Pemrograman Flutter Modern'), findsOneWidget);
      expect(find.text('Ahmad Dahlan'), findsOneWidget);
      expect(find.text('Subtotal E-Book'), findsOneWidget);
      expect(find.text('Total Tagihan'), findsOneWidget);
      expect(find.text('Lanjutkan Pembayaran'), findsOneWidget);
    });

    testWidgets(
      '10. Tab Profil pada HomeScreen menampilkan ProfileTransactionsScreen',
      (tester) async {
        await tester.pumpWidget(
          _buildTestableWidget(child: const HomeScreen()),
        );
        await tester.pumpAndSettle();

        // Pilih tab index 3 (Profil)
        final bottomNav = find.byType(BottomNavigationBar);
        if (bottomNav.evaluate().isNotEmpty) {
          await tester.tap(find.text('Profil'));
          await tester.pumpAndSettle();
        } else {
          // HomeBottomNavigation menggunakan InkWell custom
          await tester.tap(find.text('Profil'));
          await tester.pumpAndSettle();
        }

        expect(find.byType(ProfileTransactionsScreen), findsOneWidget);
      },
    );
  });
}
