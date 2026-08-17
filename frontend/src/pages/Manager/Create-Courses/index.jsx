import React, { useRef, useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { createCourseSchema, updateCourseSchema } from "../../../utils/zodSchema";
import { useMutation } from "@tanstack/react-query";
import { createCourse, updateCourse } from "../../../services/courseService";

export default function ManageCreateCoursePage() {
  const data = useLoaderData();
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = !!data?.course;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue
  } = useForm({
    resolver: zodResolver(isEditMode ? updateCourseSchema : createCourseSchema),
    defaultValues: {
      name: data?.course?.name ?? "",
      tagline: data?.course?.tagline ?? "",
      categoryId: data?.course?.category?._id ?? data?.course?.categoryId ?? "",
      description: data?.course?.description ?? "",
      isFree: data?.course?.isFree ?? false,
      price: data?.course?.price ? String(data?.course?.price) : ""
    }
  });

  const isFree = useWatch({ control, name: "isFree" });

  useEffect(() => {
    const categoryId = data?.course?.category?._id ?? data?.course?.categoryId ?? "";
    if (categoryId) setValue("categoryId", String(categoryId));
  }, [data?.course, setValue]);

  const [file, setFile] = useState(null);
  const inputFileRef = useRef(null);

  const [uploadProgress, setUploadProgress] = useState(0);

  const mutateCreate = useMutation({
    mutationFn: (payload) => createCourse(payload, (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      setUploadProgress(percentCompleted);
    })
  });

  const mutateUpdate = useMutation({
    mutationFn: (payload) => updateCourse(payload, id, (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      setUploadProgress(percentCompleted);
    })
  });

  const onSubmit = async (values) => {
    try {
      setUploadProgress(0);
      const formData = new FormData();
      formData.append("name", values.name);
      if (file) formData.append("previewVideo", file);
      formData.append("tagline", values.tagline);
      formData.append("categoryId", String(values.categoryId));
      formData.append("description", values.description);
      formData.append("isFree", values.isFree);
      formData.append("price", values.price || 0);

      if (isEditMode) {
        await mutateUpdate.mutateAsync(formData);
        navigate("/manager/courses");
      } else {
        const result = await mutateCreate.mutateAsync(formData);
        const newCourseId = result?.data?._id || result?._id;
        if(newCourseId) {
          navigate(`/manager/courses/${newCourseId}`);
        } else {
          navigate("/manager/courses");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const isPending = mutateCreate.isPending || mutateUpdate.isPending;

  return (
    <>
      <header className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-extrabold text-[28px] leading-[42px]">{isEditMode ? "Edit" : "Add"} Course</h1>
          <p className="text-[#838C9D] mt-[2px]">
            {isEditMode ? "Update existing course details" : "Create new future for company"}
          </p>
        </div>

        <button className="rounded-[16px] border border-[#060A23] px-5 py-3 font-semibold">Import</button>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl bg-[#F8FAFB] rounded-[30px] p-10 mx-auto flex flex-col gap-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <label className="font-semibold">Course Name</label>

            <div className="flex items-center w-full border border-[#CFDBEF] rounded-[14px] px-4 h-[52px] gap-3 bg-white">
              <div className="w-10 h-10 rounded-xl bg-[#F2F4F7] flex items-center justify-center">
                <img src="/assets/images/icons/note-favorite-black.svg" className="w-5" />
              </div>

              <input
                {...register("name")}
                placeholder="Write better name for your course"
                className="w-full outline-none bg-transparent font-semibold placeholder:font-normal text-ellipsis overflow-hidden whitespace-nowrap"
              />
            </div>
            <span className="text-[#FF435A] text-sm">{errors?.name?.message}</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold">Course Tagline</label>

            <div className="flex items-center w-full border border-[#CFDBEF] rounded-[14px] px-4 h-[52px] gap-3 bg-white">
              <div className="w-10 h-10 rounded-xl bg-[#F2F4F7] flex items-center justify-center">
                <img src="/assets/images/icons/bill-black.svg" className="w-5" />
              </div>

              <input
                {...register("tagline")}
                placeholder="Write tagline for better copy"
                className="w-full outline-none bg-transparent font-semibold placeholder:font-normal text-ellipsis overflow-hidden whitespace-nowrap"
              />
            </div>
            <span className="text-[#FF435A] text-sm">{errors?.tagline?.message}</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-semibold">Select Category</label>

            <div className="flex items-center w-full border border-[#CFDBEF] rounded-[14px] px-4 h-[52px] gap-3 bg-white">
              <div className="w-10 h-10 rounded-xl bg-[#F2F4F7] flex items-center justify-center">
                <img src="/assets/images/icons/bill-black.svg" className="w-5" />
              </div>

              <select {...register("categoryId")} className="w-full outline-none bg-transparent font-semibold">
                <option value="">Choose one category</option>
                {(data?.categories?.data || data?.categories || []).map((item) => (
                  <option key={item._id || item.id} value={item._id || item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-[#FF435A] text-sm">{errors?.categoryId?.message}</span>
          </div>

          <div className="flex flex-col gap-4">
            <label className="font-semibold">Course Pricing</label>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="isFree" 
                {...register("isFree")} 
                className="w-5 h-5 rounded border-[#CFDBEF]" 
              />
              <label htmlFor="isFree" className="font-medium cursor-pointer">This course is free</label>
            </div>

            {!isFree && (
              <div className="flex items-center w-full border border-[#CFDBEF] rounded-[14px] px-4 h-[52px] gap-3 bg-white">
                <span className="font-bold text-gray-500">$</span>
                <input
                  type="number"
                  {...register("price")}
                  placeholder="Enter price"
                  className="w-full outline-none bg-transparent font-semibold placeholder:font-normal"
                />
              </div>
            )}
            <span className="text-[#FF435A] text-sm">{errors?.price?.message}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold">Add a Preview Video</label>

          <div className="relative h-[220px] w-full border border-[#CFDBEF] rounded-[20px] overflow-hidden bg-white">
            {file ? (
              <video
                src={URL.createObjectURL(file)}
                controls
                className="w-full h-full object-cover cursor-pointer bg-black"
                onClick={(e) => { e.preventDefault(); inputFileRef?.current?.click(); }}
              />
            ) : (
              <button
                type="button"
                onClick={() => inputFileRef?.current?.click()}
                className="w-full h-full flex flex-col items-center justify-center gap-3 text-[#838C9D]">
                <img src="/assets/images/icons/gallery-add-black.svg" className="w-6" />
                <span>Upload preview video</span>
              </button>
            )}
          </div>

          <input
            ref={inputFileRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                setFile(e.target.files[0]);
                setValue("previewVideo", e.target.files[0]);
              }
            }}
          />

          <span className="text-[#FF435A] text-sm">{errors?.previewVideo?.message}</span>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold">Description</label>

          <div className="flex items-start gap-3 border border-[#CFDBEF] rounded-[20px] p-4 bg-white">
            <div className="w-10 h-10 rounded-xl bg-[#F2F4F7] flex items-center justify-center">
              <img src="/assets/images/icons/note-favorite-black.svg" className="w-5" />
            </div>

            <textarea
              {...register("description")}
              rows={5}
              placeholder="Explain what this course about"
              className="w-full outline-none bg-transparent font-semibold placeholder:font-normal"
            />
          </div>

          <span className="text-[#FF435A] text-sm">{errors?.description?.message}</span>
        </div>

        <div className="flex gap-5">
          <button type="button" className="w-full rounded-full border border-[#060A23] py-4 font-semibold bg-white">
            Save as Draft
          </button>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-full py-4 font-semibold text-white bg-[#1E40AF]">
            {isEditMode ? "Edit" : "Add"} Now
          </button>
        </div>
      </form>

      {/* Upload Progress Modal */}
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 border-4 border-gray-100 border-t-[#1E40AF] rounded-full animate-spin mb-4"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Yuklanmoqda...</h3>
            <p className="text-sm text-gray-500 mb-6">Iltimos, oyna yopilguncha kuting. Video hajmi kattaligi sababli bu biroz vaqt olishi mumkin.</p>
            
            {uploadProgress > 0 && (
              <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden relative">
                <div 
                  className="bg-[#1E40AF] h-full transition-all duration-300 ease-out" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">
                  {uploadProgress}%
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
