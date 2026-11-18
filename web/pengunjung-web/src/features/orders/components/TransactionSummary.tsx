import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import type { Order, OrderStatus } from '../../../types/order.types';
import type {
  PaymentStatus,
  PaymentSummary,
} from '../../../types/payment.types';
import { ROUTES } from '../../../constants/routes';
import { formatDate } from '../../../utils/formatDate';
import { BookCoverArtwork } from '../../../components/shared/BookCard';
import { PriceDisplay } from '../../../components/shared/PriceDisplay';
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  SimulationBadge,
} from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';

interface TransactionSummaryProps {
  order: Order;
  paymentSummary: PaymentSummary;
  effectivePaymentStatus: PaymentStatus;
  effectiveOrderStatus: OrderStatus;
}

export function TransactionSummary({
  order,
  paymentSummary,
  effectivePaymentStatus,
  effectiveOrderStatus,
}: TransactionSummaryProps) {
  const canOpenInLibrary =
    effectivePaymentStatus === 'paid' && effectiveOrderStatus === 'completed';

  return (
    <Card tone="white" zone="C" padding="lg">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--nb-space-5)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            borderBottom: 'var(--nb-border-thin)',
            paddingBottom: 'var(--nb-space-3)',
          }}
        >
          <div>
            <span className="nb-label">ID Pesanan:</span>{' '}
            <span className="nb-mono">{order.orderNumber}</span>
          </div>
          <SimulationBadge />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--nb-space-5)',
            alignItems: 'start',
          }}
        >
          <div style={{ maxWidth: '200px', width: '100%' }}>
            <BookCoverArtwork
              title={order.bookTitle}
              author={order.bookAuthor}
              categoryName={order.bookCategory}
              coverCode={order.bookCoverCode}
              accent={order.bookCoverAccent}
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--nb-space-3)',
            }}
          >
            <h2 className="nb-h2">{order.bookTitle}</h2>
            <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
              Penulis: {order.bookAuthor} | Kategori: {order.bookCategory}
            </p>

            <dl
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '10px 16px',
                backgroundColor: 'var(--nb-paper)',
                border: 'var(--nb-border-thin)',
                padding: 'var(--nb-space-4)',
              }}
            >
              <dt className="nb-label">ID Internal Pesanan:</dt>
              <dd className="nb-mono" style={{ fontSize: '0.8125rem' }}>
                {order.id}
              </dd>

              <dt className="nb-label">Tanggal Pesanan:</dt>
              <dd className="nb-mono" style={{ fontSize: '0.8125rem' }}>
                {formatDate(order.orderDate, true)}
              </dd>

              <dt className="nb-label">Batas Waktu Pembayaran:</dt>
              <dd className="nb-mono" style={{ fontSize: '0.8125rem' }}>
                {formatDate(order.expiresAt, true)}
              </dd>

              <dt className="nb-label">Referensi Transaksi:</dt>
              <dd className="nb-mono" style={{ fontSize: '0.8125rem' }}>
                {paymentSummary.transactionId}
              </dd>

              <dt className="nb-label">Metode Pembayaran:</dt>
              <dd className="nb-body-sm">
                {paymentSummary.paymentChannelLabel}
              </dd>

              <dt className="nb-label">Status Pembayaran:</dt>
              <dd>
                <PaymentStatusBadge status={effectivePaymentStatus} />
              </dd>

              <dt className="nb-label">Status Transaksi / Pesanan:</dt>
              <dd>
                <OrderStatusBadge status={effectiveOrderStatus} />
              </dd>
            </dl>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                backgroundColor: 'var(--nb-paper)',
                border: 'var(--nb-border-thin)',
                padding: 'var(--nb-space-4)',
              }}
            >
              <span className="nb-label">Total Pembayaran</span>
              <PriceDisplay amount={order.totalAmount} size="lg" />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {canOpenInLibrary && (
                <Link
                  to={ROUTES.LIBRARY}
                  className="nb-pressable"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    minHeight: '48px',
                    paddingInline: 'var(--nb-space-5)',
                    backgroundColor: 'var(--nb-green)',
                    fontFamily: 'var(--nb-font-heading)',
                    fontWeight: 700,
                  }}
                >
                  <BookOpen size={18} strokeWidth={2.25} aria-hidden="true" />
                  <span>Buka E-Book di Pustaka Saya</span>
                </Link>
              )}

              <Link
                to={ROUTES.BOOK_DETAIL(order.bookId)}
                className="nb-pressable"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '48px',
                  paddingInline: 'var(--nb-space-4)',
                  backgroundColor: 'var(--nb-white)',
                  fontFamily: 'var(--nb-font-heading)',
                  fontWeight: 700,
                }}
              >
                <span>Halaman Produk E-Book</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
