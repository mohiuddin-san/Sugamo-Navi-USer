
import Home from "~/components/Home";
import { json } from '@remix-run/node';
import { getInstagramVideos, getTikTokVideos } from '~/components/socialMediaFetcher';

export const loader = async () => {
  try {
    console.log('Starting loader - fetching social media data...');
    const [instagramPosts, tiktokVideos] = await Promise.all([
      getInstagramVideos(),
      getTikTokVideos(),
    ]);
    console.log('Instagram posts count:', instagramPosts?.length || 0);
    console.log('TikTok videos count:', tiktokVideos?.length || 0);
    
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