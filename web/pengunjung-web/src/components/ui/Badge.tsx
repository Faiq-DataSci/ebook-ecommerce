import type { ReactNode } from 'react';
import {
  AlertTriangle,
  BookOpen,
  CheckSquare,
  Clock,
  Code2,
  GraduationCap,
  Info,
  Lock,
  Palette,
  Sparkles,
  Terminal,
  TrendingUp,
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
  | 'lavender'
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
  lavender: 'var(--nb-lavender)',
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
        minHeight: '28px',
        padding: '3px 10px',
        backgroundColor: toneBackground[tone],
        color: 'var(--nb-black)',
        border: 'var(--nb-border-thin)',
        boxShadow: 'var(--nb-shadow-sm)',
        fontFamily: 'var(--nb-font-heading)',
        fontWeight: 700,
        fontSize: '0.75rem',
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      {icon && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            lineHeight: 0,
          }}
        >
          {icon}
        </span>
      )}
      <span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 1.2 }}>
        {children}
      </span>
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

export interface CategoryBadgeProps {
  categoryId?: string;
  categoryName: string;
  size?: 'sm' | 'md';
  className?: string;
}

type CategoryIconType =
  | 'code'
  | 'sparkles'
  | 'palette'
  | 'trending-up'
  | 'terminal'
  | 'graduation-cap'
  | 'book-open';

function getCategoryToneAndIconType(
  categoryId?: string,
  categoryName?: string,
): {
  tone: BadgeTone;
  iconType: CategoryIconType;
} {
  const id = (categoryId ?? '').toLowerCase();
  const name = (categoryName ?? '').toLowerCase();

  if (
    id === 'cat-technology' ||
    name.includes('software') ||
    name.includes('backend') ||
    name.includes('teknologi') ||
    name.includes('programming')
  ) {
    return {
      tone: 'blue',
      iconType: 'code',
    };
  }

  if (
    id === 'cat-ai' ||
    name.includes('ai') ||
    name.includes('data') ||
    name.includes('machine learning')
  ) {
    return {
      tone: 'lavender',
      iconType: 'sparkles',
    };
  }

  if (
    id === 'cat-design' ||
    name.includes('desain') ||
    name.includes('ui/ux') ||
    name.includes('produk')
  ) {
    return {
      tone: 'yellow',
      iconType: 'palette',
    };
  }

  if (
    id === 'cat-business' ||
    name.includes('bisnis') ||
    name.includes('startup') ||
    name.includes('keuangan')
  ) {
    return {
      tone: 'green',
      iconType: 'trending-up',
    };
  }

  if (
    id === 'cat-devops' ||
    name.includes('devops') ||
    name.includes('cloud') ||
    name.includes('cyber') ||
    name.includes('security')
  ) {
    return {
      tone: 'pink',
      iconType: 'terminal',
    };
  }

  if (
    id === 'cat-education' ||
    name.includes('pendidikan') ||
    name.includes('riset')
  ) {
    return {
      tone: 'orange',
      iconType: 'graduation-cap',
    };
  }

  return {
    tone: 'white',
    iconType: 'book-open',
  };
}

function getCleanCategoryName(categoryId?: string, categoryName?: string): string {
  const id = (categoryId ?? '').toLowerCase();
  const name = categoryName ?? '';

  if (
    id === 'cat-technology' ||
    name.toLowerCase().includes('software') ||
    name.toLowerCase().includes('computer')
  ) {
    return 'Teknologi';
  }
  if (
    id === 'cat-ai' ||
    name.toLowerCase().includes('ai') ||
    name.toLowerCase().includes('data')
  ) {
    return 'AI & Data';
  }
  if (
    id === 'cat-design' ||
    name.toLowerCase().includes('desain') ||
    name.toLowerCase().includes('ui/ux')
  ) {
    return 'Desain';
  }
  if (
    id === 'cat-business' ||
    name.toLowerCase().includes('bisnis') ||
    name.toLowerCase().includes('startup') ||
    name.toLowerCase().includes('finansial')
  ) {
    return 'Bisnis';
  }
  if (
    id === 'cat-devops' ||
    name.toLowerCase().includes('devops') ||
    name.toLowerCase().includes('cloud') ||
    name.toLowerCase().includes('security') ||
    name.toLowerCase().includes('cyber')
  ) {
    return 'DevOps';
  }
  if (
    id === 'cat-education' ||
    name.toLowerCase().includes('pendidikan')
  ) {
    return 'Pendidikan';
  }
  if (
    id === 'cat-fiction' ||
    name.toLowerCase().includes('fiksi') ||
    name.toLowerCase().includes('novel') ||
    name.toLowerCase().includes('sastra')
  ) {
    return 'Novel';
  }

  return name;
}

export function CategoryBadge({
  categoryId,
  categoryName,
  size = 'sm',
  className,
}: CategoryBadgeProps) {
  const { tone, iconType } = getCategoryToneAndIconType(categoryId, categoryName);
  const displayName = getCleanCategoryName(categoryId, categoryName);

  const icon =
    iconType === 'code' ? (
      <Code2 size={11} strokeWidth={2.5} aria-hidden="true" />
    ) : iconType === 'sparkles' ? (
      <Sparkles size={11} strokeWidth={2.5} aria-hidden="true" />
    ) : iconType === 'palette' ? (
      <Palette size={11} strokeWidth={2.5} aria-hidden="true" />
    ) : iconType === 'trending-up' ? (
      <TrendingUp size={11} strokeWidth={2.5} aria-hidden="true" />
    ) : iconType === 'terminal' ? (
      <Terminal size={11} strokeWidth={2.5} aria-hidden="true" />
    ) : iconType === 'graduation-cap' ? (
      <GraduationCap size={11} strokeWidth={2.5} aria-hidden="true" />
    ) : (
      <BookOpen size={11} strokeWidth={2.5} aria-hidden="true" />
    );

  return (
    <span
      className={`nb-category-badge ${className ?? ''}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: size === 'md' ? '3px 8px' : '2px 7px',
        backgroundColor: toneBackground[tone],
        color: 'var(--nb-black)',
        border: '1.5px solid var(--nb-black)',
        boxShadow: '1.5px 1.5px 0 0 var(--nb-black)',
        fontFamily: 'var(--nb-font-heading)',
        fontWeight: 700,
        fontSize: size === 'md' ? '0.6875rem' : '0.625rem',
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
        textTransform: 'uppercase',
        letterSpacing: '0.03em',
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
        {icon}
      </span>
      <span>{displayName}</span>
    </span>
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
