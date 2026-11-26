import { useEffect, useState } from 'react';
import { AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { bookService } from '../../../services/book.service';
import type { Category } from '../../../types/book.types';
import { recommendationService } from '../services/recommendation.service';
import type {
  SawRecommendationFilter,
  SawRecommendationItem,
  SawRecommendationResponse,
} from '../types/recommendation.types';
import { RecommendationFilterBar } from '../components/RecommendationFilterBar';
import { RecommendationHeader } from '../components/RecommendationHeader';
import { RecommendationRankCard } from '../components/RecommendationRankCard';
import { SawCalculationDetailModal } from '../components/SawCalculationDetailModal';

export function RecommendationsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState<SawRecommendationFilter>({
    limit: 5,
  });

  const [response, setResponse] = useState<SawRecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [selectedItem, setSelectedItem] = useState<SawRecommendationItem | null>(null);

  // Load initial categories
  useEffect(() => {
    let isMounted = true;
    bookService.getCategories().then((cats) => {
      if (isMounted) setCategories(cats);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch SAW recommendations
  const fetchRecommendations = async (currentFilter: SawRecommendationFilter) => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await recommendationService.getSawRecommendations(currentFilter);
      setResponse(res);
    } catch (err: unknown) {
      setIsError(true);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Terjadi kesalahan saat memuat rekomendasi SAW',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isCancelled = false;
    recommendationService
      .getSawRecommendations(filter)
      .then((res) => {
        if (!isCancelled) {
          setResponse(res);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setIsError(true);
          setErrorMessage(
            err instanceof Error
              ? err.message
              : 'Terjadi kesalahan saat memuat rekomendasi SAW',
          );
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="nb-container nb-section" style={{ minHeight: '80vh' }}>
      {/* 1. Page Header (Zona B, Lavender Accent) */}
      <RecommendationHeader
        isSimulation={response?.isSimulation ?? true}
        calculatedAt={response?.calculatedAt || '-'}
        totalAlternatives={response?.totalAlternatives || 0}
      />

      {/* 2. Filter Bar */}
      <RecommendationFilterBar
        categories={categories}
        filter={filter}
        onFilterChange={(next) => setFilter(next)}
        onApplyCalculation={() => fetchRecommendations(filter)}
        isLoading={isLoading}
      />

      {/* 3. Loading State (Skeleton) */}
      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="nb-card"
              style={{
                height: '140px',
                backgroundColor: 'var(--nb-muted)',
                border: '3px solid var(--nb-black)',
                boxShadow: '4px 4px 0 var(--nb-black)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--nb-font-mono)',
                fontSize: '0.875rem',
                fontWeight: 700,
              }}
            >
              <span>Menghitung peringkat SAW e-book #{idx}...</span>
            </div>
          ))}
        </div>
      )}

      {/* 4. Error State */}
      {!isLoading && isError && (
        <div
          className="nb-card"
          style={{
            padding: '24px',
            backgroundColor: 'var(--nb-paper)',
            border: '3px solid var(--nb-black)',
            boxShadow: '4px 4px 0 var(--nb-black)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <AlertCircle size={36} color="var(--nb-pink)" />
          <h2
            style={{
              fontFamily: 'var(--nb-font-heading)',
              fontSize: '1.25rem',
              fontWeight: 800,
              margin: 0,
            }}
          >
            Gagal Menjalankan Rekomendasi
          </h2>
          <p
            style={{
              fontFamily: 'var(--nb-font-body)',
              fontSize: '0.875rem',
              color: 'var(--nb-text-muted)',
              margin: 0,
            }}
          >
            {errorMessage || 'Tidak dapat terhubung ke engine kalkulasi SAW backend.'}
          </p>
          <button
            type="button"
            onClick={() => fetchRecommendations(filter)}
            style={{
              marginTop: '8px',
              height: '40px',
              padding: '0 20px',
              backgroundColor: 'var(--nb-yellow)',
              border: '2px solid var(--nb-black)',
              boxShadow: '2px 2px 0 var(--nb-black)',
              fontFamily: 'var(--nb-font-heading)',
              fontSize: '0.875rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <RefreshCw size={16} aria-hidden="true" />
            <span>Coba Lagi</span>
          </button>
        </div>
      )}

      {/* 5. Empty State */}
      {!isLoading && !isError && response && response.items.length === 0 && (
        <div
          className="nb-card"
          style={{
            padding: '32px 24px',
            backgroundColor: 'var(--nb-paper)',
            border: '3px solid var(--nb-black)',
            boxShadow: '4px 4px 0 var(--nb-black)',
            textAlign: 'center',
          }}
        >
          <Sparkles size={36} style={{ margin: '0 auto 12px' }} />
          <h2
            style={{
              fontFamily: 'var(--nb-font-heading)',
              fontSize: '1.25rem',
              fontWeight: 800,
              margin: '0 0 8px 0',
            }}
          >
            Tidak Ada E-Book yang Memenuhi Kriteria
          </h2>
          <p
            style={{
              fontFamily: 'var(--nb-font-body)',
              fontSize: '0.875rem',
              color: 'var(--nb-text-muted)',
              margin: 0,
            }}
          >
            Coba ubah filter kategori atau periksa apakah e-book pada kategori ini memiliki data lengkap pada kriteria harga, rating, dan penjualan.
          </p>
        </div>
      )}

      {/* 6. Results List (Ranked Cards) */}
      {!isLoading && !isError && response && response.items.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {response.items.map((item) => (
            <RecommendationRankCard
              key={item.ebookId}
              item={item}
              onOpenDetails={(selected) => setSelectedItem(selected)}
            />
          ))}
        </div>
      )}

      {/* 7. Calculation Transparency Detail Modal */}
      <SawCalculationDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
