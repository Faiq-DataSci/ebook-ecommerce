import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';
import '../../domain/entities/book_review.dart';
import '../../domain/entities/catalog_ebook.dart';
import 'review_compose_form.dart';
import 'review_item_card.dart';
import 'review_rating_breakdown_card.dart';

enum ReviewFilter { all, five, four, verified }

/// Seksi Ulasan & Penilaian Pembaca pada Detail E-Book (design.md §5.9 & §8.5, FR-C12).
/// Mengoordinasikan ringkasan rating, form tulis ulasan, filter chips, dan daftar kartu ulasan.
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

  int? get _selectedStarFilter {
    if (_activeFilter == ReviewFilter.five) return 5;
    if (_activeFilter == ReviewFilter.four) return 4;
    return null;
  }

  void _handleDistributionStarTap(int star) {
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
            child: const Row(
              children: [
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
        _buildSectionHeader(),
        const SizedBox(height: 14.0),
        ReviewRatingBreakdownCard(
          reviews: _reviews,
          averageRating: _averageRating,
          selectedStarFilter: _selectedStarFilter,
          onStarTap: _handleDistributionStarTap,
        ),
        const SizedBox(height: 16.0),
        ReviewComposeForm(
          isVerifiedOwner: widget.isVerifiedOwner,
          isFormOpen: _isFormOpen,
          selectedRating: _selectedRating,
          formKey: _formKey,
          titleController: _titleController,
          commentController: _commentController,
          onToggleForm: () => setState(() => _isFormOpen = !_isFormOpen),
          onSelectRating: (star) => setState(() => _selectedRating = star),
          onSubmit: _submitReview,
        ),
        const SizedBox(height: 16.0),
        _buildFilterChipsRow(),
        const SizedBox(height: 14.0),
        if (filtered.isEmpty)
          _buildEmptyFilterState()
        else
          for (int i = 0; i < filtered.length; i++) ...[
            ReviewItemCard(
              review: filtered[i],
              index: i,
              isVoted: _helpfulVotedIds.contains(filtered[i].id),
              onToggleHelpful: () => _toggleHelpful(filtered[i].id),
            ),
            const SizedBox(height: 14.0),
          ],
      ],
    );
  }

  Widget _buildSectionHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
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
}
