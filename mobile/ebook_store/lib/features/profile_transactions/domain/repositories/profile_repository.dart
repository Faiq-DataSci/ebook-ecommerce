import '../entities/user_profile_entity.dart';

abstract class ProfileRepository {
  /// `GET /api/v1/users/me`.
  Future<UserProfileEntity> getProfile();

  /// `PATCH /api/v1/users/me`. Hanya bidang yang non-null yang dikirim.
  /// [phone] berisi string kosong berarti nomor telepon dikosongkan.
  Future<UserProfileEntity> updateProfile({String? fullName, String? phone});
}
