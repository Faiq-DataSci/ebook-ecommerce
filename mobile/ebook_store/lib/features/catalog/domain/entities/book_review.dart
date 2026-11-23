/// Entitas ulasan dan penilaian pembaca e-book (design.md §5.9 & §8.5, FR-C12).
class BookReview {
  final String id;
  final String ebookId;
  final String reviewerName;
  final String? reviewerRole;
  final int rating; // 1 s.d 5
  final String title;
  final String comment;
  final DateTime createdAt;
  final bool isVerifiedPurchase;
  final int helpfulCount;
  final bool isSimulation;

  const BookReview({
    required this.id,
    required this.ebookId,
    required this.reviewerName,
    this.reviewerRole,
    required this.rating,
    required this.title,
    required this.comment,
    required this.createdAt,
    this.isVerifiedPurchase = true,
    this.helpfulCount = 0,
    this.isSimulation = true,
  });

  BookReview copyWith({int? helpfulCount}) {
    return BookReview(
      id: id,
      ebookId: ebookId,
      reviewerName: reviewerName,
      reviewerRole: reviewerRole,
      rating: rating,
      title: title,
      comment: comment,
      createdAt: createdAt,
      isVerifiedPurchase: isVerifiedPurchase,
      helpfulCount: helpfulCount ?? this.helpfulCount,
      isSimulation: isSimulation,
    );
  }

  /// Generator ulasan realistis berlabel DATA SIMULASI sesuai aturan AGENTS.md
  static List<BookReview> getSimulatedReviewsForBook({
    required String ebookId,
    required String ebookTitle,
    required String author,
    String? categoryName,
  }) {
    final cat = categoryName ?? 'E-Book';
    return [
      BookReview(
        id: '$ebookId-rev-1',
        ebookId: ebookId,
        reviewerName: 'Rizky Pratama',
        reviewerRole: 'Mahasiswa Sistem Informasi',
        rating: 5,
        title: 'Referensi $cat yang sangat terstruktur dan aplikatif',
        comment:
            'Penjelasan dalam "$ebookTitle" karya $author disusun secara sistematis dari konsep dasar hingga studi kasus nyata. Format berkas PDF-nya tajam, diagram arsitekturnya mudah diikuti, dan sangat membantu pengerjaan proyek akhir.',
        createdAt: DateTime(2026, 11, 10, 9, 15),
        isVerifiedPurchase: true,
        helpfulCount: 24,
        isSimulation: true,
      ),
      BookReview(
        id: '$ebookId-rev-2',
        ebookId: ebookId,
        reviewerName: 'Nadira Kusuma, S.Kom.',
        reviewerRole: 'Software Engineer',
        rating: 5,
        title: 'Materi teknis mendalam dan langsung relevan dengan industri',
        comment:
            'Sangat puas dengan kualitas pembahasannya. Contoh implementasi pada topik $cat tidak sekadar teori permukaan, melainkan disertai alasan pengambilan keputusan arsitektural yang jelas. Hak akses baca di Pustaka juga langsung aktif setelah pembayaran terverifikasi.',
        createdAt: DateTime(2026, 11, 5, 14, 40),
        isVerifiedPurchase: true,
        helpfulCount: 18,
        isSimulation: true,
      ),
      BookReview(
        id: '$ebookId-rev-3',
        ebookId: ebookId,
        reviewerName: 'Arif Budiman',
        reviewerRole: 'Analis Sistem & Data',
        rating: 4,
        title: 'Pembahasan padat, layak masuk jajaran rekomendasi SAW teratas',
        comment:
            'Isi buku sangat berbobot dengan tata letak halaman PDF yang nyaman dibaca di layar. Penjelasan alur logisnya runtut dan menjadi rujukan terbaik di kelas harganya.',
        createdAt: DateTime(2026, 10, 29, 11, 20),
        isVerifiedPurchase: true,
        helpfulCount: 11,
        isSimulation: true,
      ),
      BookReview(
        id: '$ebookId-rev-4',
        ebookId: ebookId,
        reviewerName: 'Siti Rahmawati',
        reviewerRole: 'Dosen & Peneliti TI',
        rating: 5,
        title: 'Bahasa Indonesia teknis yang lugas dan mudah dipahami',
        comment:
            'Jarang menemukan literatur berbahasa Indonesia di bidang $cat yang menjaga ketepatan istilah teknis tanpa terasa kaku. Sangat direkomendasikan sebagai bahan bacaan mandiri maupun referensi akademik.',
        createdAt: DateTime(2026, 10, 21, 16, 5),
        isVerifiedPurchase: true,
        helpfulCount: 15,
        isSimulation: true,
      ),
    ];
  }
}
