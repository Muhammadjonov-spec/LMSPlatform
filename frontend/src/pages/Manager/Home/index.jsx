import React from "react";
import Courses from "./courses";
import Students from "./students";
import { Link, useLoaderData } from "react-router-dom";
import EmptyState from "../../../components/EmptyState";

export default function ManagerHome() {
  const overview = useLoaderData();

  return (
    <div className="text-gray-900 dark:text-white transition-colors duration-300 w-full overflow-hidden">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-extrabold text-[28px] leading-[42px] dark:text-white">Dashboard Overview</h1>
          <p className="text-[#838C9D] dark:text-gray-400 mt-[1]">Here's a quick summary of your courses, achievements, and upcoming tasks.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
          <button 
            onClick={() => alert("Customize function will be available soon")}
            className="w-full sm:w-fit rounded-[16px] border border-[#1E40AF] p-[14px_20px] font-semibold text-center hover:bg-[#1E40AF]/5 transition-colors dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-400/10"
          >
            Customize
          </button>
          <button 
            onClick={() => alert("Data export will be available soon")}
            className="w-full sm:w-fit rounded-[16px] p-[14px_20px] font-semibold text-[#FFFFFF] bg-[#1E40AF] text-center hover:bg-blue-800 transition-colors"
          >
            Export Data
          </button>
        </div>
      </header>

      {!overview ? (
        <div className="mt-8">
          <EmptyState title="Dashboard statistics not available" message="There is currently not enough data in the system or backend API is not connected." />
        </div>
      ) : (
        <>
          <section id="Stats" className="grid grid-cols-1 lg:grid-cols-2 gap-[30px] rounded-[30px] p-4 sm:p-[30px] bg-[#F8FAFB] dark:bg-white/5 border border-transparent dark:border-white/10 mt-8">
        <div className="flex flex-col gap-[30px]">
          <div className="w-full bg-white dark:bg-white/10 rounded-[20px] shadow-[0_4px_10px_0_#E0E2EF] dark:shadow-none p-4 sm:p-6 grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4 border border-transparent dark:border-white/10">
            <div className="flex items-center gap-3 pr-2 border-r border-transparent sm:border-[#D3D6E4] sm:dark:border-white/10">
              <div className="w-[40px] h-[40px] rounded-[10px] bg-[#F8FAFB] dark:bg-white/10 shadow-[0_2px_6px_0_#E0E2EF] dark:shadow-none flex items-center justify-center shrink-0">
                <img src="/assets/images/icons/student-blue.svg" className="w-[24px] sm:w-[30px]" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[#838C9D] dark:text-gray-400 text-xs sm:text-sm truncate">Students</p>
                <p className="text-lg sm:text-[20px] font-bold dark:text-white truncate">{overview?.totalStudents}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 lg:pr-2 lg:border-r lg:border-transparent lg:sm:border-[#D3D6E4] lg:sm:dark:border-white/10 pl-2 lg:pl-0">
              <div className="w-[40px] h-[40px] rounded-[10px] bg-[#F8FAFB] dark:bg-white/10 shadow-[0_2px_6px_0_#E0E2EF] dark:shadow-none flex items-center justify-center shrink-0">
                <img src="/assets/images/icons/courses-blue.svg" className="w-[24px] sm:w-[30px]" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[#838C9D] dark:text-gray-400 text-xs sm:text-sm truncate">Courses</p>
                <p className="text-lg sm:text-[20px] font-bold dark:text-white truncate">{overview?.totalCourse}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pr-2 border-r border-transparent sm:border-[#D3D6E4] sm:dark:border-white/10">
              <div className="w-[40px] h-[40px] rounded-[10px] bg-[#F8FAFB] dark:bg-white/10 shadow-[0_2px_6px_0_#E0E2EF] dark:shadow-none flex items-center justify-center shrink-0">
                <img src="/assets/images/icons/video-blue.svg" className="w-[24px] sm:w-[30px]" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[#838C9D] dark:text-gray-400 text-xs sm:text-sm truncate">Video</p>
                <p className="text-lg sm:text-[20px] font-bold dark:text-white truncate">{overview?.totalVideos}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pl-2 lg:pl-0">
              <div className="w-[40px] h-[40px] rounded-[10px] bg-[#F8FAFB] dark:bg-white/10 shadow-[0_2px_6px_0_#E0E2EF] dark:shadow-none flex items-center justify-center shrink-0">
                <img src="/assets/images/icons/text-blue.svg" className="w-[24px] sm:w-[30px]" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[#838C9D] dark:text-gray-400 text-xs sm:text-sm truncate">Text</p>
                <p className="text-lg sm:text-[20px] font-bold dark:text-white truncate">{overview?.totalText}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col rounded-[16px] p-5 bg-white dark:bg-white/10 shadow-[0_4px_4px_0_#E0E2EF] dark:shadow-none border border-transparent dark:border-white/10">
            <p className="text-2xl font-semibold mb-4 dark:text-white">Course completion status</p>

            <div className="flex flex-col items-center justify-center flex-1">
              <div className="relative size-40 mb-6">
                <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="none" className="stroke-[#728DE5] dark:stroke-white/20" strokeWidth="4" />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    className="stroke-[#1E40AF] dark:stroke-blue-400"
                    strokeWidth="4"
                    strokeDasharray="100"
                    strokeDashoffset="25"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="text-4xl font-bold text-black dark:text-white">75%</span>
                </div>
              </div>

              <div className="flex justify-between w-full items-center">
                <p className="text-sm font-medium text-[#1E40AF] dark:text-blue-400 opacity-80">Not Completed 25%</p>
                <Link to="#" className="text-[#1E40AF] dark:text-blue-400 hover:underline text-sm font-semibold">
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

      <div className="w-full mt-[30px]">
        <Courses />
      </div>
      </>
      )}
    </div>
  );
}
