import React from "react";
import secureLocalStorage from "react-secure-storage";
import { MANAGER_SESSION, STRORAGE_KEY, STUDENT_SESSION } from "../utils/const";
import { useNavigate, useRouteLoaderData, Link } from "react-router-dom";

export default function Header({ type = "manager" }) {
  const session = useRouteLoaderData(type === "manager" ? MANAGER_SESSION : STUDENT_SESSION);
  const navigate = useNavigate();

  const handleLogout = () => {
    secureLocalStorage.removeItem(STRORAGE_KEY);
    navigate(`/${type}/sign-in`, { replace: true });
  };

  const stringToHsl = (str) => {
    let hash = 0;
    for (let i = 0; i < str?.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    return `hsl(${h}, 70%, 60%)`;
  };

  const initial = session?.name?.charAt(0)?.toUpperCase() ?? "U";
  const avatarColor = stringToHsl(session?.name ?? "User");

  console.log("session:", session);
  console.log("photo_url:", session?.photo_url);

  return (
    <div id="TopBar" className="flex items-center justify-between gap-[30px]">
      <form
        action=""
        className="flex items-center w-full max-w-[450px] rounded-full border border-[#CFDBEF] gap-3 px-5 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#1E40AF]">
        <input
          type="text"
          name="search"
          id="search"
          className="appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#838C9D]"
          placeholder="Search course, student, other file..."
        />
        <img src="/assets/images/icons/search-normal.svg" className="w-6 h-6" alt="icon" />
      </form>

      <div className="relative flex items-center justify-end gap-[14px] group">
        <div className="text-right">
          <p className="font-semibold">{session?.name}</p>
          <p className="text-sm leading-[21px] text-[#838C9D]">{session?.role}</p>
        </div>

        <button
          type="button"
          id="profileButton"
          className="flex shrink-0 w-[50px] h-[50px] rounded-full overflow-hidden ring-2 ring-[#E5E7EB] hover:scale-105 transition-transform duration-200">
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

        <div id="ProfileDropdown" className="absolute top-full hidden group-hover:block z-30">
          <ul className="flex flex-col w-[200px] rounded-[20px] border border-[#CFDBEF] p-5 gap-4 bg-white mt-4 shadow-lg">
            <li className="font-semibold hover:text-[#1E40AF] transition-all cursor-pointer">
              <Link to={`/${type === 'student' ? 'student' : 'manager'}`}>My Account</Link>
            </li>
            <li className="font-semibold hover:text-[#1E40AF] transition-all cursor-pointer">
              <Link to={`/${type === 'student' ? 'student' : 'manager'}/subscription`}>Subscriptions</Link>
            </li>
            <li className="font-semibold hover:text-[#1E40AF] transition-all cursor-pointer">
              <Link to={`/${type === 'student' ? 'student' : 'manager'}/settings`}>Settings</Link>
            </li>
            <li className="font-semibold text-red-500 hover:text-red-600 transition-all cursor-pointer">
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
