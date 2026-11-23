import 'package:flutter/foundation.dart';

/// Entitas Signed URL sementara untuk akses PDF privat dari Supabase Storage.
/// Masa berlaku (TTL) standar: 300 detik (5 menit) sesuai ADR-0006.
@immutable
class SignedUrlEntity {
  final String ebookId;
  final String title;
  final String signedUrl;
  final int expiresInSeconds;
  final DateTime issuedAt;

  const SignedUrlEntity({
    required this.ebookId,
    required this.title,
    required this.signedUrl,
    required this.expiresInSeconds,
    required this.issuedAt,
  });

  /// Waktu kedaluwarsa absolut
  DateTime get expiresAt => issuedAt.add(Duration(seconds: expiresInSeconds));

  /// Memeriksa apakah signed URL sudah kedaluwarsa
  bool get isExpired => DateTime.now().isAfter(expiresAt);

  /// Sisa waktu dalam detik (0 jika sudah kedaluwarsa)
  int get remainingSeconds {
    final diff = expiresAt.difference(DateTime.now()).inSeconds;
    return diff > 0 ? diff : 0;
  }
}
