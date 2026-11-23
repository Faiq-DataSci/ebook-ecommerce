import '../models/ebook_access_model.dart';
import '../models/signed_url_model.dart';
import 'library_remote_datasource.dart';

/// Datasource simulasi ("DATA SIMULASI") untuk modul Perpustakaan & In-App Reader.
/// Digunakan karena endpoint koleksi `/api/v1/library` belum ada di live API,
/// serta untuk memvalidasi alur pengujian reader & pemulihan signed URL.
class LibraryMockDataSource implements LibraryRemoteDataSource {
  final Duration simulatedDelay;

  LibraryMockDataSource({this.simulatedDelay = Duration.zero});

  final List<EbookAccessModel> _library = <EbookAccessModel>[
    EbookAccessModel(
      id: 'acc-001',
      ebookId: '00000000-0000-0000-0000-000000000101',
      title: 'Pemrograman Flutter & Clean Architecture Modern',
      author: 'Raden Saleh',
      coverUrl: 'assets/images/book_cover_1.png',
      grantedAt: DateTime.now().subtract(const Duration(days: 3)),
      isRevoked: false,
      totalPages: 124,
      currentPage: 46,
      format: 'PDF',
      orderId: 'ord-sim-001',
    ),
    EbookAccessModel(
      id: 'acc-002',
      ebookId: '00000000-0000-0000-0000-000000000102',
      title: 'Desain Antarmuka Neubrutalisme untuk Mobile & Web',
      author: 'Siti Nurhaliza',
      coverUrl: 'assets/images/book_cover_2.png',
      grantedAt: DateTime.now().subtract(const Duration(days: 1)),
      isRevoked: false,
      totalPages: 86,
      currentPage: 55,
      format: 'PDF + EPUB',
      orderId: 'ord-sim-002',
    ),
    EbookAccessModel(
      id: 'acc-003',
      ebookId: '00000000-0000-0000-0000-000000000103',
      title: 'Sistem Pendukung Keputusan SAW Terapan',
      author: 'Budi Santoso',
      coverUrl: 'assets/images/book_cover_3.png',
      grantedAt: DateTime.now().subtract(const Duration(days: 7)),
      isRevoked: true, // Akses dicabut
      totalPages: 60,
      currentPage: 0,
      format: 'PDF',
      orderId: 'ord-sim-003',
    ),
  ];

  final Set<String> _forceExpiredEbooks = <String>{};
  final Set<String> _forceRevokedEbooks = <String>{
    '00000000-0000-0000-0000-000000000103',
  };
  bool _force500Error = false;
  bool _force401Error = false;
  bool _forceEmptyLibrary = false;

  int refreshCount = 0;

  void forceExpire(String ebookId) {
    _forceExpiredEbooks.add(ebookId);
  }

  void forceRevoke(String ebookId) {
    _forceRevokedEbooks.add(ebookId);
  }

  void force500() {
    _force500Error = true;
  }

  void force401() {
    _force401Error = true;
  }

  void forceEmpty() {
    _forceEmptyLibrary = true;
  }

  void restoreAccess(String ebookId) {
    _forceRevokedEbooks.remove(ebookId);
    _forceExpiredEbooks.remove(ebookId);
    _force500Error = false;
    _force401Error = false;
  }

  @override
  Future<List<EbookAccessModel>> getMyLibrary() async {
    if (simulatedDelay > Duration.zero) {
      await Future<void>.delayed(simulatedDelay);
    }

    if (_force401Error) {
      throw UnauthenticatedException(
        'Sesi Anda telah berakhir. Silakan masuk kembali.',
      );
    }

    if (_forceEmptyLibrary) {
      return <EbookAccessModel>[];
    }

    return _library.map((item) {
      if (_forceRevokedEbooks.contains(item.ebookId)) {
        return item.copyWith(isRevoked: true);
      }
      return item;
    }).toList();
  }

  @override
  Future<SignedUrlModel> getSignedAccessUrl(String ebookId) async {
    if (simulatedDelay > Duration.zero) {
      await Future<void>.delayed(simulatedDelay);
    }

    if (_force401Error) {
      throw UnauthenticatedException(
        'Sesi Anda telah berakhir. Silakan masuk kembali.',
      );
    }

    if (_force500Error) {
      throw SignedUrlGenerationFailedException(
        'Gagal menyiapkan akses baca e-book sementara.',
      );
    }

    if (_forceRevokedEbooks.contains(ebookId)) {
      throw EbookAccessDeniedException(
        'Anda tidak memiliki akses aktif untuk e-book ini atau hak akses telah dicabut.',
      );
    }

    final book = _library.firstWhere(
      (item) => item.ebookId == ebookId,
      orElse: () => EbookAccessModel(
        id: 'acc-temp',
        ebookId: ebookId,
        title: 'E-Book Digital',
        author: 'Penulis Sistem',
        grantedAt: DateTime.now(),
      ),
    );

    refreshCount++;

    final isExpiredRequested = _forceExpiredEbooks.contains(ebookId);
    final issuedAt = isExpiredRequested
        ? DateTime.now().subtract(
            const Duration(seconds: 350),
          ) // Telah lewat 300 detik
        : DateTime.now();

    return SignedUrlModel(
      ebookId: book.ebookId,
      title: book.title,
      signedUrl:
          'https://supabase.project.co/storage/v1/object/sign/ebooks-private/${book.ebookId}.pdf?token=SIM_TOKEN_$refreshCount',
      expiresInSeconds: 300,
      issuedAt: issuedAt,
    );
  }

  @override
  Future<bool> checkOwnership(String ebookId) async {
    if (simulatedDelay > Duration.zero) {
      await Future<void>.delayed(simulatedDelay);
    }
    final item = _library.firstWhere(
      (b) => b.ebookId == ebookId,
      orElse: () => EbookAccessModel(
        id: '',
        ebookId: '',
        title: '',
        author: '',
        grantedAt: DateTime.now(),
        isRevoked: true,
      ),
    );
    return item.ebookId.isNotEmpty &&
        !item.isRevoked &&
        !_forceRevokedEbooks.contains(ebookId);
  }

  void addSimulatedAccess(
    String ebookId,
    String title,
    String author,
    String? coverUrl,
  ) {
    if (!_library.any((item) => item.ebookId == ebookId)) {
      _library.insert(
        0,
        EbookAccessModel(
          id: 'acc-${DateTime.now().millisecondsSinceEpoch}',
          ebookId: ebookId,
          title: title,
          author: author,
          coverUrl: coverUrl,
          grantedAt: DateTime.now(),
          isRevoked: false,
          totalPages: 50,
        ),
      );
    }
  }
}
