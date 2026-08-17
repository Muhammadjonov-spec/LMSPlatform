import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, useRevalidator } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { deleteDetailContent } from "../../../services/courseService";
import ConfirmModal from "../../../components/common/confirmModal";
import ErrorToast from "../../../components/common/ErrorToast";
import { useConfirmModal } from "../../../components/common/UseConfirmModal";

export default function ContentItem({ id, index, type, title, courseId, status }) {
  const revalidator = useRevalidator();
  const confirmModal = useConfirmModal();
  const [error, setError] = useState(null);

  const { isPending, mutateAsync } = useMutation({
    mutationFn: () => deleteDetailContent(id),
    onSuccess: () => {
      revalidator.revalidate();
    },
    onError: (err) => {
      setError(err.message || "Failed to delete content");
      console.error("Delete content error:", err);
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

  const contentTypeInfo = {
    text: {
      icon: "note-favorite-blue.svg",
      label: "Text Content"
    },
    video: {
      icon: "video-blue.svg",
      label: "Video Content"
    }
  };

  const currentType = contentTypeInfo[type] || contentTypeInfo.text;

  return (
    <>
      <div className="card flex items-center gap-5">
        <div className="relative flex shrink-0 w-[140px] h-[110px]">
          <p className="absolute -top-[10px] -left-[10px] flex shrink-0 w-[30px] h-[30px] rounded-full items-center justify-center text-center bg-[#1E40AF] text-white z-10">
            <span className="font-bold text-sm leading-[21px]">{index}</span>
          </p>
          <div className="rounded-[20px] border border-[#CFDBEF] bg-[#D9D9D9] overflow-hidden w-full h-full">
            <img
              src={`/assets/images/thumbnails/cover-${type}.png`}
              className="w-full h-full object-cover "
              alt={`${title} thumbnail`}
              loading="lazy"
            />
          </div>
        </div>

        <div className="w-full">
          <h3 className="font-bold text-xl leading-[30px] line-clamp-1" title={title}>
            {title}
          </h3>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-[6px] mt-[6px]">
              <img src={`/assets/images/icons/${currentType.icon}`} className="w-5 h-5" alt="" aria-hidden="true" />
              <p className="text-[#838C9D]">{currentType.label}</p>
            </div>
            
            {type === "video" && status === "processing" && (
              <div className="mt-[6px] bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                Qayta ishlanmoqda...
              </div>
            )}
            
            {type === "video" && status === "failed" && (
              <div className="mt-[6px] bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold">
                Yuklashda xatolik
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end items-center gap-3">
          <button
            type="button"
            disabled={isPending || status === "processing"}
            onClick={handleDeleteClick}
            className="w-fit rounded-full p-[14px_20px] bg-[#FF435A] font-semibold text-white text-nowrap hover:bg-[#E63950] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`Delete ${title} content`}>
            Delete
          </button>
          
          {status === "processing" ? (
            <button
              disabled
              className="w-fit rounded-full border border-gray-300 bg-gray-100 text-gray-400 p-[14px_20px] font-semibold text-nowrap cursor-not-allowed">
              Edit Content
            </button>
          ) : (
            <Link
              to={`/manager/courses/${courseId}/edit/${id}`}
              className="w-fit rounded-full border border-[#060A23] p-[14px_20px] font-semibold text-nowrap hover:bg-gray-50 transition-colors"
              aria-label={`Edit ${title} content`}>
              Edit Content
            </Link>
          )}
        </div>
      </div>

      <ErrorToast message={error} onClose={() => setError(null)} />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={confirmModal.confirm}
        title="Delete Content"
        message={
          <>
            Are you sure you want to delete <span className="font-semibold">{title}</span>?
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

ContentItem.propTypes = {
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  status: PropTypes.string
};
