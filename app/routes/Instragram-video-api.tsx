// app/routes/instagram-videos.tsx
import { json } from '@remix-run/node';
import { getInstagramVideos } from '~/components/socialMediaFetcher';
import InstagramVideos from '../components/InstagramVideos';

export const loader = async () => {
  try {
    const posts = await getInstagramVideos();
    return json({ posts: Array.isArray(posts) ? posts : [], error: null });
  } catch (error) {
    console.error('Error in loader:', error);
    return json(
      { posts: [], error: (error as Error).message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
};

export default function InstagramVideosRoute() {
  return <InstagramVideos />;
}