import {
  CheckSquare,
  Clock,
  Lock,
  ShieldCheck,
  XSquare,
} from 'lucide-react';
import type { PaymentStatus as PaymentStatusType } from '../../../types/payment.types';
import {
  AccessStatusBadge,
  PaymentStatusBadge,
  SimulationBadge,
} from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';

interface PaymentStatusProps {
  status: PaymentStatusType;
  verificationStatusText: string;
  instructions: string[];
}

export function PaymentStatus({
  status,
  verificationStatusText,
  instructions,
}: PaymentStatusProps) {
  const headerTone =
    status === 'paid'
      ? 'green'
      : status === 'pending'
        ? 'orange'
        : 'pink';

  const statusHeading =
    status === 'paid'
      ? 'Pembayaran Terverifikasi (Lunas)'
      : status === 'pending'
        ? 'Pembayaran Menunggu Verifikasi'
        : status === 'failed'
          ? 'Pembayaran Gagal Diverifikasi'
          : 'Pesanan Kedaluwarsa (Waktu Pembayaran Habis)';

  const statusIcon =
    status === 'paid' ? (
      <CheckSquare size={24} strokeWidth={2.5} aria-hidden="true" />
    ) : status === 'pending' ? (
      <Clock size={24} strokeWidth={2.5} aria-hidden="true" />
    ) : (
      <XSquare size={24} strokeWidth={2.5} aria-hidden="true" />
    );

  return (
    <Card tone="white" zone="C" padding="lg">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--nb-space-4)',
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
          <SimulationBadge />
          <AccessStatusBadge
            status={
              status === 'paid'
                ? 'granted'
                : status === 'pending'
                  ? 'locked'
                  : 'revoked'
            }
          />
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: `var(--nb-${headerTone})`,
            border: 'var(--nb-border-thin)',
            padding: 'var(--nb-space-4)',
          }}
        >
          {statusIcon}
          <div>
            <h2 className="nb-h3">{statusHeading}</h2>
            <p className="nb-body-sm" style={{ fontWeight: 600 }}>
              {verificationStatusText}
            </p>
          </div>
        </div>

        <div>
          <PaymentStatusBadge status={status} />
        </div>

        <div
          style={{
            backgroundColor: 'var(--nb-paper)',
            border: 'var(--nb-border-thin)',
            padding: 'var(--nb-space-4)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px',
            }}
          >
            {status === 'paid' ? (
              <ShieldCheck size={18} strokeWidth={2.25} aria-hidden="true" />
            ) : (
              <Lock size={18} strokeWidth={2.25} aria-hidden="true" />
            )}
            <span className="nb-label">
              Informasi Verifikasi & Petunjuk Status:
            </span>
          </div>

          <ul
            style={{
              paddingLeft: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {instructions.map((line, index) => (
              <li key={index} className="nb-body-sm">
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
