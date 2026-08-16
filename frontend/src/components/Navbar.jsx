import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import secureLocalStorage from "react-secure-storage";
import { STRORAGE_KEY } from "../utils/const";

import { postLogout } from "../services/authServices";

export default function Navbar() {
  const session = secureLocalStorage.getItem(STRORAGE_KEY);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await postLogout();
    } catch (e) {
      console.log(e);
    }
    secureLocalStorage.removeItem(STRORAGE_KEY);
    navigate("/");
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="relative">
      <div className="flex items-center justify-between w-full">
        <Link to="/" className="flex items-center gap-3">
          <img src="/assets/images/logos/edustack-icon.svg" className="w-10 h-10 flex shrink-0 drop-shadow-md" alt="logo" />
          <span className="text-2xl font-bold text-[#1E40AF]">EduStack</span>
        </Link>
        
        {/* Mobile Menu Icon */}
        <button 
          className="md:hidden text-gray-700 hover:text-[#1E40AF] transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <FontAwesomeIcon icon={faBars} size="lg" />
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-12">
          <ul className="flex items-center gap-8 font-semibold text-[#1E293B]">
            <li className="hover:text-[#1E40AF] transition-colors cursor-pointer"><Link to="/">Home</Link></li>
            <li className="hover:text-[#1E40AF] transition-colors cursor-pointer"><a href="/#pricing">Pricing</a></li>
            <li className="hover:text-[#1E40AF] transition-colors cursor-pointer"><a href="/#features">Features</a></li>
            <li className="hover:text-[#1E40AF] transition-colors cursor-pointer"><a href="/#testimonials">Testimonials</a></li>
          </ul>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link to={session.role === 'student' ? '/student' : '/manager'} className="text-sm font-bold text-[#1E40AF] hover:underline">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-100 transition-colors shadow-sm">
                  <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/sign-in" className="text-sm font-bold text-[#1E40AF] hover:underline">
                  Sign In
                </Link>
                <Link to="/sign-up" className="bg-[#1E40AF] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-4 bg-white border border-gray-200 shadow-lg rounded-2xl p-5 flex flex-col gap-4 z-50">
          <ul className="flex flex-col gap-4 font-semibold text-[#1E293B]">
            <li className="hover:text-[#1E40AF] transition-colors cursor-pointer"><Link to="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link></li>
            <li className="hover:text-[#1E40AF] transition-colors cursor-pointer"><a href="/#pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a></li>
            <li className="hover:text-[#1E40AF] transition-colors cursor-pointer"><a href="/#features" onClick={() => setIsMobileMenuOpen(false)}>Features</a></li>
            <li className="hover:text-[#1E40AF] transition-colors cursor-pointer"><a href="/#testimonials" onClick={() => setIsMobileMenuOpen(false)}>Testimonials</a></li>
          </ul>
          
          <div className="border-t border-gray-100 my-2"></div>
          
          <div className="flex flex-col gap-3">
            {session ? (
              <>
                <Link to={session.role === 'student' ? '/student' : '/manager'} onClick={() => setIsMobileMenuOpen(false)} className="text-center py-3 bg-gray-50 text-[#1E40AF] rounded-xl font-bold hover:bg-gray-100">
                  Dashboard
                </Link>
                <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl font-semibold hover:bg-red-100 transition-colors">
                  <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/sign-in" onClick={() => setIsMobileMenuOpen(false)} className="text-center py-3 bg-gray-50 text-[#1E40AF] rounded-xl font-bold hover:bg-gray-100">
                  Sign In
                </Link>
                <Link to="/sign-up" onClick={() => setIsMobileMenuOpen(false)} className="text-center bg-[#1E40AF] text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
