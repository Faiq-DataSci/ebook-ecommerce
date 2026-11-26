import { Link, useNavigate } from 'react-router-dom';
import { ReceiptText } from 'lucide-react';
import type { Order } from '../../../types/order.types';
import { ROUTES } from '../../../constants/routes';
import { formatDate } from '../../../utils/formatDate';
import { EmptyState } from '../../../components/shared/EmptyState';
import { PriceDisplay } from '../../../components/shared/PriceDisplay';
import { OrderStatusBadge, PaymentStatusBadge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';

interface AccountRecentOrdersCardProps {
  orders: Order[];
  recentOrders: Order[];
}

export function AccountRecentOrdersCard({
  orders,
  recentOrders,
}: AccountRecentOrdersCardProps) {
  const navigate = useNavigate();

  return (
    <Card tone="white" zone="C" padding="lg">
      <div className="nb-stack-4">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--nb-space-3)',
          }}
        >
          <div>
            <h2 className="nb-h2">Transaksi Terbaru Anda</h2>
            <p
              className="nb-body-sm"
              style={{ color: 'var(--nb-text-muted)' }}
            >
              Menampilkan hingga 3 pesanan terakhir dari akun pelanggan Anda
            </p>
          </div>
          <Link
            to={ROUTES.ORDERS}
            className="nb-nav-item nb-nav-item--orders-active"
          >
            <ReceiptText size={16} strokeWidth={2.25} aria-hidden="true" />
            <span>Lihat Semua Riwayat Pembelian ({orders.length})</span>
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <EmptyState
            tone="paper"
            title="Belum Ada Riwayat Transaksi"
            description="Anda belum membuat pesanan e-book. Silakan pilih buku digital di katalog."
            actionLabel="Jelajahi Katalog E-Book"
            onAction={() => navigate(ROUTES.CATALOG)}
          />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--nb-space-4)',
            }}
          >
            {recentOrders.map((order) => (
              <Card key={order.id} tone="paper" zone="C" padding="md">
                <div className="nb-stack-3">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <span
                      className="nb-mono"
                      style={{ fontSize: '0.8125rem' }}
                    >
                      {order.orderNumber}
                    </span>
                    <OrderStatusBadge status={order.orderStatus} />
                  </div>

                  <div>
                    <h3 className="nb-h3">{order.bookTitle}</h3>
                    <p
                      className="nb-body-sm"
                      style={{ color: 'var(--nb-text-muted)' }}
                    >
                      Tanggal: {formatDate(order.orderDate, true)}
                    </p>
                  </div>

                  <div>
                    <PaymentStatusBadge status={order.paymentStatus} />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: 'var(--nb-border-thin)',
                      paddingTop: '10px',
                    }}
                  >
                    <PriceDisplay amount={order.totalAmount} size="sm" />
                    <Link
                      to={ROUTES.ORDER_DETAIL(order.id)}
                      className="nb-label"
                      style={{ textDecoration: 'underline' }}
                    >
                      Buka Detail Transaksi
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
