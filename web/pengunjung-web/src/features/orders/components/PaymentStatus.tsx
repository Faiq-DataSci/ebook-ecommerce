import { useState } from 'react';
import {
  Check,
  CheckSquare,
  Clock,
  Copy,
  Lock,
  QrCode,
  RefreshCw,
  ShieldCheck,
  XSquare,
} from 'lucide-react';
import type { QrisPayload } from '../../../types/order.types';
import type { PaymentStatus as PaymentStatusType } from '../../../types/payment.types';
import {
  AccessStatusBadge,
  PaymentStatusBadge,
  SimulationBadge,
} from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

interface PaymentStatusProps {
  status: PaymentStatusType;
  verificationStatusText: string;
  instructions: string[];
  qrPayload?: QrisPayload | null;
  paymentProvider?: string;
  paymentMethod?: string;
  transactionReference?: string;
  isSimulation?: boolean;
  isRefreshing?: boolean;
  onRefreshStatus?: () => void;
}

export function PaymentStatus({
  status,
  verificationStatusText,
  instructions,
  qrPayload,
  paymentProvider,
  paymentMethod,
  transactionReference,
  isSimulation = true,
  isRefreshing = false,
  onRefreshStatus,
}: PaymentStatusProps) {
  const [copied, setCopied] = useState(false);

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

  const qrString = qrPayload?.qrString?.trim() || '';
  const showQrisBox = status === 'pending' && Boolean(qrString);
  const qrImageUrl = qrString
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(qrString)}`
    : '';

  const handleCopyQr = async () => {
    if (!qrString) return;
    try {
      await navigator.clipboard.writeText(qrString);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

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
          {isSimulation ? (
            <SimulationBadge />
          ) : (
            <span
              className="nb-label"
              style={{
                backgroundColor: 'var(--nb-yellow)',
                border: 'var(--nb-border-thin)',
                padding: '4px 10px',
                fontSize: '11px',
              }}
            >
              {(paymentProvider || 'XENDIT').toUpperCase()} •{' '}
              {(paymentMethod || 'QRIS').toUpperCase()}
            </span>
          )}
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

        {showQrisBox && (
          <div
            style={{
              backgroundColor: 'var(--nb-white)',
              border: 'var(--nb-border-default)',
              boxShadow: '3px 3px 0px var(--nb-black)',
              padding: 'var(--nb-space-4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <span
                className="nb-label"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <QrCode size={18} strokeWidth={2.5} aria-hidden="true" />
                QRIS Dinamis ({(paymentProvider || 'Xendit').toUpperCase()})
              </span>
              {qrPayload?.qrId && (
                <span
                  className="nb-body-sm"
                  style={{
                    fontFamily: 'var(--nb-font-mono)',
                    fontSize: '11px',
                    color: 'var(--nb-text-muted)',
                  }}
                >
                  {qrPayload.qrId.slice(0, 14)}...
                </span>
              )}
            </div>

            <div
              style={{
                padding: '10px',
                backgroundColor: '#FFFFFF',
                border: '2px solid var(--nb-black)',
              }}
            >
              <img
                src={qrImageUrl}
                alt="Kode QRIS Pembayaran Xendit"
                width={200}
                height={200}
                style={{ display: 'block' }}
              />
            </div>

            {transactionReference && (
              <div
                className="nb-body-sm"
                style={{
                  fontFamily: 'var(--nb-font-mono)',
                  fontSize: '11.5px',
                  textAlign: 'center',
                  wordBreak: 'break-all',
                }}
              >
                Ref: {transactionReference}
              </div>
            )}

            <div style={{ display: 'flex', gap: '8px', width: '100%', flexWrap: 'wrap' }}>
              <Button
                variant="secondary"
                onClick={handleCopyQr}
                style={{ flex: 1 }}
              >
                {copied ? (
                  <>
                    <Check size={16} aria-hidden="true" />
                    <span>QR Disalin</span>
                  </>
                ) : (
                  <>
                    <Copy size={16} aria-hidden="true" />
                    <span>Salin String QRIS</span>
                  </>
                )}
              </Button>

              {onRefreshStatus && (
                <Button
                  variant="primary"
                  onClick={onRefreshStatus}
                  disabled={isRefreshing}
                  style={{ flex: 1 }}
                >
                  <RefreshCw size={16} aria-hidden="true" />
                  <span>{isRefreshing ? 'Memeriksa...' : 'Cek Status'}</span>
                </Button>
              )}
            </div>
          </div>
        )}

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
