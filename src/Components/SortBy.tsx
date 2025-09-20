import React from "react";
import chevrondown from "../Assets/Img/chevron-down.svg";
import type { SortOption } from "../hooks/useProductFilter";

interface SortByProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const SortBy: React.FC<SortByProps> = ({ currentSort, onSortChange, isOpen, onToggle }) => {
  const sortOptions = [
    { value: 'newest' as SortOption, label: 'New products first' },
    { value: 'price-low-high' as SortOption, label: 'Price, low to high' },
    { value: 'price-high-low' as SortOption, label: 'Price, high to low' }
  ];

  const getCurrentSortLabel = () => {
    if (currentSort === null) return 'Sort by';
    const option = sortOptions.find(opt => opt.value === currentSort);
    return option ? option.label : 'Sort by';
  };

  const handleOptionSelect = (option: SortOption) => {
    onSortChange(option);
    onToggle();
  };

  return (
    <div className="relative">
      <div 
        className="flex items-center gap-[4px] cursor-pointer"
        onClick={onToggle}
      >
        <h2 className="poppins-font font-[400] text-[16px] text-DarkBlue">
          {getCurrentSortLabel()}
        </h2>
        <img 
          src={chevrondown} 
          alt="chevron down" 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {isOpen && (
        <div className="absolute top-[50px] right-[40px] h-[184px] w-[223px] bg-White border border-Gray rounded-[8px]  z-10">
          <div className="p-[12px]">
            <h3 className="poppins-font font-[600] text-[14px] text-DarkBlue mb-[16px]">
              Sort by
            </h3>
            {sortOptions.map((option) => (
              <div
                key={option.value}
                className={`poppins-font font-[400] text-[14px] mb-[8px] cursor-pointer rounded-[4px] hover:bg-gray-100 ${
                  currentSort === option.value ? 'bg-blue-50 text-blue-600' : 'text-DarkBlue'
                }`}
                onClick={() => handleOptionSelect(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortBy;
