import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// Bilah kontrol pembaca PDF di dalam aplikasi (InAppPdfReaderToolbar)
/// Mengikuti Google Stitch & `design.md §5 & §8.9` (Zona C):
/// - Latar `nb-paper`/`nb-white`, `border-thin` (2px), nomor halaman `Space Mono`.
/// - Navigasi halaman (Sebelumnya / Selanjutnya) dan zoom (Perbesar / Perkecil).
/// - **DILARANG** ada opsi unduh atau ekspor bebas ke penyimpanan perangkat (ADR-0006).
class InAppPdfReaderToolbar extends StatelessWidget {
  final String title;
  final int currentPage;
  final int totalPages;
  final double zoomLevel;
  final VoidCallback onPreviousPage;
  final VoidCallback onNextPage;
  final VoidCallback onZoomIn;
  final VoidCallback onZoomOut;
  final VoidCallback onClose;
  final bool isSearching;
  final VoidCallback? onToggleSearch;
  final TextEditingController? searchController;
  final ValueChanged<String>? onSearchChanged;
  final VoidCallback? onSearchNext;
  final VoidCallback? onSearchPrevious;
  final int currentMatchIndex;
  final int totalMatches;

  const InAppPdfReaderToolbar({
    super.key,
    required this.title,
    required this.currentPage,
    required this.totalPages,
    required this.zoomLevel,
    required this.onPreviousPage,
    required this.onNextPage,
    required this.onZoomIn,
    required this.onZoomOut,
    required this.onClose,
    this.isSearching = false,
    this.onToggleSearch,
    this.searchController,
    this.onSearchChanged,
    this.onSearchNext,
    this.onSearchPrevious,
    this.currentMatchIndex = 0,
    this.totalMatches = 0,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const Key('in_app_pdf_reader_toolbar'),
      decoration: const BoxDecoration(
        color: AppColors.nbWhite,
        border: Border(
          bottom: BorderSide(
            color: AppColors.nbBlack,
            width: AppTheme.borderThin,
          ),
        ),
      ),
      child: SafeArea(
        bottom: false,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Baris 1: Tombol Tutup, Judul E-book, Badge In-App Reader Privat
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 12.0,
                vertical: 8.0,
              ),
              child: Row(
                children: [
                  // Tombol Kembali / Tutup Reader
                  Semantics(
                    button: true,
                    label: 'Tutup Reader',
                    child: InkWell(
                      key: const Key('reader_close_button'),
                      onTap: onClose,
                      child: Container(
                        width: 38.0,
                        height: 38.0,
                        alignment: Alignment.center,
                        decoration: BoxDecoration(
                          color: AppColors.nbPaper,
                          border: Border.all(
                            color: AppColors.nbBlack,
                            width: AppTheme.borderThin,
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

                  const SizedBox(width: 10.0),

                  // Judul E-book
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontFamily: AppTheme.fontHeadline,
                            fontSize: 13.0,
                            fontWeight: FontWeight.w800,
                            color: AppColors.nbBlack,
                          ),
                        ),
                        const SizedBox(height: 1.0),
                        const Text(
                          'IN-APP VIEWER // BUCKET PRIVAT',
                          style: TextStyle(
                            fontFamily: AppTheme.fontMono,
                            fontSize: 9.5,
                            fontWeight: FontWeight.w700,
                            color: AppColors.nbTextMuted,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(width: 8.0),

                  // Zoom Controls
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      _buildToolbarButton(
                        key: const Key('reader_zoom_out_button'),
                        icon: Icons.remove,
                        label: 'Perkecil',
                        onTap: onZoomOut,
                        enabled: zoomLevel > 0.8,
                      ),
                      const SizedBox(width: 4.0),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 4.0,
                          vertical: 2.0,
                        ),
                        child: Text(
                          '${(zoomLevel * 100).round()}%',
                          style: const TextStyle(
                            fontFamily: AppTheme.fontMono,
                            fontSize: 10.0,
                            fontWeight: FontWeight.w700,
                            color: AppColors.nbBlack,
                          ),
                        ),
                      ),
                      const SizedBox(width: 4.0),
                      _buildToolbarButton(
                        key: const Key('reader_zoom_in_button'),
                        icon: Icons.add,
                        label: 'Perbesar',
                        onTap: onZoomIn,
                        enabled: zoomLevel < 2.0,
                      ),
                      if (onToggleSearch != null) ...[
                        const SizedBox(width: 4.0),
                        _buildToolbarButton(
                          key: const Key('reader_toggle_search_button'),
                          icon: Icons.search,
                          label: 'Cari Teks',
                          onTap: onToggleSearch!,
                          enabled: true,
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),

            // Baris Pencarian Teks PDF (P3.2)
            if (isSearching)
              Container(
                key: const Key('reader_search_panel'),
                padding: const EdgeInsets.symmetric(
                  horizontal: 12.0,
                  vertical: 6.0,
                ),
                decoration: const BoxDecoration(
                  color: AppColors.nbYellow,
                  border: Border(
                    top: BorderSide(
                      color: AppColors.nbBlack,
                      width: AppTheme.borderThin,
                    ),
                  ),
                ),
                child: Row(
                  children: [
                    const Icon(
                      Icons.search,
                      size: 18.0,
                      color: AppColors.nbBlack,
                    ),
                    const SizedBox(width: 8.0),
                    Expanded(
                      child: TextField(
                        key: const Key('reader_search_input'),
                        controller: searchController,
                        onChanged: onSearchChanged,
                        style: const TextStyle(
                          fontSize: 12.0,
                          color: AppColors.nbBlack,
                        ),
                        decoration: const InputDecoration(
                          hintText: 'Cari kata dalam PDF...',
                          hintStyle: TextStyle(
                            fontSize: 12.0,
                            color: AppColors.nbTextMuted,
                          ),
                          isDense: true,
                          contentPadding: EdgeInsets.symmetric(
                            horizontal: 8.0,
                            vertical: 6.0,
                          ),
                          border: InputBorder.none,
                        ),
                      ),
                    ),
                    if (totalMatches > 0)
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 6.0),
                        child: Text(
                          '$currentMatchIndex / $totalMatches',
                          style: const TextStyle(
                            fontFamily: AppTheme.fontMono,
                            fontSize: 11.0,
                            fontWeight: FontWeight.bold,
                            color: AppColors.nbBlack,
                          ),
                        ),
                      ),
                    InkWell(
                      key: const Key('reader_search_prev_button'),
                      onTap: onSearchPrevious,
                      child: const Icon(
                        Icons.navigate_before,
                        size: 22.0,
                        color: AppColors.nbBlack,
                      ),
                    ),
                    const SizedBox(width: 4.0),
                    InkWell(
                      key: const Key('reader_search_next_button'),
                      onTap: onSearchNext,
                      child: const Icon(
                        Icons.navigate_next,
                        size: 22.0,
                        color: AppColors.nbBlack,
                      ),
                    ),
                    const SizedBox(width: 8.0),
                    InkWell(
                      key: const Key('reader_search_close_button'),
                      onTap: onToggleSearch,
                      child: const Icon(
                        Icons.close,
                        size: 18.0,
                        color: AppColors.nbBlack,
                      ),
                    ),
                  ],
                ),
              ),

            const Divider(
              height: 1.0,
              thickness: 1.0,
              color: AppColors.nbBlack,
            ),

            // Baris 2: Indikator Nomor Halaman & Tombol Navigasi Halaman
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 12.0,
                vertical: 6.0,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Tombol Halaman Sebelumnya
                  Flexible(
                    child: _buildNavButton(
                      key: const Key('reader_prev_page_button'),
                      icon: Icons.chevron_left,
                      label: 'SEBELUMNYA',
                      onTap: onPreviousPage,
                      enabled: currentPage > 1,
                    ),
                  ),

                  const SizedBox(width: 6.0),

                  // Nomor Halaman (Space Mono)
                  FittedBox(
                    fit: BoxFit.scaleDown,
                    child: Container(
                      key: const Key('reader_page_indicator'),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8.0,
                        vertical: 4.0,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.nbPaper,
                        border: Border.all(
                          color: AppColors.nbBlack,
                          width: AppTheme.borderThin,
                        ),
                      ),
                      child: Text(
                        'Halaman $currentPage / $totalPages',
                        style: const TextStyle(
                          fontFamily: AppTheme.fontMono,
                          fontSize: 11.5,
                          fontWeight: FontWeight.w700,
                          color: AppColors.nbBlack,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(width: 6.0),

                  // Tombol Halaman Selanjutnya
                  Flexible(
                    child: _buildNavButton(
                      key: const Key('reader_next_page_button'),
                      icon: Icons.chevron_right,
                      label: 'SELANJUTNYA',
                      isForward: true,
                      onTap: onNextPage,
                      enabled: currentPage < totalPages,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildToolbarButton({
    required Key key,
    required IconData icon,
    required String label,
    required VoidCallback onTap,
    required bool enabled,
  }) {
    return Semantics(
      button: true,
      label: label,
      child: InkWell(
        key: key,
        onTap: enabled ? onTap : null,
        child: Container(
          width: 30.0,
          height: 30.0,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: enabled ? AppColors.nbWhite : AppColors.nbMuted,
            border: Border.all(color: AppColors.nbBlack, width: 1.5),
          ),
          child: Icon(
            icon,
            size: 16.0,
            color: enabled ? AppColors.nbBlack : AppColors.nbDisabledText,
          ),
        ),
      ),
    );
  }

  Widget _buildNavButton({
    required Key key,
    required IconData icon,
    required String label,
    required VoidCallback onTap,
    required bool enabled,
    bool isForward = false,
  }) {
    return Semantics(
      button: true,
      label: label,
      child: InkWell(
        key: key,
        onTap: enabled ? onTap : null,
        child: Container(
          height: 34.0,
          padding: const EdgeInsets.symmetric(horizontal: 8.0),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: enabled ? AppColors.nbYellow : AppColors.nbMuted,
            border: Border.all(
              color: AppColors.nbBlack,
              width: AppTheme.borderThin,
            ),
            boxShadow: enabled
                ? const [
                    BoxShadow(
                      color: AppColors.nbBlack,
                      offset: Offset(1.5, 1.5),
                      blurRadius: 0.0,
                    ),
                  ]
                : const [],
          ),
          child: FittedBox(
            fit: BoxFit.scaleDown,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (!isForward) ...[
                  Icon(
                    icon,
                    size: 16.0,
                    color: enabled
                        ? AppColors.nbBlack
                        : AppColors.nbDisabledText,
                  ),
                  const SizedBox(width: 4.0),
                ],
                Text(
                  label,
                  style: TextStyle(
                    fontFamily: AppTheme.fontHeadline,
                    fontSize: 10.5,
                    fontWeight: FontWeight.w800,
                    color: enabled
                        ? AppColors.nbBlack
                        : AppColors.nbDisabledText,
                    letterSpacing: 0.3,
                  ),
                ),
                if (isForward) ...[
                  const SizedBox(width: 4.0),
                  Icon(
                    icon,
                    size: 16.0,
                    color: enabled
                        ? AppColors.nbBlack
                        : AppColors.nbDisabledText,
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
