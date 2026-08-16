import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "../../utils/zodSchema";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { postSignup, postGoogleAuth } from "../../services/authServices";
import { GoogleLogin } from "@react-oauth/google";
import secureLocalStorage from "react-secure-storage";
import { STRORAGE_KEY } from "../../utils/const";
import Pricing from "./pricing";
import ErrorToast from "../../components/common/ErrorToast";

export default function signUpPage() {
  const [mode, setMode] = useState("AUTH");
  const [dataSignUp, setDataSignUp] = useState(null);
  const [authError, setAuthError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(signUpSchema)
  });

  const { isPending, mutateAsync } = useMutation({
    mutationFn: (data) => postSignup(data)
  });
  
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setAuthError("");
    try {
      // Split name to firstName and lastName
      const nameParts = data.name.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || firstName;
      
      const payload = {
        name: data.name,
        firstName,
        lastName,
        email: data.email,
        password: data.password
      };
      
      await mutateAsync(payload);
      // Register muvaffaqiyatli bo'ldi — foydalanuvchi emailni tasdiqlashi kerak
      // Hech qanday token qaytmaydi, shuning uchun login qilmaymiz
      navigate("/sign-in?registered=true");
    } catch (error) {
      console.error("Sign up error:", error);
      const msg = error?.response?.data?.message || error?.message || "Registration failed. Please check your details.";
      setAuthError(msg);
    }
  };

  return (
    <>
      {mode === "AUTH" ? (
        <div className="relative flex flex-col min-h-screen p-4 md:p-8">
          <div className="absolute inset-0 bg-[#fff] -z-10 m-4 rounded-[20px] shadow-sm" />

          <nav className="flex items-center justify-between p-4 md:px-8 border-b border-black/10">
            <Navbar />
          </nav>

          <div className="flex flex-col-reverse lg:flex-row justify-center items-center gap-10 lg:gap-24 mt-10 lg:mt-16 w-full max-w-6xl mx-auto pb-10">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col w-full max-w-[450px] rounded-[24px] border border-[#1E40AF] p-8 gap-6 bg-[#1E40AF] shadow-xl">
              <div>
                <h2 className="font-bold text-2xl leading-[39px] text-white">Create Account</h2>
                <p className="text-white/80 text-sm mt-1">Sign up as a Student or Manager based on your role.</p>
              </div>
              <hr className="border-white/20" />

              {authError && (
                <div className="bg-red-500/20 border border-red-400 text-red-100 px-4 py-3 rounded-xl text-sm font-medium">
                  {authError}
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <span className="text-white font-medium text-sm">Full Name</span>
                <div className="flex items-center gap-3 w-full rounded-2xl p-4 bg-[#3B5998]">
                  <img src="/assets/images/icons/user-white.svg" className="w-5 h-5 shrink-0 opacity-80" alt="icon" />
                  <input
                    type="text"
                    className="appearance-none outline-none bg-transparent w-full font-medium text-white placeholder:text-white/50 text-sm"
                    placeholder="Write your complete name"
                    {...register("name")}
                  />
                </div>
                {errors.name?.message && <p className="text-red-300 text-xs mt-1">{errors.name?.message}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-white font-medium text-sm">Email Address</span>
                <div className="flex items-center gap-3 w-full rounded-2xl p-4 bg-[#3B5998]">
                  <img src="/assets/images/icons/email-white.svg" className="w-5 h-5 shrink-0 opacity-80" alt="icon" />
                  <input
                    type="email"
                    className="appearance-none outline-none bg-transparent w-full font-medium text-white placeholder:text-white/50 text-sm"
                    placeholder="Write your email address"
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
                    placeholder="Type your secure password"
                    {...register("password")}
                  />
                </div>
                {errors.password?.message && <p className="text-red-300 text-xs mt-1">{errors.password?.message}</p>}
              </div>
              
              <hr className="border-white/20 my-2" />
              
              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-2xl p-4 text-center font-bold text-[#1E40AF] bg-white hover:bg-gray-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                {isPending ? "Creating..." : "Create Account"}
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
                      const sessionData = res?.data || res;
                      secureLocalStorage.setItem(STRORAGE_KEY, sessionData);
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
                    setAuthError("Google Sign Up failed");
                  }}
                  shape="pill"
                  theme="filled_blue"
                  text="signup_with"
                  size="large"
                />
              </div>
              
              <div className="text-white/80 text-center text-sm">
                Already have an account?{" "}
                <Link to="/sign-in" className="text-white font-semibold hover:underline">
                  Sign In
                </Link>
              </div>
            </form>
            
            <div className="flex flex-col gap-8 text-center lg:text-left flex-1 max-w-lg mt-8 lg:mt-0">
              <div>
                <h1 className="font-extrabold text-4xl lg:text-[46px] leading-tight lg:leading-[69px] text-black">
                  Start Your Learning
                  <span className="text-[#1E40AF]"> Journey Today!</span>
                </h1>
                <p className="text-lg leading-[26px] text-black/50 mt-4">
                  Transform your career with expert-led courses and industry-recognized certifications.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4 text-left border-2 border-gray-100 hover:border-[#1E40AF] transition-colors p-4 lg:p-6 rounded-2xl bg-white shadow-sm hover:shadow-md">
                  <div className="w-14 h-14 bg-[#1E40AF] rounded-xl flex items-center justify-center flex-shrink-0">
                    <img src="/assets/images/icons/check-white.svg" className="w-8 h-8" alt="icon" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Premium Content</h3>
                    <p className="text-sm text-gray-500">Access 500+ courses from industry experts</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-left border-2 border-gray-100 hover:border-[#1E40AF] transition-colors p-4 lg:p-6 rounded-2xl bg-white shadow-sm hover:shadow-md">
                  <div className="w-14 h-14 bg-[#1E40AF] rounded-xl flex items-center justify-center flex-shrink-0">
                    <img src="/assets/images/icons/data-white.svg" className="w-8 h-8" alt="icon" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Track Progress</h3>
                    <p className="text-sm text-gray-500">Monitor your growth with detailed analytics</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-left border-2 border-gray-100 hover:border-[#1E40AF] transition-colors p-4 lg:p-6 rounded-2xl bg-white shadow-sm hover:shadow-md">
                  <div className="w-14 h-14 bg-[#1E40AF] rounded-xl flex items-center justify-center flex-shrink-0">
                    <img src="/assets/images/icons/certificate-white.svg" className="w-8 h-8" alt="icon" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Get Certified</h3>
                    <p className="text-sm text-gray-500">Earn recognized certificates upon completion</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-8 mt-4 pt-8 border-t border-gray-200">
                <div className="text-center lg:text-left">
                  <h4 className="text-[#1E40AF] text-3xl font-extrabold mb-1">50k+</h4>
                  <p className="text-gray-500 text-sm font-medium">Active Students</p>
                </div>
                <div className="text-center lg:text-left">
                  <h4 className="text-[#1E40AF] text-3xl font-extrabold mb-1">500+</h4>
                  <p className="text-gray-500 text-sm font-medium">Courses</p>
                </div>
                <div className="text-center lg:text-left">
                  <h4 className="text-[#1E40AF] text-3xl font-extrabold mb-1">95%</h4>
                  <p className="text-gray-500 text-sm font-medium">Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
          <ErrorToast message={authError} onClose={() => setAuthError("")} />
        </div>
      ) : (
        <Pricing data={dataSignUp} />
      )}
    </>
  );
}
