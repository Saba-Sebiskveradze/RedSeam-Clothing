import { createContext } from 'react';
import type { CartItem } from '../api/cart';

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  totalPrice: number;
}

export interface CartContextType extends CartState {
  fetchCart: () => Promise<void>;
  updateQuantity: (itemId: number, quantity: number, color?: string, size?: string) => Promise<void>;
  removeItem: (itemId: number, color?: string, size?: string) => Promise<void>;
  getColorSpecificImage: (item: CartItem) => string;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextType | null>(null);