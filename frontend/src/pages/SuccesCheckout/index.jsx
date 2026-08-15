import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function SuccesCheckoutPage() {
  return (
    <div className="relative flex flex-col flex-1 p-[10px]">
      <div className="absolute w-[calc(100%-20px)] min-h-[calc(100vh-20px)] h-[calc(100%-20px)] bg-white -z-10 rounded-[20px]"></div>
      <nav className="flex items-center justify-between p-8 border-b border-black/25 py-4">
        <Navbar />
      </nav>
      <h1 className="font-extrabold text-[46px] leading-[69px] text-black text-center m-auto mt-[40px]">
        Succes Checkout
        <br />
        <span className="text-[#1E40AF]"> Please log in to continue</span>
      </h1>
      <Link to="/sign-in">
        <div className="flex items-center justify-center gap-3 w-max mx-auto mt-5 rounded-full border p-[20px_50px] transition-all duration-300 hover:bg-[#F5F5F5] hover:border-[#1E40AF]  bg-white border-[#1E40AF] ">
          <span className="font-semibold text-[#1E40AF]">Sign in Now</span>
        </div>
      </Link>
    </div>
  );
}
