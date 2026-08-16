import React from "react";
import secureLocalStorage from "react-secure-storage";
import { MANAGER_SESSION, STRORAGE_KEY, STUDENT_SESSION } from "../utils/const";
import { useNavigate, useRouteLoaderData, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUser, faSignOutAlt, faCog, faMoneyCheckAlt } from "@fortawesome/free-solid-svg-icons";
import { useAuthStore } from "../store/authStore";

export default function Header({ type = "manager" }) {
  const isManagerType = type !== "student";
  const session = useRouteLoaderData(isManagerType ? MANAGER_SESSION : STUDENT_SESSION);
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout(); // Zustand store ni tozalash
    navigate("/sign-in", { replace: true });
  };

  const stringToHsl = (str) => {
    let hash = 0;
    for (let i = 0; i < str?.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    return `hsl(${h}, 70%, 60%)`;
  };

  const fullName = session?.firstName && session?.lastName
    ? `${session.firstName} ${session.lastName}`
    : session?.firstName || session?.name || "Foydalanuvchi";

  const initial = fullName?.charAt(0)?.toUpperCase() ?? "U";
  const avatarColor = stringToHsl(fullName ?? "User");

  return (
    <div id="TopBar" className="flex items-center justify-between gap-[30px]">
      <form
        action=""
        className="flex items-center w-full max-w-[450px] rounded-full border border-gray-300 dark:border-white/20 gap-3 px-5 transition-all duration-300 bg-white/50 dark:bg-black/30 backdrop-blur-md focus-within:ring-2 focus-within:ring-[#1E40AF]">
        <input
          type="text"
          name="search"
          id="search"
          className="appearance-none outline-none w-full py-3 font-semibold bg-transparent placeholder:font-normal placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-gray-100"
          placeholder="Search course, student, other file..."
        />
        <FontAwesomeIcon icon={faSearch} className="text-gray-500 dark:text-gray-400" />
      </form>

      <div className="relative flex items-center justify-end gap-[14px] group">
        <div className="text-right hidden sm:block">
          <p className="font-semibold text-gray-900 dark:text-gray-100">{fullName}</p>
          <p className="text-sm leading-[21px] text-gray-500 dark:text-gray-400">{session?.role}</p>
        </div>

        <button
          type="button"
          id="profileButton"
          className="flex shrink-0 w-[50px] h-[50px] rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-white/20 hover:scale-105 transition-transform duration-200 shadow-md">
          {session?.role === "student" && session?.photo_url ? (
            <img src={session.photo_url} className="w-full h-full object-cover" alt="profile" />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-white font-semibold text-lg"
              style={{ backgroundColor: avatarColor }}>
              {initial}
            </div>
          )}
        </button>

        <div id="ProfileDropdown" className="absolute top-full right-0 hidden group-hover:block z-50 pt-4">
          <ul className="flex flex-col w-[200px] rounded-[20px] border border-gray-200 dark:border-white/20 p-5 gap-4 bg-white/90 dark:bg-black/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <li className="font-semibold text-gray-700 dark:text-gray-200 hover:text-[#1E40AF] dark:hover:text-[#3b82f6] transition-all cursor-pointer flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
              <Link to={`/${type === 'student' ? 'student' : 'manager'}`}>My Account</Link>
            </li>
            <li className="font-semibold text-gray-700 dark:text-gray-200 hover:text-[#1E40AF] dark:hover:text-[#3b82f6] transition-all cursor-pointer flex items-center gap-2">
              <FontAwesomeIcon icon={faMoneyCheckAlt} className="w-4 h-4" />
              <Link to={`/${type === 'student' ? 'student' : 'manager'}/subscription`}>Subscriptions</Link>
            </li>
            <li className="font-semibold text-gray-700 dark:text-gray-200 hover:text-[#1E40AF] dark:hover:text-[#3b82f6] transition-all cursor-pointer flex items-center gap-2">
              <FontAwesomeIcon icon={faCog} className="w-4 h-4" />
              <Link to={`/${type === 'student' ? 'student' : 'manager'}/settings`}>Settings</Link>
            </li>
            <div className="h-[1px] w-full bg-gray-200 dark:bg-white/10 my-1"></div>
            <li className="font-semibold text-red-500 hover:text-red-600 transition-all cursor-pointer flex items-center gap-2">
              <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4" />
              <button onClick={handleLogout} type="button">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
