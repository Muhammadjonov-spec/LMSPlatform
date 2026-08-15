import React, { useState } from "react";
import ContentText from "./content-text";
import ContentVideo from "./content-video";
import { Link, useLoaderData, useParams, useNavigate } from "react-router-dom";

export default function ManageCoursePreviewPage({ isAdmin = true }) {
  const course = useLoaderData();
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeContent, setActiveContent] = useState(course?.details?.[0]);

  const handleChangeContent = (content) => {
    setActiveContent(content);
  };

  const handleNextContent = (content) => {
    const currIndex = course?.details?.findIndex((val) => val._id === content._id);
    if (currIndex < course?.details?.length - 1) {
      handleChangeContent(course.details[currIndex + 1]);
    }
  };

  const isActive = (item) => activeContent?._id === item._id;

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 h-[70px] flex items-center px-4 md:px-8 justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(isAdmin ? `/manager/courses/${id}` : "/student")} 
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
          >
            <span className="material-symbols-rounded">arrow_back</span>
          </button>
          <h1 className="font-bold text-lg text-gray-900 hidden sm:block">{course?.name}</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
            <span className="material-symbols-rounded text-[#1E40AF] text-sm">emoji_events</span>
            <span className="text-sm font-semibold text-[#1E40AF]">0 / {course?.details?.length || 0}</span>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 max-w-[1600px] w-full mx-auto relative">
        {/* Main Content Area (Video) */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 w-full lg:max-w-[70%]">
          <div className="max-w-5xl mx-auto w-full">
            {activeContent?.type === "text" ? (
              <ContentText content={activeContent} handleNext={handleNextContent} />
            ) : (
              <ContentVideo content={activeContent} handleNext={handleNextContent} />
            )}
          </div>
        </main>

        {/* Sidebar (Playlist) */}
        <aside className="w-full lg:w-[30%] lg:min-w-[350px] bg-white border-l border-gray-200 lg:h-[calc(100vh-70px)] lg:sticky lg:top-[70px] flex flex-col">
          <div className="p-6 border-b border-gray-200 flex-shrink-0">
            <h2 className="font-bold text-xl text-gray-900">Course Contents</h2>
            <div className="w-full bg-gray-100 rounded-full h-2 mt-4 overflow-hidden">
              <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: '0%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-right">0% completed</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            <div className="flex flex-col gap-3">
              {course?.details?.map((item, index) => (
                <button 
                  key={item._id} 
                  type="button" 
                  onClick={() => handleChangeContent(item)}
                  className={`
                    w-full text-left rounded-xl p-4 transition-all duration-200 border
                    flex items-start gap-4 group
                    ${isActive(item) 
                      ? "bg-blue-50 border-blue-200 shadow-sm" 
                      : "bg-white border-gray-100 hover:border-blue-300 hover:shadow-sm"
                    }
                  `}
                >
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                    ${isActive(item) ? "bg-[#1E40AF] text-white" : "bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-[#1E40AF]"}
                  `}>
                    {isActive(item) ? (
                      <span className="material-symbols-rounded text-sm">play_arrow</span>
                    ) : (
                      <span className="text-xs font-bold">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold text-sm leading-tight mb-1 ${isActive(item) ? "text-[#1E40AF]" : "text-gray-800"}`}>
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="material-symbols-rounded text-[14px]">
                        {item.type === "video" ? "play_circle" : "article"}
                      </span>
                      <span>{item.type === "video" ? "Video Lesson" : "Text Lesson"}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
