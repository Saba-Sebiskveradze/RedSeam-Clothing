import type { ProductsApiResponse, ProductSearchParams } from '../types';
import { buildProductQueryString } from '../utils/api';

const API_BASE_URL = 'https://api.redseam.redberryinternship.ge/api';

export const fetchProducts = async (params: ProductSearchParams = {}): Promise<ProductsApiResponse> => {
  try {
    const queryString = buildProductQueryString(params);
    const response = await fetch(`${API_BASE_URL}/products${queryString}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ProductsApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductById = async (id: number): Promise<import('../types').Product> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};