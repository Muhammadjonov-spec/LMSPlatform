import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { createStudentSchema, updateStudentSchema } from "../../../utils/zodSchema";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createStudents, updateStudents } from "../../../services/studentServices";

export default function ManageStudentCreatePage() {
  const student = useLoaderData();

  console.log(student);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    resolver: zodResolver(student === undefined ? createStudentSchema : updateStudentSchema),
    defaultValues: {
      name: student?.name,
      email: student?.email
    }
  });

  const mutateCreate = useMutation({
    mutationFn: (data) => createStudents(data)
  });

  const mutateUpdate = useMutation({
    mutationFn: (data) => updateStudents(data, student?._id)
  });

  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const inputFileRef = useRef(null);

  const onSubmit = async (values) => {
    try {
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("avatar", file);

      if (student === undefined) {
        await mutateCreate.mutateAsync(formData);
      } else {
        await mutateUpdate.mutateAsync(formData);
      }

      navigate("/manager/students");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <header className="flex items-center justify-between gap-[30px]">
        <div>
          <h1 className="font-extrabold text-[28px] leading-[42px]">{student === undefined ? "Add" : "Edit"} Student</h1>
          <p className="text-[#838C9D] mt-[1px]">
            {student === undefined ? "Register a new student" : "Update existing student"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="#" className="w-fit rounded-[16px] border border-[#060A23] p-[14px_20px] font-semibold text-nowrap">
            Import
          </Link>
        </div>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-[550px] rounded-[30px] p-[30px] gap-[30px] bg-[#F8FAFB] m-auto">
        <div className="flex flex-col gap-[10px]">
          <label className="font-semibold">{student === undefined ? "Add" : "Edit"} Avatar</label>

          <div
            className="relative flex w-full h-[200px] rounded-[20px] border border-[#CFDBEF] overflow-hidden cursor-pointer"
            onClick={() => inputFileRef.current?.click()}>
            {file === null && !student?.photo_url && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <img src="/assets/images/icons/gallery-add-black.svg" className="w-6 h-6" alt="upload" />
                <span className="text-[#838C9D]">Add student avatar</span>
              </div>
            )}

            {(file !== null || student?.photo_url) && (
              <img
                src={file ? URL.createObjectURL(file) : student.photo_url}
                className="w-full h-full object-cover"
                alt="avatar"
              />
            )}
          </div>

          <input
            type="file"
            {...register("avatar")}
            ref={inputFileRef}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const fileUploaded = e.target.files?.[0];
              if (fileUploaded) {
                setFile(fileUploaded);
                setValue("avatar", fileUploaded, { shouldValidate: true });
              }
            }}
          />

          <span className="text-[#FF435A]">{errors?.avatar?.message}</span>
        </div>

        <div className="flex flex-col gap-[10px]">
          <label htmlFor="name" className="font-semibold">
            Full Name
          </label>
          <div className="flex items-center w-full rounded-full border border-[#CFDBEF] gap-3 px-5 transition-all focus-within:ring-2 focus-within:ring-[#1E40AF]">
            <img src="/assets/images/icons/note-favorite-black.svg" className="w-6 h-6" />
            <input
              {...register("name")}
              id="name"
              type="text"
              placeholder="Write student name"
              className="appearance-none outline-none w-full py-3 font-semibold placeholder:text-[#838C9D] bg-transparent"
            />
          </div>
          <span className="text-[#FF435A]">{errors?.name?.message}</span>
        </div>

        <div className="flex flex-col gap-[10px]">
          <label htmlFor="email" className="font-semibold">
            Email Address
          </label>
          <div className="flex items-center w-full rounded-full border border-[#CFDBEF] gap-3 px-5 transition-all focus-within:ring-2 focus-within:ring-[#1E40AF]">
            <img src="/assets/images/icons/sms-black.svg" className="w-6 h-6" />
            <input
              {...register("email")}
              id="email"
              type="email"
              placeholder="Write email address"
              className="appearance-none outline-none w-full py-3 font-semibold placeholder:text-[#838C9D] bg-transparent"
            />
          </div>
          <span className="text-[#FF435A]">{errors?.email?.message}</span>
        </div>

        {student === undefined && (
          <div className="flex flex-col gap-[10px]">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <div className="flex items-center w-full rounded-full border border-[#CFDBEF] gap-3 px-5 transition-all focus-within:ring-2 focus-within:ring-[#1E40AF]">
              <img src="/assets/images/icons/lock-black.svg" className="w-6 h-6" />
              <input
                {...register("password")}
                id="password"
                type="password"
                placeholder="Type student password"
                className="appearance-none outline-none w-full py-3 font-semibold placeholder:text-[#838C9D] bg-transparent"
              />
            </div>
            <span className="text-[#FF435A]">{errors?.password?.message}</span>
          </div>
        )}

        <div className="flex items-center gap-[14px]">
          <button type="button" className="w-full rounded-full border border-[#060A23] p-[14px_20px] font-semibold">
            Save as Draft
          </button>
          <button
            type="submit"
            disabled={mutateCreate.isLoading || mutateUpdate.isLoading}
            className="w-full rounded-full p-[14px_20px] font-semibold text-white bg-[#1E40AF]">
            {student === undefined ? "Add" : "Edit"} Now
          </button>
        </div>
      </form>
    </>
  );
}
