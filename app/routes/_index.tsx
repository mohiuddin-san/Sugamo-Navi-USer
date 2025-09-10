
import BlogList from "~/routes/BlogList";
import BookMark from "./BookMark";
import Home from "~/components/Home";
import TikTokVideoGrid from "~/components/TikTokVideoGrid";

import { json } from '@remix-run/node';
import { getInstagramVideos } from '~/components/socialMediaFetcher';

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
export default function HomePage() {
  return (
    <div className=" bg-white">
      <Home />
    </div>
  );
}