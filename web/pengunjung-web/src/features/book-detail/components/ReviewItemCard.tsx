import { ShieldCheck, ThumbsUp, UserCheck } from 'lucide-react';
import type { BookReview } from '../../../types/book.types';
import { formatDate } from '../../../utils/formatDate';
import { RatingStars } from '../../../components/shared/RatingStars';
import { Badge, SimulationBadge } from '../../../components/ui/Badge';
import { ACCENT_BG_MAP } from '../utils/book-review.utils';

interface ReviewItemCardProps {
  review: BookReview;
  isVotedHelpful: boolean;
  onToggleHelpful: (id: string) => void;
}

export function ReviewItemCard({
  review,
  isVotedHelpful,
  onToggleHelpful,
}: ReviewItemCardProps) {
  const displayHelpfulCount = review.helpfulCount + (isVotedHelpful ? 1 : 0);

  return (
    <article
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

      {/* Footer Kartu Ulasan */}
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
          onClick={() => onToggleHelpful(review.id)}
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
}
