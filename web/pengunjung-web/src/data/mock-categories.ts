import type { Category } from '../types/book.types';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-technology',
    name: 'Teknologi',
    slug: 'teknologi',
    description:
      'Rekayasa perangkat lunak, arsitektur sistem terdistribusi, dan backend modern.',
    accentColor: 'blue',
    bookCount: 342,
    isSimulation: true,
  },
  {
    id: 'cat-ai',
    name: 'AI & Data',
    slug: 'ai-data',
    description:
      'Kecerdasan buatan, machine learning, deep learning, dan pemodelan data.',
    accentColor: 'lavender',
    bookCount: 284,
    isSimulation: true,
  },
  {
    id: 'cat-design',
    name: 'Desain',
    slug: 'desain',
    description:
      'Desain antarmuka, sistem desain token, interaksi, dan riset pengalaman pengguna.',
    accentColor: 'yellow',
    bookCount: 195,
    isSimulation: true,
  },
  {
    id: 'cat-business',
    name: 'Bisnis',
    slug: 'bisnis',
    description:
      'Manajemen keuangan, bootstrapping startup, strategi produk, dan model bisnis digital.',
    accentColor: 'green',
    bookCount: 210,
    isSimulation: true,
  },
  {
    id: 'cat-devops',
    name: 'DevOps',
    slug: 'devops',
    description:
      'Kubernetes, otomatisasi CI/CD, cloud computing, dan keamanan siber esensial.',
    accentColor: 'pink',
    bookCount: 178,
    isSimulation: true,
  },
  {
    id: 'cat-fiction',
    name: 'Novel',
    slug: 'novel',
    description:
      'Karya fiksi spekulatif, novel kontemporer, dan antologi sastra terkurasi.',
    accentColor: 'white',
    bookCount: 119,
    isSimulation: true,
  },
  {
    id: 'cat-education',
    name: 'Pendidikan',
    slug: 'pendidikan',
    description:
      'Metodologi penelitian, kurikulum pendidikan tinggi, dan literasi ilmiah.',
    accentColor: 'orange',
    bookCount: 100,
    isSimulation: true,
  },
];
