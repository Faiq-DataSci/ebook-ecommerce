import '../../domain/entities/profile_failure.dart';
import '../models/user_profile_model.dart';
import 'profile_remote_datasource.dart';

/// Sumber data simulasi (`DATA SIMULASI`) yang dipakai ketika aplikasi tidak
/// diarahkan ke API langsung (`CATALOG_SOURCE=remote`).
class ProfileMockDataSource implements ProfileRemoteDataSource {
  static const String simulationLabel = 'DATA SIMULASI';

  UserProfileModel _profile = const UserProfileModel(
    id: 'sim-user-001',
    email: 'simulasi@ebookstore.test',
    fullName: 'Pengguna Simulasi',
  );

  @override
  Future<UserProfileModel> getProfile() async => _profile;

  @override
  Future<UserProfileModel> updateProfile({
    String? fullName,
    String? phone,
  }) async {
    final trimmedName = fullName?.trim();
    if (trimmedName != null &&
        (trimmedName.length < 2 || trimmedName.length > 120)) {
      throw ProfileFailure.validation(
        'Nama lengkap harus 2 sampai 120 karakter.',
        fieldErrors: const <String, String>{
          'fullName': 'Nama lengkap harus 2 sampai 120 karakter.',
        },
      );
    }
    final trimmedPhone = phone?.trim();
    if (trimmedPhone != null && trimmedPhone.length > 25) {
      throw ProfileFailure.validation(
        'Nomor telepon maksimal 25 karakter.',
        fieldErrors: const <String, String>{
          'phone': 'Nomor telepon maksimal 25 karakter.',
        },
      );
    }

    _profile = UserProfileModel(
      id: _profile.id,
      email: _profile.email,
      fullName: trimmedName ?? _profile.fullName,
      phone: trimmedPhone == null
          ? _profile.phone
          : (trimmedPhone.isEmpty ? null : trimmedPhone),
    );
    return _profile;
  }
}
