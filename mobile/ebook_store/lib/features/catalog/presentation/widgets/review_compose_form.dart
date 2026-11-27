import 'package:flutter/material.dart';
import '../../../../theme/app_colors.dart';
import '../../../../theme/app_theme.dart';

/// Bagian tombol & formulir tulis ulasan khusus pembeli terverifikasi (FR-C12).
class ReviewComposeForm extends StatelessWidget {
  final bool isVerifiedOwner;
  final bool isFormOpen;
  final int selectedRating;
  final GlobalKey<FormState> formKey;
  final TextEditingController titleController;
  final TextEditingController commentController;
  final VoidCallback onToggleForm;
  final ValueChanged<int> onSelectRating;
  final VoidCallback onSubmit;

  const ReviewComposeForm({
    super.key,
    required this.isVerifiedOwner,
    required this.isFormOpen,
    required this.selectedRating,
    required this.formKey,
    required this.titleController,
    required this.commentController,
    required this.onToggleForm,
    required this.onSelectRating,
    required this.onSubmit,
  });

  static String _getRatingDescription(int rating) {
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

  InputDecoration _buildFieldDecoration({
    required String hintText,
    required EdgeInsetsGeometry contentPadding,
  }) {
    return InputDecoration(
      hintText: hintText,
      hintStyle: const TextStyle(
        fontFamily: AppTheme.fontBody,
        fontSize: 12.0,
        color: AppColors.nbTextMuted,
      ),
      filled: true,
      fillColor: AppColors.nbPaper,
      contentPadding: contentPadding,
      enabledBorder: const OutlineInputBorder(
        borderRadius: BorderRadius.zero,
        borderSide: BorderSide(color: AppColors.nbBlack, width: 1.5),
      ),
      focusedBorder: const OutlineInputBorder(
        borderRadius: BorderRadius.zero,
        borderSide: BorderSide(color: AppColors.nbBlack, width: 2.0),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (!isVerifiedOwner) {
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
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
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
          onTap: onToggleForm,
          child: Container(
            height: 46.0,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              color: isFormOpen ? AppColors.nbLavender : AppColors.nbYellow,
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
                  isFormOpen ? Icons.close : Icons.edit_note,
                  size: 20.0,
                  color: AppColors.nbBlack,
                ),
                const SizedBox(width: 8.0),
                Text(
                  isFormOpen ? 'BATALKAN ULASAN' : '+ TULIS ULASAN E-BOOK',
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
        if (isFormOpen) ...[
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
              key: formKey,
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
                      for (int star = 1; star <= 5; star++)
                        InkWell(
                          key: Key('rating_select_star_$star'),
                          onTap: () => onSelectRating(star),
                          child: Container(
                            width: 36.0,
                            height: 36.0,
                            margin: const EdgeInsets.only(right: 6.0),
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                              color: star <= selectedRating
                                  ? AppColors.nbYellow
                                  : AppColors.nbWhite,
                              border: Border.all(
                                color: AppColors.nbBlack,
                                width: star == selectedRating ? 2.0 : 1.5,
                              ),
                              boxShadow: star == selectedRating
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
                  ),
                  const SizedBox(height: 8.0),
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
                      _getRatingDescription(selectedRating),
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
                    controller: titleController,
                    decoration: _buildFieldDecoration(
                      hintText: 'Misal: Sangat aplikatif dan mudah dipahami',
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 12.0,
                        vertical: 10.0,
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
                    controller: commentController,
                    maxLines: 3,
                    decoration: _buildFieldDecoration(
                      hintText: 'Tuliskan ulasan jujur mengenai isi e-book...',
                      contentPadding: const EdgeInsets.all(12.0),
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
                    onTap: onSubmit,
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
                      child: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
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
}
