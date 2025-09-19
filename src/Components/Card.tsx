
import type { Product } from "../types";

interface CardProps {
  product: Product;
}

const Card = ({ product }: CardProps) => {
  return (
    <div className="w-[412px] h-[614px] flex flex-col gap-[12px] overflow-hidden">
        <img 
          src={product.cover_image} 
          alt={product.name}
          className="h-[549px] w-[412px] object-cover border border-solid border-[0.5px] border-Gray2 rounded-[8px]"
        />
      <div className="flex flex-col gap-[12px]">
        <div className="poppins-font font-[500] text-[18px] leading-none text-DarkBlue">
          {product.name}
        </div>
        <div className="poppins-font font-[500] text-[16px] leading-none text-DarkBlue2">
          ${product.price}
        </div>
      </div>
    </div>
  )
}

export default Card