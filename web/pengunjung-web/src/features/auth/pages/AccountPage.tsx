import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import { BookMarked, LogOut, ReceiptText } from 'lucide-react';
import type { Order, PurchasedBookAccess } from '../../../types/order.types';
import { ROUTES } from '../../../constants/routes';
import { orderService } from '../../../services/order.service';
import { useAuth } from '../hooks/useAuth';
import { EmptyState } from '../../../components/shared/EmptyState';
import { Badge, SimulationBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { AccountProfileCard } from '../components/AccountProfileCard';
import { AccountMetricsCard } from '../components/AccountMetricsCard';
import { AccountRecentOrdersCard } from '../components/AccountRecentOrdersCard';

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

export function AccountPage() {
  const { customer, logout, apiHealth } = useAuth();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

  const [orders, setOrders] = useState<Order[]>([]);
  const [libraryItems, setLibraryItems] = useState<PurchasedBookAccess[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [resetFeedback, setResetFeedback] = useState(false);

  const loadAccountSummary = async () => {
    setStatus('loading');
    try {
      const [customerOrders, authorizedLibrary] = await Promise.all([
        orderService.getCustomerOrders(),
        orderService.getAuthorizedLibrary(),
      ]);
      setOrders(customerOrders);
      setLibraryItems(authorizedLibrary);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    let active = true;

    Promise.all([
      orderService.getCustomerOrders(),
      orderService.getAuthorizedLibrary(),
    ])
      .then(([customerOrders, authorizedLibrary]) => {
        if (!active) return;
        setOrders(customerOrders);
        setLibraryItems(authorizedLibrary);
        setStatus('ready');
      })
      .catch(() => {
        if (active) setStatus('error');
      });

    return () => {
      active = false;
    };
  }, []);

  const handleResetSimulationData = async () => {
    orderService.resetSimulatedOrders();
    await loadAccountSummary();
    setResetFeedback(true);
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  if (status === 'loading') {
    return (
      <div className="nb-container nb-section">
        <Spinner label="Memuat informasi akun dan ringkasan aktivitas pelanggan..." />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="nb-container nb-section">
        <EmptyState
          tone="pink"
          title="Gagal Memuat Informasi Akun"
          description="Terjadi kendala saat mengambil ringkasan profil dan transaksi pelanggan."
          actionLabel="Muat Ulang Halaman Akun"
          onAction={loadAccountSummary}
        />
      </div>
    );
  }

  const paidOrders = orders.filter((order) => order.paymentStatus === 'paid');
  const pendingOrders = orders.filter((order) => order.paymentStatus === 'pending');
  const totalSpentVerified = paidOrders.reduce((acc, item) => acc + item.totalAmount, 0);
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="nb-section" style={{ backgroundColor: 'var(--nb-paper)' }}>
      <div className="nb-container nb-stack-6">
        {/* Header Akun Pelanggan */}
        <motion.div
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
          variants={riseVariants}
        >
          <Card tone="yellow" zone="B" padding="lg">
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--nb-space-4)',
              }}
            >
              <div className="nb-stack-2">
                <div className="nb-cluster">
                  <SimulationBadge />
                  <Badge tone="white">Peran: {customer?.role ?? 'CUSTOMER'}</Badge>
                </div>
                <h1 className="nb-h1">Akun Pelanggan Saya</h1>
                <p className="nb-body">
                  Kelola informasi profil pelanggan, pantau ringkasan hak akses
                  pustaka digital, dan periksa transaksi e-book Anda.
                </p>
              </div>

              <div className="nb-cluster">
                <Button
                  variant="secondary"
                  leftIcon={
                    <BookMarked size={18} strokeWidth={2.25} aria-hidden="true" />
                  }
                  onClick={() => navigate(ROUTES.LIBRARY)}
                >
                  Buka Pustaka Saya
                </Button>
                <Button
                  variant="blue"
                  leftIcon={
                    <ReceiptText
                      size={18}
                      strokeWidth={2.25}
                      aria-hidden="true"
                    />
                  }
                  onClick={() => navigate(ROUTES.ORDERS)}
                >
                  Riwayat Pembelian
                </Button>
                <Button
                  variant="destructive"
                  leftIcon={
                    <LogOut size={18} strokeWidth={2.25} aria-hidden="true" />
                  }
                  onClick={handleLogout}
                >
                  Keluar Akun
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Grid Profil & Ringkasan Metrik */}
        <motion.div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--nb-space-6)',
          }}
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
          variants={containerVariants}
        >
          {/* Kartu Identitas Pelanggan */}
          <motion.div variants={cardItemVariants}>
            <AccountProfileCard customer={customer} apiHealth={apiHealth} />
          </motion.div>

          {/* Kartu Ringkasan Hak Akses & Transaksi */}
          <motion.div variants={cardItemVariants}>
            <AccountMetricsCard
              libraryCount={libraryItems.length}
              totalOrdersCount={orders.length}
              pendingOrdersCount={pendingOrders.length}
              totalSpentVerified={totalSpentVerified}
              onResetSimulationData={handleResetSimulationData}
              resetFeedback={resetFeedback}
            />
          </motion.div>
        </motion.div>

        {/* Seksi Pesanan Terbaru Pelanggan */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        >
          <AccountRecentOrdersCard orders={orders} recentOrders={recentOrders} />
        </motion.div>
      </div>
    </div>
  );
}
