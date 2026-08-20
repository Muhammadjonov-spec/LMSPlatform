import React from "react";
import CardCourse from "./CardCourse";
import { useLoaderData, Link } from "react-router-dom";
import { STRORAGE_KEY } from "../../../utils/const";
import secureLocalStorage from "react-secure-storage";
import { getImageUrl } from "../../../utils/helpers";

export default function StudentPage() {
  const courses = useLoaderData();
  const session = secureLocalStorage.getItem(STRORAGE_KEY);
  const userName = session?.name || "Student";

  return (
    <div className="flex flex-col gap-8 w-full p-2 lg:p-6 bg-[#F8FAFB] min-h-screen">
      {/* Welcome Banner */}
      <div className="bg-[#1E40AF] rounded-[24px] p-8 md:p-10 text-white relative overflow-hidden flex flex-col md:flex-row justify-between items-center shadow-lg">
        <div className="z-10 flex flex-col gap-2 w-full md:w-2/3">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Hello, {userName}!</h1>
          <p className="text-blue-100 text-lg md:text-xl opacity-90 max-w-xl">
            What are we learning today? Continue your lessons and reach new milestones.
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-20 hidden md:block">
          <span className="material-symbols-rounded" style={{ fontSize: '300px' }}>school</span>
        </div>
        
        <div className="z-10 mt-8 md:mt-0 bg-white/20 backdrop-blur-md rounded-2xl p-6 flex gap-8 border border-white/20 w-full md:w-auto">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-extrabold">{courses?.length || 0}</span>
            <span className="text-sm text-blue-100 font-medium">Active Courses</span>
          </div>
          <div className="w-px h-12 bg-white/30"></div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-extrabold">0</span>
            <span className="text-sm text-blue-100 font-medium">Certificates</span>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-2xl text-gray-900">My Courses</h2>
          <Link to="/" className="px-5 py-2.5 bg-white border border-[#1E40AF] text-[#1E40AF] rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center gap-2">
            Browse Courses
          </Link>
        </div>
        
        {courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((item) => (
              <CardCourse 
                key={item._id} 
                category={item.category?.name || "Other"} 
                title={item.name} 
                id={item._id} 
                imageUrl={getImageUrl(item.thumbnail || item.thumbnail_url)} 
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[20px] p-12 flex flex-col items-center justify-center text-center border border-dashed border-gray-300">
            <span className="material-symbols-rounded text-gray-300 mb-4" style={{ fontSize: '64px' }}>library_books</span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-500 max-w-md mb-6">You haven't enrolled in any courses yet. Choose one from our catalog to get started.</p>
            <a href="/" className="px-6 py-3 bg-[#1E40AF] text-white rounded-xl font-bold hover:bg-[#1e3a8a] transition-colors">
              Explore Courses
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
