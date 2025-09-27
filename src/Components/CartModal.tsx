import { useEffect } from "react";
import xMark from "../Assets/Img/x-mark.svg";
import orangeCart from "../Assets/Img/orangeCart.png";
import { Link } from "react-router-dom";
import CartSummary from "./CartSummary";
import { useCart } from "../hooks/useCart";
import QuantityControl from "./UI/QuantityControl";
import LoadingSpinner from "./UI/LoadingSpinner";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal = ({ isOpen, onClose }: CartModalProps) => {
  const {
    items: cartItems,
    loading,
    error,
    totalItems,
    totalPrice,
    fetchCart,
    updateQuantity,
    removeItem,
    getColorSpecificImage,
  } = useCart();

  useEffect(() => {
    if (isOpen) {
      fetchCart();
    }
  }, [isOpen, fetchCart]);

  if (!isOpen) return null;

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
            <LoadingSpinner size="md" />
            <p className="poppins-font font-[400] text-[16px] text-DarkBlue ml-4">
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
            </div>

            {/* Cart Summary */}
            <div className=" p-[40px] mt-auto">
              <CartSummary totalPrice={totalPrice} />
              <div className="w-[460px] h-[41px] bg-Red rounded-[10px] flex justify-center items-center cursor-pointer mt-[50px] ">
                <Link
                  to="/checkout"
                  className="poppins-font font-[500] text-[18px] text-White no-underline"
                >
                  Go to checkout
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartModal;
