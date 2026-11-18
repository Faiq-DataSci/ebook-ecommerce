import type { Book } from '../../../types/book.types';
import { BookCoverArtwork } from '../../../components/shared/BookCard';
import { CategoryBadge, SimulationBadge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';

interface BookInformationProps {
  book: Book;
}

export function BookInformation({ book }: BookInformationProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--nb-space-6)',
      }}
    >
      <Card tone="white" zone="B" padding="lg">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 'var(--nb-space-6)',
            alignItems: 'start',
          }}
        >
          <div style={{ maxWidth: '300px', width: '100%' }}>
            <BookCoverArtwork
              title={book.title}
              author={book.author}
              categoryId={book.categoryId}
              categoryName={book.categoryName}
              coverCode={book.coverCode}
              accent={book.coverAccent}
              size="lg"
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--nb-space-4)',
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <CategoryBadge
                categoryId={book.categoryId}
                categoryName={book.categoryName}
                size="md"
              />
              {book.isSimulation && <SimulationBadge />}
            </div>

            <h1 className="nb-h1">{book.title}</h1>

            <p className="nb-body-lg" style={{ fontWeight: 600 }}>
              Penulis: {book.author}
            </p>

            <div
              style={{
                borderTop: 'var(--nb-border-thin)',
                paddingTop: 'var(--nb-space-4)',
              }}
            >
              <h2 className="nb-h3" style={{ marginBottom: '8px' }}>
                Tentang Buku Ini
              </h2>
              <p className="nb-body">{book.description}</p>
            </div>
          </div>
        </div>
      </Card>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 'var(--nb-space-5)',
        }}
      >
        <Card tone="paper" zone="B" padding="md">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
              <h2 className="nb-h3">Informasi Produk Digital</h2>
              <SimulationBadge />
            </div>
            <p className="nb-body-sm" style={{ color: 'var(--nb-text-muted)' }}>
              Atribut di bawah ini berasal dari skema konseptual produk (`Ebook`)
              tanpa penambahan nomor ISBN atau nama penerbit fabrikasi.
            </p>
            <dl
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '8px 16px',
                marginTop: '6px',
              }}
            >
              <dt className="nb-label">ID Produk:</dt>
              <dd className="nb-mono">{book.id}</dd>

              <dt className="nb-label">Kategori:</dt>
              <dd className="nb-body-sm">{book.categoryName}</dd>

              <dt className="nb-label">Format Berkas:</dt>
              <dd className="nb-body-sm">
                PDF Digital (Akses via Signed URL setelah pembayaran terverifikasi)
              </dd>

              {book.pageCount && (
                <>
                  <dt className="nb-label">Jumlah Halaman (Contoh):</dt>
                  <dd className="nb-mono">{book.pageCount} halaman</dd>
                </>
              )}

              {book.publishedYear && (
                <>
                  <dt className="nb-label">Tahun Terbit (Contoh):</dt>
                  <dd className="nb-mono">{book.publishedYear}</dd>
                </>
              )}
            </dl>
          </div>
        </Card>

        <Card tone="white" zone="B" padding="md">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
              <h2 className="nb-h3">Informasi Penulis</h2>
              <SimulationBadge />
            </div>
            <p className="nb-label">{book.author}</p>
            <p className="nb-body-sm">
              Profil penulis fiktif untuk demonstrasi etalase kategori{' '}
              {book.categoryName}. Seluruh katalog dikelola secara terpusat oleh
              toko resmi (Single-Store B2C, bukan marketplace multi-penjual).
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
