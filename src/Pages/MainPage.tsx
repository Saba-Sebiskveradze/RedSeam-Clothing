import { useState, useEffect } from "react";
import Header from "../Components/Header/Header";
import Card from "../Components/Card";
import filter from "../Assets/Img/filter.svg";
import chevrondown from "../Assets/Img/chevron-down.svg";
import chevronleft from "../Assets/Img/chevron-left.svg"
import chevronright from "../Assets/Img/chevron-right.svg"
import { fetchProducts } from "../api/products";
import type { Product, ProductsApiResponse } from "../types";

const MainPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<ProductsApiResponse['meta'] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await fetchProducts(currentPage);
        setProducts(response.data);
        setMeta(response.meta);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (meta?.last_page || 1)) {
      setCurrentPage(page);
    }
  };

  const renderPaginationNumbers = () => {
    if (!meta) return null;

    const { current_page, last_page } = meta;
    const pages = [];
    
    pages.push(1);
    
    if (current_page === 1 || current_page === 2) {
      if (last_page > 1) {
        pages.push(2);
      }
    } else if (current_page === last_page || current_page === last_page - 1) {
      if (last_page > 1) {
        pages.push(2);
      }
    } else {
      pages.push(current_page);
    }
    
    if (last_page > 4) {
      pages.push('...');
    }
    
    if (last_page > 3 && !pages.includes(last_page - 1)) {
      pages.push(last_page - 1);
    }
    
    if (last_page > 2 && !pages.includes(last_page)) {
      pages.push(last_page);
    }
    
    return pages.map((page, index) => {
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
      
      const isActive = page === current_page;
      return (
        <button
          key={page}
          onClick={() => handlePageChange(page as number)}
          className={`w-[32px] h-[32px] flex justify-center items-center poppins-font font-bold text-[14px] leading-[20px] border border-solid rounded-[8px] ${
            isActive
              ? 'text-Red border-Red'
              : 'text-DarkGray border-Gray hover:border-Red hover:text-Red'
          }`}
        >
          {page}
        </button>
      );
    });
  };

  if (loading) {
    return (
      <div className="relative w-[1920px] h-[1080px]">
        <Header />
        <div className="flex justify-center items-center h-[500px]">
          <p className="poppins-font text-[16px] text-DarkBlue">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-[1920px] h-[1080px]">
        <Header />
        <div className="flex justify-center items-center h-[500px]">
          <p className="poppins-font text-[16px] text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="relative w-[1920px] h-[1080px]">
      <Header />  
      <div className="flex justify-between items-center ml-[100px] mr-[100px] mt-[72px]">
        <h1 className="poppins-font font-semibold text-[42px]  text-DarkBlue">
          Products
        </h1>
        <div className="flex items-center gap-[32px]">
          {/* showing results */}
          <h2 className="poppins-font font-[400] text-[12px]  text-DarkBlue2">
            Showing {meta?.from || 1}–{meta?.to || products.length} of {meta?.total} results
          </h2>
          {/* border */}
          <div
            style={{
              width: "14px",
              height: "0px",
              border: "1px solid #E1DFE1",
              transform: "rotate(-90deg)",
            }}
          />

          {/* filter function */}
          <div className="flex items-center gap-[8px]">
            <img src={filter} alt="filter" />
            <h2 className="poppins-font font-[400] text-[16px]  text-DarkBlue">
              Filter
            </h2>
          </div>
          {/* sort function */}
          <div className="flex items-center gap-[4px]">
            <h2 className="poppins-font font-[400] text-[16px]  text-DarkBlue">Sort by</h2>
            <img src={chevrondown} alt="chevron down" />
          </div>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="grid grid-cols-4 gap-[24px] ml-[100px] mr-[100px] mt-[32px]">
        {products.map((product) => (
          <Card key={product.id} product={product} />
        ))}
      </div>
      {/* Pagination */}
      <div className="flex justify-center items-center mt-[40px] gap-[8px]">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={!meta || currentPage === 1}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img src={chevronleft} alt="chevron left" />
        </button>
        
        {renderPaginationNumbers()}
        
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={!meta || currentPage === meta.last_page}
          className="disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img src={chevronright} alt="chevron right" />
        </button>
      </div>
    </div>
  );
};

export default MainPage;
