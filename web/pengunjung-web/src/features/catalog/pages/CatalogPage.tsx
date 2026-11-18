import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { ROUTES } from '../../../constants/routes';
import { useAuth } from '../../auth/hooks/useAuth';
import type { Book } from '../../../types/book.types';
import { useCatalog } from '../hooks/useCatalog';
import { CatalogHero } from '../components/CatalogHero';
import { CatalogFilters } from '../components/CatalogFilters';
import { CatalogControlBar } from '../components/CatalogControlBar';
import { BookGrid } from '../components/BookGrid';
import { CatalogSkeleton } from '../components/CatalogSkeleton';
import { CatalogBottomBanner } from '../components/CatalogBottomBanner';
import { CatalogToast } from '../components/CatalogToast';
import { Pagination } from '../../../components/shared/Pagination';
import { EmptyState } from '../../../components/shared/EmptyState';
import { APP_CONFIG } from '../../../constants/app.constants';

export function CatalogPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const reduceMotion = useReducedMotion();

  const {
    books,
    allBooks,
    totalCount,
    filteredCount,
    categories,
    categoryCounts,
    filters,
    currentPage,
    totalPages,
    viewMode,
    viewState,
    toasts,
    setViewMode,
    updateFilter,
    setPricePreset,
    clearSearch,
    clearCategory,
    clearPrice,
    clearRating,
    clearAuthor,
    updateSort,
    resetFilters,
    showToast,
    dismissToast,
    addToCart,
    retryFetch,
  } = useCatalog();

  const handleBuyClick = (book: Book) => {
    if (!isAuthenticated) {
      showToast(
        'Silakan masuk ke akun pelanggan untuk melanjutkan proses pembelian.',
        'yellow',
      );
      setTimeout(() => {
        navigate(
          `${ROUTES.LOGIN}?redirect=${encodeURIComponent(ROUTES.BOOK_DETAIL(book.id))}`,
        );
      }, 700);
    } else {
      navigate(ROUTES.BOOK_DETAIL(book.id));
    }
  };

  const handleApplyFeedback = () => {
    showToast(
      `Filter diperbarui: ${filteredCount} e-book ditemukan.`,
      'yellow',
    );
  };

  const handleExploreTopRecommendations = () => {
    updateSort('saw_desc');
    showToast(
      'Menampilkan koleksi e-book terbaik berdasarkan kepuasan pembaca dan kualitas materi.',
      'yellow',
    );
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--nb-paper)',
        minHeight: 'calc(100vh - 80px)',
        paddingBlock: 'var(--nb-space-6)',
      }}
    >
      <div className="nb-container">
        {/* 1. Editorial Hero Header */}
        <CatalogHero />

        {/* 2. Loading State */}
        {viewState === 'loading' && (
          <div className="nb-catalog-layout">
            <div className="nb-catalog-sidebar-col">
              <div
                className="nb-skeleton"
                style={{ height: '520px', width: '100%' }}
              />
            </div>
            <div className="nb-catalog-content-col">
              <div
                className="nb-skeleton"
                style={{ height: '70px', width: '100%', marginBottom: '16px' }}
              />
              <CatalogSkeleton viewMode={viewMode} count={6} />
            </div>
          </div>
        )}

        {/* 3. Error State */}
        {viewState === 'error' && (
          <EmptyState
            tone="pink"
            title="Gagal Memuat Katalog E-Book"
            description="Layanan katalog tidak dapat diakses atau terjadi kendala jaringan saat memuat daftar buku digital. Silakan coba muat ulang."
            actionLabel="Coba Muat Ulang Katalog"
            onAction={retryFetch}
          />
        )}

        {/* 4. Ready / Success State */}
        {viewState === 'ready' && (
          <motion.div
            className="nb-catalog-layout"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {/* Left Column: Filter Sidebar */}
            <div className="nb-catalog-sidebar-col">
              <CatalogFilters
                categories={categories}
                categoryCounts={categoryCounts}
                totalBooksCount={allBooks.length}
                filteredCount={filteredCount}
                filters={filters}
                onChangeFilter={updateFilter}
                onSetPricePreset={setPricePreset}
                onReset={resetFilters}
                onApplyFeedback={handleApplyFeedback}
              />
            </div>

            {/* Right Column: Catalog Content Area */}
            <section
              aria-label="Daftar Katalog E-Book"
              className="nb-catalog-content-col"
            >
              {/* Top Control Bar */}
              <CatalogControlBar
                filteredCount={filteredCount}
                totalCount={totalCount}
                categories={categories}
                filters={filters}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onSortChange={updateSort}
                onClearSearch={clearSearch}
                onClearCategory={clearCategory}
                onClearPrice={clearPrice}
                onClearRating={clearRating}
                onClearAuthor={clearAuthor}
                onResetAll={resetFilters}
              />

              {/* Product Grid / List */}
              <BookGrid
                books={books}
                viewMode={viewMode}
                onResetFilters={resetFilters}
                onBuyClick={handleBuyClick}
                onAddToCart={addToCart}
              />

              {/* Bottom Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredCount}
                pageSize={APP_CONFIG.CATALOG_PAGE_SIZE}
                onPageChange={(page) => updateFilter('page', page)}
              />

              {/* Reassurance Banner */}
              <CatalogBottomBanner onOpenCalculator={handleExploreTopRecommendations} />
            </section>
          </motion.div>
        )}
      </div>

      {/* 5. Interactive Toast Notifications */}
      <CatalogToast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
