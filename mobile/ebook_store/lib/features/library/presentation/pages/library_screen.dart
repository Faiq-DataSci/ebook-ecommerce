import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../../catalog/presentation/pages/catalog_screen.dart';
import '../../domain/entities/ebook_access_entity.dart';
import '../providers/library_provider.dart';
import '../widgets/library_book_card.dart';
import '../widgets/library_empty_state.dart';
import 'in_app_pdf_reader_screen.dart';

enum LibraryFilter { all, reading, completed }

/// Halaman & Tampilan Rak Perpustakaan Digital (Zona B — Neubrutalism, design.md §8.9).
/// Mendukung mode embed pada tab navigasi utama (`isEmbedded: true`)
/// serta mode mandiri (`isEmbedded: false`) jika dibuka dari checkout / rute lain.
class LibraryScreen extends ConsumerStatefulWidget {
  final bool isEmbedded;

  const LibraryScreen({super.key, this.isEmbedded = false});

  @override
  ConsumerState<LibraryScreen> createState() => _LibraryScreenState();
}

class _LibraryScreenState extends ConsumerState<LibraryScreen> {
  LibraryFilter _activeFilter = LibraryFilter.all;

  @override
  Widget build(BuildContext context) {
    final libraryState = ref.watch(libraryProvider);
    final libraryNotifier = ref.read(libraryProvider.notifier);

    final content = _buildBody(context, libraryState, libraryNotifier);

    if (widget.isEmbedded) {
      return Container(color: AppColors.nbPaper, child: content);
    }

    return Scaffold(
      backgroundColor: AppColors.nbPaper,
      appBar: PreferredSize(
        preferredSize: const Size.fromHeight(56.0),
        child: Container(
          decoration: const BoxDecoration(
            color: AppColors.nbPaper,
            border: Border(
              bottom: BorderSide(
                color: AppColors.nbBlack,
                width: AppTheme.borderDefault,
              ),
            ),
          ),
          child: SafeArea(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Row(
                children: [
                  Semantics(
                    button: true,
                    label: 'Kembali',
                    child: InkWell(
                      key: const Key('library_back_button'),
                      onTap: () => Navigator.of(context).maybePop(),
                      child: Container(
                        width: 38.0,
                        height: 38.0,
                        alignment: Alignment.center,
                        decoration: BoxDecoration(
                          color: AppColors.nbWhite,
                          border: Border.all(
                            color: AppColors.nbBlack,
                            width: AppTheme.borderDefault,
                          ),
                          boxShadow: const [
                            BoxShadow(
                              color: AppColors.nbBlack,
                              offset: Offset(2.0, 2.0),
                              blurRadius: 0.0,
                            ),
                          ],
                        ),
                        child: const Icon(
                          Icons.arrow_back,
                          size: 18.0,
                          color: AppColors.nbBlack,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12.0),
                  const Expanded(
                    child: Text(
                      'PERPUSTAKAAN DIGITAL',
                      style: TextStyle(
                        fontFamily: AppTheme.fontHeadline,
                        fontSize: 15.0,
                        fontWeight: FontWeight.w800,
                        color: AppColors.nbBlack,
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8.0,
                      vertical: 3.0,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.nbYellow,
                      border: Border.all(color: AppColors.nbBlack, width: 1.5),
                    ),
                    child: const Text(
                      'ZONA B',
                      style: TextStyle(
                        fontFamily: AppTheme.fontMono,
                        fontSize: 10.0,
                        fontWeight: FontWeight.w800,
                        color: AppColors.nbBlack,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
      body: content,
    );
  }

  Widget _buildBody(
    BuildContext context,
    LibraryState state,
    LibraryNotifier notifier,
  ) {
    // 1. Loading State
    if (state.isLoading) {
      return const Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CircularProgressIndicator(
              strokeWidth: 3.0,
              color: AppColors.nbBlack,
            ),
            SizedBox(height: 12.0),
            Text(
              'MEMUAT PERPUSTAKAAN...',
              style: TextStyle(
                fontFamily: AppTheme.fontHeadline,
                fontSize: 12.0,
                fontWeight: FontWeight.w700,
                color: AppColors.nbBlack,
              ),
            ),
          ],
        ),
      );
    }

    // 2. Error State dengan Tombol Coba Lagi
    if (state.hasError) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Container(
            padding: const EdgeInsets.all(20.0),
            decoration: BoxDecoration(
              color: AppColors.nbWhite,
              border: Border.all(
                color: AppColors.nbBlack,
                width: AppTheme.borderMedium,
              ),
              boxShadow: const [
                BoxShadow(
                  color: AppColors.nbBlack,
                  offset: Offset(4.0, 4.0),
                  blurRadius: 0.0,
                ),
              ],
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10.0,
                    vertical: 4.0,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.nbPink,
                    border: Border.all(color: AppColors.nbBlack, width: 1.5),
                  ),
                  child: const Text(
                    '[ KENDALA SISTEM ]',
                    style: TextStyle(
                      fontFamily: AppTheme.fontMono,
                      fontSize: 10.5,
                      fontWeight: FontWeight.w800,
                      color: AppColors.nbBlack,
                    ),
                  ),
                ),
                const SizedBox(height: 10.0),
                const Text(
                  'Gagal Memuat Perpustakaan',
                  style: TextStyle(
                    fontFamily: AppTheme.fontHeadline,
                    fontSize: 14.0,
                    fontWeight: FontWeight.w800,
                    color: AppColors.nbBlack,
                  ),
                ),
                const SizedBox(height: 6.0),
                Text(
                  state.errorMessage ?? 'Terjadi kesalahan jaringan atau sesi.',
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontFamily: AppTheme.fontBody,
                    fontSize: 12.0,
                    color: AppColors.nbTextMuted,
                  ),
                ),
                const SizedBox(height: 16.0),
                InkWell(
                  key: const Key('library_retry_button'),
                  onTap: notifier.loadLibrary,
                  child: Container(
                    height: 40.0,
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: AppColors.nbYellow,
                      border: Border.all(
                        color: AppColors.nbBlack,
                        width: AppTheme.borderDefault,
                      ),
                      boxShadow: const [
                        BoxShadow(
                          color: AppColors.nbBlack,
                          offset: Offset(2.0, 2.0),
                          blurRadius: 0.0,
                        ),
                      ],
                    ),
                    child: const Text(
                      'COBA LAGI',
                      style: TextStyle(
                        fontFamily: AppTheme.fontHeadline,
                        fontSize: 12.0,
                        fontWeight: FontWeight.w800,
                        color: AppColors.nbBlack,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }

    // 3. Empty State (Jika tidak ada koleksi sama sekali di perpustakaan)
    if (state.isEmpty || state.items.isEmpty) {
      return RefreshIndicator(
        color: AppColors.nbBlack,
        onRefresh: notifier.refresh,
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          child: SizedBox(
            height: MediaQuery.of(context).size.height * 0.75,
            child: LibraryEmptyState(
              onExploreCatalog: () {
                Navigator.of(context).push(
                  MaterialPageRoute(builder: (_) => const CatalogScreen()),
                );
              },
            ),
          ),
        ),
      );
    }

    // Saring buku berdasarkan chip filter yang aktif
    final filteredItems = _getFilteredItems(state.items);

    // 4. Loaded State: Tampilan Rak Buku Digital Bersih & Menarik (Zona B)
    return RefreshIndicator(
      color: AppColors.nbBlack,
      backgroundColor: AppColors.nbYellow,
      onRefresh: notifier.refresh,
      child: ListView(
        key: const Key('library_books_list_view'),
        padding: const EdgeInsets.fromLTRB(16.0, 12.0, 16.0, 24.0),
        children: [
          // Banner Simulasi (Aturan Integritas design.md §17)
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: 10.0,
              vertical: 6.0,
            ),
            margin: const EdgeInsets.only(bottom: 12.0),
            decoration: BoxDecoration(
              color: AppColors.nbPaper,
              border: Border.all(color: AppColors.nbBlack, width: 1.5),
            ),
            child: const Text(
              '[ DATA SIMULASI ] KOLEKSI PUSTAKA PRIBADI // BUCKET PRIVAT',
              style: TextStyle(
                fontFamily: AppTheme.fontMono,
                fontSize: 9.5,
                fontWeight: FontWeight.w700,
                color: AppColors.nbTextMuted,
              ),
            ),
          ),

          // Header Rak Koleksi Buku Digital (Ditampilkan pada mode embed navigasi utama)
          if (widget.isEmbedded) ...[
            Container(
              padding: const EdgeInsets.all(14.0),
              margin: const EdgeInsets.only(bottom: 14.0),
              decoration: BoxDecoration(
                color: AppColors.nbWhite,
                border: Border.all(
                  color: AppColors.nbBlack,
                  width: AppTheme.borderDefault,
                ),
                boxShadow: const [
                  BoxShadow(
                    color: AppColors.nbBlack,
                    offset: Offset(4.0, 4.0),
                    blurRadius: 0.0,
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 7.0,
                          vertical: 2.5,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.nbYellow,
                          border: Border.all(
                            color: AppColors.nbBlack,
                            width: 1.5,
                          ),
                        ),
                        child: const Text(
                          'ZONA B',
                          style: TextStyle(
                            fontFamily: AppTheme.fontMono,
                            fontSize: 9.5,
                            fontWeight: FontWeight.w800,
                            color: AppColors.nbBlack,
                          ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8.0,
                          vertical: 3.5,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.nbLavender,
                          border: Border.all(
                            color: AppColors.nbBlack,
                            width: 1.5,
                          ),
                          boxShadow: const [
                            BoxShadow(
                              color: AppColors.nbBlack,
                              offset: Offset(2.0, 2.0),
                              blurRadius: 0.0,
                            ),
                          ],
                        ),
                        child: Text(
                          '${state.items.length} E-BOOK',
                          style: const TextStyle(
                            fontFamily: AppTheme.fontMono,
                            fontSize: 10.5,
                            fontWeight: FontWeight.w800,
                            color: AppColors.nbBlack,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8.0),
                  const Text(
                    'PERPUSTAKAAN DIGITAL',
                    style: TextStyle(
                      fontFamily: AppTheme.fontHeadline,
                      fontSize: 16.0,
                      fontWeight: FontWeight.w800,
                      color: AppColors.nbBlack,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 3.0),
                  const Text(
                    'Koleksi E-Book & Materi Terlisensi Pribadi',
                    style: TextStyle(
                      fontFamily: AppTheme.fontBody,
                      fontSize: 11.5,
                      color: AppColors.nbTextMuted,
                    ),
                  ),
                  const SizedBox(height: 10.0),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8.0,
                      vertical: 5.0,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.nbPaper,
                      border: Border.all(color: AppColors.nbBlack, width: 1.5),
                    ),
                    child: Wrap(
                      crossAxisAlignment: WrapCrossAlignment.center,
                      spacing: 6.0,
                      runSpacing: 3.0,
                      children: [
                        Text(
                          'AKTIF: ${state.items.where((b) => b.isActive).length}',
                          style: const TextStyle(
                            fontFamily: AppTheme.fontMono,
                            fontSize: 9.5,
                            fontWeight: FontWeight.w800,
                            color: AppColors.nbBlack,
                          ),
                        ),
                        const Text(
                          '•',
                          style: TextStyle(
                            fontFamily: AppTheme.fontMono,
                            fontSize: 9.5,
                            color: AppColors.nbBlack,
                          ),
                        ),
                        Text(
                          'SELESAI: ${state.items.where((b) => b.isCompleted).length}',
                          style: const TextStyle(
                            fontFamily: AppTheme.fontMono,
                            fontSize: 9.5,
                            fontWeight: FontWeight.w800,
                            color: AppColors.nbBlack,
                          ),
                        ),
                        const Text(
                          '•',
                          style: TextStyle(
                            fontFamily: AppTheme.fontMono,
                            fontSize: 9.5,
                            color: AppColors.nbBlack,
                          ),
                        ),
                        const Text(
                          'STORAGE PRIVAT',
                          style: TextStyle(
                            fontFamily: AppTheme.fontMono,
                            fontSize: 9.5,
                            fontWeight: FontWeight.w700,
                            color: AppColors.nbTextMuted,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],

          // Filter Chips Neubrutalism (design.md §5.4: Chip 32dp, border 2px, shadow-sm 2px)
          _buildFilterChips(state.items),

          const SizedBox(height: 14.0),

          // Kondisi jika filter tidak menemukan buku
          if (filteredItems.isEmpty) ...[
            Container(
              padding: const EdgeInsets.all(20.0),
              decoration: BoxDecoration(
                color: AppColors.nbWhite,
                border: Border.all(
                  color: AppColors.nbBlack,
                  width: AppTheme.borderDefault,
                ),
                boxShadow: const [
                  BoxShadow(
                    color: AppColors.nbBlack,
                    offset: Offset(3.0, 3.0),
                    blurRadius: 0.0,
                  ),
                ],
              ),
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10.0,
                      vertical: 4.0,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.nbLavender,
                      border: Border.all(color: AppColors.nbBlack, width: 1.5),
                    ),
                    child: const Text(
                      '[ 0 BUKU DITEMUKAN ]',
                      style: TextStyle(
                        fontFamily: AppTheme.fontMono,
                        fontSize: 10.0,
                        fontWeight: FontWeight.w800,
                        color: AppColors.nbBlack,
                      ),
                    ),
                  ),
                  const SizedBox(height: 10.0),
                  const Text(
                    'Belum ada buku dalam kategori ini.',
                    style: TextStyle(
                      fontFamily: AppTheme.fontHeadline,
                      fontSize: 13.0,
                      fontWeight: FontWeight.w700,
                      color: AppColors.nbBlack,
                    ),
                  ),
                  const SizedBox(height: 12.0),
                  InkWell(
                    onTap: () =>
                        setState(() => _activeFilter = LibraryFilter.all),
                    child: Container(
                      height: 36.0,
                      padding: const EdgeInsets.symmetric(horizontal: 14.0),
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: AppColors.nbYellow,
                        border: Border.all(
                          color: AppColors.nbBlack,
                          width: 1.5,
                        ),
                      ),
                      child: const Text(
                        'TAMPILKAN SEMUA',
                        style: TextStyle(
                          fontFamily: AppTheme.fontHeadline,
                          fontSize: 11.0,
                          fontWeight: FontWeight.w800,
                          color: AppColors.nbBlack,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ] else ...[
            // Daftar Kartu E-Book dengan Jarak Minimal 16dp (design.md §2.3)
            for (int i = 0; i < filteredItems.length; i++) ...[
              LibraryBookCard(
                access: filteredItems[i],
                index: i,
                onRead: () => _openReader(context, filteredItems[i]),
              ),
              const SizedBox(height: 16.0),
            ],
          ],
        ],
      ),
    );
  }

  /// Filter item berdasarkan chip yang dipilih
  List<EbookAccessEntity> _getFilteredItems(List<EbookAccessEntity> items) {
    switch (_activeFilter) {
      case LibraryFilter.reading:
        return items.where((b) => b.isActive && b.isReading).toList();
      case LibraryFilter.completed:
        return items.where((b) => b.isActive && b.isCompleted).toList();
      case LibraryFilter.all:
        return items;
    }
  }

  /// Filter Chips Bar Neubrutalism (design.md §5.4)
  Widget _buildFilterChips(List<EbookAccessEntity> items) {
    final readingCount = items.where((b) => b.isActive && b.isReading).length;
    final completedCount = items
        .where((b) => b.isActive && b.isCompleted)
        .length;

    return Row(
      children: [
        Expanded(
          flex: 4,
          child: _buildChip(
            label: 'Semua (${items.length})',
            isSelected: _activeFilter == LibraryFilter.all,
            onTap: () => setState(() => _activeFilter = LibraryFilter.all),
          ),
        ),
        const SizedBox(width: 6.0),
        Expanded(
          flex: 6,
          child: _buildChip(
            label: 'Sedang Dibaca ($readingCount)',
            isSelected: _activeFilter == LibraryFilter.reading,
            onTap: () => setState(() => _activeFilter = LibraryFilter.reading),
          ),
        ),
        const SizedBox(width: 6.0),
        Expanded(
          flex: 4,
          child: _buildChip(
            label: 'Selesai ($completedCount)',
            isSelected: _activeFilter == LibraryFilter.completed,
            onTap: () =>
                setState(() => _activeFilter = LibraryFilter.completed),
          ),
        ),
      ],
    );
  }

  /// Komponen Chip Neubrutalism sesuai design.md §5.4:
  /// - Tinggi 32dp
  /// - Border 2px
  /// - Hard shadow 2px
  /// - Terpilih: fill nb-yellow + font tebal w800
  /// - Tidak terpilih: fill nb-white + font w700
  Widget _buildChip({
    required String label,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return Semantics(
      button: true,
      selected: isSelected,
      label: 'Filter $label',
      child: InkWell(
        onTap: onTap,
        child: Container(
          height: 32.0,
          padding: const EdgeInsets.symmetric(horizontal: 6.0),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: isSelected ? AppColors.nbYellow : AppColors.nbWhite,
            border: Border.all(
              color: AppColors.nbBlack,
              width: AppTheme.borderDefault,
            ),
            boxShadow: const [
              BoxShadow(
                color: AppColors.nbBlack,
                offset: Offset(2.0, 2.0),
                blurRadius: 0.0,
              ),
            ],
          ),
          child: Text(
            label,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontFamily: AppTheme.fontHeadline,
              fontSize: 10.5,
              fontWeight: isSelected ? FontWeight.w800 : FontWeight.w700,
              color: AppColors.nbBlack,
            ),
          ),
        ),
      ),
    );
  }

  /// Buka In-App PDF Reader
  void _openReader(BuildContext context, EbookAccessEntity access) {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (_) => InAppPdfReaderScreen(
          ebookId: access.ebookId,
          title: access.title,
          totalPages: access.totalPages,
        ),
      ),
    );
  }
}
