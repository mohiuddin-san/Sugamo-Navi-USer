import BlogList from "~/routes/BlogList";
import BookMark from "./BookMark";
import Home from "~/components/Home";
import TikTokVideoGrid from "~/components/TikTokVideoGrid";
import { json } from '@remix-run/node';
import { getInstagramVideos, getTikTokVideos } from '~/components/socialMediaFetcher';

export const loader = async () => {
  try {
    const [instagramPosts, tiktokVideos] = await Promise.all([
      getInstagramVideos(),
      getTikTokVideos(),
    ]);
    return json({
      posts: Array.isArray(instagramPosts) ? instagramPosts : [],
      tiktokVideos: Array.isArray(tiktokVideos) ? tiktokVideos : [],
      error: null,
    });
  } catch (error) {
    console.error('Error in loader:', error);
    return json(
      {
        posts: [],
        tiktokVideos: [],
        error: (error as Error).message || 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
};

export default function HomePage() {
  return (
    <div className="bg-white">
      <Home />
    </div>
  );
}