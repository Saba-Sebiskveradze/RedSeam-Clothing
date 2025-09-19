import React, { useState } from "react";
import Header from "../Components/Header/Header";
import { ProductGrid } from "../Components/ProductGrid";
import { PriceFilter } from "../Components/PriceFilter";
import { Pagination } from "../Components/Pagination";
import SortBy from "../Components/SortBy";
import filter from "../Assets/Img/filter.svg";
import { useProductFilter } from "../hooks/useProductFilter";
import { usePagination } from "../hooks/usePagination";

const MainPage: React.FC = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [showSortBy, setShowSortBy] = useState(false);
  const [filterInputs, setFilterInputs] = useState({
    minPrice: '',
    maxPrice: ''
  });

  const {
    filteredProducts,
    loading,
    error,
    currentSort,
    applyFilters,
    applySorting
  } = useProductFilter();

  const {
    currentPage,
    totalPages,
    paginatedItems,
    goToPage,
    canGoNext,
    canGoPrev,
    getDisplayRange
  } = usePagination({
    totalItems: filteredProducts.length,
    itemsPerPage: 10
  });

  const displayedProducts = paginatedItems(filteredProducts);
  const { start, end } = getDisplayRange();

  const handleFilterToggle = () => {
    setShowFilter(!showFilter);
    if (!showFilter) {
      setShowSortBy(false);
    }
  };

  const handleSortByToggle = () => {
    setShowSortBy(!showSortBy);
    if (!showSortBy) {
      setShowFilter(false);
    }
  };

  const handleFilterChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    setFilterInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilter = () => {
    applyFilters(filterInputs);
  };

  const renderResultsText = () => {
    if (filteredProducts.length === 0) {
      return "Showing 0 results";
    }
    return `Showing ${start}–${end} of ${filteredProducts.length} results`;
  };

  if (loading) {
    return (
      <div className="relative w-[1920px] h-[1080px]">
        <Header />
        <ProductGrid products={[]} loading={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-[1920px] h-[1080px]">
        <Header />
        <div className="flex justify-center items-center h-[500px]">
          <p className="poppins-font text-[16px] text-red-500">
            Error: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-[1920px] h-[1080px]">
      <Header />
      
      <div className="flex justify-between items-center ml-[100px] mr-[100px] mt-[52px]">
        <h1 className="poppins-font font-semibold text-[42px] text-DarkBlue">
          Products
        </h1>
        
        <div className="flex items-center gap-[32px]">
          <h2 className="poppins-font font-[400] text-[12px] text-DarkBlue2">
            {renderResultsText()}
          </h2>
          
          <div
            style={{
              width: "14px",
              height: "0px",
              border: "1px solid #E1DFE1",
              transform: "rotate(-90deg)",
            }}
          />

          <div 
            className="flex items-center gap-[8px] cursor-pointer" 
            onClick={handleFilterToggle}
          >
            <img src={filter} alt="filter" />
            <h2 className="poppins-font font-[400] text-[16px] text-DarkBlue">
              Filter
            </h2>
          </div>
          
          <SortBy
            currentSort={currentSort}
            onSortChange={applySorting}
            isOpen={showSortBy}
            onToggle={handleSortByToggle}
          />
        </div>
      </div>

      <PriceFilter
        isVisible={showFilter}
        filters={filterInputs}
        onFilterChange={handleFilterChange}
        onApply={handleApplyFilter}
        onClose={() => setShowFilter(false)}
      />

      <ProductGrid products={displayedProducts} loading={false} />

      {filteredProducts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          canGoPrev={canGoPrev}
          canGoNext={canGoNext}
        />
      )}
    </div>
  );
};

export default MainPage;