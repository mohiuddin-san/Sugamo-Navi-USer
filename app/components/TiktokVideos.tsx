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
    <div className="bg-white border-2 border-black text-black rounded-[10px]" style={{ paddingBottom: autoSize(53) }}>
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
                  className="w-full h-auto object-cover"
                />
                <div className=" md:hidden absolute inset-0 flex items-center justify-center">
                  <div
                    onClick={() => window.open(video.webVideoUrl, "_blank", "noopener,noreferrer")}
                    className="w-[75px] h-[75px] bg-[#ffffffe5] rounded-full flex items-center justify-center"
                    style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
                  >
                    <span className="text-black text-2xl">▶</span>
                  </div>
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