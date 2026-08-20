import React, { useState } from "react";
import { Link, useRevalidator } from "react-router-dom";
import PropTypes from "prop-types";
import { useMutation } from "@tanstack/react-query";
import { deleteCourse } from "../../../services/courseService";
import ConfirmModal from "../../../components/common/confirmModal";
import ErrorToast from "../../../components/common/ErrorToast";
import { useConfirmModal } from "../../../components/common/UseConfirmModal";

export default function CardCourse({
  id,
  imageUrl = "/assets/images/thumbnails/th-1.png",
  name = "Untitled Course",
  totalStudents = 0,
  category = "Uncategorized"
}) {
  const revalidator = useRevalidator();
  const confirmModal = useConfirmModal();
  const [error, setError] = useState(null);

  const { isPending, mutateAsync } = useMutation({
    mutationFn: () => deleteCourse(id),
    onError: (err) => {
      setError(err.message || "Failed to delete course");
      console.error("Delete course error:", err);
    },
    onSuccess: () => {
      revalidator.revalidate();
    }
  });

  const handleDeleteClick = () => {
    setError(null);
    confirmModal.open(async () => {
      try {
        await mutateAsync();
      } catch (err) {
        console.error(err);
      }
    });
  };

  const handleCloseModal = () => {
    if (!isPending) {
      confirmModal.close();
    }
  };

  return (
    <>
      <div className="card flex flex-col md:flex-row items-start md:items-center gap-5 w-full">
        <div className="flex shrink-0 w-full md:w-[140px] h-[180px] md:h-[110px] rounded-[20px] bg-[#D9D9D9] overflow-hidden">
          <img src={imageUrl} className="w-full h-full object-cover" alt={`${name} thumbnail`} loading="lazy" />
        </div>

        <div className="w-full">
          <h3 className="font-bold text-xl leading-[30px] line-clamp-2 md:line-clamp-1" title={name}>
            {name}
          </h3>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-[6px] mt-[6px]">
              <img src="/assets/images/icons/profile-2user-blue.svg" className="w-5 h-5" alt="" aria-hidden="true" />
              <p className="text-[#838C9D]">{totalStudents} Students</p>
            </div>
            <div className="flex items-center gap-[6px] mt-[6px]">
              <img src="/assets/images/icons/crown-blue.svg" className="w-5 h-5" alt="" aria-hidden="true" />
              <p className="text-[#838C9D]">{category}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap md:flex-nowrap justify-start md:justify-end items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
          <Link
            to={`/manager/courses/students/${id}`}
            className="w-full md:w-fit text-center rounded-[16px] border border-[#060A23] p-[14px_20px] font-semibold hover:bg-gray-50 transition-colors"
            aria-label={`Manage ${name} course`}>
            Students
          </Link>
          <button
            type="button"
            disabled={isPending}
            onClick={handleDeleteClick}
            className="w-full md:w-fit text-center rounded-[16px] bg-[#FF435A] text-white p-[14px_20px] font-semibold hover:bg-[#E63950] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Delete ${name} course`}>
            Delete
          </button>

          <Link
            to={`/manager/courses/${id}`}
            className="w-full md:w-fit text-center rounded-[16px] border border-[#060A23] p-[14px_20px] font-semibold hover:bg-gray-50 transition-colors"
            aria-label={`Manage ${name} course`}>
            Manage
          </Link>
        </div>
      </div>

      <ErrorToast message={error} onClose={() => setError(null)} />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={confirmModal.confirm}
        title="Delete Course"
        message={
          <>
            Are you sure you want to delete <span className="font-semibold">{name}</span>?
            <br />
            <span className="text-red-500 text-xs mt-1 block">This action cannot be undone.</span>
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isPending}
        variant="danger"
      />
    </>
  );
}

CardCourse.propTypes = {
  id: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  name: PropTypes.string,
  totalStudents: PropTypes.number,
  category: PropTypes.string
};
