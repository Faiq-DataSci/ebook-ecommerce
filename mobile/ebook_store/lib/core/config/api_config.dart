import 'package:flutter/foundation.dart';

/// Environment-aware API configuration separating Android emulator (`10.0.2.2`)
/// and physical device / host endpoints per `mobile/AGENTS.md`.
class ApiConfig {
  ApiConfig._();

  static const int defaultPort = 3000;

  static const String _physicalDeviceHost = String.fromEnvironment(
    'API_HOST',
    defaultValue: '192.168.1.100',
  );

  static const bool _usePhysicalDevice = bool.fromEnvironment(
    'USE_PHYSICAL_DEVICE',
    defaultValue: false,
  );

  /// Sumber data katalog: 'mock' (default simulasi) atau 'remote' (live API).
  static const String catalogSource = String.fromEnvironment(
    'CATALOG_SOURCE',
    defaultValue: 'mock',
  );

  static bool get useRemoteCatalog => catalogSource.toLowerCase() == 'remote';

  static String get baseUrl {
    if (kIsWeb) {
      return 'http://localhost:$defaultPort/api/v1';
    }
    if (defaultTargetPlatform == TargetPlatform.android &&
        !_usePhysicalDevice) {
      return 'http://10.0.2.2:$defaultPort/api/v1';
    }
    return 'http://$_physicalDeviceHost:$defaultPort/api/v1';
  }
}
