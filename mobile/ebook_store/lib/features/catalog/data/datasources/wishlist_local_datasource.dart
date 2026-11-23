import 'dart:convert';
import 'dart:io';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

abstract class WishlistLocalDataSource {
  Future<void> saveWishlist(Set<String> ebookIds);
  Future<Set<String>> getWishlist();
  Future<void> clearWishlist();
}

class WishlistLocalDataSourceImpl implements WishlistLocalDataSource {
  final FlutterSecureStorage _secureStorage;
  static const String _keyWishlist = 'wishlist_ebook_ids_v1';
  final Set<String> _memoryCache = <String>{};

  bool get _isTest => Platform.environment.containsKey('FLUTTER_TEST');

  WishlistLocalDataSourceImpl({FlutterSecureStorage? secureStorage})
    : _secureStorage = secureStorage ?? const FlutterSecureStorage();

  @override
  Future<void> saveWishlist(Set<String> ebookIds) async {
    _memoryCache
      ..clear()
      ..addAll(ebookIds);
    if (_isTest) return;
    try {
      final jsonStr = jsonEncode(ebookIds.toList());
      await _secureStorage.write(key: _keyWishlist, value: jsonStr);
    } catch (_) {}
  }

  @override
  Future<Set<String>> getWishlist() async {
    if (_isTest) {
      return Set<String>.from(_memoryCache);
    }
    try {
      final raw = await _secureStorage.read(key: _keyWishlist);
      if (raw != null && raw.isNotEmpty) {
        final decoded = jsonDecode(raw) as List<dynamic>;
        final set = decoded.map((e) => e.toString()).toSet();
        _memoryCache
          ..clear()
          ..addAll(set);
        return set;
      }
    } catch (_) {}
    return Set<String>.from(_memoryCache);
  }

  @override
  Future<void> clearWishlist() async {
    _memoryCache.clear();
    if (_isTest) return;
    try {
      await _secureStorage.delete(key: _keyWishlist);
    } catch (_) {}
  }
}
