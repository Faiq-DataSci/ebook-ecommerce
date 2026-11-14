import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import type { Order } from '../../../types/order.types';
import { ROUTES } from '../../../constants/routes';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import {
  OrderStatusBadge,
  PaymentStatusBadge,
  SimulationBadge,
} from '../../../components/ui/Badge';

interface OrderTableProps {
  orders: Order[];
}

export function OrderTable({ orders }: OrderTableProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--nb-white)',
        border: 'var(--nb-border)',
        boxShadow: 'var(--nb-shadow)',
        overflowX: 'auto',
      }}
    >
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          minWidth: '760px',
        }}
      >
        <caption
          style={{
            textAlign: 'left',
            padding: 'var(--nb-space-3) var(--nb-space-4)',
            backgroundColor: 'var(--nb-paper)',
            borderBottom: 'var(--nb-border-thin)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px',
            }}
          >
            <span className="nb-label">
              Daftar Riwayat Pesanan & Status Verifikasi Pembayaran Pelanggan
            </span>
            <SimulationBadge />
          </div>
        </caption>

        <thead>
          <tr
            style={{
              backgroundColor: 'var(--nb-yellow)',
              borderBottom: 'var(--nb-border)',
            }}
          >
            <th
              scope="col"
              className="nb-label"
              style={{ textAlign: 'left', padding: '14px 16px' }}
            >
              Nomor Pesanan
            </th>
            <th
              scope="col"
              className="nb-label"
              style={{ textAlign: 'left', padding: '14px 16px' }}
            >
              Judul E-Book
            </th>
            <th
              scope="col"
              className="nb-label"
              style={{ textAlign: 'left', padding: '14px 16px' }}
            >
              Tanggal Pesan
            </th>
            <th
              scope="col"
              className="nb-label"
              style={{ textAlign: 'right', padding: '14px 16px' }}
            >
              Total Harga
            </th>
            <th
              scope="col"
              className="nb-label"
              style={{ textAlign: 'left', padding: '14px 16px' }}
            >
              Status Pembayaran
            </th>
            <th
              scope="col"
              className="nb-label"
              style={{ textAlign: 'left', padding: '14px 16px' }}
            >
              Status Transaksi
            </th>
            <th
              scope="col"
              className="nb-label"
              style={{ textAlign: 'center', padding: '14px 16px' }}
            >
              Tindakan
            </th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order, index) => (
            <tr
              key={order.id}
              style={{
                backgroundColor:
                  index % 2 === 0 ? 'var(--nb-white)' : 'var(--nb-paper)',
                borderBottom: 'var(--nb-border-thin)',
              }}
            >
              <td
                className="nb-mono"
                style={{ padding: '14px 16px', fontSize: '0.8125rem' }}
              >
                {order.orderNumber}
              </td>

              <td style={{ padding: '14px 16px' }}>
                <p className="nb-label" style={{ marginBottom: '2px' }}>
                  {order.bookTitle}
                </p>
                <p
                  className="nb-body-sm"
                  style={{ color: 'var(--nb-text-muted)' }}
                >
                  {order.bookAuthor} ({order.bookCategory})
                </p>
              </td>

              <td
                className="nb-mono"
                style={{ padding: '14px 16px', fontSize: '0.8125rem' }}
              >
                {formatDate(order.orderDate)}
              </td>

              <td
                className="nb-mono"
                style={{
                  padding: '14px 16px',
                  textAlign: 'right',
                  fontWeight: 700,
                }}
              >
                {formatCurrency(order.totalAmount)}
              </td>

              <td style={{ padding: '14px 16px' }}>
                <PaymentStatusBadge status={order.paymentStatus} />
              </td>

              <td style={{ padding: '14px 16px' }}>
                <OrderStatusBadge status={order.orderStatus} />
              </td>

              <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                <Link
                  to={ROUTES.ORDER_DETAIL(order.id)}
                  className="nb-pressable"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    minHeight: '44px',
                    paddingInline: '14px',
                    backgroundColor: 'var(--nb-white)',
                    fontFamily: 'var(--nb-font-heading)',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <Eye size={16} strokeWidth={2.25} aria-hidden="true" />
                  <span>Lihat Rincian</span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
