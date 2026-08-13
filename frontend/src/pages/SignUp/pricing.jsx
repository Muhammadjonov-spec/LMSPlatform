import React from "react";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { postSignup } from "../../services/authServices";
import PropTypes from "prop-types";

export default function Pricing({ data }) {
  console.log(data);

  const { isLoading, mutateAsync } = useMutation({
    mutationFn: () => postSignup(data)
  });

  const submitData = async () => {
    try {
      if (!data) {
        return;
      }
      const response = await mutateAsync();
      window.location.replace(response.data.midtrans_payment_url);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="relative flex flex-col flex-1 p-[10px]">
      <div class="absolute w-[calc(100%-20px)] min-h-[calc(100vh-20px)] h-[calc(100%-20px)] bg-[#fff] -z-10 rounded-[20px]"></div>
      <nav className="flex items-center justify-between p-8 border-b border-black/25 py-4">
        <Navbar />
        <div className="flex items-center gap-3">
          <Link to="/manager/sign-in">
            <div className="flex items-center justify-center gap-2 rounded-[16px] border px-6 py-3 transition-all duration-300 bg-[#ffffff] border-[#1E40AF] hover:bg-[#f5f5f5dc] hover:border-[#1E40AF]">
              <span className="font-semibold text-[#1E40AF] whitespace-nowrap ">My Dashboard</span>
            </div>
          </Link>
        </div>
      </nav>
      <header className="flex flex-col items-center gap-5 text-center mt-[30px]">
        <h1 className="font-extrabold text-[46px] leading-[69px] text-black">
          Choose the plan that fits your
          <br />
          <span className="text-[#1E40AF]">learning journey</span>
        </h1>
        <p className="text-lg leading-[27px] text-black/40">
          Whether you’re just starting out or managing a team of learners, we’ve got the right plan for you.
        </p>
      </header>
      <div className="grid grid-cols-3 gap-[30px] max-w-[1440px] mx-auto mt-[60px]">
        <div className="card flex flex-col h-fit rounded-[20px] border border-[#262A56] p-[30px] gap-[30px] bg-[#ffffff]">
          <div>
            <p className="font-extrabold text-[46px] leading-[69px] text-black">
              Free <span className="text-[#1E40AF]">Plan</span>
            </p>
            <p className="text-[24px] text-black">Starts at</p>
            <p className="text-[46px] text-[#1E40AF]">
              $0<span className="text-[12px] text-black">/mo</span>
            </p>
            <p className="text-[#6B6C7F] mt-[6px]">Good for students who are just getting started.</p>
          </div>
          <hr className="border-[#262A56]" />
          <Link to="#">
            <div className="flex items-center justify-center gap-2 rounded-full border px-4 py-2 transition-all duration-300 bg-white border-[#1E40AF] hover:bg-[#f5f5f5] hover:border-[#1E40AF]">
              <span className="text-[18px] text-[#1E40AF] font-medium">Get Started</span>
            </div>
          </Link>
          <hr className="border-[#262A56]" />
          <span className="text-black font-semibold text-[20px]">
            Plan <span className="text-[#1E40AF]">highlights</span>
          </span>
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-[6px]">
              <img src="/assets/images/icons/done-black.svg" className="flex shrink-0 w-6 h-6" alt="icon" />
              <p className="font-semibold text-black">Access to basic courses</p>
            </div>
            <div className="flex items-center gap-[6px]">
              <img src="/assets/images/icons/done-black.svg" className="flex shrink-0 w-6 h-6" alt="icon" />
              <p className="font-semibold text-black">Track personal proggess</p>
            </div>
            <div className="flex items-center gap-[6px]">
              <img src="/assets/images/icons/done-black.svg" className="flex shrink-0 w-6 h-6" alt="icon" />
              <p className="font-semibold text-black">Join community discussions</p>
            </div>
            <div className="flex items-center gap-[6px]">
              <img src="/assets/images/icons/done-black.svg" className="flex shrink-0 w-6 h-6" alt="icon" />
              <p className="font-semibold text-black">Limited quizzes & assignments</p>
            </div>
          </div>
          <div className="flex flex-col gap-3"></div>
        </div>
        <div className="card flex flex-col h-fit rounded-[20px] border border-[#262A56] p-[45px] gap-[30px] bg-[#1340AF]">
          <div>
            <p className="font-extrabold text-[46px] leading-[69px] text-white">Enterprise Plan</p>
            <p className="text-[24px] text-white">Starts at</p>
            <p className="text-[46px] text-white">
              $99<span className="text-[12px] text-white">/mo</span>
            </p>
            <p className="text-white mt-[6px]">Best for managers, teams, and organizations.</p>
          </div>

          <hr className="border-white/60" />

          <button
            type="button"
            onClick={submitData}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 rounded-full border px-6 py-2 transition-all duration-300 bg-white border-[#1E40AF] hover:bg-[#f5f5f5] hover:border-[#1E40AF]">
            <span className="text-[18px] text-[#1E40AF] font-medium">{isLoading ? "Processing..." : "Get Started"}</span>
          </button>

          <hr className="border-white/60" />

          <span className="text-white font-semibold text-[20px]">Features</span>
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-[6px]">
              <img src="/assets/images/icons/done-white.svg" className="flex shrink-0 w-6 h-6" alt="icon" />
              <p className="font-semibold text-white">Custom learning path</p>
            </div>
            <div className="flex items-center gap-[6px]">
              <img src="/assets/images/icons/done-white.svg" className="flex shrink-0 w-6 h-6" alt="icon" />
              <p className="font-semibold text-white">Dedicated account manager</p>
            </div>
            <div className="flex items-center gap-[6px]">
              <img src="/assets/images/icons/done-white.svg" className="flex shrink-0 w-6 h-6" alt="icon" />
              <p className="font-semibold text-white">Multi-user</p>
            </div>
            <div className="flex items-center gap-[6px]">
              <img src="/assets/images/icons/done-white.svg" className="flex shrink-0 w-6 h-6" alt="icon" />
              <p className="font-semibold text-white">Admin dashboard & reporting</p>
            </div>
          </div>
        </div>

        <div className="card flex flex-col h-fit rounded-[20px] border border-[#262A56] p-[30px] gap-[30px] bg-[#ffffff]">
          <div>
            <p className="font-extrabold text-[46px] leading-[69px] text-black">
              Pro <span className="text-[#1E40AF]">Plan</span>
            </p>
            <p className="text-[24px] text-black">Starts at</p>
            <p className="text-[46px] text-[#1E40AF]">
              $49<span className="text-[12px] text-black">/mo</span>
            </p>
            <p className="text-[#6B6C7F] mt-[6px]">Highly recommended for professionals.</p>
          </div>
          <hr className="border-[#262A56]" />
          <Link to="#">
            <div className="flex items-center justify-center gap-2 rounded-full border px-4 py-2 transition-all duration-300 bg-white border-[#1E40AF] hover:bg-[#f5f5f5] hover:border-[#1E40AF]">
              <span className="text-[18px] text-[#1E40AF] font-medium">Get Started</span>
            </div>
          </Link>
          <hr className="border-[#262A56]" />
          <span className="text-black font-semibold text-[20px]">
            What's <span className="text-[#1E40AF]">included</span>
          </span>
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-[6px]">
              <img src="/assets/images/icons/done-black.svg" className="flex shrink-0 w-6 h-6" alt="icon" />
              <p className="font-semibold text-black">Advanced progress analytics</p>
            </div>
            <div className="flex items-center gap-[6px]">
              <img src="/assets/images/icons/done-black.svg" className="flex shrink-0 w-6 h-6" alt="icon" />
              <p className="font-semibold text-black">Unlimited courses access</p>
            </div>
            <div className="flex items-center gap-[6px]">
              <img src="/assets/images/icons/done-black.svg" className="flex shrink-0 w-6 h-6" alt="icon" />
              <p className="font-semibold text-black">Certificates of completion</p>
            </div>
            <div className="flex items-center gap-[6px]">
              <img src="/assets/images/icons/done-black.svg" className="flex shrink-0 w-6 h-6" alt="icon" />
              <p className="font-semibold text-black">Priority email support</p>
            </div>
          </div>
          <div className="flex flex-col gap-3"></div>
        </div>
      </div>
    </div>
  );
}

Pricing.PropTypes = {
  data: PropTypes.object
};
