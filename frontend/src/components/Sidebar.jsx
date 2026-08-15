import React, { useState } from "react";
import { Link, useLocation, useRouteLoaderData } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube, faBook, faCrown, faUsers, faShieldAlt, faTrophy, faCog, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "../context/ThemeContext";
import { MANAGER_SESSION, STUDENT_SESSION } from "../utils/const";

export default function Sidebar({ isAdmin = true }) {
  const location = useLocation();
  const session = useRouteLoaderData(isAdmin ? MANAGER_SESSION : STUDENT_SESSION);
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const getIconColor = (path) => isActive(path) ? (theme === 'dark' ? '#0B1120' : '#1E40AF') : '#ffffff';

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#1E40AF] text-white rounded-lg shadow-lg dark:bg-white/10 dark:backdrop-blur-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`sidebar-container fixed h-[calc(100vh-20px)] w-full max-w-[280px] my-[10px] mx-[10px] overflow-hidden flex flex-1 rounded-[20px] transition-all duration-300 z-40 
        bg-[#1E40AF]/90 dark:bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl
        ${isOpen ? "translate-x-0" : "-translate-x-[150%] md:translate-x-0"}
      `}>
        <div className="scroll-container flex w-full overflow-y-scroll hide-scrollbar">
          <nav className="flex flex-col w-full h-fit p-[30px] gap-10 z-10">
            <Link to="#" className="flex items-center gap-3">
              <img src="/assets/images/logos/edustack-icon-white.svg" alt="logo" className="h-10 w-10 drop-shadow-md" />
              <span className="text-2xl font-bold text-white tracking-wide drop-shadow-md">EduStack</span>
            </Link>

            <ul className="flex flex-col gap-4">
              <p className="font-semibold text-xs leading-[18px] text-white/70">GENERAL</p>

              <li>
                <Link to={isAdmin ? "/manager" : "/student"} onClick={() => setIsOpen(false)}>
                  <div
                    className={`flex items-center gap-3 w-full rounded-[16px] border p-[14px_20px] transition-all duration-300 border-white/30 backdrop-blur-sm ${
                      isActive(isAdmin ? "/manager" : "/student") ? "bg-white text-[#1E40AF] dark:text-[#0B1120] shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "bg-transparent text-white hover:bg-white/20"
                    }`}>
                    <FontAwesomeIcon icon={faCube} className="w-5 h-5" color={getIconColor(isAdmin ? "/manager" : "/student")} />
                    <span className="font-semibold">Overview</span>
                  </div>
                </Link>
              </li>

              {isAdmin && (
                <>
                  {/* Courses — teacher, admin, manager, super_admin */}
                  <li>
                    <Link to="/manager/courses" onClick={() => setIsOpen(false)}>
                      <div
                        className={`flex items-center gap-3 w-full rounded-[16px] border p-[14px_20px] transition-all duration-300 border-white/30 backdrop-blur-sm ${
                          isActive("/manager/courses") ? "bg-white text-[#1E40AF] dark:text-[#0B1120] shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "bg-transparent text-white hover:bg-white/20"
                        }`}>
                        <FontAwesomeIcon icon={faBook} className="w-5 h-5" color={getIconColor("/manager/courses")} />
                        <span className="font-semibold">Courses</span>
                      </div>
                    </Link>
                  </li>

                  {/* Categories — admin, manager, super_admin (NOT teacher) */}
                  {session?.role !== 'teacher' && (
                    <li>
                      <Link to="/manager/categories" onClick={() => setIsOpen(false)}>
                        <div
                          className={`flex items-center gap-3 w-full rounded-[16px] border p-[14px_20px] transition-all duration-300 border-white/30 backdrop-blur-sm ${
                            isActive("/manager/categories") ? "bg-white text-[#1E40AF] dark:text-[#0B1120] shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "bg-transparent text-white hover:bg-white/20"
                          }`}>
                          <FontAwesomeIcon icon={faCrown} className="w-5 h-5" color={getIconColor("/manager/categories")} />
                          <span className="font-semibold">Categories</span>
                        </div>
                      </Link>
                    </li>
                  )}

                  {/* Students — admin, manager, super_admin (NOT teacher) */}
                  {session?.role !== 'teacher' && (
                    <li>
                      <Link to="/manager/students" onClick={() => setIsOpen(false)}>
                        <div
                          className={`flex items-center gap-3 w-full rounded-[16px] border p-[14px_20px] transition-all duration-300 border-white/30 backdrop-blur-sm ${
                            isActive("/manager/students") ? "bg-white text-[#1E40AF] dark:text-[#0B1120] shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "bg-transparent text-white hover:bg-white/20"
                          }`}>
                          <FontAwesomeIcon icon={faUsers} className="w-5 h-5" color={getIconColor("/manager/students")} />
                          <span className="font-semibold">Students</span>
                        </div>
                      </Link>
                    </li>
                  )}

                  {/* Admin-level links — admin + super_admin only */}
                  {(session?.role === 'admin' || session?.role === 'super_admin') && (
                    <>
                      <li>
                        <Link to="/manager/admin/orders" onClick={() => setIsOpen(false)}>
                          <div
                            className={`flex items-center gap-3 w-full rounded-[16px] border p-[14px_20px] transition-all duration-300 border-white/30 backdrop-blur-sm ${
                              isActive("/manager/admin/orders") ? "bg-white text-[#1E40AF] dark:text-[#0B1120] shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "bg-transparent text-white hover:bg-white/20"
                            }`}>
                            <FontAwesomeIcon icon={faCube} className="w-5 h-5" color={getIconColor("/manager/admin/orders")} />
                            <span className="font-semibold">Orders Approval</span>
                          </div>
                        </Link>
                      </li>
                    </>
                  )}
                  
                  {/* Super Admin only — Users Admin */}
                  {session?.role === 'super_admin' && (
                    <li>
                      <Link to="/manager/admin/users" onClick={() => setIsOpen(false)}>
                        <div
                          className={`flex items-center gap-3 w-full rounded-[16px] border p-[14px_20px] transition-all duration-300 border-white/30 backdrop-blur-sm ${
                            isActive("/manager/admin/users") ? "bg-white text-[#1E40AF] dark:text-[#0B1120] shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "bg-transparent text-white hover:bg-white/20"
                          }`}>
                          <FontAwesomeIcon icon={faUsers} className="w-5 h-5" color={getIconColor("/manager/admin/users")} />
                          <span className="font-semibold">Users Admin</span>
                        </div>
                      </Link>
                    </li>
                  )}
                </>
              )}
            </ul>

            <ul className="flex flex-col gap-4">
              <p className="font-semibold text-xs leading-[18px] text-white/70">OTHERS</p>

              <li>
                <Link to={isAdmin ? "/manager/subscription" : "/student/subscription"} onClick={() => setIsOpen(false)}>
                  <div
                    className={`flex items-center gap-3 w-full rounded-[16px] border p-[14px_20px] transition-all duration-300 border-white/30 backdrop-blur-sm ${
                      isActive(isAdmin ? "/manager/subscription" : "/student/subscription") ? "bg-white text-[#1E40AF] dark:text-[#0B1120] shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "bg-transparent text-white hover:bg-white/20"
                    }`}>
                    <FontAwesomeIcon icon={faShieldAlt} className="w-5 h-5" color={getIconColor(isAdmin ? "/manager/subscription" : "/student/subscription")} />
                    <span className="font-semibold">Subscription</span>
                  </div>
                </Link>
              </li>

              <li>
                <Link to={isAdmin ? "/manager/rewards" : "/student/rewards"} onClick={() => setIsOpen(false)}>
                  <div
                    className={`flex items-center gap-3 w-full rounded-[16px] border p-[14px_20px] transition-all duration-300 border-white/30 backdrop-blur-sm ${
                      isActive(isAdmin ? "/manager/rewards" : "/student/rewards") ? "bg-white text-[#1E40AF] dark:text-[#0B1120] shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "bg-transparent text-white hover:bg-white/20"
                    }`}>
                    <FontAwesomeIcon icon={faTrophy} className="w-5 h-5" color={getIconColor(isAdmin ? "/manager/rewards" : "/student/rewards")} />
                    <span className="font-semibold">Rewards</span>
                  </div>
                </Link>
              </li>

              <li>
                <Link to={isAdmin ? "/manager/settings" : "/student/settings"} onClick={() => setIsOpen(false)}>
                  <div
                    className={`flex items-center gap-3 w-full rounded-[16px] border p-[14px_20px] transition-all duration-300 border-white/30 backdrop-blur-sm ${
                      isActive(isAdmin ? "/manager/settings" : "/student/settings") ? "bg-white text-[#1E40AF] dark:text-[#0B1120] shadow-[0_0_15px_rgba(255,255,255,0.5)]" : "bg-transparent text-white hover:bg-white/20"
                    }`}>
                    <FontAwesomeIcon icon={faCog} className="w-5 h-5" color={getIconColor(isAdmin ? "/manager/settings" : "/student/settings")} />
                    <span className="font-semibold">Settings</span>
                  </div>
                </Link>
              </li>
            </ul>

            <div className="mt-auto pt-8 flex items-center justify-between border-t border-white/20">
               <span className="text-white text-sm">Theme Mode</span>
               <button 
                  onClick={toggleTheme}
                  className="w-12 h-6 rounded-full bg-white/20 relative transition-colors duration-300"
               >
                  <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all duration-300 ${theme === 'dark' ? 'left-6.5' : 'left-0.5'}`}></div>
               </button>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
