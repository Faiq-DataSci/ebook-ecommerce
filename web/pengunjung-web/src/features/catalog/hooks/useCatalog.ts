import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { APP_CONFIG } from '../../../constants/app.constants';
import { useDebounce } from '../../../hooks/useDebounce';
import { bookService } from '../../../services/book.service';
import type {
  Book,
  CatalogFilterState,
  CatalogSortOption,
  CatalogViewMode,
  Category,
  PricePreset,
} from '../../../types/book.types';

export interface ToastItem {
  id: string;
  message: string;
  tone?: 'yellow' | 'pink' | 'lavender' | 'green';
}

export function useCatalog() {
  const [searchParams] = useSearchParams();
  const urlSearchString = searchParams.toString();

  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [cartCount, setCartCount] = useState<number>(3); // Initial Stitch mockup cart count
  const [viewState, setViewState] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  );
  const [viewMode, setViewModeState] = useState<CatalogViewMode>('grid');
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const [prevUrlSearchString, setPrevUrlSearchString] =
    useState(urlSearchString);
  const [filters, setFilters] = useState<CatalogFilterState>(() => ({
    search: searchParams.get('q') ?? '',
    categoryId: searchParams.get('category') ?? '',
    author: '',
    minPrice: '',
    maxPrice: '',
    pricePreset: 'all',
    minRating: 0,
    selectedFormats: [],
    sortBy: 'saw_desc',
    page: 1,
  }));

  // Toast dispatch helper
  const showToast = useCallback(
    (message: string, tone: ToastItem['tone'] = 'yellow') => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      setToasts((prev) => [...prev, { id, message, tone }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    },
    [],
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync with URL query parameters
  if (urlSearchString !== prevUrlSearchString) {
    setPrevUrlSearchString(urlSearchString);
    setFilters((prev) => ({
      ...prev,
      search: searchParams.get('q') ?? '',
      categoryId: searchParams.get('category') ?? '',
      page: 1,
    }));
  }

  const fetchCatalogData = useCallback(() => {
    setViewState('loading');
    Promise.all([
      bookService.getAllBooks(),
      bookService.getCategories(),
      bookService.getAuthors(),
    ])
      .then(([allBooks, allCategories, allAuthors]) => {
        setBooks(allBooks);
        setCategories(allCategories);
        setAuthors(allAuthors);
        setViewState('ready');
      })
      .catch(() => {
        setViewState('error');
      });
  }, []);

  useEffect(() => {
    let ignore = false;
    Promise.all([
      bookService.getAllBooks(),
      bookService.getCategories(),
      bookService.getAuthors(),
    ])
      .then(([allBooks, allCategories, allAuthors]) => {
        if (!ignore) {
          setBooks(allBooks);
          setCategories(allCategories);
          setAuthors(allAuthors);
          setViewState('ready');
        }
      })
      .catch(() => {
        if (!ignore) {
          setViewState('error');
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  // Compute category counts dynamically from loaded books
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const book of books) {
      counts[book.categoryId] = (counts[book.categoryId] ?? 0) + 1;
    }
    return counts;
  }, [books]);

  const debouncedSearch = useDebounce(filters.search, 200);

  const filteredAndSortedBooks = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    const min = filters.minPrice ? Number(filters.minPrice) : null;
    const max = filters.maxPrice ? Number(filters.maxPrice) : null;

    const matching = books.filter((book) => {
      // Case-insensitive search on title and author
      if (
        query &&
        !book.title.toLowerCase().includes(query) &&
        !book.author.toLowerCase().includes(query)
      ) {
        return false;
      }
      // Category filter (AND logic)
      if (filters.categoryId && book.categoryId !== filters.categoryId) {
        return false;
      }
      // Author filter (AND logic)
      if (filters.author && book.author !== filters.author) {
        return false;
      }
      // Price range filters (AND logic)
      if (min !== null && !Number.isNaN(min) && book.price < min) {
        return false;
      }
      if (max !== null && !Number.isNaN(max) && book.price > max) {
        return false;
      }
      // Rating filter
      if (filters.minRating && (book.rating ?? 0) < filters.minRating) {
        return false;
      }
      // Format filter
      if (
        filters.selectedFormats &&
        filters.selectedFormats.length > 0 &&
        !filters.selectedFormats.some((fmt) => book.formats?.includes(fmt))
      ) {
        return false;
      }
      return true;
    });

    return [...matching].sort((a, b) => {
      switch (filters.sortBy) {
        case 'saw_desc':
          return (b.sawScore?.value ?? 0) - (a.sawScore?.value ?? 0);
        case 'rating_desc':
          return (b.rating ?? 0) - (a.rating ?? 0);
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
    filters.minRating,
    filters.selectedFormats,
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
    setFilters((prev) => {
      const updated = {
        ...prev,
        [key]: value,
        page: key === 'page' ? (value as number) : 1,
      };
      if (key === 'minPrice' || key === 'maxPrice') {
        updated.pricePreset = 'custom';
      }
      return updated;
    });
  };

  const setPricePreset = (preset: PricePreset) => {
    setFilters((prev) => {
      let min = '';
      let max = '';
      if (preset === 'under50') {
        min = '0';
        max = '50000';
      } else if (preset === '50to100') {
        min = '50000';
        max = '100000';
      } else if (preset === 'above100') {
        min = '100000';
        max = '';
      }
      return {
        ...prev,
        minPrice: min,
        maxPrice: max,
        pricePreset: preset,
        page: 1,
      };
    });
  };

  const toggleFormat = (fmt: string) => {
    setFilters((prev) => {
      const current = prev.selectedFormats ?? [];
      const updated = current.includes(fmt)
        ? current.filter((f) => f !== fmt)
        : [...current, fmt];
      return {
        ...prev,
        selectedFormats: updated,
        page: 1,
      };
    });
  };

  const clearSearch = () => {
    setFilters((prev) => ({ ...prev, search: '', page: 1 }));
    showToast('Pencarian kata kunci telah dibersihkan.', 'lavender');
  };

  const clearCategory = () => {
    setFilters((prev) => ({ ...prev, categoryId: '', page: 1 }));
    showToast('Filter kategori telah dihapus.', 'lavender');
  };

  const clearPrice = () => {
    setFilters((prev) => ({
      ...prev,
      minPrice: '',
      maxPrice: '',
      pricePreset: 'all',
      page: 1,
    }));
    showToast('Filter rentang harga telah di-reset.', 'lavender');
  };

  const clearRating = () => {
    setFilters((prev) => ({ ...prev, minRating: 0, page: 1 }));
    showToast('Filter rating telah dibersihkan.', 'lavender');
  };

  const clearAuthor = () => {
    setFilters((prev) => ({ ...prev, author: '', page: 1 }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      categoryId: '',
      author: '',
      minPrice: '',
      maxPrice: '',
      pricePreset: 'all',
      minRating: 0,
      selectedFormats: [],
      sortBy: 'saw_desc',
      page: 1,
    });
    showToast('Seluruh kriteria filter telah di-reset.', 'pink');
  };

  const updateSort = (sortBy: CatalogSortOption) => {
    updateFilter('sortBy', sortBy);
  };

  const setViewMode = (mode: CatalogViewMode) => {
    setViewModeState(mode);
    showToast(
      mode === 'grid' ? 'Beralih ke Tampilan Grid' : 'Beralih ke Tampilan List',
      'yellow',
    );
  };

  const addToCart = (book: Book) => {
    setCartCount((prev) => prev + 1);
    showToast(`Ditambahkan ke troli: "${book.title}"`, 'yellow');
  };

  const hasActiveFilters = Boolean(
    filters.search ||
      filters.categoryId ||
      filters.author ||
      filters.minPrice ||
      filters.maxPrice ||
      (filters.pricePreset && filters.pricePreset !== 'all') ||
      (filters.minRating && filters.minRating > 0) ||
      (filters.selectedFormats && filters.selectedFormats.length > 0),
  );

  return {
    books: paginatedBooks,
    allBooks: books,
    totalCount: books.length,
    filteredCount: filteredAndSortedBooks.length,
    categories,
    categoryCounts,
    authors,
    filters,
    currentPage,
    totalPages,
    viewMode,
    viewState,
    toasts,
    cartCount,
    hasActiveFilters,
    setViewState,
    setViewMode,
    updateFilter,
    setPricePreset,
    toggleFormat,
    clearSearch,
    clearCategory,
    clearPrice,
    clearRating,
    clearAuthor,
    updateSort,
    resetFilters,
    showToast,
    dismissToast,
    addToCart,
    retryFetch: fetchCatalogData,
  };
}
