import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

// Video URL dan to'g'ri src yaratish
const getVideoSrc = (videoUrl) => {
  if (!videoUrl) return null;
  // Agar to'liq URL bo'lsa
  if (videoUrl.startsWith("http")) return videoUrl;
  // Server URL dan olish
  const base = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace("/api/v1", "").replace("/api", "")
    : "http://localhost:5000";
  return `${base}${videoUrl}`;
};

// HLS video player (Chrome/Firefox uchun hls.js ishlatiladi)
function HlsPlayer({ src }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    // Safari natively supports HLS
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      return;
    }

    // Chrome/Firefox — hls.js kerak
    let hls;
    import("hls.js").then(({ default: Hls }) => {
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
        });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        // Fallback: to'g'ridan-to'g'ri src
        video.src = src;
      }
    });

    return () => {
      if (hls) hls.destroy();
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      controls
      controlsList="nodownload"
      className="w-full h-full absolute inset-0 object-contain"
      playsInline
    />
  );
}

// YouTube embed player
function YouTubePlayer({ youtubeId }) {
  return (
    <iframe
      className="w-full h-full absolute inset-0"
      src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}

// Oddiy MP4 player
function Mp4Player({ src }) {
  return (
    <video
      controls
      controlsList="nodownload"
      className="w-full h-full absolute inset-0 object-contain"
      src={src}
      playsInline
    />
  );
}

export default function ContentVideo({ content, handleNext }) {
  const videoUrl = content?.videoUrl;
  const youtubeId = content?.youtubeId;
  const videoSrc = getVideoSrc(videoUrl);

  // Video turini aniqlash
  const isHls = videoSrc && videoSrc.endsWith(".m3u8");
  const isMp4 = videoSrc && (videoSrc.endsWith(".mp4") || videoSrc.includes(".mp4"));
  const isYoutube = !videoUrl && youtubeId;

  const renderPlayer = () => {
    if (isHls) return <HlsPlayer src={videoSrc} />;
    if (isMp4) return <Mp4Player src={videoSrc} />;
    if (isYoutube) return <YouTubePlayer youtubeId={youtubeId} />;

    // Video yo'q
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-gray-400 gap-4">
        <span className="material-symbols-rounded text-6xl">videocam_off</span>
        <p className="text-sm">Video tayyor emas yoki hali qayta ishlanmoqda...</p>
        <span className="text-xs text-gray-600 bg-gray-800 px-3 py-1 rounded-full">
          processing
        </span>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Video Player */}
      <div className="w-full rounded-2xl overflow-hidden shadow-lg bg-black aspect-video relative">
        {renderPlayer()}
      </div>

      {/* Title + Next Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="font-bold text-2xl text-gray-900 mb-1">{content?.title}</h1>
          <p className="text-gray-500 text-sm">
            {isYoutube
              ? "YouTube orqali ko'rilmoqda"
              : isHls
              ? "HLS stream orqali ko'rilmoqda"
              : "To'liq darsni ko'ring va keyingisiga o'ting"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => handleNext(content)}
          className="w-full sm:w-auto rounded-xl px-6 py-3 font-semibold text-white bg-[#1E40AF] hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 shrink-0"
        >
          <span>Complete &amp; Next</span>
          <span className="material-symbols-rounded text-lg">arrow_forward</span>
        </button>
      </div>

      {/* Description */}
      {content?.description && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <span className="material-symbols-rounded text-[#1E40AF]">description</span>
            Dars haqida
          </h3>
          <p className="text-gray-600 leading-relaxed">{content.description}</p>
        </div>
      )}
    </div>
  );
}

ContentVideo.propTypes = {
  content: PropTypes.shape({
    videoUrl: PropTypes.string,
    youtubeId: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
  }),
  handleNext: PropTypes.func,
};
