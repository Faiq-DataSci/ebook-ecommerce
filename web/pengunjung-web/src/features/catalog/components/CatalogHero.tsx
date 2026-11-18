import {
  Award,
  BookOpen,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { SimulationBadge } from '../../../components/ui/Badge';

const heroVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const riseVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
    },
  },
};

export function CatalogHero() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.header
      className="nb-catalog-hero"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={heroVariants}
    >
      {/* Background Watermark Art */}
      <div className="nb-catalog-hero-watermark" aria-hidden="true">
        <BookOpen size={260} strokeWidth={0.8} />
      </div>

      <div className="nb-hero-grid">
        {/* Headline, Badges, Description & Value Props */}
        <div className="nb-hero-left">
          {/* Badges Row */}
          <motion.div className="nb-hero-badges-row" variants={riseVariants}>
            <span className="nb-hero-storefront-badge">
              <BookOpen size={14} strokeWidth={2.5} />
              STOREFRONT RESMI • BACA BUKU PRESS
            </span>
            <SimulationBadge />
            <span className="nb-hero-edition-badge">
              <Sparkles size={13} strokeWidth={2.5} />
              EDISI RESMI 2026
            </span>
          </motion.div>

          {/* Display Headline with Neubrutalism Highlight Block */}
          <motion.h1 className="nb-hero-title" variants={riseVariants}>
            KATALOG LENGKAP{' '}
            <span className="nb-hero-highlight">
              E-BOOK
            </span>
          </motion.h1>

          {/* Description with Neubrutalist Pill */}
          <motion.p className="nb-hero-description" variants={riseVariants}>
            Jelajahi koleksi buku terverifikasi dengan lisensi DRM legal kriptografis,
            penilaian objektif berbasis{' '}
            <span className="nb-hero-text-pill">
              <Sparkles size={13} strokeWidth={2.5} />
              Kurasi Cerdas Objektif
            </span>
            , dan akses berkas seketika tanpa proteksi kadaluarsa.
          </motion.p>

          {/* Value Proposition Perks */}
          <motion.div className="nb-hero-perks" variants={riseVariants}>
            <div className="nb-hero-perk-item">
              <Zap size={14} strokeWidth={2.5} />
              <span>Akses Seketika</span>
            </div>
            <div className="nb-hero-perk-item">
              <Award size={14} strokeWidth={2.5} />
              <span>Kurasi Objektif</span>
            </div>
            <div className="nb-hero-perk-item">
              <ShieldCheck size={14} strokeWidth={2.5} />
              <span>Bebas Proteksi Kadaluarsa</span>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
