import React from 'react';
import type { Product } from '../types';
import Card from './Card';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-[24px] ml-[100px] mr-[100px] mt-[32px] h-[300px]">
        <div className="col-span-4 flex justify-center items-center">
          <p className="poppins-font text-[16px] text-DarkBlue">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-[24px] ml-[100px] mr-[100px] mt-[32px]">
      {products.length > 0 ? (
        products.map((product) => (
          <Card key={product.id} product={product} />
        ))
      ) : (
        <div className="col-span-4 flex justify-center items-center h-[300px]">
          <p className="poppins-font text-[18px] text-DarkBlue">
            No products found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
};