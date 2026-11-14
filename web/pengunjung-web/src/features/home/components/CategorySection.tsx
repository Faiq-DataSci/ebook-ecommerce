import type { Category } from '../../../types/book.types';
import { CategoryCard } from '../../../components/shared/CategoryCard';
import { SimulationBadge } from '../../../components/ui/Badge';

interface CategorySectionProps {
  categories: Category[];
}

export function CategorySection({ categories }: CategorySectionProps) {
  return (
    <section
      id="kategori-buku"
      className="nb-section"
      style={{ backgroundColor: 'var(--nb-paper)' }}
    >
      <div className="nb-container">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 'var(--nb-space-4)',
            marginBottom: 'var(--nb-space-8)',
          }}
        >
          <div>
            <div style={{ marginBottom: '8px' }}>
              <SimulationBadge />
            </div>
            <h2 className="nb-h1">Kategori E-Book</h2>
            <p className="nb-body" style={{ color: 'var(--nb-text-muted)' }}>
              Pilih bidang bahasan untuk menyaring daftar e-book di katalog toko.
            </p>
          </div>
        </div>

        <div className="nb-grid-cards">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
