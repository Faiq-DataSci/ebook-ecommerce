import 'package:flutter/foundation.dart';

/// Entitas Hak Akses E-Book Pelanggan (EbookAccess)
/// Mengikuti skema database Supabase `ebook_accesses` dan `design.md §8.9`.
@immutable
class EbookAccessEntity {
  final String id;
  final String ebookId;
  final String title;
  final String author;
  final String? coverUrl;
  final DateTime grantedAt;
  final bool isRevoked;
  final int totalPages;
  final int currentPage;
  final String format;
  final String? orderId;

  const EbookAccessEntity({
    required this.id,
    required this.ebookId,
    required this.title,
    required this.author,
    this.coverUrl,
    required this.grantedAt,
    this.isRevoked = false,
    this.totalPages = 48,
    this.currentPage = 0,
    this.format = 'PDF',
    this.orderId,
  });

  /// Akses aktif jika belum dicabut oleh administrator
  bool get isActive => !isRevoked;

  /// Persentase progres membaca (0.0 sampai 1.0)
  double get progressPercent =>
      totalPages > 0 ? (currentPage / totalPages).clamp(0.0, 1.0) : 0.0;

  /// Buku sudah selesai dibaca jika halaman saat ini mencapai total halaman
  bool get isCompleted => totalPages > 0 && currentPage >= totalPages;

  /// Buku sedang dalam progres membaca
  bool get isReading => currentPage > 0 && !isCompleted;

  EbookAccessEntity copyWith({
    String? id,
    String? ebookId,
    String? title,
    String? author,
    String? coverUrl,
    DateTime? grantedAt,
    bool? isRevoked,
    int? totalPages,
    int? currentPage,
    String? format,
    String? orderId,
  }) {
    return EbookAccessEntity(
      id: id ?? this.id,
      ebookId: ebookId ?? this.ebookId,
      title: title ?? this.title,
      author: author ?? this.author,
      coverUrl: coverUrl ?? this.coverUrl,
      grantedAt: grantedAt ?? this.grantedAt,
      isRevoked: isRevoked ?? this.isRevoked,
      totalPages: totalPages ?? this.totalPages,
      currentPage: currentPage ?? this.currentPage,
      format: format ?? this.format,
      orderId: orderId ?? this.orderId,
    );
  }
}
