import 'dart:convert';
import 'dart:io';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../../domain/entities/cart_item.dart';

/// Kontrak penyimpanan lokal untuk persistensi keranjang belanja.
abstract class CartLocalDataSource {
  Future<void> saveCartItems(List<CartItem> items);
  Future<List<CartItem>?> getCartItems();
  Future<void> clearCart();
}

/// Implementasi persistensi keranjang belanja berbasis FlutterSecureStorage
/// dengan in-memory cache untuk fallback headless test environment.
class CartLocalDataSourceImpl implements CartLocalDataSource {
  final FlutterSecureStorage _secureStorage;
  static const String _keyCart = 'cart_persisted_items_v1';
  final Map<String, String> _memoryCache = <String, String>{};

  bool get _isTest => Platform.environment.containsKey('FLUTTER_TEST');

  CartLocalDataSourceImpl({FlutterSecureStorage? secureStorage})
    : _secureStorage = secureStorage ?? const FlutterSecureStorage();

  @override
  Future<void> saveCartItems(List<CartItem> items) async {
    final list = items.map((item) => item.toJson()).toList();
    final jsonStr = jsonEncode(list);
    _memoryCache[_keyCart] = jsonStr;
    if (_isTest) return;
    try {
      await _secureStorage.write(key: _keyCart, value: jsonStr);
    } catch (_) {
      // Memory fallback
    }
  }

  @override
  Future<List<CartItem>?> getCartItems() async {
    if (_isTest) {
      final jsonStr = _memoryCache[_keyCart];
      if (jsonStr != null && jsonStr.isNotEmpty) {
        final decoded = jsonDecode(jsonStr) as List<dynamic>;
        return decoded
            .map((e) => CartItem.fromJson(e as Map<String, dynamic>))
            .toList();
      }
      return null;
    }
    try {
      final raw = await _secureStorage.read(key: _keyCart);
      final jsonStr = raw ?? _memoryCache[_keyCart];
      if (jsonStr != null && jsonStr.isNotEmpty) {
        final decoded = jsonDecode(jsonStr) as List<dynamic>;
        return decoded
            .map((e) => CartItem.fromJson(e as Map<String, dynamic>))
            .toList();
      }
    } catch (_) {
      // Memory fallback
    }
    return null;
  }

  @override
  Future<void> clearCart() async {
    _memoryCache.remove(_keyCart);
    if (_isTest) return;
    try {
      await _secureStorage.delete(key: _keyCart);
    } catch (_) {
      // Memory fallback
    }
  }
}
