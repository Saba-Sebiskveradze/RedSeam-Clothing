import React from 'react';

interface FilterCriteria {
  minPrice: string;
  maxPrice: string;
}

interface PriceFilterProps {
  isVisible: boolean;
  filters: FilterCriteria;
  onFilterChange: (field: keyof FilterCriteria, value: string) => void;
  onApply: () => void;
  onClose: () => void;
}

export const PriceFilter: React.FC<PriceFilterProps> = ({
  isVisible,
  filters,
  onFilterChange,
  onApply,
  onClose
}) => {
  if (!isVisible) return null;

  const handleApply = () => {
    onApply();
    onClose();
  };

  return (
    <div className="absolute top-[210px] left-[1332px] w-[392px] bg-White border border-solid border-Gray2 rounded-[8px] p-[16px] z-10 flex flex-col gap-[20px]">
      <h2 className="poppins-font font-[600] text-[16px] text-DarkBlue">
        Select price
      </h2>
      
      <div className="flex items-center gap-[10px]">
        <input
          type="number"
          value={filters.minPrice}
          onChange={(e) => onFilterChange('minPrice', e.target.value)}
          className="border border-Gray2 rounded-[8px] p-[8px] text-DarkBlue poppins-font font-[400] text-[14px] w-full"
          placeholder="From"
          min="0"
        />
        <input
          type="number"
          value={filters.maxPrice}
          onChange={(e) => onFilterChange('maxPrice', e.target.value)}
          className="border border-Gray2 rounded-[8px] p-[8px] text-DarkBlue poppins-font font-[400] text-[14px] w-full"
          placeholder="To"
          min="0"
        />
      </div>
      
      <div className="flex justify-end items-center">
        <button
          onClick={handleApply}
          className="poppins-font font-[400] text-[14px] text-White bg-Red rounded-[8px] px-[20px] py-[10px] hover:bg-red-600 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );
};