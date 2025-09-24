import { useLoaderData } from '@remix-run/react';
import { useUniversalFluid } from '../hooks/useUniversalFluid';
import { useMediaQuery } from "react-responsive";

type TikTokVideosProps = {
  videos: any[];
};


export default function TikTokVideos({ videos }: TikTokVideosProps) {
  const { fs, fsm, fluidStyle, fluidClass } = useUniversalFluid();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const autoSize = (size: number) => (isMobile ? fsm(size) : fs(size));


  return (
    <div className="bg-white border-2 border-black text-black rounded-[10px]" style={{paddingBottom: autoSize(53)}}>
      <div>
        <div className="flex items-center justify-center" style={{ height: autoSize(138), gap: autoSize(16) }}>
          <img
            className="m-1"
            style={{ width: autoSize(58), height: autoSize(58) }}
            src="./src/titok.svg"
            alt="Camera Icon"
          />
          <h1 className="italic font-cousine font-bold" style={{ fontSize: autoSize(25) }}>
            TIKTOK
          </h1>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {videos.length > 0 ? (
            videos.slice(0, 6).map((video: any) => (
              <div
                key={`${video.id}`}
                className="relative flex-shrink-0 overflow-hidden shadow-md snap-center transition-transform duration-300"
              >
                <img
                 onClick={() => window.open(video.webVideoUrl, "_blank", "noopener,noreferrer")}
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
              </div>
            ))
          ) : (
            <p className="text-center">No posts available</p>
          )}
        </div>
      </div>
    </div>
  );
}