import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ isAdmin = true }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar-container fixed h-[calc(100vh-20px)] w-full max-w-[280px] my-[10px] ml-[10px] bg-[#1E40AF] overflow-hidden flex flex-1 rounded-[20px]">
      <div className="scroll-container flex w-full overflow-y-scroll hide-scrollbar">
        <nav className="flex flex-col w-full h-fit p-[30px] gap-10 z-10">
          <Link to="#" className="flex items-center gap-3">
            <img src="/assets/images/logos/edustack-icon-white.svg" alt="logo" className="h-10 w-10" />
            <span className="text-2xl font-bold text-white tracking-wide">EduStack</span>
          </Link>

          <ul className="flex flex-col gap-4">
            <p className="font-semibold text-xs leading-[18px] text-white">GENERAL</p>

            <li>
              <Link to="/manager">
                <div
                  className={`flex items-center gap-3 w-full rounded-[16px] border p-[14px_20px] transition-all duration-300 border-white ${
                    isActive("/manager") ? "bg-white text-[#1E40AF]" : "bg-[#1E40AF] text-white hover:bg-[#ffffff1a]"
                  }`}>
                  <img
                    src={`/assets/images/icons/3dcube-${isActive("/manager") ? "blue" : "white"}.svg`}
                    className="w-6 h-6"
                    alt="icon"
                  />
                  <span className="font-semibold">Overview</span>
                </div>
              </Link>
            </li>

            {isAdmin && (
              <>
                <li>
                  <Link to="/manager/courses">
                    <div
                      className={`flex items-center gap-3 w-full rounded-[16px] border p-[14px_20px] transition-all duration-300 border-white ${
                        isActive("/manager/courses") ? "bg-white text-[#1E40AF]" : "bg-[#1E40AF] text-white hover:bg-[#ffffff1a]"
                      }`}>
                      <img
                        src={`/assets/images/icons/note-favorite-${isActive("/manager/courses") ? "blue" : "white"}.svg`}
                        className="w-6 h-6"
                        alt="icon"
                      />
                      <span className="font-semibold">Courses</span>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link to="/manager/categories">
                    <div
                      className={`flex items-center gap-3 w-full rounded-[16px] border p-[14px_20px] transition-all duration-300 border-white ${
                        isActive("/manager/categories")
                          ? "bg-white text-[#1E40AF]"
                          : "bg-[#1E40AF] text-white hover:bg-[#ffffff1a]"
                      }`}>
                      <img
                        src={`/assets/images/icons/crown-${isActive("/manager/categories") ? "blue" : "white"}.svg`}
                        className="w-6 h-6"
                        alt="icon"
                      />
                      <span className="font-semibold">Categories</span>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link to="/manager/students">
                    <div
                      className={`flex items-center gap-3 w-full rounded-[16px] border p-[14px_20px] transition-all duration-300 border-white ${
                        isActive("/manager/students") ? "bg-white text-[#1E40AF]" : "bg-[#1E40AF] text-white hover:bg-[#ffffff1a]"
                      }`}>
                      <img
                        src={`/assets/images/icons/profile-2user-${isActive("/manager/students") ? "blue" : "white"}.svg`}
                        className="w-6 h-6"
                        alt="icon"
                      />
                      <span className="font-semibold">Students</span>
                    </div>
                  </Link>
                </li>
              </>
            )}
          </ul>

          <ul className="flex flex-col gap-4">
            <p className="font-semibold text-xs leading-[18px] text-white">OTHERS</p>

            <li>
              <Link to={isAdmin ? "/manager/subscription" : "/student/subscription"}>
                <div
                  className={`flex items-center gap-3 w-full rounded-[16px] border p-[14px_20px] transition-all duration-300 border-white ${
                    isActive(isAdmin ? "/manager/subscription" : "/student/subscription") ? "bg-white text-[#1E40AF]" : "bg-[#1E40AF] text-white hover:bg-[#ffffff1a]"
                  }`}>
                  <img
                    src={`/assets/images/icons/security-card-${isActive(isAdmin ? "/manager/subscription" : "/student/subscription") ? "blue" : "white"}.svg`}
                    className="w-6 h-6"
                    alt="icon"
                  />
                  <span className="font-semibold">Subscription</span>
                </div>
              </Link>
            </li>

            <li>
              <Link to={isAdmin ? "/manager/rewards" : "/student/rewards"}>
                <div
                  className={`flex items-center gap-3 w-full rounded-[16px] border p-[14px_20px] transition-all duration-300 border-white ${
                    isActive(isAdmin ? "/manager/rewards" : "/student/rewards") ? "bg-white text-[#1E40AF]" : "bg-[#1E40AF] text-white hover:bg-[#ffffff1a]"
                  }`}>
                  <img
                    src={`/assets/images/icons/cup-${isActive(isAdmin ? "/manager/rewards" : "/student/rewards") ? "blue" : "white"}.svg`}
                    className="w-6 h-6"
                    alt="icon"
                  />
                  <span className="font-semibold">Rewards</span>
                </div>
              </Link>
            </li>

            <li>
              <Link to={isAdmin ? "/manager/settings" : "/student/settings"}>
                <div
                  className={`flex items-center gap-3 w-full rounded-[16px] border p-[14px_20px] transition-all duration-300 border-white ${
                    isActive(isAdmin ? "/manager/settings" : "/student/settings") ? "bg-white text-[#1E40AF]" : "bg-[#1E40AF] text-white hover:bg-[#ffffff1a]"
                  }`}>
                  <img
                    src={`/assets/images/icons/setting-2-${isActive(isAdmin ? "/manager/settings" : "/student/settings") ? "blue" : "white"}.svg`}
                    className="w-6 h-6"
                    alt="icon"
                  />
                  <span className="font-semibold">Settings</span>
                </div>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
