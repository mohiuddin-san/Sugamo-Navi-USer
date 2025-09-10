import { json } from '@remix-run/node';
import { ApifyClient } from 'apify-client';
import { useLoaderData } from '@remix-run/react';
import VideoGrid from '~/components/TikTokVideoGrid';
import fs from 'fs/promises';
import path from 'path';
import { DateTime } from 'luxon'; // For date handling

// Initialize Apify client
const client = new ApifyClient({ token: process.env.VITE_APIFY_TOKEN });

// Define cache file path
const CACHE_DIR = path.join(process.cwd(), 'cache');
const CACHE_FILE = path.join(CACHE_DIR, 'tiktok_videos.json');

export const loader = async () => {
  try {
    // Log environment variables for debugging
    console.log('VITE_APIFY_TOKEN:', process.env.VITE_APIFY_TOKEN);
    console.log('VITE_TIKTOK_USERNAME:', process.env.VITE_TIKTOK_USERNAME);

    if (!process.env.VITE_APIFY_TOKEN || !process.env.VITE_TIKTOK_USERNAME) {
      throw new Error('Missing API token or TikTok username in environment variables');
    }

    // Ensure cache directory exists
    await fs.mkdir(CACHE_DIR, { recursive: true });

    let cachedData = null;
    try {
      const cacheContent = await fs.readFile(CACHE_FILE, 'utf-8');
      cachedData = JSON.parse(cacheContent);
    } catch (err) {
      console.log('No cache file or invalid cache, fetching new data');
    }

    const currentDate = DateTime.now().setZone('Asia/Tokyo').toISODate(); // Current date in JST
    const shouldFetch = !cachedData || !cachedData.lastUpdated || cachedData.lastUpdated  !== currentDate ;

    let videos = [];
    if (shouldFetch) {
      // Call the tiktok-scraper actor
      const run = await client.actor('clockworks/tiktok-scraper').call({
        profiles: [process.env.VITE_TIKTOK_USERNAME],
        resultsPerPage: 10,
        proxyCountryCode: 'JP',
        shouldDownloadVideos: false,
      });

      console.log('Run details:', JSON.stringify(run, null, 2));

      // Fetch items from the dataset
      const { items } = await client.dataset(run.defaultDatasetId).listItems();
      console.log('Items:', JSON.stringify(items, null, 2));

      // Filter and map to relevant video data (first 5 videos)
      videos = items
        .slice(0, 5)
        .map((item) => ({
          id: item.id,
          text: item.text || 'No description',
          playCount: item.playCount || 0,
          webVideoUrl: item.webVideoUrl || '',
          videoMeta: {
            coverUrl: item.videoMeta?.coverUrl || '',
          },
        }))
        .filter((video) => video.id && video.videoMeta.coverUrl);

      console.log('Processed Videos:', JSON.stringify(videos, null, 2));

      if (videos.length === 0) {
        throw new Error('No videos found for the specified profile');
      }

      // Save to cache
      await fs.writeFile(
        CACHE_FILE,
        JSON.stringify({ videos, lastUpdated: currentDate }, null, 2),
        'utf-8'
      );
    } else {
      videos = cachedData.videos;
      console.log('Using cached data from:', cachedData.lastUpdated);
    }

    return json({ videos });
  } catch (error) {
    console.error('Error fetching or caching TikTok videos:', error.message);
    // If cache exists, use it as fallback
    try {
      const cacheContent = await fs.readFile(CACHE_FILE, 'utf-8');
      const cachedData = JSON.parse(cacheContent);
      return json({ videos: cachedData.videos });
    } catch (cacheErr) {
      return json({
        videos: [],
        error: error.message || 'An unexpected error occurred',
      }, { status: 500 });
    }
  }
};

export default function Index() {
  const { videos, error } = useLoaderData();

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-600">
        Error: {error}
      </div>
    );
  }

  return <VideoGrid videos={videos} />;
}