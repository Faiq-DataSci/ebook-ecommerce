import { SearchBar } from '../../../components/shared/SearchBar';
import { Pagination } from '../../../components/shared/Pagination';
import { EmptyState } from '../../../components/shared/EmptyState';
import { Badge, SimulationBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';
import { CatalogFilters } from '../components/CatalogFilters';
import { SortSelector } from '../components/SortSelector';
import { BookGrid } from '../components/BookGrid';
import { useCatalog } from '../hooks/useCatalog';

export function CatalogPage() {
  const {
    books,
    totalCount,
    filteredCount,
    categories,
    authors,
    filters,
    currentPage,
    totalPages,
    viewState,
    setViewState,
    updateFilter,
    updateSort,
    resetFilters,
  } = useCatalog();

  return (
    <div className="nb-section" style={{ backgroundColor: 'var(--nb-paper)' }}>
      <div className="nb-container">
        <div
          style={{
            backgroundColor: 'var(--nb-white)',
            border: 'var(--nb-border-thick)',
            boxShadow: 'var(--nb-shadow-lg)',
            padding: 'var(--nb-space-6)',
            marginBottom: 'var(--nb-space-8)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--nb-space-4)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--nb-space-3)',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <SimulationBadge />
              <Badge tone="blue">
                Placeholder Total Katalog: {totalCount} Judul Contoh
              </Badge>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <Button
                variant={viewState === 'ready' ? 'primary' : 'secondary'}
                onClick={() => setViewState('ready')}
              >
                State Normal
              </Button>
              <Button
                variant={viewState === 'loading' ? 'primary' : 'secondary'}
                onClick={() => setViewState('loading')}
              >
                Uji Loading
              </Button>
              <Button
                variant={viewState === 'error' ? 'destructive' : 'secondary'}
                onClick={() => setViewState('error')}
              >
                Uji Error
              </Button>
            </div>
          </div>

          <div>
            <h1 className="nb-h1" style={{ marginBottom: '6px' }}>
              Katalog E-Book Digital
            </h1>
            <p className="nb-body" style={{ color: 'var(--nb-text-muted)' }}>
              Telusuri daftar buku elektronik berdasarkan kategori, penulis, atau
              rentang harga. Kontrol pencarian, filter, dan pengurutan ini
              berjalan pada data simulasi lokal sebagai rancangan antarmuka
              (belum terhubung ke endpoint pencarian backend).
            </p>
          </div>

          <SearchBar
            value={filters.search}
            onChange={(value) => updateFilter('search', value)}
            placeholder="Cari judul e-book atau nama penulis..."
          />
        </div>

        {viewState === 'loading' && (
          <Spinner label="Memuat daftar katalog e-book..." />
        )}

        {viewState === 'error' && (
          <EmptyState
            tone="pink"
            title="Gagal Memuat Katalog E-Book"
            description="Koneksi ke layanan katalog gagal pada mode simulasi uji error ini. Tekan tombol di bawah untuk memulihkan tampilan katalog."
            actionLabel="Coba Muat Ulang Katalog"
            onAction={() => setViewState('ready')}
          />
        )}

        {viewState === 'ready' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 'var(--nb-space-6)',
              alignItems: 'start',
            }}
          >
            <div style={{ maxWidth: '360px', width: '100%' }}>
              <CatalogFilters
                categories={categories}
                authors={authors}
                filters={filters}
                onChangeFilter={updateFilter}
                onReset={resetFilters}
              />
            </div>

            <div style={{ gridColumn: 'span 2', minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--nb-space-3)',
                  padding: 'var(--nb-space-4)',
                  backgroundColor: 'var(--nb-white)',
                  border: 'var(--nb-border)',
                  boxShadow: 'var(--nb-shadow-sm)',
                  marginBottom: 'var(--nb-space-6)',
                }}
              >
                <p className="nb-mono" style={{ fontSize: '0.875rem' }}>
                  Menampilkan {books.length} dari {filteredCount} e-book yang
                  sesuai
                </p>
                <SortSelector
                  value={filters.sortBy}
                  onChange={updateSort}
                />
              </div>

              <BookGrid books={books} onResetFilters={resetFilters} />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredCount}
                onPageChange={(page) => updateFilter('page', page)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
