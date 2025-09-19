import React from 'react';
import chevronleft from '../Assets/Img/chevron-left.svg';
import chevronright from '../Assets/Img/chevron-right.svg';
import { generatePaginationNumbers } from '../utils/pagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  canGoPrev,
  canGoNext
}) => {
  const pages = generatePaginationNumbers({ currentPage, totalPages });

  return (
    <div className="flex justify-center items-center mt-[40px] gap-[8px]">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrev}
        className="disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <img src={chevronleft} alt="Previous" />
      </button>

      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <div
              key={`dots-${index}`}
              className="w-[32px] h-[32px] flex justify-center items-center poppins-font font-[500] text-[14px] leading-[20px] text-DarkGray border border-solid border-Gray rounded-[8px]"
            >
              ...
            </div>
          );
        }

        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`w-[32px] h-[32px] flex justify-center items-center poppins-font font-bold text-[14px] leading-[20px] border border-solid rounded-[8px] transition-colors ${
              isActive
                ? 'text-Red border-Red'
                : 'text-DarkGray border-Gray hover:border-Red hover:text-Red'
            }`}
            aria-label={`Go to page ${page}`}
            aria-current={isActive ? 'page' : undefined}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        className="disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <img src={chevronright} alt="Next" />
      </button>
    </div>
  );
};