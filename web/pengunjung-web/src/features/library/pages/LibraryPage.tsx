import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ReceiptText, ShieldAlert, UserCheck } from 'lucide-react';
import type { Order, PurchasedBookAccess } from '../../../types/order.types';
import { ROUTES } from '../../../constants/routes';
import { orderService } from '../../../services/order.service';
import { useAuth } from '../../auth/hooks/useAuth';
import { EmptyState } from '../../../components/shared/EmptyState';
import {
  AccessStatusBadge,
  PaymentStatusBadge,
  SimulationBadge,
} from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Modal } from '../../../components/ui/Modal';
import { Spinner } from '../../../components/ui/Spinner';
import { PurchasedBookCard } from '../components/PurchasedBookCard';

export function LibraryPage() {
  const { customer } = useAuth();
  const navigate = useNavigate();

  const [libraryItems, setLibraryItems] = useState<PurchasedBookAccess[]>([]);
  const [nonVerifiedOrders, setNonVerifiedOrders] = useState<Order[]>([]);
  const [viewMode, setViewMode] = useState<
    'normal' | 'empty' | 'loading' | 'error'
  >('normal');
  const [activeReaderItem, setActiveReaderItem] =
    useState<PurchasedBookAccess | null>(null);

  useEffect(() => {
    let active = true;

    async function loadLibrary() {
      try {
        const [authorizedBooks, allOrders] = await Promise.all([
          orderService.getAuthorizedLibrary(),
          orderService.getCustomerOrders(),
        ]);
        if (!active) return;
        setLibraryItems(authorizedBooks);
        setNonVerifiedOrders(
          allOrders.filter((order) => order.paymentStatus !== 'paid'),
        );
      } catch {
        if (active) setViewMode('error');
      }
    }

    loadLibrary();
    return () => {
      active = false;
    };
  }, []);

  const displayedBooks = viewMode === 'empty' ? [] : libraryItems;

  return (
    <div className="nb-section" style={{ backgroundColor: 'var(--nb-paper)' }}>
      <div className="nb-container">
        <Card
          tone="yellow"
          zone="B"
          padding="lg"
          style={{ marginBottom: 'var(--nb-space-6)' }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--nb-space-4)',
            }}
          >
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                <SimulationBadge />
              </div>
              <h1 className="nb-h1">
                Selamat Datang di Pustaka Digital Anda
              </h1>
              <p className="nb-body" style={{ marginTop: '4px' }}>
                Kelola dan baca koleksi e-book yang pembayarannya telah
                diverifikasi.
              </p>
            </div>

            {customer && (
              <div
                style={{
                  backgroundColor: 'var(--nb-white)',
                  border: 'var(--nb-border)',
                  boxShadow: 'var(--nb-shadow-sm)',
                  padding: 'var(--nb-space-4)',
                  minWidth: '260px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '6px',
                  }}
                >
                  <UserCheck size={18} strokeWidth={2.25} aria-hidden="true" />
                  <span className="nb-label">Ringkasan Profil Pelanggan</span>
                </div>
                <p className="nb-body-sm" style={{ fontWeight: 700 }}>
                  {customer.fullName}
                </p>
                <p className="nb-mono" style={{ fontSize: '0.8125rem' }}>
                  {customer.email}
                </p>
                <div style={{ marginTop: '10px' }}>
                  <Link
                    to={ROUTES.ORDERS}
                    className="nb-label"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      textDecoration: 'underline',
                    }}
                  >
                    <ReceiptText size={16} strokeWidth={2.25} aria-hidden="true" />
                    <span>Buka Riwayat Pembelian</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card
          tone="white"
          zone="C"
          padding="md"
          style={{ marginBottom: 'var(--nb-space-6)' }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--nb-space-4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', maxWidth: '720px' }}>
              <ShieldAlert
                size={22}
                strokeWidth={2.25}
                aria-hidden="true"
                style={{ flexShrink: 0, marginTop: '2px' }}
              />
              <div>
                <h2 className="nb-h3">Aturan Kontrol Akses E-Book</h2>
                <p className="nb-body-sm">
                  Akses baca e-book pada halaman ini hanya diberikan untuk
                  pesanan yang pembayarannya telah terverifikasi (`Lunas`).
                  Transaksi yang masih menunggu pembayaran (`Pending`), gagal
                  (`Failed`), atau kedaluwarsa (`Expired`) tidak ditampilkan
                  sebagai buku yang dapat diakses.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <Button
                variant={viewMode === 'normal' ? 'primary' : 'secondary'}
                onClick={() => setViewMode('normal')}
              >
                Pustaka Terisi ({libraryItems.length})
              </Button>
              <Button
                variant={viewMode === 'empty' ? 'primary' : 'secondary'}
                onClick={() => setViewMode('empty')}
              >
                Uji Pustaka Kosong
              </Button>
              <Button
                variant={viewMode === 'loading' ? 'primary' : 'secondary'}
                onClick={() => setViewMode('loading')}
              >
                Uji Loading
              </Button>
              <Button
                variant={viewMode === 'error' ? 'destructive' : 'secondary'}
                onClick={() => setViewMode('error')}
              >
                Uji Error
              </Button>
            </div>
          </div>
        </Card>

        {viewMode === 'loading' && (
          <Spinner label="Memverifikasi hak akses pustaka digital pelanggan..." />
        )}

        {viewMode === 'error' && (
          <EmptyState
            tone="pink"
            title="Gagal Memuat Pustaka Digital"
            description="Terjadi kendala saat memeriksa daftar hak akses e-book Anda pada mode uji error ini."
            actionLabel="Pulihkan Tampilan Pustaka"
            onAction={() => setViewMode('normal')}
          />
        )}

        {(viewMode === 'normal' || viewMode === 'empty') && (
          <>
            {displayedBooks.length === 0 ? (
              <EmptyState
                title="Pustaka digital Anda menunggu buku pertamanya."
                description="Anda belum memiliki e-book dengan pembayaran terverifikasi pada tampilan ini. Telusuri katalog untuk memilih buku digital pertama Anda."
                actionLabel="Jelajahi E-Book di Katalog"
                onAction={() => navigate(ROUTES.CATALOG)}
              />
            ) : (
              <div className="nb-grid-cards">
                {displayedBooks.map((item) => (
                  <PurchasedBookCard
                    key={item.id}
                    item={item}
                    onOpenReader={setActiveReaderItem}
                  />
                ))}
              </div>
            )}

            {nonVerifiedOrders.length > 0 && (
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
                  {nonVerifiedOrders.map((order) => (
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
            )}
          </>
        )}
      </div>

      <Modal
        isOpen={activeReaderItem !== null}
        onClose={() => setActiveReaderItem(null)}
        title={
          activeReaderItem
            ? `Pembaca E-Book: ${activeReaderItem.title}`
            : 'Pembaca E-Book'
        }
        footer={
          <Button variant="primary" onClick={() => setActiveReaderItem(null)}>
            Tutup Pratinjau Baca
          </Button>
        }
      >
        {activeReaderItem && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <SimulationBadge />
              <AccessStatusBadge status={activeReaderItem.accessStatus} />
            </div>

            <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
              Pada implementasi produksi, komponen ini meminta signed URL
              berjangka waktu singkat dari endpoint backend setelah memvalidasi
              entitas EbookAccess milik pelanggan.
            </p>

            <div
              style={{
                backgroundColor: 'var(--nb-paper)',
                border: 'var(--nb-border)',
                padding: 'var(--nb-space-5)',
              }}
            >
              <p className="nb-mono" style={{ fontSize: '0.75rem', marginBottom: '8px' }}>
                CUPLIKAN ISI BUKU CONTOH ({activeReaderItem.orderNumber})
              </p>
              <p className="nb-body">{activeReaderItem.previewExcerpt}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
