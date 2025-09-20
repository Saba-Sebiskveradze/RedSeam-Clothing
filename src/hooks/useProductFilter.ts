import { useState, useEffect, useCallback } from 'react';
import { fetchProducts } from '../api/products';
import type { Product, ProductsApiResponse, SortOption as ApiSortOption } from '../types';

interface FilterCriteria {
  minPrice: string;
  maxPrice: string;
}

export type SortOption = 'newest' | 'price-low-high' | 'price-high-low' | null;

interface UseProductFilterReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  appliedFilters: FilterCriteria;
  currentSort: SortOption;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  applyFilters: (filters: FilterCriteria) => void;
  applySorting: (sortOption: SortOption) => void;
  goToPage: (page: number) => void;
  meta: ProductsApiResponse['meta'] | null;
}

const mapSortOption = (sortOption: SortOption): ApiSortOption | undefined => {
  if (sortOption === null) return undefined;
  
  switch (sortOption) {
    case 'newest':
      return '-created_at'; 
    case 'price-low-high':
      return 'price'; 
    case 'price-high-low':
      return '-price'; 
    default:
      return undefined;
  }
};

export const useProductFilter = (): UseProductFilterReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<ProductsApiResponse['meta'] | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<FilterCriteria>({
    minPrice: '',
    maxPrice: ''
  });
  const [currentSort, setCurrentSort] = useState<SortOption>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const filters: { price_from?: number; price_to?: number } = {};
      if (appliedFilters.minPrice && !isNaN(parseFloat(appliedFilters.minPrice))) {
        filters.price_from = parseFloat(appliedFilters.minPrice);
      }
      if (appliedFilters.maxPrice && !isNaN(parseFloat(appliedFilters.maxPrice))) {
        filters.price_to = parseFloat(appliedFilters.maxPrice);
      }

      const data = await fetchProducts({
        page: currentPage,
        filter: Object.keys(filters).length > 0 ? filters : undefined,
        sort: mapSortOption(currentSort)
      });

      setProducts(data.data);
      setMeta(data.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      setProducts([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, currentSort, currentPage]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const applyFilters = (filters: FilterCriteria) => {
    setAppliedFilters(filters);
    setCurrentPage(1); 
  };

  const applySorting = (sortOption: SortOption) => {
    setCurrentSort(sortOption);
    setCurrentPage(1); 
  };

  const goToPage = (page: number) => {
    if (meta && page >= 1 && page <= meta.last_page) {
      setCurrentPage(page);
    }
  };

  return {
    products,
    loading,
    error,
    appliedFilters,
    currentSort,
    currentPage,
    totalPages: meta?.last_page || 0,
    totalItems: meta?.total || 0,
    applyFilters,
    applySorting,
    goToPage,
    meta
  };
};