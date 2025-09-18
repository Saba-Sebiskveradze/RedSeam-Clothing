import { Link } from "react-router-dom";
import logo from "../../Assets/Img/Logo.svg";
import user from "../../Assets/Img/user.svg";

const Header = () => {
  return (
    <div
      className="h-[80px] w-full bg-[#FFFFFF] flex justify-between items-center "
    >
      <div className="flex items-center ml-[100px] gap-[4px]">
        <img src={logo} alt="logo" />
        <h1 className="poppins-font font-semibold text-[16px] leading-[24px] tracking-normal text-DarkBlue">
          RedSeam Clothing
        </h1>
      </div>
      <Link to="/" className="no-underline">
      <div className="flex items-center mr-[100px] gap-[8px]">
          <img src={user} alt="user" />
          <h2 className="poppins-font font-medium text-[12px] leading-[12px] text-DarkBlue">
            Log in
          </h2>
        </div>
      </Link>
    </div>
  );
};

export default Header;
