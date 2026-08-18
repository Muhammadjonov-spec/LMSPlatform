import React, { useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContentSchema, updateContentSchema } from "../../../utils/zodSchema";
import { useMutation } from "@tanstack/react-query";
import { createLesson, updateContent } from "../../../services/courseService";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileVideo, faHeading, faCrown } from "@fortawesome/free-solid-svg-icons";

export default function ManageCourseContentCreatePage() {
  const content = useLoaderData();
  const { id, moduleId, contentId } = useParams();
  const navigate = useNavigate();
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(content === undefined ? createContentSchema : updateContentSchema),
    defaultValues: {
      title: content?.title,
      type: content?.type,
      text: content?.text
    }
  });

  const mutateCreate = useMutation({
    mutationFn: (data) => createLesson(data, id, moduleId, (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      setUploadProgress(percentCompleted);
    })
  });

  const mutateUpdate = useMutation({
    mutationFn: (data) => updateContent(data, contentId, (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      setUploadProgress(percentCompleted);
    })
  });

  const onSubmit = async (values) => {
    try {
      setUploadProgress(0);
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("type", values.type);

      if (values.type === "video") {
        if (values.video && values.video.length > 0) {
          formData.append("video", values.video[0]);
        }
      } else if (values.type === "text") {
        formData.append("text", values.text);
      }

      if (content === undefined) {
        await mutateCreate.mutateAsync(formData);
      } else {
        await mutateUpdate.mutateAsync(formData);
      }

      setTimeout(() => {
        navigate(`/manager/courses/${id}`);
      }, 500);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || error?.message || "An unexpected error occurred");
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
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-[30px]">
        <div className="flex items-center gap-[30px]">
          <div>
            <h1 className="font-extrabold text-[28px] leading-[42px]">{content === undefined ? "Add" : "Edit"} Content</h1>
            <p className="text-[#838C9D] mt-[1]">Give a best content for the course</p>
          </div>
        </div>
      </header>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full max-w-[930px] rounded-[30px] p-5 sm:p-[30px] gap-6 sm:gap-[30px] bg-white/50 dark:bg-black/20 backdrop-blur-md border border-white/20">
        <div className="flex flex-col gap-[10px]">
          <label htmlFor="title" className="font-semibold">
            Content Title
          </label>
          <div className="flex items-center w-full rounded-full border border-gray-300 dark:border-white/20 gap-3 px-5 transition-all duration-300 bg-white/50 dark:bg-black/30 focus-within:ring-2 focus-within:ring-[#1E40AF]">
            <FontAwesomeIcon icon={faHeading} className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <input
              {...register("title")}
              type="text"
              id="title"
              className="appearance-none outline-none w-full py-3 font-semibold placeholder:font-normal bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Write better name for your course"
            />
          </div>
          <span className="error-message text-[#FF435A]">{errors?.title?.message}</span>
        </div>
        <div className="flex flex-col gap-[10px]">
          <label htmlFor="type" className="font-semibold">
            Select Type
          </label>
          <div className="flex items-center w-full rounded-full border border-gray-300 dark:border-white/20 gap-3 px-5 transition-all duration-300 bg-white/50 dark:bg-black/30 focus-within:ring-2 focus-within:ring-[#1E40AF]">
            <FontAwesomeIcon icon={faCrown} className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <select
              {...register("type")}
              id="type"
              defaultValue={content?.type || ""}
              className="appearance-none outline-none w-full py-3 px-2 -mx-2 font-semibold bg-transparent text-gray-900 dark:text-white">
              <option value="" hidden>
                Choose content type
              </option>
              <option value="video" className="text-black">Video</option>
              <option value="text" className="text-black">Text</option>
            </select>
            <img src="/assets/images/icons/arrow-down.svg" className="w-6 h-6" alt="icon" />
          </div>
          <span className="error-message text-[#FF435A]">{errors?.type?.message}</span>
        </div>
        {type === "video" && (
          <div className="flex flex-col gap-[10px]">
            <label htmlFor="video" className="font-semibold">
              Upload Video (MP4)
            </label>
            <div className="flex items-center w-full rounded-full border border-gray-300 dark:border-white/20 gap-3 px-5 transition-all duration-300 bg-white/50 dark:bg-black/30 focus-within:ring-2 focus-within:ring-[#1E40AF]">
              <FontAwesomeIcon icon={faFileVideo} className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <input
                {...register("video")}
                type="file"
                id="video"
                accept="video/mp4,video/x-m4v,video/*"
                className="appearance-none outline-none w-full py-3 font-semibold bg-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1E40AF] file:text-white hover:file:bg-[#1e3a8a] cursor-pointer"
              />
            </div>
            {content?.videoUrl && <p className="text-sm text-green-500 mt-2">Video currently uploaded. Select a new one to replace.</p>}
            <span className="error-message text-[#FF435A]">{errors?.video?.message}</span>
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

        <div className="flex flex-col sm:flex-row items-center gap-[14px]">
          <button type="button" onClick={() => navigate(-1)} className="w-full sm:w-auto flex-1 rounded-full border border-[#060A23] p-[14px_20px] font-semibold text-center">
            Cancel
          </button>
          <button
            type="submit"
            disabled={content === undefined ? mutateCreate.isPending : mutateUpdate.isPending}
            className="w-full sm:w-auto flex-1 rounded-full p-[14px_20px] font-semibold text-[#FFFFFF] bg-[#1E40AF] text-center disabled:opacity-50">
            {content === undefined ? "Add" : "Edit"} Content Now
          </button>
        </div>
      </form>

      {/* Upload Progress Modal */}
      {(mutateCreate.isPending || mutateUpdate.isPending) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 border-4 border-gray-100 border-t-[#1E40AF] rounded-full animate-spin mb-4"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Uploading...</h3>
            <p className="text-sm text-gray-500 mb-6">Please wait until the window closes. Due to the large size of the video, this may take some time.</p>
            
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
