import { Link } from 'react-router-dom';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import type { Book } from '../../../types/book.types';
import { ROUTES } from '../../../constants/routes';
import { BookCard } from '../../../components/shared/BookCard';
import { SimulationBadge } from '../../../components/ui/Badge';

interface FeaturedBooksProps {
  books: Book[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 160,
      damping: 20,
    },
  },
};

export function FeaturedBooks({ books }: FeaturedBooksProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      className="nb-section"
      style={{ backgroundColor: 'var(--nb-white)', borderBottom: 'var(--nb-border-thick)' }}
    >
      <div className="nb-container">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 'var(--nb-space-4)',
            marginBottom: 'clamp(1.75rem, 3.5vw, 2.75rem)',
          }}
        >
          <div>
            <div style={{ marginBottom: '8px' }}>
              <SimulationBadge />
            </div>
            <h2 className="nb-h1">Pilihan E-Book Unggulan</h2>
            <p className="nb-body" style={{ color: 'var(--nb-text-muted)', marginTop: '4px' }}>
              Koleksi buku kurasi pilihan dengan materi praktis dan standar industri.
            </p>
          </div>

          <Link
            to={ROUTES.CATALOG}
            className="nb-pressable nb-section-header-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '44px',
              paddingInline: 'var(--nb-space-5)',
              backgroundColor: 'var(--nb-yellow)',
              border: 'var(--nb-border-thin)',
              fontFamily: 'var(--nb-font-heading)',
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none',
              color: 'var(--nb-black)',
            }}
          >
            Lihat Seluruh Katalog
          </Link>
        </motion.div>

        <motion.div
          className="nb-grid-cards nb-grid-cards-4"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={containerVariants}
        >
          {books.map((book) => (
            <motion.div key={book.id} variants={itemVariants}>
              <BookCard book={book} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

