import React, { useState } from "react";
import { useParams, useRevalidator } from "react-router-dom";
import PropTypes from "prop-types";
import { useMutation } from "@tanstack/react-query";
import ConfirmModal from "../../../components/common/confirmModal";
import ErrorToast from "../../../components/common/errorToast";
import { useConfirmModal } from "../../../components/common/useConfirmModal";
import { deleteStudentsCourse } from "../../../services/courseService";

export default function StudentItem({ imageUrl, name, id }) {
  const revalidator = useRevalidator();
  const confirmModal = useConfirmModal();
  const params = useParams();
  const [error, setError] = useState(null);

  const stringToHsl = (str) => {
    let hash = 0;
    for (let i = 0; i < str?.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    return `hsl(${h}, 70%, 60%)`;
  };

  const initial = name?.charAt(0)?.toUpperCase() ?? "U";
  const avatarColor = stringToHsl(name ?? "User");

  const { isLoading, mutateAsync } = useMutation({
    mutationFn: () => deleteStudentsCourse(id, params.id),
    onError: (err) => {
      setError(err.message || "Failed to delete student from course");
      console.error("Delete student from course error:", err);
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
    if (!isLoading) {
      confirmModal.close();
    }
  };

  return (
    <>
      <div className="card flex items-center gap-5">
        <div className="relative flex shrink-0 w-20 h-20">
          <div className="rounded-[20px] overflow-hidden w-full h-full">
            {imageUrl ? (
              <img
                src={imageUrl}
                className="w-full h-full object-cover"
                alt="avatar"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "";
                }}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white font-semibold text-2xl"
                style={{ backgroundColor: avatarColor }}>
                {initial}
              </div>
            )}
          </div>
        </div>

        <div className="w-full">
          <h3 className="font-bold text-xl leading-[30px] line-clamp-1">{name}</h3>
        </div>

        <div className="flex justify-end items-center gap-3">
          <button
            type="button"
            disabled={isLoading}
            onClick={handleDeleteClick}
            className="w-fit rounded-full p-[14px_20px] bg-[#FF435A] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <ErrorToast message={error} onClose={() => setError(null)} />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={confirmModal.confirm}
        title="Remove Student from Course"
        message={
          <>
            Are you sure you want to remove <span className="font-semibold">{name}</span> from this course?
            <span className="text-red-500 text-xs mt-1 block">This action cannot be undone.</span>
          </>
        }
        confirmText="Remove"
        cancelText="Cancel"
        isLoading={isLoading}
        variant="danger"
      />
    </>
  );
}

StudentItem.propTypes = {
  imageUrl: PropTypes.string,
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
};
