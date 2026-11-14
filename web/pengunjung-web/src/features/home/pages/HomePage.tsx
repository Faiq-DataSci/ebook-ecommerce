import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Book, Category } from '../../../types/book.types';
import { bookService } from '../../../services/book.service';
import { ROUTES } from '../../../constants/routes';
import { PriceDisplay } from '../../../components/shared/PriceDisplay';
import { EmptyState } from '../../../components/shared/EmptyState';
import { Badge, SimulationBadge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { HeroSection } from '../components/HeroSection';
import { CategorySection } from '../components/CategorySection';
import { FeaturedBooks } from '../components/FeaturedBooks';
import { PromotionalSection } from '../components/PromotionalSection';

export function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [latestBooks, setLatestBooks] = useState<Book[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  const loadHomeData = async () => {
    setStatus('loading');
    try {
      const [cats, featured, latest] = await Promise.all([
        bookService.getCategories(),
        bookService.getFeaturedBooks(),
        bookService.getLatestBooks(4),
      ]);
      setCategories(cats);
      setFeaturedBooks(featured);
      setLatestBooks(latest);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    let active = true;
    Promise.all([
      bookService.getCategories(),
      bookService.getFeaturedBooks(),
      bookService.getLatestBooks(4),
    ])
      .then(([cats, featured, latest]) => {
        if (!active) return;
        setCategories(cats);
        setFeaturedBooks(featured);
        setLatestBooks(latest);
        setStatus('ready');
      })
      .catch(() => {
        if (active) setStatus('error');
      });

    return () => {
      active = false;
    };
  }, []);

  if (status === 'loading') {
    return (
      <div className="nb-container nb-section">
        <Spinner label="Memuat halaman beranda E-Book Store..." />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="nb-container nb-section">
        <EmptyState
          tone="pink"
          title="Data Beranda Belum Dapat Dimuat"
          description="Terjadi kendala saat menyiapkan data katalog contoh. Silakan muat ulang halaman beranda."
          actionLabel="Muat Ulang Beranda"
          onAction={loadHomeData}
        />
      </div>
    );
  }

  return (
    <div>
      <HeroSection featuredPreviewBooks={featuredBooks} />
      <CategorySection categories={categories} />
      <FeaturedBooks books={featuredBooks} />

      <section
        className="nb-section"
        style={{ backgroundColor: 'var(--nb-paper)' }}
      >
        <div className="nb-container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 'var(--nb-space-4)',
              marginBottom: 'var(--nb-space-6)',
            }}
          >
            <div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <SimulationBadge />
                <Badge tone="blue">Konsep Presentasi Katalog</Badge>
              </div>
              <h2 className="nb-h1">Baru Ditambahkan ke Katalog</h2>
              <p className="nb-body" style={{ color: 'var(--nb-text-muted)' }}>
                Seksi penemuan katalog tambahan. Aturan pengurutan dan sumber data
                aktual ditentukan oleh implementasi backend.
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--nb-space-5)',
            }}
          >
            {latestBooks.map((book) => (
              <Card key={book.id} tone="white" zone="B" padding="md">
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    gap: 'var(--nb-space-4)',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '8px',
                        flexWrap: 'wrap',
                        marginBottom: '10px',
                      }}
                    >
                      <Badge tone="yellow">{book.categoryName}</Badge>
                      <span className="nb-mono" style={{ fontSize: '0.75rem' }}>
                        {book.coverCode}
                      </span>
                    </div>
                    <h3 className="nb-h3" style={{ marginBottom: '6px' }}>
                      {book.title}
                    </h3>
                    <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
                      Penulis: {book.author}
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      borderTop: 'var(--nb-border-thin)',
                      paddingTop: 'var(--nb-space-3)',
                    }}
                  >
                    <PriceDisplay amount={book.price} size="sm" />
                    <Link
                      to={ROUTES.BOOK_DETAIL(book.id)}
                      className="nb-label"
                      style={{ textDecoration: 'underline' }}
                    >
                      Buka Rincian
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section
        id="tentang-toko"
        className="nb-section"
        style={{ backgroundColor: 'var(--nb-white)' }}
      >
        <div className="nb-container">
          <Card tone="paper" zone="B" padding="lg">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 'var(--nb-space-6)',
              }}
            >
              <div>
                <SimulationBadge />
                <h2 className="nb-h2" style={{ marginTop: '10px', marginBottom: '8px' }}>
                  Alur Pembelian & Hak Akses E-Book
                </h2>
                <p className="nb-body">
                  Toko e-book ini menerapkan model bisnis toko tunggal resmi
                  (Single-Store B2C). Setiap pembelian e-book tercatat sebagai
                  pesanan individual yang jelas statusnya.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <p className="nb-label">1. Telusuri & Pilih Buku Digital</p>
                <p className="nb-body-sm">
                  Pengunjung dapat menjelajahi katalog dan membaca deskripsi buku
                  tanpa harus masuk sebagai admin.
                </p>
                <p className="nb-label">2. Buat Pesanan & Verifikasi Pembayaran</p>
                <p className="nb-body-sm">
                  Pesanan yang masih berstatus menunggu, gagal, atau kedaluwarsa
                  tidak memberikan akses unduh maupun baca.
                </p>
                <p className="nb-label">3. Baca di Pustaka Saya</p>
                <p className="nb-body-sm">
                  Hak akses baca e-book hanya aktif setelah status pembayaran
                  diverifikasi oleh sistem.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <PromotionalSection />
    </div>
  );
}
