import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { APP_CONFIG } from '../../../constants/app.constants';
import { useDebounce } from '../../../hooks/useDebounce';
import { bookService } from '../../../services/book.service';
import type {
  Book,
  CatalogFilterState,
  CatalogSortOption,
  Category,
} from '../../../types/book.types';

export function useCatalog() {
  const [searchParams] = useSearchParams();
  const urlSearchString = searchParams.toString();

  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [viewState, setViewState] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  );

  const [prevUrlSearchString, setPrevUrlSearchString] =
    useState(urlSearchString);
  const [filters, setFilters] = useState<CatalogFilterState>(() => ({
    search: searchParams.get('q') ?? '',
    categoryId: searchParams.get('category') ?? '',
    author: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
    page: 1,
  }));

  if (urlSearchString !== prevUrlSearchString) {
    setPrevUrlSearchString(urlSearchString);
    setFilters((prev) => ({
      ...prev,
      search: searchParams.get('q') ?? '',
      categoryId: searchParams.get('category') ?? '',
      page: 1,
    }));
  }

  useEffect(() => {
    let active = true;
    Promise.all([
      bookService.getAllBooks(),
      bookService.getCategories(),
      bookService.getAuthors(),
    ])
      .then(([allBooks, allCategories, allAuthors]) => {
        if (!active) return;
        setBooks(allBooks);
        setCategories(allCategories);
        setAuthors(allAuthors);
        setViewState('ready');
      })
      .catch(() => {
        if (active) setViewState('error');
      });

    return () => {
      active = false;
    };
  }, []);

  const debouncedSearch = useDebounce(filters.search, 200);

  const filteredAndSortedBooks = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    const min = filters.minPrice ? Number(filters.minPrice) : null;
    const max = filters.maxPrice ? Number(filters.maxPrice) : null;

    const matching = books.filter((book) => {
      if (
        query &&
        !book.title.toLowerCase().includes(query) &&
        !book.author.toLowerCase().includes(query)
      ) {
        return false;
      }
      if (filters.categoryId && book.categoryId !== filters.categoryId) {
        return false;
      }
      if (filters.author && book.author !== filters.author) {
        return false;
      }
      if (min !== null && !Number.isNaN(min) && book.price < min) {
        return false;
      }
      if (max !== null && !Number.isNaN(max) && book.price > max) {
        return false;
      }
      return true;
    });

    return [...matching].sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'alphabetical':
          return a.title.localeCompare(b.title, 'id');
      }
    });
  }, [
    books,
    debouncedSearch,
    filters.categoryId,
    filters.author,
    filters.minPrice,
    filters.maxPrice,
    filters.sortBy,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedBooks.length / APP_CONFIG.CATALOG_PAGE_SIZE),
  );

  const currentPage = Math.min(filters.page, totalPages);

  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * APP_CONFIG.CATALOG_PAGE_SIZE;
    return filteredAndSortedBooks.slice(
      startIndex,
      startIndex + APP_CONFIG.CATALOG_PAGE_SIZE,
    );
  }, [filteredAndSortedBooks, currentPage]);

  const updateFilter = <K extends keyof CatalogFilterState>(
    key: K,
    value: CatalogFilterState[K],
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? (value as number) : 1,
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      categoryId: '',
      author: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
      page: 1,
    });
  };

  const updateSort = (sortBy: CatalogSortOption) => {
    updateFilter('sortBy', sortBy);
  };

  return {
    books: paginatedBooks,
    totalCount: books.length,
    filteredCount: filteredAndSortedBooks.length,
    categories,
    authors,
    filters,
    currentPage,
    totalPages,
    viewState,
    setViewState,
    updateFilter,
    updateSort,
    resetFilters,
  };
}
