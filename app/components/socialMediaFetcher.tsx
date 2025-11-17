import fs from 'fs/promises';
import path from 'path';
import { DateTime } from 'luxon';

// Prevent client-side execution
if (typeof window !== 'undefined') {
  throw new Error('socialMediaFetcher.tsx must only be used in a server-side context');
}

// Define cache directory and files
const CACHE_DIR = path.join(process.cwd(), 'cache');
const TIKTOK_CACHE_FILE = path.join(CACHE_DIR, 'tiktok_videos.json');
const INSTAGRAM_CACHE_FILE = path.join(CACHE_DIR, 'instagram_videos.json');

interface Video {
  id: string;
  text: string;
  playCount: number;
  webVideoUrl: string;
  videoMeta: {
    coverUrl: string;
  };
  source: 'tiktok';
}

interface InstagramVideo {
  id: string;
  media_type: string;
  media_url: string;
  thumbnail_url: string;
  caption: string;
  like_count: number;
  permalink: string;
  timestamp: string;
  source: 'instagram';
}
interface Video {
  id: string;
  text: string;
  playCount: number;
  webVideoUrl: string;
  videoMeta: { coverUrl: string };
  source: 'tiktok';
}

export async function getTikTokVideos(): Promise<Video[]> {
  try {
    if (!process.env.VITE_APIFY_TOKEN || !process.env.VITE_TIKTOK_USERNAME) {
      throw new Error('Missing API token or TikTok username in environment variables');
    }

    await fs.mkdir(CACHE_DIR, { recursive: true });
    let cachedData = null;
    try {
      const cacheContent = await fs.readFile(TIKTOK_CACHE_FILE, 'utf-8');
      cachedData = JSON.parse(cacheContent);
    } catch (err) {
      console.log('No TikTok cache or invalid cache:', err);
    }

    const currentDate = DateTime.now().setZone('Asia/Tokyo');
    const cacheExpiryDate = cachedData?.lastUpdated
      ? DateTime.fromISO(cachedData.lastUpdated, { zone: 'Asia/Tokyo' }).plus({ days: 2 })
      : null;
    const shouldFetch = !cachedData || !cachedData.lastUpdated || !cacheExpiryDate || currentDate > cacheExpiryDate;
    let videos: Video[] = [];
    if (shouldFetch) {
      console.log('Fetching new TikTok data via HTTP API...');
      const response = await fetch('https://api.apify.com/v2/acts/clockworks~tiktok-scraper/runs', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.VITE_APIFY_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profiles: [process.env.VITE_TIKTOK_USERNAME],
          resultsPerPage: 6,
          shouldDownloadVideos: false,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`Apify API error: ${errorText}`);
      }

      const run = await response.json();
      console.log('Apify run started:', run.data.id);

      const maxWaitTime = 30000;
      const pollInterval = 2000;
      let elapsedTime = 0;
      let runStatus = run.data.status;
      while (runStatus === 'READY' || runStatus === 'RUNNING') {
        if (elapsedTime >= maxWaitTime) {
          throw new Error('Run timed out after 30 seconds');
        }
        await new Promise(resolve => setTimeout(resolve, pollInterval));
        const statusResponse = await fetch(`https://api.apify.com/v2/actor-runs/${run.data.id}`, {
          headers: { Authorization: `Bearer ${process.env.VITE_APIFY_TOKEN}` },
        });
        if (!statusResponse.ok) {
          const errorText = await statusResponse.text();
          throw new Error(`Run status check failed: ${errorText}`);
        }
        const statusData = await statusResponse.json();
        runStatus = statusData.data.status;
        console.log('Run status:', runStatus);
        elapsedTime += pollInterval;
        if (runStatus === 'FAILED') {
          throw new Error(`Run failed: ${JSON.stringify(statusData, null, 2)}`);
        }
      }

      const datasetResponse = await fetch(`https://api.apify.com/v2/datasets/${run.data.defaultDatasetId}/items`);
      if (!datasetResponse.ok) {
        const errorText = await datasetResponse.text();
        throw new Error(`Apify dataset error: ${errorText}`);
      }
      const items = await datasetResponse.json();
      console.log('Raw TikTok items:', JSON.stringify(items, null, 2));

      videos = items
        .slice(0, 6)
        .map((item: any) => {
          const video = {
            id: item.id || '',
            text: item.text || 'No description',
            playCount: item.playCount || 0,
            webVideoUrl: item.webVideoUrl || '',
            videoMeta: { coverUrl: item.videoMeta?.coverUrl || '' },
            source: 'tiktok' as const,
          };
          console.log('Mapped video:', video);
          return video;
        })
        .filter((video: Video) => {
          const isValid = video.id && video.videoMeta.coverUrl;
          return isValid;
        });
      if (videos.length === 0) {
        console.warn('No TikTok videos found for the specified profile');
      } else {
        await fs.writeFile(
          TIKTOK_CACHE_FILE,
          JSON.stringify({ videos, lastUpdated: currentDate.toISO() }, null, 2),
          'utf-8'
        );
      }
    } else {
      videos = Array.isArray(cachedData.videos) ? cachedData.videos : [];
    }
    return videos;
  } catch (error) {
    try {
      const cacheContent = await fs.readFile(TIKTOK_CACHE_FILE, 'utf-8');
      const cachedData = JSON.parse(cacheContent);
      return Array.isArray(cachedData.videos) ? cachedData.videos : [];
    } catch (cacheErr) {
      return [];
    }
  }
}
export async function getInstagramVideos(): Promise<InstagramVideo[]> {
  try {
    const pageAccessToken = process.env.FB_PAGE_ACCESS_TOKEN;
    const pageId = process.env.FB_PAGE_ID;
    let igUserId = process.env.IG_USER_ID;

    if (!pageAccessToken || !pageId) {
      throw new Error('Missing environment variables for Instagram');
    }

    await fs.mkdir(CACHE_DIR, { recursive: true });

    let cachedData = null;
    try {
      const cacheContent = await fs.readFile(INSTAGRAM_CACHE_FILE, 'utf-8');
      cachedData = JSON.parse(cacheContent);
    } catch (err) {
    }

    const currentDate = DateTime.now().setZone('Asia/Tokyo').toISODate();
    const shouldFetch = !cachedData || !cachedData.lastUpdated || cachedData.lastUpdated !== currentDate;

    let posts: InstagramVideo[] = [];
    if (shouldFetch) {
      if (!igUserId) {
        const igResponse = await fetch(
          `https://graph.facebook.com/v23.0/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`
        );
        if (!igResponse.ok) {
          throw new Error('Failed to fetch IG User ID');
        }
        const igData = await igResponse.json();
        igUserId = igData.instagram_business_account?.id;
        if (!igUserId) {
          throw new Error('No Instagram Business Account linked');
        }
      }

      const mediaResponse = await fetch(
        `https://graph.facebook.com/v23.0/${igUserId}/media?fields=media_type,media_url,thumbnail_url,caption,like_count,timestamp,permalink&access_token=${pageAccessToken}&limit=10`
      );
      if (!mediaResponse.ok) {
        throw new Error('Failed to fetch Instagram media');
      }
      const mediaData = await mediaResponse.json();

      posts = mediaData.data
        .filter((post: any) => post.media_type === 'VIDEO')
        .map((post: any) => ({
          id: post.id || '',
          media_type: post.media_type || '',
          media_url: post.media_url || '',
          thumbnail_url: post.thumbnail_url || '',
          caption: post.caption || 'No caption',
          like_count: post.like_count || 0,
          permalink: post.permalink || '',
          timestamp: post.timestamp || '',
          source: 'instagram' as const,
        }))
        .filter((post: InstagramVideo) => post.id && post.thumbnail_url);
      await fs.writeFile(
        INSTAGRAM_CACHE_FILE,
        JSON.stringify({ posts, lastUpdated: currentDate }, null, 2),
        'utf-8'
      );
    } else {
      posts = Array.isArray(cachedData.posts) ? cachedData.posts : [];
    }

    return posts;
  } catch (error) {
    try {
      const cacheContent = await fs.readFile(INSTAGRAM_CACHE_FILE, 'utf-8');
      const cachedData = JSON.parse(cacheContent);
      return Array.isArray(cachedData.posts) ? cachedData.posts : [];
    } catch (cacheErr) {
      return [];
    }
  }
}

export function mixVideos(tiktokVideos: Video[] | undefined, instagramVideos: InstagramVideo[] | undefined): Array<Video | InstagramVideo> {
  const tiktok = Array.isArray(tiktokVideos) ? tiktokVideos : [];
  const instagram = Array.isArray(instagramVideos) ? instagramVideos : [];
  const mixed: Array<Video | InstagramVideo> = [];
  const maxLength = Math.max(tiktok.length, instagram.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < tiktok.length) {
      mixed.push(tiktok[i]);
    }
    if (i < instagram.length) {
      mixed.push(instagram[i]);
    }
  }
  return mixed;
}