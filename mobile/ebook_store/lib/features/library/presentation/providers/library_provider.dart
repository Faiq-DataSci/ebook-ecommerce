import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/config/api_config.dart';
import '../../../../core/network/dio_client.dart';
import '../../data/datasources/library_mock_datasource.dart';
import '../../data/datasources/library_remote_datasource.dart';
import '../../data/repositories/library_repository_impl.dart';
import '../../domain/entities/ebook_access_entity.dart';
import '../../domain/repositories/library_repository.dart';
import '../../domain/usecases/get_my_library_usecase.dart';
import '../../domain/usecases/get_signed_access_url_usecase.dart';

enum LibraryStatus { loading, loaded, empty, error }

class LibraryState {
  final LibraryStatus status;
  final List<EbookAccessEntity> items;
  final String? errorMessage;
  final bool isSimulated;

  const LibraryState({
    this.status = LibraryStatus.loading,
    this.items = const <EbookAccessEntity>[],
    this.errorMessage,
    this.isSimulated = true,
  });

  bool get isLoading => status == LibraryStatus.loading;
  bool get isEmpty => status == LibraryStatus.empty;
  bool get hasError => status == LibraryStatus.error;

  LibraryState copyWith({
    LibraryStatus? status,
    List<EbookAccessEntity>? items,
    String? errorMessage,
    bool? isSimulated,
  }) {
    return LibraryState(
      status: status ?? this.status,
      items: items ?? this.items,
      errorMessage: errorMessage,
      isSimulated: isSimulated ?? this.isSimulated,
    );
  }
}

final libraryMockDataSourceProvider = Provider<LibraryMockDataSource>((ref) {
  return LibraryMockDataSource();
});

final libraryRemoteDataSourceProvider = Provider<LibraryRemoteDataSource>((
  ref,
) {
  if (ApiConfig.useRemoteCatalog) {
    final dio = ref.watch(dioClientProvider);
    return LibraryRemoteDataSourceImpl(dio: dio);
  }
  return ref.watch(libraryMockDataSourceProvider);
});

final libraryRepositoryProvider = Provider<LibraryRepository>((ref) {
  final dataSource = ref.watch(libraryRemoteDataSourceProvider);
  return LibraryRepositoryImpl(remoteDataSource: dataSource);
});

final getMyLibraryUseCaseProvider = Provider<GetMyLibraryUseCase>((ref) {
  final repository = ref.watch(libraryRepositoryProvider);
  return GetMyLibraryUseCase(repository);
});

final getSignedAccessUrlUseCaseProvider = Provider<GetSignedAccessUrlUseCase>((
  ref,
) {
  final repository = ref.watch(libraryRepositoryProvider);
  return GetSignedAccessUrlUseCase(repository);
});

/// Notifier untuk mengelola koleksi e-book di perpustakaan digital
class LibraryNotifier extends StateNotifier<LibraryState> {
  final GetMyLibraryUseCase getMyLibraryUseCase;

  LibraryNotifier(this.getMyLibraryUseCase, {bool autoLoad = true})
    : super(const LibraryState(status: LibraryStatus.loading)) {
    if (autoLoad) {
      loadLibrary();
    }
  }

  Future<void> loadLibrary() async {
    state = state.copyWith(status: LibraryStatus.loading, errorMessage: null);
    try {
      final items = await getMyLibraryUseCase();
      if (items.isEmpty) {
        state = state.copyWith(
          status: LibraryStatus.empty,
          items: const <EbookAccessEntity>[],
          isSimulated: true,
        );
      } else {
        state = state.copyWith(
          status: LibraryStatus.loaded,
          items: items,
          isSimulated: true,
        );
      }
    } catch (e) {
      state = state.copyWith(
        status: LibraryStatus.error,
        errorMessage: e.toString().replaceFirst('Exception: ', ''),
      );
    }
  }

  Future<void> refresh() async {
    await loadLibrary();
  }
}

final libraryProvider = StateNotifierProvider<LibraryNotifier, LibraryState>((
  ref,
) {
  final useCase = ref.watch(getMyLibraryUseCaseProvider);
  return LibraryNotifier(useCase);
});

/// Family provider untuk mengecek kepemilikan akses aktif e-book (DuplicateOwnershipGuard)
final userOwnershipProvider = FutureProvider.family<bool, String>((
  ref,
  ebookId,
) async {
  final repository = ref.watch(libraryRepositoryProvider);
  return repository.checkOwnership(ebookId);
});
