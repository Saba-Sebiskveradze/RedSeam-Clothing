import React, { useRef, useState } from "react";
import registerUser from "../api/register";
import loginphoto from "../Assets/Img/LogInPhoto.png";
import Header from "../Components/Header/Header";
import profile from "../Assets/Img/profile.png";
import valid from "../Assets/Img/valid.svg";
import seePassword from "../Assets/Img/seePassword.svg";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [profileImg, setProfileImg] = useState(profile);
  const navigate = useNavigate();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Validation functions
  const isUsernameValid = username.length >= 3;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordValid = password.length >= 3;
  const isConfirmPasswordValid = confirmPassword.length >= 3 && confirmPassword === password;

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfileImg(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setProfileImg(profile);
    setAvatarFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);
    try {
      const response = await registerUser({
        username,
        email,
        password,
        password_confirmation: confirmPassword,
        avatar: avatarFile,
      });
      localStorage.setItem("token", response.token);
      // Redirect to login page after successful registration
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error occurred");
      }
    }
  };

  return (
    <div className="relative w-[1920px] h-[1080px]">
      <Header />
      <div className="flex items-center">
        <img src={loginphoto} alt="loginphoto" />
        <div className="flex flex-col gap-[46px] ml-[173px]">
          <h1 className="poppins-font font-semibold text-[42px] tracking-normal text-DarkBlue">
            Registration
          </h1>
          <div className="flex items-center gap-[15px]">
            <img
              src={profileImg}
              alt="profile"
              className="w-[48px] h-[48px] rounded-full object-cover"
            />
            <button
              className="poppins-font font-normal text-[14px] leading-[14px] text-DarkBlue2 bg-transparent border-none cursor-pointer"
              type="button"
              onClick={handleUploadClick}
            >
              Upload new
            </button>
            <button
              className="poppins-font font-normal text-[14px] leading-[14px] text-DarkBlue2 bg-transparent border-none cursor-pointer"
              type="button"
              onClick={handleRemove}
            >
              Remove
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
          <div className="flex flex-col gap-[24px] w-[554px]">
            {/* Username */}
            <div className="relative w-full">
              <input
                className="poppins-font font-normal text-[14px] leading-[14px] border border-Gray2 rounded-[16px] p-[12px] pr-[22px] text-DarkBlue2 w-full"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {!isUsernameValid && (
                <img
                  src={valid}
                  alt="valid"
                  className="absolute left-[100px] top-[16px]"
                />
              )}
            </div>
            {/* Email */}
            <div className="relative w-full">
              <input
                className="poppins-font font-normal text-[14px] leading-[14px] border border-Gray2 rounded-[16px] p-[12px] pr-[22px] text-DarkBlue2 w-full"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {!isEmailValid && (
                <img
                  src={valid}
                  alt="valid"
                  className="absolute left-[60px] top-[16px]"
                />
              )}
            </div>
            {/* Password */}
            <div className="relative w-full">
              <input
                className="poppins-font font-normal text-[14px] leading-[14px] border border-Gray2 rounded-[16px] p-[12px] pr-[44px] text-DarkBlue2 w-full"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {!isPasswordValid && (
                <img
                  src={valid}
                  alt="valid"
                  className="absolute left-[100px] top-[16px]"
                />
              )}
              <img
                src={seePassword}
                alt="see password"
                className="absolute right-[12px] top-1/2 transform -translate-y-1/2 w-[20px] h-[20px] cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              />
            </div>
            {/* Confirm Password */}
            <div className="relative w-full">
              <input
                className="poppins-font font-normal text-[14px] leading-[14px] border border-Gray2 rounded-[16px] p-[12px] pr-[44px] text-DarkBlue2 w-full"
                placeholder="Confirm Password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {!isConfirmPasswordValid && (
                <img
                  src={valid}
                  alt="valid"
                  className="absolute left-[150px] top-[16px]"
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
              {/* Buttons */}
          <div className="w-[554px] flex flex-col gap-[24px] flex justify-center items-center">
            <button
              className="poppins-font font-normal text-[14px] leading-[14px] flex justify-center items-center w-full rounded-[10px] bg-[#FF4000] text-White h-[41px]"
              onClick={handleRegister}
              disabled={!(isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid)}
            >
              Register
            </button>
            {error && <div className="text-Red w-full">{error}</div>}
            <div className="flex items-center gap-[8px]">
              <h2 className="poppins-font font-normal font-[400] text-[14px] text-DarkBlue2">
                Already member?
              </h2>
              <Link
                to="/"
                className="poppins-font font-normal text-[14px] no-underline leading-[14px] text-Red"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;