import { Link } from 'react-router-dom';
import { BookOpen, FileText } from 'lucide-react';
import type { PurchasedBookAccess } from '../../../types/order.types';
import { ROUTES } from '../../../constants/routes';
import { formatDate } from '../../../utils/formatDate';
import { BookCoverArtwork } from '../../../components/shared/BookCard';
import {
  AccessStatusBadge,
  PaymentStatusBadge,
  SimulationBadge,
} from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

interface PurchasedBookCardProps {
  item: PurchasedBookAccess;
  onOpenReader: (item: PurchasedBookAccess) => void;
}

export function PurchasedBookCard({
  item,
  onOpenReader,
}: PurchasedBookCardProps) {
  const isAuthorized =
    item.paymentStatus === 'paid' && item.accessStatus === 'granted';

  return (
    <article
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 'var(--nb-space-4)',
        padding: 'var(--nb-space-5)',
        backgroundColor: 'var(--nb-white)',
        border: 'var(--nb-border)',
        boxShadow: 'var(--nb-shadow)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--nb-space-3)',
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
          <AccessStatusBadge status={item.accessStatus} />
          {item.isSimulation && <SimulationBadge />}
        </div>

        <BookCoverArtwork
          title={item.title}
          author={item.author}
          categoryName={item.categoryName}
          coverCode={item.coverCode}
          accent={item.coverAccent}
        />

        <div>
          <h3 className="nb-h3" style={{ marginBottom: '4px' }}>
            {item.title}
          </h3>
          <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
            Penulis: {item.author}
          </p>
        </div>

        <dl
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '6px 12px',
            backgroundColor: 'var(--nb-paper)',
            border: 'var(--nb-border-thin)',
            padding: 'var(--nb-space-3)',
          }}
        >
          <dt className="nb-label">Tanggal Beli:</dt>
          <dd className="nb-mono" style={{ fontSize: '0.8125rem' }}>
            {formatDate(item.purchaseDate)}
          </dd>

          <dt className="nb-label">No. Pesanan:</dt>
          <dd className="nb-mono" style={{ fontSize: '0.8125rem' }}>
            {item.orderNumber}
          </dd>
        </dl>

        <div>
          <PaymentStatusBadge status={item.paymentStatus} />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--nb-space-2)',
          borderTop: 'var(--nb-border-thin)',
          paddingTop: 'var(--nb-space-3)',
        }}
      >
        <Button
          variant="primary"
          fullWidth
          disabled={!isAuthorized}
          onClick={() => onOpenReader(item)}
          leftIcon={<BookOpen size={18} strokeWidth={2.25} aria-hidden="true" />}
        >
          {isAuthorized
            ? 'Baca E-Book (Akses Terverifikasi)'
            : 'Akses Terkunci'}
        </Button>

        <Link
          to={ROUTES.ORDER_DETAIL(item.orderId)}
          className="nb-pressable"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            minHeight: '44px',
            paddingInline: 'var(--nb-space-3)',
            backgroundColor: 'var(--nb-white)',
            fontFamily: 'var(--nb-font-heading)',
            fontWeight: 700,
            fontSize: '0.875rem',
          }}
        >
          <FileText size={16} strokeWidth={2.25} aria-hidden="true" />
          <span>Lihat Bukti Transaksi</span>
        </Link>
      </div>
    </article>
  );
}
