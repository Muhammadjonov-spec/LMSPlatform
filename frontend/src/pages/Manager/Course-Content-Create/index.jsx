import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mutateContentSchema } from "../../../utils/zodSchema";
import { useMutation } from "@tanstack/react-query";
import { createContent, updateContent } from "../../../services/courseService";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";

export default function ManageCourseContentCreatePage() {
  const content = useLoaderData();
  const { id, contentId } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(mutateContentSchema),
    defaultValues: {
      title: content?.title,
      type: content?.type,
      youtubeId: content?.youtubeId,
      text: content?.text
    }
  });

  const mutateCreate = useMutation({
    mutationFn: (data) => createContent(data)
  });

  const mutateUpdate = useMutation({
    mutationFn: (data) => updateContent(data, contentId)
  });

  const onSubmit = async (values) => {
    try {
      if (content === undefined) {
        await mutateCreate.mutateAsync({
          ...values,
          courseId: id
        });
      } else {
        await mutateUpdate.mutateAsync({
          ...values,
          courseId: id
        });
      }

      navigate(`/manager/courses/${id}`);
    } catch (error) {
      console.log(error);
    }
  };

  const type = watch("type");

  return (
    <>
      <div id="Breadcrumb" className="flex items-center gap-5 *:after:content-['/'] *:after:ml-5">
        <span className="last-of-type:after:content-[''] last-of-type:font-semibold">Manage Course</span>
        <span className="last-of-type:after:content-[''] last-of-type:font-semibold">Course</span>
        <span className="last-of-type:after:content-[''] last-of-type:font-semibold">
          {content === undefined ? "Add" : "Edit"} Content
        </span>
      </div>
      <header className="flex items-center justify-between gap-[30px]">
        <div className="flex items-center gap-[30px]">
          <div>
            <h1 className="font-extrabold text-[28px] leading-[42px]">{content === undefined ? "Add" : "Edit"} Content</h1>
            <p className="text-[#838C9D] mt-[1]">Give a best content for the course</p>
          </div>
        </div>
      </header>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-[930px] rounded-[30px] p-[30px] gap-[30px] bg-[#F8FAFB]">
        <div className="flex flex-col gap-[10px]">
          <label htmlFor="title" className="font-semibold">
            Content Title
          </label>
          <div className="flex items-center w-full rounded-full border border-[#CFDBEF] gap-3 px-5 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#1E40AF]">
            <img src="/assets/images/icons/note-favorite-black.svg" className="w-6 h-6" alt="icon" />
            <input
              {...register("title")}
              type="text"
              id="title"
              className="appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#838C9D] !bg-transparent"
              placeholder="Write better name for your course"
            />
          </div>
          <span className="error-message text-[#FF435A]">{errors?.title?.message}</span>
        </div>
        <div className="flex flex-col gap-[10px]">
          <label htmlFor="type" className="font-semibold">
            Select Type
          </label>
          <div className="flex items-center w-full rounded-full border border-[#CFDBEF] gap-3 px-5 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#1E40AF]">
            <img src="/assets/images/icons/crown-black.svg" className="w-6 h-6" alt="icon" />
            <select
              {...register("type")}
              id="type"
              defaultValue={content?.type || ""}
              className="appearance-none outline-none w-full py-3 px-2 -mx-2 font-semibold placeholder:font-normal placeholder:text-[#838C9D] !bg-transparent">
              <option value="" hidden>
                Choose content type
              </option>
              <option value="video">Video</option>
              <option value="text">Text</option>
            </select>
            <img src="/assets/images/icons/arrow-down.svg" className="w-6 h-6" alt="icon" />
          </div>
          <span className="error-message text-[#FF435A]">{errors?.type?.message}</span>
        </div>
        {type === "video" && (
          <div className="flex flex-col gap-[10px]">
            <label htmlFor="video" className="font-semibold">
              Youtube Video ID
            </label>
            <div className="flex items-center w-full rounded-full border border-[#CFDBEF] gap-3 px-5 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#1E40AF]">
              <img src="/assets/images/icons/bill-black.svg" className="w-6 h-6" alt="icon" />
              <input
                {...register("youtubeId")}
                type="text"
                id="video"
                className="appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal placeholder:text-[#838C9D] !bg-transparent"
                placeholder="Write tagline for better copy"
              />
            </div>
            <span className="error-message text-[#FF435A]">{errors?.youtubeId?.message}</span>
          </div>
        )}
        {type === "text" && (
          <div className="flex flex-col gap-[10px]">
            <label className="font-semibold">Content Text</label>
            <div className="p-5">
              <h2 className="font-bold mb-3">{content === undefined ? "Add" : "Edit"} Content Text</h2>
              <CKEditor
                editor={ClassicEditor}
                config={{
                  placeholder: "Start writing your course content here..."
                }}
                data={watch("text") || ""}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setValue("text", data);
                }}
              />
            </div>
            <span className="error-message text-[#FF435A]">{errors?.text?.message}</span>
          </div>
        )}

        <div className="flex items-center gap-[14px]">
          <button type="button" className="w-full rounded-full border border-[#060A23] p-[14px_20px] font-semibold text-nowrap">
            Save as Draft
          </button>
          <button
            type="submit"
            disabled={content === undefined ? mutateCreate.isLoading : mutateUpdate.isLoading}
            className="w-full rounded-full p-[14px_20px] font-semibold text-[#FFFFFF] bg-[#1E40AF] text-nowrap">
            {content === undefined ? "Add" : "Edit"} Content Now
          </button>
        </div>
      </form>
    </>
  );
}
