/// Profil pelanggan dari `GET /api/v1/users/me`.
///
/// Hanya `fullName` dan `phone` yang dapat diubah dari aplikasi. `role` dan
/// `isActive` sengaja tidak dimodelkan di sini agar tidak pernah ditampilkan
/// atau dikirim dari layar profil.
class UserProfileEntity {
  final String id;
  final String email;
  final String fullName;
  final String? phone;

  const UserProfileEntity({
    required this.id,
    required this.email,
    required this.fullName,
    this.phone,
  });

  bool get hasPhone => phone != null && phone!.trim().isNotEmpty;

  String get initials {
    final parts = fullName
        .trim()
        .split(RegExp(r'\s+'))
        .where((part) => part.isNotEmpty)
        .toList();
    if (parts.isEmpty) return '?';
    if (parts.length == 1) return parts.first[0].toUpperCase();
    return (parts.first[0] + parts.last[0]).toUpperCase();
  }

  UserProfileEntity copyWith({
    String? fullName,
    String? phone,
    bool clearPhone = false,
  }) {
    return UserProfileEntity(
      id: id,
      email: email,
      fullName: fullName ?? this.fullName,
      phone: clearPhone ? null : (phone ?? this.phone),
    );
  }
}
