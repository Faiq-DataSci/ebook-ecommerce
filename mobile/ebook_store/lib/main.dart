import 'package:device_preview/device_preview.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app/app.dart';
import 'theme/app_colors.dart';

void main() {
  runApp(
    DevicePreview(
      enabled: !kReleaseMode,
      defaultDevice: Devices.ios.iPhone13,
      backgroundColor: AppColors.nbMuted,
      data: const DevicePreviewData(
        isDarkMode: false,
      ),
      storage: DevicePreviewStorage.none(),
      builder: (context) => const ProviderScope(
        child: EbookStoreApp(),
      ),
    ),
  );
}

/// Application wrapper supporting optional `DevicePreview` iPhone frame mode.
class MyApp extends StatelessWidget {
  final bool enableDevicePreview;

  const MyApp({
    super.key,
    this.enableDevicePreview = false,
  });

  @override
  Widget build(BuildContext context) {
    return DevicePreview(
      enabled: enableDevicePreview,
      defaultDevice: Devices.ios.iPhone13,
      backgroundColor: AppColors.nbMuted,
      data: const DevicePreviewData(
        isDarkMode: false,
      ),
      storage: DevicePreviewStorage.none(),
      builder: (context) => const ProviderScope(
        child: EbookStoreApp(),
      ),
    );
  }
}
