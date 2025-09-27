import React, { useReducer, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { CartItem } from '../api/cart';
import { getCartItems, updateCartQuantity, removeFromCart } from '../api/cart';
import { useAuth } from '../hooks/useAuth';
import { CartContext, type CartContextType } from './CartContextTypes';

interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  totalPrice: number;
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'UPDATE_ITEM_OPTIMISTIC'; payload: { id: number; color?: string; size?: string; quantity: number } }
  | { type: 'REMOVE_ITEM_OPTIMISTIC'; payload: { id: number; color?: string; size?: string } }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_ITEMS': {
      const items = action.payload;
      return {
        ...state,
        items,
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: items.reduce((sum, item) => sum + item.total_price, 0),
        error: null,
      };
    }
    
    case 'UPDATE_ITEM_OPTIMISTIC': {
      const updatedItems = state.items.map(item => {
        const matches = item.id === action.payload.id &&
          item.color === action.payload.color &&
          item.size === action.payload.size;
        
        if (matches) {
          const newQuantity = action.payload.quantity;
          return {
            ...item,
            quantity: newQuantity,
            total_price: (item.total_price / item.quantity) * newQuantity,
          };
        }
        return item;
      });
      
      return {
        ...state,
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: updatedItems.reduce((sum, item) => sum + item.total_price, 0),
      };
    }
    
    case 'REMOVE_ITEM_OPTIMISTIC': {
      const filteredItems = state.items.filter(item => {
        return !(item.id === action.payload.id &&
          item.color === action.payload.color &&
          item.size === action.payload.size);
      });
      
      return {
        ...state,
        items: filteredItems,
        totalItems: filteredItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: filteredItems.reduce((sum, item) => sum + item.total_price, 0),
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };
    
    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  totalItems: 0,
  totalPrice: 0,
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { getToken, isAuthenticated } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated()) {
      dispatch({ type: 'SET_ERROR', payload: 'Please log in to view cart' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const token = getToken()!;
      const items = await getCartItems(token);
      dispatch({ type: 'SET_ITEMS', payload: items });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch cart items';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      dispatch({ type: 'SET_ITEMS', payload: [] });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [getToken, isAuthenticated]);

  const updateQuantity = useCallback(async (
    itemId: number,
    quantity: number,
    color?: string,
    size?: string
  ) => {
    if (!isAuthenticated()) {
      dispatch({ type: 'SET_ERROR', payload: 'Please log in to update cart' });
      return;
    }

    if (quantity <= 0) {
      // Handle removal inline to avoid circular dependency
      if (!isAuthenticated()) {
        dispatch({ type: 'SET_ERROR', payload: 'Please log in to remove items' });
        return;
      }

      // Optimistic update for removal
      dispatch({
        type: 'REMOVE_ITEM_OPTIMISTIC',
        payload: { id: itemId, color, size }
      });

      try {
        const token = getToken()!;
        await removeFromCart(itemId, token, color, size);
        await fetchCart();
      } catch (error) {
        await fetchCart();
        const errorMessage = error instanceof Error ? error.message : 'Failed to remove item';
        dispatch({ type: 'SET_ERROR', payload: errorMessage });
      }
      return;
    }

    // Optimistic update
    dispatch({
      type: 'UPDATE_ITEM_OPTIMISTIC',
      payload: { id: itemId, color, size, quantity }
    });

    try {
      const token = getToken()!;
      await updateCartQuantity(itemId, { quantity, color, size }, token);
      // Optionally refresh cart to ensure consistency
      await fetchCart();
    } catch (error) {
      // Rollback optimistic update by refetching
      await fetchCart();
      const errorMessage = error instanceof Error ? error.message : 'Failed to update quantity';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  }, [getToken, isAuthenticated, fetchCart]);

  const removeItem = useCallback(async (
    itemId: number,
    color?: string,
    size?: string
  ) => {
    if (!isAuthenticated()) {
      dispatch({ type: 'SET_ERROR', payload: 'Please log in to remove items' });
      return;
    }

    // Optimistic update
    dispatch({
      type: 'REMOVE_ITEM_OPTIMISTIC',
      payload: { id: itemId, color, size }
    });

    try {
      const token = getToken()!;
      await removeFromCart(itemId, token, color, size);
      // Optionally refresh cart to ensure consistency
      await fetchCart();
    } catch (error) {
      // Rollback optimistic update by refetching
      await fetchCart();
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove item';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    }
  }, [getToken, isAuthenticated, fetchCart]);

  const getColorSpecificImage = useCallback((item: CartItem): string => {
    if (!item.color || !item.available_colors || !item.images) {
      return item.cover_image;
    }

    const colorIndex = item.available_colors.indexOf(item.color);
    if (colorIndex !== -1 && item.images[colorIndex]) {
      return item.images[colorIndex];
    }

    return item.cover_image;
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  // Auto-fetch cart when provider mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  const contextValue: CartContextType = {
    ...state,
    fetchCart,
    updateQuantity,
    removeItem,
    getColorSpecificImage,
    clearCart,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};