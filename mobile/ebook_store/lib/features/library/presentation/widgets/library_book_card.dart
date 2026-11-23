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
/// - Cover E-book: rasio 2:3, border 2.0px + shadow 2.0px, badge format dokumen di pojok
/// - Aksen warna: 1 aksen per kartu (design.md §1.1 Zona B)
/// - Status Akses: Ikon + Teks ("AKSES AKTIF" / "AKSES DICABUT")
/// - Progres Membaca: Space Mono untuk halaman & persentase, bar track neubrutalist
/// - Tombol Aksi: "BACA" (nb-yellow primer) atau "AKSES DICABUT" (nb-muted nonaktif)
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
                    // Badge Status Akses & Ikon Verifikasi Status Lisensi
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        _buildStatusBadge(),
                        Icon(
                          access.isActive ? Icons.verified : Icons.block,
                          size: 16.0,
                          color: access.isActive
                              ? AppColors.nbBlack
                              : AppColors.nbPink,
                        ),
                      ],
                    ),

                    const SizedBox(height: 8.0),

                    // Judul E-book (Space Grotesk 700)
                    Text(
                      access.title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontFamily: AppTheme.fontHeadline,
                        fontSize: 13.5,
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
                        '${access.format} • ${access.totalPages} Halaman',
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
                color: AppColors.nbPaper,
                border: Border.all(color: AppColors.nbBlack, width: 1.5),
              ),
              child: const Row(
                children: [
                  Icon(Icons.info_outline, size: 15.0, color: AppColors.nbPink),
                  SizedBox(width: 8.0),
                  Expanded(
                    child: Text(
                      'Akses e-book ini dicabut oleh Administrator.',
                      style: TextStyle(
                        fontFamily: AppTheme.fontBody,
                        fontSize: 11.0,
                        color: AppColors.nbPink,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],

          const SizedBox(height: 12.0),

          // Tombol Aksi BACA / AKSES DICABUT (Tinggi 44dp, target sentuh nyaman)
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
          // Gambar cover asli Google Stitch jika tersedia
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

  /// Konten fallback jika gambar cover belum tersedia (design.md §4)
  Widget _buildFallbackCoverContent(Color accentColor) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            Icons.menu_book,
            size: 28.0,
            color: AppColors.nbBlack.withValues(alpha: 0.85),
          ),
          const SizedBox(height: 3.0),
          Container(width: 32.0, height: 2.5, color: AppColors.nbBlack),
        ],
      ),
    );
  }

  /// Badge Status Akses ("AKSES AKTIF" / "AKSES DICABUT") sesuai pemetaan semantik status
  Widget _buildStatusBadge() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7.0, vertical: 2.5),
      decoration: BoxDecoration(
        color: access.isActive ? AppColors.nbGreen : AppColors.nbPink,
        border: Border.all(color: AppColors.nbBlack, width: 1.5),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            access.isActive ? Icons.verified : Icons.block,
            size: 11.0,
            color: AppColors.nbBlack,
          ),
          const SizedBox(width: 4.0),
          Text(
            access.isActive ? 'AKSES AKTIF' : 'AKSES DICABUT',
            style: const TextStyle(
              fontFamily: AppTheme.fontMono,
              fontSize: 9.5,
              fontWeight: FontWeight.w800,
              color: AppColors.nbBlack,
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

  /// Tombol Aksi BACA / AKSES DICABUT (Tinggi 44dp, target tekan memenuhi WCAG)
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
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                access.isActive ? Icons.auto_stories : Icons.lock,
                size: 16.0,
                color: access.isActive
                    ? AppColors.nbBlack
                    : AppColors.nbDisabledText,
              ),
              const SizedBox(width: 8.0),
              Text(
                access.isActive ? 'BACA' : 'AKSES DICABUT',
                style: TextStyle(
                  fontFamily: AppTheme.fontHeadline,
                  fontSize: 12.5,
                  fontWeight: FontWeight.w700,
                  color: access.isActive
                      ? AppColors.nbBlack
                      : AppColors.nbDisabledText,
                  letterSpacing: 0.5,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
