import { motion, useReducedMotion, type Variants } from 'motion/react';
import type { Book, CatalogViewMode } from '../../../types/book.types';
import { BookCard } from '../../../components/shared/BookCard';
import { EmptyState } from '../../../components/shared/EmptyState';

interface BookGridProps {
  books: Book[];
  viewMode?: CatalogViewMode;
  onResetFilters: () => void;
  onBuyClick?: (book: Book) => void;
  onAddToCart?: (book: Book) => void;
}

const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
};

const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
    },
  },
};

export function BookGrid({
  books,
  viewMode = 'grid',
  onResetFilters,
  onBuyClick,
  onAddToCart,
}: BookGridProps) {
  const reduceMotion = useReducedMotion();

  if (books.length === 0) {
    return (
      <EmptyState
        title="Tidak Ada E-Book yang Cocok dengan Kriteria"
        description="Tidak ditemukan judul e-book atau nama penulis yang sesuai dengan kata kunci, kategori, atau rentang harga aktif saat ini. Anda dapat me-reset kriteria untuk melihat kembali seluruh koleksi."
        actionLabel="Bersihkan Semua Filter & Pencarian"
        onAction={onResetFilters}
      />
    );
  }

  if (viewMode === 'list') {
    return (
      <motion.div
        id="catalog-grid"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--nb-space-4)',
        }}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        variants={gridContainerVariants}
      >
        {books.map((book) => (
          <motion.div key={book.id} variants={cardItemVariants}>
            <BookCard
              book={book}
              viewMode="list"
              onBuyClick={onBuyClick}
              onAddToCart={onAddToCart}
            />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      id="catalog-grid"
      className="nb-catalog-grid"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={gridContainerVariants}
    >
      {books.map((book) => (
        <motion.div key={book.id} variants={cardItemVariants}>
          <BookCard
            book={book}
            viewMode="grid"
            onBuyClick={onBuyClick}
            onAddToCart={onAddToCart}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
