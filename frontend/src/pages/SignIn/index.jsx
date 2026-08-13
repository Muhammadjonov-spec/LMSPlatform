import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signInSchema } from "../../utils/zodSchema";
import { useMutation } from "@tanstack/react-query";
import { postSignIn } from "../../services/authServices";
import { STRORAGE_KEY } from "../../utils/const";
import secureLocalStorage from "react-secure-storage";

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(signInSchema)
  });

  const { isLoading, mutateAsync } = useMutation({
    mutationFn: (data) => postSignIn(data)
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await mutateAsync(data);

      secureLocalStorage.setItem(STRORAGE_KEY, response.data);

      if (response.data.role === "manager") {
        navigate("/manager");
      } else {
        navigate("/student");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="relative flex flex-col min-h-screen p-4 md:p-8">
      <div className="absolute inset-0 bg-[#fff] -z-10 m-4 rounded-[20px] shadow-sm" />

      <nav className="flex items-center justify-between p-4 md:px-8 border-b border-black/10">
        <Navbar />
        <div className="flex items-center space-x-4">
          <Link to="/">
            <div className="flex items-center justify-center gap-2 rounded-2xl border px-6 py-3 transition-all duration-300 bg-white border-[#1E40AF] hover:bg-gray-50">
              <span className="font-semibold text-[#1E40AF] whitespace-nowrap">Home</span>
            </div>
          </Link>
          <Link to="/sign-up">
            <div className="flex items-center gap-3 w-fit rounded-full border px-6 py-3 transition-all duration-300 hover:bg-blue-800 bg-[#1E40AF] border-blue-800">
              <span className="font-semibold text-white">Sign Up</span>
            </div>
          </Link>
        </div>
      </nav>

      <div className="flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-24 mt-16 lg:mt-24 w-full max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 text-center lg:text-left flex-1 max-w-lg">
          <h1 className="font-extrabold text-4xl lg:text-[46px] leading-tight lg:leading-[69px] text-black">
            Welcome back to <span className="text-[#1E40AF]">EduStack!</span>
          </h1>
          <p className="text-lg leading-[26px] text-black/50 mt-2 lg:mb-12">
            Log in to continue your lessons. The system will automatically detect your role.
          </p>
        </div>
        
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-full max-w-[450px] rounded-[24px] border border-[#1E40AF] p-8 gap-6 bg-[#1E40AF] shadow-xl">
          <div>
            <h1 className="font-bold text-2xl leading-[39px] text-white">Sign In</h1>
            <p className="text-white/80 text-sm mt-1">Enter your email and password</p>
          </div>
          <hr className="border-white/20" />

          <div className="flex flex-col gap-2">
            <span className="text-white font-medium text-sm">Email Address</span>
            <div className="flex items-center gap-3 w-full rounded-2xl p-4 bg-[#3B5998]">
              <img src="/assets/images/icons/email-white.svg" className="w-5 h-5 shrink-0 opacity-80" alt="icon" />
              <input
                type="email"
                className="appearance-none outline-none bg-transparent w-full font-medium text-white placeholder:text-white/50 text-sm"
                placeholder="Enter your email"
                {...register("email")}
              />
            </div>
            {errors.email?.message && <p className="text-red-300 text-xs mt-1">{errors.email?.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-white font-medium text-sm">Password</span>
            <div className="flex items-center gap-3 w-full rounded-2xl p-4 bg-[#3B5998]">
              <img src="/assets/images/icons/key-white.svg" className="w-5 h-5 shrink-0 opacity-80" alt="icon" />
              <input
                type="password"
                className="appearance-none outline-none bg-transparent w-full font-medium text-white placeholder:text-white/50 text-sm"
                placeholder="Enter your password"
                {...register("password")}
              />
            </div>
            {errors.password?.message && <p className="text-red-300 text-xs mt-1">{errors.password?.message}</p>}
            <div className="flex justify-end mt-2">
              <Link to="#" className="text-sm text-white/80 hover:text-white hover:underline transition-colors">
                Forgot Password?
              </Link>
            </div>
          </div>

          <hr className="border-white/20 my-2" />
          <button
            disabled={isLoading}
            type="submit"
            className="w-full rounded-2xl p-4 text-center font-bold text-[#1E40AF] bg-white hover:bg-gray-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
            {isLoading ? "Please wait..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

