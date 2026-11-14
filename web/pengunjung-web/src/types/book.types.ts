export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  accentColor: 'yellow' | 'blue' | 'orange' | 'green' | 'pink' | 'white';
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
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'alphabetical';

export interface CatalogFilterState {
  search: string;
  categoryId: string;
  author: string;
  minPrice: string;
  maxPrice: string;
  sortBy: CatalogSortOption;
  page: number;
}
