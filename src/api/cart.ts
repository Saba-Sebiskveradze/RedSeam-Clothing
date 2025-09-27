import type { Product } from '../types/index.ts';

export interface AddToCartRequest {
  color: string;
  quantity: number;
  size: string;
}

export interface UpdateCartQuantityRequest {
  quantity: number;
  color?: string;
  size?: string;
}

export interface CartItem extends Product {
  total_price: number;
  quantity: number;
  color: string;
  size: string;
}

export const addToCart = async (
  productId: number,
  data: AddToCartRequest,
  token: string
): Promise<CartItem> => {
  try {
    const response = await fetch(
      `https://api.redseam.redberryinternship.ge/api/cart/products/${productId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error('Failed to add to cart: ' + (errorData.message || response.statusText));
    }

    return await response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Failed to add to cart: ' + error.message);
    }
    throw new Error('Failed to add to cart: Unknown error');
  }
};



export const updateCartQuantity = async (
  productId: number,
  data: UpdateCartQuantityRequest,
  token: string
): Promise<CartItem> => {
  try {
    const response = await fetch(
      `https://api.redseam.redberryinternship.ge/api/cart/products/${productId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error('Failed to update cart quantity: ' + (errorData.message || response.statusText));
    }

    return await response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Failed to update cart quantity: ' + error.message);
    }
    throw new Error('Failed to update cart quantity: Unknown error');
  }
};



export const getCartItems = async (token: string): Promise<CartItem[]> => {
  try {
    const response = await fetch(
      'https://api.redseam.redberryinternship.ge/api/cart',
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error('Failed to get cart items: ' + (errorData.message || response.statusText));
    }

    return await response.json();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Failed to get cart items: ' + error.message);
    }
    throw new Error('Failed to get cart items: Unknown error');
  }
};


export const removeFromCart = async (
  productId: number, 
  token: string, 
  color?: string, 
  size?: string
): Promise<void> => {
  try {
    const body = color || size ? JSON.stringify({ color, size }) : undefined;
    const response = await fetch(
      `https://api.redseam.redberryinternship.ge/api/cart/products/${productId}`,
      {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...(body && { 'Content-Type': 'application/json' }),
        },
        ...(body && { body }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error('Failed to remove from cart: ' + (errorData.message || response.statusText));
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Failed to remove from cart: ' + error.message);
    }
    throw new Error('Failed to remove from cart: Unknown error');
  }
};

export default addToCart;
