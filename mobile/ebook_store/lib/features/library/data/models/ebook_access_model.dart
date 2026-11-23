import '../../domain/entities/ebook_access_entity.dart';

class EbookAccessModel extends EbookAccessEntity {
  const EbookAccessModel({
    required super.id,
    required super.ebookId,
    required super.title,
    required super.author,
    super.coverUrl,
    required super.grantedAt,
    super.isRevoked = false,
    super.totalPages = 48,
    super.currentPage = 0,
    super.format = 'PDF',
    super.orderId,
  });

  factory EbookAccessModel.fromJson(Map<String, dynamic> json) {
    // Menangani struktur dari backend (bisa ada nested object 'ebook' atau flat)
    final ebookMap = json['ebook'] is Map<String, dynamic>
        ? json['ebook'] as Map<String, dynamic>
        : <String, dynamic>{};

    return EbookAccessModel(
      id: json['id'] as String? ?? '',
      ebookId: json['ebookId'] as String? ?? (ebookMap['id'] as String? ?? ''),
      title:
          json['title'] as String? ??
          (ebookMap['title'] as String? ?? 'E-Book Tanpa Judul'),
      author:
          json['author'] as String? ??
          (ebookMap['author'] as String? ?? 'Penulis Anonim'),
      coverUrl:
          json['coverUrl'] as String? ?? (ebookMap['coverUrl'] as String?),
      grantedAt: json['grantedAt'] != null
          ? DateTime.tryParse(json['grantedAt'].toString()) ?? DateTime.now()
          : DateTime.now(),
      isRevoked: json['isRevoked'] as bool? ?? false,
      totalPages: json['totalPages'] as int? ?? 48,
      currentPage: json['currentPage'] as int? ?? 0,
      format: json['format'] as String? ?? 'PDF',
      orderId: json['orderId'] as String?,
    );
  }

  @override
  EbookAccessModel copyWith({
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
    return EbookAccessModel(
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

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'ebookId': ebookId,
      'title': title,
      'author': author,
      'coverUrl': coverUrl,
      'grantedAt': grantedAt.toIso8601String(),
      'isRevoked': isRevoked,
      'totalPages': totalPages,
      'currentPage': currentPage,
      'format': format,
      'orderId': orderId,
    };
  }
}
