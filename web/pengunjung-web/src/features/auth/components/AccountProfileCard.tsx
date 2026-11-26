import { Calendar, Mail, ShieldCheck, UserCheck } from 'lucide-react';
import type { CustomerProfile } from '../../../types/user.types';
import { formatDate } from '../../../utils/formatDate';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';

interface AccountProfileCardProps {
  customer: CustomerProfile | null;
  apiHealth: { mode: string };
}

export function AccountProfileCard({
  customer,
  apiHealth,
}: AccountProfileCardProps) {
  return (
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
  );
}
