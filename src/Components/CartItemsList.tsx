import { useEffect, memo } from "react";
import { useCart } from "../hooks/useCart";
import type { CartItem } from "../api/cart";
import QuantityControl from "./UI/QuantityControl";
import LoadingSpinner from "./UI/LoadingSpinner";

interface CartItemsListProps {
  className?: string;
  onCartUpdate?: (items: CartItem[]) => void;
}

const CartItemsList = memo<CartItemsListProps>(({ className = "", onCartUpdate }) => {
  const {
    items: cartItems,
    loading,
    error,
    updateQuantity,
    removeItem,
    getColorSpecificImage,
  } = useCart();

  // Notify parent component when cart items change
  useEffect(() => {
    onCartUpdate?.(cartItems);
  }, [cartItems, onCartUpdate]);

  if (loading) {
    return (
      <div className={`flex justify-center items-center p-8 ${className}`}>
        <LoadingSpinner size="md" />
        <p className="poppins-font font-[400] text-[16px] text-DarkBlue ml-4">
          Loading cart...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 gap-4 ${className}`}>
        <p className="poppins-font font-[400] text-[16px] text-Red text-center">
          {error}
        </p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
        <p className="poppins-font font-[400] text-[16px] text-DarkBlue2">
          Your cart is empty
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-[24px] ${className}`}>
      {cartItems.map((item) => (
        <div
          key={`${item.id}-${item.color}-${item.size}`}
          className="flex gap-[16px] p-4 bg-White rounded-[10px] "
        >
          <img
            src={getColorSpecificImage(item)}
            alt={`${item.name} ${item.color || ""}`}
            className="w-[80px] h-[107px] object-cover rounded-[8px] border border-Gray2"
          />
          <div className="flex flex-col justify-between flex-1">
            <div className="flex justify-between">
              <div className="flex flex-col gap-[4px]">
                <div className="poppins-font font-[500] text-[14px] text-DarkBlue">
                  {item.name}
                </div>
                {item.color && (
                  <div className="poppins-font font-[400] text-[12px] text-DarkBlue2">
                    {item.color}
                  </div>
                )}
                {item.size && (
                  <div className="poppins-font font-[400] text-[12px] text-DarkBlue2">
                    {item.size}
                  </div>
                )}
              </div>
              <div className="poppins-font font-[500] text-[16px] text-DarkBlue">
                ${item.total_price.toFixed(0)}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <QuantityControl
                quantity={item.quantity}
                onIncrease={() => updateQuantity(item.id, item.quantity + 1, item.color, item.size)}
                onDecrease={() => updateQuantity(item.id, item.quantity - 1, item.color, item.size)}
                disabled={loading}
              />
              <button
                className="poppins-font font-[500] text-[14px] text-DarkBlue2 cursor-pointer hover:text-Red transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => removeItem(item.id, item.color, item.size)}
                disabled={loading}
                type="button"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

CartItemsList.displayName = 'CartItemsList';

export default CartItemsList;