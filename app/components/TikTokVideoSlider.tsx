import { useEffect, useRef, useState } from "react";

interface Video {
  id: string;
  text: string;
  playCount: number;
  webVideoUrl: string;
  videoMeta: {
    coverUrl: string;
  };
  source: "tiktok";
}

interface Props {
  videos: Video[];
  error?: string | null;
}

export default function TikTokVideoSlider({ videos, error }: Props) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [centerSlot, setCenterSlot] = useState(2);

  const videoWidth = 283;
  const gap = 47;
  const itemWidth = videoWidth + gap;

  // duplicate list for infinite scroll
  const extendedVideos = videos.length >= 5 ? [...videos, ...videos, ...videos] : videos;

  const recalcCenter = () => {
    if (!sliderRef.current) return;
    const containerWidth = sliderRef.current.offsetWidth;
    const visibleCount = Math.floor(containerWidth / itemWidth);
    const center = Math.floor(visibleCount / 2);
    setCenterSlot(center);
  };

  useEffect(() => {
    recalcCenter();
    window.addEventListener("resize", recalcCenter);
    return () => window.removeEventListener("resize", recalcCenter);
  }, []);

  // initialize in middle cycle
  useEffect(() => {
    if (sliderRef.current && videos.length >= 5) {
      const videosPerCycle = videos.length;
      sliderRef.current.scrollLeft = videosPerCycle * itemWidth;
      setActiveIndex(videosPerCycle);
    }
  }, [videos]);

  // scroll handler
  const handleScroll = () => {
    if (!sliderRef.current || videos.length < 1) return;
    const index = Math.round(sliderRef.current.scrollLeft / itemWidth);
    setActiveIndex(index);

    const videosPerCycle = videos.length;
    const cycleWidth = videosPerCycle * itemWidth;

    if (sliderRef.current.scrollLeft >= cycleWidth * 2) {
      sliderRef.current.scrollLeft -= cycleWidth;
      setActiveIndex(index - videosPerCycle);
    } else if (sliderRef.current.scrollLeft <= 0) {
      sliderRef.current.scrollLeft += cycleWidth;
      setActiveIndex(index + videosPerCycle);
    }
  };

  // error / empty
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (videos.length === 0) return <div className="p-4 text-white">No TikTok videos available.</div>;

  return (
    <div className="bg-white text-white w-full flex justify-center items-center ">
      <div className="overflow-hidden w-full max-w-[1415px]">
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          className="flex overflow-x-scroll scrollbar-hide snap-x snap-mandatory"
          style={{ scrollBehavior: "smooth", gap: `${gap}px`, padding: "20px" }}
        >
          {extendedVideos.map((video, index) => {
            const relativeIndex = index - activeIndex;
            const isCenter = relativeIndex === centerSlot;
            return (
              <div
                key={`${video.id}-${index}`}
                className="relative flex-shrink-0 rounded-lg overflow-hidden shadow-md snap-center transition-transform duration-300"
                style={{
                  width: `${videoWidth}px`,
                  transform: isCenter ? "scale(1.25)" : "scale(1)",
                  transformOrigin: "center",
                }}
              >
                <img
                  src={video.videoMeta.coverUrl}
                  alt={video.text || "TikTok thumbnail"}
                  className="w-full h-auto object-cover"
                />
                {/* Overlay Play Button */}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => window.open(video.webVideoUrl, "_blank", "noopener,noreferrer")}
                    className="text-white text-4xl"
                  >
                    ▶️
                  </button>
                </div>
                {/* Top-left text */}
                <div className="absolute top-2 left-2 text-white text-sm font-semibold bg-black bg-opacity-50 px-2 py-1 rounded">
                  {video.text.slice(0, 20)}...
                </div>
                {/* Bottom-right play count */}
                <div className="absolute bottom-2 right-2 text-white text-sm font-bold bg-black bg-opacity-50 px-2 py-1 rounded flex items-center">
                  ▶️ {video.playCount.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
