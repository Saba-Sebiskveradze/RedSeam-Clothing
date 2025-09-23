import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../Components/Header/Header";
import { fetchProductById } from "../api/products";
import type { Product } from "../types";
import chevronDown from "../Assets/Img/chevron-down.svg";
import shopingCart from "../Assets/Img/shopping-cart2.svg";
const colorMap = {
  White: "#FFFFFF",
  Red: "#FF0000",
  Multi: "linear-gradient(90deg, red, yellow, green, blue)",
  Blue: "#0000FF",
  "Navy Blue": "#001F54",
  Grey: "#808080",
  Black: "#000000",
  Purple: "#800080",
  Orange: "#FFA500",
  Beige: "#F5F5DC",
  Pink: "#FFC0CB",
  Green: "#008000",
  Cream: "#FFFDD0",
  Maroon: "#800000",
  Brown: "#A52A2A",
  Peach: "#FFE5B4",
  "Off White": "#F8F8F0",
  Mauve: "#E0B0FF",
  Yellow: "#FFFF00",
  Magenta: "#FF00FF",
  Khaki: "#F0E68C",
  Olive: "#808000",
};

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mainImage, setMainImage] = useState<string>("");

  const handleColorClick = (color: string, index: number) => {
    setSelectedColor(color);
    if (product && product.images[index]) {
      setMainImage(product.images[index]);
    }
  };

  const handleImageClick = (imgUrl: string, index: number) => {
    setMainImage(imgUrl);
    if (product && product.available_colors && product.available_colors[index]) {
      setSelectedColor(product.available_colors[index]);
    }
  };

  const getColorStyle = (colorName: string) => {
    const colorValue = colorMap[colorName as keyof typeof colorMap];
    if (colorValue?.includes("gradient")) {
      return { background: colorValue };
    }
    return { backgroundColor: colorValue || "#CCCCCC" };
  };

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const productData = await fetchProductById(Number(id));
        setProduct(productData);
        // Set the first available color as default, or the current color if available
        if (
          productData.available_colors &&
          productData.available_colors.length > 0
        ) {
          const initialColor =
            productData.color || productData.available_colors[0];
          const initialColorIndex =
            productData.available_colors.indexOf(initialColor);
          setSelectedColor(initialColor);
          if (
            initialColorIndex !== -1 &&
            productData.images[initialColorIndex]
          ) {
            setMainImage(productData.images[initialColorIndex]);
          } else {
            setMainImage(productData.cover_image);
          }
        } else {
          setMainImage(productData.cover_image);
        }
        // Set the first available size as default, or the current size if available
        if (
          productData.available_sizes &&
          productData.available_sizes.length > 0
        ) {
          setSelectedSize(productData.size || productData.available_sizes[0]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch product"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="relative w-[1920px] h-[1080px]">
        <Header />
        <div className="flex justify-center items-center h-[500px]">
          <p className="poppins-font text-[16px] text-DarkBlue">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="relative w-[1920px] h-[1080px]">
        <Header />
        <div className="flex justify-center items-center h-[500px]">
          <p className="poppins-font text-[16px] text-red-500">
            {error || "Product not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-[1920px] h-[1080px]">
      <Header />
      <div className="flex flex-col mt-[30px] gap-[50px] ml-[100px] mr-[100px]">
        <h1 className="poppins-font font-[300] text-[14px] text-DarkBlue">
          Listing / Product
        </h1>
        <div className="flex justify-between items-start mb-[100px]">
          {/* photos */}
          <div className="flex gap-[24px]">
            <div className="flex flex-col gap-[9px]">
              {product.images.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`${product.name} ${index + 1}`}
                  className="w-[121px] h-[161px] object-cover border border-solid border-[0.5px] border-Gray2 rounded-[8px] cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handleImageClick(imgUrl, index)}
                />
              ))}
            </div>
            <img
              src={mainImage}
              alt={product.name}
              className="w-[703px] h-[937px] object-cover border border-solid border-[0.5px] border-Gray2 rounded-[8px]"
            />
          </div>
          {/* description */}
          <div className="flex flex-col gap-[56px] w-[704px]">
            <div className="flex flex-col gap-[21px]">
              <div className="poppins-font font-[600] text-[32px] text-DarkBlue">
                {product.name}
              </div>
              <div className="poppins-font font-[600] text-[32px] text-DarkBlue">
                $ {product.price}
              </div>
            </div>
            {/* color */}
            <div className="flex flex-col gap-[48px]">
              {product.available_colors &&
                product.available_colors.length > 0 && (
                  <div className="flex flex-col gap-[16px]">
                    <div className="poppins-font font-[400] text-[16px] text-DarkBlue">
                      Color: {selectedColor}
                    </div>
                    <div className="flex items-center gap-[13px]">
                      {product.available_colors.map((colorOption, index) => (
                        <div
                          key={index}
                          className={`w-[24px] h-[24px] rounded-full border border-[0.5px] border-Gray2 cursor-pointer ${
                            colorOption === selectedColor
                              ? "ring-1 ring-offset-2 ring-Gray2"
                              : ""
                          }`}
                          style={getColorStyle(colorOption)}
                          onClick={() => handleColorClick(colorOption, index)}
                          title={colorOption}
                        />
                      ))}
                    </div>
                  </div>
                )}
              {/* size */}
              {product.available_sizes &&
                product.available_sizes.length > 0 && (
                  <div className="flex flex-col gap-[16px]">
                    <div className="poppins-font font-[400] text-[16px] text-DarkBlue">
                      Size: {selectedSize}
                    </div>
                    <div className="flex items-center gap-[8px]">
                      {product.available_sizes.map((sizeOption, index) => (
                        <div
                          key={index}
                          className={`w-[70px] h-[42px] flex items-center justify-center rounded-[8px] cursor-pointer poppins-font text-[14px] text-DarkBlue ${
                            sizeOption === selectedSize
                              ? "bg-Gray border border-solid border-DarkBlue"
                              : "bg-white border border-solid border-Gray2 hover:bg-gray-50"
                          }`}
                          onClick={() => setSelectedSize(sizeOption)}
                          title={sizeOption}
                        >
                          {sizeOption}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              {/* Quantity */}
              <div className="flex flex-col gap-[16px]">
                <div className="poppins-font font-[400] text-[16px] text-DarkBlue">
                  Quantity
                </div>
                <div className="relative">
                  <div
                    className="w-[70px] h-[42px] rounded-[10px] flex items-center justify-between py-[9px] px-[16px] border border-solid border-Gray2 cursor-pointer"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <div className="poppins-font font-[400] text-[16px] text-DarkBlue">
                      {quantity}
                    </div>
                    <img
                      src={chevronDown}
                      alt="chevron down"
                      className={`transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute top-[100%] left-0 w-[70px] bg-White border border-solid border-Gray2 rounded-[10px] mt-1 z-10 max-h-48 overflow-y-auto">
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(
                        (num) => (
                          <div
                            key={num}
                            className="poppins-font font-[400] text-[16px] text-DarkBlue py-2 px-4 hover:bg-gray-100 cursor-pointer flex justify-between pl-[12px] border-b border-Gray2"
                            onClick={() => {
                              setQuantity(num);
                              setIsDropdownOpen(false);
                            }}
                          >
                            {num}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
              {/* Cart */}
              <div className="flex justify-center items-center gap-[10px] py-[16px] cursor-pointer bg-Red rounded-[10px] ">
                <img
                  src={shopingCart}
                  alt="shopping cart"
                  className="w-[24px] h-[24px]"
                />
                <div className="poppins-font font-[500] text-[18px] text-White ">
                  Add to Cart
                </div>
              </div>
              <div className="border-b border-Gray2"></div>
              {/* details */}
              <div className="flex flex-col gap-[7px]">
                <div className="flex justify-between items-center ">
                  <div className="poppins-font font-[500] text-[20px] text-DarkBlue">
                    Details
                  </div>
                  <img
                    src={product.brand?.image}
                    alt="brand image"
                    className="w-[109px] h-[61px] object-contain"
                  />
                </div>
                <div className="flex flex-col gap-[19px]">
                  <div className="poppins-font font-[400] text-[16px] text-DarkBlue">
                    Brand: {product.brand?.name}
                  </div>
                  <div className="poppins-font font-[400] text-[16px] text-DarkBlue">
                    {product.description}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
