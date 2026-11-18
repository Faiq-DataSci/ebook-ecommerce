import { Link } from 'react-router-dom';
import {
  Terminal,
  Sparkles,
  Palette,
  TrendingUp,
  Server,
  BookOpen,
  GraduationCap,
  FolderGit2,
} from 'lucide-react';
import type { Category } from '../../types/book.types';
import { ROUTES } from '../../constants/routes';
import { SimulationBadge } from '../ui/Badge';

interface CategoryCardProps {
  category: Category;
  index?: number;
}

const accentBgMap: Record<Category['accentColor'], string> = {
  yellow: 'var(--nb-yellow)',
  blue: 'var(--nb-blue)',
  orange: 'var(--nb-orange)',
  green: 'var(--nb-green)',
  pink: 'var(--nb-pink)',
  white: 'var(--nb-white)',
  lavender: 'var(--nb-lavender)',
};

function getCategoryIcon(slug: string, id: string) {
  const key = `${slug} ${id}`.toLowerCase();
  if (key.includes('tech') || key.includes('teknologi')) {
    return <Terminal size={22} strokeWidth={2.25} aria-hidden="true" />;
  }
  if (key.includes('ai') || key.includes('data') || key.includes('kecerdasan')) {
    return <Sparkles size={22} strokeWidth={2.25} aria-hidden="true" />;
  }
  if (key.includes('design') || key.includes('desain')) {
    return <Palette size={22} strokeWidth={2.25} aria-hidden="true" />;
  }
  if (key.includes('bisnis') || key.includes('business')) {
    return <TrendingUp size={22} strokeWidth={2.25} aria-hidden="true" />;
  }
  if (key.includes('devops') || key.includes('cloud') || key.includes('infra')) {
    return <Server size={22} strokeWidth={2.25} aria-hidden="true" />;
  }
  if (key.includes('novel') || key.includes('fiksi') || key.includes('sastra')) {
    return <BookOpen size={22} strokeWidth={2.25} aria-hidden="true" />;
  }
  if (key.includes('pendidikan') || key.includes('education')) {
    return <GraduationCap size={22} strokeWidth={2.25} aria-hidden="true" />;
  }
  return <FolderGit2 size={22} strokeWidth={2.25} aria-hidden="true" />;
}

export function CategoryCard({ category, index }: CategoryCardProps) {
  const bgColor = accentBgMap[category.accentColor] ?? 'var(--nb-white)';
  const indexCode = index !== undefined ? `#CAT-0${index + 1}` : undefined;

  return (
    <Link
      to={`${ROUTES.CATALOG}?category=${encodeURIComponent(category.id)}`}
      className="nb-pressable ebook-card nb-category-card"
      style={{
        backgroundColor: bgColor,
      }}
    >
      {/* Top Meta: Icon Box & Index/Simulation Badges */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 'var(--nb-space-2)',
          marginBottom: 'var(--nb-space-4)',
        }}
      >
        <div className="nb-category-icon-box">
          {getCategoryIcon(category.slug, category.id)}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {indexCode && <span className="nb-category-tag-index">{indexCode}</span>}
          {category.isSimulation && <SimulationBadge />}
        </div>
      </div>

      {/* Content: Title & Description */}
      <div style={{ marginBottom: 'var(--nb-space-4)' }}>
        <h3
          className="nb-h3"
          style={{
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            marginBottom: '6px',
            color: 'var(--nb-black)',
          }}
        >
          {category.name}
        </h3>
        <p
          className="nb-body-sm"
          style={{
            color: 'var(--nb-black)',
            opacity: 0.88,
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {category.description}
        </p>
      </div>

      {/* Bottom Bar: Book Count Pill & Action Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: 'var(--nb-border-thin)',
          paddingTop: 'var(--nb-space-3)',
          marginTop: 'auto',
        }}
      >
        <span className="nb-category-pill">
          <span>{category.bookCount}</span>
          <span style={{ fontWeight: 400, opacity: 0.8 }}>Judul</span>
        </span>

        <span
          style={{
            fontFamily: 'var(--nb-font-heading)',
            fontWeight: 700,
            fontSize: '0.8125rem',
            textTransform: 'uppercase',
            color: 'var(--nb-black)',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }}
        >
          Jelajahi
        </span>
      </div>
    </Link>
  );
}
