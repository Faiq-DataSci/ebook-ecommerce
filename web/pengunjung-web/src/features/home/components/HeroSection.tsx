import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookMarked,
  CheckCircle2,
  Compass,
  FileText,
  Lock,
  LogIn,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { ROUTES } from '../../../constants/routes';
import { useAuth } from '../../auth/hooks/useAuth';
import { Badge, SimulationBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { AnimatedSpiralCanvas } from '../../../components/background/AnimatedSpiralCanvas';

// Motion terorkestrasi hero zona A (design.md bagian 13: maks 500ms, presisi mekanis)
const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const badgeClusterVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

const headlineContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const headlineLineVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

const descriptionVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

const actionsVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

const trustBarVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

export function HeroSection() {
  const { customer, isAuthenticated, loginWithDemoAccount } = useAuth();
  const [isDemoLoggingIn, setIsDemoLoggingIn] = useState(false);
  const reduceMotion = useReducedMotion();

  const handleDemoLogin = async () => {
    setIsDemoLoggingIn(true);
    try {
      await loginWithDemoAccount();
    } finally {
      setIsDemoLoggingIn(false);
    }
  };

  return (
    <section className="nb-hero-editorial-section" aria-label="Hero Beranda E-Book Store">
      {/* Pola Latar Geometris Neubrutalist Grid 32px (design.md bagian 4) */}
      <div className="nb-hero-grid-pattern" aria-hidden="true" />

      {/* Animated Spiral Canvas Background (Pola Spiral & Vortex Generatif Neubrutalist) */}
      <AnimatedSpiralCanvas />

      <motion.div
        className="nb-hero-editorial-container"
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        variants={heroContainerVariants}
      >
        {/* 1. Header Badges: Status Platform & Autentikasi (design.md bagian 2.1 & 5.4) */}
        <motion.div className="nb-hero-badge-cluster" variants={badgeClusterVariants}>
          <SimulationBadge />
          <Badge tone="yellow">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} strokeWidth={2.5} aria-hidden="true" />
              Storefront E-Book Digital Resmi
            </span>
          </Badge>
          {isAuthenticated ? (
            <Badge tone="green">
              <span>Sesi Aktif: {customer?.fullName ?? 'Pelanggan'}</span>
            </Badge>
          ) : (
            <Badge tone="blue">
              <span>Akses Katalog Publik Bebas</span>
            </Badge>
          )}
        </motion.div>

        {/* 2. Headline Display Neubrutalist (Syne 800, Blok Aksen Miring nb-yellow di Zona A) */}
        <motion.h1
          className="nb-hero-editorial-title"
          variants={headlineContainerVariants}
        >
          <motion.span className="nb-hero-title-line" variants={headlineLineVariants}>
            Temukan Inspirasi,
          </motion.span>
          <motion.span className="nb-hero-title-line" variants={headlineLineVariants}>
            Jelajahi Pengetahuan Tanpa Batas
          </motion.span>
        </motion.h1>

        {/* 3. Deskripsi Singkat: Max Width Terukur & Tipografi Inter Nyaman Dibaca */}
        <motion.p className="nb-hero-editorial-description" variants={descriptionVariants}>
          Koleksi literatur digital teknik komputasi, rekayasa perangkat lunak, dan arsitektur sistem
          informasi resmi. Akses membaca berkas PDF instan di peramban web setelah verifikasi pembayaran
          aman.
        </motion.p>

        {/* 4. Aksi Utama Terpusat (CTA) Mengikuti Pola Tekan Neubrutalism */}
        <motion.div className="nb-hero-editorial-actions" variants={actionsVariants}>
          <Link
            to={ROUTES.CATALOG}
            className="nb-pressable nb-hero-btn-primary"
          >
            <Compass size={18} strokeWidth={2.5} aria-hidden="true" />
            <span>Jelajahi Katalog Lengkap</span>
          </Link>

          {isAuthenticated ? (
            <Link
              to={ROUTES.LIBRARY}
              className="nb-pressable nb-hero-btn-secondary"
            >
              <BookMarked size={17} strokeWidth={2.5} aria-hidden="true" />
              <span>Buka Pustaka Saya</span>
            </Link>
          ) : (
            <div className="nb-hero-guest-actions">
              <Link
                to={ROUTES.LOGIN}
                className="nb-pressable nb-hero-btn-secondary"
              >
                <LogIn size={17} strokeWidth={2.5} aria-hidden="true" />
                <span>Masuk Akun</span>
              </Link>
              <Button
                type="button"
                variant="blue"
                isLoading={isDemoLoggingIn}
                onClick={handleDemoLogin}
                leftIcon={<Sparkles size={15} strokeWidth={2.5} />}
              >
                Demo 1-Klik
              </Button>
            </div>
          )}
        </motion.div>

        {/* 5. Bar Nilai & Jaminan Layanan (Space Mono, border-thin 2px) */}
        <motion.div className="nb-hero-trust-bar" variants={trustBarVariants}>
          <div className="nb-hero-trust-item">
            <FileText size={15} strokeWidth={2.5} aria-hidden="true" />
            <span>Format PDF Digital Lengkap</span>
          </div>
          <span className="nb-hero-trust-divider" aria-hidden="true">•</span>
          <div className="nb-hero-trust-item">
            <Lock size={15} strokeWidth={2.5} aria-hidden="true" />
            <span>Akses Pustaka Seumur Hidup</span>
          </div>
          <span className="nb-hero-trust-divider" aria-hidden="true">•</span>
          <div className="nb-hero-trust-item">
            <CheckCircle2 size={15} strokeWidth={2.5} aria-hidden="true" />
            <span>Single-Store B2C Terpercaya</span>
          </div>
          <span className="nb-hero-trust-divider" aria-hidden="true">•</span>
          <div className="nb-hero-trust-item">
            <ShieldCheck size={15} strokeWidth={2.5} aria-hidden="true" />
            <span>Bebas Biaya Langganan</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
