export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  accentColor: 'yellow' | 'blue' | 'orange' | 'green' | 'pink' | 'white' | 'lavender';
  bookCount: number;
  isSimulation: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  categoryId: string;
  categoryName: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  badge1?: { text: string; bg: string; color?: string };
  badge2?: { text: string; bg: string; color?: string };
  formats?: string[];
  sawScore?: { code: string; value: number; label?: string };
  sawBreakdown?: { c1: number; c2: number; c3: number; c4: number };
  coverImage: string;
  coverAccent: 'yellow' | 'blue' | 'orange' | 'green' | 'pink';
  coverCode: string;
  pageCount?: number;
  publishedYear?: number;
  isFeatured?: boolean;
  createdAt: string;
  isSimulation: boolean;
}

export type CatalogSortOption =
  | 'saw_desc'
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'rating_desc'
  | 'alphabetical';

export type CatalogViewMode = 'grid' | 'list';

export type PricePreset = 'all' | 'under50' | '50to100' | 'above100' | 'custom';

export interface CatalogFilterState {
  search: string;
  categoryId: string;
  author: string;
  minPrice: string;
  maxPrice: string;
  pricePreset?: PricePreset;
  minRating?: number;
  selectedFormats?: string[];
  sortBy: CatalogSortOption;
  page: number;
}

