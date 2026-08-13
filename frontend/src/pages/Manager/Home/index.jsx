import React from "react";
import Courses from "./courses";
import Students from "./students";
import { Link, useLoaderData } from "react-router-dom";

export default function ManagerHome() {
  const overview = useLoaderData();

  return (
    <>
      <header className="flex items-center justify-between gap-[30px]">
        <div>
          <h1 className="font-extrabold text-[28px] leading-[42px]">Dashboard Overview</h1>
          <p className="text-[#838C9D] mt-[1]">Here's a quick summary of your courses, achievements, and upcoming tasks.</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="#" className="w-fit rounded-[16px] border border-[#1E40AF] p-[14px_20px] font-semibold text-nowrap">
            Customize
          </a>
          <a href="" className="w-fit rounded-[16px] p-[14px_20px] font-semibold text-[#FFFFFF] bg-[#1E40AF] text-nowrap">
            Export Data
          </a>
        </div>
      </header>

      <section id="Stats" className="grid grid-cols-2 gap-[30px] rounded-[30px] p-[30px] bg-[#F8FAFB]">
        <div className="flex flex-col gap-[30px]">
          <div className="w-full h-[100px] bg-white rounded-[20px] shadow-[0_4px_10px_0_#E0E2EF] p-1 flex items-center justify-between">
            <div className="flex items-center gap-3 px-4">
              <div className="w-[40px] h-[40px] rounded-[10px] bg-[#F8FAFB] shadow-[0_2px_6px_0_#E0E2EF] flex items-center justify-center">
                <img src="/assets/images/icons/student-blue.svg" className="w-[30px]" />
              </div>
              <div>
                <p className="text-[#838C9D] text-sm">Students</p>
                <p className="text-[20px] font-bold">{overview?.totalStudents}</p>
              </div>
            </div>

            <div className="h-[50px] w-[1px] bg-[#D3D6E4]" />

            <div className="flex items-center gap-3 px-6">
              <div className="w-[40px] h-[40px] rounded-[10px] bg-[#F8FAFB] shadow-[0_2px_6px_0_#E0E2EF] flex items-center justify-center">
                <img src="/assets/images/icons/courses-blue.svg" className="w-[30px]" />
              </div>
              <div>
                <p className="text-[#838C9D] text-sm">Courses</p>
                <p className="text-[20px] font-bold">{overview?.totalCourse}</p>
              </div>
            </div>

            <div className="h-[50px] w-[1px] bg-[#D3D6E4]" />

            <div className="flex items-center gap-3 px-6">
              <div className="w-[40px] h-[40px] rounded-[10px] bg-[#F8FAFB] shadow-[0_2px_6px_0_#E0E2EF] flex items-center justify-center">
                <img src="/assets/images/icons/video-blue.svg" className="w-[30px]" />
              </div>
              <div>
                <p className="text-[#838C9D] text-sm">Video Content</p>
                <p className="text-[20px] font-bold">{overview?.totalVideos}</p>
              </div>
            </div>

            <div className="h-[50px] w-[1px] bg-[#D3D6E4]" />

            <div className="flex items-center gap-3 px-6">
              <div className="w-[40px] h-[40px] rounded-[10px] bg-[#F8FAFB] shadow-[0_2px_6px_0_#E0E2EF] flex items-center justify-center">
                <img src="/assets/images/icons/text-blue.svg" className="w-[30px]" />
              </div>
              <div>
                <p className="text-[#838C9D] text-sm">Text Content</p>
                <p className="text-[20px] font-bold">{overview?.totalText}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col rounded-[16px] p-5 bg-white shadow-[0_4px_4px_0_#E0E2EF]">
            <p className="text-2xl font-semibold mb-4">Course completion status</p>

            <div className="flex flex-col items-center justify-center flex-1">
              <div className="relative size-40 mb-6">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-[#728DE5]" strokeWidth="4" />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className="stroke-[#1E40AF]"
                    strokeWidth="4"
                    strokeDasharray="100"
                    strokeDashoffset="25"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="text-4xl font-bold text-black">75%</span>
                </div>
              </div>

              <div className="flex justify-between w-full items-center">
                <p className="text-sm font-medium text-[#1E40AF] opacity-80">Not Completed 25%</p>
                <Link to="#" className="text-[#1E40AF] hover:underline text-sm font-semibold">
                  See all courses →
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Students />
        </div>
      </section>

      <div className="grid grid-cols-2 gap-[30px]">
        <Courses />
      </div>
    </>
  );
}
