import React from "react";
import { useLoaderData } from "react-router-dom";

export default function Students() {
  const overview = useLoaderData();

  return (
    <section
      id="LatestStudents"
      className="flex flex-col h-[425px] rounded-[30px] p-[30px] gap-[20px] bg-white shadow-[0_4px_4px_0_#E0E2EF]">
      <h2 className="font-extrabold text-[22px] leading-[33px]">Latest Students</h2>

      <div className="grid grid-cols-4 m-auto gap-6">
        {overview?.students?.slice(0, 4).map((student) => (
          <div
            key={student._id}
            className="w-full  bg-[#F8FAFB] rounded-[20px] p-5 flex flex-col items-center shadow-[0_2px_6px_0_#E0E2EF] hover:shadow-[0_4px_12px_0_#D5D8E6] transition-shadow">
            <div className="w-20 h-20 rounded-[20px] overflow-hidden mb-3">
              <img src={student.photo_url} className="w-full h-full object-cover" alt={student.name} />
            </div>

            <p className="font-bold text-lg text-center line-clamp-1">{student.name}</p>

            <div className="flex items-center gap-2 mt-2">
              <img src="/assets/images/icons/crown-blue.svg" className="w-4 h-4" />
              <p className="text-[#838C9D] text-sm">{student.courses?.length ?? 0} Courses</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
