import 'package:device_preview/device_preview.dart';

/// Helper configuration exposing the default iPhone device (`Devices.ios.iPhone13`)
/// from `package:device_preview/device_preview.dart` for Chrome preview.
class IphonePreviewConfig {
  IphonePreviewConfig._();

  static DeviceInfo get defaultIphone => Devices.ios.iPhone13;

  static List<DeviceInfo> get supportedPreviewDevices => <DeviceInfo>[
    Devices.ios.iPhone13,
    Devices.ios.iPhone13ProMax,
    Devices.ios.iPhoneSE,
    Devices.android.samsungGalaxyS20,
  ];
}
