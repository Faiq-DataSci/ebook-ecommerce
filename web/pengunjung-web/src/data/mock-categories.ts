import type { Category } from '../types/book.types';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-technology',
    name: 'Teknologi',
    slug: 'teknologi',
    description:
      'Rekayasa perangkat lunak, arsitektur sistem terdistribusi, dan keamanan jaringan.',
    accentColor: 'blue',
    bookCount: 2,
    isSimulation: true,
  },
  {
    id: 'cat-education',
    name: 'Pendidikan',
    slug: 'pendidikan',
    description:
      'Metodologi riset akademik, pedagogi digital, dan kurikulum pembelajaran.',
    accentColor: 'yellow',
    bookCount: 2,
    isSimulation: true,
  },
  {
    id: 'cat-business',
    name: 'Bisnis',
    slug: 'bisnis',
    description:
      'Manajemen operasional, strategi produk B2C, dan tata kelola keuangan.',
    accentColor: 'orange',
    bookCount: 2,
    isSimulation: true,
  },
  {
    id: 'cat-science',
    name: 'Sains',
    slug: 'sains',
    description:
      'Eksplorasi fisika komputasi, ekologi tropis, dan matematika terapan.',
    accentColor: 'green',
    bookCount: 1,
    isSimulation: true,
  },
  {
    id: 'cat-self-dev',
    name: 'Pengembangan Diri',
    slug: 'pengembangan-diri',
    description:
      'Manajemen fokus kerja, komunikasi tertulis, dan kebiasaan berpikir kritis.',
    accentColor: 'pink',
    bookCount: 1,
    isSimulation: true,
  },
  {
    id: 'cat-fiction',
    name: 'Fiksi & Novel',
    slug: 'fiksi-novel',
    description:
      'Karya sastra kontemporer, spekulatif masa depan, dan antologi cerita pendek.',
    accentColor: 'white',
    bookCount: 1,
    isSimulation: true,
  },
];
