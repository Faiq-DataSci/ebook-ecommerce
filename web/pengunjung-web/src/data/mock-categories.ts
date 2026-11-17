import type { Category } from '../types/book.types';

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-technology',
    name: 'Rekayasa Software & Backend',
    slug: 'software-backend',
    description:
      'Rekayasa perangkat lunak, arsitektur sistem terdistribusi, dan backend modern.',
    accentColor: 'blue',
    bookCount: 342,
    isSimulation: true,
  },
  {
    id: 'cat-ai',
    name: 'Sains Data & AI',
    slug: 'data-science-ai',
    description:
      'Kecerdasan buatan, machine learning, deep learning, dan pemodelan data.',
    accentColor: 'lavender' as unknown as Category['accentColor'],
    bookCount: 284,
    isSimulation: true,
  },
  {
    id: 'cat-design',
    name: 'Desain UI/UX & Produk',
    slug: 'ui-ux-design',
    description:
      'Desain antarmuka, sistem desain token, interaksi, dan riset pengalaman pengguna.',
    accentColor: 'yellow',
    bookCount: 195,
    isSimulation: true,
  },
  {
    id: 'cat-business',
    name: 'Bisnis, Startup & Keuangan',
    slug: 'business-startup',
    description:
      'Manajemen keuangan, bootstrapping startup, strategi produk, dan model bisnis digital.',
    accentColor: 'green',
    bookCount: 210,
    isSimulation: true,
  },
  {
    id: 'cat-devops',
    name: 'DevOps, Cloud & Cyber Sec',
    slug: 'devops-cybersec',
    description:
      'Kubernetes, otomatisasi CI/CD, cloud computing, dan keamanan siber esensial.',
    accentColor: 'pink',
    bookCount: 178,
    isSimulation: true,
  },
  {
    id: 'cat-fiction',
    name: 'Sastra Klasik & Spekulatif',
    slug: 'sastra-spekulatif',
    description:
      'Karya fiksi spekulatif, novel kontemporer, dan antologi sastra terkurasi.',
    accentColor: 'white',
    bookCount: 119,
    isSimulation: true,
  },
  {
    id: 'cat-education',
    name: 'Pendidikan & Riset Terbuka',
    slug: 'pendidikan-riset',
    description:
      'Metodologi penelitian, kurikulum pendidikan tinggi, dan literasi ilmiah.',
    accentColor: 'orange',
    bookCount: 100,
    isSimulation: true,
  },
];
