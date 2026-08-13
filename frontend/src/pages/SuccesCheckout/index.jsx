import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function SuccesCheckoutPage() {
  return (
    <div className="relative flex flex-col flex-1 p-[10px]">
      <div className="absolute w-[calc(100%-20px)] min-h-[calc(100vh-20px)] h-[calc(100%-20px)] bg-white -z-10 rounded-[20px]"></div>
      <nav className="flex items-center justify-between p-8 border-b border-black/25 py-4">
        <Navbar />
        <div className="flex items-center gap-[60px]"></div>
        <div className="flex items-center gap-3">
          <Link to="/manager/sign-in">
            <div className="flex items-center justify-center gap-2 rounded-full border px-6 py-3 transition-all duration-300 bg-[#ffffff] border-[#1E40AF] hover:bg-[#f5f5f5dc] hover:border-[#1E40AF]">
              <span className="font-semibold text-[#1E40AF] whitespace-nowrap ">My Dashboard</span>
            </div>
          </Link>
        </div>
      </nav>
      <h1 className="font-extrabold text-[46px] leading-[69px] text-black text-center m-auto mt-[40px]">
        Succes Checkout
        <br />
        <span className="text-[#1E40AF]"> Please log in to continue</span>
      </h1>
      <Link to="/manager/sign-in">
        <div className="flex items-center justify-center gap-3 w-max mx-auto mt-5 rounded-full border p-[20px_50px] transition-all duration-300 hover:bg-[#F5F5F5] hover:border-[#1E40AF]  bg-white border-[#1E40AF] ">
          <span className="font-semibold text-[#1E40AF]">Sign in Now</span>
        </div>
      </Link>
    </div>
  );
}
