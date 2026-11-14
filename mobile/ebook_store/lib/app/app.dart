import 'package:device_preview/device_preview.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../screens/home/home_screen.dart';
import '../theme/app_theme.dart';

/// Root application widget for Sistem Informasi E-Commerce E-Book (`BUKUKITA`).
/// Strictly locked to the Google Stitch Light Mode Neubrutalism theme.
class EbookStoreApp extends ConsumerWidget {
  const EbookStoreApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final lightTheme = AppTheme.buildTheme(isDark: false);

    return MaterialApp(
      title: 'BUKUKITA - Sistem Informasi E-Commerce E-Book',
      debugShowCheckedModeBanner: false,
      locale: DevicePreview.locale(context),
      builder: DevicePreview.appBuilder,
      theme: lightTheme,
      darkTheme: lightTheme,
      themeMode: ThemeMode.light,
      home: const HomeScreen(),
    );
  }
}
