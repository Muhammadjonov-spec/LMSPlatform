import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import { getImageUrl } from "../../../utils/helpers";

export default function Courses() {
  const overview = useLoaderData();

  const courses = overview?.courses?.slice(0, 6) ?? [];

  return (
    <section id="LatestCourse" className="flex flex-col w-full rounded-[30px] p-[30px] gap-[30px] bg-[#F8FAFB] dark:bg-white/5 border border-transparent dark:border-white/10 shadow-sm transition-colors duration-300">
      <h2 className="font-extrabold text-[22px] leading-[33px] text-gray-900 dark:text-white">Latest Courses</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((item) => (
          <div
            key={item._id}
            className="flex items-center gap-5 p-4 bg-white dark:bg-white/10 rounded-2xl border border-gray-100 dark:border-white/10 shadow-[0_2px_6px_0_#E0E2EF] dark:shadow-none hover:shadow-[0_4px_12px_0_#D5D8E6] dark:hover:bg-white/20 transition-all duration-300"
          >
            <div className="flex shrink-0 w-[90px] h-[70px] rounded-[16px] bg-[#D9D9D9] dark:bg-gray-800 overflow-hidden">
              <img src={getImageUrl(item.thumbnail || item.thumbnail_url)} className="w-full h-full object-cover" alt="thumbnail" />
            </div>

            <div className="flex flex-col flex-1 overflow-hidden">
              <Link to={`/manager/courses/${item._id}`} className="font-bold text-lg leading-[24px] line-clamp-1 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                {item.name}
              </Link>

              <div className="flex items-center gap-[6px] mt-[6px]">
                <img src="/assets/images/icons/crown-blue.svg" alt="category" className="w-4 h-4" />
                <p className="text-[#838C9D] dark:text-gray-400 text-sm truncate">{item.category?.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
