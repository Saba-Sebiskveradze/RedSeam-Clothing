import type { ProductSearchParams } from '../types';

/**
 * Builds a query string from ProductSearchParams object
 * @param params - The search parameters including filters, sort, and pagination
 * @returns A properly formatted query string
 */
export const buildProductQueryString = (params: ProductSearchParams = {}): string => {
  const searchParams = new URLSearchParams();

  if (params.page && params.page > 1) {
    searchParams.append('page', params.page.toString());
  }

  if (params.filter) {
    if (params.filter.price_from !== undefined) {
      searchParams.append('filter[price_from]', params.filter.price_from.toString());
    }
    if (params.filter.price_to !== undefined) {
      searchParams.append('filter[price_to]', params.filter.price_to.toString());
    }
  }

  if (params.sort) {
    searchParams.append('sort', params.sort);
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};