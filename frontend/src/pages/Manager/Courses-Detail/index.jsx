import React, { useRef, useState } from "react";
import TableContent from "./table-content";
import { Link, useLoaderData, useParams, useRevalidator } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { updateThumbnail } from "../../../services/courseService";

export default function ManageCourseDetailPage() {
  const { id } = useParams();

  const course = useLoaderData();
  const revalidator = useRevalidator();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const { mutateAsync: uploadThumb } = useMutation({
    mutationFn: (data) => updateThumbnail(data, id),
    onSuccess: () => {
      revalidator.revalidate();
      setIsUploading(false);
    },
    onError: (err) => {
      setIsUploading(false);
      alert(err?.response?.data?.message || "Error uploading image");
    }
  });

  const handleThumbnailClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("thumbnail", file);
    await uploadThumb(formData);
  };

  const getImageUrl = (path) => {
    if (!path) return "/assets/images/placeholder.png";
    if (path.startsWith("http")) return path;
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || "http://localhost:5000";
    return `${baseUrl}/${path.replace(/\\/g, '/')}`;
  };

  return (
    <>
      <div id="Breadcrumb" className="flex items-center gap-5 *:after:content-['/'] *:after:ml-5">
        <span className="last-of-type:after:content-[''] last-of-type:font-semibold">Dashboard</span>
        <span className="last-of-type:after:content-[''] last-of-type:font-semibold">Manage Course</span>
        <span className="last-of-type:after:content-[''] last-of-type:font-semibold">Details</span>
      </div>
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-[30px]">
        <div>
          <h1 className="font-extrabold text-[28px] leading-[42px]">{course?.title || course?.name}</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <Link
            to={`/manager/courses/edit/${id}`}
            className="w-full sm:w-fit rounded-[16px] border border-[#060A23] p-[14px_20px] font-semibold text-center">
            Edit Course
          </Link>
          <Link
            to={`/manager/courses/${id}/preview`}
            className="w-full sm:w-fit rounded-[16px] p-[14px_20px] font-semibold text-[#FFFFFF] bg-[#1E40AF] text-center">
            Preview
          </Link>
        </div>
      </header>
      <section id="CourseInfo" className="flex flex-col lg:flex-row gap-5 lg:gap-[50px]">
        <div 
          id="Thumbnail" 
          onClick={handleThumbnailClick}
          className="flex shrink-0 w-full lg:w-[480px] h-[250px] rounded-[20px] bg-[#D9D9D9] overflow-hidden relative cursor-pointer group"
        >
          <img src={getImageUrl(course?.thumbnail || course?.thumbnail_url)} className="w-full h-full object-cover transition-opacity group-hover:opacity-70" alt="thumbnail" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
            <span className="text-white font-bold">{isUploading ? "Uploading..." : "Change Image"}</span>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
        <div className="grid grid-cols-2 gap-5 w-full">
          <div className="flex flex-col rounded-[20px] border border-[#CFDBEF] p-5 gap-4">
            <img src="/assets/images/icons/profile-2user-blue.svg" className="w-8 h-8" alt="icon" />
            <p className="font-semibold">{course?.students?.length || 0} Students</p>
          </div>
          <div className="flex flex-col rounded-[20px] border border-[#CFDBEF] p-5 gap-4">
            <img src="/assets/images/icons/crown-blue.svg" className="w-8 h-8" alt="icon" />
            <p className="font-semibold">{course?.category?.name || "Uncategorized"}</p>
          </div>
          <div className="flex flex-col rounded-[20px] border border-[#CFDBEF] p-5 gap-4">
            <img src="/assets/images/icons/note-favorite-blue.svg" className="w-8 h-8" alt="icon" />
            <p className="font-semibold">{course?.modules?.length || 0} Modules</p>
          </div>
          <div className="flex flex-col rounded-[20px] border border-[#CFDBEF] p-5 gap-4">
            <img src="/assets/images/icons/cup-blue.svg" className="w-8 h-8" alt="icon" />
            <p className="font-semibold">Certificate</p>
          </div>
        </div>
      </section>
      <TableContent modules={course?.modules ?? []} courseId={course?._id} />
    </>
  );
}
