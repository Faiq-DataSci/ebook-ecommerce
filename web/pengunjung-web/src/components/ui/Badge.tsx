import type { ReactNode } from 'react';
import {
  AlertTriangle,
  CheckSquare,
  Clock,
  Info,
  Lock,
  XSquare,
} from 'lucide-react';
import type { PaymentStatus } from '../../types/payment.types';
import type { AccessStatus, OrderStatus } from '../../types/order.types';
import { APP_CONFIG } from '../../constants/app.constants';

export type BadgeTone =
  | 'yellow'
  | 'green'
  | 'orange'
  | 'blue'
  | 'pink'
  | 'muted'
  | 'white';

interface BadgeProps {
  tone?: BadgeTone;
  icon?: ReactNode;
  children: ReactNode;
}

const toneBackground: Record<BadgeTone, string> = {
  yellow: 'var(--nb-yellow)',
  green: 'var(--nb-green)',
  orange: 'var(--nb-orange)',
  blue: 'var(--nb-blue)',
  pink: 'var(--nb-pink)',
  muted: 'var(--nb-muted)',
  white: 'var(--nb-white)',
};

export function Badge({ tone = 'white', icon, children }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        backgroundColor: toneBackground[tone],
        color: 'var(--nb-black)',
        border: 'var(--nb-border-thin)',
        boxShadow: 'var(--nb-shadow-sm)',
        fontFamily: 'var(--nb-font-heading)',
        fontWeight: 700,
        fontSize: '0.75rem',
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
      }}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
}

export function SimulationBadge() {
  return (
    <Badge
      tone="orange"
      icon={<AlertTriangle size={14} strokeWidth={2.25} aria-hidden="true" />}
    >
      {APP_CONFIG.SIMULATION_LABEL}
    </Badge>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  switch (status) {
    case 'paid':
      return (
        <Badge
          tone="green"
          icon={<CheckSquare size={14} strokeWidth={2.25} aria-hidden="true" />}
        >
          Pembayaran Lunas (Terverifikasi)
        </Badge>
      );
    case 'pending':
      return (
        <Badge
          tone="orange"
          icon={<Clock size={14} strokeWidth={2.25} aria-hidden="true" />}
        >
          Menunggu Pembayaran
        </Badge>
      );
    case 'failed':
      return (
        <Badge
          tone="pink"
          icon={<XSquare size={14} strokeWidth={2.25} aria-hidden="true" />}
        >
          Pembayaran Gagal
        </Badge>
      );
    case 'expired':
      return (
        <Badge
          tone="pink"
          icon={<XSquare size={14} strokeWidth={2.25} aria-hidden="true" />}
        >
          Pesanan Kedaluwarsa
        </Badge>
      );
  }
}

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  switch (status) {
    case 'completed':
      return (
        <Badge
          tone="green"
          icon={<CheckSquare size={14} strokeWidth={2.25} aria-hidden="true" />}
        >
          Selesai
        </Badge>
      );
    case 'processing':
      return (
        <Badge
          tone="blue"
          icon={<Info size={14} strokeWidth={2.25} aria-hidden="true" />}
        >
          Diproses
        </Badge>
      );
    case 'pending':
      return (
        <Badge
          tone="orange"
          icon={<Clock size={14} strokeWidth={2.25} aria-hidden="true" />}
        >
          Menunggu Verifikasi
        </Badge>
      );
    case 'cancelled':
      return (
        <Badge
          tone="muted"
          icon={<XSquare size={14} strokeWidth={2.25} aria-hidden="true" />}
        >
          Dibatalkan / Berakhir
        </Badge>
      );
  }
}

export function AccessStatusBadge({ status }: { status: AccessStatus }) {
  switch (status) {
    case 'granted':
      return (
        <Badge
          tone="green"
          icon={<CheckSquare size={14} strokeWidth={2.25} aria-hidden="true" />}
        >
          Akses Aktif
        </Badge>
      );
    case 'locked':
      return (
        <Badge
          tone="orange"
          icon={<Lock size={14} strokeWidth={2.25} aria-hidden="true" />}
        >
          Terkunci (Menunggu Verifikasi)
        </Badge>
      );
    case 'revoked':
      return (
        <Badge
          tone="pink"
          icon={<XSquare size={14} strokeWidth={2.25} aria-hidden="true" />}
        >
          Akses Tidak Berlaku
        </Badge>
      );
  }
}
