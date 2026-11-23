import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/datasources/library_remote_datasource.dart';
import '../../data/datasources/reader_local_datasource.dart';
import '../../domain/entities/signed_url_entity.dart';
import '../../domain/usecases/get_signed_access_url_usecase.dart';
import 'library_provider.dart';

class ReaderState {
  final String ebookId;
  final String title;
  final bool isLoading;
  final bool isRefreshing;
  final SignedUrlEntity? signedUrl;
  final bool isExpired;
  final bool isRevoked;
  final bool isUnauthenticated;
  final String? errorMessage;
  final int currentPage;
  final int totalPages;
  final double zoomLevel;
  final int? initialSavedPage;
  final bool showResumeNotice;

  const ReaderState({
    required this.ebookId,
    required this.title,
    this.isLoading = false,
    this.isRefreshing = false,
    this.signedUrl,
    this.isExpired = false,
    this.isRevoked = false,
    this.isUnauthenticated = false,
    this.errorMessage,
    this.currentPage = 1,
    this.totalPages = 48,
    this.zoomLevel = 1.0,
    this.initialSavedPage,
    this.showResumeNotice = false,
  });

  ReaderState copyWith({
    String? ebookId,
    String? title,
    bool? isLoading,
    bool? isRefreshing,
    SignedUrlEntity? signedUrl,
    bool? isExpired,
    bool? isRevoked,
    bool? isUnauthenticated,
    String? errorMessage,
    int? currentPage,
    int? totalPages,
    double? zoomLevel,
    int? initialSavedPage,
    bool? showResumeNotice,
  }) {
    return ReaderState(
      ebookId: ebookId ?? this.ebookId,
      title: title ?? this.title,
      isLoading: isLoading ?? this.isLoading,
      isRefreshing: isRefreshing ?? this.isRefreshing,
      signedUrl: signedUrl ?? this.signedUrl,
      isExpired: isExpired ?? this.isExpired,
      isRevoked: isRevoked ?? this.isRevoked,
      isUnauthenticated: isUnauthenticated ?? this.isUnauthenticated,
      errorMessage: errorMessage,
      currentPage: currentPage ?? this.currentPage,
      totalPages: totalPages ?? this.totalPages,
      zoomLevel: zoomLevel ?? this.zoomLevel,
      initialSavedPage: initialSavedPage ?? this.initialSavedPage,
      showResumeNotice: showResumeNotice ?? this.showResumeNotice,
    );
  }
}

class ReaderNotifier extends StateNotifier<ReaderState> {
  final GetSignedAccessUrlUseCase getSignedAccessUrlUseCase;
  final ReaderLocalDataSource? localDataSource;

  ReaderNotifier({
    required this.getSignedAccessUrlUseCase,
    this.localDataSource,
    required String ebookId,
    String title = 'E-Book Digital',
    int totalPages = 48,
    bool autoLoad = true,
  }) : super(
         ReaderState(
           ebookId: ebookId,
           title: title,
           totalPages: totalPages,
           isLoading: autoLoad,
         ),
       ) {
    if (autoLoad) {
      loadAccessUrl();
    }
  }

  /// Meminta signed URL awal dari backend (`GET /api/v1/ebooks/:id/access-url`)
  /// dan memulihkan halaman baca terakhir yang tersimpan (Resume Reading).
  Future<void> loadAccessUrl() async {
    state = state.copyWith(
      isLoading: true,
      errorMessage: null,
      isRevoked: false,
      isUnauthenticated: false,
    );
    try {
      final signedUrl = await getSignedAccessUrlUseCase(state.ebookId);
      final expired = signedUrl.isExpired;

      int? savedPage;
      if (localDataSource != null) {
        savedPage = await localDataSource!.getLastPage(state.ebookId);
      }
      final bool hasResume = savedPage != null && savedPage > 1;

      state = state.copyWith(
        isLoading: false,
        signedUrl: signedUrl,
        title: signedUrl.title.isNotEmpty ? signedUrl.title : state.title,
        isExpired: expired,
        currentPage: hasResume ? savedPage : state.currentPage,
        initialSavedPage: hasResume ? savedPage : null,
        showResumeNotice: hasResume,
      );
    } on UnauthenticatedException catch (e) {
      state = state.copyWith(
        isLoading: false,
        isUnauthenticated: true,
        errorMessage: e.message,
      );
    } on EbookAccessDeniedException catch (e) {
      state = state.copyWith(
        isLoading: false,
        isRevoked: true,
        errorMessage: e.message,
      );
    } on SignedUrlGenerationFailedException catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.message);
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString().replaceFirst('Exception: ', ''),
      );
    }
  }

  /// Meminta signed URL baru ketika tautan lama kedaluwarsa (SignedUrlRecoveryBanner)
  Future<void> refreshSignedUrl() async {
    state = state.copyWith(isRefreshing: true, errorMessage: null);
    try {
      final signedUrl = await getSignedAccessUrlUseCase(state.ebookId);
      state = state.copyWith(
        isRefreshing: false,
        signedUrl: signedUrl,
        isExpired:
            false, // Reset status kedaluwarsa setelah dapat signed URL baru
        title: signedUrl.title.isNotEmpty ? signedUrl.title : state.title,
      );
    } on UnauthenticatedException catch (e) {
      state = state.copyWith(
        isRefreshing: false,
        isUnauthenticated: true,
        errorMessage: e.message,
      );
    } on EbookAccessDeniedException catch (e) {
      state = state.copyWith(
        isRefreshing: false,
        isRevoked: true,
        errorMessage: e.message,
      );
    } catch (e) {
      state = state.copyWith(
        isRefreshing: false,
        errorMessage: e.toString().replaceFirst('Exception: ', ''),
      );
    }
  }

  void simulateExpire() {
    state = state.copyWith(isExpired: true);
  }

  void simulateRevoke([String? message]) {
    state = state.copyWith(
      isRevoked: true,
      errorMessage:
          message ?? 'Hak akses e-book Anda telah dicabut oleh Administrator',
    );
  }

  void nextPage() {
    if (state.currentPage < state.totalPages) {
      final next = state.currentPage + 1;
      state = state.copyWith(currentPage: next);
      localDataSource?.saveLastPage(state.ebookId, next);
    }
  }

  void previousPage() {
    if (state.currentPage > 1) {
      final prev = state.currentPage - 1;
      state = state.copyWith(currentPage: prev);
      localDataSource?.saveLastPage(state.ebookId, prev);
    }
  }

  void goToPage(int page) {
    if (page >= 1 && page <= state.totalPages) {
      state = state.copyWith(currentPage: page);
      localDataSource?.saveLastPage(state.ebookId, page);
    }
  }

  /// Menyesuaikan jumlah halaman dengan jumlah halaman PDF asli.
  void setTotalPages(int totalPages) {
    if (totalPages <= 0 || totalPages == state.totalPages) return;
    state = state.copyWith(
      totalPages: totalPages,
      currentPage: state.currentPage.clamp(1, totalPages),
    );
  }

  /// Sinkronisasi nomor halaman saat pembaca PDF menggulir halaman.
  void setCurrentPage(int page) {
    if (page >= 1 && page <= state.totalPages && page != state.currentPage) {
      state = state.copyWith(currentPage: page);
      localDataSource?.saveLastPage(state.ebookId, page);
    }
  }

  Future<void> resetProgressToBeginning() async {
    state = state.copyWith(currentPage: 1, showResumeNotice: false);
    await localDataSource?.saveLastPage(state.ebookId, 1);
  }

  void dismissResumeNotice() {
    state = state.copyWith(showResumeNotice: false);
  }

  void zoomIn() {
    if (state.zoomLevel < 2.0) {
      state = state.copyWith(
        zoomLevel: (state.zoomLevel + 0.1).clamp(0.8, 2.0),
      );
    }
  }

  void zoomOut() {
    if (state.zoomLevel > 0.8) {
      state = state.copyWith(
        zoomLevel: (state.zoomLevel - 0.1).clamp(0.8, 2.0),
      );
    }
  }

  void resetZoom() {
    state = state.copyWith(zoomLevel: 1.0);
  }
}

class ReaderParams {
  final String ebookId;
  final String title;
  final int totalPages;

  const ReaderParams({
    required this.ebookId,
    this.title = 'E-Book Digital',
    this.totalPages = 48,
  });

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ReaderParams &&
          runtimeType == other.runtimeType &&
          ebookId == other.ebookId;

  @override
  int get hashCode => ebookId.hashCode;
}

final readerLocalDataSourceProvider = Provider<ReaderLocalDataSource>((ref) {
  return ReaderLocalDataSourceImpl();
});

final readerNotifierProvider =
    StateNotifierProvider.family<ReaderNotifier, ReaderState, ReaderParams>((
      ref,
      params,
    ) {
      final useCase = ref.watch(getSignedAccessUrlUseCaseProvider);
      final localDataSource = ref.watch(readerLocalDataSourceProvider);
      return ReaderNotifier(
        getSignedAccessUrlUseCase: useCase,
        localDataSource: localDataSource,
        ebookId: params.ebookId,
        title: params.title,
        totalPages: params.totalPages,
      );
    });
