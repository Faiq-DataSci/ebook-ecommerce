import 'package:device_preview/device_preview.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'app/app.dart';
import 'theme/app_colors.dart';

void main() {
  // DevicePreview dinonaktifkan di perangkat mobile (Android & iOS baik fisik maupun emulator)
  // agar aplikasi tampil penuh sesuai ukuran layar HP Anda.
  // Hanya aktif jika dijalankan di Web/Desktop, atau dipaksa via --dart-define=ENABLE_DEVICE_PREVIEW=true
  final isMobileDevice = !kIsWeb &&
      (defaultTargetPlatform == TargetPlatform.android ||
          defaultTargetPlatform == TargetPlatform.iOS);

  const forceEnablePreview = bool.fromEnvironment(
    'ENABLE_DEVICE_PREVIEW',
    defaultValue: false,
  );

  final enableDevicePreview =
      forceEnablePreview || (!kReleaseMode && !isMobileDevice);

  runApp(
    DevicePreview(
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
    ),
  );
}

/// Application wrapper supporting optional `DevicePreview` iPhone frame mode.
class MyApp extends StatelessWidget {
  final bool enableDevicePreview;
  final Widget? initialScreen;

  const MyApp({
    super.key,
    this.enableDevicePreview = false,
    this.initialScreen,
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
      builder: (context) => ProviderScope(
        child: EbookStoreApp(home: initialScreen),
      ),
    );
  }
}
