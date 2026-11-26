import { Link } from 'react-router-dom';
import { Award, BookOpen, Calculator } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { formatCurrency } from '../../../utils/formatCurrency';
import { SawScoreBar } from './SawScoreBar';
import type { SawRecommendationItem } from '../types/recommendation.types';

interface RecommendationRankCardProps {
  item: SawRecommendationItem;
  onOpenDetails: (item: SawRecommendationItem) => void;
}

export function RecommendationRankCard({
  item,
  onOpenDetails,
}: RecommendationRankCardProps) {
  // Rank badge styling
  const isRank1 = item.rank === 1;
  const isRank2 = item.rank === 2;
  const isRank3 = item.rank === 3;

  const rankBg = isRank1
    ? 'var(--nb-yellow)'
    : isRank2
      ? '#E2E8F0'
      : isRank3
        ? '#FED7AA'
        : 'var(--nb-paper)';

  const parsedPrice = typeof item.price === 'number' ? item.price : Number(item.price) || 0;

  return (
    <article
      className="nb-card"
      style={{
        backgroundColor: 'var(--nb-white)',
        border: isRank1 ? '3.5px solid var(--nb-black)' : '3px solid var(--nb-black)',
        boxShadow: isRank1 ? '6px 6px 0 var(--nb-black)' : '4px 4px 0 var(--nb-black)',
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Banner Stripe for Winner */}
      {isRank1 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            backgroundColor: 'var(--nb-yellow)',
            borderBottom: '1.5px solid var(--nb-black)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Header Card: Rank + Score Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '4px 12px',
              backgroundColor: rankBg,
              border: '2px solid var(--nb-black)',
              boxShadow: '2px 2px 0 var(--nb-black)',
              fontFamily: 'var(--nb-font-heading)',
              fontSize: '0.875rem',
              fontWeight: 900,
              color: 'var(--nb-black)',
            }}
          >
            <Award size={16} aria-hidden="true" />
            <span>Peringkat #{item.rank}</span>
          </span>

          {item.category && (
            <span
              style={{
                padding: '2px 8px',
                backgroundColor: 'var(--nb-paper)',
                border: '1.5px solid var(--nb-black)',
                fontFamily: 'var(--nb-font-heading)',
                fontSize: '0.6875rem',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              {item.category.name}
            </span>
          )}
        </div>

        {/* Final Score (3 Decimals) */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            backgroundColor: 'var(--nb-lavender)',
            border: '2px solid var(--nb-black)',
            boxShadow: '2px 2px 0 var(--nb-black)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--nb-font-heading)',
              fontSize: '0.6875rem',
              fontWeight: 800,
              textTransform: 'uppercase',
            }}
          >
            Skor Akhir:
          </span>
          <span
            style={{
              fontFamily: 'var(--nb-font-mono)',
              fontSize: '1rem',
              fontWeight: 900,
              color: 'var(--nb-black)',
            }}
          >
            {item.displayScore}
          </span>
        </div>
      </div>

      {/* Main Info: Book Details */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        {/* Cover Thumbnail / Placeholder */}
        <div
          style={{
            width: '64px',
            height: '88px',
            backgroundColor: 'var(--nb-yellow)',
            border: '2px solid var(--nb-black)',
            boxShadow: '2px 2px 0 var(--nb-black)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            flexShrink: 0,
            textAlign: 'center',
          }}
          aria-hidden="true"
        >
          <BookOpen size={22} color="var(--nb-black)" />
          <span
            style={{
              fontFamily: 'var(--nb-font-mono)',
              fontSize: '9px',
              fontWeight: 900,
              marginTop: '4px',
            }}
          >
            E-BOOK
          </span>
        </div>

        {/* Title, Author, Price */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2
            style={{
              fontFamily: 'var(--nb-font-heading)',
              fontSize: '1.0625rem',
              fontWeight: 800,
              lineHeight: 1.3,
              margin: '0 0 4px 0',
              color: 'var(--nb-black)',
            }}
          >
            {item.title}
          </h2>

          <div
            style={{
              fontFamily: 'var(--nb-font-body)',
              fontSize: '0.8125rem',
              color: 'var(--nb-text-muted)',
              marginBottom: '6px',
            }}
          >
            Penulis: <strong>{item.author}</strong>
          </div>

          <div
            style={{
              fontFamily: 'var(--nb-font-mono)',
              fontSize: '0.9375rem',
              fontWeight: 800,
              color: 'var(--nb-black)',
            }}
          >
            {formatCurrency(parsedPrice)}
          </div>
        </div>
      </div>

      {/* Segmented ScoreBar for Criteria Contributions */}
      <SawScoreBar score={item.sawScore} steps={item.calculationSteps} />

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          borderTop: '2px solid var(--nb-black)',
          paddingTop: '12px',
          marginTop: '4px',
        }}
      >
        <button
          type="button"
          onClick={() => onOpenDetails(item)}
          style={{
            height: '36px',
            padding: '0 14px',
            backgroundColor: 'var(--nb-white)',
            border: '2px solid var(--nb-black)',
            boxShadow: '2px 2px 0 var(--nb-black)',
            fontFamily: 'var(--nb-font-heading)',
            fontSize: '0.75rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Calculator size={15} aria-hidden="true" />
          <span>Lihat Cara Skor Dihitung</span>
        </button>

        <Link
          to={ROUTES.BOOK_DETAIL(item.ebookId)}
          style={{
            height: '36px',
            padding: '0 16px',
            backgroundColor: 'var(--nb-yellow)',
            border: '2px solid var(--nb-black)',
            boxShadow: '2px 2px 0 var(--nb-black)',
            fontFamily: 'var(--nb-font-heading)',
            fontSize: '0.75rem',
            fontWeight: 800,
            textDecoration: 'none',
            color: 'var(--nb-black)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <BookOpen size={15} aria-hidden="true" />
          <span>Buka di Katalog</span>
        </Link>
      </div>
    </article>
  );
}
