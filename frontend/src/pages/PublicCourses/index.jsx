import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { getPublicCourses, getCategories } from "../../services/courseService";

export default function PublicCourses() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, catRes] = await Promise.all([
          getPublicCourses(),
          getCategories()
        ]);
        if (courseRes && courseRes.data) setCourses(courseRes.data);
        if (catRes && catRes.data) setCategories(catRes.data);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchSearch = (course.name || course.title || "").toLowerCase().includes(searchQuery.toLowerCase());
    const courseCatId = course.category?._id || course.category?.id;
    const matchCat = selectedCategory === "All" || courseCatId === selectedCategory || course.category?.name === selectedCategory;
    return matchSearch && matchCat;
  });

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

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">Barcha Kurslar</h1>
          <p className="text-lg text-gray-600 mb-8">O'zingizga mos keladigan yo'nalishni tanlang va o'qishni boshlang!</p>
          
          <div className="max-w-2xl mx-auto mb-8 relative">
            <input 
              type="text" 
              placeholder="Kurslarni qidirish..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 pl-12 rounded-full border border-gray-300 focus:border-[#1E40AF] focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
            <span className="material-symbols-rounded absolute left-4 top-3.5 text-gray-400">search</span>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button 
              onClick={() => setSelectedCategory("All")}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${selectedCategory === "All" ? "bg-[#1E40AF] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
            >
              Barchasi
            </button>
            {categories.map(cat => {
              const catId = cat._id || cat.id;
              return (
              <button 
                key={catId}
                onClick={() => setSelectedCategory(catId)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${selectedCategory === catId ? "bg-[#1E40AF] text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"}`}
              >
                {cat.name}
              </button>
            )})}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <Link key={course._id || course.id} to={`/courses/${course._id || course.id}`} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all group flex flex-col">
              <div className="relative h-48 overflow-hidden">
                <img src={course.thumbnail_url || course.image || "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60"} alt={course.name || course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black bg-opacity-10 group-hover:bg-opacity-0 transition-all"></div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-[#1E40AF] bg-blue-50 px-2 py-1 rounded-md">{course.category?.name || "Yangi"}</span>
                  <div className="flex items-center text-sm text-yellow-500">
                    <span className="material-symbols-rounded text-base mr-1">star</span>
                    <span>{course.rating || 4.8}</span>
                    <span className="text-gray-400 ml-1">({course.students?.length || 1250})</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight line-clamp-2">{course.name || course.title}</h3>
                <p className="text-sm text-gray-500 mb-4 flex-1">Mentor: {course.instructor || "EduStack Mentor"}</p>
                
                <div className="border-t border-gray-100 pt-4 flex justify-between items-center mt-auto">
                  <span className="font-extrabold text-lg text-gray-900">{course.price ? course.price.toLocaleString() : 0} UZS</span>
                  <button className="bg-gray-50 text-[#1E40AF] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1E40AF] hover:text-white transition-colors">
                    Batafsil
                  </button>
                </div>
              </div>
            </Link>
          ))}
          {loading && <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-10 text-gray-500">Yuklanmoqda...</div>}
          {!loading && filteredCourses.length === 0 && (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-10 text-gray-500 border border-dashed border-gray-200 rounded-xl">
              Siz izlagan mezonlarga mos kurs topilmadi
            </div>
          )}
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
