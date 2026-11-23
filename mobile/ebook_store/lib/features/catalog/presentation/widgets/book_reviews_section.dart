import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../domain/entities/book_review.dart';
import '../../domain/entities/catalog_ebook.dart';
import 'rating_stars.dart';

enum ReviewFilter { all, five, four, verified }

/// Seksi Ulasan & Penilaian Pembaca pada Detail E-Book (design.md §5.9 & §8.5, FR-C12).
/// Menerapkan estetika Neubrutalism Zona B (Operasional):
/// - Border 2px hitam, bayangan 3–4px tanpa blur.
/// - Ringkasan rating besar (Space Mono) + RatingStars kotak persegi (design.md §5.9).
/// - Bar distribusi bintang interaktif (dapat diklik langsung untuk memfilter).
/// - Filter chips interaktif (Semua, 5 Bintang, 4 Bintang, Terverifikasi).
/// - Formulir kirim ulasan khusus pembeli terverifikasi (`isVerifiedOwner = true`).
/// - Kartu ulasan pembaca lengkap dengan badge `TERVERIFIKASI`, strip aksen, dan tombol "Bermanfaat".
class BookReviewsSection extends StatefulWidget {
  final CatalogEbook book;
  final bool isVerifiedOwner;

  const BookReviewsSection({
    super.key,
    required this.book,
    this.isVerifiedOwner = false,
  });

  @override
  State<BookReviewsSection> createState() => _BookReviewsSectionState();
}

class _BookReviewsSectionState extends State<BookReviewsSection> {
  late List<BookReview> _reviews;
  ReviewFilter _activeFilter = ReviewFilter.all;
  final Set<String> _helpfulVotedIds = <String>{};

  // State Form Tulis Ulasan
  bool _isFormOpen = false;
  int _selectedRating = 5;
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _commentController = TextEditingController();
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();

  @override
  void initState() {
    super.initState();
    _reviews = BookReview.getSimulatedReviewsForBook(
      ebookId: widget.book.id,
      ebookTitle: widget.book.title,
      author: widget.book.author,
      categoryName: widget.book.categoryName,
    );
  }

  @override
  void dispose() {
    _titleController.dispose();
    _commentController.dispose();
    super.dispose();
  }

  List<BookReview> get _filteredReviews {
    switch (_activeFilter) {
      case ReviewFilter.five:
        return _reviews.where((r) => r.rating == 5).toList();
      case ReviewFilter.four:
        return _reviews.where((r) => r.rating == 4).toList();
      case ReviewFilter.verified:
        return _reviews.where((r) => r.isVerifiedPurchase).toList();
      case ReviewFilter.all:
        return _reviews;
    }
  }

  double get _averageRating {
    if (_reviews.isEmpty) return 0.0;
    final sum = _reviews.fold<int>(0, (acc, r) => acc + r.rating);
    return sum / _reviews.length;
  }

  Color _getReviewerAccent(int index) {
    const accents = [
      AppColors.nbYellow,
      AppColors.nbLavender,
      AppColors.nbBlue,
      AppColors.nbGreen,
      AppColors.nbOrange,
    ];
    return accents[index % accents.length];
  }

  String _formatDate(DateTime dt) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'Mei',
      'Jun',
      'Jul',
      'Agu',
      'Sep',
      'Okt',
      'Nov',
      'Des',
    ];
    return '${dt.day.toString().padLeft(2, '0')} ${months[dt.month - 1]} ${dt.year}';
  }

  void _submitReview() {
    if (!_formKey.currentState!.validate()) return;

    final newReview = BookReview(
      id: '${widget.book.id}-custom-${DateTime.now().millisecondsSinceEpoch}',
      ebookId: widget.book.id,
      reviewerName: 'Pembaca Terverifikasi',
      reviewerRole: 'Pengguna BUKUKITA',
      rating: _selectedRating,
      title: _titleController.text.trim(),
      comment: _commentController.text.trim(),
      createdAt: DateTime.now(),
      isVerifiedPurchase: true,
      helpfulCount: 0,
      isSimulation: true,
    );

    setState(() {
      _reviews.insert(0, newReview);
      _titleController.clear();
      _commentController.clear();
      _isFormOpen = false;
    });

    final messenger = ScaffoldMessenger.maybeOf(context);
    if (messenger != null) {
      messenger.hideCurrentSnackBar();
      messenger.showSnackBar(
        SnackBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          behavior: SnackBarBehavior.floating,
          content: Container(
            padding: const EdgeInsets.symmetric(
              horizontal: 14.0,
              vertical: 10.0,
            ),
            decoration: AppTheme.brutalBox(
              color: AppColors.nbGreen,
              borderColor: AppColors.nbBlack,
              borderWidth: AppTheme.borderDefault,
              shadowOffset: 3,
            ),
            child: Row(
              children: const [
                Icon(
                  Icons.check_circle_outline,
                  color: AppColors.nbBlack,
                  size: 18.0,
                ),
                SizedBox(width: 8.0),
                Expanded(
                  child: Text(
                    'Ulasan Anda berhasil dikirim!',
                    style: TextStyle(
                      fontFamily: AppTheme.fontHeadline,
                      fontSize: 12.0,
                      fontWeight: FontWeight.w800,
                      color: AppColors.nbBlack,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }
  }

  void _toggleHelpful(String reviewId) {
    setState(() {
      if (_helpfulVotedIds.contains(reviewId)) {
        _helpfulVotedIds.remove(reviewId);
      } else {
        _helpfulVotedIds.add(reviewId);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _filteredReviews;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // 1. Header Bagian + Badge DATA SIMULASI (design.md §17)
        _buildSectionHeader(),

        const SizedBox(height: 14.0),

        // 2. Ringkasan Skor & Distribusi Bintang (Rating Breakdown)
        _buildRatingBreakdownCard(),

        const SizedBox(height: 16.0),

        // 3. Tombol / Panel Form Ulasan
        _buildWriteReviewSection(),

        const SizedBox(height: 16.0),

        // 4. Chip Filter Ulasan
        _buildFilterChipsRow(),

        const SizedBox(height: 14.0),

        // 5. Daftar Kartu Ulasan
        if (filtered.isEmpty)
          _buildEmptyFilterState()
        else
          for (int i = 0; i < filtered.length; i++) ...[
            _buildReviewCard(filtered[i], i),
            const SizedBox(height: 14.0),
          ],
      ],
    );
  }

  /// Header Seksi dengan Badge Jumlah Ulasan & DATA SIMULASI
  Widget _buildSectionHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Judul + Badge Counter
            Expanded(
              child: Row(
                children: [
                  Container(
                    width: 28.0,
                    height: 28.0,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: AppColors.nbYellow,
                      border: Border.all(color: AppColors.nbBlack, width: 1.5),
                    ),
                    child: const Icon(
                      Icons.star_rate_rounded,
                      size: 18.0,
                      color: AppColors.nbBlack,
                    ),
                  ),
                  const SizedBox(width: 8.0),
                  Flexible(
                    child: Text(
                      'Ulasan & Penilaian Pembaca',
                      style: AppTheme.headlineSmMobile(AppColors.nbBlack),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8.0),
            // Badge DATA SIMULASI
            Container(
              padding: const EdgeInsets.symmetric(
                horizontal: 8.0,
                vertical: 3.0,
              ),
              decoration: BoxDecoration(
                color: AppColors.nbPaper,
                border: Border.all(color: AppColors.nbBlack, width: 1.5),
                boxShadow: const [
                  BoxShadow(
                    color: AppColors.nbBlack,
                    offset: Offset(1.5, 1.5),
                    blurRadius: 0.0,
                  ),
                ],
              ),
              child: const Text(
                'DATA SIMULASI',
                style: TextStyle(
                  fontFamily: AppTheme.fontMono,
                  fontSize: 9.5,
                  fontWeight: FontWeight.w800,
                  color: AppColors.nbTextMuted,
                  letterSpacing: 0.5,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 4.0),
        Text(
          'Ulasan autentik dan penilaian objektif dari pembeli terverifikasi.',
          style: AppTheme.bodySm(AppColors.nbTextMuted, fontSize: 12.0),
        ),
      ],
    );
  }

  /// Kartu Ringkasan Penilaian (Zona B — Neubrutalism)
  Widget _buildRatingBreakdownCard() {
    final avg = _averageRating;
    final totalCount = _reviews.length;

    return Container(
      key: const Key('reviews_rating_summary_card'),
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: AppColors.nbWhite,
        border: Border.all(
          color: AppColors.nbBlack,
          width: AppTheme.borderDefault,
        ),
        boxShadow: const [
          BoxShadow(
            color: AppColors.nbBlack,
            offset: Offset(3.5, 3.5),
            blurRadius: 0.0,
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // Kolom Kiri: Hero Score Box (Space Mono) + RatingStars kotak (design.md §5.9)
          Container(
            padding: const EdgeInsets.symmetric(
              horizontal: 14.0,
              vertical: 12.0,
            ),
            decoration: BoxDecoration(
              color: AppColors.nbYellow,
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
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  avg.toStringAsFixed(1),
                  style: const TextStyle(
                    fontFamily: AppTheme.fontMono,
                    fontSize: 32.0,
                    fontWeight: FontWeight.w900,
                    color: AppColors.nbBlack,
                    height: 1.0,
                  ),
                ),
                const SizedBox(height: 6.0),
                // RatingStars: 5 kotak persegi (design.md §5.9)
                RatingStars(
                  rating: avg,
                  starSize: 12.0,
                  spacing: 2.0,
                  showScoreText: false,
                ),
                const SizedBox(height: 6.0),
                Text(
                  '$totalCount Ulasan',
                  style: const TextStyle(
                    fontFamily: AppTheme.fontMono,
                    fontSize: 10.0,
                    fontWeight: FontWeight.w800,
                    color: AppColors.nbBlack,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(width: 14.0),

          // Kolom Kanan: Bar Distribusi Bintang Interaktif 5 s.d 1
          Expanded(
            child: Column(
              children: [
                for (int star = 5; star >= 1; star--) ...[
                  _buildInteractiveDistributionBar(star, totalCount),
                  if (star > 1) const SizedBox(height: 4.0),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  /// Bar Distribusi Bintang (Dapat diklik untuk memfilter langsung)
  Widget _buildInteractiveDistributionBar(int star, int totalCount) {
    final count = _reviews.where((r) => r.rating == star).length;
    final ratio = totalCount > 0 ? count / totalCount : 0.0;
    final isMatchingFilter =
        (_activeFilter == ReviewFilter.five && star == 5) ||
        (_activeFilter == ReviewFilter.four && star == 4);

    return InkWell(
      onTap: () {
        setState(() {
          if (star == 5) {
            _activeFilter = _activeFilter == ReviewFilter.five
                ? ReviewFilter.all
                : ReviewFilter.five;
          } else if (star == 4) {
            _activeFilter = _activeFilter == ReviewFilter.four
                ? ReviewFilter.all
                : ReviewFilter.four;
          }
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 2.0, horizontal: 2.0),
        decoration: BoxDecoration(
          color: isMatchingFilter
              ? AppColors.nbYellow.withValues(alpha: 0.25)
              : Colors.transparent,
        ),
        child: Row(
          children: [
            SizedBox(
              width: 22.0,
              child: Text(
                '$star★',
                style: TextStyle(
                  fontFamily: AppTheme.fontMono,
                  fontSize: 10.5,
                  fontWeight: isMatchingFilter
                      ? FontWeight.w900
                      : FontWeight.w700,
                  color: AppColors.nbBlack,
                ),
              ),
            ),
            const SizedBox(width: 4.0),
            Expanded(
              child: Container(
                height: 11.0,
                decoration: BoxDecoration(
                  color: AppColors.nbPaper,
                  border: Border.all(color: AppColors.nbBlack, width: 1.2),
                ),
                child: FractionallySizedBox(
                  alignment: Alignment.centerLeft,
                  widthFactor: ratio,
                  child: Container(
                    color: star >= 4 ? AppColors.nbYellow : AppColors.nbOrange,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8.0),
            SizedBox(
              width: 18.0,
              child: Text(
                '$count',
                textAlign: TextAlign.end,
                style: TextStyle(
                  fontFamily: AppTheme.fontMono,
                  fontSize: 10.0,
                  fontWeight: FontWeight.w800,
                  color: isMatchingFilter
                      ? AppColors.nbBlack
                      : AppColors.nbTextMuted,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  /// Bagian Form Tulis Ulasan / Informasi Hak Akses
  Widget _buildWriteReviewSection() {
    if (!widget.isVerifiedOwner) {
      return Container(
        padding: const EdgeInsets.all(12.0),
        decoration: BoxDecoration(
          color: AppColors.nbPaper,
          border: Border.all(color: AppColors.nbBlack, width: 1.5),
          boxShadow: const [
            BoxShadow(
              color: AppColors.nbBlack,
              offset: Offset(2.0, 2.0),
              blurRadius: 0.0,
            ),
          ],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 28.0,
              height: 28.0,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                color: AppColors.nbOrange,
                border: Border.all(color: AppColors.nbBlack, width: 1.2),
              ),
              child: const Text(
                '[!]',
                style: TextStyle(
                  fontFamily: AppTheme.fontMono,
                  fontSize: 11.0,
                  fontWeight: FontWeight.w900,
                  color: AppColors.nbBlack,
                ),
              ),
            ),
            const SizedBox(width: 10.0),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    'Hanya pembeli terverifikasi yang dapat menulis ulasan e-book ini.',
                    style: TextStyle(
                      fontFamily: AppTheme.fontHeadline,
                      fontSize: 12.0,
                      fontWeight: FontWeight.w800,
                      color: AppColors.nbBlack,
                    ),
                  ),
                  SizedBox(height: 2.0),
                  Text(
                    'Beli dan baca e-book ini untuk memberikan rating & ulasan pengalaman membaca Anda.',
                    style: TextStyle(
                      fontFamily: AppTheme.fontBody,
                      fontSize: 11.0,
                      color: AppColors.nbTextMuted,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      );
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        InkWell(
          key: const Key('reviews_toggle_form_button'),
          onTap: () => setState(() => _isFormOpen = !_isFormOpen),
          child: Container(
            height: 46.0,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: _isFormOpen ? AppColors.nbLavender : AppColors.nbYellow,
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
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  _isFormOpen ? Icons.close : Icons.edit_note,
                  size: 20.0,
                  color: AppColors.nbBlack,
                ),
                const SizedBox(width: 8.0),
                Text(
                  _isFormOpen ? 'BATALKAN ULASAN' : '+ TULIS ULASAN E-BOOK',
                  style: const TextStyle(
                    fontFamily: AppTheme.fontHeadline,
                    fontSize: 12.5,
                    fontWeight: FontWeight.w800,
                    color: AppColors.nbBlack,
                    letterSpacing: 0.5,
                  ),
                ),
              ],
            ),
          ),
        ),
        if (_isFormOpen) ...[
          const SizedBox(height: 12.0),
          Container(
            padding: const EdgeInsets.all(16.0),
            decoration: BoxDecoration(
              color: AppColors.nbWhite,
              border: Border.all(
                color: AppColors.nbBlack,
                width: AppTheme.borderDefault,
              ),
              boxShadow: const [
                BoxShadow(
                  color: AppColors.nbBlack,
                  offset: Offset(3.5, 3.5),
                  blurRadius: 0.0,
                ),
              ],
            ),
            child: Form(
              key: _formKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Pilih Nilai Rating:',
                    style: TextStyle(
                      fontFamily: AppTheme.fontHeadline,
                      fontSize: 12.0,
                      fontWeight: FontWeight.w800,
                      color: AppColors.nbBlack,
                    ),
                  ),
                  const SizedBox(height: 8.0),
                  Row(
                    children: [
                      for (int star = 1; star <= 5; star++) ...[
                        InkWell(
                          key: Key('rating_select_star_$star'),
                          onTap: () => setState(() => _selectedRating = star),
                          child: Container(
                            width: 36.0,
                            height: 36.0,
                            margin: const EdgeInsets.only(right: 6.0),
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              color: star <= _selectedRating
                                  ? AppColors.nbYellow
                                  : AppColors.nbWhite,
                              border: Border.all(
                                color: AppColors.nbBlack,
                                width: star == _selectedRating ? 2.0 : 1.5,
                              ),
                              boxShadow: star == _selectedRating
                                  ? const [
                                      BoxShadow(
                                        color: AppColors.nbBlack,
                                        offset: Offset(2.0, 2.0),
                                        blurRadius: 0.0,
                                      ),
                                    ]
                                  : null,
                            ),
                            child: Text(
                              '★ $star',
                              style: const TextStyle(
                                fontFamily: AppTheme.fontMono,
                                fontSize: 10.0,
                                fontWeight: FontWeight.w800,
                                color: AppColors.nbBlack,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 8.0),
                  // Rating descriptor badge
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8.0,
                      vertical: 4.0,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.nbPaper,
                      border: Border.all(color: AppColors.nbBlack, width: 1.0),
                    ),
                    child: Text(
                      _getRatingDescription(_selectedRating),
                      style: const TextStyle(
                        fontFamily: AppTheme.fontBody,
                        fontSize: 11.0,
                        fontWeight: FontWeight.w700,
                        color: AppColors.nbBlack,
                      ),
                    ),
                  ),

                  const SizedBox(height: 14.0),
                  const Text(
                    'Judul Ulasan:',
                    style: TextStyle(
                      fontFamily: AppTheme.fontHeadline,
                      fontSize: 12.0,
                      fontWeight: FontWeight.w800,
                      color: AppColors.nbBlack,
                    ),
                  ),
                  const SizedBox(height: 4.0),
                  TextFormField(
                    key: const Key('review_title_input'),
                    controller: _titleController,
                    decoration: InputDecoration(
                      hintText: 'Misal: Sangat aplikatif dan mudah dipahami',
                      hintStyle: const TextStyle(
                        fontFamily: AppTheme.fontBody,
                        fontSize: 12.0,
                        color: AppColors.nbTextMuted,
                      ),
                      filled: true,
                      fillColor: AppColors.nbPaper,
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 12.0,
                        vertical: 10.0,
                      ),
                      enabledBorder: const OutlineInputBorder(
                        borderRadius: BorderRadius.zero,
                        borderSide: BorderSide(
                          color: AppColors.nbBlack,
                          width: 1.5,
                        ),
                      ),
                      focusedBorder: const OutlineInputBorder(
                        borderRadius: BorderRadius.zero,
                        borderSide: BorderSide(
                          color: AppColors.nbBlack,
                          width: 2.0,
                        ),
                      ),
                    ),
                    validator: (val) {
                      if (val == null || val.trim().isEmpty) {
                        return 'Judul ulasan wajib diisi.';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 12.0),
                  const Text(
                    'Isi Komentar Pengalaman Membaca:',
                    style: TextStyle(
                      fontFamily: AppTheme.fontHeadline,
                      fontSize: 12.0,
                      fontWeight: FontWeight.w800,
                      color: AppColors.nbBlack,
                    ),
                  ),
                  const SizedBox(height: 4.0),
                  TextFormField(
                    key: const Key('review_comment_input'),
                    controller: _commentController,
                    maxLines: 3,
                    decoration: InputDecoration(
                      hintText: 'Tuliskan ulasan jujur mengenai isi e-book...',
                      hintStyle: const TextStyle(
                        fontFamily: AppTheme.fontBody,
                        fontSize: 12.0,
                        color: AppColors.nbTextMuted,
                      ),
                      filled: true,
                      fillColor: AppColors.nbPaper,
                      contentPadding: const EdgeInsets.all(12.0),
                      enabledBorder: const OutlineInputBorder(
                        borderRadius: BorderRadius.zero,
                        borderSide: BorderSide(
                          color: AppColors.nbBlack,
                          width: 1.5,
                        ),
                      ),
                      focusedBorder: const OutlineInputBorder(
                        borderRadius: BorderRadius.zero,
                        borderSide: BorderSide(
                          color: AppColors.nbBlack,
                          width: 2.0,
                        ),
                      ),
                    ),
                    validator: (val) {
                      if (val == null || val.trim().isEmpty) {
                        return 'Komentar ulasan wajib diisi.';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 14.0),
                  InkWell(
                    key: const Key('review_submit_button'),
                    onTap: _submitReview,
                    child: Container(
                      height: 44.0,
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
                            offset: Offset(2.5, 2.5),
                            blurRadius: 0.0,
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: const [
                          Icon(
                            Icons.send_rounded,
                            size: 16.0,
                            color: AppColors.nbBlack,
                          ),
                          SizedBox(width: 6.0),
                          Text(
                            'KIRIM ULASAN',
                            style: TextStyle(
                              fontFamily: AppTheme.fontHeadline,
                              fontSize: 12.5,
                              fontWeight: FontWeight.w800,
                              color: AppColors.nbBlack,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ],
    );
  }

  String _getRatingDescription(int rating) {
    switch (rating) {
      case 5:
        return '★ 5 Sempurna — E-book sangat luar biasa dan sangat direkomendasikan!';
      case 4:
        return '★ 4 Bagus Sekali — Materi berbobot dan sangat bermanfaat.';
      case 3:
        return '★ 3 Cukup Baik — Konten sesuai ekspektasi standar.';
      case 2:
        return '★ 2 Kurang Memuaskan — Ada bagian yang perlu ditingkatkan.';
      case 1:
        return '★ 1 Tidak Direkomendasikan — Materi tidak sesuai kebutuhan.';
      default:
        return 'Pilih bintang penilaian Anda';
    }
  }

  /// Baris Chip Filter Ulasan (menggunakan Wrap agar responsif & tidak terpotong)
  Widget _buildFilterChipsRow() {
    final fiveCount = _reviews.where((r) => r.rating == 5).length;
    final fourCount = _reviews.where((r) => r.rating == 4).length;

    return Wrap(
      spacing: 8.0,
      runSpacing: 8.0,
      children: [
        _buildFilterChip(
          label: 'Semua (${_reviews.length})',
          filter: ReviewFilter.all,
        ),
        _buildFilterChip(
          label: '5 Bintang ($fiveCount)',
          filter: ReviewFilter.five,
        ),
        _buildFilterChip(
          label: '4 Bintang ($fourCount)',
          filter: ReviewFilter.four,
        ),
        _buildFilterChip(
          label: 'Terverifikasi (${_reviews.length})',
          filter: ReviewFilter.verified,
        ),
      ],
    );
  }

  Widget _buildFilterChip({
    required String label,
    required ReviewFilter filter,
  }) {
    final isSelected = _activeFilter == filter;

    return InkWell(
      key: Key('review_filter_chip_${filter.name}'),
      onTap: () => setState(() => _activeFilter = filter),
      child: Container(
        height: 36.0,
        padding: const EdgeInsets.symmetric(horizontal: 12.0),
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: isSelected ? AppColors.nbYellow : AppColors.nbWhite,
          border: Border.all(
            color: AppColors.nbBlack,
            width: isSelected ? AppTheme.borderDefault : 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: AppColors.nbBlack,
              offset: isSelected
                  ? const Offset(2.5, 2.5)
                  : const Offset(1.5, 1.5),
              blurRadius: 0.0,
            ),
          ],
        ),
        child: Text(
          label,
          style: TextStyle(
            fontFamily: AppTheme.fontHeadline,
            fontSize: 11.0,
            fontWeight: isSelected ? FontWeight.w800 : FontWeight.w700,
            color: AppColors.nbBlack,
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyFilterState() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24.0),
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
            width: 44.0,
            height: 44.0,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: AppColors.nbPaper,
              border: Border.all(color: AppColors.nbBlack, width: 1.5),
            ),
            child: const Icon(
              Icons.search_off_rounded,
              size: 24.0,
              color: AppColors.nbBlack,
            ),
          ),
          const SizedBox(height: 10.0),
          const Text(
            'Belum ada ulasan untuk filter ini.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontFamily: AppTheme.fontHeadline,
              fontSize: 13.0,
              fontWeight: FontWeight.w800,
              color: AppColors.nbBlack,
            ),
          ),
          const SizedBox(height: 4.0),
          const Text(
            'Coba pilih opsi filter lainnya untuk melihat ulasan pembaca lain.',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontFamily: AppTheme.fontBody,
              fontSize: 11.5,
              color: AppColors.nbTextMuted,
            ),
          ),
        ],
      ),
    );
  }

  /// Kartu Ulasan Pembaca (Neubrutalism Zona B dengan Strip Aksen)
  Widget _buildReviewCard(BookReview review, int index) {
    final accent = _getReviewerAccent(index);
    final isVoted = _helpfulVotedIds.contains(review.id);
    final currentHelpful = review.helpfulCount + (isVoted ? 1 : 0);

    final initial = review.reviewerName.isNotEmpty
        ? review.reviewerName.trim().substring(0, 1).toUpperCase()
        : 'U';

    return Container(
      key: Key('book_review_card_${review.id}'),
      decoration: BoxDecoration(
        color: AppColors.nbWhite,
        border: Border.all(
          color: AppColors.nbBlack,
          width: AppTheme.borderDefault,
        ),
        boxShadow: const [
          BoxShadow(
            color: AppColors.nbBlack,
            offset: Offset(3.5, 3.5),
            blurRadius: 0.0,
          ),
        ],
      ),
      child: Stack(
        children: [
          // Strip Aksen Warna Kiri
          Positioned(
            left: 0,
            top: 0,
            bottom: 0,
            child: Container(width: 4.5, color: accent),
          ),

          Padding(
            padding: const EdgeInsets.fromLTRB(16.0, 14.0, 14.0, 14.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header Pengulas + Badge Terverifikasi
                Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    // Avatar Kotak Neubrutalism
                    Container(
                      width: 38.0,
                      height: 38.0,
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: accent,
                        border: Border.all(
                          color: AppColors.nbBlack,
                          width: 1.5,
                        ),
                        boxShadow: const [
                          BoxShadow(
                            color: AppColors.nbBlack,
                            offset: Offset(1.5, 1.5),
                            blurRadius: 0.0,
                          ),
                        ],
                      ),
                      child: Text(
                        initial,
                        style: const TextStyle(
                          fontFamily: AppTheme.fontDisplay,
                          fontSize: 16.0,
                          fontWeight: FontWeight.w900,
                          color: AppColors.nbBlack,
                        ),
                      ),
                    ),
                    const SizedBox(width: 10.0),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            review.reviewerName,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontFamily: AppTheme.fontHeadline,
                              fontSize: 13.5,
                              fontWeight: FontWeight.w800,
                              color: AppColors.nbBlack,
                            ),
                          ),
                          if (review.reviewerRole != null)
                            Text(
                              review.reviewerRole!,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontFamily: AppTheme.fontBody,
                                fontSize: 11.0,
                                fontWeight: FontWeight.w500,
                                color: AppColors.nbTextMuted,
                              ),
                            ),
                        ],
                      ),
                    ),
                    if (review.isVerifiedPurchase)
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 7.0,
                          vertical: 3.5,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.nbGreen,
                          border: Border.all(
                            color: AppColors.nbBlack,
                            width: 1.2,
                          ),
                          boxShadow: const [
                            BoxShadow(
                              color: AppColors.nbBlack,
                              offset: Offset(1.0, 1.0),
                              blurRadius: 0.0,
                            ),
                          ],
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: const [
                            Icon(
                              Icons.verified,
                              size: 11.0,
                              color: AppColors.nbBlack,
                            ),
                            SizedBox(width: 3.0),
                            Text(
                              'TERVERIFIKASI',
                              style: TextStyle(
                                fontFamily: AppTheme.fontMono,
                                fontSize: 9.0,
                                fontWeight: FontWeight.w900,
                                color: AppColors.nbBlack,
                                letterSpacing: 0.5,
                              ),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),

                const SizedBox(height: 10.0),

                // Rating Bintang Persegi & Tanggal
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8.0,
                        vertical: 3.0,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.nbPaper,
                        border: Border.all(
                          color: AppColors.nbBlack,
                          width: 1.2,
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          RatingStars(
                            rating: review.rating.toDouble(),
                            starSize: 12.0,
                            spacing: 1.5,
                            showScoreText: false,
                          ),
                          const SizedBox(width: 6.0),
                          Text(
                            '${review.rating}/5',
                            style: const TextStyle(
                              fontFamily: AppTheme.fontMono,
                              fontSize: 10.5,
                              fontWeight: FontWeight.w800,
                              color: AppColors.nbBlack,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Row(
                      children: [
                        const Icon(
                          Icons.calendar_today_outlined,
                          size: 11.0,
                          color: AppColors.nbTextMuted,
                        ),
                        const SizedBox(width: 4.0),
                        Text(
                          _formatDate(review.createdAt),
                          style: const TextStyle(
                            fontFamily: AppTheme.fontMono,
                            fontSize: 10.0,
                            fontWeight: FontWeight.w700,
                            color: AppColors.nbTextMuted,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),

                const SizedBox(height: 10.0),

                // Judul Ulasan
                Text(
                  review.title,
                  style: const TextStyle(
                    fontFamily: AppTheme.fontHeadline,
                    fontSize: 13.5,
                    fontWeight: FontWeight.w800,
                    color: AppColors.nbBlack,
                    height: 1.3,
                  ),
                ),

                const SizedBox(height: 6.0),

                // Isi Komentar
                Text(
                  review.comment,
                  style: const TextStyle(
                    fontFamily: AppTheme.fontBody,
                    fontSize: 12.0,
                    color: AppColors.nbBlack,
                    height: 1.45,
                  ),
                ),

                const SizedBox(height: 12.0),

                // Footer Kartu: Tombol Bermanfaat
                InkWell(
                  key: Key('review_helpful_button_${review.id}'),
                  onTap: () => _toggleHelpful(review.id),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10.0,
                      vertical: 5.0,
                    ),
                    decoration: BoxDecoration(
                      color: isVoted ? AppColors.nbYellow : AppColors.nbPaper,
                      border: Border.all(color: AppColors.nbBlack, width: 1.5),
                      boxShadow: [
                        BoxShadow(
                          color: AppColors.nbBlack,
                          offset: isVoted
                              ? const Offset(1.0, 1.0)
                              : const Offset(1.5, 1.5),
                          blurRadius: 0.0,
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Text(
                          '▲',
                          style: TextStyle(
                            fontSize: 10.0,
                            fontWeight: FontWeight.w900,
                            color: AppColors.nbBlack,
                          ),
                        ),
                        const SizedBox(width: 5.0),
                        Text(
                          'Bermanfaat ($currentHelpful)',
                          style: TextStyle(
                            fontFamily: AppTheme.fontMono,
                            fontSize: 10.0,
                            fontWeight: isVoted
                                ? FontWeight.w800
                                : FontWeight.w700,
                            color: AppColors.nbBlack,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
