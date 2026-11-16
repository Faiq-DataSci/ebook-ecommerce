enum UserRole {
  customer,
  admin;

  String get label {
    switch (this) {
      case UserRole.customer:
        return 'PELANGGAN';
      case UserRole.admin:
        return 'ADMINISTRATOR';
    }
  }

  static UserRole fromString(String? role) {
    if (role != null && role.toUpperCase() == 'ADMIN') {
      return UserRole.admin;
    }
    return UserRole.customer;
  }
}

/// Domain entity representing an authenticated user in Sistem Informasi E-Commerce E-Book.
class UserEntity {
  final String id;
  final String email;
  final String fullName;
  final UserRole role;
  final bool isActive;
  final String? token;
  final String? phone;

  const UserEntity({
    required this.id,
    required this.email,
    required this.fullName,
    required this.role,
    this.isActive = true,
    this.token,
    this.phone,
  });

  bool get isAdmin => role == UserRole.admin;
  bool get isCustomer => role == UserRole.customer;

  UserEntity copyWith({
    String? id,
    String? email,
    String? fullName,
    UserRole? role,
    bool? isActive,
    String? token,
    String? phone,
  }) {
    return UserEntity(
      id: id ?? this.id,
      email: email ?? this.email,
      fullName: fullName ?? this.fullName,
      role: role ?? this.role,
      isActive: isActive ?? this.isActive,
      token: token ?? this.token,
      phone: phone ?? this.phone,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is UserEntity &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          email == other.email &&
          role == other.role;

  @override
  int get hashCode => id.hashCode ^ email.hashCode ^ role.hashCode;
}
