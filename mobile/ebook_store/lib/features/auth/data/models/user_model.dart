import '../../domain/entities/user_entity.dart';

/// Data Transfer Object (DTO) for User serialization and deserialization.
class UserModel extends UserEntity {
  const UserModel({
    required super.id,
    required super.email,
    required super.fullName,
    required super.role,
    super.isActive = true,
    super.token,
    super.phone,
  });

  factory UserModel.fromJson(Map<String, dynamic> json, {String? token}) {
    return UserModel(
      id: json['id'] as String? ?? json['userId'] as String? ?? '',
      email: json['email'] as String? ?? '',
      fullName:
          json['fullName'] as String? ?? json['name'] as String? ?? 'Pengguna',
      role: UserRole.fromString(json['role'] as String?),
      isActive: json['isActive'] as bool? ?? true,
      token: token ?? json['token'] as String?,
      phone: json['phone'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'fullName': fullName,
      'role': role == UserRole.admin ? 'ADMIN' : 'CUSTOMER',
      'isActive': isActive,
      'token': token,
      'phone': phone,
    };
  }

  factory UserModel.fromEntity(UserEntity entity) {
    return UserModel(
      id: entity.id,
      email: entity.email,
      fullName: entity.fullName,
      role: entity.role,
      isActive: entity.isActive,
      token: entity.token,
      phone: entity.phone,
    );
  }
}
