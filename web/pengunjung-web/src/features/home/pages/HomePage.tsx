import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Book, Category } from '../../../types/book.types';
import { bookService } from '../../../services/book.service';
import { ROUTES } from '../../../constants/routes';
import { BookCard } from '../../../components/shared/BookCard';
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
    <div className="nb-homepage-root">
      <HeroSection />

      <FeaturedBooks books={featuredBooks} />

      <CategorySection categories={categories} />

      {/* Seksi Katalog Baru */}
      <section
        className="nb-section"
        style={{ backgroundColor: 'var(--nb-paper)', borderBottom: 'var(--nb-border-thick)' }}
      >
        <div className="nb-container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 'var(--nb-space-4)',
              marginBottom: 'clamp(1.75rem, 3vw, 2.5rem)',
            }}
          >
            <div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                <SimulationBadge />
                <Badge tone="blue">Kurasi Terbaru</Badge>
              </div>
              <h2 className="nb-h1">Baru Ditambahkan ke Katalog</h2>
              <p className="nb-body" style={{ color: 'var(--nb-text-muted)' }}>
                Rilisan literatur terbaru yang baru dikurasi ke dalam katalog toko digital resmi.
              </p>
            </div>

            <Link
              to={ROUTES.CATALOG}
              className="nb-pressable nb-section-header-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '44px',
                paddingInline: 'var(--nb-space-5)',
                backgroundColor: 'var(--nb-white)',
                border: 'var(--nb-border-thin)',
                fontFamily: 'var(--nb-font-heading)',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none',
                color: 'var(--nb-black)',
              }}
            >
              Jelajahi Semua Koleksi
            </Link>
          </div>

          <div className="nb-grid-cards nb-grid-cards-4">
            {latestBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </section>

      {/* Seksi Panduan Alur Belanja & Hak Akses */}
      <section
        id="tentang-toko"
        className="nb-section"
        style={{
          backgroundColor: 'var(--nb-white)',
          borderBottom: 'var(--nb-border-thick)',
        }}
      >
        <div className="nb-container">
          <Card tone="paper" zone="B" padding="lg">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 'clamp(2rem, 4vw, 3.5rem)',
                alignItems: 'start',
              }}
            >
              <div>
                <SimulationBadge />
                <h2 className="nb-h2" style={{ marginTop: '12px', marginBottom: '10px' }}>
                  Alur Pembelian &amp; Hak Akses E-Book
                </h2>
                <p className="nb-body" style={{ color: 'var(--nb-text-muted)', lineHeight: 1.6 }}>
                  Toko e-book ini menerapkan model bisnis toko tunggal resmi (Single-Store B2C).
                  Setiap pembelian e-book dicatat sebagai pesanan individual dengan hak akses baca
                  yang terjamin keasliannya.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nb-space-4)' }}>
                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px 16px',
                    backgroundColor: 'var(--nb-white)',
                    border: 'var(--nb-border-thin)',
                  }}
                >
                  <span
                    className="nb-mono"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      backgroundColor: 'var(--nb-yellow)',
                      border: '1px solid var(--nb-black)',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      flexShrink: 0,
                    }}
                  >
                    1
                  </span>
                  <div>
                    <h3 className="nb-label" style={{ margin: '0 0 2px' }}>Telusuri &amp; Pilih Buku Digital</h3>
                    <p className="nb-body-sm" style={{ margin: 0, color: 'var(--nb-text-muted)' }}>
                      Pengunjung bebas menjelajahi katalog publik, mencari judul bahasan, dan meninjau informasi buku.
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px 16px',
                    backgroundColor: 'var(--nb-white)',
                    border: 'var(--nb-border-thin)',
                  }}
                >
                  <span
                    className="nb-mono"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      backgroundColor: 'var(--nb-blue)',
                      border: '1px solid var(--nb-black)',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      flexShrink: 0,
                    }}
                  >
                    2
                  </span>
                  <div>
                    <h3 className="nb-label" style={{ margin: '0 0 2px' }}>Pesan &amp; Verifikasi Pembayaran</h3>
                    <p className="nb-body-sm" style={{ margin: 0, color: 'var(--nb-text-muted)' }}>
                      Transaksi diverifikasi otomatis oleh sistem. Status pembayaran lunas mengaktifkan lisensi baca.
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px 16px',
                    backgroundColor: 'var(--nb-white)',
                    border: 'var(--nb-border-thin)',
                  }}
                >
                  <span
                    className="nb-mono"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      backgroundColor: 'var(--nb-green)',
                      border: '1px solid var(--nb-black)',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      flexShrink: 0,
                    }}
                  >
                    3
                  </span>
                  <div>
                    <h3 className="nb-label" style={{ margin: '0 0 2px' }}>Akses Seketika di Pustaka Saya</h3>
                    <p className="nb-body-sm" style={{ margin: 0, color: 'var(--nb-text-muted)' }}>
                      E-book yang telah lunas otomatis tersimpan di menu Pustaka akun dan siap dibaca kapan saja.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <PromotionalSection />
    </div>
  );
}
