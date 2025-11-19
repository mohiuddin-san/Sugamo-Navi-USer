
import Home from "~/components/Home";
import { json } from '@remix-run/node';
import { getInstagramVideos, getTikTokVideos } from '~/components/socialMediaFetcher';
import type { MetaFunction } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Sugamo Navi - おばあちゃんの原宿 巣鴨ガイド" },
    { name: "description", content: "巣鴨地蔵通り商店街の観光ガイド。おすすめのお店、モデルコース、旅の情報、Instagram・TikTok動画も！毎月4・14・24日は縁日開催！" },
    { property: "og:title", content: "Sugamo Navi - 巣鴨観光ガイド" },
    { property: "og:description", content: "巣鴨の名店・モデルコース・最新情報" },
    { property: "og:image", content: "https://sugamo-navi.com/src/sugamo-navi.webp" },
    { property: "og:url", content: "https://sugamo-navi.com" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
};
export const loader = async () => {
  try {
    console.log('Starting loader - fetching social media data...');
    const [instagramPosts, tiktokVideos] = await Promise.all([
      getInstagramVideos(),
      getTikTokVideos(),
    ]);
    const instagramVideoPosts = (instagramPosts || []).filter((post: any) => {
      if (post.media_type === 'VIDEO') return true;
      if (typeof post.media_url === 'string' && post.media_url.includes('.mp4')) return true;
      if (post.media_type === 'CAROUSEL_ALBUM' && Array.isArray(post.children?.data)) {
        return post.children.data.some((child: any) =>
          child.media_type === 'VIDEO' || 
          (child.media_url && child.media_url.includes('.mp4'))
        );
      }
      return false;
    }); 
    return json({
      posts: Array.isArray(instagramVideoPosts) ? instagramVideoPosts : [],
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