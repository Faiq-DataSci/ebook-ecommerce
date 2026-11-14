import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: 'var(--nb-space-6)' }}>
      <ol
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 'var(--nb-space-2)',
          listStyle: 'none',
          padding: 'var(--nb-space-3) var(--nb-space-4)',
          backgroundColor: 'var(--nb-white)',
          border: 'var(--nb-border-thin)',
          boxShadow: 'var(--nb-shadow-sm)',
        }}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={`${item.label}-${index}`}
              className="nb-body-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  style={{
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                    fontWeight: 600,
                  }}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  style={{ fontWeight: 700 }}
                >
                  {item.label}
                </span>
              )}
              {!isLast && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
