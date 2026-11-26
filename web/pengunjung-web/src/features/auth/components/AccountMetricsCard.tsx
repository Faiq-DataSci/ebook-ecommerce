import { useNavigate } from 'react-router-dom';
import { Compass, RotateCcw } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { formatCurrency } from '../../../utils/formatCurrency';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface AccountMetricsCardProps {
  libraryCount: number;
  totalOrdersCount: number;
  pendingOrdersCount: number;
  totalSpentVerified: number;
  onResetSimulationData: () => void;
  resetFeedback: boolean;
}

export function AccountMetricsCard({
  libraryCount,
  totalOrdersCount,
  pendingOrdersCount,
  totalSpentVerified,
  onResetSimulationData,
  resetFeedback,
}: AccountMetricsCardProps) {
  const navigate = useNavigate();

  return (
    <Card tone="white" zone="B" padding="lg">
      <div className="nb-stack-4">
        <div>
          <h2 className="nb-h2">Ringkasan Pustaka & Transaksi</h2>
          <p
            className="nb-body-sm"
            style={{ color: 'var(--nb-text-muted)', marginTop: '2px' }}
          >
            Rekapitulasi kepemilikan buku digital dan pesanan akun Anda
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 'var(--nb-space-3)',
          }}
        >
          <div
            style={{
              backgroundColor: 'var(--nb-green)',
              border: 'var(--nb-border-thin)',
              boxShadow: 'var(--nb-shadow-sm)',
              padding: 'var(--nb-space-3)',
            }}
          >
            <span className="nb-label">E-Book Aktif</span>
            <p className="nb-h1" style={{ marginTop: '4px' }}>
              {libraryCount}
            </p>
            <span className="nb-body-sm">Siap dibaca di Pustaka</span>
          </div>

          <div
            style={{
              backgroundColor: 'var(--nb-blue)',
              border: 'var(--nb-border-thin)',
              boxShadow: 'var(--nb-shadow-sm)',
              padding: 'var(--nb-space-3)',
            }}
          >
            <span className="nb-label">Total Pesanan</span>
            <p className="nb-h1" style={{ marginTop: '4px' }}>
              {totalOrdersCount}
            </p>
            <span className="nb-body-sm">Seluruh status transaksi</span>
          </div>

          <div
            style={{
              backgroundColor: 'var(--nb-orange)',
              border: 'var(--nb-border-thin)',
              boxShadow: 'var(--nb-shadow-sm)',
              padding: 'var(--nb-space-3)',
            }}
          >
            <span className="nb-label">Menunggu Bayar</span>
            <p className="nb-h1" style={{ marginTop: '4px' }}>
              {pendingOrdersCount}
            </p>
            <span className="nb-body-sm">Akses masih terkunci</span>
          </div>

          <div
            style={{
              backgroundColor: 'var(--nb-yellow)',
              border: 'var(--nb-border-thin)',
              boxShadow: 'var(--nb-shadow-sm)',
              padding: 'var(--nb-space-3)',
            }}
          >
            <span className="nb-label">Pembelian Lunas</span>
            <p
              className="nb-mono"
              style={{ fontSize: '1.125rem', marginTop: '8px' }}
            >
              {formatCurrency(totalSpentVerified)}
            </p>
            <span className="nb-body-sm">Terverifikasi lunas</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            paddingTop: 'var(--nb-space-2)',
            borderTop: 'var(--nb-border-thin)',
          }}
        >
          <Button
            variant="secondary"
            leftIcon={
              <RotateCcw
                size={16}
                strokeWidth={2.25}
                aria-hidden="true"
              />
            }
            onClick={onResetSimulationData}
          >
            Reset Data Pesanan Simulasi
          </Button>
          <Button
            variant="primary"
            leftIcon={
              <Compass size={16} strokeWidth={2.25} aria-hidden="true" />
            }
            onClick={() => navigate(ROUTES.CATALOG)}
          >
            Cari Buku Baru
          </Button>
        </div>

        {resetFeedback && (
          <div
            role="status"
            style={{
              backgroundColor: 'var(--nb-green)',
              border: 'var(--nb-border-thin)',
              padding: '10px 12px',
            }}
          >
            <p className="nb-label">
              Data pesanan simulasi telah dikembalikan ke kondisi awal.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
