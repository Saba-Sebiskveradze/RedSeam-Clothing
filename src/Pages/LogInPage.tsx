import Header from "../Components/Header/Header";
import loginphoto from "../Assets/Img/loginphoto.png";
import valid from "../Assets/Img/valid.svg";
import seePassword from "../Assets/Img/seePassword.svg"
import { Link } from "react-router-dom";
import { useState } from "react";

const LogInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative w-[1920px] h-[1080px]">
      <Header />
      <div className="flex  items-center">
        <img src={loginphoto} alt="loginphoto" />
        <div className="flex flex-col gap-[46px] ml-[173px]">
          <h1 className="poppins-font font-semibold text-[42px] tracking-normal text-DarkBlue">
            Log in
          </h1>
          <div className="flex flex-col gap-[24px] w-[554px]">
            <div className="relative w-full">
              <input
                className="poppins-font font-normal text-[14px] leading-[14px] border border-Gray2 rounded-[16px] p-[12px] pr-[36px] text-DarkBlue2 w-full"
                placeholder="Email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {email.length <= 2 && (
                <img
                  src={valid}
                  alt="valid"
                  className="absolute left-[150px] top-[16px]"
                />
              )}
            </div>
            <div className="relative w-full">
              <input
                className="poppins-font font-normal text-[14px] leading-[14px] border border-Gray2 rounded-[16px] p-[12px] pr-[36px] text-DarkBlue2 w-full"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {password.length <= 2 && (
                <img
                  src={valid}
                  alt="valid"
                  className="absolute left-[90px] top-[16px]"
                />
              )}
              <img
                src={seePassword}
                alt="see password"
                className="absolute right-[12px] top-1/2 transform -translate-y-1/2 w-[20px] h-[20px] cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              />
            </div>
          </div>

          <div className="w-[554px] flex flex-col gap-[24px] flex justify-center items-center">
            <button className="poppins-font font-normal text-[14px] leading-[14px] flex justify-center items-center w-full rounded-[10px] bg-[#FF4000] text-White h-[41px]">
              Log in
            </button>
            <div className="flex items-center gap-[8px]">
              <h2 className="poppins-font font-normal font-[400] text-[14px] text-DarkBlue2">
                Not a member?
              </h2>
              <Link
                to="/register"
                className="poppins-font font-normal text-[14px] no-underline leading-[14px] text-Red"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
