import { useMemo, useState, type FormEvent } from 'react';
import { MessageSquarePlus, CheckCircle2 } from 'lucide-react';
import type { Book, BookReview } from '../../../types/book.types';
import { useAuth } from '../../auth/hooks/useAuth';
import { Badge, SimulationBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import {
  type ReviewFilter,
  type ReviewSort,
  STORAGE_KEY_PREFIX,
  buildDefaultReviewsForBook,
  loadStoredReviews,
} from '../utils/book-review.utils';
import { ReviewSummaryCard } from './ReviewSummaryCard';
import { ReviewForm } from './ReviewForm';
import { ReviewItemCard } from './ReviewItemCard';

interface BookReviewsSectionProps {
  book: Book;
  isVerifiedOwner: boolean;
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

      {/* Panel Ringkasan Rating & Distribusi Bintang */}
      <ReviewSummaryCard
        book={book}
        effectiveRating={effectiveRating}
        effectiveReviewCount={effectiveReviewCount}
        starDistribution={starDistribution}
      />

      {/* Panel Formulir Tulis Ulasan (Bila Dibuka) */}
      {showForm && (
        <ReviewForm
          book={book}
          customer={customer}
          isAuthenticated={isAuthenticated}
          isVerifiedOwner={isVerifiedOwner}
          newRating={newRating}
          onRatingChange={(star) => setNewRating(star)}
          newTitle={newTitle}
          onTitleChange={(val) => {
            setNewTitle(val);
            if (formError) setFormError(null);
          }}
          newComment={newComment}
          onCommentChange={(val) => {
            setNewComment(val);
            if (formError) setFormError(null);
          }}
          formError={formError}
          isDemoLoading={isDemoLoading}
          onSubmit={handleSubmitReview}
          onCancel={() => setShowForm(false)}
          onDemoLogin={handleDemoLoginForReview}
        />
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
        {filteredAndSortedReviews.map((review) => (
          <ReviewItemCard
            key={review.id}
            review={review}
            isVotedHelpful={Boolean(helpfulIds[review.id])}
            onToggleHelpful={handleToggleHelpful}
          />
        ))}
      </div>
    </section>
  );
}
