import React from 'react';

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  disabled?: boolean;
  className?: string;
}

const QuantityControl: React.FC<QuantityControlProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-center gap-[2px] w-[70px] h-[26px] border border-Gray2 rounded-[22px] px-[8px] py-[4px] ${className}`}>
      <button
        className="w-[16px] h-[16px] flex items-center justify-center text-Gray2 cursor-pointer hover:text-DarkBlue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onDecrease}
        disabled={disabled}
        aria-label="Decrease quantity"
        type="button"
      >
        -
      </button>
      <span className="poppins-font font-[500] text-[14px] text-DarkBlue min-w-[20px] text-center">
        {quantity}
      </span>
      <button
        className="w-[16px] h-[16px] flex items-center justify-center text-DarkBlue2 cursor-pointer hover:text-DarkBlue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onIncrease}
        disabled={disabled}
        aria-label="Increase quantity"
        type="button"
      >
        +
      </button>
    </div>
  );
};

export default QuantityControl;