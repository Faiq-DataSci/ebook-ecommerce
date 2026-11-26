import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReceiptText, UserCheck } from 'lucide-react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import type { Order, PurchasedBookAccess } from '../../../types/order.types';
import { ROUTES } from '../../../constants/routes';
import { orderService } from '../../../services/order.service';
import { useAuth } from '../../auth/hooks/useAuth';
import { EmptyState } from '../../../components/shared/EmptyState';
import { SimulationBadge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { PurchasedBookCard } from '../components/PurchasedBookCard';
import {
  LibraryAccessRulesCard,
  type LibraryViewMode,
} from '../components/LibraryAccessRulesCard';
import { NonVerifiedOrdersSection } from '../components/NonVerifiedOrdersSection';
import { EbookReaderModal } from '../components/EbookReaderModal';

const containerVariants: Variants = {
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

const cardItemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: 'easeOut',
    },
  },
};

export function LibraryPage() {
  const { customer } = useAuth();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const [libraryItems, setLibraryItems] = useState<PurchasedBookAccess[]>([]);
  const [nonVerifiedOrders, setNonVerifiedOrders] = useState<Order[]>([]);
  const [viewMode, setViewMode] = useState<LibraryViewMode>('normal');
  const [activeReaderItem, setActiveReaderItem] =
    useState<PurchasedBookAccess | null>(null);

  useEffect(() => {
    let active = true;

    async function loadLibrary() {
      try {
        const [authorizedBooks, allOrders] = await Promise.all([
          orderService.getAuthorizedLibrary(),
          orderService.getCustomerOrders(),
        ]);
        if (!active) return;
        setLibraryItems(authorizedBooks);
        setNonVerifiedOrders(
          allOrders.filter((order) => order.paymentStatus !== 'paid'),
        );
      } catch {
        if (active) setViewMode('error');
      }
    }

    loadLibrary();
    return () => {
      active = false;
    };
  }, []);

  const displayedBooks = viewMode === 'empty' ? [] : libraryItems;

  return (
    <div className="nb-section" style={{ backgroundColor: 'var(--nb-paper)' }}>
      <div className="nb-container">
        {/* Welcome Header */}
        <motion.div
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
          variants={riseVariants}
        >
          <Card
            tone="yellow"
            zone="B"
            padding="lg"
            style={{ marginBottom: 'var(--nb-space-6)' }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--nb-space-4)',
              }}
            >
              <div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  <SimulationBadge />
                </div>
                <h1 className="nb-h1">
                  Selamat Datang di Pustaka Digital Anda
                </h1>
                <p className="nb-body" style={{ marginTop: '4px' }}>
                  Kelola dan baca koleksi e-book yang pembayarannya telah
                  diverifikasi.
                </p>
              </div>

              {customer && (
                <div
                  style={{
                    backgroundColor: 'var(--nb-white)',
                    border: 'var(--nb-border)',
                    boxShadow: 'var(--nb-shadow-sm)',
                    padding: 'var(--nb-space-4)',
                    minWidth: '260px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '6px',
                    }}
                  >
                    <UserCheck size={18} strokeWidth={2.25} aria-hidden="true" />
                    <span className="nb-label">Ringkasan Profil Pelanggan</span>
                  </div>
                  <p className="nb-body-sm" style={{ fontWeight: 700 }}>
                    {customer.fullName}
                  </p>
                  <p className="nb-mono" style={{ fontSize: '0.8125rem' }}>
                    {customer.email}
                  </p>
                  <div style={{ marginTop: '10px' }}>
                    <Link
                      to={ROUTES.ORDERS}
                      className="nb-label"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        textDecoration: 'underline',
                      }}
                    >
                      <ReceiptText size={16} strokeWidth={2.25} aria-hidden="true" />
                      <span>Buka Riwayat Pembelian</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Access Rules & Test Switcher */}
        <motion.div
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
          variants={riseVariants}
          transition={{ delay: 0.08 }}
        >
          <LibraryAccessRulesCard
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            libraryCount={libraryItems.length}
          />
        </motion.div>

        {viewMode === 'loading' && (
          <Spinner label="Memverifikasi hak akses pustaka digital pelanggan..." />
        )}

        {viewMode === 'error' && (
          <EmptyState
            tone="pink"
            title="Gagal Memuat Pustaka Digital"
            description="Terjadi kendala saat memeriksa daftar hak akses e-book Anda pada mode uji error ini."
            actionLabel="Pulihkan Tampilan Pustaka"
            onAction={() => setViewMode('normal')}
          />
        )}

        {(viewMode === 'normal' || viewMode === 'empty') && (
          <>
            {displayedBooks.length === 0 ? (
              <EmptyState
                title="Pustaka digital Anda menunggu buku pertamanya."
                description="Anda belum memiliki e-book dengan pembayaran terverifikasi pada tampilan ini. Telusuri katalog untuk memilih buku digital pertama Anda."
                actionLabel="Jelajahi E-Book di Katalog"
                onAction={() => navigate(ROUTES.CATALOG)}
              />
            ) : (
              <motion.div
                className="nb-grid-cards"
                initial={reduceMotion ? false : 'hidden'}
                animate="visible"
                variants={containerVariants}
              >
                {displayedBooks.map((item) => (
                  <motion.div key={item.id} variants={cardItemVariants}>
                    <PurchasedBookCard
                      item={item}
                      onOpenReader={setActiveReaderItem}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Non-verified Orders Section */}
            <NonVerifiedOrdersSection orders={nonVerifiedOrders} />
          </>
        )}
      </div>

      {/* Reader Modal */}
      <EbookReaderModal
        item={activeReaderItem}
        onClose={() => setActiveReaderItem(null)}
      />
    </div>
  );
}
