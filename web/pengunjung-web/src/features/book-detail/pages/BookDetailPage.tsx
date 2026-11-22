import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Book } from '../../../types/book.types';
import type { Order } from '../../../types/order.types';
import { ROUTES } from '../../../constants/routes';
import { bookService } from '../../../services/book.service';
import { orderService } from '../../../services/order.service';
import { useAuth } from '../../auth/hooks/useAuth';
import { Breadcrumb } from '../../../components/shared/Breadcrumb';
import { BookCard } from '../../../components/shared/BookCard';
import { EmptyState } from '../../../components/shared/EmptyState';
import { SimulationBadge } from '../../../components/ui/Badge';
import { Spinner } from '../../../components/ui/Spinner';
import { BookInformation } from '../components/BookInformation';
import { BookReviewsSection } from '../components/BookReviewsSection';
import { PurchasePanel } from '../components/PurchasePanel';

export function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { customer, isAuthenticated } = useAuth();

  const [book, setBook] = useState<Book | null>(null);
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [status, setStatus] = useState<
    'loading' | 'ready' | 'not_found' | 'error'
  >('loading');

  useEffect(() => {
    let active = true;

    async function fetchBookDetails() {
      if (!id) {
        if (active) setStatus('not_found');
        return;
      }

      try {
        const [foundBook, orders] = await Promise.all([
          bookService.getBookById(id),
          orderService.getCustomerOrders(),
        ]);

        if (!active) return;
        if (!foundBook) {
          setStatus('not_found');
          return;
        }

        const related = await bookService.getRelatedBooks(foundBook, 3);
        if (!active) return;

        setBook(foundBook);
        setRelatedBooks(related);
        setCustomerOrders(orders);
        setStatus('ready');
      } catch {
        if (active) setStatus('error');
      }
    }

    fetchBookDetails();

    return () => {
      active = false;
    };
  }, [id]);

  const handleBuyNow = async () => {
    if (!book) return;
    if (!isAuthenticated || !customer) {
      navigate(
        `${ROUTES.LOGIN}?redirect=${encodeURIComponent(ROUTES.BOOK_DETAIL(book.id))}`,
      );
      return;
    }

    setIsCreatingOrder(true);
    try {
      const createdOrder = await orderService.createSimulatedOrder(
        book.id,
        customer.id,
      );
      navigate(ROUTES.ORDER_DETAIL(createdOrder.id));
    } finally {
      setIsCreatingOrder(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="nb-container nb-section">
        <Spinner label="Memuat informasi detail e-book..." />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="nb-container nb-section">
        <EmptyState
          tone="pink"
          title="Gagal Memuat Detail E-Book"
          description="Terjadi gangguan saat mengambil rincian e-book. Silakan kembali ke katalog atau coba lagi."
          actionLabel="Kembali ke Katalog"
          onAction={() => navigate(ROUTES.CATALOG)}
        />
      </div>
    );
  }

  if (status === 'not_found' || !book) {
    return (
      <div className="nb-container nb-section">
        <Breadcrumb
          items={[
            { label: 'Beranda', to: ROUTES.HOME },
            { label: 'Katalog', to: ROUTES.CATALOG },
            { label: 'E-Book Tidak Ditemukan' },
          ]}
        />
        <EmptyState
          title="E-Book Tidak Ditemukan di Katalog"
          description="ID produk yang Anda cari tidak tersedia pada koleksi contoh saat ini."
          actionLabel="Buka Katalog E-Book"
          onAction={() => navigate(ROUTES.CATALOG)}
        />
      </div>
    );
  }

  const paidOrder = customerOrders.find(
    (ord) =>
      ord.bookId === book.id &&
      ord.paymentStatus === 'paid' &&
      ord.orderStatus === 'completed',
  );

  const pendingOrder = customerOrders.find(
    (ord) => ord.bookId === book.id && ord.paymentStatus === 'pending',
  );

  return (
    <div className="nb-section" style={{ backgroundColor: 'var(--nb-paper)' }}>
      <div className="nb-container">
        <Breadcrumb
          items={[
            { label: 'Beranda', to: ROUTES.HOME },
            { label: 'Katalog', to: ROUTES.CATALOG },
            { label: book.title },
          ]}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--nb-space-8)',
            alignItems: 'start',
          }}
        >
          <div style={{ gridColumn: 'span 2', minWidth: 0 }}>
            <BookInformation book={book} />
          </div>

          <div style={{ width: '100%', maxWidth: '420px' }}>
            <PurchasePanel
              book={book}
              isAlreadyPurchasedAndVerified={Boolean(paidOrder)}
              existingPendingOrderId={pendingOrder?.id ?? null}
              isCreatingOrder={isCreatingOrder}
              onBuyNow={handleBuyNow}
            />
          </div>
        </div>

        {/* Seksi Ulasan Produk & Penilaian Pembaca (design.md bagian 5.9 & 8.5) */}
        <BookReviewsSection
          book={book}
          isVerifiedOwner={Boolean(paidOrder)}
        />

        {relatedBooks.length > 0 && (
          <section
            style={{
              marginTop: 'var(--nb-space-12)',
              paddingTop: 'var(--nb-space-8)',
              borderTop: 'var(--nb-border)',
            }}
          >
            <div style={{ marginBottom: 'var(--nb-space-6)' }}>
              <SimulationBadge />
              <h2 className="nb-h2" style={{ marginTop: '8px' }}>
                E-Book Terkait dalam Kategori {book.categoryName}
              </h2>
            </div>

            <div className="nb-grid-cards">
              {relatedBooks.map((item) => (
                <BookCard key={item.id} book={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
