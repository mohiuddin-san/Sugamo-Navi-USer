
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
const SHOPS_CACHE = path.join(CACHE_DIR, 'shops.json');

export interface Shop {
  id: string;
  name: string;
  address: string;
  location: string;
  description: string;
  all_descriptions: string[];
  images: string[];
  thumbnail: string;
  permalink: string;
  like_count: number;
  comments_count: number;
  posted_at: string;
  hashtags: string[];
}

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

interface InstagramPost {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  caption: string;
  like_count: number;
  comments_count: number;
  permalink: string;
  timestamp: string;
  username?: string;
  children?: { media_url: string; media_type: string }[];
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
function isVideoPost(post: InstagramPost): boolean {
  if (post.media_type === 'VIDEO') return true;
  if (post.media_type === 'CAROUSEL_ALBUM' && post.children) {
    return post.children.some(child => child.media_type === 'VIDEO');
  }
  return false;
}
function extractVideoUrlsFromPost(post: InstagramPost): string[] {
  const urls: string[] = [];

  if (post.media_type === 'VIDEO') {
    if (post.media_url) urls.push(post.media_url);
  }

  if (post.media_type === 'CAROUSEL_ALBUM' && post.children) {
    post.children.forEach(child => {
      if (child.media_type === 'VIDEO' && child.media_url) {
        urls.push(child.media_url);
      }
    });
  }

  return urls;
}
export async function refreshInstagramData() {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  const posts = await fetchInstagramPosts();
  await parseShopsFromPosts(posts);

  console.log(`Instagram থেকে ${posts.length} টি পোস্ট পাওয়া গেছে → shops.json তৈরি হয়ে গেছে`);
  return posts;
}

async function fetchInstagramPosts() {
  let cached: any = null;
  try {
    const data = await fs.readFile(INSTAGRAM_CACHE_FILE, 'utf-8');
    cached = JSON.parse(data);
  } catch { }

  const today = DateTime.now().setZone('Asia/Tokyo').toISODate();
  if (cached?.date === today && cached?.posts?.length > 0) {
    return cached.posts;
  }

  const token = process.env.FB_PAGE_ACCESS_TOKEN;
  const pageId = process.env.FB_PAGE_ID;
  if (!token || !pageId) throw new Error('FB_PAGE_ACCESS_TOKEN or FB_PAGE_ID missing');
  let igId = process.env.IG_USER_ID;
  if (!igId) {
    const res = await fetch(
      `https://graph.facebook.com/v23.0/${pageId}?fields=instagram_business_account&access_token=${token}`
    );
    const json = await res.json();
    igId = json.instagram_business_account?.id;
    if (!igId) throw new Error('Instagram Business Account not connected');
  }

  const fields = 'id,media_type,media_url,thumbnail_url,caption,like_count,comments_count,permalink,timestamp,children{media_url,media_type}';
  const url = `https://graph.facebook.com/v23.0/${igId}/media?fields=${fields}&access_token=${token}&limit=100`;

  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.text();
    throw new Error('Instagram API Error: ' + err);
  }
  const { data } = await res.json();
  const posts = data.map((p: any) => ({
    id: p.id,
    media_type: p.media_type,
    media_url: p.media_url || p.thumbnail_url || '',
    thumbnail_url: p.thumbnail_url || p.media_url || '',
    caption: p.caption || '',
    like_count: p.like_count || 0,
    comments_count: p.comments_count || 0,
    permalink: p.permalink || '',
    timestamp: p.timestamp || '',
    children: p.media_type === 'CAROUSEL_ALBUM' ? p.children?.data : undefined,
  }));
  await fs.writeFile(INSTAGRAM_CACHE_FILE, JSON.stringify({ posts, date: today }, null, 2));
  return posts;
}

function parseCaption(caption: string) {
  const lines = caption.split('\n');
  let name = '', address = '', location = '', description = '';
  const hashtags: string[] = [];

  lines.forEach(line => {
    const trimmed = line.trim();

    if (trimmed.startsWith('📍')) location = trimmed.replace('📍', '').trim();
    if (trimmed.includes('『') && trimmed.includes('』')) {
      name = trimmed.replace(/『|』/g, '').trim();
    }
    if (trimmed.includes('◼︎') || trimmed.includes('住所')) {
      address = trimmed.replace(/◼︎|住所：?/g, '').trim();
    }
    if (trimmed.startsWith('#')) {
      trimmed.split(' ').filter(t => t.startsWith('#') && t.length > 1).forEach(t => hashtags.push(t));
    }
  });

  const infoIndex = lines.findIndex(l => l.includes('お店情報'));
  description = infoIndex !== -1 ? lines.slice(0, infoIndex).join('\n').trim() : caption.split('お店情報')[0]?.trim() || '';

  return {
    name: name || '名前不明',
    address,
    location: location || '巣鴨',
    description,
    hashtags
  };
}
async function createShopsJson(posts: InstagramPost[]) {
  const shopMap = new Map<string, Shop>();

  for (const p of posts) {
    if (!isVideoPost(p)) continue;
    if (!p.caption) continue;
    const info = parseCaption(p.caption);
    if (!info.name || info.name.includes('不明')) continue;
    const key = info.name.trim();
    const videoUrls = extractVideoUrlsFromPost(p);
    if (videoUrls.length === 0) continue;
    const existing = shopMap.get(key);
    if (existing) {
      const uniqueNewVideos = videoUrls.filter(url => !existing.images.includes(url));
      existing.images.push(...uniqueNewVideos);
      if (info.description && info.description.trim()) {
        const cleanDesc = info.description.trim();
        if (!existing.all_descriptions.includes(cleanDesc)) {
          existing.all_descriptions.push(cleanDesc);
        }
      }
      existing.like_count += p.like_count;
      existing.comments_count += p.comments_count;
      info.hashtags.forEach(tag => {
        if (!existing.hashtags.includes(tag)) existing.hashtags.push(tag);
      });
      if (new Date(p.timestamp) > new Date(existing.posted_at)) {
        existing.thumbnail = p.thumbnail_url || videoUrls[0];
        existing.permalink = p.permalink;
        existing.posted_at = p.timestamp;
        existing.address = info.address || existing.address;
        existing.location = info.location || existing.location;
        existing.description = info.description.trim() || existing.description;
      }
    } else {
      shopMap.set(key, {
        id: p.id + "_" + Date.now(),
        name: info.name,
        address: info.address || '',
        location: info.location || '巣鴨',
        description: info.description.trim() || '',
        all_descriptions: info.description.trim() ? [info.description.trim()] : [],
        images: videoUrls, // শুধু ভিডিও URL
        thumbnail: p.thumbnail_url || videoUrls[0],
        permalink: p.permalink,
        like_count: p.like_count,
        comments_count: p.comments_count,
        posted_at: p.timestamp,
        hashtags: info.hashtags || [],
      });
    }
  }

  const shops = Array.from(shopMap.values())
    .sort((a, b) => new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime());

  await fs.writeFile(
    SHOPS_CACHE,
    JSON.stringify({
      generated_at: new Date().toISOString(),
      total_shops: shops.length,
      video_only: true,
      note: "শুধুমাত্র Instagram Reels/Video পোস্ট। ছবি বাদ দেওয়া হয়েছে। একই দোকানের সব ভিডিও মার্জ করা হয়েছে।",
      shops
    }, null, 2)
  );

  console.log(`শুধুমাত্র ${shops.length} টি দোকানের ভিডিও সেভ হয়েছে (ছবি বাদ)!`);
}

function parseShopsFromPosts(posts: any[]) {
  const shops: Shop[] = [];

  for (const p of posts) {
    if (!p.caption) continue;

    const info = parseCaption(p.caption);
    if (!info.name || info.name.includes('不明')) continue;

    const images = [p.media_url];
    if (p.children) {
      p.children.forEach((c: any) => c.media_url && images.push(c.media_url));
    }

    shops.push({
      id: p.id,
      name: info.name,
      address: info.address,
      location: info.location,
      description: info.description,
      images,
      thumbnail: p.thumbnail_url || p.media_url,
      permalink: p.permalink,
      like_count: p.like_count,
      comments_count: p.comments_count,
      all_descriptions: info.description ? [info.description] : [],
      posted_at: p.timestamp,
      hashtags: info.hashtags,
    });
  }

  // shops.json সেভ করো
  fs.writeFile(
    SHOPS_CACHE,
    JSON.stringify({
      generated_at: new Date().toISOString(),
      total_shops: shops.length,
      shops
    }, null, 2)
  );

  return shops;
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

export async function getInstagramVideos(): Promise<InstagramPost[]> {
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
    } catch { }

    const currentDate = DateTime.now().setZone('Asia/Tokyo');
    const currentDateISO = currentDate.toISO(); // এই লাইন যোগ করো

    const cacheExpiryDate = cachedData?.lastUpdated
      ? DateTime.fromISO(cachedData.lastUpdated, { zone: 'Asia/Tokyo' }).plus({ days: 2 })
      : null;

    const shouldFetch = !cachedData
      || !cachedData.lastUpdated
      || !cacheExpiryDate
      || currentDate > cacheExpiryDate;

    let posts: InstagramPost[] = [];

    if (shouldFetch) {

      if (!igUserId) {
        const igResponse = await fetch(
          `https://graph.facebook.com/v23.0/${pageId}?fields=instagram_business_account&access_token=${pageAccessToken}`
        );
        if (!igResponse.ok) throw new Error('Failed to fetch IG User ID');
        const igData = await igResponse.json();
        igUserId = igData.instagram_business_account?.id;
        if (!igUserId) throw new Error('No Instagram Business Account linked');
      }

      const fields = [
        'id', 'media_type', 'media_url', 'thumbnail_url', 'caption',
        'like_count', 'comments_count', 'permalink', 'timestamp', 'username',
        'children{media_url,media_type}'
      ].join(',');

      const mediaResponse = await fetch(
        `https://graph.facebook.com/v23.0/${igUserId}/media?fields=${fields}&access_token=${pageAccessToken}&limit=100`
      );

      if (!mediaResponse.ok) {
        const err = await mediaResponse.text();
        throw new Error(`Failed to fetch Instagram media: ${err}`);
      }

      const mediaData = await mediaResponse.json();

      posts = mediaData.data.map((post: any): InstagramPost => {
        let children: { media_url: string; media_type: string }[] = [];
        if (post.media_type === 'CAROUSEL_ALBUM' && post.children?.data) {
          children = post.children.data.map((child: any) => ({
            media_url: child.media_url || '',
            media_type: child.media_type || 'IMAGE',
          }));
        }

        return {
          id: post.id || '',
          media_type: post.media_type || 'IMAGE',
          media_url: post.media_url || '',
          thumbnail_url: post.thumbnail_url || post.media_url || '',
          caption: post.caption || 'No caption',
          like_count: post.like_count || 0,
          comments_count: post.comments_count || 0,
          permalink: post.permalink || '',
          timestamp: post.timestamp || '',
          username: post.username || '',
          children: children.length > 0 ? children : undefined,
          source: 'instagram' as const,
        };
      });
      await fs.writeFile(
        INSTAGRAM_CACHE_FILE,
        JSON.stringify({ posts, lastUpdated: currentDateISO }, null, 2)
      );
      await createShopsJson(posts);

      console.log(`getInstagramVideos() → instagram_videos.json + shops.json দুটোই তৈরি! (${posts.length} পোস্ট)`);
    } else {
      posts = Array.isArray(cachedData.posts) ? cachedData.posts : [];
    }

    return posts;
  } catch (error) {
    console.error('Instagram fetch error:', error);
    try {
      const cacheContent = await fs.readFile(INSTAGRAM_CACHE_FILE, 'utf-8');
      const cachedData = JSON.parse(cacheContent);
      return Array.isArray(cachedData.posts) ? cachedData.posts : [];
    } catch {
      return [];
    }
  }
}

export function mixVideos(tiktokVideos: Video[] | undefined, instagramVideos: InstagramPost[] | undefined): Array<Video | InstagramPost> {
  const tiktok = Array.isArray(tiktokVideos) ? tiktokVideos : [];
  const instagram = Array.isArray(instagramVideos) ? instagramVideos : [];
  const mixed: Array<Video | InstagramPost> = [];
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
