import 'package:flutter/material.dart';
import '../../../../core/constants/app_assets.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../domain/entities/ebook_access_entity.dart';

/// Kartu e-book di rak perpustakaan digital (Zona B — Neubrutalism, design.md §8.9).
///
/// Spesifikasi Visual & Interaksi Zona B:
/// - Border: 2.0px hitam solid (AppTheme.borderDefault)
/// - Shadow: 4.0px hard offset hitam tanpa blur (Offset(4.0, 4.0))
/// - Radius: 0 (sudut siku murni)
/// - Cover E-book: rasio 2:3, border 2.0px + shadow 2.5px, badge format dokumen di pojok
/// - Aksen warna: 1 aksen per kartu (design.md §1.1 Zona B)
/// - Status Akses: Tipografi kontras tinggi ("AKSES AKTIF" / "AKSES DICABUT") dengan dot indikator
/// - Progres Membaca: Space Mono untuk halaman & persentase, bar track neubrutalist
/// - Tombol Aksi: Tipografi tegas tanpa ikon berlebihan ("BACA" / "AKSES DICABUT")
class LibraryBookCard extends StatelessWidget {
  final EbookAccessEntity access;
  final VoidCallback onRead;
  final int index;

  const LibraryBookCard({
    super.key,
    required this.access,
    required this.onRead,
    this.index = 0,
  });

  /// Mengambil satu warna aksen spesifik per kartu (design.md §1.1 Zona B)
  Color _getCoverAccentColor(int idx) {
    const colors = [
      AppColors.nbYellow,
      AppColors.nbLavender,
      AppColors.nbBlue,
      AppColors.nbGreen,
      AppColors.nbOrange,
    ];
    return colors[idx % colors.length];
  }

  /// Menentukan asset path cover jika tersedia di AppAssets
  String? _resolveCoverAssetPath() {
    final titleLower = access.title.toLowerCase();
    if (titleLower.contains('flutter') ||
        titleLower.contains('clean architecture')) {
      return AppAssets.coverDesainSistemModern;
    }
    if (titleLower.contains('desain') ||
        titleLower.contains('neubrutalisme') ||
        titleLower.contains('antarmuka')) {
      return AppAssets.coverPsikologiProdukDigital;
    }
    if (titleLower.contains('saw') || titleLower.contains('keputusan')) {
      return AppAssets.coverAlgoritmaStrukturData;
    }
    if (access.coverUrl != null && access.coverUrl!.isNotEmpty) {
      return access.coverUrl;
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    final accentColor = _getCoverAccentColor(index);
    final coverAsset = _resolveCoverAssetPath();

    return Container(
      key: Key('library_book_card_${access.ebookId}'),
      padding: const EdgeInsets.all(14.0),
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
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Cover Sampul Buku Fisik 2:3 dengan bingkai neubrutalism
              _buildCoverThumbnail(accentColor, coverAsset),

              const SizedBox(width: 14.0),

              // Detail E-book & Status Akses
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Badge Status Akses Tipografis
                    _buildStatusBadge(),

                    const SizedBox(height: 8.0),

                    // Judul E-book (Space Grotesk 700)
                    Text(
                      access.title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontFamily: AppTheme.fontHeadline,
                        fontSize: 14.0,
                        fontWeight: FontWeight.w700,
                        color: AppColors.nbBlack,
                        height: 1.25,
                      ),
                    ),

                    const SizedBox(height: 4.0),

                    // Penulis E-book (Inter 400)
                    Text(
                      access.author,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontFamily: AppTheme.fontBody,
                        fontSize: 11.5,
                        color: AppColors.nbTextMuted,
                      ),
                    ),

                    const SizedBox(height: 8.0),

                    // Meta: Format & Total Halaman (Space Mono 700)
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6.0,
                        vertical: 2.0,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.nbPaper,
                        border: Border.all(
                          color: AppColors.nbBlack,
                          width: 1.0,
                        ),
                      ),
                      child: Text(
                        '${access.format} // ${access.totalPages} HALAMAN',
                        style: const TextStyle(
                          fontFamily: AppTheme.fontMono,
                          fontSize: 9.5,
                          fontWeight: FontWeight.w700,
                          color: AppColors.nbBlack,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          // Baris Progres Membaca (Hanya tampil jika Akses Aktif)
          if (access.isActive) ...[
            const SizedBox(height: 14.0),
            _buildReadingProgress(),
          ],

          // Pesan Penolakan jika Akses Dicabut (design.md §8.9)
          if (!access.isActive) ...[
            const SizedBox(height: 12.0),
            Container(
              padding: const EdgeInsets.symmetric(
                horizontal: 10.0,
                vertical: 8.0,
              ),
              decoration: BoxDecoration(
                color: AppColors.nbPink.withValues(alpha: 0.15),
                border: Border.all(color: AppColors.nbPink, width: 1.5),
              ),
              child: const Text(
                'Akses e-book ini dicabut oleh Administrator.',
                style: TextStyle(
                  fontFamily: AppTheme.fontBody,
                  fontSize: 11.0,
                  color: AppColors.nbBlack,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ],

          const SizedBox(height: 12.0),

          // Tombol Aksi BACA / AKSES DICABUT (Tinggi 44dp, tipografi tegas tanpa ikon)
          _buildActionButton(),
        ],
      ),
    );
  }

  /// Cover Thumbnail E-Book Rasio 2:3 dengan bingkai border dan hard shadow (design.md §4)
  Widget _buildCoverThumbnail(Color accentColor, String? coverAsset) {
    final embeddedBytes = coverAsset != null
        ? AppAssets.getEmbeddedBytes(coverAsset)
        : null;

    return Container(
      width: 76.0,
      height: 114.0, // Rasio 2:3
      decoration: BoxDecoration(
        color: accentColor,
        border: Border.all(
          color: AppColors.nbBlack,
          width: AppTheme.borderDefault,
        ),
        boxShadow: const [
          BoxShadow(
            color: AppColors.nbBlack,
            offset: Offset(2.5, 2.5),
            blurRadius: 0.0,
          ),
        ],
      ),
      child: Stack(
        fit: StackFit.expand,
        children: [
          // Gambar cover asli jika tersedia
          if (embeddedBytes != null)
            Image.memory(
              embeddedBytes,
              fit: BoxFit.cover,
              semanticLabel: 'Sampul ${access.title}',
              gaplessPlayback: true,
              errorBuilder: (context, error, stackTrace) =>
                  _buildFallbackCoverContent(accentColor),
            )
          else
            _buildFallbackCoverContent(accentColor),

          // Tag Format Dokumen di Pojok Kanan Bawah
          Positioned(
            bottom: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.symmetric(
                horizontal: 5.0,
                vertical: 2.0,
              ),
              decoration: const BoxDecoration(color: AppColors.nbBlack),
              child: Text(
                access.format.contains('EPUB') ? 'EPUB' : 'PDF',
                style: const TextStyle(
                  fontFamily: AppTheme.fontMono,
                  fontSize: 8.5,
                  fontWeight: FontWeight.w700,
                  color: AppColors.nbWhite,
                  letterSpacing: 0.5,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// Sampul Tipografis Neubrutalism Elegan jika gambar cover tidak tersedia (tanpa ikon generik)
  Widget _buildFallbackCoverContent(Color accentColor) {
    return Container(
      color: accentColor,
      padding: const EdgeInsets.all(6.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 4.0, vertical: 1.5),
            color: AppColors.nbBlack,
            child: const Text(
              'BUKUKITA',
              style: TextStyle(
                fontFamily: AppTheme.fontMono,
                fontSize: 6.5,
                fontWeight: FontWeight.w900,
                color: AppColors.nbWhite,
                letterSpacing: 0.5,
              ),
            ),
          ),
          Text(
            access.title.toUpperCase(),
            maxLines: 3,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              fontFamily: AppTheme.fontHeadline,
              fontSize: 8.5,
              fontWeight: FontWeight.w900,
              color: AppColors.nbBlack,
              height: 1.15,
            ),
          ),
          Container(height: 2.0, width: 24.0, color: AppColors.nbBlack),
        ],
      ),
    );
  }

  /// Badge Status Akses ("AKSES AKTIF" / "AKSES DICABUT") dengan Dot Indikator Kontras
  Widget _buildStatusBadge() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 3.0),
      decoration: BoxDecoration(
        color: access.isActive ? AppColors.nbGreen : AppColors.nbPink,
        border: Border.all(color: AppColors.nbBlack, width: 1.5),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 6.0,
            height: 6.0,
            decoration: const BoxDecoration(
              color: AppColors.nbBlack,
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 5.0),
          Text(
            access.isActive ? 'AKSES AKTIF' : 'AKSES DICABUT',
            style: const TextStyle(
              fontFamily: AppTheme.fontMono,
              fontSize: 9.5,
              fontWeight: FontWeight.w800,
              color: AppColors.nbBlack,
              letterSpacing: 0.4,
            ),
          ),
        ],
      ),
    );
  }

  /// Bar Progres Membaca (Space Mono angka halaman & persentase)
  Widget _buildReadingProgress() {
    final percentInt = (access.progressPercent * 100).toInt();
    final String progressText = access.currentPage == 0
        ? 'Belum Dimulai'
        : access.isCompleted
        ? '${access.totalPages} dari ${access.totalPages} Hal (Selesai)'
        : 'Halaman ${access.currentPage} dari ${access.totalPages}';

    final String percentText = access.isCompleted
        ? '100% SELESAI'
        : '$percentInt%';

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Text(
                progressText,
                style: const TextStyle(
                  fontFamily: AppTheme.fontMono,
                  fontSize: 10.5,
                  fontWeight: FontWeight.w700,
                  color: AppColors.nbBlack,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            const SizedBox(width: 8.0),
            Text(
              percentText,
              style: const TextStyle(
                fontFamily: AppTheme.fontMono,
                fontSize: 10.5,
                fontWeight: FontWeight.w800,
                color: AppColors.nbBlack,
              ),
            ),
          ],
        ),
        const SizedBox(height: 5.0),
        Container(
          height: 8.0,
          decoration: BoxDecoration(
            color: AppColors.nbMuted,
            border: Border.all(color: AppColors.nbBlack, width: 1.5),
          ),
          child: FractionallySizedBox(
            alignment: Alignment.centerLeft,
            widthFactor: access.progressPercent > 0
                ? access.progressPercent
                : 0.0,
            child: Container(
              decoration: BoxDecoration(
                color: access.isCompleted
                    ? AppColors.nbGreen
                    : AppColors.nbYellow,
                border: const Border(
                  right: BorderSide(color: AppColors.nbBlack, width: 1.5),
                ),
              ),
            ),
          ),
        ),
      ],
    );
  }

  /// Tombol Aksi BACA / AKSES DICABUT (Tinggi 44dp, tipografi tegas tanpa ikon dekoratif)
  Widget _buildActionButton() {
    return Semantics(
      button: true,
      label: access.isActive
          ? 'Baca ${access.title}'
          : 'Akses ${access.title} dicabut',
      child: InkWell(
        key: Key('library_read_button_${access.ebookId}'),
        onTap: access.isActive ? onRead : null,
        child: Container(
          height: 44.0,
          padding: const EdgeInsets.symmetric(horizontal: 14.0),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: access.isActive ? AppColors.nbYellow : AppColors.nbMuted,
            border: Border.all(
              color: AppColors.nbBlack,
              width: AppTheme.borderDefault,
            ),
            boxShadow: access.isActive
                ? const [
                    BoxShadow(
                      color: AppColors.nbBlack,
                      offset: Offset(2.5, 2.5),
                      blurRadius: 0.0,
                    ),
                  ]
                : const [],
          ),
          child: Text(
            access.isActive ? 'BACA' : 'AKSES DICABUT',
            style: TextStyle(
              fontFamily: AppTheme.fontHeadline,
              fontSize: 13.0,
              fontWeight: FontWeight.w800,
              color: access.isActive
                  ? AppColors.nbBlack
                  : AppColors.nbDisabledText,
              letterSpacing: 0.6,
            ),
          ),
        ),
      ),
    );
  }
}
