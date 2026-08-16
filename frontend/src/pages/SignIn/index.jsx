import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signInSchema } from "../../utils/zodSchema";
import { useMutation } from "@tanstack/react-query";
import { postSignIn } from "../../services/authServices";
import { STRORAGE_KEY } from "../../utils/const";
import secureLocalStorage from "react-secure-storage";
import { GoogleLogin } from "@react-oauth/google";
import { postGoogleAuth } from "../../services/authServices";
import ErrorToast from "../../components/common/ErrorToast";
import { useAuthStore } from "../../store/authStore";

export default function SignInPage() {
  const [authError, setAuthError] = useState("");
  const [searchParams] = useSearchParams();
  const isRegistered = searchParams.get("registered") === "true";
  const isVerified = searchParams.get("verified") === "true";
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(signInSchema)
  });

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (data) => postSignIn(data)
  });

  const navigate = useNavigate();
  const { login } = useAuthStore();

  const onSubmit = async (data) => {
    setAuthError("");
    try {
      const response = await mutateAsync(data);
      const backendData = response?.data || response;
      
      const sessionData = {
        user: backendData?.user,
        role: backendData?.user?.role,
        token: backendData?.accessToken || backendData?.token
      };
      
      login(sessionData);

      if (
        sessionData.role === "manager" ||
        sessionData.role === "admin" ||
        sessionData.role === "super_admin" ||
        sessionData.role === "teacher"
      ) {
        navigate("/manager");
      } else {
        navigate("/student");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      const msg = error?.response?.data?.message || error?.message || "Invalid credentials. Please try again.";
      setAuthError(msg);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen p-4 md:p-8">
      <div className="absolute inset-0 bg-[#fff] -z-10 m-4 rounded-[20px] shadow-sm" />

      <nav className="flex items-center justify-between p-4 md:px-8 border-b border-black/10">
        <Navbar />
      </nav>

      <div className="flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-24 mt-16 lg:mt-24 w-full max-w-6xl mx-auto">
        <div className="flex flex-col gap-4 text-center lg:text-left flex-1 max-w-lg">
          <h1 className="font-extrabold text-4xl lg:text-[46px] leading-tight lg:leading-[69px] text-black">
            Welcome back to <span className="text-[#1E40AF]">EduStack!</span>
          </h1>
          <p className="text-lg leading-[26px] text-black/50 mt-2 lg:mb-12">
            Log in to continue your lessons.
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

          {isVerified && (
            <div className="bg-green-500/20 border border-green-400 text-green-100 px-4 py-3 rounded-xl text-sm font-medium">
              ✅ Email muvaffaqiyatli tasdiqlandi! Endi tizimga kirishingiz mumkin.
            </div>
          )}

          {isRegistered && !isVerified && (
            <div className="bg-yellow-500/20 border border-yellow-400 text-yellow-100 px-4 py-3 rounded-xl text-sm font-medium">
              📧 Ro'yxatdan o'tdingiz! Emailingizni tekshiring va tasdiqlash havolasini bosing.
            </div>
          )}

          {authError && (
            <div className="bg-red-500/20 border border-red-400 text-red-100 px-4 py-3 rounded-xl text-sm font-medium">
              {authError}
            </div>
          )}

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
            disabled={isPending}
            type="submit"
            className="w-full rounded-2xl p-4 text-center font-bold text-[#1E40AF] bg-white hover:bg-gray-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
            {isPending ? "Please wait..." : "Sign In"}
          </button>
          
          <div className="flex items-center gap-4 my-2">
            <hr className="border-white/20 flex-1" />
            <span className="text-white/80 text-sm">Or</span>
            <hr className="border-white/20 flex-1" />
          </div>

          <div className="flex justify-center w-full mt-4">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                setAuthError("");
                try {
                  const res = await postGoogleAuth(credentialResponse.credential);
                  const backendData = res?.data || res;
                  
                  const sessionData = {
                    user: backendData?.user,
                    role: backendData?.user?.role,
                    token: backendData?.accessToken || backendData?.token
                  };

                  login(sessionData);

                  if (
                    sessionData.role === "manager" ||
                    sessionData.role === "admin" ||
                    sessionData.role === "super_admin" ||
                    sessionData.role === "teacher"
                  ) {
                    navigate("/manager");
                  } else {
                    navigate("/student");
                  }
                } catch (error) {
                  console.error("Google auth error:", error);
                  const msg = error?.response?.data?.message || error?.message || "Google authentication failed";
                  setAuthError(msg);
                }
              }}
              onError={() => {
                setAuthError("Google Sign In failed");
              }}
              shape="pill"
              theme="filled_blue"
              text="signin_with"
              size="large"
            />
          </div>
        </form>
      </div>
      <ErrorToast message={authError} onClose={() => setAuthError("")} />
    </div>
  );
}

