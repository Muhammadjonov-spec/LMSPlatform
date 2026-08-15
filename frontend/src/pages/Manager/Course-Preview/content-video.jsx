import React from "react";
import PropTypes from "prop-types";

export default function ContentVideo({ content, handleNext }) {
  const videoUrl = content?.videoUrl;

  return (
    <div className="flex flex-col gap-6">
      <div className="w-full rounded-2xl overflow-hidden shadow-sm bg-black aspect-video relative">
        {videoUrl ? (
          <video
            controls
            controlsList="nodownload"
            className="w-full h-full absolute inset-0 object-contain"
            src={import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL.replace('/api/v1', '')}${videoUrl}` : `http://localhost:5000${videoUrl}`}
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-gray-400 gap-4">
            <span className="material-symbols-rounded text-6xl">videocam_off</span>
            <p>Video unavailable or processing...</p>
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
