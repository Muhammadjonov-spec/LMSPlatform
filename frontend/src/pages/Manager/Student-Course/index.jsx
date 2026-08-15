import React from "react";
import { Link, useLoaderData, useParams } from "react-router-dom";
import StudentItem from "./student-item";

export default function StudentsCourseList() {
  const { id } = useParams();

  const course = useLoaderData();
  console.log(course);

  return (
    <>
      <header className="flex items-center justify-between gap-[30px]">
        <div>
          <h1 className="font-extrabold text-[28px] leading-[42px]">Manage Students</h1>
          <p className="text-[#838C9D] mt-[1]">Keep your employee or student happy</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="#" className="w-fit rounded-[16px] border border-[#060A23] p-[14px_20px] font-semibold text-nowrap">
            Import File
          </Link>
          <Link
            to={`/manager/courses/students/${id}/add`}
            className="w-fit rounded-[16px] p-[14px_20px] font-semibold text-[#FFFFFF] bg-[#1E40AF] text-nowrap">
            Add Student
          </Link>
        </div>
      </header>
      <section id="CourseList" className="flex flex-col w-full rounded-[30px] p-[30px] gap-[30px] bg-[#F8FAFB]">
        {course?.students?.map((item) => (
          <StudentItem key={item._id} id={item._id} name={item.name} imageUrl={item.photo_url ?? null} />
        ))}

        <div id="Pagination" className="flex items-center gap-3">
          <button
            type="button"
            className="flex shrink-0 w-9 h-9 rounded-full items-center justify-center text-center transition-all duration-300 hover:bg-[#1E40AF] hover:text-white hover:border-0 bg-[#1E40AF] text-white">
            <span className="font-semibold text-sm leading-[21px]">1</span>
          </button>
          <button
            type="button"
            className="flex shrink-0 w-9 h-9 rounded-full items-center justify-center text-center transition-all duration-300 hover:bg-[#1E40AF] hover:text-white hover:border-0 border border-[#060A23]">
            <span className="font-semibold text-sm leading-[21px]">2</span>
          </button>
          <button
            type="button"
            className="flex shrink-0 w-9 h-9 rounded-full items-center justify-center text-center transition-all duration-300 hover:bg-[#1E40AF] hover:text-white hover:border-0 border border-[#060A23]">
            <span className="font-semibold text-sm leading-[21px]">3</span>
          </button>
          <button
            type="button"
            className="flex shrink-0 w-9 h-9 rounded-full items-center justify-center text-center transition-all duration-300 hover:bg-[#1E40AF] hover:text-white hover:border-0 border border-[#060A23]">
            <span className="font-semibold text-sm leading-[21px]">4</span>
          </button>
          <button
            type="button"
            className="flex shrink-0 w-9 h-9 rounded-full items-center justify-center text-center transition-all duration-300 hover:bg-[#1E40AF] hover:text-white hover:border-0 border border-[#060A23]">
            <span className="font-semibold text-sm leading-[21px]">5</span>
          </button>
        </div>
      </section>
    </>
  );
}
