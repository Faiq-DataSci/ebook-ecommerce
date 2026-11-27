import 'package:device_preview/device_preview.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/config/api_config.dart';
import '../features/catalog/presentation/providers/catalog_provider.dart';
import '../features/home/presentation/providers/home_provider.dart';
import '../features/recommendations/presentation/providers/saw_ranking_provider.dart';
import '../features/splash/presentation/pages/splash_screen.dart';
import '../theme/app_theme.dart';

/// Root application widget for Sistem Informasi E-Commerce E-Book (`BUKUKITA`).
/// Strictly locked to the Google Stitch Light Mode Neubrutalism theme.
/// Otomatis menyegarkan katalog & peringkat SAW saat aplikasi kembali aktif (resume)
/// pada mode remote agar perubahan CRUD dari Admin langsung tersinkronisasi.
class EbookStoreApp extends ConsumerStatefulWidget {
  final Widget? home;

  const EbookStoreApp({super.key, this.home});

  @override
  ConsumerState<EbookStoreApp> createState() => _EbookStoreAppState();
}

class _EbookStoreAppState extends ConsumerState<EbookStoreApp>
    with WidgetsBindingObserver {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state != AppLifecycleState.resumed) return;

    if (ApiConfig.useRemoteCatalog) {
      ref.read(catalogProvider.notifier).refresh();
    }
    if (ApiConfig.useRemoteRecommendation) {
      ref.read(sawRankingProvider.notifier).fetchRankings();
    }
    if (ApiConfig.useRemoteCatalog || ApiConfig.useRemoteRecommendation) {
      ref.read(homeProvider.notifier).refresh();
    }
  }

  @override
  Widget build(BuildContext context) {
    final lightTheme = AppTheme.buildTheme(isDark: false);

    return MaterialApp(
      title: 'BUKUKITA - Sistem Informasi E-Commerce E-Book',
      debugShowCheckedModeBanner: false,
      locale: DevicePreview.locale(context),
      builder: DevicePreview.appBuilder,
      theme: lightTheme,
      darkTheme: lightTheme,
      themeMode: ThemeMode.light,
      home: widget.home ?? const SplashScreen(),
    );
  }
}
