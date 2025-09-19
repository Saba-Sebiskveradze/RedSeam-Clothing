import { useState, useEffect, useMemo } from 'react';
import { fetchAllProducts } from '../api/products';
import type { Product } from '../types';

interface FilterCriteria {
  minPrice: string;
  maxPrice: string;
}

export type SortOption = 'newest' | 'price-low-high' | 'price-high-low';

interface UseProductFilterReturn {
  products: Product[];
  filteredProducts: Product[];
  loading: boolean;
  error: string | null;
  appliedFilters: FilterCriteria;
  currentSort: SortOption;
  applyFilters: (filters: FilterCriteria) => void;
  applySorting: (sortOption: SortOption) => void;
}

export const useProductFilter = (): UseProductFilterReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<FilterCriteria>({
    minPrice: '',
    maxPrice: ''
  });
  const [currentSort, setCurrentSort] = useState<SortOption>('newest');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchAllProducts();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Apply price filters
    if (appliedFilters.minPrice || appliedFilters.maxPrice) {
      filtered = products.filter((product) => {
        const minPrice = appliedFilters.minPrice ? parseFloat(appliedFilters.minPrice) : 0;
        const maxPrice = appliedFilters.maxPrice ? parseFloat(appliedFilters.maxPrice) : Infinity;
        
        return product.price >= minPrice && product.price <= maxPrice;
      });
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (currentSort) {
        case 'newest':
          // Sort by release_year in descending order (newest first)
          return parseInt(b.release_year) - parseInt(a.release_year);
        case 'price-low-high':
          return a.price - b.price;
        case 'price-high-low':
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return sorted;
  }, [products, appliedFilters, currentSort]);

  const applyFilters = (filters: FilterCriteria) => {
    setAppliedFilters(filters);
  };

  const applySorting = (sortOption: SortOption) => {
    setCurrentSort(sortOption);
  };

  return {
    products,
    filteredProducts,
    loading,
    error,
    appliedFilters,
    currentSort,
    applyFilters,
    applySorting
  };
};