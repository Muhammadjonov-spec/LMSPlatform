import React from "react";
import PropTypes from "prop-types";

export default function ContentVideo({ content, handleNext }) {
  const youtubeId = content?.youtubeId;

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full rounded-2xl overflow-hidden shadow-sm bg-black aspect-video relative">
        {youtubeId ? (
          <iframe
            className="w-full h-full absolute inset-0"
            src={`https://www.youtube.com/embed/${youtubeId}?si=IGeRBup7jYeDxLxr`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen></iframe>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-gray-400 gap-4">
            <span className="material-symbols-rounded text-6xl">videocam_off</span>
            <p>Video unavailable</p>
          </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="font-bold text-2xl text-gray-900 mb-1">{content?.title}</h1>
          <p className="text-gray-500 text-sm">Watch the full lesson and proceed to the next one</p>
        </div>
        <button
          type="button"
          onClick={() => handleNext(content)}
          className="w-full sm:w-auto rounded-xl px-6 py-3 font-semibold text-white bg-[#1E40AF] hover:bg-blue-800 transition-colors flex items-center justify-center gap-2">
          <span>Complete & Next</span>
          <span className="material-symbols-rounded text-lg">arrow_forward</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mt-2">
        <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
          <span className="material-symbols-rounded text-[#1E40AF]">description</span>
          Lesson Description
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {content?.description || "No additional information was provided for this lesson. Make sure to follow along and practice what you learned."}
        </p>
      </div>
    </div>
  );
}

ContentVideo.propTypes = {
  content: PropTypes.shape({
    youtubeId: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string
  }),
  handleNext: PropTypes.func
};
