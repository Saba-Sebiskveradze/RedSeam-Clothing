import React, { useState } from "react";
import Header from "../Components/Header/Header";
import CartModal from "../Components/CartModal";
import { ProductGrid } from "../Components/ProductGrid";
import { PriceFilter } from "../Components/PriceFilter";
import { Pagination } from "../Components/Pagination";
import SortBy from "../Components/SortBy";
import filter from "../Assets/Img/filter.svg";
import { useProductFilter } from "../hooks/useProductFilter";
import xMark from "../Assets/Img/x-mark.svg";

const MainPage: React.FC = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [showSortBy, setShowSortBy] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filterInputs, setFilterInputs] = useState({
    minPrice: "",
    maxPrice: "",
  });
const blurStyle = isCartOpen
  ? { filter: "brightness(70%)", backgroundColor: "rgba(16, 21, 31, 0.3)" }
  : {};
  const {
    products,
    loading,
    error,
    currentSort,
    currentPage,
    totalPages,
    totalItems,
    meta,
    appliedFilters,
    applyFilters,
    applySorting,
    goToPage,
  } = useProductFilter();
  console.log(products);

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

  const handleFilterChange = (
    field: "minPrice" | "maxPrice",
    value: string
  ) => {
    setFilterInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyFilter = () => {
    applyFilters(filterInputs);
  };

  const handleClearFilters = () => {
    const emptyFilters = { minPrice: "", maxPrice: "" };
    setFilterInputs(emptyFilters);
    applyFilters(emptyFilters);
  };

  const hasActiveFilters = () => {
    return appliedFilters.minPrice || appliedFilters.maxPrice;
  };

  const getFilterDisplayText = () => {
    const { minPrice, maxPrice } = appliedFilters;
    if (minPrice && maxPrice) {
      return `Price: ${minPrice}-${maxPrice}`;
    } else if (minPrice) {
      return `Price: ${minPrice}+`;
    } else if (maxPrice) {
      return `Price: up to ${maxPrice}`;
    }
    return "";
  };

  const renderResultsText = () => {
    if (!meta || totalItems === 0) {
      return "Showing 0 results";
    }

    const start = meta.from || 0;
    const end = meta.to || 0;
    return `Showing ${start}–${end} of ${totalItems} results`;
  };

  if (loading) {
    return (
      <div className="relative w-[1920px] h-[1080px]">
        <Header onCartClick={() => setIsCartOpen(true)} />
        <ProductGrid products={[]} loading={true} />
        <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-[1920px] h-[1080px]">
        <Header onCartClick={() => setIsCartOpen(true)} />
        <div className="flex justify-center items-center h-[500px]">
          <p className="poppins-font text-[16px] text-red-500">
            Error: {error}
          </p>
        </div>
        <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      </div>
    );
  }

  return (
    <div className="relative w-[1920px] h-[1080px]">
      <div style={blurStyle}>
        <Header onCartClick={() => setIsCartOpen(true)} />

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

        {hasActiveFilters() && (
          <div className="w-[145px] flex justify-center items-center ml-[100px] mt-[20px] border border-solid border-Gray2 px-[10px] py-[8px] gap-[2px] rounded-[16px]">
            <div className="poppins-font  font-[400] text-[14px] text-DarkBlue2">
              {getFilterDisplayText()}
            </div>
            <img
              src={xMark}
              alt="Close filter"
              className="cursor-pointer"
              onClick={handleClearFilters}
            />
          </div>
        )}

        <ProductGrid products={products} loading={loading} />

        {totalItems > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            canGoPrev={currentPage > 1}
            canGoNext={currentPage < totalPages}
          />
        )}
      </div>

      {/* Cart Modal */}
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default MainPage;
