import React from "react";
import { useLoaderData } from "react-router-dom";

export default function Students() {
  const overview = useLoaderData();

  return (
    <section
      id="LatestStudents"
      className="flex flex-col h-full rounded-[30px] p-[30px] gap-[20px] bg-white dark:bg-white/5 shadow-[0_4px_4px_0_#E0E2EF] dark:shadow-none border border-transparent dark:border-white/10 transition-colors duration-300">
      <h2 className="font-extrabold text-[22px] leading-[33px] text-gray-900 dark:text-white">Latest Students</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 m-auto w-full">
        {overview?.students?.slice(0, 4).map((student) => (
          <div
            key={student._id}
            className="w-full bg-[#F8FAFB] dark:bg-white/10 rounded-[20px] p-3 flex flex-col items-center justify-center shadow-[0_2px_6px_0_#E0E2EF] dark:shadow-none hover:shadow-[0_4px_12px_0_#D5D8E6] dark:hover:bg-white/20 border border-transparent dark:border-white/10 transition-all duration-300">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[16px] sm:rounded-[20px] overflow-hidden mb-2 bg-gray-200 dark:bg-gray-700">
              <img src={student.photo_url || student.avatar} className="w-full h-full object-cover" alt={student.name || 'Student'} />
            </div>

            <p className="font-bold text-sm sm:text-base text-center text-gray-900 dark:text-white truncate w-full px-1">{student.name}</p>

            <div className="flex items-center gap-1 sm:gap-1.5 mt-1 sm:mt-2">
              <img src="/assets/images/icons/crown-blue.svg" className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <p className="text-[#838C9D] dark:text-gray-400 text-[11px] sm:text-[13px] text-nowrap">{student.courses?.length ?? 0} Courses</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
