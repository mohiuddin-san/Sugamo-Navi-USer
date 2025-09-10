import { useState } from 'react';

interface Video {
  id: string;
  text: string;
  playCount: number;
  webVideoUrl: string;
  videoMeta: {
    coverUrl: string;
  };
  source?: string;
}

interface TikTokVideoGridProps {
  videos: Video[];
  error: string | null;
}

export default function TikTokVideoGrid({ videos, error }: TikTokVideoGridProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const handlePlayClick = (video: Video) => {
    setSelectedVideo(video);
  };

  const closeModal = () => {
    setSelectedVideo(null);
  };

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-600">
        Error: {error}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="container mx-auto p-4 text-white">
        No TikTok videos available.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-black text-white">
      <h1 className="text-2xl font-bold mb-4 text-center">TikTok Videos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div key={video.id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="relative">
              <img
                src={video.videoMeta.coverUrl}
                alt={video.text || 'Video thumbnail'}
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 flex items-center justify-between">
                <button
                  onClick={() => handlePlayClick(video)}
                  className="flex items-center text-white hover:text-gray-300"
                >
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5 4v12l10-6L5 4z" />
                  </svg>
                  Play
                </button>
                <span className="text-sm">{video.playCount.toLocaleString()} views</span>
              </div>
            </div>
            <p className="p-2 text-sm text-gray-300 truncate">{video.text}</p>
          </div>
        ))}
      </div>

      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-4 rounded-lg relative w-full max-w-2xl">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-300 hover:text-white"
            >
              &times;
            </button>
            <div className="w-full aspect-video">
              <iframe
                src={selectedVideo.webVideoUrl}
                className="w-full h-full"
                title="TikTok Video"
                allow="autoplay; encrypted-media"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="mt-2 text-sm text-gray-400 truncate">{selectedVideo.text}</p>
            <a
              href={selectedVideo.webVideoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline text-sm mt-2 block"
            >
              Open in TikTok
            </a>
          </div>
        </div>
      )}
    </div>
  );
}