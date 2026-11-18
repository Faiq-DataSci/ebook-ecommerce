import { Link } from 'react-router-dom';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { Layers, Sparkles } from 'lucide-react';
import type { Category } from '../../../types/book.types';
import { ROUTES } from '../../../constants/routes';
import { CategoryCard } from '../../../components/shared/CategoryCard';
import { Badge, SimulationBadge } from '../../../components/ui/Badge';

interface CategorySectionProps {
  categories: Category[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 180,
      damping: 22,
    },
  },
};

export function CategorySection({ categories }: CategorySectionProps) {
  const reduceMotion = useReducedMotion();
  const totalBooks = categories.reduce((sum, c) => sum + (c.bookCount || 0), 0);

  return (
    <section
      id="kategori-buku"
      className="nb-section"
      style={{ backgroundColor: 'var(--nb-paper)', borderBottom: 'var(--nb-border-thick)' }}
    >
      <div className="nb-container">
        {/* Header Seksi */}
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
            <div
              style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                alignItems: 'center',
                marginBottom: '12px',
              }}
            >
              <SimulationBadge />

              <Badge
                tone="yellow"
                icon={<Layers size={14} strokeWidth={2.5} aria-hidden="true" />}
              >
                Taksonomi Literatur
              </Badge>

              <Badge
                tone="white"
                icon={<Sparkles size={13} strokeWidth={2.25} aria-hidden="true" />}
              >
                <span className="nb-mono" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
                  {categories.length} BIDANG KEILMUAN
                </span>
              </Badge>
            </div>
            <h2 className="nb-h1">Kategori &amp; Bidang E-Book</h2>
            <p className="nb-body" style={{ color: 'var(--nb-text-muted)', marginTop: '4px' }}>
              Pilih bidang bahasan untuk menyaring daftar e-book di katalog digital resmi dengan kriteria kurasi terverifikasi.
            </p>
          </div>

          <Link
            to={ROUTES.CATALOG}
            className="nb-pressable nb-section-header-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              minHeight: '44px',
              paddingInline: 'var(--nb-space-5)',
              backgroundColor: 'var(--nb-white)',
              border: 'var(--nb-border-thin)',
              fontFamily: 'var(--nb-font-heading)',
              fontWeight: 700,
              fontSize: '0.9rem',
              textDecoration: 'none',
              color: 'var(--nb-black)',
            }}
          >
            <span>Buka Seluruh Koleksi</span>
          </Link>
        </motion.div>

        {/* Grid Kartu Kategori dengan Stagger Reveal */}
        <motion.div
          className="nb-grid-cards"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={containerVariants}
        >
          {categories.map((category, idx) => (
            <motion.div key={category.id} variants={itemVariants}>
              <CategoryCard category={category} index={idx} />
            </motion.div>
          ))}
        </motion.div>

        {/* Banner Ringkasan Neubrutalis Kurasi */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          style={{
            marginTop: 'clamp(2rem, 3.5vw, 3rem)',
            padding: '16px 20px',
            backgroundColor: 'var(--nb-white)',
            border: 'var(--nb-border)',
            boxShadow: 'var(--nb-shadow)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <Badge
              tone="yellow"
              icon={<Sparkles size={14} strokeWidth={2.25} aria-hidden="true" />}
            >
              Metrik Katalog
            </Badge>
            <span className="nb-body-sm" style={{ fontWeight: 600 }}>
              {categories.length} Bidang Keilmuan • {totalBooks.toLocaleString('id-ID')} Total Judul Terkurasi • Format Resmi PDF Digital
            </span>
          </div>

          <Link
            to={ROUTES.CATALOG}
            className="nb-label"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              color: 'var(--nb-black)',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              fontWeight: 700,
            }}
          >
            Saring Menurut Kategori di Katalog
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

