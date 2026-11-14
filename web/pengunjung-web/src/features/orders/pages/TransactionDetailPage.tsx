import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { Order, OrderStatus } from '../../../types/order.types';
import type { PaymentStatus as PaymentStatusType } from '../../../types/payment.types';
import { ROUTES } from '../../../constants/routes';
import { orderService } from '../../../services/order.service';
import { paymentService } from '../../../services/payment.service';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import { EmptyState } from '../../../components/shared/EmptyState';
import { SimulationBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { PaymentStatus } from '../components/PaymentStatus';
import { TransactionSummary } from '../components/TransactionSummary';

export function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [previewPaymentStatus, setPreviewPaymentStatus] =
    useState<PaymentStatusType | null>(null);
  const [pageStatus, setPageStatus] = useState<
    'loading' | 'ready' | 'not_found' | 'error'
  >('loading');

  useEffect(() => {
    let active = true;

    async function loadOrderDetail() {
      if (!id) {
        if (active) setPageStatus('not_found');
        return;
      }

      try {
        const found = await orderService.getOrderById(id);
        if (!active) return;
        if (!found) {
          setPageStatus('not_found');
          return;
        }
        setOrder(found);
        setPreviewPaymentStatus(null);
        setPageStatus('ready');
      } catch {
        if (active) setPageStatus('error');
      }
    }

    loadOrderDetail();
    return () => {
      active = false;
    };
  }, [id]);

  if (pageStatus === 'loading') {
    return (
      <div className="nb-container nb-section">
        <Spinner label="Memuat rincian transaksi pesanan..." />
      </div>
    );
  }

  if (pageStatus === 'error') {
    return (
      <div className="nb-container nb-section">
        <EmptyState
          tone="pink"
          title="Gagal Memuat Rincian Transaksi"
          description="Terjadi kendala saat mengambil informasi pesanan."
          actionLabel="Kembali ke Riwayat Pembelian"
          onAction={() => navigate(ROUTES.ORDERS)}
        />
      </div>
    );
  }

  if (pageStatus === 'not_found' || !order) {
    return (
      <div className="nb-container nb-section">
        <Breadcrumb
          items={[
            { label: 'Beranda', to: ROUTES.HOME },
            { label: 'Riwayat Pembelian', to: ROUTES.ORDERS },
            { label: 'Pesanan Tidak Ditemukan' },
          ]}
        />
        <EmptyState
          title="Pesanan Tidak Ditemukan"
          description="ID pesanan yang Anda pilih tidak terdaftar pada riwayat akun pelanggan Anda."
          actionLabel="Buka Riwayat Pembelian"
          onAction={() => navigate(ROUTES.ORDERS)}
        />
      </div>
    );
  }

  const effectivePaymentStatus: PaymentStatusType =
    previewPaymentStatus ?? order.paymentStatus;

  const effectiveOrderStatus: OrderStatus =
    effectivePaymentStatus === 'paid'
      ? 'completed'
      : effectivePaymentStatus === 'pending'
        ? 'pending'
        : 'cancelled';

  const paymentSummary = paymentService.buildPaymentSummary(
    order,
    effectivePaymentStatus,
  );

  return (
    <div className="nb-section" style={{ backgroundColor: 'var(--nb-paper)' }}>
      <div className="nb-container">
        <Breadcrumb
          items={[
            { label: 'Beranda', to: ROUTES.HOME },
            { label: 'Riwayat Pembelian', to: ROUTES.ORDERS },
            { label: order.orderNumber },
          ]}
        />

        <Card
          tone="white"
          zone="C"
          padding="md"
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
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <SimulationBadge />
              </div>
              <h1 className="nb-h2">
                Rincian Transaksi & Pratinjau 4 State Pembayaran
              </h1>
              <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
                Gunakan pemilih di samping untuk meninjau keempat kondisi visual
                status pembayaran (`Menunggu`, `Berhasil/Lunas`, `Gagal`, dan
                `Kedaluwarsa`) pada layar ini tanpa mengubah mekanisme payment
                gateway backend.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <Button
                variant={
                  effectivePaymentStatus === 'pending' ? 'primary' : 'secondary'
                }
                onClick={() => setPreviewPaymentStatus('pending')}
              >
                1. Menunggu (Pending)
              </Button>
              <Button
                variant={
                  effectivePaymentStatus === 'paid' ? 'primary' : 'secondary'
                }
                onClick={() => setPreviewPaymentStatus('paid')}
              >
                2. Berhasil (Paid)
              </Button>
              <Button
                variant={
                  effectivePaymentStatus === 'failed' ? 'primary' : 'secondary'
                }
                onClick={() => setPreviewPaymentStatus('failed')}
              >
                3. Gagal (Failed)
              </Button>
              <Button
                variant={
                  effectivePaymentStatus === 'expired' ? 'primary' : 'secondary'
                }
                onClick={() => setPreviewPaymentStatus('expired')}
              >
                4. Kedaluwarsa (Expired)
              </Button>
            </div>
          </div>
        </Card>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--nb-space-6)',
            alignItems: 'start',
          }}
        >
          <div style={{ gridColumn: 'span 2', minWidth: 0 }}>
            <TransactionSummary
              order={order}
              paymentSummary={paymentSummary}
              effectivePaymentStatus={effectivePaymentStatus}
              effectiveOrderStatus={effectiveOrderStatus}
            />
          </div>

          <div style={{ width: '100%' }}>
            <PaymentStatus
              status={effectivePaymentStatus}
              verificationStatusText={paymentSummary.verificationStatusText}
              instructions={paymentSummary.instructions}
            />

            <div style={{ marginTop: 'var(--nb-space-4)' }}>
              <Link
                to={ROUTES.ORDERS}
                className="nb-pressable"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  minHeight: '48px',
                  paddingInline: 'var(--nb-space-4)',
                  backgroundColor: 'var(--nb-white)',
                  fontFamily: 'var(--nb-font-heading)',
                  fontWeight: 700,
                }}
              >
                <ArrowLeft size={18} strokeWidth={2.25} aria-hidden="true" />
                <span>Kembali ke Riwayat Pembelian</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
