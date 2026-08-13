import React, { useRef, useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
    formState: { errors },
    setValue
  } = useForm({
    resolver: zodResolver(isEditMode ? updateCourseSchema : createCourseSchema),
    defaultValues: {
      name: data?.course?.name ?? "",
      tagline: data?.course?.tagline ?? "",
      categoryId: data?.course?.category?._id ?? data?.course?.categoryId ?? "",
      description: data?.course?.description ?? ""
    }
  });

  useEffect(() => {
    const categoryId = data?.course?.category?._id ?? data?.course?.categoryId ?? "";
    if (categoryId) setValue("categoryId", String(categoryId));
  }, [data?.course, setValue]);

  const [file, setFile] = useState(null);
  const inputFileRef = useRef(null);

  const mutateCreate = useMutation({
    mutationFn: (payload) => createCourse(payload)
  });

  const mutateUpdate = useMutation({
    mutationFn: (payload) => updateCourse(payload, id)
  });

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      if (file) formData.append("thumbnail", file);
      formData.append("tagline", values.tagline);
      formData.append("categoryId", String(values.categoryId));
      formData.append("description", values.description);

      if (isEditMode) {
        await mutateUpdate.mutateAsync(formData);
      } else {
        await mutateCreate.mutateAsync(formData);
      }

      navigate("/manager/courses");
    } catch (error) {
      console.error(error);
    }
  };

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
                className="w-full outline-none bg-transparent font-semibold placeholder:font-normal"
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
                className="w-full outline-none bg-transparent font-semibold placeholder:font-normal"
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
                {data?.categories?.data?.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <span className="text-[#FF435A] text-sm">{errors?.categoryId?.message}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-semibold">Add a Thumbnail</label>

          <div className="relative h-[220px] w-full border border-[#CFDBEF] rounded-[20px] overflow-hidden bg-white">
            {file ? (
              <img
                src={URL.createObjectURL(file)}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => inputFileRef?.current?.click()}
              />
            ) : (
              <button
                type="button"
                onClick={() => inputFileRef?.current?.click()}
                className="w-full h-full flex flex-col items-center justify-center gap-3 text-[#838C9D]">
                <img src="/assets/images/icons/gallery-add-black.svg" className="w-6" />
                <span>Add an attachment</span>
              </button>
            )}
          </div>

          <input
            ref={inputFileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files) {
                setFile(e.target.files[0]);
                setValue("thumbnail", e.target.files[0]);
              }
            }}
          />

          <span className="text-[#FF435A] text-sm">{errors?.thumbnail?.message}</span>
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
            disabled={isEditMode ? mutateUpdate.isLoading : mutateCreate.isLoading}
            className="w-full rounded-full py-4 font-semibold text-white bg-[#1E40AF]">
            {isEditMode ? "Edit" : "Add"} Now
          </button>
        </div>
      </form>
    </>
  );
}
