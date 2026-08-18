import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export default function CardCourse({
  id = "1",
  imageUrl = "/assets/images/thumbnails/th-1.png",
  category = "Programming",
  title = "Responsive Design Triclorem Lorem, ipsum dolor.",
  progress = Math.floor(Math.random() * 100) // Mock progress
}) {
  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all flex flex-col group">
      <div className="relative h-40 w-full overflow-hidden bg-gray-200">
        <img src={imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="thumbnail" />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#1E40AF]">
          {category}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <Link to={`/student/detail-course/${id}`} className="font-bold text-lg text-gray-900 leading-snug line-clamp-2 hover:text-[#1E40AF] transition-colors mb-4">
          {title}
        </Link>
        
        <div className="mt-auto">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-gray-500 font-medium">Progress</span>
            <span className="font-bold text-[#1E40AF]">{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-4 overflow-hidden">
            <div className="bg-[#1E40AF] h-2 rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
          </div>
          
          <Link to={`/student/detail-course/${id}`} className="block w-full text-center bg-gray-50 text-[#1E40AF] py-2.5 rounded-xl font-bold hover:bg-[#1E40AF] hover:text-white transition-colors">
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
}

CardCourse.propTypes = {
  id: PropTypes.string,
  imageUrl: PropTypes.string,
  category: PropTypes.string,
  title: PropTypes.string
};
