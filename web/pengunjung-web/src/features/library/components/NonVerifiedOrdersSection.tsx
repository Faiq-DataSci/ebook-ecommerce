import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import type { Order } from '../../../types/order.types';
import { ROUTES } from '../../../constants/routes';
import { AccessStatusBadge, PaymentStatusBadge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';

interface NonVerifiedOrdersSectionProps {
  orders: Order[];
}

export function NonVerifiedOrdersSection({ orders }: NonVerifiedOrdersSectionProps) {
  if (orders.length === 0) return null;

  return (
    <section
      style={{
        marginTop: 'var(--nb-space-12)',
        paddingTop: 'var(--nb-space-8)',
        borderTop: 'var(--nb-border)',
      }}
    >
      <div style={{ marginBottom: 'var(--nb-space-4)' }}>
        <h2 className="nb-h2">
          Pesanan Belum Terverifikasi (Akses E-Book Terkunci)
        </h2>
        <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
          Daftar di bawah ini menunjukkan pesanan Anda yang belum
          memenuhi syarat akses baca karena status pembayaran belum
          lunas.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--nb-space-4)',
        }}
      >
        {orders.map((order) => (
          <Card key={order.id} tone="paper" zone="C" padding="md">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                <span className="nb-mono" style={{ fontSize: '0.8125rem' }}>
                  {order.orderNumber}
                </span>
                <AccessStatusBadge
                  status={
                    order.paymentStatus === 'pending'
                      ? 'locked'
                      : 'revoked'
                  }
                />
              </div>

              <h3 className="nb-h3">{order.bookTitle}</h3>

              <div>
                <PaymentStatusBadge status={order.paymentStatus} />
              </div>

              <p className="nb-body-sm">{order.verificationNote}</p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: 'var(--nb-border-thin)',
                  paddingTop: '8px',
                  marginTop: '4px',
                }}
              >
                <span
                  className="nb-label"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: 'var(--nb-disabled-text)',
                  }}
                >
                  <Lock size={15} strokeWidth={2.25} aria-hidden="true" />
                  <span>Tidak Dapat Dibaca</span>
                </span>
                <Link
                  to={ROUTES.ORDER_DETAIL(order.id)}
                  className="nb-label"
                  style={{ textDecoration: 'underline' }}
                >
                  Rincian Pesanan
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
