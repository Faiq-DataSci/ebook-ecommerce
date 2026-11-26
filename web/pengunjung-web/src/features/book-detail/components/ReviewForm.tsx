import { type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import type { Book } from '../../../types/book.types';
import type { CustomerProfile } from '../../../types/user.types';
import { ROUTES } from '../../../constants/routes';
import { RatingStars } from '../../../components/shared/RatingStars';
import { Badge, SimulationBadge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';

interface ReviewFormProps {
  book: Book;
  customer: CustomerProfile | null;
  isAuthenticated: boolean;
  isVerifiedOwner: boolean;
  newRating: number;
  onRatingChange: (star: number) => void;
  newTitle: string;
  onTitleChange: (val: string) => void;
  newComment: string;
  onCommentChange: (val: string) => void;
  formError: string | null;
  isDemoLoading: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  onDemoLogin: () => void;
}

export function ReviewForm({
  book,
  customer,
  isAuthenticated,
  isVerifiedOwner,
  newRating,
  onRatingChange,
  newTitle,
  onTitleChange,
  newComment,
  onCommentChange,
  formError,
  isDemoLoading,
  onSubmit,
  onCancel,
  onDemoLogin,
}: ReviewFormProps) {
  return (
    <Card tone="paper" zone="B" padding="lg">
      {!isAuthenticated ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            <SimulationBadge />
            <Badge tone="orange">Perlu Sesi Pelanggan</Badge>
          </div>
          <h3 className="nb-h3">Masuk Akun untuk Menulis Ulasan Produk</h3>
          <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
            Untuk menjaga kredibilitas penilaian e-book pada perhitungan kriteria SAW,
            ulasan hanya dapat dikirimkan oleh pelanggan yang masuk ke akunnya.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '4px' }}>
            <Link
              to={`${ROUTES.LOGIN}?redirect=${encodeURIComponent(ROUTES.BOOK_DETAIL(book.id))}`}
              className="nb-pressable"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '44px',
                paddingInline: '16px',
                backgroundColor: 'var(--nb-yellow)',
                fontFamily: 'var(--nb-font-heading)',
                fontWeight: 700,
              }}
            >
              Masuk Akun Pelanggan
            </Link>
            <Button
              type="button"
              variant="blue"
              isLoading={isDemoLoading}
              leftIcon={<Sparkles size={16} strokeWidth={2.25} />}
              onClick={onDemoLogin}
            >
              Masuk Cepat Akun Contoh (1-Klik)
            </Button>
          </div>
        </div>
      ) : (
        <form
          noValidate
          onSubmit={onSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--nb-space-4)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 className="nb-h3">Kirim Ulasan untuk "{book.title}"</h3>
              <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
                Mengirim sebagai <strong>{customer?.fullName}</strong>{' '}
                {isVerifiedOwner ? '(Pemilik Terverifikasi Lunas)' : '(Mode Simulasi Pelanggan)'}
              </p>
            </div>
            <SimulationBadge />
          </div>

          {formError && (
            <div
              role="alert"
              style={{
                backgroundColor: 'var(--nb-pink)',
                border: '2px solid var(--nb-black)',
                padding: '10px 14px',
              }}
            >
              <p className="nb-body-sm" style={{ fontWeight: 700 }}>
                {formError}
              </p>
            </div>
          )}

          <div>
            <span className="nb-label" style={{ display: 'block', marginBottom: '8px' }}>
              Pilih Rating Kepuasan (1 – 5 Kotak Bintang):
            </span>
            <RatingStars
              size="lg"
              interactiveValue={newRating}
              onSelectRating={onRatingChange}
            />
          </div>

          <Input
            label="Judul Ringkas Ulasan"
            type="text"
            value={newTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="Contoh: Pembahasan arsitektur sistem sangat jelas dan terstruktur"
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label htmlFor="review-comment-textarea" className="nb-label">
              Isi Ulasan Lengkap
            </label>
            <textarea
              id="review-comment-textarea"
              rows={4}
              value={newComment}
              onChange={(e) => onCommentChange(e.target.value)}
              placeholder="Bagikan pengalaman Anda membaca materi, kualitas pembahasan, atau manfaat e-book ini..."
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'var(--nb-white)',
                border: 'var(--nb-border)',
                borderRadius: 0,
                boxShadow: 'var(--nb-shadow-sm)',
                fontFamily: 'var(--nb-font-body)',
                fontSize: '0.9375rem',
                lineHeight: 1.5,
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-end' }}>
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary">
              Simpan Ulasan (DATA SIMULASI)
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
