import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import type { Category } from '../../types/book.types';
import { ROUTES } from '../../constants/routes';
import { SimulationBadge } from '../ui/Badge';

interface CategoryCardProps {
  category: Category;
}

const accentBgMap: Record<Category['accentColor'], string> = {
  yellow: 'var(--nb-yellow)',
  blue: 'var(--nb-blue)',
  orange: 'var(--nb-orange)',
  green: 'var(--nb-green)',
  pink: 'var(--nb-pink)',
  white: 'var(--nb-white)',
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`${ROUTES.CATALOG}?category=${encodeURIComponent(category.id)}`}
      className="nb-pressable"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 'var(--nb-space-4)',
        padding: 'var(--nb-space-5)',
        backgroundColor: accentBgMap[category.accentColor],
        minHeight: '190px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 'var(--nb-space-2)',
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '44px',
            height: '44px',
            backgroundColor: 'var(--nb-white)',
            border: 'var(--nb-border-thin)',
            boxShadow: 'var(--nb-shadow-sm)',
          }}
        >
          <BookOpen size={22} strokeWidth={2.25} aria-hidden="true" />
        </span>
        {category.isSimulation && <SimulationBadge />}
      </div>

      <div>
        <h3 className="nb-h3" style={{ marginBottom: '6px' }}>
          {category.name}
        </h3>
        <p className="nb-body-sm">{category.description}</p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: 'var(--nb-border-thin)',
          paddingTop: 'var(--nb-space-3)',
        }}
      >
        <span className="nb-mono" style={{ fontSize: '0.8125rem' }}>
          {category.bookCount} Judul Contoh
        </span>
        <span className="nb-label" style={{ textDecoration: 'underline' }}>
          Buka Kategori
        </span>
      </div>
    </Link>
  );
}
