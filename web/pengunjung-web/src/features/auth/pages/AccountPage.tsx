import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookMarked,
  Calendar,
  Compass,
  LogOut,
  Mail,
  ReceiptText,
  RotateCcw,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import type { Order, PurchasedBookAccess } from '../../../types/order.types';
import { ROUTES } from '../../../constants/routes';
import { orderService } from '../../../services/order.service';
import { formatCurrency } from '../../../utils/formatCurrency';
import { formatDate } from '../../../utils/formatDate';
import { useAuth } from '../hooks/useAuth';
import { EmptyState } from '../../../components/shared/EmptyState';
import { PriceDisplay } from '../../../components/shared/PriceDisplay';
import {
  Badge,
  OrderStatusBadge,
  PaymentStatusBadge,
  SimulationBadge,
} from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';

export function AccountPage() {
  const { customer, logout, apiHealth } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [libraryItems, setLibraryItems] = useState<PurchasedBookAccess[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  );
  const [resetFeedback, setResetFeedback] = useState(false);

  const loadAccountSummary = async () => {
    setStatus('loading');
    try {
      const [customerOrders, authorizedLibrary] = await Promise.all([
        orderService.getCustomerOrders(),
        orderService.getAuthorizedLibrary(),
      ]);
      setOrders(customerOrders);
      setLibraryItems(authorizedLibrary);
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  };

  useEffect(() => {
    let active = true;

    Promise.all([
      orderService.getCustomerOrders(),
      orderService.getAuthorizedLibrary(),
    ])
      .then(([customerOrders, authorizedLibrary]) => {
        if (!active) return;
        setOrders(customerOrders);
        setLibraryItems(authorizedLibrary);
        setStatus('ready');
      })
      .catch(() => {
        if (active) setStatus('error');
      });

    return () => {
      active = false;
    };
  }, []);

  const handleResetSimulationData = async () => {
    orderService.resetSimulatedOrders();
    await loadAccountSummary();
    setResetFeedback(true);
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  if (status === 'loading') {
    return (
      <div className="nb-container nb-section">
        <Spinner label="Memuat informasi akun dan ringkasan aktivitas pelanggan..." />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="nb-container nb-section">
        <EmptyState
          tone="pink"
          title="Gagal Memuat Informasi Akun"
          description="Terjadi kendala saat mengambil ringkasan profil dan transaksi pelanggan."
          actionLabel="Muat Ulang Halaman Akun"
          onAction={loadAccountSummary}
        />
      </div>
    );
  }

  const paidOrders = orders.filter((order) => order.paymentStatus === 'paid');
  const pendingOrders = orders.filter(
    (order) => order.paymentStatus === 'pending',
  );
  const totalSpentVerified = paidOrders.reduce(
    (acc, item) => acc + item.totalAmount,
    0,
  );
  const recentOrders = orders.slice(0, 3);

  return (
    <div className="nb-section" style={{ backgroundColor: 'var(--nb-paper)' }}>
      <div className="nb-container nb-stack-6">
        {/* Header Akun Pelanggan */}
        <Card tone="yellow" zone="B" padding="lg">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--nb-space-4)',
            }}
          >
            <div className="nb-stack-2">
              <div className="nb-cluster">
                <SimulationBadge />
                <Badge tone="white">Peran: {customer?.role ?? 'CUSTOMER'}</Badge>
              </div>
              <h1 className="nb-h1">Akun Pelanggan Saya</h1>
              <p className="nb-body">
                Kelola informasi profil pelanggan, pantau ringkasan hak akses
                pustaka digital, dan periksa transaksi e-book Anda.
              </p>
            </div>

            <div className="nb-cluster">
              <Button
                variant="secondary"
                leftIcon={
                  <BookMarked size={18} strokeWidth={2.25} aria-hidden="true" />
                }
                onClick={() => navigate(ROUTES.LIBRARY)}
              >
                Buka Pustaka Saya
              </Button>
              <Button
                variant="blue"
                leftIcon={
                  <ReceiptText
                    size={18}
                    strokeWidth={2.25}
                    aria-hidden="true"
                  />
                }
                onClick={() => navigate(ROUTES.ORDERS)}
              >
                Riwayat Pembelian
              </Button>
              <Button
                variant="destructive"
                leftIcon={
                  <LogOut size={18} strokeWidth={2.25} aria-hidden="true" />
                }
                onClick={handleLogout}
              >
                Keluar Akun
              </Button>
            </div>
          </div>
        </Card>

        {/* Grid Profil & Ringkasan Metrik */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--nb-space-6)',
          }}
        >
          {/* Kartu Identitas Pelanggan */}
          <Card tone="white" zone="B" padding="lg">
            <div className="nb-stack-4">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  borderBottom: 'var(--nb-border-thin)',
                  paddingBottom: 'var(--nb-space-3)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    aria-hidden="true"
                    style={{
                      width: '44px',
                      height: '44px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'var(--nb-green)',
                      border: 'var(--nb-border-thin)',
                      boxShadow: 'var(--nb-shadow-sm)',
                    }}
                  >
                    <UserCheck size={22} strokeWidth={2.25} />
                  </div>
                  <div>
                    <h2 className="nb-h2">Profil Pelanggan</h2>
                    <p
                      className="nb-body-sm"
                      style={{ color: 'var(--nb-text-muted)' }}
                    >
                      Identitas terdaftar pada toko e-book
                    </p>
                  </div>
                </div>
                <Badge tone="green">Aktif</Badge>
              </div>

              {customer && (
                <div className="nb-stack-3">
                  <div>
                    <span
                      className="nb-label"
                      style={{ color: 'var(--nb-text-muted)' }}
                    >
                      Nama Lengkap
                    </span>
                    <p className="nb-h3" style={{ marginTop: '2px' }}>
                      {customer.fullName}
                    </p>
                  </div>

                  <div>
                    <span
                      className="nb-label"
                      style={{ color: 'var(--nb-text-muted)' }}
                    >
                      Alamat Email
                    </span>
                    <p
                      className="nb-mono"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginTop: '2px',
                      }}
                    >
                      <Mail size={15} strokeWidth={2.25} aria-hidden="true" />
                      <span>{customer.email}</span>
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                      gap: '12px',
                      paddingTop: '8px',
                      borderTop: 'var(--nb-border-thin)',
                    }}
                  >
                    <div>
                      <span
                        className="nb-label"
                        style={{ color: 'var(--nb-text-muted)' }}
                      >
                        ID Pelanggan
                      </span>
                      <p className="nb-mono" style={{ marginTop: '2px' }}>
                        {customer.id}
                      </p>
                    </div>
                    <div>
                      <span
                        className="nb-label"
                        style={{ color: 'var(--nb-text-muted)' }}
                      >
                        Terdaftar Sejak
                      </span>
                      <p
                        className="nb-body-sm"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontWeight: 600,
                          marginTop: '2px',
                        }}
                      >
                        <Calendar
                          size={14}
                          strokeWidth={2.25}
                          aria-hidden="true"
                        />
                        <span>{formatDate(customer.createdAt)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div
                style={{
                  backgroundColor: 'var(--nb-paper)',
                  border: 'var(--nb-border-thin)',
                  padding: 'var(--nb-space-3)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px',
                  }}
                >
                  <ShieldCheck
                    size={16}
                    strokeWidth={2.25}
                    aria-hidden="true"
                  />
                  <span className="nb-label">Status Koneksi Layanan</span>
                </div>
                <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
                  Mode saat ini:{' '}
                  <strong>
                    {apiHealth.mode === 'BACKEND_TERHUBUNG'
                      ? 'Terhubung ke API Backend'
                      : 'Mode Prototipe Mandiri (DATA SIMULASI)'}
                  </strong>
                  . Otorisasi akses e-book dan validasi transaksi pada lingkungan
                  produksi diverifikasi penuh di backend.
                </p>
              </div>
            </div>
          </Card>

          {/* Kartu Ringkasan Hak Akses & Transaksi */}
          <Card tone="white" zone="B" padding="lg">
            <div className="nb-stack-4">
              <div>
                <h2 className="nb-h2">Ringkasan Pustaka & Transaksi</h2>
                <p
                  className="nb-body-sm"
                  style={{ color: 'var(--nb-text-muted)', marginTop: '2px' }}
                >
                  Rekapitulasi kepemilikan buku digital dan pesanan akun Anda
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: 'var(--nb-space-3)',
                }}
              >
                <div
                  style={{
                    backgroundColor: 'var(--nb-green)',
                    border: 'var(--nb-border-thin)',
                    boxShadow: 'var(--nb-shadow-sm)',
                    padding: 'var(--nb-space-3)',
                  }}
                >
                  <span className="nb-label">E-Book Aktif</span>
                  <p className="nb-h1" style={{ marginTop: '4px' }}>
                    {libraryItems.length}
                  </p>
                  <span className="nb-body-sm">Siap dibaca di Pustaka</span>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--nb-blue)',
                    border: 'var(--nb-border-thin)',
                    boxShadow: 'var(--nb-shadow-sm)',
                    padding: 'var(--nb-space-3)',
                  }}
                >
                  <span className="nb-label">Total Pesanan</span>
                  <p className="nb-h1" style={{ marginTop: '4px' }}>
                    {orders.length}
                  </p>
                  <span className="nb-body-sm">Seluruh status transaksi</span>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--nb-orange)',
                    border: 'var(--nb-border-thin)',
                    boxShadow: 'var(--nb-shadow-sm)',
                    padding: 'var(--nb-space-3)',
                  }}
                >
                  <span className="nb-label">Menunggu Bayar</span>
                  <p className="nb-h1" style={{ marginTop: '4px' }}>
                    {pendingOrders.length}
                  </p>
                  <span className="nb-body-sm">Akses masih terkunci</span>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--nb-yellow)',
                    border: 'var(--nb-border-thin)',
                    boxShadow: 'var(--nb-shadow-sm)',
                    padding: 'var(--nb-space-3)',
                  }}
                >
                  <span className="nb-label">Pembelian Lunas</span>
                  <p
                    className="nb-mono"
                    style={{ fontSize: '1.125rem', marginTop: '8px' }}
                  >
                    {formatCurrency(totalSpentVerified)}
                  </p>
                  <span className="nb-body-sm">Terverifikasi lunas</span>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  paddingTop: 'var(--nb-space-2)',
                  borderTop: 'var(--nb-border-thin)',
                }}
              >
                <Button
                  variant="secondary"
                  leftIcon={
                    <RotateCcw
                      size={16}
                      strokeWidth={2.25}
                      aria-hidden="true"
                    />
                  }
                  onClick={handleResetSimulationData}
                >
                  Reset Data Pesanan Simulasi
                </Button>
                <Button
                  variant="primary"
                  leftIcon={
                    <Compass size={16} strokeWidth={2.25} aria-hidden="true" />
                  }
                  onClick={() => navigate(ROUTES.CATALOG)}
                >
                  Cari Buku Baru
                </Button>
              </div>

              {resetFeedback && (
                <div
                  role="status"
                  style={{
                    backgroundColor: 'var(--nb-green)',
                    border: 'var(--nb-border-thin)',
                    padding: '10px 12px',
                  }}
                >
                  <p className="nb-label">
                    Data pesanan simulasi telah dikembalikan ke kondisi awal.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Seksi Pesanan Terbaru Pelanggan */}
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
      </div>
    </div>
  );
}
