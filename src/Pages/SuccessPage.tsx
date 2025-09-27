import xMark from "../Assets/Img/x-mark.svg";
import done from "../Assets/Img/done.png";
import { Link } from "react-router";
const SuccessPage = () => {
  return (
    <div className="relative w-[1920px] h-[1080px] ">
      <Link to="/">
        <img
          src={xMark}
          alt="Success"
          className="absolute top-[40px] right-[40px] w-[40px] h-[40px] object-cover"
        />
      </Link>

      <div className="flex flex-col items-center justify-center gap-[40px] absolute top-[114px] left-[calc(50%-150px)] ">
        <img
          src={done}
          alt="Success"
          className="w-[100px] h-[100px] object-cover"
        />
        <h1 className="text-[42px] poppins-font font-[600] text-DarkBlue ">
          Congrats!!
        </h1>
        <p className="text-[14px] poppins-font font-[400] text-DarkBlue2">
          Your order is placed successfully!
        </p>
      </div>
      <div className="flex items-center justify-center absolute top-[404px] left-[calc(50%-140px)] w-[214px] h-[41px] bg-Red rounded-[10px]  cursor-pointer">
        <Link to="/" className="no-underline poppins-font font-[400] text-[14px] text-White">Continue shopping</Link>
      </div>
    </div>
  );
};

export default SuccessPage;
