import { ShieldAlert } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';

export type LibraryViewMode = 'normal' | 'empty' | 'loading' | 'error';

interface LibraryAccessRulesCardProps {
  viewMode: LibraryViewMode;
  onViewModeChange: (mode: LibraryViewMode) => void;
  libraryCount: number;
}

export function LibraryAccessRulesCard({
  viewMode,
  onViewModeChange,
  libraryCount,
}: LibraryAccessRulesCardProps) {
  return (
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
            onClick={() => onViewModeChange('normal')}
          >
            Pustaka Terisi ({libraryCount})
          </Button>
          <Button
            variant={viewMode === 'empty' ? 'primary' : 'secondary'}
            onClick={() => onViewModeChange('empty')}
          >
            Uji Pustaka Kosong
          </Button>
          <Button
            variant={viewMode === 'loading' ? 'primary' : 'secondary'}
            onClick={() => onViewModeChange('loading')}
          >
            Uji Loading
          </Button>
          <Button
            variant={viewMode === 'error' ? 'destructive' : 'secondary'}
            onClick={() => onViewModeChange('error')}
          >
            Uji Error
          </Button>
        </div>
      </div>
    </Card>
  );
}
