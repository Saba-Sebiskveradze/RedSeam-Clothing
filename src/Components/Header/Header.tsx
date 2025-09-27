import { Link } from "react-router-dom";
import logo from "../../Assets/Img/Logo.svg";
import user from "../../Assets/Img/user.svg";
import { useEffect, useState } from "react";
import type { LoginResponse } from "../../types";
import shoppingCart from "../../Assets/Img/shopping-cart.svg";

interface HeaderProps {
  onCartClick?: () => void;
}

const Header = ({ onCartClick }: HeaderProps) => {
  const [userData, setUserData] = useState<LoginResponse["user"] | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="h-[80px] w-full bg-[#FFFFFF] flex justify-between items-center ">
      <Link to="/" className="no-underline">
        <div className="flex items-center ml-[100px] gap-[4px]">
          <img src={logo} alt="logo" />
          <h1 className="poppins-font font-semibold text-[16px] leading-[24px]  text-DarkBlue">
            RedSeam Clothing
          </h1>
        </div>
      </Link>
      <div className="flex items-center mr-[100px] ">
        {userData ? (
          <div className="flex items-center gap-[20px]">
            <img 
              src={shoppingCart} 
              alt="shopping cart" 
              className="cursor-pointer"
              onClick={onCartClick}
            />

            <img
              src={userData.avatar}
              alt={userData.username}
              className="w-[32px] h-[32px] rounded-full"
            />
          </div>
        ) : (
          <>
            <Link to="/login" className="no-underline">
              <div className="flex items-center gap-[8px]">
                <img src={user} alt="user" />
                <h2 className="poppins-font font-medium text-[12px] leading-[12px] text-DarkBlue">
                  Log in
                </h2>
              </div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
