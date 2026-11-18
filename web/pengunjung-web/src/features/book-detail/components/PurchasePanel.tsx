import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, ShoppingBag } from 'lucide-react';
import type { Book } from '../../../types/book.types';
import { ROUTES } from '../../../constants/routes';
import { PriceDisplay } from '../../../components/shared/PriceDisplay';
import { SimulationBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface PurchasePanelProps {
  book: Book;
  isAlreadyPurchasedAndVerified: boolean;
  existingPendingOrderId: string | null;
  isCreatingOrder: boolean;
  onBuyNow: () => void;
}

export function PurchasePanel({
  book,
  isAlreadyPurchasedAndVerified,
  existingPendingOrderId,
  isCreatingOrder,
  onBuyNow,
}: PurchasePanelProps) {
  return (
    <Card tone="white" zone="B" padding="lg">
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
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <span className="nb-label">Panel Pembelian Langsung</span>
          <SimulationBadge />
        </div>

        <div
          style={{
            backgroundColor: 'var(--nb-paper)',
            border: 'var(--nb-border-thin)',
            padding: 'var(--nb-space-4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <span className="nb-label">Harga Satuan</span>
          <PriceDisplay amount={book.price} size="lg" />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px',
            backgroundColor: 'var(--nb-paper)',
            border: 'var(--nb-border-thin)',
            padding: 'var(--nb-space-3)',
          }}
        >
          <ShieldCheck
            size={20}
            strokeWidth={2.25}
            aria-hidden="true"
            style={{ flexShrink: 0, marginTop: '2px' }}
          />
          <p className="nb-body-sm">
            Pembelian langsung satu produk digital (tanpa keranjang belanja).
            Hak akses baca di Pustaka Saya hanya diberikan setelah status
            pembayaran diverifikasi.
          </p>
        </div>

        {isAlreadyPurchasedAndVerified ? (
          <Link
            to={ROUTES.LIBRARY}
            className="nb-pressable"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              minHeight: '52px',
              paddingInline: 'var(--nb-space-5)',
              backgroundColor: 'var(--nb-green)',
              fontFamily: 'var(--nb-font-heading)',
              fontWeight: 700,
            }}
          >
            <BookOpen size={20} strokeWidth={2.25} aria-hidden="true" />
            <span>Buka di Pustaka Saya (Sudah Dimiliki)</span>
          </Link>
        ) : existingPendingOrderId ? (
          <Link
            to={ROUTES.ORDER_DETAIL(existingPendingOrderId)}
            className="nb-pressable"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              minHeight: '52px',
              paddingInline: 'var(--nb-space-5)',
              backgroundColor: 'var(--nb-orange)',
              fontFamily: 'var(--nb-font-heading)',
              fontWeight: 700,
            }}
          >
            <span>Lihat Pesanan Menunggu Verifikasi</span>
          </Link>
        ) : (
          <Button
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isCreatingOrder}
            onClick={onBuyNow}
            leftIcon={<ShoppingBag size={20} strokeWidth={2.25} aria-hidden="true" />}
          >
            Beli E-Book Sekarang
          </Button>
        )}

        <Link
          to={ROUTES.CATALOG}
          className="nb-pressable"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '44px',
            paddingInline: 'var(--nb-space-4)',
            backgroundColor: 'var(--nb-white)',
            fontFamily: 'var(--nb-font-heading)',
            fontWeight: 700,
          }}
        >
          <span>Kembali ke Katalog</span>
        </Link>
      </div>
    </Card>
  );
}
