import '../../domain/entities/user_profile_entity.dart';

class UserProfileModel extends UserProfileEntity {
  const UserProfileModel({
    required super.id,
    required super.email,
    required super.fullName,
    super.phone,
  });

  factory UserProfileModel.fromJson(Map<String, dynamic> json) {
    final rawPhone = json['phone'];
    final phone = rawPhone is String && rawPhone.trim().isNotEmpty
        ? rawPhone.trim()
        : null;
    return UserProfileModel(
      id: json['id']?.toString() ?? '',
      email: json['email']?.toString() ?? '',
      fullName: json['fullName']?.toString() ?? 'Pengguna',
      phone: phone,
    );
  }

  factory UserProfileModel.fromEntity(UserProfileEntity entity) {
    return UserProfileModel(
      id: entity.id,
      email: entity.email,
      fullName: entity.fullName,
      phone: entity.phone,
    );
  }
}
