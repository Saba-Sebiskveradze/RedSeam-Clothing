import { useEffect, useState } from "react";
import xMark from "../Assets/Img/x-mark.svg";
import orangeCart from "../Assets/Img/orangeCart.png";
import { getCartItems, updateCartQuantity, removeFromCart, type CartItem } from "../api/cart";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getColorSpecificImage = (item: CartItem) => {
    if (!item.color || !item.available_colors || !item.images) {
      return item.cover_image;
    }

    const colorIndex = item.available_colors.indexOf(item.color);

    if (colorIndex !== -1 && item.images[colorIndex]) {
      return item.images[colorIndex];
    }

    return item.cover_image;
  };

  const fetchCartItems = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to view cart");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const items = await getCartItems(token);
      setCartItems(items);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch cart items"
      );
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId: number, newQuantity: number, color?: string, size?: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to update cart");
      return;
    }

    if (newQuantity <= 0) {
      return; 
    }

    try {
      await updateCartQuantity(itemId, { quantity: newQuantity, color, size }, token);
      await fetchCartItems();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update quantity"
      );
    }
  };

  const handleRemoveItem = async (itemId: number, color?: string, size?: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to remove items");
      return;
    }

    try {
      await removeFromCart(itemId, token, color, size);
      await fetchCartItems();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to remove item"
      );
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCartItems();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.total_price, 0);

  return (
    <>
      {/* Backdrop */}
      <div className="w-full h-full absolute top-[0] z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-[0] right-[0] w-[540px] h-full bg-White z-50 flex flex-col shadow-lg">
        <div className="flex justify-between items-center mt-[40px] ml-[40px] mr-[40px]">
          <h2 className="poppins-font font-[500] text-[20px] text-DarkBlue">
            Shopping cart ({totalItems})
          </h2>
          <img
            src={xMark}
            alt="Close cart"
            className="cursor-pointer w-[32px] h-[32px]"
            onClick={onClose}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center flex-1">
            <p className="poppins-font font-[400] text-[16px] text-DarkBlue">
              Loading cart...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-[24px]">
            <p className="poppins-font font-[400] text-[16px] text-Red text-center px-[40px]">
              {error}
            </p>
            <div
              className="w-[214px] h-[41px] bg-Red rounded-[10px] flex justify-center items-center cursor-pointer"
              onClick={onClose}
            >
              <p className="poppins-font font-[400] text-[14px] text-White">
                Close
              </p>
            </div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-[58px] mt-[142px]">
            <div className="flex flex-col items-center justify-center gap-[24px]">
              <img src={orangeCart} alt="Orange cart" />
              <h2 className="poppins-font font-[600] text-[24px] text-DarkBlue">
                Ooops!
              </h2>
              <p className="poppins-font font-[400] text-[14px] text-DarkBlue2">
                You’ve got nothing in your cart just yet...
              </p>
            </div>
            <div
              className="w-[214px] h-[41px] bg-Red rounded-[10px] flex justify-center items-center cursor-pointer"
              onClick={onClose}
            >
              <p className="poppins-font font-[400] text-[14px] text-White">
                Start shopping
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto  mt-[54px] max-h-[calc(100vh-300px)] mx-[40px] ">
              <div className="flex flex-col gap-[36px] pb-[20px]">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.color}-${item.size}`}
                    className="flex gap-[16px] "
                  >
                    <img
                      src={getColorSpecificImage(item)}
                      alt={`${item.name} ${item.color || ""}`}
                      className="w-[100px] h-[134px] object-cover rounded-[10px] border border-Gray2"
                    />
                    <div className="flex flex-col justify-between gap-[13px]">
                      <div className="flex w-[320px]  justify-between ">
                        <div className="flex flex-col gap-[8px]">
                          <div className="poppins-font font-[500] text-[14px] text-DarkBlue ">
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
                        <div className="poppins-font font-[500] text-[18px] text-DarkBlue">
                          ${item.total_price.toFixed(0)}
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center justify-center gap-[2px] w-[70px] h-[26px] border border-Gray2 rounded-[22px] px-[8px] py-[4px]">
                          <div 
                            className="w-[16px] h-[16px] flex items-center justify-center text-Gray2 cursor-pointer px-[0px] hover:text-DarkBlue transition-colors"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.color, item.size)}
                          >
                            -
                          </div>
                          <div className="poppins-font font-[500] text-[14px] text-DarkBlue">
                            {item.quantity}
                        </div>
                          <div 
                            className="w-[16px] h-[16px] flex items-center justify-center text-DarkBlue2 cursor-pointer hover:text-DarkBlue transition-colors"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.color, item.size)}
                          >
                            +
                          </div>
                        </div>
                        <div 
                          className="poppins-font font-[500] text-[14px] text-DarkBlue2 cursor-pointer hover:text-Red transition-colors"
                          onClick={() => handleRemoveItem(item.id, item.color, item.size)}
                        >
                          Remove
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart  */}
            <div className=" p-[40px] mt-auto">
              
              <div className="flex flex-col gap-[16px]">
                <div className="flex justify-between items-center ">
                  <div className="poppins-font font-[400] text-[16px] text-DarkBlue">
                    Items subtotal
                  </div>
                  <div className="poppins-font font-[400] text-[16px] text-DarkBlue">
                    ${totalPrice.toFixed(0)}
                  </div>
                </div>
                <div className="flex justify-between items-center ">
                  <div className="poppins-font font-[400] text-[16px] text-DarkBlue">
                    Delivery
                  </div>
                  <div className="poppins-font font-[400] text-[16px] text-DarkBlue">
                    $ 5
                  </div>
                </div>
                 <div className="flex justify-between items-center ">
                  <div className="poppins-font font-[500] text-[20px] text-DarkBlue">
                    Total
                  </div>
                  <div className="poppins-font font-[500] text-[20px] text-DarkBlue">
                    ${(totalPrice + 5).toFixed(0)}
                  </div>
                </div>
                
               
              </div>
              <div className="w-[460px] h-[41px] bg-Red rounded-[10px] flex justify-center items-center cursor-pointer mt-[50px] ">
                <p className="poppins-font font-[500] text-[18px] text-White">
                  Go to checkout
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartModal;
