import React, { useState } from "react";
import { Link, useRevalidator } from "react-router-dom";
import PropTypes from "prop-types";
import { useMutation } from "@tanstack/react-query";
import { deleteStudent } from "../../../services/studentServices";
import ConfirmModal from "../../../components/common/confirmModal";
import ErrorToast from "../../../components/common/ErrorToast";
import { useConfirmModal } from "../../../components/common/UseConfirmModal";

export default function StudentItem({
  imageUrl = "/assets/images/photos/photo-3.png",
  name = "Angga Risky Setiawan",
  totalCourse = 0,
  id = "1"
}) {
  const revalidator = useRevalidator();
  const confirmModal = useConfirmModal();
  const [error, setError] = useState(null);
  const { isPending, mutateAsync } = useMutation({
    mutationFn: () => deleteStudent(id),
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
      <div className="card flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="relative flex shrink-0 w-20 h-20">
          <div className="rounded-[20px] bg-[#D9D9D9] overflow-hidden w-full h-full">
            <img src={imageUrl} className="w-full h-full object-cover" alt="photo" />
          </div>
        </div>
        <div className="w-full text-center sm:text-left">
          <h3 className="font-bold text-xl leading-[30px] line-clamp-1">{name}</h3>
          <div className="flex items-center justify-center sm:justify-start gap-5">
            <div className="flex items-center gap-[6px] mt-[6px]">
              <img src="/assets/images/icons/note-favorite-blue.svg" className="w-5 h-5" alt="icon" />
              <p className="text-[#838C9D]">{totalCourse} Course Joined</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap sm:flex-nowrap justify-center sm:justify-end items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
          <Link
            to={`/manager/students/edit/${id}`}
            className="w-full sm:w-fit text-center rounded-full border border-[#060A23] p-[14px_20px] font-semibold">
            Edit Profile
          </Link>
          <button
            type="button"
            disabled={isPending}
            onClick={handleDeleteClick}
            className="w-full sm:w-fit text-center rounded-full p-[14px_20px] bg-[#FF435A] font-semibold text-white">
            Delete
          </button>
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
            Confirm deletion of <span className="font-semibold">{name}</span>?
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

StudentItem.propTypes = {
  imageUrl: PropTypes.string,
  name: PropTypes.string,
  totalCourse: PropTypes.number,
  id: PropTypes.string
};
