import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw } from 'lucide-react';
import { motion, useReducedMotion, type Variants } from 'motion/react';
import type { Order } from '../../../types/order.types';
import type { PaymentStatus } from '../../../types/payment.types';
import { ROUTES } from '../../../constants/routes';
import { orderService } from '../../../services/order.service';
import { EmptyState } from '../../../components/shared/EmptyState';
import { SimulationBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { OrderTable } from '../components/OrderTable';

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

export function PurchaseHistoryPage() {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | PaymentStatus>('all');
  const [viewState, setViewState] = useState<
    'ready' | 'loading' | 'empty' | 'error'
  >('ready');

  useEffect(() => {
    let active = true;
    orderService
      .getCustomerOrders()
      .then((result) => {
        if (active) {
          setOrders(result);
        }
      })
      .catch(() => {
        if (active) {
          setViewState('error');
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredOrders = useMemo(() => {
    if (viewState === 'empty') return [];
    if (statusFilter === 'all') return orders;
    return orders.filter((order) => order.paymentStatus === statusFilter);
  }, [orders, statusFilter, viewState]);

  const handleResetDemoOrders = () => {
    const defaults = orderService.resetSimulatedOrders();
    setOrders(defaults);
    setStatusFilter('all');
    setViewState('ready');
  };

  return (
    <div className="nb-section" style={{ backgroundColor: 'var(--nb-paper)' }}>
      <div className="nb-container">
        <motion.div
          initial={reduceMotion ? false : 'hidden'}
          animate="visible"
          variants={riseVariants}
        >
          <Card
            tone="white"
            zone="C"
            padding="lg"
            style={{ marginBottom: 'var(--nb-space-6)' }}
          >
            <div
              style={{
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
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ marginBottom: '8px' }}>
                    <SimulationBadge />
                  </div>
                  <h1 className="nb-h1">Riwayat Pembelian Pelanggan</h1>
                  <p className="nb-body" style={{ color: 'var(--nb-text-muted)' }}>
                    Tinjau pesanan e-book Anda beserta empat contoh status
                    pembayaran (`Lunas`, `Menunggu Pembayaran`, `Gagal`, dan
                    `Kedaluwarsa`). Status menunggu pembayaran tidak pernah
                    dianggap telah terverifikasi.
                  </p>
                </div>

                <Button
                  variant="secondary"
                  onClick={handleResetDemoOrders}
                  leftIcon={
                    <RotateCcw size={16} strokeWidth={2.25} aria-hidden="true" />
                  }
                >
                  Kembalikan 4 Pesanan Contoh
                </Button>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--nb-space-3)',
                  borderTop: 'var(--nb-border-thin)',
                  paddingTop: 'var(--nb-space-4)',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <Button
                    variant={statusFilter === 'all' ? 'primary' : 'secondary'}
                    onClick={() => {
                      setStatusFilter('all');
                      setViewState('ready');
                    }}
                  >
                    Semua Status ({orders.length})
                  </Button>
                  <Button
                    variant={statusFilter === 'paid' ? 'primary' : 'secondary'}
                    onClick={() => {
                      setStatusFilter('paid');
                      setViewState('ready');
                    }}
                  >
                    Lunas / Paid
                  </Button>
                  <Button
                    variant={statusFilter === 'pending' ? 'primary' : 'secondary'}
                    onClick={() => {
                      setStatusFilter('pending');
                      setViewState('ready');
                    }}
                  >
                    Menunggu / Pending
                  </Button>
                  <Button
                    variant={statusFilter === 'failed' ? 'primary' : 'secondary'}
                    onClick={() => {
                      setStatusFilter('failed');
                      setViewState('ready');
                    }}
                  >
                    Gagal / Failed
                  </Button>
                  <Button
                    variant={statusFilter === 'expired' ? 'primary' : 'secondary'}
                    onClick={() => {
                      setStatusFilter('expired');
                      setViewState('ready');
                    }}
                  >
                    Kedaluwarsa / Expired
                  </Button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <Button
                    variant={viewState === 'empty' ? 'primary' : 'secondary'}
                    onClick={() =>
                      setViewState((prev) =>
                        prev === 'empty' ? 'ready' : 'empty',
                      )
                    }
                  >
                    Uji Riwayat Kosong
                  </Button>
                  <Button
                    variant={viewState === 'loading' ? 'primary' : 'secondary'}
                    onClick={() =>
                      setViewState((prev) =>
                        prev === 'loading' ? 'ready' : 'loading',
                      )
                    }
                  >
                    Uji Loading
                  </Button>
                  <Button
                    variant={viewState === 'error' ? 'destructive' : 'secondary'}
                    onClick={() =>
                      setViewState((prev) =>
                        prev === 'error' ? 'ready' : 'error',
                      )
                    }
                  >
                    Uji Error
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {viewState === 'loading' && (
          <Spinner label="Memuat daftar riwayat pembelian pelanggan..." />
        )}

        {viewState === 'error' && (
          <EmptyState
            tone="pink"
            title="Gagal Memuat Riwayat Pembelian"
            description="Tidak dapat mengambil daftar transaksi pada mode simulasi error ini."
            actionLabel="Pulihkan Daftar Transaksi"
            onAction={() => setViewState('ready')}
          />
        )}

        {(viewState === 'ready' || viewState === 'empty') && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {filteredOrders.length === 0 ? (
              <EmptyState
                title="Belum Ada Riwayat Pesanan pada Filter Ini"
                description="Tidak ada catatan pesanan yang cocok dengan filter status saat ini, atau Anda sedang menguji tampilan riwayat kosong."
                actionLabel="Jelajahi Katalog E-Book"
                onAction={() => navigate(ROUTES.CATALOG)}
              />
            ) : (
              <OrderTable orders={filteredOrders} />
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
