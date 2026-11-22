import { useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  MessageSquarePlus,
  ShieldCheck,
  Sparkles,
  ThumbsUp,
  UserCheck,
} from 'lucide-react';
import type { Book, BookReview } from '../../../types/book.types';
import { ROUTES } from '../../../constants/routes';
import { formatDate } from '../../../utils/formatDate';
import { useAuth } from '../../auth/hooks/useAuth';
import { RatingStars } from '../../../components/shared/RatingStars';
import { Badge, SimulationBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';

interface BookReviewsSectionProps {
  book: Book;
  isVerifiedOwner: boolean;
}

type ReviewFilter = 'all' | '5' | '4' | 'verified';
type ReviewSort = 'helpful' | 'newest' | 'highest';

const STORAGE_KEY_PREFIX = 'nb_ebook_simulated_reviews_v1_';

const ACCENT_BG_MAP: Record<BookReview['accentColor'], string> = {
  yellow: 'var(--nb-yellow)',
  blue: 'var(--nb-blue)',
  green: 'var(--nb-green)',
  lavender: 'var(--nb-lavender)',
  orange: 'var(--nb-orange)',
};

function buildDefaultReviewsForBook(book: Book): BookReview[] {
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

function loadStoredReviews(bookId: string): BookReview[] {
  try {
    const raw = window.localStorage.getItem(`${STORAGE_KEY_PREFIX}${bookId}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as BookReview[]) : [];
  } catch {
    return [];
  }
}

export function BookReviewsSection({
  book,
  isVerifiedOwner,
}: BookReviewsSectionProps) {
  const { customer, isAuthenticated, loginWithDemoAccount } = useAuth();

  const [userAddedReviews, setUserAddedReviews] = useState<BookReview[]>(() =>
    loadStoredReviews(book.id),
  );
  const [helpfulIds, setHelpfulIds] = useState<Record<string, boolean>>({});
  const [activeFilter, setActiveFilter] = useState<ReviewFilter>('all');
  const [sortBy, setSortBy] = useState<ReviewSort>('helpful');

  // State form tulis ulasan baru
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const allReviews = useMemo(() => {
    const defaults = buildDefaultReviewsForBook(book);
    return [...userAddedReviews, ...defaults];
  }, [book, userAddedReviews]);

  const effectiveRating = useMemo(() => {
    const baseRating = book.rating ?? 4.85;
    if (userAddedReviews.length === 0) return baseRating;
    const baseCount = Math.max(book.reviewCount ?? allReviews.length, 4);
    const addedSum = userAddedReviews.reduce((acc, item) => acc + item.rating, 0);
    const combined =
      (baseRating * baseCount + addedSum) / (baseCount + userAddedReviews.length);
    return Math.min(5, Math.round(combined * 100) / 100);
  }, [book.rating, book.reviewCount, userAddedReviews, allReviews.length]);

  const effectiveReviewCount = (book.reviewCount ?? 4) + userAddedReviews.length;

  // Distribusi 5 bintang s/d 1 bintang yang konsisten dengan rating buku
  const starDistribution = useMemo(() => {
    const fiveRatio = effectiveRating >= 4.85 ? 86 : 78;
    const fourRatio = effectiveRating >= 4.85 ? 11 : 17;
    const threeRatio = 100 - fiveRatio - fourRatio;
    return [
      { star: 5, percent: fiveRatio, count: Math.round((effectiveReviewCount * fiveRatio) / 100) },
      { star: 4, percent: fourRatio, count: Math.round((effectiveReviewCount * fourRatio) / 100) },
      { star: 3, percent: threeRatio, count: Math.max(1, effectiveReviewCount - Math.round((effectiveReviewCount * fiveRatio) / 100) - Math.round((effectiveReviewCount * fourRatio) / 100)) },
      { star: 2, percent: 0, count: 0 },
      { star: 1, percent: 0, count: 0 },
    ];
  }, [effectiveRating, effectiveReviewCount]);

  const filteredAndSortedReviews = useMemo(() => {
    const filtered = allReviews.filter((rev) => {
      if (activeFilter === '5') return rev.rating === 5;
      if (activeFilter === '4') return rev.rating === 4;
      if (activeFilter === 'verified') return rev.isVerifiedPurchase;
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'highest') {
        return b.rating - a.rating;
      }
      const aHelpful = a.helpfulCount + (helpfulIds[a.id] ? 1 : 0);
      const bHelpful = b.helpfulCount + (helpfulIds[b.id] ? 1 : 0);
      return bHelpful - aHelpful;
    });
  }, [allReviews, activeFilter, sortBy, helpfulIds]);

  const handleToggleHelpful = (reviewId: string) => {
    setHelpfulIds((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const handleSubmitReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (newTitle.trim().length < 5) {
      setFormError('Judul ringkas ulasan minimal terdiri dari 5 karakter.');
      return;
    }
    if (newComment.trim().length < 15) {
      setFormError('Isi ulasan produk minimal terdiri dari 15 karakter agar informatif.');
      return;
    }

    const createdReview: BookReview = {
      id: `${book.id}-usr-${Date.now()}`,
      bookId: book.id,
      reviewerName: customer?.fullName ?? 'Pelanggan Simulasi',
      reviewerRole: isVerifiedOwner ? 'Pemilik E-Book Terverifikasi' : 'Pelanggan Terdaftar',
      rating: newRating,
      title: newTitle.trim(),
      comment: newComment.trim(),
      createdAt: new Date().toISOString(),
      isVerifiedPurchase: isVerifiedOwner,
      helpfulCount: 1,
      accentColor: isVerifiedOwner ? 'green' : 'yellow',
      isSimulation: true,
    };

    const nextStored = [createdReview, ...userAddedReviews];
    setUserAddedReviews(nextStored);
    try {
      window.localStorage.setItem(
        `${STORAGE_KEY_PREFIX}${book.id}`,
        JSON.stringify(nextStored),
      );
    } catch {
      // Abaikan bila storage penuh
    }

    setNewTitle('');
    setNewComment('');
    setNewRating(5);
    setShowForm(false);
    setSubmitSuccess(true);
  };

  const handleDemoLoginForReview = async () => {
    setIsDemoLoading(true);
    try {
      await loginWithDemoAccount();
      setShowForm(true);
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <section
      id="ulasan-produk"
      aria-label="Ulasan Produk dan Penilaian Pelanggan"
      style={{
        marginTop: 'var(--nb-space-10)',
        paddingTop: 'var(--nb-space-8)',
        borderTop: 'var(--nb-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--nb-space-6)',
      }}
    >
      {/* Header Seksi Ulasan Produk */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 'var(--nb-space-4)',
        }}
      >
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
            <SimulationBadge />
            <Badge tone="yellow">Ulasan Produk E-Book</Badge>
            <Badge tone="lavender">Kriteria C1 (Rating) SPK SAW</Badge>
          </div>
          <h2 className="nb-h2">Ulasan &amp; Penilaian Pembaca</h2>
          <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)', marginTop: '4px' }}>
            Penilaian pembaca menjadi salah satu komponen kriteria kualitas (Benefit) pada
            perhitungan rekomendasi Metode Simple Additive Weighting (SAW) di backend.
          </p>
        </div>

        <Button
          type="button"
          variant={showForm ? 'secondary' : 'primary'}
          leftIcon={<MessageSquarePlus size={18} strokeWidth={2.25} aria-hidden="true" />}
          onClick={() => {
            setSubmitSuccess(false);
            setShowForm((prev) => !prev);
          }}
        >
          {showForm ? 'Tutup Formulir Ulasan' : 'Tulis Ulasan Produk'}
        </Button>
      </div>

      {/* Notifikasi Sukses Kirim Ulasan Simulasi */}
      {submitSuccess && (
        <div
          role="status"
          style={{
            backgroundColor: 'var(--nb-green)',
            border: 'var(--nb-border)',
            boxShadow: 'var(--nb-shadow)',
            padding: 'var(--nb-space-4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={20} strokeWidth={2.5} aria-hidden="true" />
            <p className="nb-label">
              Ulasan disimpan (DATA SIMULASI). Terima kasih atas penilaian Anda untuk e-book ini.
            </p>
          </div>
          <SimulationBadge />
        </div>
      )}

      {/* Panel Ringkasan Rating & Distribusi Bintang (Zona B design.md) */}
      <Card tone="white" zone="B" padding="lg">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'var(--nb-space-6)',
            alignItems: 'center',
          }}
        >
          {/* Kiri: Skor Utama & RatingStars Persegi */}
          <div
            style={{
              backgroundColor: 'var(--nb-paper)',
              border: 'var(--nb-border)',
              boxShadow: 'var(--nb-shadow-sm)',
              padding: 'var(--nb-space-5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
              <span
                className="nb-mono"
                style={{
                  fontSize: 'clamp(2.25rem, 3.5vw, 3rem)',
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {effectiveRating.toFixed(2).replace('.', ',')}
              </span>
              <span className="nb-mono" style={{ fontSize: '1rem', color: 'var(--nb-text-muted)', fontWeight: 700 }}>
                / 5,00
              </span>
            </div>

            <RatingStars
              rating={effectiveRating}
              reviewCount={effectiveReviewCount}
              size="md"
              hideValue
            />

            <p className="nb-body-sm" style={{ fontWeight: 600 }}>
              Berdasarkan{' '}
              <span className="nb-mono" style={{ fontWeight: 700 }}>
                {effectiveReviewCount}
              </span>{' '}
              ulasan pembaca terdata
            </p>

            {book.sawScore && (
              <div
                style={{
                  backgroundColor: 'var(--nb-lavender)',
                  border: '2px solid var(--nb-black)',
                  padding: '8px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                <span className="nb-label" style={{ fontSize: '0.75rem' }}>
                  Skor Akhir SAW ({book.sawScore.code}):
                </span>
                <span className="nb-mono" style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                  {book.sawScore.value.toFixed(3).replace('.', ',')}
                </span>
              </div>
            )}
          </div>

          {/* Kanan: Batang Distribusi 5 Bintang s/d 1 Bintang */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
              <span className="nb-label">Distribusi Tingkat Kepuasan Pembaca</span>
              <span className="nb-mono" style={{ fontSize: '0.75rem', color: 'var(--nb-text-muted)' }}>
                100% Transparan
              </span>
            </div>

            {starDistribution.map((row) => (
              <div
                key={row.star}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '54px 1fr 78px',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <span className="nb-mono" style={{ fontWeight: 700, fontSize: '0.8125rem' }}>
                  {row.star} ★
                </span>

                <div
                  aria-hidden="true"
                  style={{
                    height: '16px',
                    backgroundColor: 'var(--nb-paper)',
                    border: '2px solid var(--nb-black)',
                    borderRadius: 0,
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      width: `${row.percent}%`,
                      height: '100%',
                      backgroundColor:
                        row.star === 5
                          ? 'var(--nb-yellow)'
                          : row.star === 4
                            ? 'var(--nb-green)'
                            : 'var(--nb-blue)',
                      borderRight: row.percent > 0 && row.percent < 100 ? '2px solid var(--nb-black)' : 'none',
                    }}
                  />
                </div>

                <span
                  className="nb-mono"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textAlign: 'right',
                    color: 'var(--nb-text-muted)',
                  }}
                >
                  {row.percent}% ({row.count})
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Panel Formulir Tulis Ulasan (Bila Dibuka) */}
      {showForm && (
        <Card tone="paper" zone="B" padding="lg">
          {!isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <SimulationBadge />
                <Badge tone="orange">Perlu Sesi Pelanggan</Badge>
              </div>
              <h3 className="nb-h3">Masuk Akun untuk Menulis Ulasan Produk</h3>
              <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
                Untuk menjaga kredibilitas penilaian e-book pada perhitungan kriteria SAW,
                ulasan hanya dapat dikirimkan oleh pelanggan yang masuk ke akunnya.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '4px' }}>
                <Link
                  to={`${ROUTES.LOGIN}?redirect=${encodeURIComponent(ROUTES.BOOK_DETAIL(book.id))}`}
                  className="nb-pressable"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '44px',
                    paddingInline: '16px',
                    backgroundColor: 'var(--nb-yellow)',
                    fontFamily: 'var(--nb-font-heading)',
                    fontWeight: 700,
                  }}
                >
                  Masuk Akun Pelanggan
                </Link>
                <Button
                  type="button"
                  variant="blue"
                  isLoading={isDemoLoading}
                  leftIcon={<Sparkles size={16} strokeWidth={2.25} />}
                  onClick={handleDemoLoginForReview}
                >
                  Masuk Cepat Akun Contoh (1-Klik)
                </Button>
              </div>
            </div>
          ) : (
            <form
              noValidate
              onSubmit={handleSubmitReview}
              style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nb-space-4)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h3 className="nb-h3">Kirim Ulasan untuk "{book.title}"</h3>
                  <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
                    Mengirim sebagai <strong>{customer?.fullName}</strong>{' '}
                    {isVerifiedOwner ? '(Pemilik Terverifikasi Lunas)' : '(Mode Simulasi Pelanggan)'}
                  </p>
                </div>
                <SimulationBadge />
              </div>

              {formError && (
                <div
                  role="alert"
                  style={{
                    backgroundColor: 'var(--nb-pink)',
                    border: '2px solid var(--nb-black)',
                    padding: '10px 14px',
                  }}
                >
                  <p className="nb-body-sm" style={{ fontWeight: 700 }}>
                    {formError}
                  </p>
                </div>
              )}

              <div>
                <span className="nb-label" style={{ display: 'block', marginBottom: '8px' }}>
                  Pilih Rating Kepuasan (1 – 5 Kotak Bintang):
                </span>
                <RatingStars
                  size="lg"
                  interactiveValue={newRating}
                  onSelectRating={(star) => setNewRating(star)}
                />
              </div>

              <Input
                label="Judul Ringkas Ulasan"
                type="text"
                value={newTitle}
                onChange={(e) => {
                  setNewTitle(e.target.value);
                  if (formError) setFormError(null);
                }}
                placeholder="Contoh: Pembahasan arsitektur sistem sangat jelas dan terstruktur"
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="review-comment-textarea" className="nb-label">
                  Isi Ulasan Lengkap
                </label>
                <textarea
                  id="review-comment-textarea"
                  rows={4}
                  value={newComment}
                  onChange={(e) => {
                    setNewComment(e.target.value);
                    if (formError) setFormError(null);
                  }}
                  placeholder="Bagikan pengalaman Anda membaca materi, kualitas pembahasan, atau manfaat e-book ini..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: 'var(--nb-white)',
                    border: 'var(--nb-border)',
                    borderRadius: 0,
                    boxShadow: 'var(--nb-shadow-sm)',
                    fontFamily: 'var(--nb-font-body)',
                    fontSize: '0.9375rem',
                    lineHeight: 1.5,
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-end' }}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowForm(false)}
                >
                  Batal
                </Button>
                <Button type="submit" variant="primary">
                  Simpan Ulasan (DATA SIMULASI)
                </Button>
              </div>
            </form>
          )}
        </Card>
      )}

      {/* Baris Filter & Pengurutan Ulasan */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          backgroundColor: 'var(--nb-paper)',
          border: 'var(--nb-border-thin)',
          padding: '12px 16px',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          <span className="nb-label" style={{ fontSize: '0.8125rem' }}>
            Saring:
          </span>
          {(
            [
              { id: 'all', label: `Semua (${allReviews.length})` },
              { id: '5', label: '5 Bintang' },
              { id: '4', label: '4 Bintang' },
              { id: 'verified', label: 'Pembeli Terverifikasi' },
            ] as const
          ).map((chip) => {
            const isActive = activeFilter === chip.id;
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setActiveFilter(chip.id)}
                className="nb-pressable"
                aria-pressed={isActive}
                style={{
                  minHeight: '36px',
                  paddingInline: '12px',
                  backgroundColor: isActive ? 'var(--nb-yellow)' : 'var(--nb-white)',
                  color: 'var(--nb-black)',
                  fontFamily: 'var(--nb-font-heading)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {chip.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="review-sort-select" className="nb-label" style={{ fontSize: '0.8125rem' }}>
            Urutkan:
          </label>
          <select
            id="review-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as ReviewSort)}
            style={{
              minHeight: '36px',
              paddingInline: '10px',
              backgroundColor: 'var(--nb-white)',
              border: '2px solid var(--nb-black)',
              borderRadius: 0,
              boxShadow: '2px 2px 0 0 var(--nb-black)',
              fontFamily: 'var(--nb-font-heading)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <option value="helpful">Paling Membantu</option>
            <option value="newest">Terbaru</option>
            <option value="highest">Rating Tertinggi</option>
          </select>
        </div>
      </div>

      {/* Daftar Kartu Ulasan Pelanggan */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 'var(--nb-space-5)',
        }}
      >
        {filteredAndSortedReviews.map((review) => {
          const isVotedHelpful = Boolean(helpfulIds[review.id]);
          const displayHelpfulCount = review.helpfulCount + (isVotedHelpful ? 1 : 0);

          return (
            <article
              key={review.id}
              className="ebook-card"
              style={{
                backgroundColor: 'var(--nb-white)',
                padding: 'var(--nb-space-5)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 'var(--nb-space-4)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Baris Atas: Profil Pengulas & Status Verifikasi */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '10px',
                    borderBottom: 'var(--nb-border-thin)',
                    paddingBottom: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      aria-hidden="true"
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: ACCENT_BG_MAP[review.accentColor] ?? 'var(--nb-yellow)',
                        border: '2px solid var(--nb-black)',
                        boxShadow: '2px 2px 0 0 var(--nb-black)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--nb-font-display)',
                        fontWeight: 800,
                        fontSize: '1rem',
                        flexShrink: 0,
                      }}
                    >
                      {review.reviewerName.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="nb-label" style={{ fontSize: '0.9375rem' }}>
                        {review.reviewerName}
                      </p>
                      <p className="nb-body-sm" style={{ fontSize: '0.75rem', color: 'var(--nb-text-muted)' }}>
                        {review.reviewerRole}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {review.isVerifiedPurchase ? (
                      <Badge tone="green">
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <ShieldCheck size={13} strokeWidth={2.5} aria-hidden="true" />
                          Pembeli Terverifikasi
                        </span>
                      </Badge>
                    ) : (
                      <Badge tone="blue">
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <UserCheck size={13} strokeWidth={2.5} aria-hidden="true" />
                          Ulasan Pelanggan
                        </span>
                      </Badge>
                    )}
                    {review.isSimulation && <SimulationBadge />}
                  </div>
                </div>

                {/* RatingStars Persegi & Tanggal */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <RatingStars rating={review.rating} size="sm" />
                  <span className="nb-mono" style={{ fontSize: '0.75rem', color: 'var(--nb-text-muted)' }}>
                    {formatDate(review.createdAt)}
                  </span>
                </div>

                {/* Judul & Isi Ulasan */}
                <div>
                  <h3 className="nb-h4" style={{ marginBottom: '6px' }}>
                    {review.title}
                  </h3>
                  <p className="nb-body-sm" style={{ lineHeight: 1.6 }}>
                    {review.comment}
                  </p>
                </div>
              </div>

              {/* Footer Kartu Ulasan: Tombol Membantu Interaktif */}
              <div
                style={{
                  borderTop: 'var(--nb-border-thin)',
                  paddingTop: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <span className="nb-mono" style={{ fontSize: '0.75rem', color: 'var(--nb-text-muted)' }}>
                  Apakah ulasan ini membantu?
                </span>

                <button
                  type="button"
                  onClick={() => handleToggleHelpful(review.id)}
                  className="nb-pressable"
                  aria-pressed={isVotedHelpful}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    minHeight: '34px',
                    paddingInline: '12px',
                    backgroundColor: isVotedHelpful ? 'var(--nb-yellow)' : 'var(--nb-paper)',
                    fontFamily: 'var(--nb-font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  <ThumbsUp size={14} strokeWidth={2.5} aria-hidden="true" />
                  <span>Membantu ({displayHelpfulCount})</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
