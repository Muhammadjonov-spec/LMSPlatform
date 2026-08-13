import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="flex items-center w-full px-6">
      <Link to="/" className="flex items-center gap-3 mr-12">
        <img src="/assets/images/logos/edustack-icon.svg" className="w-10 h-10 flex shrink-0" alt="logo" />
        <span className="text-2xl font-bold text-[#1E40AF]">EduStack</span>
      </Link>
      <ul className="flex items-center gap-8 ml-auto font-semibold text-gray-700">
        <li className="hover:text-[#1E40AF] transition-colors cursor-pointer"><Link to="/">Home</Link></li>
        <li className="hover:text-[#1E40AF] transition-colors cursor-pointer"><a href="#pricing">Pricing</a></li>
        <li className="hover:text-[#1E40AF] transition-colors cursor-pointer"><a href="#features">Features</a></li>
        <li className="hover:text-[#1E40AF] transition-colors cursor-pointer"><a href="#testimonials">Testimonials</a></li>
      </ul>
    </div>
  );
}
