import type { Book, BookReview } from '../../../types/book.types';

export type ReviewFilter = 'all' | '5' | '4' | 'verified';
export type ReviewSort = 'helpful' | 'newest' | 'highest';

export const STORAGE_KEY_PREFIX = 'nb_ebook_simulated_reviews_v1_';

export const ACCENT_BG_MAP: Record<BookReview['accentColor'], string> = {
  yellow: 'var(--nb-yellow)',
  blue: 'var(--nb-blue)',
  green: 'var(--nb-green)',
  lavender: 'var(--nb-lavender)',
  orange: 'var(--nb-orange)',
};

export function buildDefaultReviewsForBook(book: Book): BookReview[] {
  if (book.reviews && book.reviews.length > 0) {
    return book.reviews;
  }

  return [
    {
      id: `${book.id}-rev-1`,
      bookId: book.id,
      reviewerName: 'Rizky Pratama',
      reviewerRole: 'Mahasiswa Sistem Informasi',
      rating: 5,
      title: `Referensi ${book.categoryName} yang sangat terstruktur dan aplikatif`,
      comment: `Penjelasan dalam "${book.title}" karya ${book.author} disusun secara sistematis dari konsep dasar hingga studi kasus nyata. Format berkas PDF-nya tajam, diagram arsitekturnya mudah diikuti, dan sangat membantu pengerjaan proyek akhir.`,
      createdAt: '2026-11-10T09:15:00.000Z',
      isVerifiedPurchase: true,
      helpfulCount: 24,
      accentColor: 'yellow',
      isSimulation: true,
    },
    {
      id: `${book.id}-rev-2`,
      bookId: book.id,
      reviewerName: 'Nadira Kusuma, S.Kom.',
      reviewerRole: 'Software Engineer',
      rating: 5,
      title: 'Materi teknis mendalam dan langsung relevan dengan praktik industri',
      comment: `Sangat puas dengan kualitas pembahasannya. Contoh implementasi pada kategori ${book.categoryName} tidak sekadar teori permukaan, melainkan disertai alasan pengambilan keputusan teknis yang jelas. Hak akses baca di Pustaka Saya juga langsung aktif setelah pembayaran terverifikasi.`,
      createdAt: '2026-11-05T14:40:00.000Z',
      isVerifiedPurchase: true,
      helpfulCount: 18,
      accentColor: 'blue',
      isSimulation: true,
    },
    {
      id: `${book.id}-rev-3`,
      bookId: book.id,
      reviewerName: 'Arif Budiman',
      reviewerRole: 'Analis Sistem & Data',
      rating: 4,
      title: 'Pembahasan padat, layak masuk jajaran rekomendasi SAW teratas',
      comment: `Isi buku sangat berbobot dengan tata letak halaman PDF yang nyaman dibaca di layar. Akan lebih sempurna bila pada edisi mendatang ditambahkan lampiran latihan tambahan, namun secara keseluruhan sudah menjadi rujukan terbaik di kelas harganya.`,
      createdAt: '2026-10-29T11:20:00.000Z',
      isVerifiedPurchase: true,
      helpfulCount: 11,
      accentColor: 'lavender',
      isSimulation: true,
    },
    {
      id: `${book.id}-rev-4`,
      bookId: book.id,
      reviewerName: 'Siti Rahmawati',
      reviewerRole: 'Dosen & Peneliti TI',
      rating: 5,
      title: 'Bahasa Indonesia teknis yang lugas dan mudah dipahami',
      comment: `Jarang menemukan literatur berbahasa Indonesia di bidang ${book.categoryName} yang menjaga ketepatan istilah teknis tanpa terasa kaku. Sangat direkomendasikan sebagai bahan bacaan mandiri maupun referensi perkuliahan.`,
      createdAt: '2026-10-21T16:05:00.000Z',
      isVerifiedPurchase: true,
      helpfulCount: 15,
      accentColor: 'green',
      isSimulation: true,
    },
  ];
}

export function loadStoredReviews(bookId: string): BookReview[] {
  try {
    const raw = window.localStorage.getItem(`${STORAGE_KEY_PREFIX}${bookId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as BookReview[]) : [];
  } catch {
    return [];
  }
}
