import type { ProductsApiResponse, Product } from '../types';

const API_BASE_URL = 'https://api.redseam.redberryinternship.ge/api';

export const fetchProducts = async (page: number = 1): Promise<ProductsApiResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products?page=${page}`);
    
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

export const fetchAllProducts = async (): Promise<Product[]> => {
  try {
    const allProducts: Product[] = [];
    let currentPage = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      const response = await fetch(`${API_BASE_URL}/products?page=${currentPage}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: ProductsApiResponse = await response.json();
      allProducts.push(...data.data);
      
      hasMorePages = currentPage < data.meta.last_page;
      currentPage++;
    }

    return allProducts;
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw error;
  }
};

export const fetchProductById = async (id: number): Promise<{ data: import('../types').Product }> => {
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