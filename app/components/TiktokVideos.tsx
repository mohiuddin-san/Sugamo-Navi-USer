import { useLoaderData } from '@remix-run/react';
import { useUniversalFluid } from '../hooks/useUniversalFluid';
import { useMediaQuery } from "react-responsive";

type LoaderData = {
  posts: any[];
  error: string | null;
};

export default function TikTokVideos() {
  const data = useLoaderData<LoaderData>();
  const posts = Array.isArray(data?.posts) ? data.posts : [];
  const error = data?.error || null;
  const { fs, fsm, fluidStyle, fluidClass } = useUniversalFluid();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const autoSize = (size: number) => (isMobile ? fsm(size) : fs(size));

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-600">
        Error: {error}
      </div>
    );
  }

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
          {posts.length > 0 ? (
            posts.slice(0, 6).map((post: any) => (
              <div
                key={post.id}
                className="rounded-sm"
              >
                <video
                  src={post.media_url}
                  controls
                  muted
                  poster={post.thumbnail_url}
                  className="w-full h-auto"
                >
                  Your browser does not support the video tag.
                </video>
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