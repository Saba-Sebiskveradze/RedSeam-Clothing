interface CartSummaryProps {
  totalPrice: number;
  showDelivery?: boolean;
  deliveryFee?: number;
  className?: string;
}

const CartSummary = ({ 
  totalPrice, 
  showDelivery = true, 
  deliveryFee = 5,
  className = ""
}: CartSummaryProps) => {
  return (
    <div className={`flex flex-col gap-[16px] ${className}`}>
      <div className="flex justify-between items-center">
        <div className="poppins-font font-[400] text-[16px] text-DarkBlue">
          Items subtotal
        </div>
        <div className="poppins-font font-[400] text-[16px] text-DarkBlue">
          ${totalPrice.toFixed(0)}
        </div>
      </div>
      {showDelivery && (
        <div className="flex justify-between items-center">
          <div className="poppins-font font-[400] text-[16px] text-DarkBlue">
            Delivery
          </div>
          <div className="poppins-font font-[400] text-[16px] text-DarkBlue">
            $ {deliveryFee}
          </div>
        </div>
      )}
      <div className="flex justify-between items-center">
        <div className="poppins-font font-[500] text-[20px] text-DarkBlue">
          Total
        </div>
        <div className="poppins-font font-[500] text-[20px] text-DarkBlue">
          ${showDelivery ? (totalPrice + deliveryFee).toFixed(0) : totalPrice.toFixed(0)}
        </div>
      </div>
    </div>
  );
};

export default CartSummary;