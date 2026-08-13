import React from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

export default function PublicCourseDetail() {
  const course = useLoaderData();
  const navigate = useNavigate();

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Course not found</h2>
        <Link to="/" className="text-[#1E40AF] underline">Go back to Home</Link>
      </div>
    );
  }

  // Fallbacks since mockData might not have these for courseDetail
  const price = course.price || 490000;
  const instructor = course.instructor || "Sardorbek";
  const rating = course.rating || 4.8;
  const students = course.students?.length || course.studentCount || 1250;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex-1">
              <Navbar />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">{course.name}</h1>
            <p className="text-lg text-gray-600 mb-6">{course.category?.name || "Programming"}</p>
            
            <div className="flex items-center gap-6 mb-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <img src="/assets/images/icons/profile-2user-blue.svg" className="w-5 h-5" alt="Instructor" />
                <span>Instructor: <span className="font-semibold text-gray-900">{instructor}</span></span>
              </div>
              <div className="flex items-center gap-1 text-yellow-500 font-semibold">
                <span className="material-symbols-rounded text-lg">star</span>
                {rating}
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-rounded text-gray-400">group</span>
                <span>{students} students enrolled</span>
              </div>
            </div>

            <div className="rounded-[20px] overflow-hidden mb-10 border border-gray-200 bg-white">
              <img 
                src={course.thumbnail_url || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60"} 
                alt={course.name} 
                className="w-full h-[400px] object-cover" 
              />
            </div>

            <div className="bg-white rounded-[20px] p-8 border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Syllabus</h2>
              {course.details && course.details.length > 0 ? (
                <ul className="flex flex-col gap-4">
                  {course.details.map((item, idx) => (
                    <li key={item._id || idx} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50">
                      <div className="w-10 h-10 shrink-0 rounded-full bg-blue-100 flex items-center justify-center text-[#1E40AF] font-bold">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{item.title}</h4>
                        {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No syllabus available for this course yet.</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-[20px] border border-gray-200 p-8 shadow-lg sticky top-24">
              <div className="text-center mb-6">
                <h3 className="text-gray-500 font-medium mb-2">Price</h3>
                <div className="text-4xl font-extrabold text-gray-900">{price.toLocaleString()} UZS</div>
              </div>

              <ul className="flex flex-col gap-4 mb-8">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-rounded text-green-500">check_circle</span>
                  <span className="text-gray-600">Full lifetime access</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-rounded text-green-500">check_circle</span>
                  <span className="text-gray-600">Access on mobile and desktop</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-rounded text-green-500">check_circle</span>
                  <span className="text-gray-600">Certificate of completion</span>
                </li>
              </ul>

              <button 
                onClick={() => navigate(`/checkout/${course._id}`)}
                className="w-full py-4 rounded-xl bg-[#1E40AF] text-white font-bold text-lg hover:bg-blue-800 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-1">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-[#1E40AF] text-white pt-10 pb-6 px-4 md:px-8 mt-auto">
        <div className="max-w-[1200px] mx-auto text-center text-sm text-blue-200">
          <p>&copy; 2026 EduStack LMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
