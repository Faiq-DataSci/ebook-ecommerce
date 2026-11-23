import '../../domain/entities/signed_url_entity.dart';

class SignedUrlModel extends SignedUrlEntity {
  const SignedUrlModel({
    required super.ebookId,
    required super.title,
    required super.signedUrl,
    required super.expiresInSeconds,
    required super.issuedAt,
  });

  factory SignedUrlModel.fromJson(
    Map<String, dynamic> json, {
    DateTime? customIssuedAt,
  }) {
    return SignedUrlModel(
      ebookId: json['ebookId'] as String? ?? '',
      title: json['title'] as String? ?? '',
      signedUrl: json['signedUrl'] as String? ?? '',
      expiresInSeconds: json['expiresInSeconds'] as int? ?? 300,
      issuedAt: customIssuedAt ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'ebookId': ebookId,
      'title': title,
      'signedUrl': signedUrl,
      'expiresInSeconds': expiresInSeconds,
      'issuedAt': issuedAt.toIso8601String(),
    };
  }
}
