import type { CatalogViewMode } from '../../../types/book.types';

interface CatalogSkeletonProps {
  viewMode?: CatalogViewMode;
  count?: number;
}

export function CatalogSkeleton({
  viewMode = 'grid',
  count = 6,
}: CatalogSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (viewMode === 'list') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--nb-space-4)',
        }}
        aria-busy="true"
        aria-label="Memuat katalog e-book..."
      >
        {items.map((key) => (
          <div
            key={key}
            className="nb-catalog-card-list"
            style={{ minHeight: '180px' }}
          >
            <div
              className="nb-skeleton nb-card-list-cover"
              style={{
                aspectRatio: '2 / 3',
                minHeight: '180px',
              }}
            />
            <div
              className="nb-card-list-content"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                width: '100%',
              }}
            >
              <div
                className="nb-skeleton"
                style={{ width: '120px', height: '22px' }}
              />
              <div
                className="nb-skeleton"
                style={{ width: '80%', height: '26px' }}
              />
              <div
                className="nb-skeleton"
                style={{ width: '40%', height: '18px' }}
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 'auto',
                  gap: '8px',
                }}
              >
                <div
                  className="nb-skeleton"
                  style={{ width: '110px', height: '36px' }}
                />
                <div
                  className="nb-skeleton"
                  style={{ width: '140px', height: '40px' }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: 'var(--nb-space-6)',
      }}
      aria-busy="true"
      aria-label="Memuat katalog e-book..."
    >
      {items.map((key) => (
        <div key={key} className="nb-catalog-card" style={{ minHeight: '440px' }}>
          {/* Top Tag Skeleton */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}
          >
            <div
              className="nb-skeleton"
              style={{ width: '100px', height: '22px' }}
            />
            <div
              className="nb-skeleton"
              style={{ width: '80px', height: '22px' }}
            />
          </div>

          {/* Cover Skeleton */}
          <div
            className="nb-skeleton"
            style={{
              width: '100%',
              aspectRatio: '2 / 3',
              marginBottom: '12px',
            }}
          />

          {/* Title & Author Skeletons */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginBottom: '16px',
            }}
          >
            <div
              className="nb-skeleton"
              style={{ width: '90%', height: '22px' }}
            />
            <div
              className="nb-skeleton"
              style={{ width: '60%', height: '16px' }}
            />
          </div>

          {/* Price & Action Skeleton */}
          <div
            style={{
              marginTop: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              borderTop: 'var(--nb-border-thin)',
              paddingTop: '10px',
            }}
          >
            <div
              className="nb-skeleton"
              style={{ width: '120px', height: '32px' }}
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
              }}
            >
              <div
                className="nb-skeleton"
                style={{ width: '100%', height: '40px' }}
              />
              <div
                className="nb-skeleton"
                style={{ width: '100%', height: '40px' }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
